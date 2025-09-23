import { DonThuoc, ChiTietDonThuoc, Thuoc, HoSoKhamBenh } from "../models/index.js";

// Tạo đơn thuốc
export const createDonThuoc = async (req, res) => {
    try {
        const { id_ho_so, ghi_chu, chi_tiet } = req.body;

        if (!id_ho_so || !chi_tiet || chi_tiet.length === 0) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        const hoSo = await HoSoKhamBenh.findOne({id_ho_so});
        if (!hoSo) {
            return res.status(404).json({ success: false, message: "Hồ sơ khám không tồn tại" });
        }

        const donThuoc = await DonThuoc.create({ id_ho_so, ghi_chu , trang_thai : true ,thoi_gian_tao : new Date() });

        return res.status(201).json({ success: true, message: "Tạo đơn thuốc thành công", data: donThuoc });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy đơn thuốc + chi tiết đơn thuốc theo hồ sơ khám bệnh
export const getDonThuocByHoSo = async (req, res) => {
    try {
        const { id_ho_so } = req.params;

        // Kiểm tra hồ sơ khám có tồn tại không
        const hoSo = await HoSoKhamBenh.findOne({ id_ho_so });
        if (!hoSo) {
            return res.status(404).json({ success: false, message: "Hồ sơ khám không tồn tại" });
        }

        // Lấy đơn thuốc + chi tiết + thông tin thuốc
        const donThuoc = await DonThuoc.findOne({id_ho_so});

        if (!donThuoc) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc cho hồ sơ này" });
        }
        const chiTietDonThuoc = await ChiTietDonThuoc.findAll({id_don_thuoc : donThuoc.id_don_thuoc});
        const chiTietWithThuoc = await Promise.all(
            chiTietDonThuoc.map(async (ct) => {
                const thuoc = await Thuoc.findOne({id_thuoc});
                return {
                    ...ct,
                    thuoc // gắn thông tin thuốc
                };
            })
        );
        return res.status(200).json({ success: true, data:{ ...donThuoc, chi_tiet : chiTietWithThuoc}});
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const deleteDonThuoc = async (req, res) => {
    try {
        const { id_don_thuoc } = req.params;

        // Kiểm tra đơn thuốc có tồn tại
        const donThuoc = await DonThuoc.getById(id_don_thuoc);
        if (!donThuoc) {
            return res.status(404).json({ success: false, message: "Đơn thuốc không tồn tại" });
        }

        // Xóa tất cả chi tiết đơn thuốc cùng 1 lúc
        await ChiTietDonThuoc.deleteMany({ id_don_thuoc });

        // Xóa đơn thuốc
        await DonThuoc.delete(id_don_thuoc);

        return res.status(200).json({
            success: true,
            message: "Xóa đơn thuốc và toàn bộ chi tiết thành công"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message
        });
    }
};

