import express from 'express';
import { 
    login,
    register,
    getUserById,
    getUsersByRole,
    getAllUsers,
    searchUsersForChat,
    updateUser,
    updateUserStatus,
    changePassword,
    refreshToken,
    CreateUser,
    requestPasswordResetCode,
    verifyPasswordResetCode,
    requestRegisterVerificationCode,
    verifyRegisterVerificationCode,
    loginWithGoogle
} from '../controllers/nguoiDung.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Đăng nhập
router.post('/login', login);

// Đăng nhập với Google
router.post('/login/google', loginWithGoogle);

// Quên mật khẩu
router.post('/forgot-password/request-code', requestPasswordResetCode);
router.post('/forgot-password/verify-code', verifyPasswordResetCode);

// Đăng ký - xác thực email
router.post('/register/request-code', requestRegisterVerificationCode);
router.post('/register/verify-code', verifyRegisterVerificationCode);

// Đăng ký
router.post('/register', register);


// Tạo người dùng theo role ( phân quyền của QTV )
router.post('/create-user', CreateUser);

// Refresh token
router.post('/refresh-token', refreshToken);

// Lấy tất cả người dùng
router.get('/all', verify, getAllUsers);

// Lấy danh sách người dùng theo vai trò
router.get('/vai_tro/', verify, getUsersByRole);

// Tìm kiếm người dùng nâng cao (cho chat)
router.get('/search/chat', verify, searchUsersForChat);

// Lấy thông tin người dùng theo ID
router.get('/:id_nguoi_dung', getUserById);

// Update trang thai người dùng
router.put('/updatetrangthai/:id_nguoi_dung', verify, updateUserStatus);

// Cập nhật thông tin người dùng
router.put('/:id_nguoi_dung', verify, updateUser);


// Đổi mật khẩu
router.post('/:id_nguoi_dung/change-password', verify, changePassword);

export default router;