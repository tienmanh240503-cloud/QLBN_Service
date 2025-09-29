import { NhanVienPhanCong } from "../models/index.js";

export const getAllNhanVienPhanCong = async (req, res) => {
    try {
        const data = await NhanVienPhanCong.findAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getNhanVienPhanCongById = async (req, res) => {
    try {
        const { id_nhan_vien_phan_cong } = req.params;
        const nv = await NhanVienPhanCong.findOne({ id_nhan_vien_phan_cong });
        if (!nv) return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên." });

        res.status(200).json({ success: true, data: nv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const updateNhanVienPhanCong = async (req, res) => {
    try {
        const { id_nhan_vien_phan_cong } = req.params;
        const dataUpdate = req.body;

        const updated = await NhanVienPhanCong.update(dataUpdate, id_nhan_vien_phan_cong);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
