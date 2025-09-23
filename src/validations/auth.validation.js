import Joi from 'joi';

const login = Joi.object({
    ten_dang_nhap: Joi.string().required().messages({
        'string.empty': 'Tên đăng nhập là bắt buộc',
        'any.required': 'Tên đăng nhập là bắt buộc'
    }),
    mat_khau: Joi.string().required().messages({
        'string.empty': 'Mật khẩu là bắt buộc',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

// const register = Joi.object({
//     ho_ten: Joi.string().required().messages({
//         'string.empty': 'Họ tên là bắt buộc',
//         'any.required': 'Họ tên là bắt buộc'
//     }),
//     email: Joi.string().email().required().messages({
//         'string.email': 'Email không hợp lệ',
//         'string.empty': 'Email là bắt buộc',
//         'any.required': 'Email là bắt buộc'
//     }),
//     ten_dang_nhap: Joi.string().min(3).required().messages({
//         'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
//         'string.empty': 'Tên đăng nhập là bắt buộc',
//         'any.required': 'Tên đăng nhập là bắt buộc'
//     }),
//     mat_khau: Joi.string().min(6).required().messages({
//         'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
//         'string.empty': 'Mật khẩu là bắt buộc',
//         'any.required': 'Mật khẩu là bắt buộc'
//     }),
//     vai_tro: Joi.string().valid(
//         'benh_nhan', 
//         'bac_si', 
//         'chuyen_gia_dinh_duong', 
//         'nhan_vien_quay', 
//         'nhan_vien_phan_cong', 
//         'quan_tri_vien'
//     ).required().messages({
//         'any.only': 'Vai trò không hợp lệ',
//         'any.required': 'Vai trò là bắt buộc'
//     }),
//     so_dien_thoai: Joi.string().pattern(/^[0-9]{10,11}$/).optional().messages({
//         'string.pattern.base': 'Số điện thoại không hợp lệ'
//     }),
//     ngay_sinh: Joi.date().max('now').optional().messages({
//         'date.max': 'Ngày sinh không thể ở tương lai'
//     }),
//     gioi_tinh: Joi.string().valid('Nam', 'Nữ', 'Khác').optional().messages({
//         'any.only': 'Giới tính không hợp lệ'
//     }),
//     so_cccd: Joi.string().pattern(/^[0-9]{9,12}$/).optional().messages({
//         'string.pattern.base': 'Số CCCD không hợp lệ'
//     }),
//     dia_chi: Joi.string().optional()
// });

const changePassword = Joi.object({
    currentPassword: Joi.string().required().messages({
        'string.empty': 'Mật khẩu hiện tại là bắt buộc',
        'any.required': 'Mật khẩu hiện tại là bắt buộc'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu mới phải có ít nhất 6 ký tự',
        'string.empty': 'Mật khẩu mới là bắt buộc',
        'any.required': 'Mật khẩu mới là bắt buộc'
    })
});

export { changePassword , login};