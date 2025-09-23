// import ChuyenGiaDinhDuong from "../models/chuyenGiaDinhDuong.model.js";
// import { hashedPassword } from "../utils/password.js";
// import { checkAge } from "../utils/checkAge.js";

// const getChuyenGiaDinhDuongs = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         let chuyenGias;
//         if (req.query.page && req.query.pageSize) {
//             const { page, pageSize, sortOrder } = req.query;
//             chuyenGias = await ChuyenGiaDinhDuong.getByPage(page, pageSize, sortOrder || 'ASC');
//         } else {
//             chuyenGias = await ChuyenGiaDinhDuong.getAllWithUserInfo();
//         }

//         res.status(200).json({ 
//             msg: 'Lấy danh sách chuyên gia dinh dưỡng thành công!', 
//             success: true, 
//             data: chuyenGias 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const getChuyenGiaDinhDuongById = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien', 'chuyen_gia_dinh_duong'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_chuyen_gia = req.params.id_chuyen_gia;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'chuyen_gia_dinh_duong' && req.decoded.id_nguoi_dung !== parseInt(id_chuyen_gia)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const chuyenGia = await ChuyenGiaDinhDuong.getByIdWithUserInfo(id_chuyen_gia);
//         if (!chuyenGia) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy chuyên gia dinh dưỡng." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             data: chuyenGia 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const createChuyenGiaDinhDuong = async (req, res) => {
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
//             hoc_vi,
//             so_chung_chi_hang_nghe,
//             linh_vuc_chuyen_sau
//         } = req.body;

//         // Kiểm tra tuổi
//         if (!checkAge(ngay_sinh)) {
//             return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//         }

//         // Kiểm tra email đã tồn tại
//         let checkChuyenGia = await ChuyenGiaDinhDuong.findByEmail(email);
//         if (checkChuyenGia) {
//             return res.status(400).json({ success: false, message: "Email đã tồn tại." });
//         }

//         // Kiểm tra số điện thoại đã tồn tại
//         checkChuyenGia = await ChuyenGiaDinhDuong.findByPhone(so_dien_thoai);
//         if (checkChuyenGia) {
//             return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại." });
//         }

//         // Kiểm tra tên đăng nhập đã tồn tại
//         checkChuyenGia = await ChuyenGiaDinhDuong.findByUsername(ten_dang_nhap);
//         if (checkChuyenGia) {
//             return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
//         }

//         // Kiểm tra CCCD đã tồn tại
//         checkChuyenGia = await ChuyenGiaDinhDuong.findByIdentityNumber(so_cccd);
//         if (checkChuyenGia) {
//             return res.status(400).json({ success: false, message: "Số CCCD đã tồn tại." });
//         }

//         // Kiểm tra số chứng chỉ hành nghề đã tồn tại
//         checkChuyenGia = await ChuyenGiaDinhDuong.findByCertificate(so_chung_chi_hang_nghe);
//         if (checkChuyenGia) {
//             return res.status(400).json({ success: false, message: "Số chứng chỉ hành nghề đã tồn tại." });
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
//             vai_tro: 'chuyen_gia_dinh_duong'
//         };

//         const newChuyenGiaId = await ChuyenGiaDinhDuong.create(userData, {
//             hoc_vi,
//             so_chung_chi_hang_nghe,
//             linh_vuc_chuyen_sau
//         });
        
//         return res.status(201).json({ 
//             success: true, 
//             message: "Tạo chuyên gia dinh dưỡng thành công.", 
//             id_chuyen_gia: newChuyenGiaId 
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: "Đã xảy ra lỗi.", 
//             error: error.message 
//         });
//     }
// };

// const updateChuyenGiaDinhDuong = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_chuyen_gia = req.params.id_chuyen_gia;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'chuyen_gia_dinh_duong' && req.decoded.id_nguoi_dung !== parseInt(id_chuyen_gia)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         if (!['chuyen_gia_dinh_duong', 'quan_tri_vien'].includes(role)) {
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
//             hoc_vi,
//             so_chung_chi_hang_nghe,
//             linh_vuc_chuyen_sau
//         } = req.body;

//         // Tạo đối tượng cập nhật
//         let updateUserData = {};
//         let updateChuyenGiaData = {};
        
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
        
//         if (hoc_vi) updateChuyenGiaData.hoc_vi = hoc_vi;
//         if (so_chung_chi_hang_nghe) updateChuyenGiaData.so_chung_chi_hang_nghe = so_chung_chi_hang_nghe;
//         if (linh_vuc_chuyen_sau) updateChuyenGiaData.linh_vuc_chuyen_sau = linh_vuc_chuyen_sau;

//         // Cập nhật thông tin chuyên gia dinh dưỡng
//         const updatedRows = await ChuyenGiaDinhDuong.update(updateUserData, updateChuyenGiaData, id_chuyen_gia);
//         if (!updatedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy chuyên gia dinh dưỡng." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Cập nhật thông tin chuyên gia dinh dưỡng thành công.",
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

// const deleteChuyenGiaDinhDuong = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_chuyen_gia = req.params.id_chuyen_gia;
//         const deletedRows = await ChuyenGiaDinhDuong.delete(id_chuyen_gia);
        
//         if (!deletedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy chuyên gia dinh dưỡng." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Xóa chuyên gia dinh dưỡng thành công.",
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

// export { getChuyenGiaDinhDuongs, getChuyenGiaDinhDuongById, createChuyenGiaDinhDuong, updateChuyenGiaDinhDuong, deleteChuyenGiaDinhDuong };