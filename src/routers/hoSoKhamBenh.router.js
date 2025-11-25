import express from 'express';
import { 
    createHoSoKham,
    getHoSoKhamById,
    getHoSoKhamByBenhNhan,
    updateHoSoKham,
    deleteHoSoKham,
    getAllHoSoKham
} from '../controllers/hoSoKhamBenh.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = express.Router();

// Tạo hồ sơ khám bệnh
router.post('/', verify,checkRole(["bac_si"]), createHoSoKham);

router.get('/all/', verify,checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getAllHoSoKham);
// Lấy hồ sơ khám bệnh theo ID hồ sơ
router.get('/:id_ho_so', verify,checkRole(["bac_si", "benh_nhan", "quan_tri_vien"]), getHoSoKhamById);



// Lấy danh sách hồ sơ khám bệnh theo bệnh nhân
router.get('/benh-nhan/:id_benh_nhan', verify,checkRole(["benh_nhan", "bac_si", "quan_tri_vien"]), getHoSoKhamByBenhNhan);

// Cập nhật hồ sơ khám bệnh theo ID hồ sơ
router.put('/:id_ho_so', verify,checkRole(["bac_si"]), updateHoSoKham);

// Xóa hồ sơ khám bệnh theo ID hồ sơ
router.delete('/:id_ho_so', verify,checkRole(["bac_si"]), deleteHoSoKham); // thực tế ko được xóa

export default router;
