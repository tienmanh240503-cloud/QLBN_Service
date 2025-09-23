import express from "express";
import {
    createChiTietDonThuoc,
    getChiTietDonThuocByIdDonThuoc,
    getChiTietDonThuocById,
    updateChiTietDonThuoc,
    deleteChiTietDonThuoc
} from "../controllers/chiTietDonThuoc.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Thêm chi tiết đơn thuốc
router.post("/", verify, createChiTietDonThuoc);

// Lấy danh sách chi tiết đơn thuốc theo iddonthuoc
router.get("/donthuoc/:id_don_thuoc", verify, getChiTietDonThuocByIdDonThuoc);

// Lấy chi tiết theo ID
router.get("/:id_chi_tiet_don_thuoc", verify, getChiTietDonThuocById);

// Cập nhật chi tiết đơn thuốc
router.put("/:id_chi_tiet_don_thuoc", verify, updateChiTietDonThuoc);

// Xóa chi tiết đơn thuốc
router.delete("/:id_chi_tiet_don_thuoc", verify, deleteChiTietDonThuoc);

export default router;
