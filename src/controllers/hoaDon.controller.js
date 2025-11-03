import { HoaDon, ChiTietHoaDon, DichVu, CuocHenKhamBenh, CuocHenTuVan, BenhNhan, NguoiDung } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import { createInvoiceNotification } from '../helpers/notificationHelper.js';

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
        let id_benh_nhan = null;
        if (id_cuoc_hen_kham) {
            try {
                await CuocHenKhamBenh.update({ trang_thai: 'da_hoan_thanh' }, id_cuoc_hen_kham);
                const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen: id_cuoc_hen_kham });
                if (cuocHen) id_benh_nhan = cuocHen.id_benh_nhan;
            } catch (error) {
                console.error("Error updating cuoc hen kham status:", error);
                // Không throw error để không làm ảnh hưởng đến việc tạo hóa đơn
            }
        }
        if (id_cuoc_hen_tu_van) {
            try {
                await CuocHenTuVan.update({ trang_thai: 'da_hoan_thanh' }, id_cuoc_hen_tu_van);
                const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen: id_cuoc_hen_tu_van });
                if (cuocHen) id_benh_nhan = cuocHen.id_benh_nhan;
            } catch (error) {
                console.error("Error updating cuoc hen tu van status:", error);
                // Không throw error để không làm ảnh hưởng đến việc tạo hóa đơn
            }
        }

        // Tạo thông báo cho bệnh nhân khi có hóa đơn mới
        if (id_benh_nhan) {
            await createInvoiceNotification(id_benh_nhan, hoaDon.id_hoa_don, tong_tien);
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
        const { 
            search, 
            trang_thai, 
            tu_ngay, 
            den_ngay,
            phuong_thuc_thanh_toan 
        } = req.query;

        // Lấy tất cả hóa đơn
        let data = await HoaDon.getAll(); 
        
        // Nếu data là object có property data thì lấy data, không thì dùng trực tiếp
        let hoaDons = Array.isArray(data) ? data : (data?.data || []);

        // Filter theo trạng thái
        if (trang_thai) {
            hoaDons = hoaDons.filter(hd => hd.trang_thai === trang_thai);
        }

        // Filter theo phương thức thanh toán
        if (phuong_thuc_thanh_toan) {
            hoaDons = hoaDons.filter(hd => hd.phuong_thuc_thanh_toan === phuong_thuc_thanh_toan);
        }

        // Filter theo ngày
        if (tu_ngay || den_ngay) {
            hoaDons = hoaDons.filter(hd => {
                const ngayTao = new Date(hd.thoi_gian_tao || hd.ngay_tao);
                if (tu_ngay && ngayTao < new Date(tu_ngay)) return false;
                if (den_ngay) {
                    const denNgay = new Date(den_ngay);
                    denNgay.setHours(23, 59, 59, 999);
                    if (ngayTao > denNgay) return false;
                }
                return true;
            });
        }

        // Search theo mã hóa đơn
        if (search) {
            const searchLower = search.toLowerCase();
            hoaDons = hoaDons.filter(hd => 
                hd.id_hoa_don?.toLowerCase().includes(searchLower)
            );
        }

        res.status(200).json({ success: true, data: hoaDons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Tìm kiếm hóa đơn nâng cao với thông tin bệnh nhân
export const searchHoaDon = async (req, res) => {
    try {
        const { 
            search, 
            trang_thai, 
            tu_ngay, 
            den_ngay,
            phuong_thuc_thanh_toan,
            id_benh_nhan
        } = req.query;

        // Lấy tất cả hóa đơn
        let data = await HoaDon.getAll(); 
        let hoaDons = Array.isArray(data) ? data : (data?.data || []);

        // Lấy tất cả cuộc hẹn để map với hóa đơn
        const [cuocHenKham, cuocHenTuVan, benhNhanData, nguoiDungData] = await Promise.all([
            CuocHenKhamBenh.getAll(),
            CuocHenTuVan.getAll(),
            BenhNhan.getAll(),
            NguoiDung.getAll()
        ]);
        const allCuocHenKham = Array.isArray(cuocHenKham) ? cuocHenKham : (cuocHenKham?.data || []);
        const allCuocHenTuVan = Array.isArray(cuocHenTuVan) ? cuocHenTuVan : (cuocHenTuVan?.data || []);
        const allBenhNhan = Array.isArray(benhNhanData) ? benhNhanData : (benhNhanData?.data || []);
        const allNguoiDung = Array.isArray(nguoiDungData) ? nguoiDungData : (nguoiDungData?.data || []);

        // Map hóa đơn với thông tin bệnh nhân và cuộc hẹn
        hoaDons = hoaDons.map(hd => {
            let cuocHen = null;
            let benhNhan = null;
            let nguoiDung = null;

            if (hd.id_cuoc_hen_kham) {
                cuocHen = allCuocHenKham.find(ch => ch.id_cuoc_hen === hd.id_cuoc_hen_kham);
            } else if (hd.id_cuoc_hen_tu_van) {
                cuocHen = allCuocHenTuVan.find(ch => ch.id_cuoc_hen === hd.id_cuoc_hen_tu_van);
            }

            if (cuocHen?.id_benh_nhan) {
                benhNhan = allBenhNhan.find(bn => bn.id_benh_nhan === cuocHen.id_benh_nhan);
                if (benhNhan?.id_benh_nhan) {
                    nguoiDung = allNguoiDung.find(nd => nd.id_nguoi_dung === benhNhan.id_benh_nhan);
                }
            }

            return {
                ...hd,
                cuoc_hen: cuocHen,
                benh_nhan: benhNhan,
                nguoi_dung: nguoiDung
            };
        });

        // Filter theo id bệnh nhân
        if (id_benh_nhan) {
            hoaDons = hoaDons.filter(hd => hd.benh_nhan?.id_benh_nhan === id_benh_nhan);
        }

        // Filter theo trạng thái
        if (trang_thai) {
            hoaDons = hoaDons.filter(hd => hd.trang_thai === trang_thai);
        }

        // Filter theo phương thức thanh toán
        if (phuong_thuc_thanh_toan) {
            hoaDons = hoaDons.filter(hd => hd.phuong_thuc_thanh_toan === phuong_thuc_thanh_toan);
        }

        // Filter theo ngày
        if (tu_ngay || den_ngay) {
            hoaDons = hoaDons.filter(hd => {
                const ngayTao = new Date(hd.thoi_gian_tao || hd.ngay_tao);
                if (tu_ngay && ngayTao < new Date(tu_ngay)) return false;
                if (den_ngay) {
                    const denNgay = new Date(den_ngay);
                    denNgay.setHours(23, 59, 59, 999);
                    if (ngayTao > denNgay) return false;
                }
                return true;
            });
        }

        // Search theo mã hóa đơn, tên bệnh nhân, số điện thoại
        if (search) {
            const searchLower = search.toLowerCase();
            hoaDons = hoaDons.filter(hd => {
                // Search theo mã hóa đơn
                if (hd.id_hoa_don?.toLowerCase().includes(searchLower)) return true;
                
                // Search theo tên bệnh nhân (từ nguoi_dung)
                if (hd.nguoi_dung?.ho_ten?.toLowerCase().includes(searchLower)) return true;
                
                // Search theo số điện thoại
                if (hd.nguoi_dung?.so_dien_thoai?.includes(search)) return true;
                
                return false;
            });
        }

        res.status(200).json({ success: true, data: hoaDons });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy hóa đơn theo id_hoa_don với đầy đủ thông tin
export const getHoaDonById = async (req, res) => {
    try {
        const { id_hoa_don } = req.params;
        const hoaDon = await HoaDon.getById(id_hoa_don);
        if (!hoaDon) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn" });

        const chiTiet = await ChiTietHoaDon.findAll({ id_hoa_don });

        // Lấy thông tin dịch vụ cho từng chi tiết
        for (let ct of chiTiet) {
            const dichVu = await DichVu.getById(ct.id_dich_vu);
            ct.dich_vu = dichVu;
        }

        // Lấy thông tin cuộc hẹn và bệnh nhân
        let cuocHen = null;
        let benhNhan = null;
        let nguoiDung = null;

        if (hoaDon.id_cuoc_hen_kham) {
            cuocHen = await CuocHenKhamBenh.getById(hoaDon.id_cuoc_hen_kham);
        } else if (hoaDon.id_cuoc_hen_tu_van) {
            cuocHen = await CuocHenTuVan.getById(hoaDon.id_cuoc_hen_tu_van);
        }

        if (cuocHen?.id_benh_nhan) {
            benhNhan = await BenhNhan.getById(cuocHen.id_benh_nhan);
            if (benhNhan?.id_benh_nhan) {
                nguoiDung = await NguoiDung.getById(benhNhan.id_benh_nhan);
            }
        }

        res.status(200).json({ 
            success: true, 
            data: { 
                ...hoaDon, 
                chi_tiet: chiTiet,
                cuoc_hen: cuocHen,
                benh_nhan: benhNhan,
                nguoi_dung: nguoiDung
            } 
        });
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
