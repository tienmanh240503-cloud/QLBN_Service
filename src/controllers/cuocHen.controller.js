import { CuocHen, BenhNhan, BacSi, ChuyenGiaDinhDuong, KhungGioKham } from "../models/index.js";

// Tạo cuộc hẹn
// Tạo cuộc hẹn
export const createCuocHen = async (req, res) => {
    try {
        const { id_benh_nhan, id_bac_si, id_chuyen_gia, id_khung_gio, ngay_kham, ly_do_kham, trieu_chung } = req.body;

        if (!id_benh_nhan || !id_khung_gio || !ngay_kham ) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra bệnh nhân tồn tại
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        // Kiểm tra bác sĩ (nếu có)
        if (id_bac_si) {
            const bacSi = await BacSi.findOne({ id_bac_si });
            if (!bacSi) {
                return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại" });
            }
        }

        // Kiểm tra chuyên gia (nếu có)
        if (id_chuyen_gia) {
            const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia });
            if (!chuyenGia) {
                return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại" });
            }
        }

        // Kiểm tra khung giờ tồn tại
        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) {
            return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });
        }

        // 🔍 Check trùng lịch cho bệnh nhân
        const lichBenhNhan = await CuocHen.findOne({ id_benh_nhan, id_khung_gio, ngay_kham });
        if (lichBenhNhan) {
            return res.status(400).json({ success: false, message: "Bệnh nhân đã có cuộc hẹn trong khung giờ này" });
        }

        // 🔍 Check trùng lịch cho bác sĩ
        if (id_bac_si) {
            const lichBacSi = await CuocHen.findOne({ id_bac_si, id_khung_gio, ngay_kham });
            if (lichBacSi) {
                return res.status(400).json({ success: false, message: "Bác sĩ đã có cuộc hẹn trong khung giờ này" });
            }
        }

        // 🔍 Check trùng lịch cho chuyên gia
        if (id_chuyen_gia) {
            const lichChuyenGia = await CuocHen.findOne({ id_chuyen_gia, id_khung_gio, ngay_kham });
            if (lichChuyenGia) {
                return res.status(400).json({ success: false, message: "Chuyên gia đã có cuộc hẹn trong khung giờ này" });
            }
        }

        // ✅ Nếu tất cả hợp lệ thì tạo cuộc hẹn
        const cuocHen = await CuocHen.create({
            id_benh_nhan,
            id_bac_si: id_bac_si || null,
            id_chuyen_gia: id_chuyen_gia || null,
            id_khung_gio,
            ngay_kham,
            ly_do_kham: ly_do_kham || null,
            trieu_chung: trieu_chung || null,
            trang_thai: 'da_dat'
        });

        return res.status(201).json({ success: true, message: "Tạo cuộc hẹn thành công", data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


// Lấy tất cả cuộc hẹn của bệnh nhân trang thai = hoan thanh
export const getCuocHenByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;

        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        const cuocHen = await CuocHen.findAll({ id_benh_nhan });

        return res.status(200).json({ success: true, data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trạng thái cuộc hẹn
export const updateTrangThaiCuocHen = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const { trang_thai } = req.body;

        const cuocHen = await CuocHen.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }
        const updatecuocHen =  await CuocHen.update({trang_thai},id_cuoc_hen);

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updatecuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa cuộc hẹn --
export const deleteCuocHen = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;

        const cuocHen = await CuocHen.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        await CuocHen.delete(id_cuoc_hen);

        return res.status(200).json({ success: true, message: "Xóa cuộc hẹn thành công" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};