import express from "express";
import {
    createChuyenKhoa,
    getAllChuyenKhoa,
    getChuyenKhoaById,
    updateChuyenKhoa,
    deleteChuyenKhoa
} from "../controllers/chuyenkhoa.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";
import uploader from "../middlewares/uploader.middleware.js";

const router = express.Router();

// Tạo chuyên khoa mới (hỗ trợ upload ảnh)
router.post("/", verify, uploader.single("image"), createChuyenKhoa);


// Lấy danh sách chuyên khoa
router.get("/", getAllChuyenKhoa);

// Lấy chi tiết chuyên khoa theo ID
router.get("/:id_chuyen_khoa", getChuyenKhoaById);

// Cập nhật chuyên khoa (hỗ trợ upload ảnh)
router.put("/:id_chuyen_khoa", verify, uploader.single("image"), updateChuyenKhoa);


// Xóa chuyên khoa
router.delete("/:id_chuyen_khoa", verify, deleteChuyenKhoa);

export default router;
