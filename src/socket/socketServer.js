import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { poolPromise } from '../configs/connectData.js';
import { verifyAccessToken } from '../utils/auth.js';

// Store active users: { userId: socketId }
const activeUsers = new Map();
// Store user rooms: { userId: Set<conversationIds> }
const userRooms = new Map();
// Track active calls by conversationId
const activeCalls = new Map();
// Track which call a user is currently in
const userCallMap = new Map();

const buildUserSummary = (socket) => ({
    id: socket.userId,
    name: socket.userInfo?.ho_ten || socket.userInfo?.email || socket.userInfo?.ten_dang_nhap || 'Người dùng',
    avatar: socket.userInfo?.anh_dai_dien || null,
    role: socket.userInfo?.vai_tro || null
});

const CALL_STATUS = {
    RINGING: 'dang_goi',
    ACTIVE: 'dang_noi',
    REJECTED: 'bi_tu_choi',
    CANCELLED: 'bi_huy',
    ENDED: 'hoan_thanh',
    FAILED: 'that_bai'
};

const toSqlTimestamp = (date = new Date()) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 19).replace('T', ' ');
};

const createCallHistoryRecord = async ({
    callId,
    conversationId,
    initiatorId,
    expectedReceiverId,
    note
}) => {
    if (!callId || !conversationId || !initiatorId) {
        return;
    }
    const connection = await poolPromise.getConnection();
    try {
        await connection.execute(
            `INSERT INTO lichsucuocgoi (
                id_cuoc_goi,
                id_cuoc_tro_chuyen,
                nguoi_khoi_tao,
                nguoi_nhan_du_kien,
                trang_thai,
                thoi_gian_khoi_tao,
                ghi_chu
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                callId,
                conversationId,
                initiatorId,
                expectedReceiverId || null,
                CALL_STATUS.RINGING,
                toSqlTimestamp(),
                note || null
            ]
        );
    } catch (error) {
        console.error('createCallHistoryRecord error:', error);
    } finally {
        connection.release();
    }
};

const updateCallHistoryRecord = async (callId, fields = {}) => {
    if (!callId || !fields || Object.keys(fields).length === 0) {
        return;
    }
    const connection = await poolPromise.getConnection();
    try {
        const updates = [];
        const values = [];

        Object.entries(fields).forEach(([key, value]) => {
            if (value === undefined) {
                return;
            }
            if (key.startsWith('thoi_gian') && value instanceof Date) {
                value = toSqlTimestamp(value);
            }
            updates.push(`${key} = ?`);
            values.push(value);
        });

        if (updates.length === 0) {
            return;
        }

        values.push(callId);
        await connection.execute(
            `UPDATE lichsucuocgoi SET ${updates.join(', ')} WHERE id_cuoc_goi = ?`,
            values
        );
    } catch (error) {
        console.error('updateCallHistoryRecord error:', error);
    } finally {
        connection.release();
    }
};

const insertCallSystemMessage = async (conversationId, senderId, content) => {
    if (!conversationId || !senderId || !content) {
        return;
    }
    const connection = await poolPromise.getConnection();
    try {
        const id_tin_nhan = `TN_${uuidv4()}`;
        await connection.execute(
            `INSERT INTO tinnhan (
                id_tin_nhan,
                id_cuoc_tro_chuyen,
                id_nguoi_gui,
                loai_tin_nhan,
                noi_dung,
                duong_dan_tap_tin,
                thoi_gian_gui,
                da_doc
            ) VALUES (?, ?, ?, 'van_ban', ?, NULL, ?, 0)`,
            [id_tin_nhan, conversationId, senderId, content, toSqlTimestamp()]
        );
    } catch (error) {
        console.error('insertCallSystemMessage error:', error);
    } finally {
        connection.release();
    }
};

const registerNewCall = (conversationId, callId, initiatorId) => {
    const state = {
        callId,
        initiatorId,
        participants: new Set([initiatorId]),
        startedAt: Date.now()
    };
    activeCalls.set(conversationId, state);
    userCallMap.set(initiatorId, { conversationId, callId });
    return state;
};

const attachUserToCall = (conversationId, callId, userId) => {
    const state = activeCalls.get(conversationId);
    if (!state || state.callId !== callId) {
        return null;
    }
    state.participants.add(userId);
    userCallMap.set(userId, { conversationId, callId });
    return state;
};

const finalizeCall = (conversationId) => {
    const state = activeCalls.get(conversationId);
    if (!state) {
        return null;
    }
    activeCalls.delete(conversationId);
    state.participants.forEach((participantId) => {
        const joinedCall = userCallMap.get(participantId);
        if (joinedCall && joinedCall.conversationId === conversationId) {
            userCallMap.delete(participantId);
        }
    });
    return state;
};

/**
 * Initialize Socket.IO server
 * @param {http.Server} httpServer - HTTP server instance
 * @returns {Server} Socket.IO server instance
 */
export const initializeSocketIO = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        },
        transports: ['websocket', 'polling']
    });

    // Authentication middleware for Socket.IO
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                return next(new Error('Authentication error: No token provided'));
            }

            // Verify JWT token using the same function as REST API
            const decoded = verifyAccessToken(token);
            
            if (!decoded || !decoded.info || !decoded.info.id_nguoi_dung) {
                return next(new Error('Authentication error: Invalid token'));
            }

            // Attach user info to socket
            socket.userId = decoded.info.id_nguoi_dung;
            socket.userInfo = decoded.info;
            
            next();
        } catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication error: ' + error.message));
        }
    });

    io.on('connection', async (socket) => {
        const userId = socket.userId;
        console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

        // Store active user
        activeUsers.set(userId, socket.id);
        
        // Join user's personal room
        socket.join(`user_${userId}`);

        // Load user's conversations and join their rooms
        try {
            const connection = await poolPromise.getConnection();
            try {
                const [conversations] = await connection.execute(
                    `SELECT DISTINCT id_cuoc_tro_chuyen 
                     FROM cuoctrochuyen c
                     WHERE c.id_benh_nhan COLLATE utf8mb4_general_ci = ? 
                        OR c.id_bac_si COLLATE utf8mb4_general_ci = ? 
                        OR c.id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = ?
                        OR EXISTS (
                            SELECT 1 FROM tinnhan tn 
                            WHERE tn.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci 
                            AND tn.id_nguoi_gui COLLATE utf8mb4_general_ci = ?
                        )`,
                    [userId, userId, userId, userId]
                );

                // Join all conversation rooms
                const userConversationIds = new Set();
                conversations.forEach(conv => {
                    const convId = conv.id_cuoc_tro_chuyen;
                    socket.join(`conversation_${convId}`);
                    userConversationIds.add(convId);
                });
                userRooms.set(userId, userConversationIds);
            } finally {
                connection.release(); // Trả connection về pool
            }

            // Notify user is online
            socket.broadcast.emit('user_online', { userId });
        } catch (error) {
            console.error('Error loading user conversations:', error);
        }

        // Handle joining a conversation
        socket.on('join_conversation', async (data) => {
            const { conversationId } = data;
            if (conversationId) {
                socket.join(`conversation_${conversationId}`);
                if (!userRooms.has(userId)) {
                    userRooms.set(userId, new Set());
                }
                userRooms.get(userId).add(conversationId);
                console.log(`User ${userId} joined conversation ${conversationId}`);
            }
        });

        // Handle leaving a conversation
        socket.on('leave_conversation', (data) => {
            const { conversationId } = data;
            if (conversationId) {
                socket.leave(`conversation_${conversationId}`);
                if (userRooms.has(userId)) {
                    userRooms.get(userId).delete(conversationId);
                }
                console.log(`User ${userId} left conversation ${conversationId}`);
            }
        });

        // Handle typing indicator
        socket.on('typing', (data) => {
            const { conversationId, isTyping } = data;
            socket.to(`conversation_${conversationId}`).emit('user_typing', {
                userId,
                conversationId,
                isTyping,
                userInfo: socket.userInfo
            });
        });

        // Handle message read status
        socket.on('mark_read', async (data) => {
            const { conversationId } = data;
            try {
                const connection = await poolPromise.getConnection();
                try {
                    await connection.execute(
                        `UPDATE tinnhan SET da_doc = 1 
                         WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ? 
                         AND id_nguoi_gui COLLATE utf8mb4_general_ci != ? 
                         AND da_doc = 0`,
                        [conversationId, userId]
                    );
                } finally {
                    connection.release(); // Trả connection về pool
                }

                // Notify other users in conversation
                socket.to(`conversation_${conversationId}`).emit('messages_read', {
                    conversationId,
                    userId
                });
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        });

        // Handle video call offer
        socket.on('video_call_offer', async (payload = {}) => {
            try {
                const { conversationId, callId, offer, metadata = {} } = payload;
                if (!conversationId || !offer) {
                    return socket.emit('video_call_error', {
                        conversationId,
                        callId,
                        reason: 'invalid_payload'
                    });
                }

                if (activeCalls.has(conversationId)) {
                    return socket.emit('video_call_busy', { conversationId });
                }

                const generatedCallId = callId || `CALL_${Date.now()}`;
                registerNewCall(conversationId, generatedCallId, userId);

                const callerInfo = buildUserSummary(socket);
                socket.join(`conversation_${conversationId}`);

                const requestedTargetId = metadata?.calleeId || null;
                let resolvedTargetUserId = null;

                const basePayload = {
                    conversationId,
                    callId: generatedCallId,
                    offer,
                    callerId: userId,
                    callerInfo,
                    metadata,
                    timestamp: new Date().toISOString(),
                    targetUserId: requestedTargetId,
                    resolvedTargetUserId: null
                };

                if (requestedTargetId && activeUsers.has(requestedTargetId)) {
                    resolvedTargetUserId = requestedTargetId;
                    io.to(`user_${requestedTargetId}`).emit('video_call_offer', {
                        ...basePayload,
                        resolvedTargetUserId
                    });
                }

                socket.to(`conversation_${conversationId}`).emit('video_call_offer', {
                    ...basePayload,
                    resolvedTargetUserId
                });

                await createCallHistoryRecord({
                    callId: generatedCallId,
                    conversationId,
                    initiatorId: userId,
                    expectedReceiverId: requestedTargetId,
                    note: metadata?.calleeName
                        ? `Gọi đến ${metadata.calleeName}`
                        : null
                });

                const callerName = callerInfo.name || socket.userInfo?.ho_ten || 'Người dùng';
                await insertCallSystemMessage(
                    conversationId,
                    userId,
                    `${callerName} đã bắt đầu một cuộc gọi video.`
                );

                socket.emit('video_call_offer_ack', {
                    conversationId,
                    callId: generatedCallId
                });
            } catch (error) {
                console.error('video_call_offer error:', error);
                socket.emit('video_call_error', {
                    conversationId: payload?.conversationId,
                    callId: payload?.callId,
                    reason: 'server_error'
                });
            }
        });

        // Handle video call answer
        socket.on('video_call_answer', async (payload = {}) => {
            const { conversationId, callId, answer } = payload;
            if (!conversationId || !callId || !answer) {
                return socket.emit('video_call_error', {
                    conversationId,
                    callId,
                    reason: 'invalid_payload'
                });
            }

            const state = attachUserToCall(conversationId, callId, userId);
            if (!state) {
                return socket.emit('video_call_error', {
                    conversationId,
                    callId,
                    reason: 'call_not_found'
                });
            }

            const calleeInfo = buildUserSummary(socket);
            await updateCallHistoryRecord(callId, {
                trang_thai: CALL_STATUS.ACTIVE,
                nguoi_nhan_thuc_te: userId,
                thoi_gian_tra_loi: new Date(),
                ly_do_ket_thuc: null
            });
            await insertCallSystemMessage(
                conversationId,
                userId,
                `${calleeInfo.name || 'Người dùng'} đã tham gia cuộc gọi video.`
            );
            socket.to(`conversation_${conversationId}`).emit('video_call_answer', {
                conversationId,
                callId,
                answer,
                calleeId: userId,
                calleeInfo,
                timestamp: new Date().toISOString()
            });
        });

        // Handle ICE candidate
        socket.on('video_call_ice_candidate', (payload = {}) => {
            const { conversationId, callId, candidate } = payload;
            if (!conversationId || !callId || !candidate) {
                return;
            }
            socket.to(`conversation_${conversationId}`).emit('video_call_ice_candidate', {
                conversationId,
                callId,
                candidate,
                from: userId
            });
        });

        // Handle call rejection (callee)
        socket.on('video_call_reject', async (payload = {}) => {
            const { conversationId, callId, reason = 'rejected' } = payload;
            if (!conversationId || !callId) {
                return;
            }
            const currentCall = activeCalls.get(conversationId);
            if (!currentCall || currentCall.callId !== callId) {
                return;
            }
            await updateCallHistoryRecord(callId, {
                trang_thai: CALL_STATUS.REJECTED,
                thoi_gian_ket_thuc: new Date(),
                ly_do_ket_thuc: reason,
                nguoi_nhan_thuc_te: userId
            });
            await insertCallSystemMessage(
                conversationId,
                userId,
                `${socket.userInfo?.ho_ten || 'Người dùng'} đã từ chối cuộc gọi video.`
            );
            finalizeCall(conversationId);
            socket.to(`conversation_${conversationId}`).emit('video_call_rejected', {
                conversationId,
                callId,
                reason,
                userId,
                timestamp: new Date().toISOString()
            });
        });

        // Handle caller cancel before answer
        socket.on('video_call_cancel', async (payload = {}) => {
            const { conversationId, callId, reason = 'cancelled' } = payload;
            if (!conversationId || !callId) {
                return;
            }

            const currentCall = activeCalls.get(conversationId);
            if (!currentCall || currentCall.callId !== callId) {
                return;
            }

            await updateCallHistoryRecord(callId, {
                trang_thai: CALL_STATUS.CANCELLED,
                thoi_gian_ket_thuc: new Date(),
                ly_do_ket_thuc: reason
            });
            await insertCallSystemMessage(
                conversationId,
                userId,
                `${socket.userInfo?.ho_ten || 'Người dùng'} đã huỷ cuộc gọi video.`
            );
            finalizeCall(conversationId);
            socket.to(`conversation_${conversationId}`).emit('video_call_cancelled', {
                conversationId,
                callId,
                reason,
                userId,
                timestamp: new Date().toISOString()
            });
        });

        // Handle in-progress call end
        socket.on('video_call_end', async (payload = {}) => {
            const { conversationId, callId, reason = 'ended' } = payload;
            if (!conversationId || !callId) {
                return;
            }

            const currentCall = activeCalls.get(conversationId);
            if (!currentCall || currentCall.callId !== callId) {
                return;
            }

            await updateCallHistoryRecord(callId, {
                trang_thai: CALL_STATUS.ENDED,
                thoi_gian_ket_thuc: new Date(),
                ly_do_ket_thuc: reason
            });
            await insertCallSystemMessage(
                conversationId,
                userId,
                `Cuộc gọi video đã kết thúc${reason ? ` (${reason})` : ''}.`
            );
            finalizeCall(conversationId);
            io.to(`conversation_${conversationId}`).emit('video_call_ended', {
                conversationId,
                callId,
                reason,
                endedBy: userId,
                timestamp: new Date().toISOString()
            });
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);

            const ongoingCall = userCallMap.get(userId);
            if (ongoingCall) {
                await updateCallHistoryRecord(ongoingCall.callId, {
                    trang_thai: CALL_STATUS.FAILED,
                    thoi_gian_ket_thuc: new Date(),
                    ly_do_ket_thuc: 'peer_disconnected'
                });
                await insertCallSystemMessage(
                    ongoingCall.conversationId,
                    userId,
                    'Cuộc gọi video kết thúc do một bên rời khỏi cuộc trò chuyện.'
                );
                finalizeCall(ongoingCall.conversationId);
                io.to(`conversation_${ongoingCall.conversationId}`).emit('video_call_ended', {
                    conversationId: ongoingCall.conversationId,
                    callId: ongoingCall.callId,
                    reason: 'peer_disconnected',
                    endedBy: userId,
                    timestamp: new Date().toISOString()
                });
                userCallMap.delete(userId);
            }

            activeUsers.delete(userId);
            userRooms.delete(userId);
            
            // Notify user is offline
            socket.broadcast.emit('user_offline', { userId });
        });
    });

    return io;
};

/**
 * Emit new message to conversation participants
 * @param {Server} io - Socket.IO server instance
 * @param {Object} messageData - Message data to emit
 */
export const emitNewMessage = (io, messageData) => {
    if (!io || !messageData) return;
    
    const { id_cuoc_tro_chuyen, ...message } = messageData;
    
    // Emit to all users in the conversation room
    io.to(`conversation_${id_cuoc_tro_chuyen}`).emit('new_message', {
        ...message,
        id_cuoc_tro_chuyen
    });

    // Also emit to user's personal room for notifications
    io.to(`user_${message.id_nguoi_gui}`).emit('message_sent', {
        ...message,
        id_cuoc_tro_chuyen
    });
};

/**
 * Emit message deleted event
 * @param {Server} io - Socket.IO server instance
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID that was deleted
 */
export const emitMessageDeleted = (io, conversationId, messageId) => {
    if (!io || !conversationId || !messageId) return;
    
    io.to(`conversation_${conversationId}`).emit('message_deleted', {
        conversationId,
        messageId
    });
};

/**
 * Emit conversation updated event
 * @param {Server} io - Socket.IO server instance
 * @param {string} conversationId - Conversation ID
 * @param {Object} conversationData - Updated conversation data
 */
export const emitConversationUpdated = (io, conversationId, conversationData) => {
    if (!io || !conversationId) return;
    
    io.to(`conversation_${conversationId}`).emit('conversation_updated', {
        conversationId,
        ...conversationData
    });
};

/**
 * Get active users count
 * @returns {number}
 */
export const getActiveUsersCount = () => {
    return activeUsers.size;
};

/**
 * Check if user is online
 * @param {string} userId - User ID
 * @returns {boolean}
 */
export const isUserOnline = (userId) => {
    return activeUsers.has(userId);
};

