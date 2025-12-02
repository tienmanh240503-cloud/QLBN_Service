import { CuocHenKhamBenh, BenhNhan, NguoiDung, BacSi, ChuyenKhoa, KhungGioKham, HoaDon, ChiTietDonThuoc, DonThuoc ,ChiTietHoaDon, HoSoKhamBenh , DichVu, ChiDinhXetNghiem, KetQuaXetNghiem, LichSuKham} from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import { createAppointmentNotification, createInvoiceNotification } from '../helpers/notificationHelper.js';
import { createDepositPaymentSession } from '../services/depositPayment.service.js';
import { refundMomoPayment } from '../services/payment.service.js';

const BOOKING_DEPOSIT_AMOUNT = Number(process.env.BOOKING_DEPOSIT_AMOUNT || 100000);
const BOOKING_DEPOSIT_TIMEOUT_MINUTES = Number(process.env.BOOKING_DEPOSIT_TIMEOUT_MINUTES || 1440);
const buildDepositDeadline = () => new Date(Date.now() + BOOKING_DEPOSIT_TIMEOUT_MINUTES * 60 * 1000);
const buildDepositHoldLabel = () => {
    if (BOOKING_DEPOSIT_TIMEOUT_MINUTES === 1440) {
        return '24 giờ';
    }
    if (BOOKING_DEPOSIT_TIMEOUT_MINUTES % 1440 === 0) {
        const days = BOOKING_DEPOSIT_TIMEOUT_MINUTES / 1440;
        return `${days} ngày`;
    }
    if (BOOKING_DEPOSIT_TIMEOUT_MINUTES % 60 === 0) {
        const hours = BOOKING_DEPOSIT_TIMEOUT_MINUTES / 60;
        return `${hours} giờ`;
    }
    return `${BOOKING_DEPOSIT_TIMEOUT_MINUTES} phút`;
};
const DEPOSIT_HOLD_LABEL = buildDepositHoldLabel();
const isStaffRole = (role = '') => {
    const normalized = role.toString().trim().toLowerCase();
    return ['nhan_vien_quay', 'admin', 'quan_tri_vien', 'bac_si'].includes(normalized);
};

const isExpiredDeposit = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline).getTime() < Date.now();
};

const cancelPendingAppointment = async (appointment) => {
    if (!appointment?.id_cuoc_hen) return;
    try {
        await CuocHenKhamBenh.update({ trang_thai: 'da_huy' }, appointment.id_cuoc_hen);
    } catch (error) {
        console.error('Failed to cancel pending appointment', appointment.id_cuoc_hen, error);
    }
    if (appointment.id_hoa_don_coc) {
        try {
            await HoaDon.update({ trang_thai: 'da_huy' }, appointment.id_hoa_don_coc);
        } catch (error) {
            console.error('Failed to cancel deposit invoice', appointment.id_hoa_don_coc, error);
        }
    }
};

const purgeExpiredPendingAppointments = async (appointments = []) => {
    const active = [];
    for (const appt of appointments) {
        if (appt?.trang_thai === 'cho_thanh_toan' && isExpiredDeposit(appt.thoi_han_thanh_toan)) {
            await cancelPendingAppointment(appt);
            continue;
        }
        active.push(appt);
    }
    return active;
};

const isRefundEligible = (ngay_kham) => {
    if (!ngay_kham) return false;
    const appointmentDate = new Date(ngay_kham);
    const diff = appointmentDate.getTime() - Date.now();
    return diff >= 7 * 24 * 60 * 60 * 1000;
};

const requestMomoRefundForInvoice = async (invoice, appointment) => {
    const method = (invoice?.phuong_thuc_thanh_toan || '').toLowerCase();
    if (method !== 'momo') {
        return true;
    }
    await HoaDon.update({ trang_thai: 'dang_hoan_tien' }, invoice.id_hoa_don);
    if (!invoice.ma_giao_dich) {
        console.error('Missing momo transaction id for refund', invoice.id_hoa_don);
        await HoaDon.update({ trang_thai: 'hoan_that_bai' }, invoice.id_hoa_don);
        return false;
    }
    const description = `Hoàn cọc cuộc hẹn khám ${appointment?.id_cuoc_hen || ''}`.trim();
    const refundResponse = await refundMomoPayment({
        orderId: invoice.id_hoa_don,
        amount: invoice.tong_tien,
        transId: invoice.ma_giao_dich,
        description,
    });
    if (!refundResponse.success) {
        console.error('Momo refund failed', {
            invoiceId: invoice.id_hoa_don,
            reason: refundResponse.message,
            code: refundResponse.resultCode,
        });
        await HoaDon.update({ trang_thai: 'hoan_that_bai' }, invoice.id_hoa_don);
        return false;
    }
    return true;
};

