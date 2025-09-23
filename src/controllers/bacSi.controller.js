// import BacSi from "../models/bacSi.model.js";
// import { hashedPassword } from "../utils/password.js";
// import { checkAge } from "../utils/checkAge.js";

// const getBacSis = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien', 'nhan_vien_phan_cong'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         let bacSis;
//         if (req.query.page && req.query.pageSize) {
//             const { page, pageSize, sortOrder } = req.query;
//             bacSis = await BacSi.getByPage(page, pageSize, sortOrder || 'ASC');
//         } else {
//             bacSis = await BacSi.getAllWithUserInfo();
//         }

//         res.status(200).json({ 
//             msg: 'Lấy danh sách bác sĩ thành công!', 
//             success: true, 
//             data: bacSis 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const getBacSiById = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien', 'nhan_vien_phan_cong', 'bac_si'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_bac_si = req.params.id_bac_si;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'bac_si' && req.decoded.id_nguoi_dung !== parseInt(id_bac_si)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const bacSi = await BacSi.getByIdWithUserInfo(id_bac_si);
//         if (!bacSi) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             data: bacSi 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const createBacSi = async (req, res) => {
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
//             id_chuyen_khoa,
//             chuyen_mon,
//             so_giay_phep_hang_nghe
//         } = req.body;

//         // Kiểm tra tuổi
//         if (!checkAge(ngay_sinh)) {
//             return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//         }

//         // Kiểm tra email đã tồn tại
//         let checkBacSi = await BacSi.findByEmail(email);
//         if (checkBacSi) {
//             return res.status(400).json({ success: false, message: "Email đã tồn tại." });
//         }

//         // Kiểm tra số điện thoại đã tồn tại
//         checkBacSi = await BacSi.findByPhone(so_dien_thoai);
//         if (checkBacSi) {
//             return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại." });
//         }

//         // Kiểm tra tên đăng nhập đã tồn tại
//         checkBacSi = await BacSi.findByUsername(ten_dang_nhap);
//         if (checkBacSi) {
//             return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
//         }

//         // Kiểm tra CCCD đã tồn tại
//         checkBacSi = await BacSi.findByIdentityNumber(so_cccd);
//         if (checkBacSi) {
//             return res.status(400).json({ success: false, message: "Số CCCD đã tồn tại." });
//         }

//         // Kiểm tra số giấy phép hành nghề đã tồn tại
//         checkBacSi = await BacSi.findByLicense(so_giay_phep_hang_nghe);
//         if (checkBacSi) {
//             return res.status(400).json({ success: false, message: "Số giấy phép hành nghề đã tồn tại." });
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
//             vai_tro: 'bac_si'
//         };

//         const newBacSiId = await BacSi.create(userData, {
//             id_chuyen_khoa,
//             chuyen_mon,
//             so_giay_phep_hang_nghe
//         });
        
//         return res.status(201).json({ 
//             success: true, 
//             message: "Tạo bác sĩ thành công.", 
//             id_bac_si: newBacSiId 
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: "Đã xảy ra lỗi.", 
//             error: error.message 
//         });
//     }
// };

// const updateBacSi = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_bac_si = req.params.id_bac_si;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'bac_si' && req.decoded.id_nguoi_dung !== parseInt(id_bac_si)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         if (!['bac_si', 'quan_tri_vien'].includes(role)) {
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
//             id_chuyen_khoa,
//             chuyen_mon,
//             so_giay_phep_hang_nghe,
//             dang_lam_viec
//         } = req.body;

//         // Tạo đối tượng cập nhật
//         let updateUserData = {};
//         let updateBacSiData = {};
        
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
        
//         if (id_chuyen_khoa) updateBacSiData.id_chuyen_khoa = id_chuyen_khoa;
//         if (chuyen_mon) updateBacSiData.chuyen_mon = chuyen_mon;
//         if (so_giay_phep_hang_nghe) updateBacSiData.so_giay_phep_hang_nghe = so_giay_phep_hang_nghe;
//         if (dang_lam_viec !== undefined) updateBacSiData.dang_lam_viec = dang_lam_viec;

//         // Cập nhật thông tin bác sĩ
//         const updatedRows = await BacSi.update(updateUserData, updateBacSiData, id_bac_si);
//         if (!updatedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Cập nhật thông tin bác sĩ thành công.",
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

// const deleteBacSi = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_bac_si = req.params.id_bac_si;
//         const deletedRows = await BacSi.delete(id_bac_si);
        
//         if (!deletedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Xóa bác sĩ thành công.",
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

// export { getBacSis, getBacSiById, createBacSi, updateBacSi, deleteBacSi };