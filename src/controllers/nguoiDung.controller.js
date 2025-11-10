import { NguoiDung, BenhNhan ,BacSi, ChuyenGiaDinhDuong,NhanVienPhanCong, NhanVienQuay } from "../models/index.js";
import { hashedPassword, comparePassword, generateRandomPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken } from "../utils/auth.js";
import { checkAgeForAccountCreation } from "../utils/checkAge.js";
import { v4 as uuidv4 } from 'uuid';
import db from "../configs/connectData.js";
import { sendEmail } from "../services/email.service.js";
import { getNewAccountEmail, getRegisterVerificationEmail } from "../services/email.service.js";
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

        // Kiểm tra tuổi (phải >= 6 tuổi mới được tạo tài khoản)
        if (ngay_sinh) {
            const ageCheck = checkAgeForAccountCreation(ngay_sinh);
            if (!ageCheck.isValid) {
                console.log(`[REGISTER] Người dùng không đủ tuổi: ${ageCheck.message}`);
                return res.status(400).json({ 
                    success: false, 
                    message: ageCheck.message 
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
            mat_khau, // Không bắt buộc nữa, sẽ được tạo tự động
            ngay_sinh, 
            gioi_tinh,
            vai_tro,
            dia_chi,
            so_cccd,
            // Bác sĩ fields
            id_chuyen_khoa,
            chuyen_mon,
            so_giay_phep_hang_nghe,
            gioi_thieu_ban_than,
            so_nam_kinh_nghiem,
            chuc_danh,
            chuc_vu,
            // Chuyên gia dinh dưỡng fields
            hoc_vi,
            so_chung_chi_hang_nghe,
            linh_vuc_chuyen_sau,
            chuyen_nganh_dinh_duong, // array of id_chuyen_nganh
            // Nhân viên quầy fields
            ma_nhan_vien,
            bo_phan_lam_viec,
            ca_lam_viec,
            // Nhân viên phân công fields
            quyen_han_phan_cong,
            // Nhân viên xét nghiệm fields
            // (chuyen_mon, so_chung_chi_hang_nghe, linh_vuc_chuyen_sau, so_nam_kinh_nghiem, chuc_vu đã được khai báo ở trên)
        } = req.body;

        // Kiểm tra các trường bắt buộc (không cần mat_khau nữa)
        if (!ho_ten || !email || !ten_dang_nhap || !vai_tro) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Tên đăng nhập, Vai trò)." 
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

        // Kiểm tra tuổi (phải >= 6 tuổi mới được tạo tài khoản)
        if (ngay_sinh) {
            const ageCheck = checkAgeForAccountCreation(ngay_sinh);
            if (!ageCheck.isValid) {
                console.log(`[CREATE_USER] Người dùng không đủ tuổi: ${ageCheck.message}`);
                return res.status(400).json({ 
                    success: false, 
                    message: ageCheck.message 
                });
            }
        }

        // Tạo mật khẩu ngẫu nhiên nếu không được cung cấp (cho admin tạo tài khoản)
        // Nếu có mat_khau từ req.body (từ đăng ký thông thường), sử dụng nó
        // Nếu không có (admin tạo), tạo mật khẩu ngẫu nhiên
        const plainPassword = mat_khau || generateRandomPassword(12);
        
        // Mã hóa mật khẩu
        const hashed = await hashedPassword(plainPassword);

        let prefix = '';
        switch(vai_tro) {
            case 'benh_nhan': prefix = 'BN_'; break;
            case 'bac_si': prefix = 'BS_'; break;
            case 'chuyen_gia_dinh_duong': prefix = 'CG_'; break;
            case 'nhan_vien_quay': prefix = 'NVQ_'; break;
            case 'nhan_vien_phan_cong': prefix = 'NVP_'; break;
            case 'nhan_vien_xet_nghiem': prefix = 'NVXN_'; break;
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
                    // Tạo bác sĩ với các trường bổ sung
                    const bacSiData = {
                        id_bac_si: Id,
                        id_chuyen_khoa: id_chuyen_khoa || null,
                        chuyen_mon: chuyen_mon || null,
                        so_giay_phep_hang_nghe: so_giay_phep_hang_nghe || null,
                        gioi_thieu_ban_than: gioi_thieu_ban_than || null,
                        so_nam_kinh_nghiem: so_nam_kinh_nghiem || null,
                        chuc_danh: chuc_danh || null,
                        chuc_vu: chuc_vu || null,
                        dang_lam_viec: true
                    };
                    await BacSi.create(bacSiData);
                    break;
                case 'chuyen_gia_dinh_duong':
                    // Tạo chuyên gia dinh dưỡng với các trường bổ sung
                    const chuyenGiaData = {
                        id_chuyen_gia: Id,
                        hoc_vi: hoc_vi || 'Cu nhan',
                        so_chung_chi_hang_nghe: so_chung_chi_hang_nghe || null,
                        linh_vuc_chuyen_sau: linh_vuc_chuyen_sau || null,
                        gioi_thieu_ban_than: gioi_thieu_ban_than || null,
                        chuc_vu: chuc_vu || null
                    };
                    await ChuyenGiaDinhDuong.create(chuyenGiaData);
                    
                    // Thêm các chuyên ngành dinh dưỡng nếu có
                    if (chuyen_nganh_dinh_duong && Array.isArray(chuyen_nganh_dinh_duong) && chuyen_nganh_dinh_duong.length > 0) {
                        const insertQuery = `INSERT INTO chuyengia_chuyennganhdinhduong (id_chuyen_gia, id_chuyen_nganh) VALUES ?`;
                        const values = chuyen_nganh_dinh_duong.map(id_chuyen_nganh => [Id, id_chuyen_nganh]);
                        
                        await new Promise((resolve, reject) => {
                            db.query(insertQuery, [values], (err, result) => {
                                if (err) reject(err);
                                else resolve(result);
                            });
                        });
                    }
                    break;
                case 'nhan_vien_quay':
                    // Tạo nhân viên quầy với các trường bổ sung
                    const nhanVienQuayData = {
                        id_nhan_vien_quay: Id,
                        ma_nhan_vien: ma_nhan_vien || '',
                        bo_phan_lam_viec: bo_phan_lam_viec || null,
                        ca_lam_viec: ca_lam_viec || null
                    };
                    await NhanVienQuay.create(nhanVienQuayData);
                    break;
                case 'nhan_vien_phan_cong':
                    // Tạo nhân viên phân công với các trường bổ sung
                    const nhanVienPhanCongData = {
                        id_nhan_vien_phan_cong: Id,
                        ma_nhan_vien: ma_nhan_vien || '',
                        quyen_han_phan_cong: quyen_han_phan_cong || 'phong_kham'
                    };
                    await NhanVienPhanCong.create(nhanVienPhanCongData);
                    break;
                case 'nhan_vien_xet_nghiem':
                    // Tạo nhân viên xét nghiệm với các trường bổ sung
                    const nhanVienXetNghiemData = {
                        id_nhan_vien: Id,
                        chuyen_mon: chuyen_mon || null,
                        so_chung_chi_hang_nghe: so_chung_chi_hang_nghe || null,
                        linh_vuc_chuyen_sau: linh_vuc_chuyen_sau || null,
                        so_nam_kinh_nghiem: so_nam_kinh_nghiem || null,
                        dang_lam_viec: true,
                        chuc_vu: chuc_vu || null
                    };
                    // Sử dụng raw query vì không có model NhanVienXetNghiem
                    const insertNVXNQuery = `INSERT INTO nhanvienxetnghiem (id_nhan_vien, chuyen_mon, so_chung_chi_hang_nghe, linh_vuc_chuyen_sau, so_nam_kinh_nghiem, dang_lam_viec, chuc_vu) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                    await new Promise((resolve, reject) => {
                        db.query(insertNVXNQuery, [
                            nhanVienXetNghiemData.id_nhan_vien,
                            nhanVienXetNghiemData.chuyen_mon,
                            nhanVienXetNghiemData.so_chung_chi_hang_nghe,
                            nhanVienXetNghiemData.linh_vuc_chuyen_sau,
                            nhanVienXetNghiemData.so_nam_kinh_nghiem,
                            nhanVienXetNghiemData.dang_lam_viec,
                            nhanVienXetNghiemData.chuc_vu
                        ], (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });
                    break;
                // case 'quan_tri_vien':
                //  tutu thêm 
                //     break;
                default:
                    // Vai trò không có bảng con tương ứng
                    break;
            }

            // Gửi email thông tin tài khoản (chỉ khi password được tạo tự động - admin tạo tài khoản)
            // Nếu mat_khau được cung cấp từ req.body, có thể là đăng ký thông thường, không gửi email
            if (!mat_khau) {
                try {
                    const emailTemplate = getNewAccountEmail(ho_ten, ten_dang_nhap, plainPassword, vai_tro, email);
                    const emailResult = await sendEmail({
                        to: email,
                        subject: "Thông tin tài khoản - Hệ thống Quản lý Bệnh viện",
                        html: emailTemplate.html,
                        text: emailTemplate.text
                    });

                    if (emailResult.success) {
                        console.log(`[CREATE_USER] Email đã được gửi thành công đến ${email}`);
                    } else {
                        console.error(`[CREATE_USER] Lỗi gửi email đến ${email}:`, emailResult.error);
                        // Không throw error, vì user đã được tạo thành công
                        // Chỉ log lỗi để admin biết
                    }
                } catch (emailError) {
                    console.error(`[CREATE_USER] Lỗi khi gửi email đến ${email}:`, emailError);
                    // Không throw error, vì user đã được tạo thành công
                }
            }
        }

        res.status(201).json({ 
            success: true, 
            message: mat_khau 
                ? "Đăng ký thành công." 
                : "Tài khoản đã được tạo thành công. Mật khẩu đã được gửi qua email.", 
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
        const { role, vai_tro } = req.query;
        const roleToSearch = role || vai_tro;
        
        if (!roleToSearch) {
            return res.status(400).json({
                success: false,
                message: "Thiếu tham số vai trò"
            });
        }
        
        let users = await NguoiDung.findAll({ vai_tro: roleToSearch, trang_thai_hoat_dong: true });
        
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


// Tìm kiếm người dùng nâng cao (cho chat)
const searchUsersForChat = async (req, res) => {
    try {
        const { 
            search = '', 
            vai_tro = '', 
            exclude_id 
        } = req.query;
        
        let users = await NguoiDung.findAll({ trang_thai_hoat_dong: true });
        
        // Lọc theo exclude_id (loại trừ chính mình)
        if (exclude_id) {
            users = users.filter(user => user.id_nguoi_dung !== exclude_id);
        }
        
        // Lọc theo vai trò nếu có
        if (vai_tro) {
            users = users.filter(user => user.vai_tro === vai_tro);
        }
        
        // Tìm kiếm theo từ khóa (tên, email, số điện thoại)
        if (search) {
            const searchLower = search.toLowerCase();
            users = users.filter(user => {
                const hoTen = (user.ho_ten || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                const soDienThoai = (user.so_dien_thoai || '').toLowerCase();
                return hoTen.includes(searchLower) || 
                       email.includes(searchLower) || 
                       soDienThoai.includes(searchLower);
            });
        }
        
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

        // Kiểm tra tuổi nếu có cập nhật ngày sinh (phải >= 6 tuổi)
        if (updateData.ngay_sinh) {
            const ageCheck = checkAgeForAccountCreation(updateData.ngay_sinh);
            if (!ageCheck.isValid) {
                console.log(`[UPDATE_USER] Người dùng không đủ tuổi: ${ageCheck.message}`);
                return res.status(400).json({ 
                    success: false, 
                    message: ageCheck.message 
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
        const { mat_khau_hien_tai, mat_khau_moi, nhap_lai_mat_khau_moi } = req.body;

        const user = await NguoiDung.findOne({id_nguoi_dung: id_nguoi_dung});
        if(!user){
            res.status(404).json({msg: 'User not found!',success: false});
            return;
        }
        if (!mat_khau_hien_tai || !mat_khau_moi || !nhap_lai_mat_khau_moi) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng nhập đủ mật khẩu hiện tại, mật khẩu mới và nhập lại mật khẩu mới." 
            });
        }
        if (mat_khau_moi !== nhap_lai_mat_khau_moi) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới và nhập lại mật khẩu mới không khớp."
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

        await NguoiDung.update({mat_khau : hashedNewPassword}, id_nguoi_dung);
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

// Yêu cầu mã quên mật khẩu (gửi 6 chữ số qua email) - Stateless
const requestPasswordResetCode = async (req, res) => {
    try {
        const { email_or_username } = req.body;
        if (!email_or_username) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập email hoặc tên đăng nhập." });
        }
        let user = await NguoiDung.findOne({ email: email_or_username });
        if (!user) {
            user = await NguoiDung.findOne({ ten_dang_nhap: email_or_username });
        }
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // Tạo mã 6 chữ số và token xác thực ngắn hạn
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const token = generateResetToken({ type: 'pwd_reset', id_nguoi_dung: user.id_nguoi_dung, code });

        // Gửi email mã
        const html = `
            <div style="font-family:Segoe UI,Arial,sans-serif">
                <h2>Mã xác thực quên mật khẩu</h2>
                <p>Xin chào ${user.ho_ten},</p>
                <p>Mã xác thực của bạn là:</p>
                <div style="font-size:24px; font-weight:700; letter-spacing:4px; padding:12px 16px; background:#f5f5f5; display:inline-block; border-radius:8px;">${code}</div>
                <p style="margin-top:16px;">Mã có hiệu lực trong 10 phút.</p>
            </div>
        `;
        await sendEmail({ to: user.email, subject: "Mã xác thực quên mật khẩu", html });

        return res.status(200).json({ success: true, message: "Đã gửi mã xác thực qua email.", data: { token } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi.", error: error.message });
    }
};

// Đăng ký - yêu cầu mã xác thực email (không cần tài khoản tồn tại)
const requestRegisterVerificationCode = async (req, res) => {
    try {
        const { email, ho_ten } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Thiếu email." });
        }

        // Chặn từ sớm: email đã tồn tại thì không gửi mã đăng ký nữa
        const existed = await NguoiDung.findOne({ email });
        if (existed) {
            return res.status(409).json({
                success: false,
                message: "Email đã tồn tại. Vui lòng đăng nhập hoặc sử dụng chức năng quên mật khẩu."
            });
        }

        // Tạo mã 6 chữ số và token ngắn hạn cho đăng ký
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const token = generateResetToken({ type: 'register_verify', email, code, ho_ten: ho_ten || null });

        // Gửi email mã cho tên đã nhập (không tra cứu user để tránh lấy nhầm tên)
        const template = getRegisterVerificationEmail(ho_ten, code);
        await sendEmail({ to: email, subject: "Mã xác thực đăng ký", html: template.html, text: template.text });

        return res.status(200).json({ success: true, message: "Đã gửi mã xác thực qua email.", data: { token } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi.", error: error.message });
    }
};

// Đăng ký - xác thực mã, trả token xác thực để đính kèm khi register
const verifyRegisterVerificationCode = async (req, res) => {
    try {
        const { token, code } = req.body;
        if (!token || !code) {
            return res.status(400).json({ success: false, message: "Thiếu token hoặc mã xác thực." });
        }
        const decoded = verifyResetToken(token);
        if (!decoded || decoded.type !== 'register_verify') {
            return res.status(400).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
        }
        if (decoded.code !== code) {
            return res.status(400).json({ success: false, message: "Mã xác thực không chính xác." });
        }

        // Kiểm tra lại tránh race condition: nếu email đã tồn tại thì dừng với thông điệp rõ ràng
        const existed = await NguoiDung.findOne({ email: decoded.email });
        if (existed) {
            return res.status(409).json({
                success: false,
                message: "Email đã tồn tại. Vui lòng đăng nhập hoặc sử dụng chức năng quên mật khẩu."
            });
        }

        // Tạo registerToken để xác nhận email đã verify, kèm email và tên nếu có
        const registerToken = generateResetToken({
            type: 'register_verified',
            email: decoded.email,
            ho_ten: decoded.ho_ten || null
        });

        return res.status(200).json({ success: true, message: "Đã xác thực email đăng ký.", data: { registerToken } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi.", error: error.message });
    }
};

// Xác thực mã và gửi mật khẩu mới qua email (giống logic tạo user)
const verifyPasswordResetCode = async (req, res) => {
    try {
        const { token, code } = req.body;
        if (!token || !code) {
            return res.status(400).json({ success: false, message: "Thiếu token hoặc mã xác thực." });
        }
        const decoded = verifyResetToken(token);
        if (!decoded || decoded.type !== 'pwd_reset') {
            return res.status(400).json({ success: false, message: "Token không hợp lệ hoặc đã hết hạn." });
        }
        if (decoded.code !== code) {
            return res.status(400).json({ success: false, message: "Mã xác thực không chính xác." });
        }

        // Lấy user
        const user = await NguoiDung.findOne({ id_nguoi_dung: decoded.id_nguoi_dung });
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
        }

        // Tạo mật khẩu mới và cập nhật
        const newPlainPassword = generateRandomPassword(12);
        const hashed = await hashedPassword(newPlainPassword);
        await NguoiDung.update({ mat_khau: hashed }, user.id_nguoi_dung);

        // Gửi email mật khẩu mới
        const emailTemplate = getNewAccountEmail(user.ho_ten, user.ten_dang_nhap, newPlainPassword, user.vai_tro, user.email);
        await sendEmail({ to: user.email, subject: "Mật khẩu mới của bạn", html: emailTemplate.html, text: emailTemplate.text });

        return res.status(200).json({ success: true, message: "Đã xác thực. Mật khẩu mới đã được gửi qua email." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi.", error: error.message });
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
    searchUsersForChat,
    updateUser,
    updateUserStatus,
    changePassword,
    refreshToken,
    CreateUser,
    requestPasswordResetCode,
    verifyPasswordResetCode,
    requestRegisterVerificationCode,
    verifyRegisterVerificationCode
};