const createRefundInvoiceForKham = async (invoice, appointment) => {
    const refundId = `HD_${uuidv4()}`;
    await HoaDon.create({
        id_hoa_don: refundId,
        id_cuoc_hen_kham: invoice.id_cuoc_hen_kham,
        tong_tien: invoice.tong_tien,
        trang_thai: 'da_thanh_toan',
        phuong_thuc_thanh_toan: invoice.phuong_thuc_thanh_toan || 'tien_mat',
        loai_hoa_don: 'hoan_dat_coc',
        id_hoa_don_tham_chieu: invoice.id_hoa_don,
        thoi_gian_thanh_toan: new Date()
    });
    await createInvoiceNotification(appointment.id_benh_nhan, refundId, invoice.tong_tien);
};

const handleDepositCancellationForKham = async (appointment) => {
    if (!appointment?.id_hoa_don_coc) return;
    try {
        const invoice = await HoaDon.findOne({ id_hoa_don: appointment.id_hoa_don_coc });
        if (!invoice) return;

        if (invoice.trang_thai === 'chua_thanh_toan') {
            await HoaDon.update({ trang_thai: 'da_huy' }, invoice.id_hoa_don);
            return;
        }

        if (invoice.trang_thai === 'da_thanh_toan' && isRefundEligible(appointment.ngay_kham)) {
            const momoRefundOk = await requestMomoRefundForInvoice(invoice, appointment);
            if (!momoRefundOk) {
                return;
            }
            await HoaDon.update({ trang_thai: 'da_hoan_tien' }, invoice.id_hoa_don);
            await createRefundInvoiceForKham(invoice, appointment);
        }
    } catch (error) {
        console.error('Failed to handle deposit cancellation for appointment', appointment?.id_cuoc_hen, error);
    }
};
// Tạo cuộc hẹn khám bệnh
export const createCuocHenKham = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const vai_tro = req.decoded.vai_tro;
        const { id_benh_nhan, id_bac_si, id_chuyen_khoa, id_khung_gio, ngay_kham, loai_hen, ly_do_kham, trieu_chung } = req.body;

        if (!id_khung_gio || !ngay_kham) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        let idBenhNhanFinal = id_nguoi_dung;
        const normalizedRole = (vai_tro || '').toString().trim().toLowerCase();
        const canSelectPatient = ["nhan_vien_quay", "admin", "quan_tri_vien"].includes(normalizedRole);

        if (canSelectPatient && id_benh_nhan) {
            idBenhNhanFinal = id_benh_nhan;
        }

        let benhNhan = await BenhNhan.getById(idBenhNhanFinal);
        if (!benhNhan) {
            benhNhan = await BenhNhan.findOne({ id_benh_nhan : idBenhNhanFinal });
        }
        if (!benhNhan) {
            return res.status(404).json({ success: false, message: "Bệnh nhân không tồn tại" });
        }

        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) {
            return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại" });
        }

        if (id_chuyen_khoa) {
            const ck = await ChuyenKhoa.findOne({ id_chuyen_khoa });
            if (!ck) {
                return res.status(404).json({ success: false, message: "Chuyên khoa không tồn tại" });
            }
        }

        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) {
            return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });
        }

        const allLichRaw = await CuocHenKhamBenh.findAll({ 
            id_benh_nhan: idBenhNhanFinal,
            id_khung_gio, 
            ngay_kham
        });
        const allLich = await purgeExpiredPendingAppointments(allLichRaw);
        const lich = allLich.find(l => l.trang_thai !== 'da_huy');
        if (lich) {
            return res.status(400).json({ success: false, message: "Bệnh nhân đã có cuộc hẹn trong khung giờ này" });
        }

        const Id = `CH_${uuidv4()}`;
        const invoiceId = `HD_${uuidv4()}`;
        const depositDeadline = buildDepositDeadline();

        const cuocHen = await CuocHenKhamBenh.create({
            id_benh_nhan : idBenhNhanFinal,
            id_cuoc_hen : Id,
            id_bac_si : id_bac_si|| null,
            id_chuyen_khoa: id_chuyen_khoa || null,
            id_khung_gio,
            ngay_kham,
            loai_hen: loai_hen || "truc_tiep",
            ly_do_kham: ly_do_kham || null,
            trieu_chung: trieu_chung || null,
            trang_thai: "cho_thanh_toan",
            id_hoa_don_coc: invoiceId,
            thoi_han_thanh_toan: depositDeadline
        });

        await HoaDon.create({
            id_hoa_don : invoiceId,
            id_cuoc_hen_kham: Id,
            tong_tien: BOOKING_DEPOSIT_AMOUNT,
            trang_thai: 'chua_thanh_toan',
            loai_hoa_don: 'dat_coc',
            thoi_han_thanh_toan: depositDeadline
        });

        await createAppointmentNotification(
            idBenhNhanFinal,
            'cho_thanh_toan',
            Id,
            ngay_kham,
            null,
            null
        );

        const createdAppointment = await CuocHenKhamBenh.findOne({ id_cuoc_hen: Id }) || cuocHen;

        return res.status(201).json({ 
            success: true, 
            message: `Đã ghi nhận yêu cầu đặt lịch. Vui lòng thanh toán cọc ${BOOKING_DEPOSIT_AMOUNT.toLocaleString('vi-VN')} VNĐ trong ${DEPOSIT_HOLD_LABEL}`, 
            data: {
                ...createdAppointment,
                deposit: {
                    invoice_id: invoiceId,
                    amount: BOOKING_DEPOSIT_AMOUNT,
                    payment_url: null,
                    qr_code_url: null,
                    order_id: null,
                    expires_at: depositDeadline.toISOString(),
                    provider: 'momo',
                    mode: null,
                    instructions: null
                }
            } 
        });

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
                let bacSi = null;
                let bacSiInfo = null;
                if (cuocHen.id_bac_si) {
                    bacSi = await BacSi.findOne({ id_bac_si: cuocHen.id_bac_si });
                    // Lấy thông tin từ nguoidung để có ho_ten
                    if (bacSi) {
                        bacSiInfo = await NguoiDung.findOne({ id_nguoi_dung: cuocHen.id_bac_si });
                    }
                }

                // Lấy thông tin chuyên khoa
                const chuyenKhoa = cuocHen.id_chuyen_khoa 
                    ? await ChuyenKhoa.findOne({ id_chuyen_khoa: cuocHen.id_chuyen_khoa })
                    : null;

                // Lấy thông tin khung giờ
                const khungGio = await KhungGioKham.findOne({ 
                    id_khung_gio: cuocHen.id_khung_gio 
                });

                // Lấy hồ sơ khám bệnh cho cuộc hẹn này
                // 1 bệnh nhân chỉ có 1 hồ sơ khám bệnh, nên tìm trực tiếp theo id_benh_nhan
                // Hoặc tìm qua lichsukham nếu cuộc hẹn đã có lịch sử khám
                let hoSo = null;
                
                // Thử tìm qua lichsukham trước (nếu cuộc hẹn đã được khám)
                const lichSuKham = await LichSuKham.findOne({ 
                    id_cuoc_hen: cuocHen.id_cuoc_hen 
                });
                
                if (lichSuKham && lichSuKham.id_ho_so) {
                    hoSo = await HoSoKhamBenh.findOne({ 
                        id_ho_so: lichSuKham.id_ho_so 
                    });
                }
                
                // Nếu không tìm thấy qua lichsukham, tìm trực tiếp theo id_benh_nhan
                if (!hoSo) {
                    hoSo = await HoSoKhamBenh.findOne({ 
                        id_benh_nhan: cuocHen.id_benh_nhan 
                    });
                }

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

                // Lấy chỉ định xét nghiệm cho cuộc hẹn này
                let chiDinhXetNghiem = [];
                const chiDinhList = await ChiDinhXetNghiem.findAll({ 
                    id_cuoc_hen: cuocHen.id_cuoc_hen 
                });
                
                if (chiDinhList && chiDinhList.length > 0) {
                    chiDinhXetNghiem = await Promise.all(
                        chiDinhList.map(async (chiDinh) => {
                            // Lấy kết quả xét nghiệm nếu có
                            const ketQua = await KetQuaXetNghiem.findOne({ 
                                id_chi_dinh: chiDinh.id_chi_dinh 
                            });
                            
                            return {
                                ...chiDinh,
                                ket_qua: ketQua || null
                            };
                        })
                    );
                }

                return {
                    ...cuocHen,
                    bacSi: bacSi ? {
                        id_bac_si: bacSi.id_bac_si,
                        ho_ten: bacSiInfo?.ho_ten || null,
                        bang_cap: bacSi.bang_cap,
                        kinh_nghiem: bacSi.kinh_nghiem || bacSi.so_nam_kinh_nghiem,
                        chuyen_mon: bacSi.chuyen_mon,
                        chuc_danh: bacSi.chuc_danh,
                        chuc_vu: bacSi.chuc_vu
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
                    chiTietDonThuoc,
                    chiDinhXetNghiem
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
        const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        const updated = await CuocHenKhamBenh.update({trang_thai}, id_cuoc_hen);

        if (trang_thai === 'da_huy') {
            await handleDepositCancellationForKham(cuocHen);
        }

        // Tạo thông báo cho bệnh nhân khi trạng thái thay đổi
        await createAppointmentNotification(
            cuocHen.id_benh_nhan,
            trang_thai,
            id_cuoc_hen,
            cuocHen.ngay_kham,
            cuocHen.id_bac_si,
            null
        );

        // Tạo thông báo cho bác sĩ (nếu có) khi trạng thái thay đổi
        if (cuocHen.id_bac_si && cuocHen.id_bac_si !== cuocHen.id_benh_nhan) {
            await createAppointmentNotification(
                cuocHen.id_bac_si,
                trang_thai,
                id_cuoc_hen,
                cuocHen.ngay_kham,
                cuocHen.id_bac_si,
                null
            );
        }

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updated });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const createCuocHenKhamDepositPaymentSession = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const requesterId = req?.decoded?.info?.id_nguoi_dung;
        const role = req?.decoded?.vai_tro || '';

        const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen });
        if (!cuocHen) {
            return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });
        }

        const isOwner = cuocHen.id_benh_nhan === requesterId;
        if (!isOwner && !isStaffRole(role)) {
            return res.status(403).json({ success: false, message: "Không có quyền khởi tạo thanh toán cho cuộc hẹn này" });
        }

        if (!cuocHen.id_hoa_don_coc) {
            return res.status(400).json({ success: false, message: "Cuộc hẹn chưa có hóa đơn cọc" });
        }

        const invoice = await HoaDon.findOne({ id_hoa_don: cuocHen.id_hoa_don_coc });
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn cọc" });
        }

        if (invoice.trang_thai === 'da_thanh_toan') {
            return res.status(400).json({ success: false, message: "Hóa đơn đã được thanh toán" });
        }

        if (invoice.trang_thai === 'da_huy') {
            return res.status(400).json({ success: false, message: "Hóa đơn đã bị hủy" });
        }

        const deadline = cuocHen.thoi_han_thanh_toan
            ? new Date(cuocHen.thoi_han_thanh_toan)
            : buildDepositDeadline();

        const session = await createDepositPaymentSession({
            invoiceId: invoice.id_hoa_don,
            appointmentId: cuocHen.id_cuoc_hen,
            appointmentType: 'kham_benh',
            depositDeadline: deadline,
            patientId: cuocHen.id_benh_nhan,
            doctorId: cuocHen.id_bac_si || null,
            specialistId: null
        });

        return res.status(200).json({
            success: true,
            data: {
                ...session,
                invoice_id: invoice.id_hoa_don,
                amount: invoice.tong_tien
            }
        });
    } catch (error) {
        console.error('Error creating deposit payment session:', error);
        return res.status(500).json({ success: false, message: "Lỗi server khi khởi tạo thanh toán", error: error.message });
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

        // Set cache control headers để tránh 304 Not Modified
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

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

// Đếm số lượng appointments đã đặt cho một khung giờ cụ thể
export const countAppointmentsByTimeSlot = async (req, res) => {
    try {
        const { id_bac_si, id_khung_gio, ngay_kham } = req.query;
        
        if (!id_bac_si || !id_khung_gio || !ngay_kham) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu tham số bắt buộc: id_bac_si, id_khung_gio, ngay_kham" 
            });
        }

        // Đếm số lượng appointments đã đặt (chỉ tính các trạng thái đã đặt hoặc đã hoàn thành)
        const appointments = await CuocHenKhamBenh.findAll({ 
            id_bac_si,
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
        console.error("Error in countAppointmentsByTimeSlot:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};

// Lấy tất cả cuộc hẹn khám bệnh
export const getAllCuocHenKhamBenh = async (req, res) => {
    try {
        const appointments = await CuocHenKhamBenh.getAll();
        return res.status(200).json({ 
            success: true, 
            data: appointments || [] 
        });
    } catch (error) {
        console.error("Error in getAllCuocHenKhamBenh:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Lỗi server", 
            error: error.message 
        });
    }
};