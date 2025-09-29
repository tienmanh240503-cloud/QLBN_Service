import { DichVu } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Thêm dịch vụ
export const createDichVu = async (req, res) => {
    try {
        const { ten_dich_vu, mo_ta, don_gia } = req.body;
        if (!ten_dich_vu || !don_gia) {
            return res.status(400).json({ success: false, message: "Tên dịch vụ và đơn giá là bắt buộc" });
        }

        const Id = `DV_${uuidv4()}`;

        const dichVu = await DichVu.create({ id_dich_vu : Id, ten_dich_vu, mo_ta, don_gia });
        return res.status(201).json({ success: true, data: dichVu });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả dịch vụ
export const getAllDichVu = async (req, res) => {
    try {
        const dichVus = await DichVu.getAll();
        return res.status(200).json({ success: true, data: dichVus });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy dịch vụ theo ID
export const getDichVuById = async (req, res) => {
    try {
        const { id_dich_vu } = req.params;
        const dichVu = await DichVu.getById(id_dich_vu);
        if (!dichVu) {
            return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
        }
        return res.status(200).json({ success: true, data: dichVu });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật dịch vụ
export const updateDichVu = async (req, res) => {
    try {
        const { id_dich_vu } = req.params;
        const updated = await DichVu.update(req.body, id_dich_vu);
        if (!updated) {
            return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
        }
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa dịch vụ
export const deleteDichVu = async (req, res) => {
    try {
        const { id_dich_vu } = req.params;
        const deleted = await DichVu.delete(id_dich_vu);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
        }
        return res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
