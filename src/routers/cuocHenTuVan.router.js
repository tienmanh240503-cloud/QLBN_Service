import express from "express";
import { 
    createCuocHenTuVan,
    getCuocHenTuVanByBenhNhan,
    updateTrangThaiCuocHenTuVan,
    deleteCuocHenTuVan,
    getCuocHenByBenhNhanAndTrangThai,
    getLichSuTuVanByBenhNhan
} from "../controllers/cuocHenTuVan.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";

const router = express.Router();

router.post("/", verify, createCuocHenTuVan);
router.get("/benh-nhan/:id_benh_nhan", verify, getCuocHenTuVanByBenhNhan);
router.get("/benh-nhan/:id_benh_nhan/lich-su", verify, getLichSuTuVanByBenhNhan);
router.post("/benh-nhan/:id_benh_nhan/loc", verify, getCuocHenByBenhNhanAndTrangThai); // có lọc nên set dạng post
router.put("/:id_cuoc_hen/trang-thai", verify, updateTrangThaiCuocHenTuVan);
router.delete("/:id_cuoc_hen", verify, deleteCuocHenTuVan);

export default router;
