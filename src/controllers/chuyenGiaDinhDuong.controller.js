import { ChuyenGiaDinhDuong } from "../models/index.js";

export const getAllChuyenGia = async (req, res) => {
    try {
        const data = await ChuyenGiaDinhDuong.findAll();
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
