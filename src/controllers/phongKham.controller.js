import { PhongKham } from "../models/index.js";
import db from '../configs/connectData.js';

// Lấy tất cả phòng khám, có thể filter theo chuyên khoa
export const getAllPhongKham = async (req, res) => {
    try {
        const { id_chuyen_khoa, trang_thai, search } = req.query;
        
        let query = `
            SELECT 
                pk.id_phong_kham,
                pk.ten_phong,
                pk.so_phong,
                pk.tang,
                pk.id_chuyen_khoa,
                pk.mo_ta,
                pk.trang_thai,
                pk.thiet_bi,
                pk.so_cho_ngoi,
                pk.thoi_gian_tao,
                ck.ten_chuyen_khoa
            FROM phongkham pk
            LEFT JOIN chuyenkhoa ck ON pk.id_chuyen_khoa = ck.id_chuyen_khoa
            WHERE 1=1
        `;
        
        const values = [];
        
        if (id_chuyen_khoa) {
            query += ` AND pk.id_chuyen_khoa = ?`;
            values.push(id_chuyen_khoa);
        }
        
        if (trang_thai) {
            query += ` AND pk.trang_thai = ?`;
            values.push(trang_thai);
        } else {
            // Mặc định chỉ lấy phòng đang hoạt động
            query += ` AND pk.trang_thai = 'HoatDong'`;
        }
        
        if (search) {
            query += ` AND (pk.ten_phong LIKE ? OR pk.so_phong LIKE ? OR ck.ten_chuyen_khoa LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern);
        }
        
        query += ` ORDER BY pk.tang ASC, pk.so_phong ASC`;
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching phong kham:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy phòng khám theo ID
export const getPhongKhamById = async (req, res) => {
    try {
        const { id_phong_kham } = req.params;
        const phongKham = await PhongKham.findOne({ id_phong_kham });
        if (!phongKham) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phòng khám." });
        }

        res.status(200).json({ success: true, data: phongKham });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
