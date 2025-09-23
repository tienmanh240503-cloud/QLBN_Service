import express from 'express';
import { 
    createHoaDon,
    getHoaDonById,
    getHoaDonByCuocHen,
    updateHoaDon,
    deleteHoaDon
} from '../controllers/hoaDon.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo hóa đơn mới
router.post('/', verify, createHoaDon);

// Lấy hóa đơn theo id_hoa_don
router.get('/:id_hoa_don', verify, getHoaDonById);

// Lấy hóa đơn theo id_cuoc_hen (mỗi cuộc hẹn chỉ có 1 hóa đơn)
router.get('/cuoc-hen/:id_cuoc_hen', verify, getHoaDonByCuocHen);

// Cập nhật trạng thái hóa đơn (thanh toán, hủy, …)
router.put('/:id_hoa_don', verify, updateHoaDon);

// Xóa hóa đơn
router.delete('/:id_hoa_don', verify, deleteHoaDon);

export default router;
