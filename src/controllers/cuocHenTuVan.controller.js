import { CuocHenTuVan, BenhNhan, ChuyenGiaDinhDuong, KhungGioKham, HoSoDinhDuong, LichSuTuVan, NguoiDung, HoaDon, LichLamViec, PhongKham } from "../models/index.js";
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

// Số lượng tối đa cho mỗi khung giờ tư vấn 
const MAX_CONSULTATIONS_PER_SLOT = 2;

const isStaffRole = (role = '') => {
    const normalized = role.toString().trim().toLowerCase();
    return ['nhan_vien_quay', 'admin', 'quan_tri_vien', 'chuyen_gia_dinh_duong'].includes(normalized);
};

const isExpiredDeposit = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline).getTime() < Date.now();
};

const getCaFromGioBatDau = (gioBatDau) => {
    if (!gioBatDau) return null;
    if (gioBatDau >= '07:00' && gioBatDau < '12:00') return 'Sang';
    if (gioBatDau >= '13:00' && gioBatDau < '18:00') return 'Chieu';
    if (gioBatDau >= '18:00' && gioBatDau < '22:00') return 'Toi';
    return 'Khac';
};

const buildPhongKhamForConsultation = async (cuocHen) => {
    try {
        if (!cuocHen?.id_chuyen_gia || !cuocHen?.id_khung_gio || !cuocHen?.ngay_kham) {
            return null;
        }

        const khungGio = await KhungGioKham.findOne({ id_khung_gio: cuocHen.id_khung_gio });
        if (!khungGio) return null;

        const ca = getCaFromGioBatDau(khungGio.gio_bat_dau);
        const lich = await LichLamViec.findOne({
            id_nguoi_dung: cuocHen.id_chuyen_gia,
            ngay_lam_viec: cuocHen.ngay_kham,
            ca
        });

        if (!lich?.id_phong_kham) return null;

        const phongKham = await PhongKham.getById(lich.id_phong_kham);
        if (!phongKham) return null;

        return {
            id_phong_kham: phongKham.id_phong_kham,
            ten_phong: phongKham.ten_phong,
            so_phong: phongKham.so_phong,
            tang: phongKham.tang,
            ten_chuyen_khoa: phongKham.ten_chuyen_khoa,
            ten_chuyen_nganh: phongKham.ten_chuyen_nganh
        };
    } catch (error) {
        console.error('Failed to build phong_kham for cuoc hen tu van', cuocHen?.id_cuoc_hen, error);
        return null;
    }
};

const cancelPendingConsultation = async (appointment) => {
    if (!appointment?.id_cuoc_hen) return;
    try {
        await CuocHenTuVan.update({ trang_thai: 'da_huy' }, appointment.id_cuoc_hen);
    } catch (error) {
        console.error('Failed to cancel pending consultation', appointment.id_cuoc_hen, error);
    }
    if (appointment.id_hoa_don_coc) {
        try {
            await HoaDon.update({ trang_thai: 'da_huy' }, appointment.id_hoa_don_coc);
        } catch (error) {
            console.error('Failed to cancel deposit invoice for consultation', appointment.id_hoa_don_coc, error);
        }
    }
};

const purgeExpiredPendingConsultations = async (appointments = []) => {
    const filtered = [];
    for (const appt of appointments) {
        if (appt?.trang_thai === 'cho_thanh_toan' && isExpiredDeposit(appt.thoi_han_thanh_toan)) {
            await cancelPendingConsultation(appt);
            continue;
        }
        filtered.push(appt);
    }
    return filtered;
};

const isRefundEligible = (ngay_kham) => {
    if (!ngay_kham) return false;
    const appointmentDate = new Date(ngay_kham);
    return appointmentDate.getTime() - Date.now() >= 7 * 24 * 60 * 60 * 1000;
};

