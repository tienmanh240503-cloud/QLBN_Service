import { KhungGioKham } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo khung giờ khám mới
export const createKhungGioKham = async (req, res) => {
    try {
        const { gio_bat_dau, gio_ket_thuc, mo_ta, ca } = req.body;

        if (!gio_bat_dau || !gio_ket_thuc || !ca) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        const Id = `KG_${uuidv4()}`;

        const khungGio = await KhungGioKham.create({ id_khung_gio : Id, gio_bat_dau, gio_ket_thuc, mo_ta : mo_ta || null, ca });

        return res.status(201).json({ success: true, message: "Tạo khung giờ khám thành công", data: khungGio });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách tất cả khung giờ khám (có thể lọc theo ca)
export const getAllKhungGioKham = async (req, res) => {
    try {
        const { ca } = req.query; // optional filter
        let khungGios;
        if (ca) {
            khungGios = await KhungGioKham.findAll({ca});
        } else {
            khungGios = await KhungGioKham.getAll();
        }
        return res.status(200).json({ success: true, data: khungGios });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 khung giờ theo ID
export const getKhungGioById = async (req, res) => {
    try {
        const { id_khung_gio } = req.params;
        const khungGio = await KhungGioKham.getById(id_khung_gio);
        if (!khungGio) return res.status(404).json({ success: false, message: "Không tìm thấy khung giờ" });
        return res.status(200).json({ success: true, data: khungGio });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật khung giờ
export const updateKhungGioKham = async (req, res) => {
    try {
        const { id_khung_gio } = req.params;
        const khungGio = await KhungGioKham.getById(id_khung_gio);
        if (!khungGio) return res.status(404).json({ success: false, message: "Không tìm thấy khung giờ" });

        const updated = await KhungGioKham.update(req.body, id_khung_gio);
        return res.status(200).json({ success: true, message: "Cập nhật khung giờ thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa khung giờ
export const deleteKhungGioKham = async (req, res) => {
    try {
        const { id_khung_gio } = req.params;
        const khungGio = await KhungGioKham.getById(id_khung_gio);
        if (!khungGio) return res.status(404).json({ success: false, message: "Không tìm thấy khung giờ" });

        await KhungGioKham.delete(id_khung_gio);
        return res.status(200).json({ success: true, message: "Xóa khung giờ thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
