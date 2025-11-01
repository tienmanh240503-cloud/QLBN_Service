import express from 'express';
import { 
    getAllChuyenGia, 
    getChuyenGiaById, 
    updateChuyenGia,
    getChuyenGiaByChuyenNganh,
    getAllChuyenNganhDinhDuong
} from '../controllers/chuyenGiaDinhDuong.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/', getAllChuyenGia);
router.get('/chuyen-nganh/:id_chuyen_nganh', getChuyenGiaByChuyenNganh);
router.get('/chuyen-nganh', getAllChuyenNganhDinhDuong);
router.get('/:id_chuyen_gia', verify, getChuyenGiaById);
router.put('/:id_chuyen_gia', verify, updateChuyenGia);

export default router;
