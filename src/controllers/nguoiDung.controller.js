import { NguoiDung, BenhNhan ,BacSi, ChuyenGiaDinhDuong,NhanVienPhanCong, NhanVienQuay } from "../models/index.js";
import { hashedPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/auth.js";
import { v4 as uuidv4 } from 'uuid';
// Đăng nhập
const login = async (req, res) => {
    try {
        const { ten_dang_nhap, mat_khau } = req.body;
        if (!ten_dang_nhap || !mat_khau) {
            return res.status(400).json({ 
                success: false, 
                message: "Tên đăng nhập và mật khẩu là bắt buộc." 
            });
        }
        // Tìm user theo username hoặc email
        let user = await NguoiDung.findOne({ ten_dang_nhap });
        if (!user) {
            user = await NguoiDung.findOne({ email : ten_dang_nhap });
        }

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Tên đăng nhập hoặc email không tồn tại." 
            });
        }

        // Kiểm tra trạng thái hoạt động
        if (!user.trang_thai_hoat_dong) {
            return res.status(401).json({ 
                success: false, 
                message: "Tài khoản đã bị vô hiệu hóa." 
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await comparePassword(mat_khau, user.mat_khau);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Mật khẩu không chính xác." 
            });
        }

        // Tạo tokens
        const accessToken = generateAccessToken(user, user.vai_tro);
        const refreshToken = generateRefreshToken(user, user.vai_tro);

        // Ẩn mật khẩu trong response
        const { mat_khau: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công.",
            data: {
                user: userWithoutPassword,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};

// Đăng ký (cho user)
const register = async (req, res) => {
    try {
        const { 
            ho_ten, 
            email, 
            so_dien_thoai, 
            ten_dang_nhap, 
            mat_khau, 
            ngay_sinh, 
            gioi_tinh, 
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!ho_ten || !email || !ten_dang_nhap || !mat_khau) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng điền đầy đủ thông tin bắt buộc." 
            });
        }

        // Kiểm tra email đã tồn tại
        let existingUser = await NguoiDung.findOne({email});
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email đã tồn tại." 
            });
        }

        // Kiểm tra tên đăng nhập đã tồn tại
        existingUser = await NguoiDung.findOne({ten_dang_nhap});
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Tên đăng nhập đã tồn tại." 
            });
        }

        // Kiểm tra số điện thoại nếu có
        if (so_dien_thoai) {
            existingUser = await NguoiDung.findOne({so_dien_thoai});
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Số điện thoại đã tồn tại." 
                });
            }
        }

        // Mã hóa mật khẩu
        const hashed = await hashedPassword(mat_khau);

        const Id = `BN_${uuidv4()}`;

        const userData = { 
            id_nguoi_dung: Id,
            ho_ten, 
            email, 
            so_dien_thoai, 
            ten_dang_nhap, 
            mat_khau: hashed, 
            ngay_sinh, 
            gioi_tinh,
            vai_tro : "benh_nhan",
            so_cccd : null,
            trang_thai_hoat_dong: true
        };

        const userId = await NguoiDung.create(userData);
        if(userId){
            await BenhNhan.create({ id_benh_nhan: userId.id_nguoi_dung });
        }

        res.status(201).json({ 
            success: true, 
            message: "Đăng ký thành công.", 
            data: { id_nguoi_dung: userId } 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};


// Đăng ký (theo vai tro)
const CreateUser = async (req, res) => {
    try {
        const { 
            ho_ten, 
            email, 
            so_dien_thoai, 
            ten_dang_nhap, 
            mat_khau, 
            ngay_sinh, 
            gioi_tinh,
            vai_tro,
            dia_chi,
            so_cccd
        } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!ho_ten || !email || !ten_dang_nhap || !mat_khau || !vai_tro) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng điền đầy đủ thông tin bắt buộc." 
            });
        }

        // Kiểm tra email đã tồn tại
        let existingUser = await NguoiDung.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Email đã tồn tại." 
            });
        }

        // Kiểm tra tên đăng nhập đã tồn tại
        existingUser = await NguoiDung.findOne({ ten_dang_nhap });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: "Tên đăng nhập đã tồn tại." 
            });
        }

        // Kiểm tra số điện thoại nếu có
        if (so_dien_thoai) {
            existingUser = await NguoiDung.findOne({ so_dien_thoai });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Số điện thoại đã tồn tại." 
                });
            }
        }

        // Mã hóa mật khẩu
        const hashed = await hashedPassword(mat_khau);

        let prefix = '';
        switch(vai_tro) {
            case 'benh_nhan': prefix = 'BN_'; break;
            case 'bac_si': prefix = 'BS_'; break;
            case 'chuyen_gia_dinh_duong': prefix = 'CG_'; break;
            case 'nhan_vien_quay': prefix = 'NVQ_'; break;
            case 'nhan_vien_phan_cong': prefix = 'NVP_'; break;
            case 'quan_tri_vien': prefix = 'QTV_'; break;
            default: prefix = 'USER_';
        }

        const Id = `${prefix}${uuidv4()}`;

        // Dữ liệu user
        const userData = { 
            id_nguoi_dung: Id,
            ho_ten, 
            email, 
            so_dien_thoai, 
            ten_dang_nhap, 
            mat_khau: hashed, 
            ngay_sinh, 
            gioi_tinh,
            vai_tro,
            dia_chi,
            so_cccd,
            trang_thai_hoat_dong: true
        };

        // Tạo user trong bảng nguoidung
        const userId = await NguoiDung.create(userData);

        if (userId) {
            switch(vai_tro) {
                case 'benh_nhan':
                    await BenhNhan.create({ id_benh_nhan: Id });
                    break;
                case 'bac_si':
                    await BacSi.create({ id_bac_si: Id });
                    break;
                case 'chuyen_gia_dinh_duong':
                    await ChuyenGiaDinhDuong.create({ id_chuyen_gia: Id });
                    break;
                case 'nhan_vien_quay':
                    await NhanVienQuay.create({ id_nhan_vien_quay: Id });
                    break;
                case 'nhan_vien_phan_cong':
                    await NhanVienPhanCong.create({ id_nhan_vien_phan_cong: Id });
                    break;
                // case 'quan_tri_vien':
                //  tutu thêm 
                //     break;
                default:
                    console.log(`Vai trò "${vai_tro}" không có bảng con tương ứng`);
            }
        }

        res.status(201).json({ 
            success: true, 
            message: "Đăng ký thành công.", 
            data: { id_nguoi_dung: userId } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};


// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
    try {
        console.log(req.decoded);
        const userId = req.params.id_nguoi_dung;
        const user = await NguoiDung.getById(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy người dùng." 
            });
        }

        // Ẩn mật khẩu
        const { mat_khau: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};

