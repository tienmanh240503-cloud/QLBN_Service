import express from 'express';
import { 
    createCuocHen,
    getCuocHenByBenhNhan,
    updateTrangThaiCuocHen,
    deleteCuocHen
} from '../controllers/cuocHen.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo cuộc hẹn mới
router.post('/', verify, createCuocHen);

// Lấy tất cả cuộc hẹn của bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, getCuocHenByBenhNhan);

// Cập nhật trạng thái cuộc hẹn
router.put('/:id_cuoc_hen/trang-thai', verify, updateTrangThaiCuocHen);

// Xóa cuộc hẹn
router.delete('/:id_cuoc_hen', verify, deleteCuocHen);

export default router;