const requestMomoRefundForConsultation = async (invoice, appointment) => {
    const method = (invoice?.phuong_thuc_thanh_toan || '').toLowerCase();
    if (method !== 'momo') {
        // Nếu không phải Momo, không cần hoàn tiền qua Momo API
        return true;
    }
    await HoaDon.update({ trang_thai: 'dang_hoan_tien' }, invoice.id_hoa_don);
    if (!invoice.ma_giao_dich) {
        console.error('Missing momo transaction id for consultation refund', {
            invoiceId: invoice.id_hoa_don,
            phuong_thuc: invoice.phuong_thuc_thanh_toan,
        });
        await HoaDon.update({ trang_thai: 'hoan_that_bai' }, invoice.id_hoa_don);
        return { success: false, reason: 'missing_transaction_id' };
    }
    const description = `Hoàn cọc cuộc hẹn tư vấn ${appointment?.id_cuoc_hen || ''}`.trim();
    const refundResponse = await refundMomoPayment({
        orderId: invoice.id_hoa_don,
        amount: invoice.tong_tien,
        transId: invoice.ma_giao_dich,
        description,
    });
    if (!refundResponse.success) {
        console.error('Momo refund failed (consultation)', {
            invoiceId: invoice.id_hoa_don,
            reason: refundResponse.message,
            code: refundResponse.resultCode,
        });
        await HoaDon.update({ trang_thai: 'hoan_that_bai' }, invoice.id_hoa_don);
        return { success: false, reason: 'refund_api_failed', message: refundResponse.message };
    }
    return { success: true };
};

const createRefundInvoiceForConsultation = async (invoice, appointment) => {
    const refundId = `HD_${uuidv4()}`;
    await HoaDon.create({
        id_hoa_don: refundId,
        id_cuoc_hen_tu_van: invoice.id_cuoc_hen_tu_van,
        tong_tien: invoice.tong_tien,
        trang_thai: 'da_thanh_toan',
        phuong_thuc_thanh_toan: invoice.phuong_thuc_thanh_toan || 'tien_mat',
        loai_hoa_don: 'hoan_dat_coc',
        id_hoa_don_tham_chieu: invoice.id_hoa_don,
        thoi_gian_thanh_toan: new Date()
    });
    await createInvoiceNotification(appointment.id_benh_nhan, refundId, invoice.tong_tien);
};

const handleDepositCancellationForTuVan = async (appointment) => {
    if (!appointment?.id_hoa_don_coc) {
        return { refunded: false, message: null, amount: null };
    }
    try {
        const invoice = await HoaDon.findOne({ id_hoa_don: appointment.id_hoa_don_coc });
        if (!invoice) {
            return { refunded: false, message: null, amount: null };
        }

        if (invoice.trang_thai === 'chua_thanh_toan') {
            await HoaDon.update({ trang_thai: 'da_huy' }, invoice.id_hoa_don);
            return { refunded: false, message: 'Hóa đơn cọc chưa thanh toán, không cần hoàn tiền', amount: null };
        }

        if (invoice.trang_thai === 'da_thanh_toan' && isRefundEligible(appointment.ngay_kham)) {
            const refundResult = await requestMomoRefundForConsultation(invoice, appointment);
            if (!refundResult || (typeof refundResult === 'object' && !refundResult.success)) {
                let errorMessage = 'Không thể hoàn tiền cọc. Vui lòng liên hệ bộ phận hỗ trợ.';
                if (refundResult?.reason === 'missing_transaction_id') {
                    errorMessage = 'Không tìm thấy mã giao dịch để hoàn tiền. Vui lòng liên hệ bộ phận hỗ trợ với mã hóa đơn: ' + invoice.id_hoa_don;
                } else if (refundResult?.message) {
                    errorMessage = `Không thể hoàn tiền: ${refundResult.message}. Vui lòng liên hệ bộ phận hỗ trợ.`;
                }
                return { refunded: false, message: errorMessage, amount: invoice.tong_tien };
            }
            await HoaDon.update({ trang_thai: 'da_hoan_tien' }, invoice.id_hoa_don);
            await createRefundInvoiceForConsultation(invoice, appointment);
            return { 
                refunded: true, 
                message: `Đã hoàn tiền cọc ${parseFloat(invoice.tong_tien || 0).toLocaleString('vi-VN')} đ vào tài khoản của bạn. Vui lòng kiểm tra tài khoản.`, 
                amount: invoice.tong_tien 
            };
        } else if (invoice.trang_thai === 'da_thanh_toan' && !isRefundEligible(appointment.ngay_kham)) {
            return { 
                refunded: false, 
                message: 'Không thể hoàn tiền cọc vì đã quá thời hạn hủy. Vui lòng liên hệ bộ phận hỗ trợ.', 
                amount: invoice.tong_tien 
            };
        }
        
        return { refunded: false, message: null, amount: null };
    } catch (error) {
        console.error('Failed to handle consultation deposit cancellation', appointment?.id_cuoc_hen, error);
        return { refunded: false, message: 'Lỗi khi xử lý hoàn tiền cọc. Vui lòng liên hệ bộ phận hỗ trợ.', amount: null };
    }
};

