import { HoaDon } from "../models/index.js";

// Tạo hóa đơn mới
export const createHoaDon = async (req, res) => {
    try {
        const { id_cuoc_hen, tong_tien, phuong_thuc_thanh_toan } = req.body;

        if (!id_cuoc_hen || !tong_tien) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc." });
        }

        // Kiểm tra đã có hóa đơn cho cuộc hẹn này chưa
        const existed = await HoaDon.getByCuocHen(id_cuoc_hen);
        if (existed) {
            return res.status(400).json({ success: false, message: "Cuộc hẹn này đã có hóa đơn." });
        }

        const hoadon = await HoaDon.create({
            id_cuoc_hen,
            tong_tien,
            phuong_thuc_thanh_toan
        });

        return res.status(201).json({ success: true, message: "Tạo hóa đơn thành công", data: hoadon });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy hóa đơn theo id_hoa_don
export const getHoaDonById = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const hoadon = await HoaDon.getById(id_hoa_don);
        if (!hoadon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
        return res.status(200).json({ success: true, data: hoadon });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy hóa đơn theo id_cuoc_hen
export const getHoaDonByCuocHen = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const hoadon = await HoaDon.getByCuocHen(id_cuoc_hen);
        if (!hoadon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
        return res.status(200).json({ success: true, data: hoadon });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trang thai hóa đơn
export const updateHoaDon = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const {trang_thai} = req.body;
        if(!trang_thai) return res.status(404).json({ success: false, message: "Không thấy trường trạng thái " });
        const hoadon = await HoaDon.getById(id_hoa_don);
        if (!hoadon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

        const updated = await HoaDon.update({trang_thai}, id_hoa_don);
        return res.status(200).json({ success: true, message: "Cập nhật hóa đơn thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa hóa đơn
export const deleteHoaDon = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const hoadon = await HoaDon.getById(id_hoa_don);
        if (!hoadon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

        await HoaDon.delete(id_hoa_don);
        return res.status(200).json({ success: true, message: "Xóa hóa đơn thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
