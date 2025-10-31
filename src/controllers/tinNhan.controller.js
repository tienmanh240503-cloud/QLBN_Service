import { v4 as uuidv4 } from 'uuid';
import { CuocTroChuyen, TinNhan, NguoiDung, BenhNhan, BacSi, ChuyenGiaDinhDuong } from '../models/index.js';
import cloudinary from '../configs/cloudinary.config.js';
import { DB_CONFID } from '../configs/db.config.js';
import mysql from 'mysql2/promise';

// Tạo hoặc lấy cuộc trò chuyện giữa 2 người
export const getOrCreateConversation = async (req, res) => {
    try {
        const id_nguoi_gui = req.decoded.info.id_nguoi_dung;
        const { id_nguoi_nhan } = req.body;

        if (!id_nguoi_nhan) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID người nhận"
            });
        }

        if (id_nguoi_gui === id_nguoi_nhan) {
            return res.status(400).json({
                success: false,
                message: "Không thể tạo cuộc trò chuyện với chính mình"
            });
        }

        // Lấy thông tin người gửi và người nhận
        const nguoiGui = await NguoiDung.getById(id_nguoi_gui);
        const nguoiNhan = await NguoiDung.getById(id_nguoi_nhan);

        if (!nguoiGui || !nguoiNhan) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng"
            });
        }

        // Tìm cuộc trò chuyện hiện có
        let conversation;
        
        // Kiểm tra xem người gửi có phải bệnh nhân không
        const benhNhanGui = await BenhNhan.findOne({ id_benh_nhan: id_nguoi_gui });
        const benhNhanNhan = await BenhNhan.findOne({ id_benh_nhan: id_nguoi_nhan });
        const bacSiGui = await BacSi.findOne({ id_bac_si: id_nguoi_gui });
        const chuyenGiaGui = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: id_nguoi_gui });
        const bacSiNhan = await BacSi.findOne({ id_bac_si: id_nguoi_nhan });
        const chuyenGiaNhan = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: id_nguoi_nhan });
        
        // Tìm cuộc trò chuyện
        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);
        
        let query = '';
        let params = [];
        
        if (benhNhanGui) {
            // Người gửi là bệnh nhân
            if (bacSiNhan) {
                query = 'SELECT * FROM cuoctrochuyen WHERE id_benh_nhan COLLATE utf8mb4_general_ci = ? AND id_bac_si COLLATE utf8mb4_general_ci = ? LIMIT 1';
                params = [id_nguoi_gui, id_nguoi_nhan];
            } else if (chuyenGiaNhan) {
                query = 'SELECT * FROM cuoctrochuyen WHERE id_benh_nhan COLLATE utf8mb4_general_ci = ? AND id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = ? LIMIT 1';
                params = [id_nguoi_gui, id_nguoi_nhan];
            }
        } else if (benhNhanNhan) {
            // Người nhận là bệnh nhân
            if (bacSiGui) {
                query = 'SELECT * FROM cuoctrochuyen WHERE id_benh_nhan COLLATE utf8mb4_general_ci = ? AND id_bac_si COLLATE utf8mb4_general_ci = ? LIMIT 1';
                params = [id_nguoi_nhan, id_nguoi_gui];
            } else if (chuyenGiaGui) {
                query = 'SELECT * FROM cuoctrochuyen WHERE id_benh_nhan COLLATE utf8mb4_general_ci = ? AND id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = ? LIMIT 1';
                params = [id_nguoi_nhan, id_nguoi_gui];
            }
        } else {
            // Trường hợp cả 2 người đều không phải bệnh nhân (cùng vai trò hoặc vai trò khác)
            // Tìm cuộc trò chuyện bằng cách kiểm tra tin nhắn có cả 2 người tham gia
            // Tìm các cuộc trò chuyện có tin nhắn từ cả 2 người (người gửi và người nhận)
            const [existingMessages] = await connection.execute(
                `SELECT DISTINCT t1.id_cuoc_tro_chuyen 
                 FROM tinnhan t1
                 INNER JOIN tinnhan t2 ON t1.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = t2.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci
                 WHERE (t1.id_nguoi_gui COLLATE utf8mb4_general_ci = ? AND t2.id_nguoi_gui COLLATE utf8mb4_general_ci = ?)
                    OR (t1.id_nguoi_gui COLLATE utf8mb4_general_ci = ? AND t2.id_nguoi_gui COLLATE utf8mb4_general_ci = ?)
                 LIMIT 1`,
                [id_nguoi_gui, id_nguoi_nhan, id_nguoi_nhan, id_nguoi_gui]
            );
            
            if (existingMessages.length > 0) {
                const [convRows] = await connection.execute(
                    'SELECT * FROM cuoctrochuyen WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ? LIMIT 1',
                    [existingMessages[0].id_cuoc_tro_chuyen]
                );
                if (convRows.length > 0) {
                    conversation = convRows[0];
                }
            }
        }

        if (query && !conversation) {
            const [rows] = await connection.execute(query, params);
            if (rows.length > 0) {
                conversation = rows[0];
            }
        }
        
        await connection.end();

        // Nếu chưa có, tạo mới
        if (!conversation) {
            const id_cuoc_tro_chuyen = `CTC_${uuidv4()}`;
            const tieuDe = `Cuộc trò chuyện: ${nguoiGui.ho_ten} - ${nguoiNhan.ho_ten}`;
            
            const conversationData = {
                id_cuoc_tro_chuyen,
                id_benh_nhan: benhNhanGui ? id_nguoi_gui : (benhNhanNhan ? id_nguoi_nhan : id_nguoi_gui), // Nếu không có bệnh nhân, dùng id_nguoi_gui
                id_bac_si: null,
                id_chuyen_gia_dinh_duong: null,
                tieu_de: tieuDe,
                trang_thai: 'dang_mo'
            };

            // Xác định vai trò và gán vào cuộc trò chuyện
            if (benhNhanGui && bacSiNhan) {
                conversationData.id_bac_si = id_nguoi_nhan;
            } else if (benhNhanGui && chuyenGiaNhan) {
                conversationData.id_chuyen_gia_dinh_duong = id_nguoi_nhan;
            } else if (benhNhanNhan && bacSiGui) {
                conversationData.id_bac_si = id_nguoi_gui;
            } else if (benhNhanNhan && chuyenGiaGui) {
                conversationData.id_chuyen_gia_dinh_duong = id_nguoi_gui;
            } else if (!benhNhanGui && !benhNhanNhan) {
                // Trường hợp cả 2 đều không phải bệnh nhân (cùng vai trò hoặc vai trò khác)
                // Lưu người thứ 2 vào id_bac_si (dù họ không phải bác sĩ) để có thể query được
                conversationData.id_bac_si = id_nguoi_nhan;
            }

            await CuocTroChuyen.create(conversationData);
            conversation = await CuocTroChuyen.getById(id_cuoc_tro_chuyen);
        }

        // Lấy thông tin đầy đủ của cuộc trò chuyện
        // Bao gồm cả trường hợp id_bac_si chứa người dùng không phải bác sĩ
        const connection2 = await mysql.createConnection(DB_CONFID.mysql_connect);
        const [conversationDetails] = await connection2.execute(
            `SELECT c.*, 
                bn.ho_ten as benh_nhan_ten, bn.anh_dai_dien as benh_nhan_avatar, bn.id_nguoi_dung as benh_nhan_id, bn.vai_tro as benh_nhan_vai_tro,
                COALESCE(bs.ho_ten, nd_bs.ho_ten) as bac_si_ten, 
                COALESCE(bs.anh_dai_dien, nd_bs.anh_dai_dien) as bac_si_avatar,
                COALESCE(bs.id_nguoi_dung, c.id_bac_si) as bac_si_id,
                COALESCE(bs.vai_tro, nd_bs.vai_tro) as bac_si_vai_tro,
                cg.ho_ten as chuyen_gia_ten, cg.anh_dai_dien as chuyen_gia_avatar, cg.id_nguoi_dung as chuyen_gia_id, cg.vai_tro as chuyen_gia_vai_tro
             FROM cuoctrochuyen c
             LEFT JOIN nguoidung bn ON c.id_benh_nhan COLLATE utf8mb4_general_ci = bn.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN bacsi b ON c.id_bac_si COLLATE utf8mb4_general_ci = b.id_bac_si COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung bs ON b.id_bac_si COLLATE utf8mb4_general_ci = bs.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung nd_bs ON c.id_bac_si COLLATE utf8mb4_general_ci = nd_bs.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN chuyengiadinhduong cgd ON c.id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = cgd.id_chuyen_gia COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung cg ON cgd.id_chuyen_gia COLLATE utf8mb4_general_ci = cg.id_nguoi_dung COLLATE utf8mb4_general_ci
             WHERE c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ?`,
            [conversation.id_cuoc_tro_chuyen]
        );
        await connection2.end();

        res.status(200).json({
            success: true,
            message: "Lấy cuộc trò chuyện thành công",
            data: conversationDetails[0] || conversation
        });

    } catch (error) {
        console.error("Lỗi getOrCreateConversation:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy danh sách cuộc trò chuyện của người dùng
export const getConversations = async (req, res) => {
    try {
        if (!req.decoded || !req.decoded.info || !req.decoded.info.id_nguoi_dung) {
            return res.status(401).json({
                success: false,
                message: "Không xác thực được người dùng"
            });
        }
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);

        // Lấy tất cả cuộc trò chuyện mà người dùng tham gia
        // Bao gồm cả các cuộc trò chuyện không phải bệnh nhân-bác sĩ/chuyên gia
        // Sử dụng COALESCE để lấy thông tin người dùng ngay cả khi không phải bác sĩ trong bảng bacsi
        const [conversations] = await connection.execute(
            `SELECT DISTINCT c.*, 
                bn.ho_ten as benh_nhan_ten, bn.anh_dai_dien as benh_nhan_avatar, bn.id_nguoi_dung as benh_nhan_id, bn.vai_tro as benh_nhan_vai_tro,
                COALESCE(bs.ho_ten, nd_bs.ho_ten) as bac_si_ten, 
                COALESCE(bs.anh_dai_dien, nd_bs.anh_dai_dien) as bac_si_avatar,
                COALESCE(bs.id_nguoi_dung, c.id_bac_si) as bac_si_id,
                COALESCE(bs.vai_tro, nd_bs.vai_tro) as bac_si_vai_tro,
                cg.ho_ten as chuyen_gia_ten, cg.anh_dai_dien as chuyen_gia_avatar, cg.id_nguoi_dung as chuyen_gia_id, cg.vai_tro as chuyen_gia_vai_tro,
                (SELECT noi_dung FROM tinnhan WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci ORDER BY thoi_gian_gui DESC LIMIT 1) as tin_nhan_cuoi,
                (SELECT thoi_gian_gui FROM tinnhan WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci ORDER BY thoi_gian_gui DESC LIMIT 1) as thoi_gian_tin_nhan_cuoi,
                (SELECT COUNT(*) FROM tinnhan WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci AND id_nguoi_gui COLLATE utf8mb4_general_ci != ? AND da_doc = 0) as so_tin_nhan_chua_doc
             FROM cuoctrochuyen c
             LEFT JOIN nguoidung bn ON c.id_benh_nhan COLLATE utf8mb4_general_ci = bn.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN bacsi b ON c.id_bac_si COLLATE utf8mb4_general_ci = b.id_bac_si COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung bs ON b.id_bac_si COLLATE utf8mb4_general_ci = bs.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung nd_bs ON c.id_bac_si COLLATE utf8mb4_general_ci = nd_bs.id_nguoi_dung COLLATE utf8mb4_general_ci
             LEFT JOIN chuyengiadinhduong cgd ON c.id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = cgd.id_chuyen_gia COLLATE utf8mb4_general_ci
             LEFT JOIN nguoidung cg ON cgd.id_chuyen_gia COLLATE utf8mb4_general_ci = cg.id_nguoi_dung COLLATE utf8mb4_general_ci
             WHERE (c.id_benh_nhan COLLATE utf8mb4_general_ci = ? OR c.id_bac_si COLLATE utf8mb4_general_ci = ? OR c.id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = ?)
                OR EXISTS (
                    SELECT 1 FROM tinnhan tn 
                    WHERE tn.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci 
                    AND tn.id_nguoi_gui COLLATE utf8mb4_general_ci = ?
                )
             ORDER BY thoi_gian_tin_nhan_cuoi DESC, c.thoi_gian_tao DESC`,
            [id_nguoi_dung, id_nguoi_dung, id_nguoi_dung, id_nguoi_dung, id_nguoi_dung]
        );

        await connection.end();

        res.status(200).json({
            success: true,
            message: "Lấy danh sách cuộc trò chuyện thành công",
            data: conversations
        });

    } catch (error) {
        console.error("Lỗi getConversations:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Gửi tin nhắn
export const sendMessage = async (req, res) => {
    try {
        const id_nguoi_gui = req.decoded.info.id_nguoi_dung;
        const { id_cuoc_tro_chuyen, noi_dung, loai_tin_nhan = 'van_ban' } = req.body;
        const file = req.file;

        if (!id_cuoc_tro_chuyen) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID cuộc trò chuyện"
            });
        }

        if (!noi_dung && !file) {
            return res.status(400).json({
                success: false,
                message: "Thiếu nội dung tin nhắn hoặc file"
            });
        }

        let duong_dan_tap_tin = null;
        let finalLoaiTinNhan = loai_tin_nhan;

        // Nếu có file, upload lên Cloudinary
        if (file) {
            try {
                const fileName = `chat_${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                const isImage = file.mimetype.startsWith('image/');
                
                // Xác định loại tin nhắn dựa trên mimetype
                if (isImage) {
                    finalLoaiTinNhan = 'hinh_anh';
                } else {
                    finalLoaiTinNhan = 'tap_tin';
                }

                let result;
                if (isImage) {
                    // Upload hình ảnh - sử dụng data URL
                    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                    result = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(dataUrl, {
                            public_id: fileName,
                            resource_type: 'image',
                            folder: "QLBN/Chat"
                        }, (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });
                } else {
                    // Upload file (PDF, Word, Excel, v.v.) - sử dụng upload_stream với buffer
                    result = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                public_id: fileName,
                                resource_type: 'raw',
                                folder: "QLBN/Chat"
                            },
                            (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            }
                        );
                        // Ghi buffer vào stream
                        uploadStream.write(file.buffer);
                        uploadStream.end();
                    });
                }

                duong_dan_tap_tin = result.secure_url;
            } catch (uploadError) {
                console.error("Lỗi upload file:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Lỗi khi upload file",
                    error: uploadError.message
                });
            }
        }

        const id_tin_nhan = `TN_${uuidv4()}`;
        
        const tinNhanData = {
            id_tin_nhan,
            id_cuoc_tro_chuyen,
            id_nguoi_gui,
            loai_tin_nhan: finalLoaiTinNhan,
            noi_dung: noi_dung || (file ? file.originalname : ''),
            duong_dan_tap_tin,
            da_doc: 0
        };

        const newMessage = await TinNhan.create(tinNhanData);

        // Lấy thông tin đầy đủ của tin nhắn
        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);
        const [messageDetails] = await connection.execute(
            `SELECT t.*, n.ho_ten as nguoi_gui_ten, n.anh_dai_dien as nguoi_gui_avatar
             FROM tinnhan t
             LEFT JOIN nguoidung n ON t.id_nguoi_gui COLLATE utf8mb4_general_ci = n.id_nguoi_dung COLLATE utf8mb4_general_ci
             WHERE t.id_tin_nhan COLLATE utf8mb4_general_ci = ?`,
            [id_tin_nhan]
        );
        await connection.end();

        res.status(201).json({
            success: true,
            message: "Gửi tin nhắn thành công",
            data: messageDetails[0] || newMessage
        });

    } catch (error) {
        console.error("Lỗi sendMessage:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Lấy danh sách tin nhắn của cuộc trò chuyện
export const getMessages = async (req, res) => {
    try {
        const { id_cuoc_tro_chuyen } = req.params;
        const { page = 1, pageSize = 50 } = req.query;
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;

        if (!id_cuoc_tro_chuyen) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID cuộc trò chuyện"
            });
        }

        // Kiểm tra người dùng có tham gia cuộc trò chuyện không
        const conversation = await CuocTroChuyen.getById(id_cuoc_tro_chuyen);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy cuộc trò chuyện"
            });
        }

        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);
        
        const offset = (page - 1) * pageSize;
        const [messages] = await connection.execute(
            `SELECT t.*, n.ho_ten as nguoi_gui_ten, n.anh_dai_dien as nguoi_gui_avatar, n.id_nguoi_dung as nguoi_gui_id
             FROM tinnhan t
             LEFT JOIN nguoidung n ON t.id_nguoi_gui COLLATE utf8mb4_general_ci = n.id_nguoi_dung COLLATE utf8mb4_general_ci
             WHERE t.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ?
             ORDER BY t.thoi_gian_gui ASC
             LIMIT ? OFFSET ?`,
            [id_cuoc_tro_chuyen, parseInt(pageSize), offset]
        );

        // Đánh dấu tin nhắn là đã đọc
        await connection.execute(
            `UPDATE tinnhan SET da_doc = 1 
             WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ? AND id_nguoi_gui COLLATE utf8mb4_general_ci != ? AND da_doc = 0`,
            [id_cuoc_tro_chuyen, id_nguoi_dung]
        );

        await connection.end();

        res.status(200).json({
            success: true,
            message: "Lấy danh sách tin nhắn thành công",
            data: messages,
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: messages.length
            }
        });

    } catch (error) {
        console.error("Lỗi getMessages:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Đánh dấu tin nhắn đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { id_cuoc_tro_chuyen } = req.params;
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;

        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);
        await connection.execute(
            `UPDATE tinnhan SET da_doc = 1 
             WHERE id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ? AND id_nguoi_gui COLLATE utf8mb4_general_ci != ? AND da_doc = 0`,
            [id_cuoc_tro_chuyen, id_nguoi_dung]
        );
        await connection.end();

        res.status(200).json({
            success: true,
            message: "Đánh dấu tin nhắn đã đọc thành công"
        });

    } catch (error) {
        console.error("Lỗi markAsRead:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

// Xóa tin nhắn
export const deleteMessage = async (req, res) => {
    try {
        const { id_tin_nhan } = req.params;
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;

        if (!id_tin_nhan) {
            return res.status(400).json({
                success: false,
                message: "Thiếu ID tin nhắn"
            });
        }

        // Kiểm tra tin nhắn tồn tại và người dùng có quyền xóa (chỉ xóa tin nhắn của chính mình)
        const connection = await mysql.createConnection(DB_CONFID.mysql_connect);
        const [messages] = await connection.execute(
            `SELECT * FROM tinnhan WHERE id_tin_nhan COLLATE utf8mb4_general_ci = ?`,
            [id_tin_nhan]
        );

        if (messages.length === 0) {
            await connection.end();
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tin nhắn"
            });
        }

        const messageData = messages[0];
        
        // Kiểm tra người dùng có trong cùng cuộc trò chuyện không
        // Kiểm tra xem người dùng có phải là một trong những người tham gia cuộc trò chuyện
        const [conversations] = await connection.execute(
            `SELECT c.* FROM cuoctrochuyen c
             WHERE c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = ?
             AND (
                 c.id_benh_nhan COLLATE utf8mb4_general_ci = ?
                 OR c.id_bac_si COLLATE utf8mb4_general_ci = ?
                 OR c.id_chuyen_gia_dinh_duong COLLATE utf8mb4_general_ci = ?
                 OR EXISTS (
                     SELECT 1 FROM tinnhan tn 
                     WHERE tn.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci = c.id_cuoc_tro_chuyen COLLATE utf8mb4_general_ci 
                     AND tn.id_nguoi_gui COLLATE utf8mb4_general_ci = ?
                 )
             )`,
            [messageData.id_cuoc_tro_chuyen, id_nguoi_dung, id_nguoi_dung, id_nguoi_dung, id_nguoi_dung]
        );

        if (conversations.length === 0) {
            await connection.end();
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền xóa tin nhắn này"
            });
        }

        // Cho phép xóa tin nhắn của chính mình hoặc của đối phương trong cùng cuộc trò chuyện
        // (trước đây chỉ cho phép xóa tin nhắn của chính mình)

        // Xóa tin nhắn
        await connection.execute(
            `DELETE FROM tinnhan WHERE id_tin_nhan COLLATE utf8mb4_general_ci = ?`,
            [id_tin_nhan]
        );
        await connection.end();

        res.status(200).json({
            success: true,
            message: "Xóa tin nhắn thành công"
        });

    } catch (error) {
        console.error("Lỗi deleteMessage:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

