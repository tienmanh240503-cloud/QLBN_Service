import { ChiDinhXetNghiem, BacSi } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo chỉ định xét nghiệm
export const createChiDinh = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const{id_ho_so, ten_dich_vu, yeu_cau_ghi_chu, trang_thai } = req.body;
        const Id = `CD_${uuidv4()}`;
        const chiDinh = await ChiDinhXetNghiem.create({ id_chi_dinh : Id, id_ho_so, ten_dich_vu, yeu_cau_ghi_chu, trang_thai, id_bac_si_chi_dinh : id_nguoi_dung, thoi_gian_chi_dinh : new Date() });
        return res.status(201).json({ success: true, data: chiDinh });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả chỉ định theo id hồ sơ
export const getChiDinhByHoSo = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        const chiDinhs = await ChiDinhXetNghiem.findAll({ id_ho_so });
        if (!chiDinhs || chiDinhs.length === 0) {
            return res.status(404).json({ success: false, message: "Không có chỉ định nào" });
        }

        const results = [];
        for (const cd of chiDinhs) {
            const bacSi = await BacSi.findOne({ id_bac_si: cd.id_bac_si_chi_dinh });
            results.push({
                ...cd,
                bac_si: bacSi || null
            });
        }

        return res.status(200).json({ success: true, data: results });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trạng thái chỉ định
export const updateTrangThaiChiDinh = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const { trang_thai } = req.body;

        const updated = await ChiDinhXetNghiem.update({ trang_thai }, id_chi_dinh);
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định" });

        return res.status(200).json({ success: true, message: "Cập nhật thành công", data : updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa chỉ định
export const deleteChiDinh = async (req, res) => {
    try {
        const { id_chi_dinh } = req.params;
        const deleted = await ChiDinhXetNghiem.delete(id_chi_dinh);
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy chỉ định" });

        return res.status(200).json({ success: true, message: "Xóa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