// Lấy danh sách người dùng theo vai trò
const getUsersByRole = async (req, res) => {
    try {
        const { vai_tro } = req.body;
        let users = await NguoiDung.findAll({ vai_tro , trang_thai_hoat_dong : true });
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};


// Tìm kiếm người dùng
// const searchUsers = async (req, res) => {
//     try {
//         const { ho_ten, vai_tro } = req.query;
        
//         if (!ho_ten) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "Vui lòng nhập từ khóa tìm kiếm." 
//             });
//         }

//         const users = await NguoiDung.findOne(ho_ten, vai_tro);

//         // Ẩn mật khẩu
//         const usersWithoutPassword = users.map(user => {
//             const { mat_khau, ...userWithoutPassword } = user;
//             return userWithoutPassword;
//         });

//         res.status(200).json({
//             success: true,
//             data: usersWithoutPassword
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Đã xảy ra lỗi.",
//             error: error.message
//         });
//     }
// };

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const id_nguoi_dung = req.params.id_nguoi_dung;
        const updateData = req.body;
        // Kiểm tra người dùng tồn tại
        const existingUser = await NguoiDung.findOne({id_nguoi_dung});
        if (!existingUser) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy người dùng." 
            });
        }

        // Kiểm tra email trùng (nếu có cập nhật email)
        if (updateData.email && updateData.email !== existingUser.email) {
            const emailExists = await NguoiDung.findOne({email : updateData.email});
            if (emailExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Email đã tồn tại." 
                });
            }
        }

        // Kiểm tra username trùng (nếu có cập nhật username)
        if (updateData.ten_dang_nhap && updateData.ten_dang_nhap !== existingUser.ten_dang_nhap) {
            const usernameExists = await NguoiDung.findOne({ten_dang_nhap : updateData.ten_dang_nhap});
            if (usernameExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Tên đăng nhập đã tồn tại." 
                });
            }
        }

        // Kiểm tra số điện thoại trùng (nếu có cập nhật)
        if (updateData.so_dien_thoai && updateData.so_dien_thoai !== existingUser.so_dien_thoai) {
            const phoneExists = await NguoiDung.findOne({ so_dien_thoai: updateData.so_dien_thoai });
            if (phoneExists) {
                return res.status(400).json({
                    success: false,
                    message: "Số điện thoại đã tồn tại."
                });
            }
        }

        // Mã hóa mật khẩu nếu có cập nhật
        if (updateData.mat_khau) {
            updateData.mat_khau = await hashedPassword(updateData.mat_khau);
        }

        const affectedRows = await NguoiDung.update(updateData ,id_nguoi_dung);

        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công.",
            affectedRows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};


