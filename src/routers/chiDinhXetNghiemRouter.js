import express from "express";
import { createChiDinh, getChiDinhByHoSo, updateTrangThaiChiDinh, deleteChiDinh } from "../controllers/chiDinhXetNghiem.controller.js";

const router = express.Router();

router.post("/", createChiDinh);
router.get("/hoso/:id_ho_so", getChiDinhByHoSo);
router.put("/:id_chi_dinh/trang-thai", updateTrangThaiChiDinh);
router.delete("/:id_chi_dinh", deleteChiDinh);

export default router;
