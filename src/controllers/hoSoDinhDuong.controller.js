
import { HoSoDinhDuong, BenhNhan, ChuyenGiaDinhDuong } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

export const createHoSoDinhDuong = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const {
            id_benh_nhan,
            ho_ten,
            so_dien_thoai,
            tuoi,
            gioi_tinh,
            dan_toc,
            ma_BHYT,
            dia_chi,
            chieu_cao,
            can_nang,
            vong_eo,
            mo_co_the,
            khoi_co,
            nuoc_trong_co_the,
            ket_qua_cls,
            chuan_doan,
            ke_hoach_dinh_duong,
            nhu_cau_calo,
            sang,
            trua,
            chieu,
            toi,
            cham_soc,
            ghi_chu
        } = req.body;

        if (!id_benh_nhan || !id_nguoi_dung || !ho_ten) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        // Kiểm tra bệnh nhân và chuyên gia tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });

        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia  : id_nguoi_dung });
        if (!chuyenGia) return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại." });

        const Id = `DD_${uuidv4()}`;
        // Tạo hồ sơ dinh dưỡng
        const hoSo = await HoSoDinhDuong.create({
            id_ho_so : Id,
            id_benh_nhan,
            id_chuyen_gia : id_nguoi_dung,
            ho_ten,
            so_dien_thoai,
            tuoi,
            gioi_tinh,
            dan_toc,
            ma_BHYT,
            dia_chi,
            chieu_cao,
            can_nang,
            vong_eo,
            mo_co_the,
            khoi_co,
            nuoc_trong_co_the,
            ket_qua_cls,
            chuan_doan,
            ke_hoach_dinh_duong,
            nhu_cau_calo,
            sang,
            trua,
            chieu,
            toi,
            cham_soc,
            ghi_chu,
            ngay_tao: new Date()
        });

        res.status(201).json({ success: true, message: "Tạo hồ sơ dinh dưỡng thành công.", data: hoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

export const getHoSoDinhDuongById = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        const hoSo = await HoSoDinhDuong.getById(id_ho_so);
        if (!hoSo) return res.status(404).json({ success: false, message: "Không tìm thấy hồ sơ." });

        res.status(200).json({ success: true, data: hoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

// Lấy danh sách hồ sơ của 1 bệnh nhân
export const getHoSoDinhDuongByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const hoSos = await HoSoDinhDuong.findOne({ id_benh_nhan });
        res.status(200).json({ success: true, data: hoSos });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

export const updateHoSoDinhDuong = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        const dataUpdate = req.body;

        const updatedHoSo = await HoSoDinhDuong.update(dataUpdate, id_ho_so);
        res.status(200).json({ success: true, message: "Cập nhật hồ sơ thành công.", data: updatedHoSo });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};

export const deleteHoSoDinhDuong = async (req, res) => {
    try {
        const { id_ho_so } = req.params;
        await HoSoDinhDuong.delete(id_ho_so);
        res.status(200).json({ success: true, message: "Xóa hồ sơ thành công." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server.", error: error.message });
    }
};