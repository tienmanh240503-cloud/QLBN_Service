import express from 'express';
import { getAllPhongKham, getAllPhongKhamAdmin, getPhongKhamById, createPhongKham, updatePhongKham, deletePhongKham } from '../controllers/phongKham.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

router.get('/', getAllPhongKham);
router.get('/admin', verify, checkRole(['quan_tri_vien']), getAllPhongKhamAdmin);
router.post('/', verify, createPhongKham);
router.get('/:id_phong_kham', getPhongKhamById);
router.put('/:id_phong_kham', verify, updatePhongKham);
router.delete('/:id_phong_kham', verify, deletePhongKham);

export default router;
