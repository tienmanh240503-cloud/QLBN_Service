import { Thuoc } from "../models/index.js";

// Tạo thuốc mới
export const createThuoc = async (req, res) => {
    try {
        const { ten_thuoc, hoatchat, hang_bao_che, don_vi_tinh, mo_ta, chong_chi_dinh } = req.body;
        if (!ten_thuoc) {
            return res.status(400).json({ success: false, message: "Tên thuốc là bắt buộc." });
        }
        const thuoc = await Thuoc.create({ ten_thuoc, hoatchat, hang_bao_che, don_vi_tinh, mo_ta, chong_chi_dinh });
        return res.status(201).json({ success: true, message: "Thêm thuốc thành công", data: thuoc });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách thuốc
export const getAllThuoc = async (req, res) => {
    try {
        const thuocs = await Thuoc.getAll("id_thuoc", "ASC");
        return res.status(200).json({ success: true, data: thuocs });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 thuốc theo id
export const getThuocById = async (req, res) => {
    try {
        const { id_thuoc } = req.params;
        const thuoc = await Thuoc.getById(id_thuoc);
        if (!thuoc) return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
        return res.status(200).json({ success: true, data: thuoc });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật thuốc
export const updateThuoc = async (req, res) => {
    try {
        const { id_thuoc } = req.params;
        const thuoc = await Thuoc.getById(id_thuoc);
        if (!thuoc) return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
        const updateThuoc = await Thuoc.updateById(req.body, id_thuoc);
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updateThuoc });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa thuốc
export const deleteThuoc = async (req, res) => {
    try {
        const { id_thuoc } = req.params;
        const thuoc = await Thuoc.getById(id_thuoc);
        if (!thuoc) return res.status(404).json({ success: false, message: "Không tìm thấy thuốc" });
        await Thuoc.deleteById(id_thuoc);
        return res.status(200).json({ success: true, message: "Xóa thuốc thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
