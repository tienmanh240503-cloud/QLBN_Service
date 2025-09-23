import express from 'express';
import {
    createKhungGioKham,
    getAllKhungGioKham,
    getKhungGioById,
    updateKhungGioKham,
    deleteKhungGioKham
} from '../controllers/khungGioKham.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo khung giờ khám
router.post('/', verify, createKhungGioKham);

// Lấy danh sách khung giờ
router.get('/', getAllKhungGioKham);

// Lấy chi tiết khung giờ theo ID
router.get('/:id_khung_gio', getKhungGioById);

// Cập nhật khung giờ
router.put('/:id_khung_gio', verify, updateKhungGioKham);

// Xóa khung giờ
router.delete('/:id_khung_gio', verify, deleteKhungGioKham);

export default router;
