import express from 'express';
import { 
    createThuoc,
    getAllThuoc,
    getThuocById,
    updateThuoc,
    deleteThuoc
} from '../controllers/thuoc.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// Tạo thuốc mới
router.post('/', verify, createThuoc);

// Lấy danh sách tất cả thuốc
router.get('/', verify, getAllThuoc);

// Lấy chi tiết thuốc theo ID
router.get('/:id_thuoc', verify, getThuocById);

// Cập nhật thông tin thuốc
router.put('/:id_thuoc', verify, updateThuoc);

// Xóa thuốc
router.delete('/:id_thuoc', verify, deleteThuoc);

export default router;
