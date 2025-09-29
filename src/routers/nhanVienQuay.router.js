import express from 'express';
import { getAllNhanVienQuay, getNhanVienQuayById, updateNhanVienQuay } from '../controllers/nhanVienQuay.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/', verify, getAllNhanVienQuay);
router.get('/:id_nhan_vien_quay', verify, getNhanVienQuayById);
router.put('/:id_nhan_vien_quay', verify, updateNhanVienQuay);

export default router;
