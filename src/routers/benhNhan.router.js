import express from 'express';
import { 
    getBenhNhanById,
    getAllBenhNhan,
    updateBenhNhan
} from '../controllers/benhNhan.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Lấy tất cả bệnh nhân
router.get('/', verify, getAllBenhNhan);

// Lấy thông tin bệnh nhân theo ID
router.get('/:id_benh_nhan', verify, getBenhNhanById);

// Cập nhật profile bệnh nhân
router.put('/:id_benh_nhan', verify, updateBenhNhan);

export default router;
