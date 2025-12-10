import { ChiTietDonThuoc ,Thuoc } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo chi tiết đơn thuốc mới
export const createChiTietDonThuoc = async (req, res) => {
    try {
        const { id_don_thuoc, id_thuoc, so_luong, lieu_dung, tan_suat, thoi_gian_dung, ghi_chu } = req.body;

        if (!id_don_thuoc || !id_thuoc || !so_luong) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc (id_don_thuoc, id_thuoc, so_luong)." });
        }

        const Id = `DDT_${uuidv4()}`;

        const chiTiet = await ChiTietDonThuoc.create({
            id_chi_tiet_don_thuoc : Id, 
            id_don_thuoc, 
            id_thuoc, 
            so_luong, 
            lieu_dung: lieu_dung || '',
            tan_suat: tan_suat || '',
            thoi_gian_dung: thoi_gian_dung || '',
            ghi_chu: ghi_chu || null
        });
        return res.status(201).json({ success: true, message: "Thêm chi tiết đơn thuốc thành công", data: chiTiet });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


// Lấy chi tiết theo ID
export const getChiTietDonThuocById = async (req, res) => {
    try {
        const { id_chi_tiet_don_thuoc } = req.params;

        const chiTiet = await ChiTietDonThuoc.findOne({ id_chi_tiet_don_thuoc });
        if (!chiTiet) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết đơn thuốc" });
        }

        // lấy thêm thông tin thuốc
        const thuoc = await Thuoc.findOne({ id_thuoc: chiTiet.id_thuoc });

        return res.status(200).json({
            success: true,
            data: {
                ...chiTiet,
                thuoc: thuoc || null
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách chi tiết theo id đơn thuốc
export const getChiTietDonThuocByIdDonThuoc = async (req, res) => {
    try {
        const { id_don_thuoc } = req.params;

        const chiTiets = await ChiTietDonThuoc.findAll({ id_don_thuoc });
        if (!chiTiets || chiTiets.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết đơn thuốc" });
        }

        const results = [];
        for (const ct of chiTiets) {
            const thuoc = await Thuoc.findOne({ id_thuoc: ct.id_thuoc });
            results.push({
                ...ct,
                thuoc: thuoc || null
            });
        }

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
// Cập nhật chi tiết đơn thuốc
export const updateChiTietDonThuoc = async (req, res) => {
    try {
        const { id_chi_tiet_don_thuoc } = req.params;
        const chiTiet = await ChiTietDonThuoc.getById(id_chi_tiet_don_thuoc);
        if (!chiTiet) return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết đơn thuốc" });

        const update = await ChiTietDonThuoc.update(req.body, id_chi_tiet_don_thuoc);
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: update });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chi tiết đơn thuốc
export const deleteChiTietDonThuoc = async (req, res) => {
    try {
        const { id_chi_tiet_don_thuoc } = req.params;
        const chiTiet = await ChiTietDonThuoc.getById(id_chi_tiet_don_thuoc);
        if (!chiTiet) return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết đơn thuốc" });

        await ChiTietDonThuoc.delete(id_chi_tiet_don_thuoc);
        return res.status(200).json({ success: true, message: "Xóa chi tiết đơn thuốc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
