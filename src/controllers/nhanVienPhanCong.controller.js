// import NhanVienPhanCong from "../models/nhanVienPhanCong.model.js";
// import { hashedPassword } from "../utils/password.js";
// import { checkAge } from "../utils/checkAge.js";

// const getNhanVienPhanCongs = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         let nhanVienPhanCongs;
//         if (req.query.page && req.query.pageSize) {
//             const { page, pageSize, sortOrder } = req.query;
//             nhanVienPhanCongs = await NhanVienPhanCong.getByPage(page, pageSize, sortOrder || 'ASC');
//         } else {
//             nhanVienPhanCongs = await NhanVienPhanCong.getAllWithUserInfo();
//         }

//         res.status(200).json({ 
//             msg: 'Lấy danh sách nhân viên phân công thành công!', 
//             success: true, 
//             data: nhanVienPhanCongs 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const getNhanVienPhanCongById = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien', 'nhan_vien_phan_cong'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_nhan_vien_phan_cong = req.params.id_nhan_vien_phan_cong;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'nhan_vien_phan_cong' && req.decoded.id_nguoi_dung !== parseInt(id_nhan_vien_phan_cong)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const nhanVienPhanCong = await NhanVienPhanCong.getByIdWithUserInfo(id_nhan_vien_phan_cong);
//         if (!nhanVienPhanCong) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên phân công." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             data: nhanVienPhanCong 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const createNhanVienPhanCong = async (req, res) => {
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
//             dia_chi,
//             ma_nhan_vien,
//             quyen_han_phan_cong
//         } = req.body;

//         // Kiểm tra tuổi
//         if (!checkAge(ngay_sinh)) {
//             return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//         }

//         // Kiểm tra email đã tồn tại
//         let checkNhanVien = await NhanVienPhanCong.findByEmail(email);
//         if (checkNhanVien) {
//             return res.status(400).json({ success: false, message: "Email đã tồn tại." });
//         }

//         // Kiểm tra số điện thoại đã tồn tại
//         checkNhanVien = await NhanVienPhanCong.findByPhone(so_dien_thoai);
//         if (checkNhanVien) {
//             return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại." });
//         }

//         // Kiểm tra tên đăng nhập đã tồn tại
//         checkNhanVien = await NhanVienPhanCong.findByUsername(ten_dang_nhap);
//         if (checkNhanVien) {
//             return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
//         }

//         // Kiểm tra CCCD đã tồn tại
//         checkNhanVien = await NhanVienPhanCong.findByIdentityNumber(so_cccd);
//         if (checkNhanVien) {
//             return res.status(400).json({ success: false, message: "Số CCCD đã tồn tại." });
//         }

//         // Kiểm tra mã nhân viên đã tồn tại
//         checkNhanVien = await NhanVienPhanCong.findByEmployeeCode(ma_nhan_vien);
//         if (checkNhanVien) {
//             return res.status(400).json({ success: false, message: "Mã nhân viên đã tồn tại." });
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
//             vai_tro: 'nhan_vien_phan_cong'
//         };

//         const newNhanVienId = await NhanVienPhanCong.create(userData, {
//             ma_nhan_vien,
//             quyen_han_phan_cong
//         });
        
//         return res.status(201).json({ 
//             success: true, 
//             message: "Tạo nhân viên phân công thành công.", 
//             id_nhan_vien_phan_cong: newNhanVienId 
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: "Đã xảy ra lỗi.", 
//             error: error.message 
//         });
//     }
// };

// const updateNhanVienPhanCong = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_nhan_vien_phan_cong = req.params.id_nhan_vien_phan_cong;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'nhan_vien_phan_cong' && req.decoded.id_nguoi_dung !== parseInt(id_nhan_vien_phan_cong)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         if (!['nhan_vien_phan_cong', 'quan_tri_vien'].includes(role)) {
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
//             dia_chi,
//             quyen_han_phan_cong
//         } = req.body;

//         // Tạo đối tượng cập nhật
//         let updateUserData = {};
//         let updateNhanVienData = {};
        
//         if (ho_ten) updateUserData.ho_ten = ho_ten;
//         if (email) updateUserData.email = email;
//         if (so_dien_thoai) updateUserData.so_dien_thoai = so_dien_thoai;
//         if (ten_dang_nhap) updateUserData.ten_dang_nhap = ten_dang_nhap;
//         if (mat_khau) {
//             const hashed = await hashedPassword(mat_khau);
//             updateUserData.mat_khau = hashed;
//         }
//         if (ngay_sinh) {
//             if (!checkAge(ngay_sinh)) {
//                 return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//             }
//             updateUserData.ngay_sinh = ngay_sinh;
//         }
//         if (gioi_tinh) updateUserData.gioi_tinh = gioi_tinh;
//         if (dia_chi) updateUserData.dia_chi = dia_chi;
        
//         if (quyen_han_phan_cong) updateNhanVienData.quyen_han_phan_cong = quyen_han_phan_cong;

//         // Cập nhật thông tin nhân viên phân công
//         const updatedRows = await NhanVienPhanCong.update(updateUserData, updateNhanVienData, id_nhan_vien_phan_cong);
//         if (!updatedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên phân công." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Cập nhật thông tin nhân viên phân công thành công.",
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

// const deleteNhanVienPhanCong = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_nhan_vien_phan_cong = req.params.id_nhan_vien_phan_cong;
//         const deletedRows = await NhanVienPhanCong.delete(id_nhan_vien_phan_cong);
        
//         if (!deletedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy nhân viên phân công." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Xóa nhân viên phân công thành công.",
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

// export { getNhanVienPhanCongs, getNhanVienPhanCongById, createNhanVienPhanCong, updateNhanVienPhanCong, deleteNhanVienPhanCong };