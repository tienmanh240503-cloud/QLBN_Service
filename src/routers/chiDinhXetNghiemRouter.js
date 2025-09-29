import express from "express";
import { createChiDinh, getChiDinhByHoSo, updateTrangThaiChiDinh, deleteChiDinh } from "../controllers/chiDinhXetNghiem.controller.js";
import { verify } from '../middlewares/verifyToken.middleware.js';
const router = express.Router();

router.post("/",verify, createChiDinh);
router.get("/hoso/:id_ho_so",verify, getChiDinhByHoSo);
router.put("/:id_chi_dinh/trang-thai", verify, updateTrangThaiChiDinh);
router.delete("/:id_chi_dinh", verify, deleteChiDinh);

export default router;
