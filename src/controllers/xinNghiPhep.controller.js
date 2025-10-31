import { XinNghiPhep } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo đơn xin nghỉ phép
export const createXinNghiPhep = async (req, res) => {
    try {
        const { id_nguoi_dung, ngay_bat_dau, ngay_ket_thuc, ly_do, trang_thai } = req.body;

        if (!id_nguoi_dung || !ngay_bat_dau || !ngay_ket_thuc || !ly_do) {
            return res.status(400).json({ 
                success: false, 
                message: "id_nguoi_dung, ngay_bat_dau, ngay_ket_thuc và ly_do là bắt buộc" 
            });
        }

        // Validate id_nguoi_dung format (should start with BS_, YT_, QL_, or AD_)
        const validPrefixes = ['BS_', 'YT_', 'QL_', 'AD_'];
        const isValidId = validPrefixes.some(prefix => id_nguoi_dung.startsWith(prefix));
        
        if (!isValidId) {
            return res.status(400).json({ 
                success: false, 
                message: "ID người dùng không hợp lệ. Chỉ hỗ trợ bác sĩ, y tá, quản lý và admin" 
            });
        }

        const Id = `XN_${uuidv4()}`;

        const xinNghiPhep = await XinNghiPhep.create({
            id_xin_nghi: Id,
            id_nguoi_dung: id_nguoi_dung,
            ngay_bat_dau,
            ngay_ket_thuc,
            ly_do,
            trang_thai: trang_thai || "cho_duyet",
            ngay_tao: new Date().toISOString().slice(0, 10)
        });

        return res.status(201).json({ 
            success: true, 
            message: "Tạo đơn xin nghỉ phép thành công", 
            data: xinNghiPhep 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả đơn xin nghỉ phép
export const getAllXinNghiPhep = async (req, res) => {
    try {
        const xinNghiPhepList = await XinNghiPhep.getAll();
        return res.status(200).json({ success: true, data: xinNghiPhepList });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy đơn xin nghỉ phép theo ID
export const getXinNghiPhepById = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;
        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }
        
        return res.status(200).json({ success: true, data: xinNghiPhep });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy đơn xin nghỉ phép theo người dùng (bác sĩ, y tá, quản lý, admin)
export const getXinNghiPhepByNguoiDung = async (req, res) => {
    try {
        const { id_nguoi_dung } = req.params;
        
        if (!id_nguoi_dung) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_nguoi_dung" 
            });
        }

        // Validate id_nguoi_dung format (should start with BS_, YT_, QL_, or AD_)
        const validPrefixes = ['BS_', 'YT_', 'QL_', 'AD_'];
        const isValidId = validPrefixes.some(prefix => id_nguoi_dung.startsWith(prefix));
        
        if (!isValidId) {
            return res.status(400).json({ 
                success: false, 
                message: "ID người dùng không hợp lệ. Chỉ hỗ trợ bác sĩ, y tá, quản lý và admin" 
            });
        }

        const xinNghiPhepList = await XinNghiPhep.findAll({ id_nguoi_dung });
        
        return res.status(200).json({ 
            success: true, 
            data: xinNghiPhepList || [] 
        });
    } catch (error) {
        console.error("Error in getXinNghiPhepByNguoiDung:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Aliases để backward compatibility
export const getXinNghiPhepByNhanVien = getXinNghiPhepByNguoiDung;
export const getXinNghiPhepByBacSi = getXinNghiPhepByNguoiDung;

// Cập nhật trạng thái đơn xin nghỉ phép
export const updateTrangThaiXinNghiPhep = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;
        const { trang_thai } = req.body;

        if (!trang_thai) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu trạng thái" 
            });
        }

        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }

        const updated = await XinNghiPhep.update({ trang_thai }, id_xin_nghi);
        
        return res.status(200).json({ 
            success: true, 
            message: "Cập nhật trạng thái thành công", 
            data: updated 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Xóa đơn xin nghỉ phép
export const deleteXinNghiPhep = async (req, res) => {
    try {
        const { id_xin_nghi } = req.params;

        const xinNghiPhep = await XinNghiPhep.getById(id_xin_nghi);
        if (!xinNghiPhep) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy đơn xin nghỉ phép" 
            });
        }

        await XinNghiPhep.delete(id_xin_nghi);
        
        return res.status(200).json({ 
            success: true, 
            message: "Xóa đơn xin nghỉ phép thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
