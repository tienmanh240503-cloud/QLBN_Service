import { ChiTietHoaDon, HoaDon, DichVu } from "../models/index.js";

// Thêm chi tiết hóa đơn
export const createChiTietHoaDon = async (req, res) => {
    try {
        const { id_hoa_don, id_dich_vu, so_luong, don_gia } = req.body;
        if (!id_hoa_don || !id_dich_vu || !don_gia) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }
        const chiTiet = await ChiTietHoaDon.create({ id_hoa_don, id_dich_vu, so_luong, don_gia });
        return res.status(201).json({ success: true, data: chiTiet });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy chi tiết theo id hóa đơn
export const getChiTietByHoaDon = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const chiTiets = await ChiTietHoaDon.findAll({ id_hoa_don });
        if (!chiTiets || chiTiets.length === 0) {
            return res.status(404).json({ success: false, message: "Không có chi tiết hóa đơn" });
        }

        const results = [];
        for (const ct of chiTiets) {
            const dichVu = await DichVu.findOne({ id_dich_vu: ct.id_dich_vu });
            results.push({
                ...ct,
                dich_vu: dichVu || null
            });
        }

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chi tiết
export const deleteChiTietHoaDon = async (req, res) => {
    try {
        const { id_chi_tiet } = req.params;
        const deleted = await ChiTietHoaDon.delete(id_chi_tiet);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết hóa đơn" });
        return res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
