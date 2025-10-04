import { LichSuKham, BenhNhan, BacSi, HoSoKhamBenh } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Tạo mới lịch sử khám
export const createLichSuKham = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const {
            id_benh_nhan,
            id_ho_so,
            id_cuoc_hen,
            ly_do_kham,
            chuan_doan,
            ket_qua_cls,
            dieu_tri,
            cham_soc,
            ghi_chu
        } = req.body;
        console.log(req.body);
        if (!id_benh_nhan || !id_ho_so) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        // Check bệnh nhân tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });

        // Check hồ sơ khám
        const hoSo = await HoSoKhamBenh.findOne({ id_ho_so });
        if (!hoSo) return res.status(404).json({ success: false, message: "Hồ sơ khám không tồn tại." });

        // Check bác sĩ
        const bacSi = await BacSi.findOne({ id_bac_si: id_nguoi_dung });
        if (!bacSi) return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại." });

        const Id = `LSK_${uuidv4()}`;

        const lichSu = await LichSuKham.create({
            id_lich_su: Id,
            id_benh_nhan,
            id_ho_so,
            id_cuoc_hen,
            thoi_gian_kham : new Date(),
            nguoi_tao: id_nguoi_dung,
            ly_do_kham,
            chuan_doan,
            ket_qua_cls,
            dieu_tri,
            cham_soc,
            ghi_chu
        });

        res.status(201).json({ success: true, message: "Tạo lịch sử khám thành công.", data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy lịch sử khám theo ID
export const getLichSuKhamById = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const lichSu = await LichSuKham.getById(id_lich_su);
        if (!lichSu) return res.status(404).json({ success: false, message: "Không tìm thấy lịch sử khám." });

        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy toàn bộ lịch sử khám
export const getAllLichSuKham = async (req, res) => {
    try {
        const lichSu = await LichSuKham.getAll();
        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy lịch sử khám theo bệnh nhân
export const getLichSuKhamByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const lichSu = await LichSuKham.findAll(id_benh_nhan);
        res.status(200).json({ success: true, data: lichSu });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật lịch sử khám
export const updateLichSuKham = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const dataUpdate = req.body;
        const updated = await LichSuKham.update(dataUpdate, id_lich_su);

        res.status(200).json({ success: true, message: "Cập nhật thành công.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa lịch sử khám
export const deleteLichSuKham = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        await LichSuKham.delete(id_lich_su);
        res.status(200).json({ success: true, message: "Xóa lịch sử khám thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};
