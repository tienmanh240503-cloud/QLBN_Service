import express from 'express';
import { 
    createCuocHenKham,
    getCuocHenKhamByBenhNhan,
    updateTrangThaiCuocHenKham,
    getCuocHenByBenhNhanAndTrangThai,
    getCuocHenKhamByBacSi,
    getCuocHenKhamById, 
    getLichSuKhamBenhFull,
    getCuocHenKhamByDateAndCa,
    countAppointmentsByTimeSlot,
    getAllCuocHenKhamBenh
} from '../controllers/cuocHenKhamBenh.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// Test route to verify router is working
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Router is working' });
});

// Tạo cuộc hẹn mới
router.post('/', verify, createCuocHenKham);

// Lấy tất cả cuộc hẹn khám bệnh
router.get('/', verify, getAllCuocHenKhamBenh);

// Lấy tất cả cuộc hẹn của bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, getCuocHenKhamByBenhNhan);

// Lấy cuộc hẹn theo Id
router.get('/:id_cuoc_hen', verify, getCuocHenKhamById);


router.get('/lich-su/:id_benh_nhan', verify, getLichSuKhamBenhFull);


router.get('/bac-si/:id_bac_si', verify, getCuocHenKhamByBacSi);

// Lấy cuộc hẹn theo ngày và ca
router.get('/filter/date-ca', verify, getCuocHenKhamByDateAndCa);

// Đếm số lượng appointments đã đặt cho một khung giờ
router.get('/count/time-slot', verify, countAppointmentsByTimeSlot);

router.post("/benh-nhan/:id_benh_nhan/loc", verify, getCuocHenByBenhNhanAndTrangThai); 

// Cập nhật trạng thái cuộc hẹn
router.put('/:id_cuoc_hen/trang-thai', verify, updateTrangThaiCuocHenKham);

// Xóa cuộc hẹn - Tạm thời comment vì chưa có function
// router.delete('/:id_cuoc_hen', verify, deleteCuocHenKham);

export default router;
