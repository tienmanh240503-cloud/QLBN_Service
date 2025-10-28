import { NhanVienPhanCong, LichLamViec, BacSi, NguoiDung, XinNghiPhep, DoiCa } from "../models/index.js";
// Không cần import Op vì GenericModel không hỗ trợ Sequelize operators

// ==================== API PHÂN CÔNG LỊCH LÀM VIỆC ====================

// Tạo lịch làm việc cho bác sĩ
export const createLichLamViec = async (req, res) => {
    try {
        const { id_bac_si, ngay_lam_viec, ca_lam_viec, gio_bat_dau, gio_ket_thuc, ghi_chu } = req.body;

        if (!id_bac_si || !ngay_lam_viec || !ca_lam_viec) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra bác sĩ tồn tại
        const bacSi = await BacSi.findOne({ id_bac_si });
        if (!bacSi) {
            return res.status(404).json({ success: false, message: "Bác sĩ không tồn tại" });
        }

        // Kiểm tra trùng lịch
        const existingSchedule = await LichLamViec.findOne({
            id_bac_si,
            ngay_lam_viec,
            ca_lam_viec
        });

        if (existingSchedule) {
            return res.status(400).json({ success: false, message: "Bác sĩ đã có lịch làm việc trong ca này" });
        }

        const lichLamViec = await LichLamViec.create({
            id_bac_si,
            ngay_lam_viec,
            ca_lam_viec,
            gio_bat_dau: gio_bat_dau || null,
            gio_ket_thuc: gio_ket_thuc || null,
            ghi_chu: ghi_chu || null,
            trang_thai: 'Dang_Lam'
        });

        res.status(201).json({ 
            success: true, 
            message: "Tạo lịch làm việc thành công", 
            data: lichLamViec 
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
        
        res.status(200).json({ 
            success: true, 
            message: "Cập nhật lịch làm việc thành công", 
            data: updated 
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

// Lấy tất cả lịch làm việc với thông tin bác sĩ
export const getAllLichLamViec = async (req, res) => {
    try {
        const { page = 1, limit = 10, id_bac_si, ngay_bat_dau, ngay_ket_thuc } = req.query;
        
        let whereCondition = {};
        
        if (id_bac_si) {
            whereCondition.id_bac_si = id_bac_si;
        }
        
        // Tạm thời bỏ qua filter ngày vì GenericModel không hỗ trợ Op.between
        // Có thể implement sau bằng SQL thuần hoặc xử lý ở frontend
        // if (ngay_bat_dau && ngay_ket_thuc) {
        //     whereCondition.ngay_lam_viec = {
        //         [Op.between]: [ngay_bat_dau, ngay_ket_thuc]
        //     };
        // }

        const data = await LichLamViec.findAll(whereCondition);
        
        res.status(200).json({
            success: true,
            data: data,
            pagination: {
                total: data.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(data.length / limit)
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
        const { page = 1, limit = 10, trang_thai, id_bac_si } = req.query;
        
        let whereCondition = {};
        
        if (trang_thai) {
            whereCondition.trang_thai = trang_thai;
        }
        
        if (id_bac_si) {
            whereCondition.id_bac_si = id_bac_si;
        }

        const data = await XinNghiPhep.findAll(whereCondition);
        
        res.status(200).json({
            success: true,
            data: data,
            pagination: {
                total: data.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(data.length / limit)
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

// ==================== API QUẢN LÝ YÊU CẦU ĐỔI CA ====================

// Lấy tất cả yêu cầu đổi ca
export const getAllDoiCa = async (req, res) => {
    try {
        const { page = 1, limit = 10, trang_thai, id_bac_si } = req.query;
        
        let whereCondition = {};
        
        if (trang_thai) {
            whereCondition.trang_thai = trang_thai;
        }
        
        if (id_bac_si) {
            whereCondition.id_bac_si = id_bac_si;
        }

        const data = await DoiCa.findAll(whereCondition);
        
        res.status(200).json({
            success: true,
            data: data,
            pagination: {
                total: data.length,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(data.length / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Duyệt/từ chối yêu cầu đổi ca
export const updateTrangThaiDoiCa = async (req, res) => {
    try {
        const { id_doi_ca } = req.params;
        const { trang_thai, ly_do_tu_choi } = req.body;

        if (!trang_thai || !['Duyet', 'Tu_Choi'].includes(trang_thai)) {
            return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
        }

        const doiCa = await DoiCa.findOne({ id_doi_ca });
        if (!doiCa) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu đổi ca" });
        }

        if (doiCa.trang_thai !== 'Cho_Duyet') {
            return res.status(400).json({ success: false, message: "Yêu cầu này đã được xử lý" });
        }

        const updateData = { trang_thai };
        if (trang_thai === 'Tu_Choi' && ly_do_tu_choi) {
            updateData.ly_do_tu_choi = ly_do_tu_choi;
        }

        const updated = await DoiCa.update(updateData, id_doi_ca);
        
        res.status(200).json({ 
            success: true, 
            message: `Đã ${trang_thai === 'Duyet' ? 'duyệt' : 'từ chối'} yêu cầu đổi ca`, 
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
        const allLichLamViec = await LichLamViec.findAll(whereCondition);
        const totalLichLamViec = allLichLamViec.length;
        
        // Thống kê theo ca
        const lichLamViecTheoCa = {};
        allLichLamViec.forEach(lich => {
            if (!lichLamViecTheoCa[lich.ca_lam_viec]) {
                lichLamViecTheoCa[lich.ca_lam_viec] = 0;
            }
            lichLamViecTheoCa[lich.ca_lam_viec]++;
        });

        // Thống kê đơn xin nghỉ phép
        const allXinNghiPhep = await XinNghiPhep.findAll();
        const totalXinNghiPhep = allXinNghiPhep.length;
        
        // Thống kê theo trạng thái
        const xinNghiPhepTheoTrangThai = {};
        allXinNghiPhep.forEach(don => {
            if (!xinNghiPhepTheoTrangThai[don.trang_thai]) {
                xinNghiPhepTheoTrangThai[don.trang_thai] = 0;
            }
            xinNghiPhepTheoTrangThai[don.trang_thai]++;
        });

        // Thống kê yêu cầu đổi ca
        const allDoiCa = await DoiCa.findAll();
        const totalDoiCa = allDoiCa.length;
        
        // Thống kê theo trạng thái
        const doiCaTheoTrangThai = {};
        allDoiCa.forEach(doi => {
            if (!doiCaTheoTrangThai[doi.trang_thai]) {
                doiCaTheoTrangThai[doi.trang_thai] = 0;
            }
            doiCaTheoTrangThai[doi.trang_thai]++;
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
                },
                doiCa: {
                    tongSo: totalDoiCa,
                    theoTrangThai: Object.entries(doiCaTheoTrangThai).map(([trang_thai, so_luong]) => ({ trang_thai, so_luong }))
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

        const allLichLamViec = await LichLamViec.findAll(whereCondition);
        
        // Thống kê theo bác sĩ
        const baoCaoTheoBacSi = {};
        allLichLamViec.forEach(lich => {
            if (!baoCaoTheoBacSi[lich.id_bac_si]) {
                baoCaoTheoBacSi[lich.id_bac_si] = {
                    id_bac_si: lich.id_bac_si,
                    so_ca_lam: 0,
                    ca_sang: 0,
                    ca_chieu: 0,
                    ca_toi: 0
                };
            }
            
            baoCaoTheoBacSi[lich.id_bac_si].so_ca_lam++;
            
            if (lich.ca_lam_viec === 'Sang') {
                baoCaoTheoBacSi[lich.id_bac_si].ca_sang++;
            } else if (lich.ca_lam_viec === 'Chieu') {
                baoCaoTheoBacSi[lich.id_bac_si].ca_chieu++;
            } else if (lich.ca_lam_viec === 'Toi') {
                baoCaoTheoBacSi[lich.id_bac_si].ca_toi++;
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
        const nv = await NhanVienPhanCong.findOne({ id_nhan_vien_phan_cong });
        if (!nv) return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên." });

        res.status(200).json({ success: true, data: nv });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

export const updateNhanVienPhanCong = async (req, res) => {
    try {
        const { id_nhan_vien_phan_cong } = req.params;
        const dataUpdate = req.body;

        const updated = await NhanVienPhanCong.update(dataUpdate, id_nhan_vien_phan_cong);
        res.status(200).json({ success: true, message: "Cập nhật thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
