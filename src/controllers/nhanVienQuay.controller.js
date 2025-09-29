import { NhanVienQuay } from "../models/index.js";

export const getAllNhanVienQuay = async (req, res) => {
    try {
        const data = await NhanVienQuay.findAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getNhanVienQuayById = async (req, res) => {
    try {
        const { id_nhan_vien_quay } = req.params;
        const nv = await NhanVienQuay.findOne({ id_nhan_vien_quay });
        if (!nv) return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên." });

        res.status(200).json({ success: true, data: nv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const updateNhanVienQuay = async (req, res) => {
    try {
        const { id_nhan_vien_quay } = req.params;
        const dataUpdate = req.body;

        const updated = await NhanVienQuay.update(dataUpdate, id_nhan_vien_quay);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
