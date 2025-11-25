import express from 'express';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { 
    createThongBao,
    getThongBaoByNguoiDung,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteThongBao,
    getThongBaoById
} from '../controllers/thongBao.controller.js';

const router = express.Router();

// Tạo thông báo mới (admin/system)
router.post('/', verify, createThongBao);

// Lấy thông báo theo người dùng
router.get('/user/:id_nguoi_dung', verify, getThongBaoByNguoiDung);

// Lấy số lượng thông báo chưa đọc
router.get('/user/:id_nguoi_dung/unread-count', verify, getUnreadCount);

// Đánh dấu đã đọc
router.put('/:id_thong_bao/read', verify, markAsRead);

// Đánh dấu tất cả đã đọc
router.put('/user/:id_nguoi_dung/read-all', verify, markAllAsRead);

// Xóa thông báo
router.delete('/:id_thong_bao', verify, deleteThongBao);

// Lấy thông báo theo ID
router.get('/:id_thong_bao', verify, getThongBaoById);

export default router;

