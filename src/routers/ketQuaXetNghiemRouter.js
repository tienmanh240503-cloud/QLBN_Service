import express from 'express';
import { 
    createKetQua,
    getKetQuaByChiDinh,
    updateKetQua,
    deleteKetQua
} from '../controllers/ketQuaXetNghiem.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

//Ket qua xet nghiem 1 : 1 voi chi dinh nen query theo id_chi_dinh nh NAM
// Tạo kết quả xét nghiệm (gắn với 1 chỉ định)
router.post('/', verify, createKetQua);

// Lấy kết quả theo id_chi_dinh
router.get('/:id_chi_dinh', verify, getKetQuaByChiDinh);

// Cập nhật kết quả xét nghiệm
router.put('/:id_chi_dinh', verify, updateKetQua);

// Xóa kết quả xét nghiệm
router.delete('/:id_chi_dinh', verify, deleteKetQua);

export default router;
