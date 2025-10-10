import express from 'express';
import { 
    createLichSuKham,
    getLichSuKhamById,
    getLichSuKhamByBenhNhan,
    updateLichSuKham,
    deleteLichSuKham,
    getAllLichSuKham,
    getLichSuKhamByCuocHen
} from '../controllers/lichSuKham.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo lịch sử khám (chỉ bác sĩ mới có quyền)
router.post('/', verify, checkRole(["bac_si"]), createLichSuKham);

// Lấy toàn bộ lịch sử khám (bác sĩ, bệnh nhân, quản trị viên)
router.get('/all/', verify, checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getAllLichSuKham);

router.get('/cuoc-hen/:id_cuoc_hen', verify, checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getLichSuKhamByCuocHen);
// Lấy lịch sử khám theo ID
router.get('/:id_lich_su', verify, checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getLichSuKhamById);

// Lấy danh sách lịch sử khám theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getLichSuKhamByBenhNhan);



// Cập nhật lịch sử khám theo ID (chỉ bác sĩ)
router.put('/:id_lich_su', verify, checkRole(["bac_si"]), updateLichSuKham);

// Xóa lịch sử khám theo ID (chỉ bác sĩ, thường thì không cho xoá)
router.delete('/:id_lich_su', verify, checkRole(["bac_si"]), deleteLichSuKham);

export default router;
