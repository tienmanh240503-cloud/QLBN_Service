import express from 'express';
import { 
    createDonThuoc,
    getDonThuocByHoSo,
    deleteDonThuoc
} from '../controllers/donThuoc.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo đơn thuốc mới
router.post('/', verify, createDonThuoc);

// Lấy đơn thuốc + chi tiết theo hồ sơ khám
router.get('/ho-so/:id_ho_so', verify, getDonThuocByHoSo);

// Xóa đơn thuốc
router.delete('/:id_don_thuoc', verify, deleteDonThuoc);

export default router;
