import express from "express";
import {
    createLichLamViec,
    getAllLichLamViec,
    getLichLamViecById,
    updateLichLamViec,
    deleteLichLamViec,
    getLichLamViecByNgay,
    getLichLamViecByWeek,
    getLichLamViecByMonth,
    getLichLamViecByYear,
    getLichLamViecByWeekforBacSi
} from "../controllers/lichlamviec.controller.js";
import { verify } from '../middlewares/verifytoken.middleware.js';

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

// Lọc lịch theo ngày
router.get("/filter/ngay", verify, getLichLamViecByNgay);

router.get("/filter/week/:id", verify, getLichLamViecByWeekforBacSi);

// Lọc lịch theo tuần
router.get("/filter/week", verify, getLichLamViecByWeek);


// Lọc lịch theo tháng
router.get("/filter/month", verify, getLichLamViecByMonth);

// Lọc lịch theo năm
router.get("/filter/year", verify, getLichLamViecByYear);

export default router;
