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

// Lấy chuyên ngành dinh dưỡng theo ID
export const getChuyenNganhDinhDuongById = async (req, res) => {
    try {
        const { id_chuyen_nganh } = req.params;
        const chuyenNganh = await ChuyenNganhDinhDuong.findOne({ id_chuyen_nganh });
        if (!chuyenNganh) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chuyên ngành dinh dưỡng" });
        }
        res.status(200).json({ success: true, data: chuyenNganh });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Tạo chuyên ngành dinh dưỡng mới
export const createChuyenNganhDinhDuong = async (req, res) => {
    try {
        const { ten_chuyen_nganh, mo_ta, hinh_anh, doi_tuong_phuc_vu, thoi_gian_hoat_dong } = req.body;

        if (!ten_chuyen_nganh) {
            return res.status(400).json({ success: false, message: "Tên chuyên ngành là bắt buộc" });
        }

        const { v4: uuidv4 } = await import('uuid');
        const id_chuyen_nganh = `CN_${uuidv4()}`;

        const chuyenNganh = await ChuyenNganhDinhDuong.create({
            id_chuyen_nganh,
            ten_chuyen_nganh,
            mo_ta: mo_ta || null,
            hinh_anh: hinh_anh || null,
            doi_tuong_phuc_vu: doi_tuong_phuc_vu || null,
            thoi_gian_hoat_dong: thoi_gian_hoat_dong || null
        });

        res.status(201).json({ success: true, message: "Tạo chuyên ngành dinh dưỡng thành công", data: chuyenNganh });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật chuyên ngành dinh dưỡng
export const updateChuyenNganhDinhDuong = async (req, res) => {
    try {
        const { id_chuyen_nganh } = req.params;
        const updateData = req.body;

        const chuyenNganh = await ChuyenNganhDinhDuong.findOne({ id_chuyen_nganh });
        if (!chuyenNganh) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chuyên ngành dinh dưỡng" });
        }

        const updated = await ChuyenNganhDinhDuong.update(updateData, id_chuyen_nganh);
        res.status(200).json({ success: true, message: "Cập nhật chuyên ngành dinh dưỡng thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chuyên ngành dinh dưỡng
export const deleteChuyenNganhDinhDuong = async (req, res) => {
    try {
        const { id_chuyen_nganh } = req.params;

        const chuyenNganh = await ChuyenNganhDinhDuong.findOne({ id_chuyen_nganh });
        if (!chuyenNganh) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chuyên ngành dinh dưỡng" });
        }

        await ChuyenNganhDinhDuong.delete(id_chuyen_nganh);
        res.status(200).json({ success: true, message: "Xóa chuyên ngành dinh dưỡng thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};