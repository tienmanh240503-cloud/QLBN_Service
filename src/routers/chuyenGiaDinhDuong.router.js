import express from 'express';
import { 
    getAllChuyenGia, 
    getChuyenGiaById, 
    updateChuyenGia,
    getChuyenGiaByChuyenNganh,
    getAllChuyenNganhDinhDuong,
    getChuyenNganhDinhDuongById,
    createChuyenNganhDinhDuong,
    updateChuyenNganhDinhDuong,
    deleteChuyenNganhDinhDuong
} from '../controllers/chuyenGiaDinhDuong.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Routes cho chuyên gia dinh dưỡng
router.get('/', getAllChuyenGia);

// Routes cho chuyên ngành dinh dưỡng (phải đặt trước routes có tham số động)
router.get('/chuyen-nganh', getAllChuyenNganhDinhDuong);
router.post('/chuyen-nganh', verify, createChuyenNganhDinhDuong);
router.get('/chuyen-nganh/detail/:id_chuyen_nganh', getChuyenNganhDinhDuongById);
router.put('/chuyen-nganh/:id_chuyen_nganh', verify, updateChuyenNganhDinhDuong);
router.delete('/chuyen-nganh/:id_chuyen_nganh', verify, deleteChuyenNganhDinhDuong);
router.get('/chuyen-nganh/:id_chuyen_nganh', getChuyenGiaByChuyenNganh);

// Routes cho chuyên gia dinh dưỡng (đặt sau để tránh conflict)
router.get('/:id_chuyen_gia', verify, getChuyenGiaById);
router.put('/:id_chuyen_gia', verify, updateChuyenGia);

export default router;
