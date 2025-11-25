import express from 'express';
import { 
    createThucDonChiTiet,
    getThucDonChiTietById,
    getThucDonChiTietByLichSu,
    getThucDonChiTietByBuaAn,
    updateThucDonChiTiet,
    deleteThucDonChiTiet,
    deleteThucDonChiTietByLichSu
} from '../controllers/thucDonChiTiet.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo thực đơn chi tiết (chỉ chuyên gia dinh dưỡng)
router.post('/', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), createThucDonChiTiet);

// Lấy thực đơn chi tiết theo lịch sử tư vấn
router.get('/lich-su/:id_lich_su', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getThucDonChiTietByLichSu);

// Lấy thực đơn chi tiết theo bữa ăn
router.get('/lich-su/:id_lich_su/bua-an/:bua_an', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getThucDonChiTietByBuaAn);

// Lấy thực đơn chi tiết theo ID
router.get('/:id_thuc_don', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "benh_nhan", "quan_tri_vien"]), getThucDonChiTietById);

// Cập nhật thực đơn chi tiết (chỉ chuyên gia dinh dưỡng)
router.put('/:id_thuc_don', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), updateThucDonChiTiet);

// Xóa thực đơn chi tiết (chỉ chuyên gia dinh dưỡng)
router.delete('/:id_thuc_don', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), deleteThucDonChiTiet);

// Xóa tất cả thực đơn chi tiết theo lịch sử (chỉ chuyên gia dinh dưỡng)
router.delete('/lich-su/:id_lich_su/all', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong"]), deleteThucDonChiTietByLichSu);

export default router;

