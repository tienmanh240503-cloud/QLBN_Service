import express from "express";
import {
    createDoiCa,
    getAllDoiCa,
    getDoiCaById,
    getDoiCaByBacSi,
    updateTrangThaiDoiCa,
    deleteDoiCa
} from "../controllers/doiCa.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Tạo yêu cầu đổi ca mới
router.post("/", verify, createDoiCa);

// Lấy tất cả yêu cầu đổi ca
router.get("/", verify, getAllDoiCa);

// Lấy yêu cầu đổi ca theo ID
router.get("/:id_doi_ca", verify, getDoiCaById);

// Lấy yêu cầu đổi ca theo bác sĩ
router.get("/bac-si/:id_bac_si", verify, getDoiCaByBacSi);

// Cập nhật trạng thái yêu cầu đổi ca
router.put("/:id_doi_ca/trang-thai", verify, updateTrangThaiDoiCa);

// Xóa yêu cầu đổi ca
router.delete("/:id_doi_ca", verify, deleteDoiCa);

export default router;
