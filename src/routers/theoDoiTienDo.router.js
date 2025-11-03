import express from 'express';
import { 
    createTheoDoiTienDo,
    getTheoDoiTienDoById,
    getTheoDoiTienDoByBenhNhan,
    getTheoDoiTienDoByLichSu,
    updateTheoDoiTienDo,
    deleteTheoDoiTienDo
} from '../controllers/theoDoiTienDo.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo theo dõi tiến độ (chỉ chuyên gia dinh dưỡng)
router.post('/', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), createTheoDoiTienDo);

// Lấy theo dõi tiến độ theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getTheoDoiTienDoByBenhNhan);

// Lấy theo dõi tiến độ theo lịch sử tư vấn
router.get('/lich-su/:id_lich_su', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getTheoDoiTienDoByLichSu);

// Lấy theo dõi tiến độ theo ID
router.get('/:id_theo_doi', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getTheoDoiTienDoById);

// Cập nhật theo dõi tiến độ (chỉ chuyên gia dinh dưỡng)
router.put('/:id_theo_doi', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), updateTheoDoiTienDo);

// Xóa theo dõi tiến độ (chỉ chuyên gia dinh dưỡng)
router.delete('/:id_theo_doi', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), deleteTheoDoiTienDo);

export default router;

