import { TheoDoiTienDo, BenhNhan, LichSuTuVan } from "../models/index.js";
import { v4 as uuidv4 } from "uuid";

// Tạo mới theo dõi tiến độ
export const createTheoDoiTienDo = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded?.info?.id_nguoi_dung || null;
        const {
            id_benh_nhan,
            id_ho_so,
            id_lich_su,
            ngay_kham,
            can_nang,
            chieu_cao,
            vong_eo,
            vong_nguc,
            vong_dui,
            mo_co_the,
            khoi_co,
            nuoc_trong_co_the,
            bmi,
            ghi_chu
        } = req.body;

        if (!id_benh_nhan || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc: id_benh_nhan, ngay_kham." });
        }

        // Check bệnh nhân tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });

        // Check lịch sử tư vấn nếu có
        if (id_lich_su) {
            const lichSu = await LichSuTuVan.findOne({ id_lich_su });
            if (!lichSu) return res.status(404).json({ success: false, message: "Lịch sử tư vấn không tồn tại." });
        }

        // Tính BMI nếu không có nhưng có cân nặng và chiều cao
        let calculatedBMI = bmi;
        if (!calculatedBMI && can_nang && chieu_cao) {
            const heightInM = chieu_cao / 100;
            calculatedBMI = can_nang / (heightInM * heightInM);
        }

        const id_theo_doi = `TDT_${uuidv4()}`;

        const theoDoi = await TheoDoiTienDo.create({
            id_theo_doi,
            id_benh_nhan,
            id_ho_so: id_ho_so || null,
            id_lich_su: id_lich_su || null,
            ngay_kham,
            can_nang,
            chieu_cao,
            vong_eo,
            vong_nguc,
            vong_dui,
            mo_co_the,
            khoi_co,
            nuoc_trong_co_the,
            bmi: calculatedBMI,
            ghi_chu,
            nguoi_tao: id_nguoi_dung
        });

        res.status(201).json({ success: true, message: "Tạo theo dõi tiến độ thành công.", data: theoDoi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy theo dõi tiến độ theo ID
export const getTheoDoiTienDoById = async (req, res) => {
    try {
        const { id_theo_doi } = req.params;
        const theoDoi = await TheoDoiTienDo.getById(id_theo_doi);
        if (!theoDoi) return res.status(404).json({ success: false, message: "Không tìm thấy theo dõi tiến độ." });

        res.status(200).json({ success: true, data: theoDoi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy tất cả theo dõi tiến độ theo bệnh nhân
export const getTheoDoiTienDoByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const theoDoi = await TheoDoiTienDo.findAll({ id_benh_nhan });
        // Sắp xếp theo ngày khám giảm dần (mới nhất trước)
        theoDoi.sort((a, b) => new Date(b.ngay_kham) - new Date(a.ngay_kham));
        res.status(200).json({ success: true, data: theoDoi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy theo dõi tiến độ theo lịch sử tư vấn
export const getTheoDoiTienDoByLichSu = async (req, res) => {
    try {
        const { id_lich_su } = req.params;
        const theoDoi = await TheoDoiTienDo.findAll({ id_lich_su });
        res.status(200).json({ success: true, data: theoDoi });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Cập nhật theo dõi tiến độ
export const updateTheoDoiTienDo = async (req, res) => {
    try {
        const { id_theo_doi } = req.params;
        const dataUpdate = req.body;

        // Tính lại BMI nếu có thay đổi cân nặng hoặc chiều cao
        if (dataUpdate.can_nang || dataUpdate.chieu_cao) {
            const existing = await TheoDoiTienDo.getById(id_theo_doi);
            if (existing) {
                const can_nang = dataUpdate.can_nang || existing.can_nang;
                const chieu_cao = dataUpdate.chieu_cao || existing.chieu_cao;
                if (can_nang && chieu_cao) {
                    const heightInM = chieu_cao / 100;
                    dataUpdate.bmi = can_nang / (heightInM * heightInM);
                }
            }
        }

        const updated = await TheoDoiTienDo.update(dataUpdate, id_theo_doi);

        res.status(200).json({ success: true, message: "Cập nhật thành công.", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Xóa theo dõi tiến độ
export const deleteTheoDoiTienDo = async (req, res) => {
    try {
        const { id_theo_doi } = req.params;
        await TheoDoiTienDo.delete(id_theo_doi);
        res.status(200).json({ success: true, message: "Xóa theo dõi tiến độ thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

