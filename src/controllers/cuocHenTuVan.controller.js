import { CuocHenTuVan, BenhNhan, ChuyenGiaDinhDuong, KhungGioKham, HoSoDinhDuong, LichSuTuVan, NguoiDung } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import { createAppointmentNotification } from '../helpers/notificationHelper.js';

// Tạo cuộc hẹn tư vấn dinh dưỡng
export const createCuocHenTuVan = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const vai_tro = req.decoded.vai_tro;

        const { id_benh_nhan, id_chuyen_gia, id_khung_gio, ngay_kham, loai_dinh_duong, loai_hen, ly_do_tu_van } = req.body;

        if ( !id_khung_gio || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Xác định id_benh_nhan: 
        // - Nếu là nhân viên quầy/admin và có id_benh_nhan trong body -> dùng id_benh_nhan từ body
        // - Ngược lại, dùng id_nguoi_dung từ token (bệnh nhân tự đặt lịch)
        let idBenhNhanFinal = id_nguoi_dung;
        if ((vai_tro === "NhanVienQuay" || vai_tro === "Admin") && id_benh_nhan) {
            idBenhNhanFinal = id_benh_nhan;
        }

        // Kiểm tra bệnh nhân
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan : idBenhNhanFinal });
        if (!benhNhan) return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });

        // Kiểm tra chuyên gia
        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia});
        if (!chuyenGia) return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại" });

        // Kiểm tra khung giờ
        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });

        // Check trùng lịch
        const lichTrung = await CuocHenTuVan.findOne({ id_chuyen_gia, id_khung_gio, ngay_kham });
        if (lichTrung) return res.status(400).json({ success: false, message: "Chuyên gia đã có lịch tư vấn trong khung giờ này" });

        const Id = `CH_${uuidv4()}`;

        // Tạo mới
        const cuocHen = await CuocHenTuVan.create({
            id_cuoc_hen : Id,
            id_benh_nhan : idBenhNhanFinal,
            id_chuyen_gia: id_chuyen_gia || null,
            id_khung_gio,
            ngay_kham,
            loai_dinh_duong,
            loai_hen: loai_hen || 'truc_tiep',
            ly_do_tu_van,
            trang_thai: 'da_dat'
        });

        // Tạo thông báo cho bệnh nhân
        await createAppointmentNotification(
            idBenhNhanFinal,
            'da_dat',
            Id,
            ngay_kham,
            null,
            id_chuyen_gia
        );

        // Tạo thông báo cho chuyên gia (nếu có)
        if (id_chuyen_gia) {
            await createAppointmentNotification(
                id_chuyen_gia,
                'da_dat',
                Id,
                ngay_kham,
                null,
                id_chuyen_gia
            );
        }

        return res.status(201).json({ success: true, message: "Tạo cuộc hẹn tư vấn thành công", data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy cuộc hẹn tư vấn theo ID
export const getCuocHenTuVanById = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        
        if (!id_cuoc_hen) {
            return res.status(400).json({ success: false, message: "Thiếu id_cuoc_hen" });
        }

        const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen });
        
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        // Lấy thông tin khung giờ nếu có
        let khungGio = null;
        if (cuocHen.id_khung_gio) {
            khungGio = await KhungGioKham.findOne({ id_khung_gio: cuocHen.id_khung_gio });
        }

        // Lấy thông tin chuyên gia nếu có
        let chuyenGia = null;
        if (cuocHen.id_chuyen_gia) {
            chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: cuocHen.id_chuyen_gia });
        }

        // Lấy thông tin bệnh nhân
        let benhNhan = null;
        if (cuocHen.id_benh_nhan) {
            benhNhan = await BenhNhan.findOne({ id_benh_nhan: cuocHen.id_benh_nhan });
        }

        return res.status(200).json({ 
            success: true, 
            data: {
                ...cuocHen,
                khungGio: khungGio || null,
                chuyenGia: chuyenGia || null,
                benhNhan: benhNhan || null
            }
        });
    } catch (error) {
        console.error("Error in getCuocHenTuVanById:", error);
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

// Lấy danh sách cuộc hẹn của chuyên gia dinh dưỡng
export const getCuocHenTuVanByChuyenGia = async (req, res) => {
    try {
        const { id_chuyen_gia } = req.params;
        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia });
        if (!chuyenGia) {
            return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại" });
        }
        const cuocHen = await CuocHenTuVan.findAll({ id_chuyen_gia });
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

        // Tạo thông báo cho bệnh nhân khi trạng thái thay đổi
        await createAppointmentNotification(
            cuocHen.id_benh_nhan,
            trang_thai,
            id_cuoc_hen,
            cuocHen.ngay_kham,
            null,
            cuocHen.id_chuyen_gia
        );

        // Tạo thông báo cho chuyên gia (nếu có) khi trạng thái thay đổi
        if (cuocHen.id_chuyen_gia && cuocHen.id_chuyen_gia !== cuocHen.id_benh_nhan) {
            await createAppointmentNotification(
                cuocHen.id_chuyen_gia,
                trang_thai,
                id_cuoc_hen,
                cuocHen.ngay_kham,
                null,
                cuocHen.id_chuyen_gia
            );
        }

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updated });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy lịch sử tư vấn đầy đủ theo ID bệnh nhân
export const getLichSuTuVanByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        
        if (!id_benh_nhan) {
            return res.status(400).json({ success: false, message: "Thiếu id_benh_nhan" });
        }

        // Kiểm tra bệnh nhân có tồn tại không
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        // Lấy tất cả cuộc hẹn tư vấn đã hoàn thành
        const cuocHenList = await CuocHenTuVan.findAll({ 
            id_benh_nhan, 
            trang_thai: "da_hoan_thanh" 
        });

        const lichSu = await Promise.all(
            cuocHenList.map(async (cuocHen) => {
                // Lấy thông tin chuyên gia dinh dưỡng
                const chuyenGia = cuocHen.id_chuyen_gia 
                    ? await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: cuocHen.id_chuyen_gia })
                    : null;

                // Lấy thông tin khung giờ
                const khungGio = await KhungGioKham.findOne({ 
                    id_khung_gio: cuocHen.id_khung_gio 
                });

                // Lấy hồ sơ dinh dưỡng cho cuộc hẹn này
                const hoSo = await HoSoDinhDuong.findOne({ 
                    id_cuoc_hen_tu_van: cuocHen.id_cuoc_hen 
                });

                // Lấy lịch sử tư vấn chi tiết
                const lichSuTuVan = await LichSuTuVan.findOne({ 
                    id_cuoc_hen: cuocHen.id_cuoc_hen 
                });

                return {
                    ...cuocHen,
                    chuyenGia: chuyenGia ? {
                        id_chuyen_gia: chuyenGia.id_chuyen_gia,
                        hoc_vi: chuyenGia.hoc_vi,
                        so_chung_chi_hang_nghe: chuyenGia.so_chung_chi_hang_nghe,
                        linh_vuc_chuyen_sau: chuyenGia.linh_vuc_chuyen_sau,
                        gioi_thieu_ban_than: chuyenGia.gioi_thieu_ban_than,
                        chuc_vu: chuyenGia.chuc_vu
                    } : null,
                    khungGio: khungGio ? {
                        id_khung_gio: khungGio.id_khung_gio,
                        gio_bat_dau: khungGio.gio_bat_dau,
                        gio_ket_thuc: khungGio.gio_ket_thuc
                    } : null,
                    hoSo: hoSo || null,
                    lichSuTuVan: lichSuTuVan || null
                };
            })
        );

        return res.status(200).json({ 
            success: true, 
            message: "Lấy lịch sử tư vấn thành công",
            data: lichSu 
        });

    } catch (error) {
        console.error("Error in getLichSuTuVanByBenhNhan:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
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

// Lấy cuộc hẹn theo ngày và ca
export const getCuocHenTuVanByDateAndCa = async (req, res) => {
    try {
        const { ngay, ca } = req.query;
        
        if (!ngay || !ca) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu tham số 'ngay' hoặc 'ca'" 
            });
        }

        // Set cache control headers để tránh 304 Not Modified
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        // Lấy tất cả cuộc hẹn theo ngày
        const cuocHenList = await CuocHenTuVan.findAll({ ngay_kham: ngay });
        
        // Lọc theo ca và lấy thông tin chi tiết
        const result = await Promise.all(
            cuocHenList.map(async (cuocHen) => {
                // Lấy thông tin khung giờ để kiểm tra ca
                const khungGio = await KhungGioKham.findOne({ 
                    id_khung_gio: cuocHen.id_khung_gio 
                });
                
                if (!khungGio) return null;
                
                // Kiểm tra ca dựa trên giờ bắt đầu
                let caKhungGio;
                const gioBatDau = khungGio.gio_bat_dau;
                
                if (gioBatDau >= '07:00' && gioBatDau < '12:00') {
                    caKhungGio = 'Sang';
                } else if (gioBatDau >= '13:00' && gioBatDau < '18:00') {
                    caKhungGio = 'Chieu';
                } else if (gioBatDau >= '18:00' && gioBatDau < '22:00') {
                    caKhungGio = 'Toi';
                } else {
                    caKhungGio = 'Khac';
                }
                
                // Chỉ trả về nếu ca khớp
                if (caKhungGio !== ca) return null;
                
                // Lấy thông tin bệnh nhân
                const benhNhan = await BenhNhan.findOne({ 
                    id_benh_nhan: cuocHen.id_benh_nhan 
                });
                const nguoiDung = await NguoiDung.findOne({ 
                    id_nguoi_dung: cuocHen.id_benh_nhan 
                });
                
                // Lấy thông tin chuyên gia nếu có
                let chuyenGia = null;
                if (cuocHen.id_chuyen_gia) {
                    chuyenGia = await ChuyenGiaDinhDuong.findOne({ 
                        id_chuyen_gia: cuocHen.id_chuyen_gia 
                    });
                }
                
                return {
                    ...cuocHen,
                    benhNhan: benhNhan ? {
                        ...benhNhan,
                        ho_ten: nguoiDung?.ho_ten || null,
                        gioi_tinh: nguoiDung?.gioi_tinh || null,
                        so_dien_thoai: nguoiDung?.so_dien_thoai || null,
                    } : null,
                    chuyenGia: chuyenGia || null,
                    khungGio: {
                        ...khungGio,
                        ca: caKhungGio
                    }
                };
            })
        );
        
        // Lọc bỏ các giá trị null
        const filteredResult = result.filter(item => item !== null);
        
        return res.status(200).json({ 
            success: true, 
            data: filteredResult 
        });
        
    } catch (error) {
        console.error("Error in getCuocHenTuVanByDateAndCa:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Đếm số lượng appointments đã đặt cho một khung giờ cụ thể (tư vấn)
export const countAppointmentsByTimeSlotTuVan = async (req, res) => {
    try {
        const { id_chuyen_gia, id_khung_gio, ngay_kham } = req.query;
        
        if (!id_chuyen_gia || !id_khung_gio || !ngay_kham) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu tham số bắt buộc: id_chuyen_gia, id_khung_gio, ngay_kham" 
            });
        }

        // Đếm số lượng appointments đã đặt (chỉ tính các trạng thái đã đặt hoặc đã hoàn thành)
        const appointments = await CuocHenTuVan.findAll({ 
            id_chuyen_gia,
            id_khung_gio,
            ngay_kham
        });

        // Lọc các appointments có trạng thái hợp lệ (đã đặt hoặc đã hoàn thành)
        const validAppointments = appointments.filter(apt => 
            apt.trang_thai === 'da_dat' || apt.trang_thai === 'da_hoan_thanh'
        );

        return res.status(200).json({ 
            success: true, 
            data: {
                count: validAppointments.length,
                max_count: 2 // Tối đa 2 người đặt
            }
        });
        
    } catch (error) {
        console.error("Error in countAppointmentsByTimeSlotTuVan:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả cuộc hẹn tư vấn
export const getAllCuocHenTuVan = async (req, res) => {
    try {
        const appointments = await CuocHenTuVan.getAll();
        return res.status(200).json({ 
            success: true, 
            data: appointments || [] 
        });
    } catch (error) {
        console.error("Error in getAllCuocHenTuVan:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};