import express from "express";
import {
    createLichLamViec,
    getAllLichLamViec,
    getLichLamViecById,
    updateLichLamViec,
    deleteLichLamViec
} from "../controllers/lichlamviec.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Tạo lịch làm việc mới
router.post("/", verify, createLichLamViec);

// Lấy tất cả lịch làm việc
router.get("/", verify, getAllLichLamViec);

// Lấy chi tiết lịch làm việc theo ID
router.get("/:id_lich_lam_viec", verify, getLichLamViecById);

// Cập nhật lịch làm việc
router.put("/:id_lich_lam_viec", verify, updateLichLamViec);

// Xóa lịch làm việc
router.delete("/:id_lich_lam_viec", verify, deleteLichLamViec);

export default router;
