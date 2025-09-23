import { ChuyenKhoa } from "../models/index.js";

// Tạo chuyên khoa mới
export const createChuyenKhoa = async (req, res) => {
    try {
        const { ten_chuyen_khoa, mo_ta } = req.body;
        if (!ten_chuyen_khoa) {
            return res.status(400).json({ success: false, message: "Tên chuyên khoa là bắt buộc." });
        }
        const ck = await ChuyenKhoa.create({ ten_chuyen_khoa, mo_ta });
        return res.status(201).json({ success: true, message: "Thêm chuyên khoa thành công", data: ck });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách chuyên khoa
export const getAllChuyenKhoa = async (req, res) => {
    try {
        const cks = await ChuyenKhoa.getAll();
        return res.status(200).json({ success: true, data: cks });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 chuyên khoa theo id
export const getChuyenKhoaById = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });
        return res.status(200).json({ success: true, data: ck });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật chuyên khoa
export const updateChuyenKhoa = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });
        const updateCK = await ChuyenKhoa.update(req.body, id_chuyen_khoa);
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updateCK });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chuyên khoa
export const deleteChuyenKhoa = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });
        await ChuyenKhoa.delete(id_chuyen_khoa);
        return res.status(200).json({ success: true, message: "Xóa chuyên khoa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
