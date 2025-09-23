// import express from 'express';
// import { 
//   getBenhNhans, 
//   getBenhNhanById, 
//   createBenhNhan, 
//   updateBenhNhan, 
//   deleteBenhNhan,
//   login 
// } from '../controllers/benhNhan.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema, login as loginSchema } from '../validations/auth.validation.js';

// const router = express.Router();
// //LOGIN 
// router.post('/login',validation(loginSchema), login);
// // Lấy danh sách bệnh nhân
// router.get('/', verify, getBenhNhans);
// // Lấy thông tin bệnh nhân theo ID
// router.get('/:id_benh_nhan', verify, getBenhNhanById);
// // Tạo bệnh nhân mới
// router.post('/create', validation(registerSchema), verify, createBenhNhan);
// // Cập nhật thông tin bệnh nhân
// router.put('/update/:id_benh_nhan', verify, updateBenhNhan);
// // Xóa bệnh nhân
// router.delete('/delete/:id_benh_nhan', verify, deleteBenhNhan);

// export default router;