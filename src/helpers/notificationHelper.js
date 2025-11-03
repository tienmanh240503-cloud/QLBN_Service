import { ThongBao, NguoiDung } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Tự động tạo thông báo cho người dùng
 * @param {string} id_nguoi_nhan - ID người nhận thông báo
 * @param {string} tieu_de - Tiêu đề thông báo
 * @param {string} noi_dung - Nội dung thông báo
 * @param {string} loai_thong_bao - Loại thông báo: 'cuoc_hen', 'hoa_don', 'chat', 'he_thong', 'khac'
 * @param {string} id_lien_ket - ID liên kết (id_cuoc_hen, id_hoa_don, id_cuoc_tro_chuyen, etc.)
 * @returns {Promise<Object>} Thông báo đã tạo
 */
export const createNotification = async (id_nguoi_nhan, tieu_de, noi_dung, loai_thong_bao = 'he_thong', id_lien_ket = null) => {
    try {
        if (!id_nguoi_nhan) {
            console.error('Missing id_nguoi_nhan for notification');
            return null;
        }

        // Kiểm tra người nhận có tồn tại không
        const nguoiNhan = await NguoiDung.getById(id_nguoi_nhan);
        if (!nguoiNhan) {
            console.error(`User ${id_nguoi_nhan} not found for notification`);
            return null;
        }

        const id_thong_bao = `TB_${uuidv4()}`;
        
        const thongBaoData = {
            id_thong_bao,
            id_nguoi_nhan,
            tieu_de,
            noi_dung,
            loai_thong_bao,
            id_lien_ket,
            trang_thai: 'chua_doc'
        };

        const thongBao = await ThongBao.create(thongBaoData);
        console.log(`Notification created: ${id_thong_bao} for user ${id_nguoi_nhan}`);
        
        return thongBao;
    } catch (error) {
        console.error('Error creating notification:', error);
        // Không throw error để không làm ảnh hưởng đến flow chính
        return null;
    }
};

/**
 * Tạo thông báo khi có tin nhắn mới
 */
export const createChatNotification = async (id_nguoi_gui, id_nguoi_nhan, id_cuoc_tro_chuyen, noi_dung_tin_nhan) => {
    try {
        // Lấy thông tin người gửi
        const nguoiGui = await NguoiDung.getById(id_nguoi_gui);
        if (!nguoiGui) return null;

        const tieu_de = `Tin nhắn mới từ ${nguoiGui.ho_ten || 'Người dùng'}`;
        const noi_dung = noi_dung_tin_nhan || 'Bạn có tin nhắn mới';
        
        // Giới hạn độ dài nội dung
        const noi_dung_ngan = noi_dung.length > 100 ? noi_dung.substring(0, 100) + '...' : noi_dung;

        return await createNotification(
            id_nguoi_nhan,
            tieu_de,
            noi_dung_ngan,
            'chat',
            id_cuoc_tro_chuyen
        );
    } catch (error) {
        console.error('Error creating chat notification:', error);
        return null;
    }
};

/**
 * Tạo thông báo khi có cuộc hẹn mới/xác nhận/hủy
 */
export const createAppointmentNotification = async (id_nguoi_nhan, trang_thai, id_cuoc_hen, ngay_kham, id_bac_si = null, id_chuyen_gia = null) => {
    try {
        let tieu_de, noi_dung;

        // Lấy thông tin bác sĩ/chuyên gia nếu có
        let ten_nguoi_thuc_hien = '';
        if (id_bac_si) {
            const bacSi = await NguoiDung.getById(id_bac_si);
            if (bacSi) ten_nguoi_thuc_hien = bacSi.ho_ten || 'Bác sĩ';
        } else if (id_chuyen_gia) {
            const chuyenGia = await NguoiDung.getById(id_chuyen_gia);
            if (chuyenGia) ten_nguoi_thuc_hien = chuyenGia.ho_ten || 'Chuyên gia';
        }

        switch (trang_thai) {
            case 'da_dat':
                tieu_de = 'Cuộc hẹn mới đã được đặt';
                noi_dung = `Bạn có cuộc hẹn mới vào ngày ${ngay_kham}${ten_nguoi_thuc_hien ? ` với ${ten_nguoi_thuc_hien}` : ''}`;
                break;
            case 'da_xac_nhan':
                tieu_de = 'Cuộc hẹn đã được xác nhận';
                noi_dung = `Cuộc hẹn của bạn vào ngày ${ngay_kham} đã được xác nhận`;
                break;
            case 'da_huy':
                tieu_de = 'Cuộc hẹn đã bị hủy';
                noi_dung = `Cuộc hẹn của bạn vào ngày ${ngay_kham} đã bị hủy`;
                break;
            case 'da_hoan_thanh':
                tieu_de = 'Cuộc hẹn đã hoàn thành';
                noi_dung = `Cuộc hẹn của bạn vào ngày ${ngay_kham} đã hoàn thành`;
                break;
            default:
                tieu_de = 'Cập nhật cuộc hẹn';
                noi_dung = `Cuộc hẹn của bạn vào ngày ${ngay_kham} đã được cập nhật`;
        }

        return await createNotification(
            id_nguoi_nhan,
            tieu_de,
            noi_dung,
            'cuoc_hen',
            id_cuoc_hen
        );
    } catch (error) {
        console.error('Error creating appointment notification:', error);
        return null;
    }
};

/**
 * Tạo thông báo khi có hóa đơn mới
 */
export const createInvoiceNotification = async (id_nguoi_nhan, id_hoa_don, tong_tien) => {
    try {
        const tieu_de = 'Hóa đơn mới';
        const noi_dung = `Bạn có hóa đơn mới với tổng tiền: ${tong_tien?.toLocaleString('vi-VN') || 0} VNĐ`;

        return await createNotification(
            id_nguoi_nhan,
            tieu_de,
            noi_dung,
            'hoa_don',
            id_hoa_don
        );
    } catch (error) {
        console.error('Error creating invoice notification:', error);
        return null;
    }
};

