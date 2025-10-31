import { HoaDon, ChiTietHoaDon, DichVu, CuocHenKhamBenh, CuocHenTuVan } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';

// Tạo hóa đơn
export const createHoaDon = async (req, res) => {
    try {
        const { id_cuoc_hen_kham, id_cuoc_hen_tu_van, chi_tiet, tong_tien } = req.body;

        if (!chi_tiet || chi_tiet.length === 0) {
            return res.status(400).json({ success: false, message: "Thiếu chi tiết hóa đơn" });
        }

        // Tính tổng tiền

        const Id = `HD_${uuidv4()}`;

        // Tạo hóa đơn
        const hoaDon = await HoaDon.create({
            id_hoa_don : Id,
            id_cuoc_hen_kham,
            id_cuoc_hen_tu_van,
            tong_tien,
            trang_thai: 'chua_thanh_toan',
        });

        // Tạo chi tiết hóa đơn
        for (const ct of chi_tiet) {
            const IdChiTiet = `DHD_${uuidv4()}`;
            await ChiTietHoaDon.create({
                id_chi_tiet : IdChiTiet,
                id_hoa_don: hoaDon.id_hoa_don,
                id_dich_vu: ct.id_dich_vu,
                so_luong: ct.so_luong,
                don_gia: ct.don_gia
            });
        }

        // Tự động cập nhật trạng thái cuộc hẹn thành "da_hoan_thanh" khi tạo hóa đơn thành công
        if (id_cuoc_hen_kham) {
            try {
                await CuocHenKhamBenh.update({ trang_thai: 'da_hoan_thanh' }, id_cuoc_hen_kham);
            } catch (error) {
                console.error("Error updating cuoc hen kham status:", error);
                // Không throw error để không làm ảnh hưởng đến việc tạo hóa đơn
            }
        }
        if (id_cuoc_hen_tu_van) {
            try {
                await CuocHenTuVan.update({ trang_thai: 'da_hoan_thanh' }, id_cuoc_hen_tu_van);
            } catch (error) {
                console.error("Error updating cuoc hen tu van status:", error);
                // Không throw error để không làm ảnh hưởng đến việc tạo hóa đơn
            }
        }

        return res.status(201).json({
            success: true,
            message: "Tạo hóa đơn thành công",
            data: hoaDon
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getAllHoaDon = async (req, res) => {
    try {
        const data = await HoaDon.getAll(); 
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy hóa đơn theo id_hoa_don
export const getHoaDonById = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const hoaDon = await HoaDon.getById(id_hoa_don);
        if (!hoaDon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

        const chiTiet = await ChiTietHoaDon.findAll({ id_hoa_don });

        for (let ct of chiTiet) {
            const dichVu = await DichVu.getById(ct.id_dich_vu);
            ct.dich_vu = dichVu;
        }

        res.status(200).json({ success: true, data: { ...hoaDon, chi_tiet: chiTiet } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getHoaDonByCuocHenKham = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const hoaDon = await HoaDon.findOne({ id_cuoc_hen_kham : id_cuoc_hen });

        if (!hoaDon) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn cho cuộc hẹn khám" });
        }

        const chiTiet = await ChiTietHoaDon.findAll({ id_hoa_don: hoaDon.id_hoa_don });

        for (let ct of chiTiet) {
            const dichVu = await DichVu.findOne({ id_dich_vu: ct.id_dich_vu });
            ct.dich_vu = dichVu;
        }

        return res.status(200).json({ success: true, data: { ...hoaDon, chi_tiet: chiTiet } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getHoaDonByCuocHenTuVan = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const hoaDon = await HoaDon.findOne({ id_cuoc_hen_tu_van : id_cuoc_hen });

        if (!hoaDon) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn cho cuộc hẹn tư vấn" });
        }

        const chiTiet = await ChiTietHoaDon.findAll({ id_hoa_don: hoaDon.id_hoa_don });

        for (let ct of chiTiet) {
            const dichVu = await DichVu.findOne({ id_dich_vu: ct.id_dich_vu });
            ct.dich_vu = dichVu;
        }

        return res.status(200).json({ success: true, data: { ...hoaDon, chi_tiet: chiTiet } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


export const updateThanhToan = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const { phuong_thuc_thanh_toan, trang_thai } = req.body;

        const hoaDon = await HoaDon.findOne({id_hoa_don});
        if (!hoaDon) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });
        }

        const updateHD = await HoaDon.update({ phuong_thuc_thanh_toan, trang_thai : trang_thai || 'da_thanh_toan',thoi_gian_thanh_toan :  new Date() }, id_hoa_don);

        return res.status(200).json({ success: true, message: "Cập nhật thanh toán thành công", data: updateHD });
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
