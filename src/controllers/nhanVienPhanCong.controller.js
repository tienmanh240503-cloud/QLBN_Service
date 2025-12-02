import { NhanVienPhanCong, LichLamViec, BacSi, NguoiDung, XinNghiPhep, KhungGioKham, PhongKham, ChuyenGiaDinhDuong, ChuyenNganhDinhDuong } from "../models/index.js";
import db from '../configs/connectData.js';
// Không cần import Op vì GenericModel không hỗ trợ Sequelize operators

// ==================== API PHÂN CÔNG LỊCH LÀM VIỆC ====================

// Tạo lịch làm việc cho nhân viên (bác sĩ hoặc nhân viên khác)
export const createLichLamViec = async (req, res) => {
    try {
        const { id_nguoi_dung, ngay_lam_viec, ca, id_phong_kham, id_nguoi_tao } = req.body;
        const idNguoiTao = id_nguoi_tao || req.user?.id_nguoi_dung;

        if (!id_nguoi_dung || !ngay_lam_viec || !ca) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc: id_nguoi_dung, ngay_lam_viec, ca" });
        }

        // Kiểm tra người dùng tồn tại
        const nguoiDung = await NguoiDung.findOne({ id_nguoi_dung });
        if (!nguoiDung) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        // Kiểm tra và validate phòng khám dựa trên vai trò
        if (id_phong_kham) {
            const phongKham = await PhongKham.findOne({ id_phong_kham });
            if (!phongKham) {
                return res.status(404).json({ success: false, message: "Phòng khám không tồn tại" });
            }
            
            // Kiểm tra trạng thái phòng khám
            if (phongKham.trang_thai !== 'HoatDong') {
                return res.status(400).json({ success: false, message: `Phòng khám đang ở trạng thái ${phongKham.trang_thai}, không thể phân công lịch` });
            }
            
            const vaiTro = nguoiDung.vai_tro;
            
            // Validate phòng khám dựa trên vai trò
            switch(vaiTro) {
                case 'bac_si':
                    // Bác sĩ: phòng phải là phong_kham_bac_si và chuyên khoa phải khớp
                    if (phongKham.loai_phong !== 'phong_kham_bac_si' && phongKham.loai_phong !== null) {
                        return res.status(400).json({ 
                            success: false, 
                            message: "Phòng khám không phù hợp với bác sĩ. Vui lòng chọn phòng khám bác sĩ." 
                        });
                    }
                    
                    if (phongKham.id_chuyen_khoa) {
                        const bacSi = await BacSi.findOne({ id_bac_si: id_nguoi_dung });
                        if (!bacSi) {
                            return res.status(400).json({ success: false, message: "Người dùng không phải là bác sĩ" });
                        }
                        
                        if (bacSi.id_chuyen_khoa !== phongKham.id_chuyen_khoa) {
                            return res.status(400).json({ 
                                success: false, 
                                message: "Chuyên khoa của bác sĩ không khớp với chuyên khoa của phòng khám" 
                            });
                        }
                    }
                    break;
                    
                case 'chuyen_gia_dinh_duong':
                    // Chuyên gia dinh dưỡng: phòng phải là phong_tu_van_dinh_duong
                    if (phongKham.loai_phong !== 'phong_tu_van_dinh_duong') {
                        return res.status(400).json({ 
                            success: false, 
                            message: "Phòng khám không phù hợp với chuyên gia dinh dưỡng. Vui lòng chọn phòng tư vấn dinh dưỡng." 
                        });
                    }
                    
                    // Nếu phòng có chuyên ngành, kiểm tra chuyên gia có chuyên ngành đó không (tùy chọn)
                    if (phongKham.id_chuyen_nganh) {
                        // Kiểm tra trong bảng chuyengia_chuyennganhdinhduong
                        const checkQuery = `
                            SELECT * FROM chuyengia_chuyennganhdinhduong 
                            WHERE id_chuyen_gia = ? AND id_chuyen_nganh = ?
                        `;
                        const [chuyenNganhCheck] = await new Promise((resolve, reject) => {
                            db.query(checkQuery, [id_nguoi_dung, phongKham.id_chuyen_nganh], (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            });
                        });
                        
                        // Không bắt buộc phải có chuyên ngành khớp, chỉ cảnh báo nếu muốn
                        // if (!chuyenNganhCheck) {
                        //     return res.status(400).json({ 
                        //         success: false, 
                        //         message: "Chuyên ngành của chuyên gia không khớp với chuyên ngành của phòng khám" 
                        //     });
                        // }
                    }
                    break;
                    
                case 'nhan_vien_quay':
                case 'nhan_vien_phan_cong':
                    // Nhân viên quầy/phân công: phòng phải là phong_lam_viec
                    // Cho phép null để tương thích với dữ liệu cũ
                    if (phongKham.loai_phong !== null && phongKham.loai_phong !== 'phong_lam_viec') {
                        return res.status(400).json({ 
                            success: false, 
                            message: "Phòng khám không phù hợp với nhân viên. Vui lòng chọn phòng làm việc." 
                        });
                    }
                    break;
                    
                case 'nhan_vien_xet_nghiem':
                    // Nhân viên xét nghiệm: phòng phải là phong_xet_nghiem
                    // Cho phép null để tương thích với dữ liệu cũ
                    if (phongKham.loai_phong !== null && phongKham.loai_phong !== 'phong_xet_nghiem') {
                        return res.status(400).json({ 
                            success: false, 
                            message: "Phòng khám không phù hợp với nhân viên xét nghiệm. Vui lòng chọn phòng xét nghiệm." 
                        });
                    }
                    break;
                    
                default:
                    // Các role khác không cần phòng khám hoặc có thể dùng phòng làm việc chung
                    if (phongKham.loai_phong && phongKham.loai_phong !== 'phong_lam_viec' && phongKham.loai_phong !== 'phong_khac') {
                        return res.status(400).json({ 
                            success: false, 
                            message: "Phòng khám không phù hợp với vai trò này" 
                        });
                    }
            }
        }

        // Kiểm tra trùng lịch
        const existingSchedule = await LichLamViec.findOne({
            id_nguoi_dung,
            ngay_lam_viec,
            ca
        });

        if (existingSchedule) {
            return res.status(400).json({ success: false, message: "Người dùng đã có lịch làm việc trong ca này" });
        }

        // Tạo id_lich_lam_viec
        const idLichLamViec = `L_${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const lichLamViec = await LichLamViec.create({
            id_lich_lam_viec: idLichLamViec,
            id_nguoi_dung,
            ngay_lam_viec,
            ca,
            id_nguoi_tao: idNguoiTao || null,
            id_phong_kham: id_phong_kham || null
        });

        // Query khung giờ theo ca
        const khungGios = await KhungGioKham.findAll({ ca: lichLamViec.ca });

        res.status(201).json({ 
            success: true, 
            message: "Tạo lịch làm việc thành công", 
            data: {
                ...lichLamViec,
                khung_gios: khungGios || []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Đổi ca làm việc
export const swapCa = async (req, res) => {
    try {
        const { id_lich_lam_viec_1, id_lich_lam_viec_2 } = req.body;

        if (!id_lich_lam_viec_1 || !id_lich_lam_viec_2) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin: cần 2 id lịch làm việc để đổi" });
        }

        // Lấy 2 lịch làm việc
        const lich1 = await LichLamViec.findOne({ id_lich_lam_viec: id_lich_lam_viec_1 });
        const lich2 = await LichLamViec.findOne({ id_lich_lam_viec: id_lich_lam_viec_2 });

        if (!lich1 || !lich2) {
            return res.status(404).json({ success: false, message: "Không tìm thấy một trong hai lịch làm việc" });
        }

        // Kiểm tra trùng lịch trước khi đổi
        const checkTrung1 = await LichLamViec.findOne({
            id_nguoi_dung: lich2.id_nguoi_dung,
            ngay_lam_viec: lich1.ngay_lam_viec,
            ca: lich1.ca
        });

        const checkTrung2 = await LichLamViec.findOne({
            id_nguoi_dung: lich1.id_nguoi_dung,
            ngay_lam_viec: lich2.ngay_lam_viec,
            ca: lich2.ca
        });

        if (checkTrung1 && checkTrung1.id_lich_lam_viec !== id_lich_lam_viec_2) {
            return res.status(400).json({ success: false, message: "Người dùng thứ 2 đã có lịch trong ca này" });
        }

        if (checkTrung2 && checkTrung2.id_lich_lam_viec !== id_lich_lam_viec_1) {
            return res.status(400).json({ success: false, message: "Người dùng thứ 1 đã có lịch trong ca này" });
        }

        // Đổi ca: hoán đổi id_nguoi_dung và ca giữa 2 lịch
        const tempNguoiDung = lich1.id_nguoi_dung;
        const tempCa = lich1.ca;

        await LichLamViec.update(
            { id_nguoi_dung: lich2.id_nguoi_dung, ca: lich2.ca },
            id_lich_lam_viec_1
        );

        await LichLamViec.update(
            { id_nguoi_dung: tempNguoiDung, ca: tempCa },
            id_lich_lam_viec_2
        );

        // Lấy lại 2 lịch đã đổi và query khung giờ
        const lich1Updated = await LichLamViec.findOne({ id_lich_lam_viec: id_lich_lam_viec_1 });
        const lich2Updated = await LichLamViec.findOne({ id_lich_lam_viec: id_lich_lam_viec_2 });
        
        const khungGios1 = await KhungGioKham.findAll({ ca: lich1Updated.ca });
        const khungGios2 = await KhungGioKham.findAll({ ca: lich2Updated.ca });

        res.status(200).json({ 
            success: true, 
            message: "Đổi ca làm việc thành công",
            data: {
                lich1: {
                    ...lich1Updated,
                    khung_gios: khungGios1 || []
                },
                lich2: {
                    ...lich2Updated,
                    khung_gios: khungGios2 || []
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Phân công hàng loạt cho tất cả nhân viên
export const phanCongHangLoat = async (req, res) => {
    try {
        const { danh_sach_phan_cong } = req.body;

        if (!Array.isArray(danh_sach_phan_cong) || danh_sach_phan_cong.length === 0) {
            return res.status(400).json({ success: false, message: "Danh sách phân công không hợp lệ" });
        }

        const idNguoiTao = req.user?.id_nguoi_dung;
        const ketQua = [];
        const loi = [];

        for (const pc of danh_sach_phan_cong) {
            const { id_nguoi_dung, ngay_lam_viec, ca, id_phong_kham } = pc;

            if (!id_nguoi_dung || !ngay_lam_viec || !ca) {
                loi.push({ ...pc, error: "Thiếu thông tin bắt buộc" });
                continue;
            }

            // Kiểm tra người dùng tồn tại
            const nguoiDung = await NguoiDung.findOne({ id_nguoi_dung });
            if (!nguoiDung) {
                loi.push({ ...pc, error: "Người dùng không tồn tại" });
                continue;
            }

            // Kiểm tra trùng lịch
            const existingSchedule = await LichLamViec.findOne({
                id_nguoi_dung,
                ngay_lam_viec,
                ca
            });

            if (existingSchedule) {
                loi.push({ ...pc, error: "Đã có lịch làm việc trong ca này" });
                continue;
            }

            try {
                const idLichLamViec = `L_${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const lichLamViec = await LichLamViec.create({
                    id_lich_lam_viec: idLichLamViec,
                    id_nguoi_dung,
                    ngay_lam_viec,
                    ca,
                    id_nguoi_tao: idNguoiTao || null,
                    id_phong_kham: id_phong_kham || null
                });
                // Query khung giờ theo ca
                const khungGios = await KhungGioKham.findAll({ ca });
                ketQua.push({
                    ...lichLamViec,
                    khung_gios: khungGios || []
                });
            } catch (err) {
                loi.push({ ...pc, error: err.message });
            }
        }

        res.status(200).json({
            success: true,
            message: `Phân công thành công ${ketQua.length}/${danh_sach_phan_cong.length} lịch làm việc`,
            data: {
                thanhCong: ketQua,
                thatBai: loi
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật lịch làm việc
export const updateLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;
        const updateData = req.body;

        const lichLamViec = await LichLamViec.findOne({ id_lich_lam_viec });
        if (!lichLamViec) {
            return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        }

        const updated = await LichLamViec.update(updateData, id_lich_lam_viec);
        
        // Lấy lại lịch đã cập nhật để query khung giờ và phòng khám
        const lichUpdated = await LichLamViec.findOne({ id_lich_lam_viec });
        const khungGios = await KhungGioKham.findAll({ ca: lichUpdated.ca });
        let phongKham = null;
        if (lichUpdated.id_phong_kham) {
            phongKham = await PhongKham.getById(lichUpdated.id_phong_kham);
        }
        
        res.status(200).json({ 
            success: true, 
            message: "Cập nhật lịch làm việc thành công", 
            data: {
                ...lichUpdated,
                khung_gios: khungGios || [],
                phong_kham: phongKham ? {
                    id_phong_kham: phongKham.id_phong_kham,
                    ten_phong: phongKham.ten_phong,
                    so_phong: phongKham.so_phong,
                    tang: phongKham.tang,
                    ten_chuyen_khoa: phongKham.ten_chuyen_khoa,
                    ten_chuyen_nganh: phongKham.ten_chuyen_nganh
                } : null,
                ten_phong: phongKham?.ten_phong || null,
                so_phong: phongKham?.so_phong || null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Xóa lịch làm việc
export const deleteLichLamViec = async (req, res) => {
    try {
        const { id_lich_lam_viec } = req.params;

        const lichLamViec = await LichLamViec.findOne({ id_lich_lam_viec });
        if (!lichLamViec) {
            return res.status(404).json({ success: false, message: "Không tìm thấy lịch làm việc" });
        }

        await LichLamViec.delete(id_lich_lam_viec);
        
        res.status(200).json({ 
            success: true, 
            message: "Xóa lịch làm việc thành công" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả lịch làm việc
export const getAllLichLamViec = async (req, res) => {
    try {
        const { page = 1, limit = 10, id_nguoi_dung, ngay_bat_dau, ngay_ket_thuc } = req.query;
        
        let whereCondition = {};
        
        if (id_nguoi_dung) {
            whereCondition.id_nguoi_dung = id_nguoi_dung;
        }
        
        // Tạm thời bỏ qua filter ngày vì GenericModel không hỗ trợ Op.between
        // Có thể implement sau bằng SQL thuần hoặc xử lý ở frontend
        // if (ngay_bat_dau && ngay_ket_thuc) {
        //     whereCondition.ngay_lam_viec = {
        //         [Op.between]: [ngay_bat_dau, ngay_ket_thuc]
        //     };
        // }

        // Sử dụng getAll nếu không có điều kiện, vì findAll({}) sẽ tạo SQL không hợp lệ
        const data = Object.keys(whereCondition).length > 0 
            ? await LichLamViec.findAll(whereCondition)
            : await LichLamViec.getAll();
        
        // Gắn khung giờ + thông tin phòng khám (số phòng, tầng) cho từng lịch làm việc
        const dataWithDetails = await Promise.all(
            data.map(async (lich) => {
                // Query các khung giờ thuộc ca này (chỉ query nếu có ca)
                let khungGios = [];
                if (lich.ca) {
                    khungGios = await KhungGioKham.findAll({ ca: lich.ca }) || [];
                }

                // Lấy thông tin phòng khám (nếu có)
                let phongKham = null;
                if (lich.id_phong_kham) {
                    try {
                        phongKham = await PhongKham.getById(lich.id_phong_kham);
                    } catch (err) {
                        // giữ nguyên phongKham = null nếu lỗi
                    }
                }

                return {
                    ...lich,
                    khung_gios: khungGios,
                    phong_kham: phongKham
                        ? {
                            id_phong_kham: phongKham.id_phong_kham,
                            ten_phong: phongKham.ten_phong,
                            so_phong: phongKham.so_phong,
                            tang: phongKham.tang,
                            ten_chuyen_khoa: phongKham.ten_chuyen_khoa,
                            ten_chuyen_nganh: phongKham.ten_chuyen_nganh,
                          }
                        : null,
                    ten_phong: phongKham?.ten_phong || null,
                    so_phong: phongKham?.so_phong || null,
                    tang: phongKham?.tang || null,
                };
            })
        );
        
        res.status(200).json({
            success: true,
            data: dataWithDetails,
            pagination: {
                total: dataWithDetails.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(dataWithDetails.length / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== API QUẢN LÝ ĐƠN XIN NGHỈ PHÉP ====================

// Lấy tất cả đơn xin nghỉ phép
export const getAllXinNghiPhep = async (req, res) => {
    try {
        const { page = 1, limit = 10, trang_thai, id_nguoi_dung } = req.query;
        
        let whereCondition = {};
        
        if (trang_thai) {
            whereCondition.trang_thai = trang_thai;
        }
        
        if (id_nguoi_dung) {
            whereCondition.id_nguoi_dung = id_nguoi_dung;
        }

        const data = await XinNghiPhep.findAll(whereCondition);
        
        // Join với NguoiDung để lấy thông tin ho_ten
        const dataWithInfo = await Promise.all(
            data.map(async (item) => {
                try {
                    const nguoiDung = await NguoiDung.findOne({ id_nguoi_dung: item.id_nguoi_dung });
                    return {
                        ...item,
                        ho_ten: nguoiDung?.ho_ten || null
                    };
                } catch (err) {
                    return item;
                }
            })
        );
        
        res.status(200).json({
            success: true,
            data: dataWithInfo,
            pagination: {
                total: dataWithInfo.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(dataWithInfo.length / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Duyệt/từ chối đơn xin nghỉ phép
export const updateTrangThaiXinNghiPhep = async (req, res) => {
    try {
        const { id_xin_nghi_phep } = req.params;
        const { trang_thai, ly_do_tu_choi } = req.body;

        if (!trang_thai || !['Duyet', 'Tu_Choi'].includes(trang_thai)) {
            return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
        }

        const xinNghiPhep = await XinNghiPhep.findOne({ id_xin_nghi_phep });
        if (!xinNghiPhep) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn xin nghỉ phép" });
        }

        if (xinNghiPhep.trang_thai !== 'Cho_Duyet') {
            return res.status(400).json({ success: false, message: "Đơn này đã được xử lý" });
        }

        const updateData = { trang_thai };
        if (trang_thai === 'Tu_Choi' && ly_do_tu_choi) {
            updateData.ly_do_tu_choi = ly_do_tu_choi;
        }

        const updated = await XinNghiPhep.update(updateData, id_xin_nghi_phep);
        
        res.status(200).json({ 
            success: true, 
            message: `Đã ${trang_thai === 'Duyet' ? 'duyệt' : 'từ chối'} đơn xin nghỉ phép`, 
            data: updated 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== API THỐNG KÊ VÀ BÁO CÁO ====================

// Thống kê tổng quan
export const getThongKeTongQuan = async (req, res) => {
    try {
        const { ngay_bat_dau, ngay_ket_thuc } = req.query;
        
        let whereCondition = {};
        // Tạm thời bỏ qua filter ngày vì GenericModel không hỗ trợ Op.between
        // if (ngay_bat_dau && ngay_ket_thuc) {
        //     whereCondition.ngay_lam_viec = {
        //         [Op.between]: [ngay_bat_dau, ngay_ket_thuc]
        //     };
        // }

        // Thống kê lịch làm việc
        const allLichLamViec = Object.keys(whereCondition).length > 0 
            ? await LichLamViec.findAll(whereCondition)
            : await LichLamViec.getAll();
        const totalLichLamViec = allLichLamViec.length;
        
        // Thống kê theo ca
        const lichLamViecTheoCa = {};
        allLichLamViec.forEach(lich => {
            const ca = lich.ca || 'Sang'; // Default to 'Sang' if ca is missing
            if (!lichLamViecTheoCa[ca]) {
                lichLamViecTheoCa[ca] = 0;
            }
            lichLamViecTheoCa[ca]++;
        });

        // Thống kê đơn xin nghỉ phép
        const allXinNghiPhep = await XinNghiPhep.getAll();
        const totalXinNghiPhep = allXinNghiPhep.length;
        
        // Thống kê theo trạng thái
        const xinNghiPhepTheoTrangThai = {};
        allXinNghiPhep.forEach(don => {
            if (!xinNghiPhepTheoTrangThai[don.trang_thai]) {
                xinNghiPhepTheoTrangThai[don.trang_thai] = 0;
            }
            xinNghiPhepTheoTrangThai[don.trang_thai]++;
        });

        res.status(200).json({
            success: true,
            data: {
                lichLamViec: {
                    tongSo: totalLichLamViec,
                    theoCa: Object.entries(lichLamViecTheoCa).map(([ca, so_luong]) => ({ ca_lam_viec: ca, so_luong }))
                },
                xinNghiPhep: {
                    tongSo: totalXinNghiPhep,
                    theoTrangThai: Object.entries(xinNghiPhepTheoTrangThai).map(([trang_thai, so_luong]) => ({ trang_thai, so_luong }))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Báo cáo lịch làm việc theo bác sĩ
export const getBaoCaoLichLamViecBacSi = async (req, res) => {
    try {
        const { ngay_bat_dau, ngay_ket_thuc } = req.query;
        
        let whereCondition = {};
        // Tạm thời bỏ qua filter ngày vì GenericModel không hỗ trợ Op.between
        // if (ngay_bat_dau && ngay_ket_thuc) {
        //     whereCondition.ngay_lam_viec = {
        //         [Op.between]: [ngay_bat_dau, ngay_ket_thuc]
        //     };
        // }

        const allLichLamViec = Object.keys(whereCondition).length > 0 
            ? await LichLamViec.findAll(whereCondition)
            : await LichLamViec.getAll();
        
        // Thống kê theo bác sĩ (sử dụng id_nguoi_dung vì bảng lichlamviec không có id_bac_si)
        const baoCaoTheoBacSi = {};
        allLichLamViec.forEach(lich => {
            const idNguoiDung = lich.id_nguoi_dung;
            if (!idNguoiDung) return; // Skip if id_nguoi_dung is missing
            
            if (!baoCaoTheoBacSi[idNguoiDung]) {
                baoCaoTheoBacSi[idNguoiDung] = {
                    id_nguoi_dung: idNguoiDung,
                    so_ca_lam: 0,
                    ca_sang: 0,
                    ca_chieu: 0,
                    ca_toi: 0
                };
            }
            
            baoCaoTheoBacSi[idNguoiDung].so_ca_lam++;
            
            const ca = lich.ca || 'Sang'; // Default to 'Sang' if ca is missing
            if (ca === 'Sang') {
                baoCaoTheoBacSi[idNguoiDung].ca_sang++;
            } else if (ca === 'Chieu') {
                baoCaoTheoBacSi[idNguoiDung].ca_chieu++;
            } else if (ca === 'Toi') {
                baoCaoTheoBacSi[idNguoiDung].ca_toi++;
            }
        });

        const baoCao = Object.values(baoCaoTheoBacSi).sort((a, b) => b.so_ca_lam - a.so_ca_lam);

        res.status(200).json({
            success: true,
            data: baoCao
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// ==================== API CŨ (GIỮ LẠI) ====================

export const getAllNhanVienPhanCong = async (req, res) => {
    try {
        const data = await NhanVienPhanCong.findAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const getNhanVienPhanCongById = async (req, res) => {
    try {
        const { id_nhan_vien_phan_cong } = req.params;
        
        // Join với nguoidung để lấy thông tin đầy đủ
        // id_nhan_vien_phan_cong trong params có thể là id_nguoi_dung
        // Sử dụng LEFT JOIN để vẫn lấy được thông tin nếu chưa có record trong nhanvienphancong
        const query = `
            SELECT 
                nvpc.id_nhan_vien_phan_cong,
                nvpc.ma_nhan_vien,
                nvpc.quyen_han_phan_cong,
                nd.id_nguoi_dung,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                nd.ngay_sinh,
                nd.gioi_tinh,
                nd.dia_chi,
                nd.so_cccd,
                nd.anh_dai_dien,
                nd.ten_dang_nhap,
                nd.vai_tro
            FROM nguoidung nd
            LEFT JOIN nhanvienphancong nvpc ON nvpc.id_nhan_vien_phan_cong = nd.id_nguoi_dung
            WHERE nd.id_nguoi_dung = ? AND nd.vai_tro = 'nhan_vien_phan_cong'
        `;
        
        db.query(query, [id_nhan_vien_phan_cong], (err, result) => {
            if (err) {
                console.error("Error fetching nhân viên phân công:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            
            if (!result || result.length === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên." });
            }
            
            res.status(200).json({ success: true, data: result[0] });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const updateNhanVienPhanCong = async (req, res) => {
    try {
        const { id_nhan_vien_phan_cong } = req.params;
        const dataUpdate = req.body;

        // Tách dữ liệu: thông tin nguoidung và thông tin nhanvienphancong
        const { 
            ma_nhan_vien, 
            quyen_han_phan_cong,
            ...nguoiDungData 
        } = dataUpdate;

        // Cập nhật thông tin nguoidung
        if (Object.keys(nguoiDungData).length > 0) {
            await NguoiDung.update(nguoiDungData, id_nhan_vien_phan_cong);
        }

        // Cập nhật thông tin nhanvienphancong nếu có
        const nvpcData = {};
        if (ma_nhan_vien) nvpcData.ma_nhan_vien = ma_nhan_vien;
        if (quyen_han_phan_cong) nvpcData.quyen_han_phan_cong = quyen_han_phan_cong;
        
        if (Object.keys(nvpcData).length > 0) {
            await NhanVienPhanCong.update(nvpcData, id_nhan_vien_phan_cong);
        }

        // Lấy lại thông tin đầy đủ sau khi cập nhật
        const query = `
            SELECT 
                nvpc.id_nhan_vien_phan_cong,
                nvpc.ma_nhan_vien,
                nvpc.quyen_han_phan_cong,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                nd.ngay_sinh,
                nd.gioi_tinh,
                nd.dia_chi,
                nd.so_cccd,
                nd.anh_dai_dien,
                nd.ten_dang_nhap,
                nd.vai_tro
            FROM nhanvienphancong nvpc
            INNER JOIN nguoidung nd ON nvpc.id_nhan_vien_phan_cong = nd.id_nguoi_dung
            WHERE nvpc.id_nhan_vien_phan_cong = ?
        `;
        
        const updatedData = await new Promise((resolve, reject) => {
            db.query(query, [id_nhan_vien_phan_cong], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
        
        res.status(200).json({ 
            success: true, 
            message: "Cập nhật thành công", 
            data: updatedData 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách bác sĩ available (chưa phân công, chưa nghỉ phép) theo ngày, ca và chuyên khoa
export const getAvailableBacSi = async (req, res) => {
    try {
        const { ngay_lam_viec, ca, id_chuyen_khoa } = req.query;

        if (!ngay_lam_viec) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin: ngay_lam_viec là bắt buộc" });
        }

        // Nếu có ca thì filter theo ca, nếu không có ca thì xem tất cả các ca
        const caCondition = ca ? 'AND llv.ca = ?' : '';
        let query = `
            SELECT 
                bs.id_bac_si,
                bs.id_chuyen_khoa,
                bs.chuyen_mon,
                bs.chuc_danh,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                ck.ten_chuyen_khoa,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM lichlamviec llv 
                        WHERE llv.id_nguoi_dung = bs.id_bac_si 
                        AND llv.ngay_lam_viec = ?
                        ${caCondition}
                    ) THEN 'da_phan_cong'
                    WHEN EXISTS (
                        SELECT 1 FROM xinnghiphep xnp 
                        WHERE xnp.id_nguoi_dung = bs.id_bac_si 
                        AND xnp.trang_thai IN ('Da_Duyet', 'Cho_Duyet')
                        AND ? BETWEEN xnp.ngay_bat_dau AND xnp.ngay_ket_thuc
                    ) THEN 'nghi_phep'
                    ELSE 'available'
                END as trang_thai
            FROM bacsi bs
            INNER JOIN nguoidung nd ON bs.id_bac_si = nd.id_nguoi_dung
            LEFT JOIN chuyenkhoa ck ON bs.id_chuyen_khoa = ck.id_chuyen_khoa
            WHERE bs.dang_lam_viec = 1
        `;

        const values = [ngay_lam_viec];
        if (ca) {
            values.push(ca);
        }
        values.push(ngay_lam_viec);

        if (id_chuyen_khoa) {
            query += ` AND bs.id_chuyen_khoa = ?`;
            values.push(id_chuyen_khoa);
        }

        query += ` ORDER BY nd.ho_ten ASC`;

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching available bac si:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            
            const available = result.filter(bs => bs.trang_thai === 'available');
            const daPhanCong = result.filter(bs => bs.trang_thai === 'da_phan_cong');
            const nghiPhep = result.filter(bs => bs.trang_thai === 'nghi_phep');

            res.status(200).json({ 
                success: true, 
                data: {
                    available,
                    da_phan_cong: daPhanCong,
                    nghi_phep: nghiPhep,
                    all: result
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách chuyên gia dinh dưỡng theo chuyên ngành dinh dưỡng
export const getChuyenGiaDinhDuongByChuyenNganh = async (req, res) => {
    try {
        const { id_chuyen_nganh, ngay_lam_viec, ca, search } = req.query;

        // Nếu có ca thì filter theo ca, nếu không có ca thì xem tất cả các ca
        const caCondition = ca ? 'AND llv.ca = ?' : '';
        let query = `
            SELECT 
                cg.id_chuyen_gia,
                cg.hoc_vi,
                cg.so_chung_chi_hang_nghe,
                cg.linh_vuc_chuyen_sau,
                cg.gioi_thieu_ban_than,
                cg.chuc_vu,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                cnd.ten_chuyen_nganh,
                cnd.id_chuyen_nganh,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM lichlamviec llv 
                        WHERE llv.id_nguoi_dung = cg.id_chuyen_gia 
                        ${ngay_lam_viec ? 'AND llv.ngay_lam_viec = ?' : ''}
                        ${caCondition}
                    ) THEN 'da_phan_cong'
                    WHEN EXISTS (
                        SELECT 1 FROM xinnghiphep xnp 
                        WHERE xnp.id_nguoi_dung = cg.id_chuyen_gia 
                        AND xnp.trang_thai IN ('Da_Duyet', 'Cho_Duyet')
                        ${ngay_lam_viec ? 'AND ? BETWEEN xnp.ngay_bat_dau AND xnp.ngay_ket_thuc' : ''}
                    ) THEN 'nghi_phep'
                    ELSE 'available'
                END as trang_thai
            FROM chuyengiadinhduong cg
            INNER JOIN nguoidung nd ON cg.id_chuyen_gia = nd.id_nguoi_dung
            INNER JOIN chuyengia_chuyennganhdinhduong cg_cnd ON cg.id_chuyen_gia = cg_cnd.id_chuyen_gia
            INNER JOIN chuyennganhdinhduong cnd ON cg_cnd.id_chuyen_nganh = cnd.id_chuyen_nganh
            WHERE 1=1
        `;

        const values = [];
        
        if (id_chuyen_nganh) {
            query += ` AND cnd.id_chuyen_nganh = ?`;
            values.push(id_chuyen_nganh);
        }

        if (search) {
            query += ` AND (nd.ho_ten LIKE ? OR cg.linh_vuc_chuyen_sau LIKE ? OR cnd.ten_chuyen_nganh LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern);
        }

        if (ngay_lam_viec) {
            // Thêm ngay_lam_viec vào values nếu có
            if (ca) {
                values.push(ngay_lam_viec, ca, ngay_lam_viec);
            } else {
                values.push(ngay_lam_viec, ngay_lam_viec);
            }
        }

        query += ` ORDER BY nd.ho_ten ASC`;

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching chuyên gia dinh dưỡng:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            
            const available = result.filter(cg => cg.trang_thai === 'available');
            const daPhanCong = result.filter(cg => cg.trang_thai === 'da_phan_cong');
            const nghiPhep = result.filter(cg => cg.trang_thai === 'nghi_phep');

            res.status(200).json({ 
                success: true, 
                data: {
                    available,
                    da_phan_cong: daPhanCong,
                    nghi_phep: nghiPhep,
                    all: result
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách nhân viên khác theo vai trò
export const getNhanVienKhacByVaiTro = async (req, res) => {
    try {
        const { vai_tro, ngay_lam_viec, ca, search } = req.query;

        // Nếu có ca thì filter theo ca, nếu không có ca thì xem tất cả các ca
        const caCondition = ca ? 'AND llv.ca = ?' : '';
        let query = `
            SELECT DISTINCT
                nd.id_nguoi_dung,
                nd.ho_ten,
                nd.email,
                nd.so_dien_thoai,
                nd.vai_tro,
                CASE 
                    WHEN EXISTS (
                        SELECT 1 FROM lichlamviec llv 
                        WHERE llv.id_nguoi_dung = nd.id_nguoi_dung 
                        ${ngay_lam_viec ? 'AND llv.ngay_lam_viec = ?' : ''}
                        ${caCondition}
                    ) THEN 'da_phan_cong'
                    WHEN EXISTS (
                        SELECT 1 FROM xinnghiphep xnp 
                        WHERE xnp.id_nguoi_dung = nd.id_nguoi_dung 
                        AND xnp.trang_thai IN ('Da_Duyet', 'Cho_Duyet')
                        ${ngay_lam_viec ? 'AND ? BETWEEN xnp.ngay_bat_dau AND xnp.ngay_ket_thuc' : ''}
                    ) THEN 'nghi_phep'
                    ELSE 'available'
                END as trang_thai
            FROM nguoidung nd
            LEFT JOIN bacsi bs ON nd.id_nguoi_dung = bs.id_bac_si
            LEFT JOIN chuyengiadinhduong cg ON nd.id_nguoi_dung = cg.id_chuyen_gia
            WHERE bs.id_bac_si IS NULL 
            AND cg.id_chuyen_gia IS NULL
            AND nd.vai_tro IN ('nhan_vien_quay', 'nhan_vien_phan_cong')
        `;

        const values = [];

        if (vai_tro) {
            query += ` AND nd.vai_tro = ?`;
            values.push(vai_tro);
        }

        if (search) {
            query += ` AND (nd.ho_ten LIKE ? OR nd.email LIKE ?)`;
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern);
        }

        if (ngay_lam_viec) {
            // Thêm ngay_lam_viec vào values nếu có
            if (ca) {
                values.push(ngay_lam_viec, ca, ngay_lam_viec);
            } else {
                values.push(ngay_lam_viec, ngay_lam_viec);
            }
        }

        query += ` ORDER BY nd.ho_ten ASC`;

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error fetching nhân viên khác:", err);
                return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
            }
            
            const available = result.filter(nv => nv.trang_thai === 'available');
            const daPhanCong = result.filter(nv => nv.trang_thai === 'da_phan_cong');
            const nghiPhep = result.filter(nv => nv.trang_thai === 'nghi_phep');

            res.status(200).json({ 
                success: true, 
                data: {
                    available,
                    da_phan_cong: daPhanCong,
                    nghi_phep: nghiPhep,
                    all: result
                }
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả chuyên ngành dinh dưỡng
export const getAllChuyenNganhDinhDuong = async (req, res) => {
    try {
        const data = await ChuyenNganhDinhDuong.getAll();
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
