import express from 'express';
import {
    createYeuCauEmail,
    getAllYeuCauEmail,
    getYeuCauEmailById,
    updateTrangThai,
    sendEmailToUser,
    sendBulkEmail,
    getLichSuGuiEmail,
    deleteYeuCauEmail
} from '../controllers/yeuCauEmail.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Route công khai - đăng ký nhận tin tức
router.post('/', createYeuCauEmail);

// Routes yêu cầu đăng nhập (admin)
router.get('/', verify, getAllYeuCauEmail);
router.get('/lich-su', verify, getLichSuGuiEmail);
router.get('/:id_yeu_cau', verify, getYeuCauEmailById);
router.put('/:id_yeu_cau/trang-thai', verify, updateTrangThai);
router.delete('/:id_yeu_cau', verify, deleteYeuCauEmail);
router.post('/send-email', verify, sendEmailToUser);
router.post('/send-bulk-email', verify, sendBulkEmail);

export default router;

