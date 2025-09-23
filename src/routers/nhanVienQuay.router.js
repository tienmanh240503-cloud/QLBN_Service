// import express from 'express';
// import { 
//   getNhanVienQuays, 
//   getNhanVienQuayById, 
//   createNhanVienQuay, 
//   updateNhanVienQuay, 
//   deleteNhanVienQuay 
// } from '../controllers/nhanVienQuay.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema } from '../validations/auth.validation.js';

// const router = express.Router();

// // Lấy danh sách nhân viên quầy
// router.get('/', verify, getNhanVienQuays);
// // Lấy thông tin nhân viên quầy theo ID
// router.get('/:id_nhan_vien_quay', verify, getNhanVienQuayById);
// // Tạo nhân viên quầy mới
// router.post('/create', validation(registerSchema), verify, createNhanVienQuay);
// // Cập nhật thông tin nhân viên quầy
// router.put('/update/:id_nhan_vien_quay', verify, updateNhanVienQuay);
// // Xóa nhân viên quầy
// router.delete('/delete/:id_nhan_vien_quay', verify, deleteNhanVienQuay);

// export default router;