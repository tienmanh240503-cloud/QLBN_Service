import express from 'express';
import { 
    createLichSuTuVan,
    getLichSuTuVanById,
    getLichSuTuVanByBenhNhan,
    updateLichSuTuVan,
    deleteLichSuTuVan,
    getAllLichSuTuVan
} from '../controllers/lichSuTuVan.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo lịch sử tư vấn (chỉ chuyên gia dinh dưỡng)
router.post('/', verify, checkRole(["chuyen_gia"]), createLichSuTuVan);

// Lấy toàn bộ lịch sử tư vấn
router.get('/all/', verify, checkRole(["chuyen_gia", "benh_nhan", "quan_tri_vien"]), getAllLichSuTuVan);

// Lấy lịch sử tư vấn theo ID
router.get('/:id_lich_su', verify, checkRole(["chuyen_gia", "benh_nhan", "quan_tri_vien"]), getLichSuTuVanById);

// Lấy lịch sử tư vấn theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, checkRole(["chuyen_gia", "benh_nhan", "quan_tri_vien"]), getLichSuTuVanByBenhNhan);

// Cập nhật lịch sử tư vấn (chỉ chuyên gia dinh dưỡng)
router.put('/:id_lich_su', verify, checkRole(["chuyen_gia"]), updateLichSuTuVan);

// Xóa lịch sử tư vấn (thường thì không nên xóa)
router.delete('/:id_lich_su', verify, checkRole(["chuyen_gia"]), deleteLichSuTuVan);

export default router;
