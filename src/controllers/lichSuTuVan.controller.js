import { LichSuTuVan, BenhNhan, ChuyenGiaDinhDuong, HoSoDinhDuong } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Tạo mới lịch sử tư vấn
export const createLichSuTuVan = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const {
            id_benh_nhan,
            id_ho_so,
            id_cuoc_hen,
            thoi_gian_tu_van,
            ket_qua_cls,
            ke_hoach_dinh_duong,
            nhu_cau_calo,
            sang,
            trua,
            chieu,
            toi,
            cham_soc,
            ghi_chu
        } = req.body;

        if (!id_benh_nhan || !id_ho_so || !thoi_gian_tu_van) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        // Check bệnh nhân tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });

        // Check hồ sơ dinh dưỡng tồn tại
        const hoSo = await HoSoDinhDuong.findOne({ id_ho_so });
        if (!hoSo) return res.status(404).json({ success: false, message: "Hồ sơ dinh dưỡng không tồn tại." });

        // Check chuyên gia dinh dưỡng
        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: id_nguoi_dung });
        if (!chuyenGia) return res.status(404).json({ success: false, message: "Chuyên gia dinh dưỡng không tồn tại." });

        const Id = `LSTV_${uuidv4()}`;

        const lichSu = await LichSuTuVan.create({
            id_lich_su: Id,
            id_benh_nhan,
            id_ho_so,
            id_cuoc_hen,
            thoi_gian_tu_van,
            nguoi_tao: id_nguoi_dung,
            ket_qua_cls,
            ke_hoach_dinh_duong,
            nhu_cau_calo,
            sang,
            trua,
            chieu,
            toi,
            cham_soc,
            ghi_chu
        });

        res.status(201).json({ success: true, message: "Tạo lịch sử tư vấn thành công.", data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy lịch sử tư vấn theo ID
export const getLichSuTuVanById = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const lichSu = await LichSuTuVan.getById(id_lich_su);
        if (!lichSu) return res.status(404).json({ success: false, message: "Không tìm thấy lịch sử tư vấn." });

        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy toàn bộ lịch sử tư vấn
export const getAllLichSuTuVan = async (req, res) => {
    try {
        const lichSu = await LichSuTuVan.getAll();
        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy lịch sử tư vấn theo bệnh nhân
export const getLichSuTuVanByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const lichSu = await LichSuTuVan.findAll({id_benh_nhan});
        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật lịch sử tư vấn
export const updateLichSuTuVan = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const dataUpdate = req.body;
        const updated = await LichSuTuVan.update(dataUpdate, id_lich_su);

        res.status(200).json({ success: true, message: "Cập nhật thành công.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa lịch sử tư vấn
export const deleteLichSuTuVan = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        await LichSuTuVan.delete(id_lich_su);
        res.status(200).json({ success: true, message: "Xóa lịch sử tư vấn thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};
