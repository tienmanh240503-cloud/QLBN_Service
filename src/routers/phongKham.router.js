import express from 'express';
import { getAllPhongKham, getPhongKhamById } from '../controllers/phongKham.controller.js';

const router = express.Router();

router.get('/', getAllPhongKham);
router.get('/:id_phong_kham', getPhongKhamById);

export default router;
