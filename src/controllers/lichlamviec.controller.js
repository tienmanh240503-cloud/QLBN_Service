import { LichLamViec } from "../models/index.js";

// Tạo lịch làm việc mới
export const createLichLamViec = async (req, res) => {
    try {
        const { id_bac_si, id_chuyen_gia, ngay, id_khung_gio } = req.body;
        if (!id_bac_si && !id_chuyen_gia) {
            return res.status(400).json({ success: false, message: "Phải có id_bac_si hoặc id_chuyen_gia." });
        }
        if (!ngay || !id_khung_gio) {
            return res.status(400).json({ success: false, message: "Ngày và khung giờ là bắt buộc." });
        }

        const lich = await LichLamViec.create({ id_bac_si, id_chuyen_gia, ngay, id_khung_gio });
        return res.status(201).json({ success: true, message: "Thêm lịch làm việc thành công", data: lich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả lịch làm việc
export const getAllLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const liches = await LichLamViec.findAll({id_lich_lam_viec});
        return res.status(200).json({ success: true, data: liches });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 lịch làm việc theo id
export const getLichLamViecById = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        return res.status(200).json({ success: true, data: lich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật lịch làm việc
export const updateLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        const updateLich = await LichLamViec.update(req.body, id_lich_lam_viec);
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updateLich });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa lịch làm việc
export const deleteLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const lich = await LichLamViec.getById(id_lich_lam_viec);
        if (!lich) return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        await LichLamViec.delete(id_lich_lam_viec);
        return res.status(200).json({ success: true, message: "Xóa lịch làm việc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
