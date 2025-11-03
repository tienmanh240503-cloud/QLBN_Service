import express from 'express';
import { 
    createMonAnThamKhao,
    getAllMonAnThamKhao,
    getMonAnThamKhaoById,
    searchMonAnThamKhao,
    updateMonAnThamKhao,
    deleteMonAnThamKhao
} from '../controllers/monAnThamKhao.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo món ăn tham khảo (chỉ chuyên gia dinh dưỡng và quản trị viên)
router.post('/', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "quan_tri_vien"]), createMonAnThamKhao);

// Lấy tất cả món ăn tham khảo (có thể lọc theo loại)
router.get('/', verify, getAllMonAnThamKhao);

// Tìm kiếm món ăn theo tên
router.get('/search', verify, searchMonAnThamKhao);

// Lấy món ăn tham khảo theo ID
router.get('/:id_mon_an', verify, getMonAnThamKhaoById);

// Cập nhật món ăn tham khảo (chỉ chuyên gia dinh dưỡng và quản trị viên)
router.put('/:id_mon_an', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "quan_tri_vien"]), updateMonAnThamKhao);

// Xóa món ăn tham khảo (chỉ chuyên gia dinh dưỡng và quản trị viên)
router.delete('/:id_mon_an', verify, checkRole(["chuyen_gia", "chuyen_gia_dinh_duong", "quan_tri_vien"]), deleteMonAnThamKhao);

export default router;

