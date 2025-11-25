import express from 'express';
import { 
    createHoaDon,
    getHoaDonById,
    getHoaDonByCuocHenKham,
    getHoaDonByCuocHenTuVan,
    updateThanhToan,
    deleteHoaDon,
    getAllHoaDon,
    searchHoaDon
} from '../controllers/hoaDon.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// Tạo hóa đơn mới
router.post('/', verify, createHoaDon);

// Tìm kiếm hóa đơn nâng cao
router.get('/search', verify, searchHoaDon);

// Lấy tất cả hóa đơn (có filter)
router.get('/', verify, getAllHoaDon);

// Lấy hóa đơn theo id_hoa_don
router.get('/:id_hoa_don', verify, getHoaDonById);

// Lấy hóa đơn theo id_cuoc_hen_kham
router.get('/kham/:id_cuoc_hen', verify, getHoaDonByCuocHenKham);

// Lấy hóa đơn theo id_cuoc_hen_tu_van
router.get('/tu-van/:id_cuoc_hen', verify, getHoaDonByCuocHenTuVan);

// Cập nhật trạng thái/thanh toán hóa đơn
router.put('/:id_hoa_don', verify, updateThanhToan);

// Xóa hóa đơn
router.delete('/:id_hoa_don', verify, deleteHoaDon);

export default router;
