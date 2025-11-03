import { ThucDonChiTiet, LichSuTuVan } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Tạo mới thực đơn chi tiết
export const createThucDonChiTiet = async (req, res) => {
    try {
        const {
            id_lich_su,
            bua_an,
            ten_mon,
            khoi_luong,
            calo,
            protein,
            carb,
            fat,
            fiber,
            ghi_chu,
            thoi_gian_an,
            thu_tu
        } = req.body;

        if (!id_lich_su || !bua_an || !ten_mon) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc: id_lich_su, bua_an, ten_mon." });
        }

        // Check lịch sử tư vấn tồn tại
        const lichSu = await LichSuTuVan.findOne({ id_lich_su });
        if (!lichSu) return res.status(404).json({ success: false, message: "Lịch sử tư vấn không tồn tại." });

        const id_thuc_don = `TDC_${uuidv4()}`;

        const thucDon = await ThucDonChiTiet.create({
            id_thuc_don,
            id_lich_su,
            bua_an,
            ten_mon,
            khoi_luong,
            calo,
            protein,
            carb,
            fat,
            fiber,
            ghi_chu,
            thoi_gian_an,
            thu_tu: thu_tu || 0
        });

        res.status(201).json({ success: true, message: "Tạo thực đơn chi tiết thành công.", data: thucDon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy thực đơn chi tiết theo ID
export const getThucDonChiTietById = async (req, res) => {
    try {
        const { id_thuc_don } = req.params;
        const thucDon = await ThucDonChiTiet.getById(id_thuc_don);
        if (!thucDon) return res.status(404).json({ success: false, message: "Không tìm thấy thực đơn chi tiết." });

        res.status(200).json({ success: true, data: thucDon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy tất cả thực đơn chi tiết theo lịch sử tư vấn
export const getThucDonChiTietByLichSu = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const thucDon = await ThucDonChiTiet.findAll({ id_lich_su });
        res.status(200).json({ success: true, data: thucDon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy thực đơn chi tiết theo bữa ăn
export const getThucDonChiTietByBuaAn = async (req, res) => {
    try {
        const { id_lich_su, bua_an } = req.params;
        const thucDon = await ThucDonChiTiet.findAll({ id_lich_su, bua_an });
        res.status(200).json({ success: true, data: thucDon });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật thực đơn chi tiết
export const updateThucDonChiTiet = async (req, res) => {
    try {
        const { id_thuc_don } = req.params;
        const dataUpdate = req.body;
        const updated = await ThucDonChiTiet.update(dataUpdate, id_thuc_don);

        res.status(200).json({ success: true, message: "Cập nhật thành công.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa thực đơn chi tiết
export const deleteThucDonChiTiet = async (req, res) => {
    try {
        const { id_thuc_don } = req.params;
        await ThucDonChiTiet.delete(id_thuc_don);
        res.status(200).json({ success: true, message: "Xóa thực đơn chi tiết thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa tất cả thực đơn chi tiết theo lịch sử tư vấn
export const deleteThucDonChiTietByLichSu = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const allThucDon = await ThucDonChiTiet.findAll({ id_lich_su });
        
        for (const td of allThucDon) {
            await ThucDonChiTiet.delete(td.id_thuc_don);
        }
        
        res.status(200).json({ success: true, message: "Xóa tất cả thực đơn chi tiết thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

