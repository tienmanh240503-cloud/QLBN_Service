// import express from 'express';
// import { 
//   getQuanTriViens, 
//   getQuanTriVienById, 
//   createQuanTriVien, 
//   updateQuanTriVien, 
//   deleteQuanTriVien,
//   requestRefreshTokenQuanTriVien
// } from '../controllers/quanTriVien.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema } from '../validations/auth.validation.js';

// const router = express.Router();

// // Lấy danh sách quản trị viên
// router.get('/', verify, getQuanTriViens);
// // Lấy thông tin quản trị viên theo ID
// router.get('/:id_quan_tri_vien', verify, getQuanTriVienById);
// // Tạo quản trị viên mới
// router.post('/create', validation(registerSchema), verify, createQuanTriVien);
// // Cập nhật thông tin quản trị viên
// router.put('/update/:id_quan_tri_vien', verify, updateQuanTriVien);
// // Xóa quản trị viên
// router.delete('/delete/:id_quan_tri_vien', verify, deleteQuanTriVien);
// // Yêu cầu refresh token
// router.post('/auth/refresh-token', requestRefreshTokenQuanTriVien);

// export default router;