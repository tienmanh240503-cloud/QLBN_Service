import { HoSoKhamBenh, BenhNhan, BacSi, CuocHen } from "../models/index.js";

// Tạo hồ sơ khám bệnh
export const createHoSoKham = async (req, res) => {
    try {
        const { id_cuoc_hen, chan_doan, chi_tiet_chan_doan, phac_do_dieu_tri, huong_dan_tai_kham, id_bac_si_tao } = req.body;

        if (!id_cuoc_hen || !chan_doan || !id_bac_si_tao) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc (id_cuoc_hen, chan_doan, id_bac_si_tao)."
            });
        }

        // Check cuộc hẹn tồn tại
        const cuocHen = await CuocHen.findOne({id_cuoc_hen});
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại." });
        }

        // Check xem đã có hồ sơ cho cuộc hẹn này chưa
        const hoSoTonTai = await HoSoKhamBenh.findOne({id_cuoc_hen});
        if (hoSoTonTai) {
            return res.status(400).json({
                success: false,
                message: "Cuộc hẹn này đã có hồ sơ khám bệnh."
            });
        }

        // Tạo hồ sơ khám
        const hoSo = await HoSoKhamBenh.create({
            id_cuoc_hen,
            chan_doan,
            chi_tiet_chan_doan,
            phac_do_dieu_tri,
            huong_dan_tai_kham,
            id_bac_si_tao,
            thoi_gian_tao: new Date()
        });

        return res.status(201).json({
            success: true,
            message: "Tạo hồ sơ khám thành công.",
            data: hoSo
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
            error: error.message
        });
    }
};

// Xem hồ sơ khám bệnh theo bệnh nhân
export const getHoSoByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;

        const benhNhan = await BenhNhan.findOne({id_benh_nhan});
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại." });
        }

        const cuocHens = await CuocHen.findAll({id_benh_nhan});

        if (!cuocHens.length) {
            return res.status(200).json({
                success: true,
                message: "Bệnh nhân chưa có hồ sơ khám nào.",
                data: []
            });
        }

        // Lấy danh sách id cuộc hẹn
        const idCuocHens = cuocHens.map(c => c.id);
        const hoSos = [];
        for (const id of idCuocHens) {
            const hoSo = await HoSoKham.findOne({ id_cuoc_hen: id });
            if (hoSo) {
                hoSos.push(hoSo.data);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Danh sách hồ sơ khám bệnh.",
            data: hoSos
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server.",
            error: error.message
        });
    }
};



