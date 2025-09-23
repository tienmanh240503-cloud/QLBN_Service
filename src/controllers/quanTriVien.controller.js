// import QuanTriVien from "../models/quanTriVien.model.js";
// import { hashedPassword } from "../utils/password.js";
// import { checkAge } from "../utils/checkAge.js";
// import { generateAccessToken, verifyRefreshToken } from "../utils/auth.js";

// const getQuanTriViens = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         let quanTriViens;
//         if (req.query.page && req.query.pageSize) {
//             const { page, pageSize, sortOrder } = req.query;
//             quanTriViens = await QuanTriVien.getByPage(page, pageSize, sortOrder || 'ASC');
//         } else {
//             quanTriViens = await QuanTriVien.getAllWithUserInfo();
//         }

//         res.status(200).json({ 
//             msg: 'Lấy danh sách quản trị viên thành công!', 
//             success: true, 
//             data: quanTriViens 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const getQuanTriVienById = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_quan_tri_vien = req.params.id_quan_tri_vien;
        
//         // Kiểm tra quyền truy cập
//         if (req.decoded.id_nguoi_dung !== parseInt(id_quan_tri_vien)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const quanTriVien = await QuanTriVien.getByIdWithUserInfo(id_quan_tri_vien);
//         if (!quanTriVien) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy quản trị viên." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             data: quanTriVien 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const createQuanTriVien = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const { 
//             ho_ten, 
//             email, 
//             so_dien_thoai, 
//             ten_dang_nhap, 
//             mat_khau, 
//             ngay_sinh, 
//             gioi_tinh, 
//             so_cccd, 
//             dia_chi
//         } = req.body;

//         // Kiểm tra tuổi
//         if (!checkAge(ngay_sinh)) {
//             return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//         }

//         // Kiểm tra email đã tồn tại
//         let checkQuanTriVien = await QuanTriVien.findByEmail(email);
//         if (checkQuanTriVien) {
//             return res.status(400).json({ success: false, message: "Email đã tồn tại." });
//         }

//         // Kiểm tra số điện thoại đã tồn tại
//         checkQuanTriVien = await QuanTriVien.findByPhone(so_dien_thoai);
//         if (checkQuanTriVien) {
//             return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại." });
//         }

//         // Kiểm tra tên đăng nhập đã tồn tại
//         checkQuanTriVien = await QuanTriVien.findByUsername(ten_dang_nhap);
//         if (checkQuanTriVien) {
//             return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
//         }

//         // Kiểm tra CCCD đã tồn tại
//         checkQuanTriVien = await QuanTriVien.findByIdentityNumber(so_cccd);
//         if (checkQuanTriVien) {
//             return res.status(400).json({ success: false, message: "Số CCCD đã tồn tại." });
//         }

//         const hashed = await hashedPassword(mat_khau);
        
//         // Tạo người dùng trước
//         const userData = { 
//             ho_ten, 
//             email, 
//             so_dien_thoai, 
//             ten_dang_nhap, 
//             mat_khau: hashed, 
//             ngay_sinh, 
//             gioi_tinh, 
//             so_cccd, 
//             dia_chi,
//             vai_tro: 'quan_tri_vien'
//         };

//         const newQuanTriVienId = await QuanTriVien.create(userData);
        
//         return res.status(201).json({ 
//             success: true, 
//             message: "Tạo quản trị viên thành công.", 
//             id_quan_tri_vien: newQuanTriVienId 
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: "Đã xảy ra lỗi.", 
//             error: error.message 
//         });
//     }
// };

// const updateQuanTriVien = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_quan_tri_vien = req.params.id_quan_tri_vien;
        
//         // Kiểm tra quyền truy cập
//         if (req.decoded.id_nguoi_dung !== parseInt(id_quan_tri_vien)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const { 
//             ho_ten, 
//             email, 
//             so_dien_thoai, 
//             ten_dang_nhap, 
//             mat_khau, 
//             ngay_sinh, 
//             gioi_tinh, 
//             dia_chi
//         } = req.body;

//         // Tạo đối tượng cập nhật
//         let updateData = {};
        
//         if (ho_ten) updateData.ho_ten = ho_ten;
//         if (email) updateData.email = email;
//         if (so_dien_thoai) updateData.so_dien_thoai = so_dien_thoai;
//         if (ten_dang_nhap) updateData.ten_dang_nhap = ten_dang_nhap;
//         if (mat_khau) {
//             const hashed = await hashedPassword(mat_khau);
//             updateData.mat_khau = hashed;
//         }
//         if (ngay_sinh) {
//             if (!checkAge(ngay_sinh)) {
//                 return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//             }
//             updateData.ngay_sinh = ngay_sinh;
//         }
//         if (gioi_tinh) updateData.gioi_tinh = gioi_tinh;
//         if (dia_chi) updateData.dia_chi = dia_chi;

//         // Cập nhật thông tin quản trị viên
//         const updatedRows = await QuanTriVien.update(updateData, id_quan_tri_vien);
//         if (!updatedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy quản trị viên." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Cập nhật thông tin quản trị viên thành công.",
//             affectedRows: updatedRows 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const deleteQuanTriVien = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_quan_tri_vien = req.params.id_quan_tri_vien;
        
//         // Không cho phép tự xóa chính mình
//         if (req.decoded.id_nguoi_dung === parseInt(id_quan_tri_vien)) {
//             return res.status(400).json({ success: false, message: "Không thể tự xóa tài khoản của chính mình." });
//         }

//         const deletedRows = await QuanTriVien.delete(id_quan_tri_vien);
        
//         if (!deletedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy quản trị viên." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Xóa quản trị viên thành công.",
//             affectedRows: deletedRows 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const requestRefreshTokenQuanTriVien = async (req, res) => {
//     try {
//         const { refreshToken } = req.body;
//         if (!refreshToken) {
//             return res.status(400).json({ msg: 'Refresh token là bắt buộc!', success: false });
//         }

//         const admin = verifyRefreshToken(refreshToken);
//         if (!admin) {
//             return res.status(404).json({ msg: 'Refresh token không hợp lệ!', success: false });
//         }

//         // Kiểm tra role
//         if (admin.info.vai_tro !== 'quan_tri_vien') {
//             return res.status(403).json({ msg: 'Vai trò không được ủy quyền!', success: false });
//         }

//         const newAccessToken = generateAccessToken(admin, 'quan_tri_vien');
//         res.status(200).json({ 
//             msg: 'Yêu cầu refresh token thành công!', 
//             success: true, 
//             accessToken: newAccessToken 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// export { 
//     getQuanTriViens, 
//     getQuanTriVienById, 
//     createQuanTriVien, 
//     updateQuanTriVien, 
//     deleteQuanTriVien, 
//     requestRefreshTokenQuanTriVien 
// };