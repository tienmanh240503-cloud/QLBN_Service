import express from 'express';
import { 
    createLichSuTuVan,
    getLichSuTuVanById,
    getLichSuTuVanByBenhNhan,
    getLichSuTuVanByCuocHen,
    updateLichSuTuVan,
    deleteLichSuTuVan,
    getAllLichSuTuVan
} from '../controllers/lichSuTuVan.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo lịch sử tư vấn (chỉ chuyên gia dinh dưỡng)
router.post('/', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), createLichSuTuVan);

// Lấy toàn bộ lịch sử tư vấn
router.get('/all/', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getAllLichSuTuVan);

// Lấy lịch sử tư vấn theo cuộc hẹn (phải đặt trước /:id_lich_su để tránh conflict)
router.get('/cuoc-hen/:id_cuoc_hen', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getLichSuTuVanByCuocHen);

// Lấy lịch sử tư vấn theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getLichSuTuVanByBenhNhan);

// Lấy lịch sử tư vấn theo ID (phải đặt sau các route cụ thể)
router.get('/:id_lich_su', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getLichSuTuVanById);

// Cập nhật lịch sử tư vấn (chỉ chuyên gia dinh dưỡng)
router.put('/:id_lich_su', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), updateLichSuTuVan);

// Xóa lịch sử tư vấn (thường thì không nên xóa)
router.delete('/:id_lich_su', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), deleteLichSuTuVan);

export default router;
