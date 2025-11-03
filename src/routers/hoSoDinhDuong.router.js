import express from 'express';
import { 
    createHoSoDinhDuong,
    getAllHoSoDinhDuong,
    getHoSoDinhDuongById,
    getHoSoDinhDuongByBenhNhan,
    updateHoSoDinhDuong,
    deleteHoSoDinhDuong
} from '../controllers/hoSoDinhDuong.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo hồ sơ dinh dưỡng
router.post('/', verify, checkRole(["chuyen_gia_dinh_duong"]), createHoSoDinhDuong);

// Lấy tất cả hồ sơ dinh dưỡng (phải đặt trước route /:id_ho_so)
router.get('/all/', verify, checkRole(["chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getAllHoSoDinhDuong);

// Lấy hồ sơ dinh dưỡng theo ID hồ sơ
router.get('/:id_ho_so', verify, checkRole(["chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getHoSoDinhDuongById);

// Lấy danh sách hồ sơ dinh dưỡng theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify, checkRole(["chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getHoSoDinhDuongByBenhNhan);

// Cập nhật hồ sơ dinh dưỡng theo ID hồ sơ
router.put('/:id_ho_so', verify, checkRole(["chuyen_gia_dinh_duong"]), updateHoSoDinhDuong);

// Xóa hồ sơ dinh dưỡng theo ID hồ sơ
router.delete('/:id_ho_so', verify, checkRole(["chuyen_gia_dinh_duong"]), deleteHoSoDinhDuong); // thực tế ko được xóa

export default router;
