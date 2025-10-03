import { CuocHenKhamBenh, BenhNhan, NguoiDung, BacSi, ChuyenKhoa, KhungGioKham, HoaDon, ChiTietDonThuoc, DonThuoc ,ChiTietHoaDon, HoSoKhamBenh , DichVu} from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
// Tạo cuộc hẹn khám bệnh
export const createCuocHenKham = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;

        const { id_benh_nhan, id_chuyen_khoa, id_khung_gio, ngay_kham, loai_hen, ly_do_kham, trieu_chung } = req.body;

        if (!id_benh_nhan || !id_khung_gio || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra bệnh nhân
        const benhNhan = await NguoiDung.findOne({ id_nguoi_dung :  id_benh_nhan });
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        // Kiểm tra bác sĩ (nếu có)
        if (id_nguoi_dung) {
            const bacSi = await BacSi.findOne({ id_bac_si : id_nguoi_dung });
            if (!bacSi) {
                return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại" });
            }
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

        // Check trùng lịch cho bệnh nhân
        const lich = await CuocHenKhamBenh.findOne({ id_benh_nhan, id_khung_gio, ngay_kham });
        if (lich) {
            return res.status(400).json({ success: false, message: "Bệnh nhân đã có cuộc hẹn trong khung giờ này" });
        }

        const Id = `CH_${uuidv4()}`;
        // ✅ Tạo cuộc hẹn
        const cuocHen = await CuocHenKhamBenh.create({
            id_cuoc_hen : Id,
            id_benh_nhan,
            id_bac_si: id_nguoi_dung || null,
            id_chuyen_khoa: id_chuyen_khoa || null,
            id_khung_gio,
            ngay_kham,
            loai_hen: loai_hen || "kham_moi",
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

        const hoSo = await HoSoKhamBenh.findOne({ id_benh_nhan});

        // Lấy tất cả cuộc hẹn
        const cuocHenList = await CuocHenKhamBenh.findAll({ id_benh_nhan , trang_thai : "da_hoan_thanh" });
        const lichSu = await Promise.all(
          cuocHenList.map(async (cuocHen) => {
            // Lấy hóa đơn kèm chi tiết
            const hoaDon = await HoaDon.findOne({ id_cuoc_hen_kham: cuocHen.id_cuoc_hen });

            let chiTietHoaDon = [];
            if (hoaDon) {
              const chiTietList = await ChiTietHoaDon.findAll({ id_hoa_don: hoaDon.id_hoa_don });
            
              // Lấy tên dịch vụ cho mỗi chi tiết
              chiTietHoaDon = await Promise.all(
                chiTietList.map(async (chiTiet) => {
                  const dichVu = await DichVu.findOne({ id_dich_vu: chiTiet.id_dich_vu });
                  return {
                    ...chiTiet,
                    ten_dich_vu: dichVu?.ten_dich_vu || null
                  };
                })
              );
            }
        
            // Lấy đơn thuốc kèm chi tiết
            const donThuoc = await DonThuoc.findOne({ id_ho_so: hoSo.id_ho_so });
            const chiTietDonThuoc = donThuoc
              ? await ChiTietDonThuoc.findAll({ id_don_thuoc: donThuoc.id_don_thuoc })
              : [];
        
            return {
              ...cuocHen,
              hoaDon: hoaDon || null,
              chiTietHoaDon,
              donThuoc: donThuoc || null,
              chiTietDonThuoc
            };
          })
        );


        return res.status(200).json({ success: true, data: lichSu });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
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

        const updated = await CuocHenKhamBenh.update(trang_thai, id_cuoc_hen);
        console.log(updated);
        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updated });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa
export const deleteCuocHenKham = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;

        const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        await CuocHenKhamBenh.delete(id_cuoc_hen);

        return res.status(200).json({ success: true, message: "Xóa cuộc hẹn thành công" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
