import { CuocHenKhamBenh, BenhNhan, NguoiDung, BacSi, ChuyenKhoa, KhungGioKham, HoaDon, ChiTietDonThuoc, DonThuoc ,ChiTietHoaDon, HoSoKhamBenh , DichVu} from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
// Tạo cuộc hẹn khám bệnh
export const createCuocHenKham = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const { id_bac_si, id_chuyen_khoa, id_khung_gio, ngay_kham, loai_hen, ly_do_kham, trieu_chung } = req.body;

        if (!id_khung_gio || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra bệnh nhân
        const benhNhan = await BenhNhan.findOne({ id_benh_nhan : id_nguoi_dung });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) {
            return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại" });
        }

        // Kiểm tra chuyên khoa (nếu có)
        if (id_chuyen_khoa) {
            const ck = await ChuyenKhoa.findOne({ id_chuyen_khoa });
            if (!ck) {
                return res.status(404).json({ success: false, message: "Chuyên khoa không tồn tại" });
            }
        }

        // Kiểm tra khung giờ
        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) {
            return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });
        }
        console.log(khungGio);
        // Check trùng lịch cho bệnh nhân
        const lich = await CuocHenKhamBenh.findOne({ id_bac_si , id_khung_gio, ngay_kham });
        if (lich) {
            return res.status(400).json({ success: false, message: "Bệnh nhân đã có cuộc hẹn trong khung giờ này" });
        }

        console.log(lich);
        const Id = `CH_${uuidv4()}`;
        // ✅ Tạo cuộc hẹn
        const cuocHen = await CuocHenKhamBenh.create({
            id_benh_nhan : id_nguoi_dung,
            id_cuoc_hen : Id,
            id_bac_si : id_bac_si|| null,
            id_chuyen_khoa: id_chuyen_khoa || null,
            id_khung_gio,
            ngay_kham,
            loai_hen: loai_hen || "truc_tiep",
            ly_do_kham: ly_do_kham || null,
            trieu_chung: trieu_chung || null,
            trang_thai: "da_dat"
        });

        return res.status(201).json({ success: true, message: "Tạo cuộc hẹn khám bệnh thành công", data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
///Lich su kham benh
export const getLichSuKhamBenhFull = async (req, res) => {
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

        // Lấy tất cả cuộc hẹn đã hoàn thành
        const cuocHenList = await CuocHenKhamBenh.findAll({ 
            id_benh_nhan, 
            trang_thai: "da_hoan_thanh" 
        });

        const lichSu = await Promise.all(
            cuocHenList.map(async (cuocHen) => {
                // Lấy thông tin bác sĩ
                const bacSi = cuocHen.id_bac_si 
                    ? await BacSi.findOne({ id_bac_si: cuocHen.id_bac_si })
                    : null;

                // Lấy thông tin chuyên khoa
                const chuyenKhoa = cuocHen.id_chuyen_khoa 
                    ? await ChuyenKhoa.findOne({ id_chuyen_khoa: cuocHen.id_chuyen_khoa })
                    : null;

                // Lấy thông tin khung giờ
                const khungGio = await KhungGioKham.findOne({ 
                    id_khung_gio: cuocHen.id_khung_gio 
                });

                // Lấy hồ sơ khám bệnh cho cuộc hẹn này
                const hoSo = await HoSoKhamBenh.findOne({ 
                    id_cuoc_hen_kham: cuocHen.id_cuoc_hen 
                });

                // Lấy hóa đơn kèm chi tiết
                const hoaDon = await HoaDon.findOne({ 
                    id_cuoc_hen_kham: cuocHen.id_cuoc_hen 
                });

                let chiTietHoaDon = [];
                if (hoaDon) {
                    const chiTietList = await ChiTietHoaDon.findAll({ 
                        id_hoa_don: hoaDon.id_hoa_don 
                    });
                
                    // Lấy tên dịch vụ cho mỗi chi tiết
                    chiTietHoaDon = await Promise.all(
                        chiTietList.map(async (chiTiet) => {
                            const dichVu = await DichVu.findOne({ 
                                id_dich_vu: chiTiet.id_dich_vu 
                            });
                            return {
                                ...chiTiet,
                                ten_dich_vu: dichVu?.ten_dich_vu || null
                            };
                        })
                    );
                }

                // Lấy đơn thuốc từ hồ sơ của cuộc hẹn này
                let donThuoc = null;
                let chiTietDonThuoc = [];
                
                if (hoSo) {
                    donThuoc = await DonThuoc.findOne({ 
                        id_ho_so: hoSo.id_ho_so 
                    });
                    
                    if (donThuoc) {
                        chiTietDonThuoc = await ChiTietDonThuoc.findAll({ 
                            id_don_thuoc: donThuoc.id_don_thuoc 
                        });
                    }
                }

                return {
                    ...cuocHen,
                    bacSi: bacSi ? {
                        id_bac_si: bacSi.id_bac_si,
                        bang_cap: bacSi.bang_cap,
                        kinh_nghiem: bacSi.kinh_nghiem
                    } : null,
                    chuyenKhoa: chuyenKhoa ? {
                        id_chuyen_khoa: chuyenKhoa.id_chuyen_khoa,
                        ten_chuyen_khoa: chuyenKhoa.ten_chuyen_khoa,
                        mo_ta: chuyenKhoa.mo_ta
                    } : null,
                    khungGio: khungGio ? {
                        id_khung_gio: khungGio.id_khung_gio,
                        gio_bat_dau: khungGio.gio_bat_dau,
                        gio_ket_thuc: khungGio.gio_ket_thuc
                    } : null,
                    hoSo: hoSo || null,
                    hoaDon: hoaDon || null,
                    chiTietHoaDon,
                    donThuoc: donThuoc || null,
                    chiTietDonThuoc
                };
            })
        );

        return res.status(200).json({ 
            success: true, 
            message: "Lấy lịch sử khám bệnh thành công",
            data: lichSu 
        });

    } catch (error) {
        console.error("Error in getLichSuKhamBenhFull:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả cuộc hẹn theo bệnh nhân
export const getCuocHenKhamByBenhNhan = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;

        const benhNhan = await BenhNhan.findOne({ id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        const cuocHen = await CuocHenKhamBenh.findAll({ id_benh_nhan });

        return res.status(200).json({ success: true, data: cuocHen });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
export const getCuocHenKhamById = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuoc Hen không tồn tại" });
        }
        const khungGio = await KhungGioKham.findOne({ id_khung_gio : cuocHen.id_khung_gio});
        const cuocHenWithTime = {
            ...cuocHen, // nếu dùng Mongoose
            khungGio: khungGio ? {
                gio_bat_dau: khungGio.gio_bat_dau,
                gio_ket_thuc: khungGio.gio_ket_thuc
            } : null
        };

        return res.status(200).json({ success: true, data: cuocHenWithTime });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả cuộc hẹn theo bác sĩ
export const getCuocHenKhamByBacSi = async (req, res) => {
    try {
        const { id_bac_si } = req.params;

        // Kiểm tra bác sĩ có tồn tại không
        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) {
            return res.status(404).json({ 
                success: false, 
                message: "Bác sĩ không tồn tại" 
            });
        }
         const cuocHenList = await CuocHenKhamBenh.findAll({ id_bac_si });
        // Lấy tất cả cuộc hẹn theo bác sĩ
        const result = await Promise.all(
          cuocHenList.map(async (cuocHen) => {
            const benhNhan = await BenhNhan.findOne({ id_benh_nhan: cuocHen.id_benh_nhan });

            const nguoiDung = await NguoiDung.findOne({ id_nguoi_dung: cuocHen.id_benh_nhan });

            const khungGio = await KhungGioKham.findOne({id_khung_gio: cuocHen.id_khung_gio });

            return {
              ...cuocHen,
              benhNhan : {
                ...benhNhan,
                ho_ten: nguoiDung?.ho_ten || null,
                gioi_tinh: nguoiDung?.gioi_tinh || null,
                so_dien_thoai : nguoiDung?.so_dien_thoai || null,
              }, 
              khungGio, 
            };
          })
        );
        return res.status(200).json({ 
            success: true, 
            data: result 
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};


export const getCuocHenByBenhNhanAndTrangThai = async (req, res) => {
    try {
        const { id_benh_nhan } = req.params;
        const { trang_thai } = req.body; 
        if (!id_benh_nhan) {
            return res.status(400).json({ success: false, message: "Thiếu id_benh_nhan" });
        }
        const cuocHen = await CuocHenKhamBenh.findAll({id_benh_nhan, trang_thai });
        return res.status(200).json({ success: true, data: cuocHen });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật trạng thái
export const updateTrangThaiCuocHenKham = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const { trang_thai } = req.body;
        console.log(trang_thai);
        const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        const updated = await CuocHenKhamBenh.update({trang_thai}, id_cuoc_hen);
        console.log(updated);
        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updated });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy cuộc hẹn theo ngày và ca
export const getCuocHenKhamByDateAndCa = async (req, res) => {
    try {
        const { ngay, ca } = req.query;
        
        if (!ngay || !ca) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu tham số 'ngay' hoặc 'ca'" 
            });
        }

        // Lấy tất cả cuộc hẹn theo ngày
        const cuocHenList = await CuocHenKhamBenh.findAll({ ngay_kham: ngay });
        
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
                
                return {
                    ...cuocHen,
                    benhNhan: benhNhan ? {
                        ...benhNhan,
                        ho_ten: nguoiDung?.ho_ten || null,
                        gioi_tinh: nguoiDung?.gioi_tinh || null,
                        so_dien_thoai: nguoiDung?.so_dien_thoai || null,
                    } : null,
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
        console.error("Error in getCuocHenKhamByDateAndCa:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};