// Xóa người dùng
const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id_nguoi_dung;

        // Kiểm tra người dùng tồn tại
        const existingUser = await NguoiDung.getById(userId);
        if (!existingUser) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy người dùng." 
            });
        }
        const affectedRows = await NguoiDung.update({trang_thai_hoat_dong : false}, userId);

        res.status(200).json({
            success: true,
            message: "Tắt hoạt động người dùng thành công.",
            affectedRows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
    try {
        const users = await NguoiDung.getAll();
        
        // Ẩn mật khẩu trong response
        const usersWithoutPassword = users.map(user => {
            const { mat_khau, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json({
            success: true,
            data: usersWithoutPassword
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};

// Đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const id_nguoi_dung = req.params.id_nguoi_dung;
        const { mat_khau_hien_tai, mat_khau_moi } = req.body;

        const user = await NguoiDung.findOne({id_nguoi_dung: id_nguoi_dung});
        if(!user){
            res.status(404).json({msg: 'User not found!',success: false});
            return;
        }
        if (!mat_khau_hien_tai || !mat_khau_moi) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới." 
            });
        }

        // Kiểm tra mật khẩu hiện tại
        const isCurrentPasswordValid = await comparePassword(mat_khau_hien_tai, user.mat_khau);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Mật khẩu hiện tại không chính xác." 
            });
        }
        // Mã hóa mật khẩu mới
        const hashedNewPassword = await hashedPassword(mat_khau_moi);

        const updateMatKhau = await NguoiDung.update({mat_khau : hashedNewPassword}, id_nguoi_dung);
        res.status(200).json({
            success: true,
            message: "Đổi mật khẩu thành công."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi.",
            error: error.message
        });
    }
};

// Refresh token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ 
                success: false, 
                message: "Refresh token là bắt buộc." 
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: "Refresh token không hợp lệ hoặc đã hết hạn." 
            });
        }

        // Lấy thông tin user
        const userId = decoded.info?.id_nguoi_dung; 
        const user = await NguoiDung.findOne({ id_nguoi_dung: userId });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "Người dùng không tồn tại." 
            });
        }

        // Tạo access token mới
        const newAccessToken = generateAccessToken(user, user.vai_tro);

        res.status(200).json({
            success: true,
            message: "Tạo access token mới thành công.",
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi server.",
            error: error.message
        });
    }
};

export {
    login,
    register,
    getUserById,
    getUsersByRole,
    getAllUsers,
    // searchUsers,
    updateUser,
    updateUserStatus,
    changePassword,
    refreshToken,
    CreateUser
};