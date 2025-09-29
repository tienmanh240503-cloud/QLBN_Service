import { BenhNhan } from "../models/index.js";

// Lấy thông tin bệnh nhân theo ID
export const getBenhNhanById = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });

        if (!benhNhan) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân." });

        res.status(200).json({ success: true, data: benhNhan });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả bệnh nhân
export const getAllBenhNhan = async (req, res) => {
    try {
        const benhNhans = await BenhNhan.findAll();
        res.status(200).json({ success: true, data: benhNhans });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật profile bệnh nhân
export const updateBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const dataUpdate = req.body;

        const updated = await BenhNhan.update(dataUpdate, id_benh_nhan );
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân để cập nhật." });
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

