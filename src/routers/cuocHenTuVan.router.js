import express from "express";
import { 
    createCuocHenTuVan,
    getCuocHenTuVanById,
    getCuocHenTuVanByBenhNhan,
    getCuocHenTuVanByChuyenGia,
    updateTrangThaiCuocHenTuVan,
    deleteCuocHenTuVan,
    getCuocHenByBenhNhanAndTrangThai,
    getLichSuTuVanByBenhNhan,
    countAppointmentsByTimeSlotTuVan,
    getCuocHenTuVanByDateAndCa
} from "../controllers/cuocHenTuVan.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

// POST route
router.post("/", verify, createCuocHenTuVan);

// Specific GET routes (must come before generic :id route)
router.get("/benh-nhan/:id_benh_nhan", verify, getCuocHenTuVanByBenhNhan);
router.get("/chuyen-gia/:id_chuyen_gia", verify, getCuocHenTuVanByChuyenGia);
router.get("/benh-nhan/:id_benh_nhan/lich-su", verify, getLichSuTuVanByBenhNhan);
router.get('/filter/date-ca', verify, getCuocHenTuVanByDateAndCa);
router.get('/count/time-slot', verify, countAppointmentsByTimeSlotTuVan);

// POST route with params
router.post("/benh-nhan/:id_benh_nhan/loc", verify, getCuocHenByBenhNhanAndTrangThai); // có lọc nên set dạng post

// Generic routes (must come after specific routes)
router.get("/:id_cuoc_hen", verify, getCuocHenTuVanById);
router.put("/:id_cuoc_hen/trang-thai", verify, updateTrangThaiCuocHenTuVan);
router.delete("/:id_cuoc_hen", verify, deleteCuocHenTuVan);

export default router;
