import { CuocHenTuVan, BenhNhan, ChuyenGiaDinhDuong, KhungGioKham } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo cuộc hẹn tư vấn dinh dưỡng
export const createCuocHenTuVan = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;

        const { id_benh_nhan, id_khung_gio, ngay_kham, loai_dinh_duong, loai_hen, ly_do_tu_van } = req.body;

        if (!id_benh_nhan || !id_khung_gio || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra bệnh nhân
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });

        // Kiểm tra chuyên gia
        if (id_nguoi_dung) {
            const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia : id_nguoi_dung });
            if (!chuyenGia) return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại" });
        }

        // Kiểm tra khung giờ
        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });

        // Check trùng lịch
        const lichTrung = await CuocHenTuVan.findOne({ id_chuyen_gia : id_nguoi_dung, id_khung_gio, ngay_kham });
        if (lichTrung) return res.status(400).json({ success: false, message: "Chuyên gia đã có lịch tư vấn trong khung giờ này" });

        const Id = `CH_${uuidv4()}`;

        // Tạo mới
        const cuocHen = await CuocHenTuVan.create({
            id_cuoc_hen : Id,
            id_benh_nhan,
            id_chuyen_gia: id_nguoi_dung || null,
            id_khung_gio,
            ngay_kham,
            loai_dinh_duong,
            loai_hen: loai_hen || 'truc_tiep',
            ly_do_tu_van,
            trang_thai: 'da_dat'
        });

        return res.status(201).json({ success: true, message: "Tạo cuộc hẹn tư vấn thành công", data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách cuộc hẹn của bệnh nhân
export const getCuocHenTuVanByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }
        const cuocHen = await CuocHenTuVan.findAll({ id_benh_nhan});
        return res.status(200).json({ success: true, data: cuocHen });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách cuộc hẹn của bệnh nhân theo trạng thái
export const getCuocHenByBenhNhanAndTrangThai = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const { trang_thai } = req.body; 
        if (!id_benh_nhan) {
            return res.status(400).json({ success: false, message: "Thiếu id_benh_nhan" });
        }
        const cuocHen = await CuocHenTuVan.findAll({id_benh_nhan, trang_thai });
        return res.status(200).json({ success: true, data: cuocHen });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


// Cập nhật trạng thái
export const updateTrangThaiCuocHenTuVan = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const { trang_thai } = req.body;

        const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen });
        if (!cuocHen) return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });

        const updated = await CuocHenTuVan.update({ trang_thai }, id_cuoc_hen);

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa cuộc hẹn
export const deleteCuocHenTuVan = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen });
        if (!cuocHen) return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });

        await CuocHenTuVan.delete(id_cuoc_hen);
        return res.status(200).json({ success: true, message: "Xóa cuộc hẹn thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
