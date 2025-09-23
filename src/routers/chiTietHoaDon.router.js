import express from "express";
import { createChiTietHoaDon, getChiTietByHoaDon, deleteChiTietHoaDon } from "../controllers/chiTietHoaDon.controller.js";

const router = express.Router();

router.post("/", createChiTietHoaDon);
router.get("/hoa-don/:id_hoa_don", getChiTietByHoaDon);
router.delete("/:id_chi_tiet", deleteChiTietHoaDon);

export default router;
