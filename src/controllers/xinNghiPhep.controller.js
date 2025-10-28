import { XinNghiPhep } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo đơn xin nghỉ phép
export const createXinNghiPhep = async (req, res) => {
    try {
        const { id_bac_si, ngay_bat_dau, ngay_ket_thuc, ly_do, trang_thai } = req.body;

        if (!id_bac_si || !ngay_bat_dau || !ngay_ket_thuc || !ly_do) {
            return res.status(400).json({ 
                success: false, 
                message: "id_bac_si, ngay_bat_dau, ngay_ket_thuc và ly_do là bắt buộc" 
            });
        }

        const Id = `XN_${uuidv4()}`;

        const xinNghiPhep = await XinNghiPhep.create({
            id_xin_nghi: Id,
            id_bac_si,
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

// Lấy đơn xin nghỉ phép theo bác sĩ
export const getXinNghiPhepByBacSi = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        
        if (!id_bac_si) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_bac_si" 
            });
        }

        const xinNghiPhepList = await XinNghiPhep.findAll({ id_bac_si });
        
        return res.status(200).json({ 
            success: true, 
            data: xinNghiPhepList 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

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
