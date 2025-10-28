import express from "express";
import {
    createXinNghiPhep,
    getAllXinNghiPhep,
    getXinNghiPhepById,
    getXinNghiPhepByBacSi,
    updateTrangThaiXinNghiPhep,
    deleteXinNghiPhep
} from "../controllers/xinNghiPhep.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// Tạo đơn xin nghỉ phép mới
router.post("/", verify, createXinNghiPhep);

// Lấy tất cả đơn xin nghỉ phép
router.get("/", verify, getAllXinNghiPhep);

// Lấy đơn xin nghỉ phép theo ID
router.get("/:id_xin_nghi", verify, getXinNghiPhepById);

// Lấy đơn xin nghỉ phép theo bác sĩ
router.get("/bac-si/:id_bac_si", verify, getXinNghiPhepByBacSi);

// Cập nhật trạng thái đơn xin nghỉ phép
router.put("/:id_xin_nghi/trang-thai", verify, updateTrangThaiXinNghiPhep);

// Xóa đơn xin nghỉ phép
router.delete("/:id_xin_nghi", verify, deleteXinNghiPhep);

export default router;
