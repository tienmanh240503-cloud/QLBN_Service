// import express from 'express';
// import { 
//   getChuyenGiaDinhDuongs, 
//   getChuyenGiaDinhDuongById, 
//   createChuyenGiaDinhDuong, 
//   updateChuyenGiaDinhDuong, 
//   deleteChuyenGiaDinhDuong 
// } from '../controllers/chuyenGiaDinhDuong.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema } from '../validations/auth.validation.js';

// const router = express.Router();

// // Lấy danh sách chuyên gia dinh dưỡng
// router.get('/', verify, getChuyenGiaDinhDuongs);
// // Lấy thông tin chuyên gia dinh dưỡng theo ID
// router.get('/:id_chuyen_gia', verify, getChuyenGiaDinhDuongById);
// // Tạo chuyên gia dinh dưỡng mới
// router.post('/create', validation(registerSchema), verify, createChuyenGiaDinhDuong);
// // Cập nhật thông tin chuyên gia dinh dưỡng
// router.put('/update/:id_chuyen_gia', verify, updateChuyenGiaDinhDuong);
// // Xóa chuyên gia dinh dưỡng
// router.delete('/delete/:id_chuyen_gia', verify, deleteChuyenGiaDinhDuong);

// export default router;