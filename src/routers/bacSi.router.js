// import express from 'express';
// import { 
//   getBacSis, 
//   getBacSiById, 
//   createBacSi, 
//   updateBacSi, 
//   deleteBacSi 
// } from '../controllers/bacSi.controller.js';
// import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { register as registerSchema } from '../validations/auth.validation.js';

// const router = express.Router();

// // Lấy danh sách bác sĩ
// router.get('/', verify, getBacSis);
// // Lấy thông tin bác sĩ theo ID
// router.get('/:id_bac_si', verify, getBacSiById);
// // Tạo bác sĩ mới
// router.post('/create', validation(registerSchema), verify, createBacSi);
// // Cập nhật thông tin bác sĩ
// router.put('/update/:id_bac_si', verify, updateBacSi);
// // Xóa bác sĩ
// router.delete('/delete/:id_bac_si', verify, deleteBacSi);

// export default router;