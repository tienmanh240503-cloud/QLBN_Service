import { ChuyenGiaDinhDuong, ChuyenNganhDinhDuong, NguoiDung } from "../models/index.js";
import db from "../configs/connectData.js";

export const getAllChuyenGia = async (req, res) => {
    try {
        const data = await ChuyenGiaDinhDuong.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getChuyenGiaById = async (req, res) => {
    try {
        const { id_chuyen_gia } = req.params;
        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia });
        if (!chuyenGia) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên gia." });

        res.status(200).json({ success: true, data: chuyenGia });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const updateChuyenGia = async (req, res) => {
    try {
        const { id_chuyen_gia } = req.params;
        const dataUpdate = req.body;

        const updated = await ChuyenGiaDinhDuong.update(dataUpdate, id_chuyen_gia);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy chuyên gia theo chuyên ngành dinh dưỡng
export const getChuyenGiaByChuyenNganh = async (req, res) => {
    try {
        const { id_chuyen_nganh } = req.params;
        
        if (!id_chuyen_nganh) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_chuyen_nganh" 
            });
        }

        // Query để lấy chuyên gia theo chuyên ngành qua bảng chuyengia_chuyennganhdinhduong
        const query = `
            SELECT 
                cg.id_chuyen_gia,
                cg.hoc_vi,
                cg.so_chung_chi_hang_nghe,
                cg.linh_vuc_chuyen_sau,
                cg.gioi_thieu_ban_than,
                cg.chuc_vu,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                nd.anh_dai_dien,
                nd.gioi_tinh,
                nd.ngay_sinh
            FROM chuyengiadinhduong cg
            INNER JOIN chuyengia_chuyennganhdinhduong cg_cnd 
                ON cg.id_chuyen_gia = cg_cnd.id_chuyen_gia
            INNER JOIN nguoidung nd 
                ON cg.id_chuyen_gia = nd.id_nguoi_dung
            WHERE cg_cnd.id_chuyen_nganh = ?
        `;

        // Thực thi query với Promise
        const results = await new Promise((resolve, reject) => {
            db.query(query, [id_chuyen_nganh], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return res.status(200).json({ 
            success: true, 
            data: results || [] 
        });
        
    } catch (error) {
        console.error("Error in getChuyenGiaByChuyenNganh:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả chuyên ngành dinh dưỡng
export const getAllChuyenNganhDinhDuong = async (req, res) => {
    try {
        const data = await ChuyenNganhDinhDuong.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
