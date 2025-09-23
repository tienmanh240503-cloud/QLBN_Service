import express from "express";
import {
    createChuyenKhoa,
    getAllChuyenKhoa,
    getChuyenKhoaById,
    updateChuyenKhoa,
    deleteChuyenKhoa
} from "../controllers/chuyenkhoa.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Tạo chuyên khoa mới
router.post("/", verify, createChuyenKhoa);

// Lấy danh sách chuyên khoa
router.get("/", verify, getAllChuyenKhoa);

// Lấy chi tiết chuyên khoa theo ID
router.get("/:id_chuyen_khoa", verify, getChuyenKhoaById);

// Cập nhật chuyên khoa
router.put("/:id_chuyen_khoa", verify, updateChuyenKhoa);

// Xóa chuyên khoa
router.delete("/:id_chuyen_khoa", verify, deleteChuyenKhoa);

export default router;
