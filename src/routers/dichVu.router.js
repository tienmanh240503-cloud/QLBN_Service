import express from "express";
import { createDichVu, getAllDichVu, getDichVuById, updateDichVu, deleteDichVu } from "../controllers/dichVu.controller.js";

const router = express.Router();

router.post("/", createDichVu);
router.get("/", getAllDichVu);
router.get("/:id_dich_vu", getDichVuById);
router.put("/:id_dich_vu", updateDichVu);
router.delete("/:id_dich_vu", deleteDichVu);

export default router;
