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
    // API Quản lý đơn xin nghỉ phép
    getAllXinNghiPhep,
    updateTrangThaiXinNghiPhep,
    // API Quản lý yêu cầu đổi ca
    getAllDoiCa,
    updateTrangThaiDoiCa,
    // API Thống kê và báo cáo
    getThongKeTongQuan,
    getBaoCaoLichLamViecBacSi
} from '../controllers/nhanVienPhanCong.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// ==================== API CŨ (GIỮ LẠI) ====================
router.get('/', verify, getAllNhanVienPhanCong);
router.get('/:id_nhan_vien_phan_cong', verify, getNhanVienPhanCongById);
router.put('/:id_nhan_vien_phan_cong', verify, updateNhanVienPhanCong);

// ==================== API PHÂN CÔNG LỊCH LÀM VIỆC ====================
router.post('/lich-lam-viec', verify, createLichLamViec);
router.get('/lich-lam-viec/all', verify, getAllLichLamViec);
router.put('/lich-lam-viec/:id_lich_lam_viec', verify, updateLichLamViec);
router.delete('/lich-lam-viec/:id_lich_lam_viec', verify, deleteLichLamViec);

// ==================== API QUẢN LÝ ĐƠN XIN NGHỈ PHÉP ====================
router.get('/xin-nghi-phep/all', verify, getAllXinNghiPhep);
router.put('/xin-nghi-phep/:id_xin_nghi_phep/trang-thai', verify, updateTrangThaiXinNghiPhep);

// ==================== API QUẢN LÝ YÊU CẦU ĐỔI CA ====================
router.get('/doi-ca/all', verify, getAllDoiCa);
router.put('/doi-ca/:id_doi_ca/trang-thai', verify, updateTrangThaiDoiCa);

// ==================== API THỐNG KÊ VÀ BÁO CÁO ====================
router.get('/thong-ke/tong-quan', verify, getThongKeTongQuan);
router.get('/bao-cao/lich-lam-viec-bac-si', verify, getBaoCaoLichLamViecBacSi);

export default router;
