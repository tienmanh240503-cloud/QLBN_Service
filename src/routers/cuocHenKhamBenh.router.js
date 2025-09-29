import express from 'express';
import { 
    createCuocHenKham,
    getCuocHenKhamByBenhNhan,
    updateTrangThaiCuocHenKham,
    deleteCuocHenKham,
    getCuocHenByBenhNhanAndTrangThai
} from '../controllers/cuocHenKhamBenh.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo cuộc hẹn mới
router.post('/', verify, createCuocHenKham);

// Lấy tất cả cuộc hẹn của bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, getCuocHenKhamByBenhNhan);

router.post("/benh-nhan/:id_benh_nhan/loc", verify, getCuocHenByBenhNhanAndTrangThai); 

// Cập nhật trạng thái cuộc hẹn
router.put('/:id_cuoc_hen/trang-thai', verify, updateTrangThaiCuocHenKham);

// Xóa cuộc hẹn
router.delete('/:id_cuoc_hen', verify, deleteCuocHenKham);

export default router;