// Tạo cuộc hẹn tư vấn dinh dưỡng
export const createCuocHenTuVan = async (req, res) => {
    try {
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        const vai_tro = req.decoded.vai_tro;

        const { id_benh_nhan, id_chuyen_gia, id_khung_gio, ngay_kham, loai_dinh_duong, loai_hen, ly_do_tu_van } = req.body;

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

        const chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia});
        if (!chuyenGia) return res.status(404).json({ success: false, message: "Chuyên gia không tồn tại" });

        const khungGio = await KhungGioKham.findOne({ id_khung_gio });
        if (!khungGio) return res.status(404).json({ success: false, message: "Khung giờ không tồn tại" });

        // Normalize ngày để tránh vấn đề timezone
        const normalizeDate = (dateStr) => {
            if (!dateStr) return null;
            // Nếu đã là format YYYY-MM-DD, return trực tiếp
            if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return dateStr;
            }
            try {
                // Nếu là Date object hoặc ISO string, parse và format lại
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch {
                return dateStr;
            }
        };

        const normalizedDate = normalizeDate(ngay_kham);

        const lichRaw = await CuocHenTuVan.findAll({ id_chuyen_gia, id_khung_gio, ngay_kham: normalizedDate });
        const lichList = await purgeExpiredPendingConsultations(lichRaw);
        const lichConHieuLuc = lichList.filter(item => item.trang_thai !== 'da_huy');

        // Giới hạn số lượt đặt/khung giờ theo MAX_CONSULTATIONS_PER_SLOT (đồng bộ FE)
        if (lichConHieuLuc.length >= MAX_CONSULTATIONS_PER_SLOT) {
            return res.status(400).json({ success: false, message: "Khung giờ đã đủ số lượng đặt" });
        }

        const Id = `CH_${uuidv4()}`;
        const invoiceId = `HD_${uuidv4()}`;
        const depositDeadline = buildDepositDeadline();

        const cuocHen = await CuocHenTuVan.create({
            id_cuoc_hen : Id,
            id_benh_nhan : idBenhNhanFinal,
            id_chuyen_gia: id_chuyen_gia || null,
            id_khung_gio,
            ngay_kham: normalizedDate,
            loai_dinh_duong,
            loai_hen: loai_hen || 'truc_tiep',
            ly_do_tu_van,
            trang_thai: 'cho_thanh_toan',
            id_hoa_don_coc: invoiceId,
            thoi_han_thanh_toan: depositDeadline
        });

        await HoaDon.create({
            id_hoa_don : invoiceId,
            id_cuoc_hen_tu_van: Id,
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

        const createdAppointment = await CuocHenTuVan.findOne({ id_cuoc_hen: Id }) || cuocHen;

        return res.status(201).json({ success: true, message: `Đã ghi nhận yêu cầu tư vấn. Vui lòng thanh toán cọc ${BOOKING_DEPOSIT_AMOUNT.toLocaleString('vi-VN')} VNĐ trong ${DEPOSIT_HOLD_LABEL}`, data: {
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
        }});

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
        const cuocHenList = await CuocHenTuVan.findAll({ id_benh_nhan});

        const data = await Promise.all(
            cuocHenList.map(async (cuocHen) => {
                const phong_kham = await buildPhongKhamForConsultation(cuocHen);
                
                // Lấy thông tin khung giờ
                let khungGio = null;
                if (cuocHen.id_khung_gio) {
                    khungGio = await KhungGioKham.findOne({ id_khung_gio: cuocHen.id_khung_gio });
                }

                // Lấy thông tin chuyên gia
                let chuyenGia = null;
                if (cuocHen.id_chuyen_gia) {
                    chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: cuocHen.id_chuyen_gia });
                    if (chuyenGia) {
                        const chuyenGiaInfo = await NguoiDung.findOne({ id_nguoi_dung: cuocHen.id_chuyen_gia });
                        chuyenGia = {
                            ...chuyenGia,
                            ho_ten: chuyenGiaInfo?.ho_ten || null
                        };
                    }
                }

                return {
                    ...cuocHen,
                    phong_kham,
                    khungGio: khungGio ? {
                        id_khung_gio: khungGio.id_khung_gio,
                        gio_bat_dau: khungGio.gio_bat_dau,
                        gio_ket_thuc: khungGio.gio_ket_thuc,
                        ca: khungGio.ca
                    } : null,
                    chuyenGia: chuyenGia ? {
                        id_chuyen_gia: chuyenGia.id_chuyen_gia,
                        ho_ten: chuyenGia.ho_ten
                    } : null
                };
            })
        );

        return res.status(200).json({ success: true, data });
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
        const cuocHenList = await CuocHenTuVan.findAll({ id_chuyen_gia });

        const data = await Promise.all(
            cuocHenList.map(async (cuocHen) => {
                const phong_kham = await buildPhongKhamForConsultation(cuocHen);
                return {
                    ...cuocHen,
                    phong_kham
                };
            })
        );

        return res.status(200).json({ success: true, data });
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

        let refundInfo = null;
        if (trang_thai === 'da_huy') {
            refundInfo = await handleDepositCancellationForTuVan(cuocHen);
        }

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

        const responseMessage = refundInfo?.message 
            ? `Cập nhật trạng thái thành công. ${refundInfo.message}`
            : "Cập nhật trạng thái thành công";

        return res.status(200).json({ 
            success: true, 
            message: responseMessage, 
            data: updated,
            refundInfo: refundInfo || undefined
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const createCuocHenTuVanDepositPaymentSession = async (req, res) => {
    try {
        const { id_cuoc_hen } = req.params;
        const requesterId = req?.decoded?.info?.id_nguoi_dung;
        const role = req?.decoded?.vai_tro || '';

        if (!requesterId) {
            return res.status(401).json({ success: false, message: "Không xác định được người dùng. Vui lòng đăng nhập lại." });
        }

        const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen });
        if (!cuocHen) return res.status(404).json({ success: false, message: "Cuộc hẹn không tồn tại" });

        // Normalize để so sánh chính xác
        const normalizedRequesterId = String(requesterId).trim();
        const normalizedBenhNhanId = String(cuocHen.id_benh_nhan || '').trim();
        const isOwner = normalizedBenhNhanId === normalizedRequesterId;
        const isStaff = isStaffRole(role);

        // Log để debug (chỉ trong development)
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Payment Permission Check]', {
                requesterId: normalizedRequesterId,
                benhNhanId: normalizedBenhNhanId,
                role,
                isOwner,
                isStaff
            });
        }

        if (!isOwner && !isStaff) {
            return res.status(403).json({ 
                success: false, 
                message: "Không có quyền khởi tạo thanh toán cho cuộc hẹn này. Chỉ chủ sở hữu cuộc hẹn hoặc nhân viên mới có quyền thực hiện." 
            });
        }

        if (!cuocHen.id_hoa_don_coc) {
            return res.status(400).json({ success: false, message: "Cuộc hẹn chưa có hóa đơn cọc" });
        }

        const invoice = await HoaDon.findOne({ id_hoa_don: cuocHen.id_hoa_don_coc });
        if (!invoice) return res.status(404).json({ success: false, message: "Không tìm thấy hóa đơn cọc" });

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
            appointmentType: 'tu_van_dinh_duong',
            depositDeadline: deadline,
            patientId: cuocHen.id_benh_nhan,
            doctorId: null,
            specialistId: cuocHen.id_chuyen_gia || null
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
        console.error('Error creating consultation deposit payment session:', error);
        return res.status(500).json({ success: false, message: "Lỗi server khi khởi tạo thanh toán", error: error.message });
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
                const caKhungGio = getCaFromGioBatDau(khungGio.gio_bat_dau);
                
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

                // Lấy thông tin phòng khám dựa trên lịch làm việc
                const lich = await LichLamViec.findOne({
                    id_nguoi_dung: cuocHen.id_chuyen_gia,
                    ngay_lam_viec: cuocHen.ngay_kham,
                    ca: caKhungGio
                });

                let phong_kham = null;
                if (lich?.id_phong_kham) {
                    const phongKham = await PhongKham.getById(lich.id_phong_kham);
                    if (phongKham) {
                        phong_kham = {
                            id_phong_kham: phongKham.id_phong_kham,
                            ten_phong: phongKham.ten_phong,
                            so_phong: phongKham.so_phong,
                            tang: phongKham.tang,
                            ten_chuyen_khoa: phongKham.ten_chuyen_khoa,
                            ten_chuyen_nganh: phongKham.ten_chuyen_nganh
                        };
                    }
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
                    },
                    phong_kham
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

        // Normalize ngày để tránh vấn đề timezone
        const normalizeDate = (dateStr) => {
            if (!dateStr) return null;
            // Nếu đã là format YYYY-MM-DD, return trực tiếp
            if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                return dateStr;
            }
            try {
                // Nếu là Date object hoặc ISO string, parse và format lại
                const d = new Date(dateStr);
                if (isNaN(d.getTime())) return null;
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch {
                return dateStr;
            }
        };

        const normalizedDate = normalizeDate(ngay_kham);

        // Đếm số lượng appointments đã đặt
        const appointments = await CuocHenTuVan.findAll({ 
            id_chuyen_gia,
            id_khung_gio,
            ngay_kham: normalizedDate
        });

        // Purge expired pending appointments (giống như logic kiểm tra trùng)
        const lichList = await purgeExpiredPendingConsultations(appointments);

        // Đếm các appointments còn hiệu lực (không bị hủy và không hết hạn)
        const validAppointments = lichList.filter(apt => 
            apt.trang_thai !== 'da_huy'
        );

        return res.status(200).json({ 
            success: true, 
            data: {
                count: validAppointments.length,
                max_count: MAX_CONSULTATIONS_PER_SLOT
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
        const appointmentsRaw = await CuocHenTuVan.getAll();
        const appointments = await Promise.all(
            (appointmentsRaw || []).map(async (cuocHen) => {
                const phong_kham = await buildPhongKhamForConsultation(cuocHen);
                
                // Lấy thông tin khung giờ
                let khungGio = null;
                if (cuocHen.id_khung_gio) {
                    khungGio = await KhungGioKham.findOne({ id_khung_gio: cuocHen.id_khung_gio });
                }

                // Lấy thông tin chuyên gia
                let chuyenGia = null;
                if (cuocHen.id_chuyen_gia) {
                    chuyenGia = await ChuyenGiaDinhDuong.findOne({ id_chuyen_gia: cuocHen.id_chuyen_gia });
                    if (chuyenGia) {
                        const chuyenGiaInfo = await NguoiDung.findOne({ id_nguoi_dung: cuocHen.id_chuyen_gia });
                        chuyenGia = {
                            ...chuyenGia,
                            ho_ten: chuyenGiaInfo?.ho_ten || null
                        };
                    }
                }

                return {
                    ...cuocHen,
                    phong_kham,
                    khungGio: khungGio ? {
                        id_khung_gio: khungGio.id_khung_gio,
                        gio_bat_dau: khungGio.gio_bat_dau,
                        gio_ket_thuc: khungGio.gio_ket_thuc,
                        ca: khungGio.ca
                    } : null,
                    chuyenGia: chuyenGia ? {
                        id_chuyen_gia: chuyenGia.id_chuyen_gia,
                        ho_ten: chuyenGia.ho_ten
                    } : null
                };
            })
        );
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