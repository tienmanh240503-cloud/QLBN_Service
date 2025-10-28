import { DoiCa } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo yêu cầu đổi ca
export const createDoiCa = async (req, res) => {
    try {
        const { 
            id_bac_si, 
            ngay_cu, 
            ca_cu, 
            ngay_moi, 
            ca_moi, 
            ly_do, 
            trang_thai 
        } = req.body;

        if (!id_bac_si || !ngay_cu || !ca_cu || !ngay_moi || !ca_moi || !ly_do) {
            return res.status(400).json({ 
                success: false, 
                message: "Tất cả các trường là bắt buộc" 
            });
        }

        const Id = `DC_${uuidv4()}`;

        const doiCa = await DoiCa.create({
            id_doi_ca: Id,
            id_bac_si,
            ngay_cu,
            ca_cu,
            ngay_moi,
            ca_moi,
            ly_do,
            trang_thai: trang_thai || "cho_duyet",
            ngay_tao: new Date().toISOString().slice(0, 10)
        });

        return res.status(201).json({ 
            success: true, 
            message: "Tạo yêu cầu đổi ca thành công", 
            data: doiCa 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả yêu cầu đổi ca
export const getAllDoiCa = async (req, res) => {
    try {
        const doiCaList = await DoiCa.getAll();
        return res.status(200).json({ success: true, data: doiCaList });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy yêu cầu đổi ca theo ID
export const getDoiCaById = async (req, res) => {
    try {
        const { id_doi_ca } = req.params;
        const doiCa = await DoiCa.getById(id_doi_ca);
        
        if (!doiCa) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy yêu cầu đổi ca" 
            });
        }
        
        return res.status(200).json({ success: true, data: doiCa });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy yêu cầu đổi ca theo bác sĩ
export const getDoiCaByBacSi = async (req, res) => {
    try {
        const { id_bac_si } = req.params;
        
        if (!id_bac_si) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu id_bac_si" 
            });
        }

        const doiCaList = await DoiCa.findAll({ id_bac_si });
        
        return res.status(200).json({ 
            success: true, 
            data: doiCaList 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Cập nhật trạng thái yêu cầu đổi ca
export const updateTrangThaiDoiCa = async (req, res) => {
    try {
        const { id_doi_ca } = req.params;
        const { trang_thai } = req.body;

        if (!trang_thai) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu trạng thái" 
            });
        }

        const doiCa = await DoiCa.getById(id_doi_ca);
        if (!doiCa) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy yêu cầu đổi ca" 
            });
        }

        const updated = await DoiCa.update({ trang_thai }, id_doi_ca);
        
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

// Xóa yêu cầu đổi ca
export const deleteDoiCa = async (req, res) => {
    try {
        const { id_doi_ca } = req.params;

        const doiCa = await DoiCa.getById(id_doi_ca);
        if (!doiCa) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy yêu cầu đổi ca" 
            });
        }

        await DoiCa.delete(id_doi_ca);
        
        return res.status(200).json({ 
            success: true, 
            message: "Xóa yêu cầu đổi ca thành công" 
        });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
