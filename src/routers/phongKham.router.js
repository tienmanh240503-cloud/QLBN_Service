import express from 'express';
import { getAllPhongKham, getPhongKhamById, createPhongKham, updatePhongKham, deletePhongKham } from '../controllers/phongKham.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/', getAllPhongKham);
router.post('/', verify, createPhongKham);
router.get('/:id_phong_kham', getPhongKhamById);
router.put('/:id_phong_kham', verify, updatePhongKham);
router.delete('/:id_phong_kham', verify, deletePhongKham);

export default router;
