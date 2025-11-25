import { Server } from 'socket.io';
import { poolPromise } from '../configs/connectData.js';
import { verifyAccessToken } from '../utils/auth.js';

// Store active users: { userId: socketId }
const activeUsers = new Map();
// Store user rooms: { userId: Set<conversationIds> }
const userRooms = new Map();

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

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId} (Socket ID: ${socket.id})`);
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

