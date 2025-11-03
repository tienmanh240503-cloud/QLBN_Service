import { ThongBao } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import db from '../configs/connectData.js';

// Tạo thông báo mới
export const createThongBao = async (req, res) => {
    try {
        const { id_nguoi_nhan, tieu_de, noi_dung, loai_thong_bao, id_lien_ket } = req.body;

        if (!id_nguoi_nhan || !tieu_de || !noi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "id_nguoi_nhan, tieu_de và noi_dung là bắt buộc" 
            });
        }

        const Id = `TB_${uuidv4()}`;

        const thongBao = await ThongBao.create({
            id_thong_bao: Id,
            id_nguoi_nhan,
            tieu_de,
            noi_dung,
            loai_thong_bao: loai_thong_bao || 'he_thong',
            id_lien_ket: id_lien_ket || null,
            trang_thai: 'chua_doc'
        });

        return res.status(201).json({ 
            success: true, 
            message: "Tạo thông báo thành công", 
            data: thongBao 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả thông báo của người dùng
export const getThongBaoByNguoiDung = async (req, res) => {
    try {
        const { id_nguoi_dung } = req.params;
        const { trang_thai, limit } = req.query;

        if (!id_nguoi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_nguoi_dung" 
            });
        }

        // Sử dụng raw SQL query để xử lý array
        let sqlQuery = `SELECT * FROM thongbao WHERE id_nguoi_nhan = ?`;
        const values = [id_nguoi_dung];
        
        // Filter theo trạng thái nếu có
        if (trang_thai) {
            sqlQuery += ` AND trang_thai = ?`;
            values.push(trang_thai);
        } else {
            // Mặc định chỉ lấy thông báo chưa đọc và đã đọc (không lấy đã xóa)
            sqlQuery += ` AND trang_thai IN ('chua_doc', 'da_doc')`;
        }

        // Sắp xếp theo thời gian tạo mới nhất trước
        sqlQuery += ` ORDER BY thoi_gian_tao DESC`;

        // Giới hạn số lượng nếu có
        if (limit && !isNaN(parseInt(limit))) {
            sqlQuery += ` LIMIT ?`;
            values.push(parseInt(limit));
        }

        db.query(sqlQuery, values, (err, result) => {
            if (err) {
                console.error("Error fetching thong bao:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server", 
                    error: err.message 
                });
            }

            return res.status(200).json({ 
                success: true, 
                data: result || [] 
            });
        });
    } catch (error) {
        console.error("Error in getThongBaoByNguoiDung:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy số lượng thông báo chưa đọc
export const getUnreadCount = async (req, res) => {
    try {
        const { id_nguoi_dung } = req.params;

        if (!id_nguoi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_nguoi_dung" 
            });
        }

        const sqlQuery = `SELECT COUNT(*) as count FROM thongbao WHERE id_nguoi_nhan = ? AND trang_thai = 'chua_doc'`;
        
        db.query(sqlQuery, [id_nguoi_dung], (err, result) => {
            if (err) {
                console.error("Error fetching unread count:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server", 
                    error: err.message 
                });
            }

            const count = result && result[0] ? result[0].count : 0;
            return res.status(200).json({ 
                success: true, 
                data: { count } 
            });
        });
    } catch (error) {
        console.error("Error in getUnreadCount:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Đánh dấu thông báo là đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { id_thong_bao } = req.params;

        const thongBao = await ThongBao.getById(id_thong_bao);
        if (!thongBao) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy thông báo" 
            });
        }

        const updated = await ThongBao.update({ 
            trang_thai: 'da_doc',
            thoi_gian_doc: new Date().toISOString().slice(0, 19).replace('T', ' ')
        }, id_thong_bao);

        return res.status(200).json({ 
            success: true, 
            message: "Đánh dấu đã đọc thành công", 
            data: updated 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = async (req, res) => {
    try {
        const { id_nguoi_dung } = req.params;

        if (!id_nguoi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_nguoi_dung" 
            });
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const sqlQuery = `UPDATE thongbao SET trang_thai = 'da_doc', thoi_gian_doc = ? WHERE id_nguoi_nhan = ? AND trang_thai = 'chua_doc'`;
        
        db.query(sqlQuery, [now, id_nguoi_dung], (err, result) => {
            if (err) {
                console.error("Error marking all as read:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi server", 
                    error: err.message 
                });
            }

            return res.status(200).json({ 
                success: true, 
                message: "Đánh dấu tất cả đã đọc thành công" 
            });
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa thông báo (đánh dấu là đã xóa)
export const deleteThongBao = async (req, res) => {
    try {
        const { id_thong_bao } = req.params;

        const thongBao = await ThongBao.getById(id_thong_bao);
        if (!thongBao) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy thông báo" 
            });
        }

        await ThongBao.update({ trang_thai: 'da_xoa' }, id_thong_bao);

        return res.status(200).json({ 
            success: true, 
            message: "Xóa thông báo thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy thông báo theo ID
export const getThongBaoById = async (req, res) => {
    try {
        const { id_thong_bao } = req.params;
        const thongBao = await ThongBao.getById(id_thong_bao);
        
        if (!thongBao) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy thông báo" 
            });
        }
        
        return res.status(200).json({ success: true, data: thongBao });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

