import express from "express";
import {
    createXinNghiPhep,
    getAllXinNghiPhep,
    getXinNghiPhepById,
    getXinNghiPhepByBacSi,
    getXinNghiPhepByNhanVien,
    getXinNghiPhepByNguoiDung,
    updateTrangThaiXinNghiPhep,
    deleteXinNghiPhep
} from "../controllers/xinNghiPhep.controller.js";
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// Tạo đơn xin nghỉ phép mới
router.post("/", verify, createXinNghiPhep);

// Lấy tất cả đơn xin nghỉ phép
router.get("/", verify, getAllXinNghiPhep);

// ⚠️ IMPORTANT: Routes cụ thể phải đứng trước routes với params động (/:id_xin_nghi)

// Lấy đơn xin nghỉ phép theo người dùng (bác sĩ, y tá, quản lý, admin) - Route chính
router.get("/nguoi-dung/:id_nguoi_dung", verify, getXinNghiPhepByNguoiDung);

// Backward compatibility routes
router.get("/bac-si/:id_bac_si", verify, getXinNghiPhepByBacSi);
router.get("/nhan-vien/:id_nhan_vien", verify, getXinNghiPhepByNhanVien);

// Lấy đơn xin nghỉ phép theo ID (phải ở cuối để tránh conflict)
router.get("/:id_xin_nghi", verify, getXinNghiPhepById);

// Cập nhật trạng thái đơn xin nghỉ phép
router.put("/:id_xin_nghi/trang-thai", verify, updateTrangThaiXinNghiPhep);

// Xóa đơn xin nghỉ phép
router.delete("/:id_xin_nghi", verify, deleteXinNghiPhep);

export default router;
