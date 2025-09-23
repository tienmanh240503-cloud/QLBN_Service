import express from 'express';
import { 
    createHoSoKham,
    getHoSoByBenhNhan
} from '../controllers/hoSoKhamBenh.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo hồ sơ khám bệnh
router.post('/', verify, createHoSoKham);

// Lấy hồ sơ khám bệnh theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, getHoSoByBenhNhan);

export default router;
