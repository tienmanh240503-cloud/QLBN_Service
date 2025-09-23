// import express from 'express';
// import { 
//   getNhanVienPhanCongs, 
//   getNhanVienPhanCongById, 
//   createNhanVienPhanCong, 
//   updateNhanVienPhanCong, 
//   deleteNhanVienPhanCong 
// } from '../controllers/nhanVienPhanCong.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema } from '../validations/auth.validation.js';

// const router = express.Router();

// // Lấy danh sách nhân viên phân công
// router.get('/', verify, getNhanVienPhanCongs);
// // Lấy thông tin nhân viên phân công theo ID
// router.get('/:id_nhan_vien_phan_cong', verify, getNhanVienPhanCongById);
// // Tạo nhân viên phân công mới
// router.post('/create', validation(registerSchema), verify, createNhanVienPhanCong);
// // Cập nhật thông tin nhân viên phân công
// router.put('/update/:id_nhan_vien_phan_cong', verify, updateNhanVienPhanCong);
// // Xóa nhân viên phân công
// router.delete('/delete/:id_nhan_vien_phan_cong', verify, deleteNhanVienPhanCong);

// export default router;