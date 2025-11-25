import express from 'express';
import { 
    getAllNhanVienPhanCong, 
    getNhanVienPhanCongById, 
    updateNhanVienPhanCong,
    // API Phân công lịch làm việc
    createLichLamViec,
    updateLichLamViec,
    deleteLichLamViec,
    getAllLichLamViec,
    swapCa,
    phanCongHangLoat,
    getAvailableBacSi,
    getChuyenGiaDinhDuongByChuyenNganh,
    getNhanVienKhacByVaiTro,
    getAllChuyenNganhDinhDuong,
    // API Quản lý đơn xin nghỉ phép
    getAllXinNghiPhep,
    updateTrangThaiXinNghiPhep,
    // API Thống kê và báo cáo
    getThongKeTongQuan,
    getBaoCaoLichLamViecBacSi
} from '../controllers/nhanVienPhanCong.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// ==================== API CŨ (GIỮ LẠI) ====================
router.get('/', verify, getAllNhanVienPhanCong);
router.get('/:id_nhan_vien_phan_cong', verify, getNhanVienPhanCongById);
router.put('/:id_nhan_vien_phan_cong', verify, updateNhanVienPhanCong);

// ==================== API PHÂN CÔNG LỊCH LÀM VIỆC ====================
router.post('/lich-lam-viec', verify, createLichLamViec);
router.post('/lich-lam-viec/swap', verify, swapCa); // Đổi ca làm việc
router.post('/lich-lam-viec/phan-cong-hang-loat', verify, phanCongHangLoat); // Phân công hàng loạt
router.get('/lich-lam-viec/all', verify, getAllLichLamViec);
router.get('/bac-si/available', verify, getAvailableBacSi); // Lấy danh sách bác sĩ available theo chuyên khoa
router.get('/chuyen-gia-dinh-duong/available', verify, getChuyenGiaDinhDuongByChuyenNganh); // Lấy danh sách chuyên gia dinh dưỡng theo chuyên ngành
router.get('/nhan-vien-khac/available', verify, getNhanVienKhacByVaiTro); // Lấy danh sách nhân viên khác theo vai trò
router.get('/chuyen-nganh-dinh-duong/all', verify, getAllChuyenNganhDinhDuong); // Lấy tất cả chuyên ngành dinh dưỡng
router.put('/lich-lam-viec/:id_lich_lam_viec', verify, updateLichLamViec);
router.delete('/lich-lam-viec/:id_lich_lam_viec', verify, deleteLichLamViec);

// ==================== API QUẢN LÝ ĐƠN XIN NGHỈ PHÉP ====================
router.get('/xin-nghi-phep/all', verify, getAllXinNghiPhep);
router.put('/xin-nghi-phep/:id_xin_nghi_phep/trang-thai', verify, updateTrangThaiXinNghiPhep);

// ==================== API THỐNG KÊ VÀ BÁO CÁO ====================
router.get('/thong-ke/tong-quan', verify, getThongKeTongQuan);
router.get('/bao-cao/lich-lam-viec-bac-si', verify, getBaoCaoLichLamViecBacSi);

export default router;
