import express from 'express';
import { 
    login,
    register,
    getUserById,
    getUsersByRole,
    updateUser,
    deleteUser,
    changePassword,
    refreshToken,
    CreateUser
} from '../controllers/nguoiDung.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';
// import { validation } from '../middlewares/validation.middleware.js';
// import { login as loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

// Đăng nhập
router.post('/login', login);

// Đăng ký
router.post('/register', register);

// Tạo người dùng theo role ( phân quyền của QTV )
router.post('/create-user', CreateUser);

// Refresh token
router.post('/refresh-token', refreshToken);

// Lấy danh sách người dùng theo vai trò
router.get('/vai_tro/', verify, getUsersByRole);

// Lấy thông tin người dùng theo ID
router.get('/:id_nguoi_dung', verify, getUserById);


// Cập nhật thông tin người dùng
router.put('/:id_nguoi_dung', verify, updateUser);

// Xóa người dùng
router.delete('/:id_nguoi_dung', verify, deleteUser);

// Đổi mật khẩu
router.post('/:id_nguoi_dung/change-password', verify, changePassword);

export default router;