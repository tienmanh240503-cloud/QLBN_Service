import { BacSi, NguoiDung, ChuyenKhoa } from "../models/index.js";
import db from '../configs/connectData.js';

// Lấy tất cả bác sĩ với tên từ NguoiDung, có thể filter theo chuyên khoa
export const getAllBacSi = async (req, res) => {
    try {
        const { id_chuyen_khoa, search } = req.query;
        
        let query = `
            SELECT 
                bs.id_bac_si,
                bs.id_chuyen_khoa,
                bs.chuyen_mon,
                bs.so_giay_phep_hang_nghe,
                bs.gioi_thieu_ban_than,
                bs.so_nam_kinh_nghiem,
                bs.dang_lam_viec,
                bs.chuc_danh,
                bs.chuc_vu,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                ck.ten_chuyen_khoa
            FROM bacsi bs
            INNER JOIN nguoidung nd ON bs.id_bac_si = nd.id_nguoi_dung
            LEFT JOIN chuyenkhoa ck ON bs.id_chuyen_khoa = ck.id_chuyen_khoa
            WHERE bs.dang_lam_viec = 1
        `;
        
        const values = [];
        
        if (id_chuyen_khoa) {
            query += ` AND bs.id_chuyen_khoa = ?`;
            values.push(id_chuyen_khoa);
        }
        
        if (search) {
            query += ` AND (nd.ho_ten LIKE ? OR bs.chuyen_mon LIKE ? OR ck.ten_chuyen_khoa LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern);
        }
        
        query += ` ORDER BY nd.ho_ten ASC`;
        
        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching bac si:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            res.status(200).json({ success: true, data: result });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy bác sĩ theo ID
export const getBacSiById = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ." });

        res.status(200).json({ success: true, data: bacSi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật thông tin bác sĩ
export const updateBacSi = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        const dataUpdate = req.body;

        const updated = await BacSi.update(dataUpdate, id_bac_si);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
