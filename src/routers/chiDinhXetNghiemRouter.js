import express from "express";
import { createChiDinh, getChiDinhByHoSo, updateTrangThaiChiDinh, deleteChiDinh, getAllChiDinh } from "../controllers/chiDinhXetNghiem.controller.js";
import { verify } from '../middlewares/verifytoken.middleware.js';
const router = express.Router();

router.post("/",verify, createChiDinh);
router.get("/", verify, getAllChiDinh); // Lấy tất cả chỉ định (cho nhân viên xét nghiệm)
router.get("/cuochen/:id_cuoc_hen",verify, getChiDinhByHoSo);
router.put("/:id_chi_dinh/trang-thai", verify, updateTrangThaiChiDinh);
router.delete("/:id_chi_dinh", verify, deleteChiDinh);

export default router;
