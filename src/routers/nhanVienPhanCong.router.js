import express from 'express';
import { getAllNhanVienPhanCong, getNhanVienPhanCongById, updateNhanVienPhanCong } from '../controllers/nhanVienPhanCong.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/', verify, getAllNhanVienPhanCong);
router.get('/:id_nhan_vien_phan_cong', verify, getNhanVienPhanCongById);
router.put('/:id_nhan_vien_phan_cong', verify, updateNhanVienPhanCong);

export default router;
