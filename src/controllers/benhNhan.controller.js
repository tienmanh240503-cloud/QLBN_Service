// import BenhNhan from "../models/benhNhan.model.js"
// import { hashedPassword } from "../utils/password.js";
// import { checkAge } from "../utils/checkAge.js";

// const getBenhNhans = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['bac_si', 'quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         let benhNhans;
//         if (req.query.page && req.query.pageSize) {
//             const { page, pageSize, sortOrder } = req.query;
//             benhNhans = await BenhNhan.getByPage(page, pageSize, sortOrder || 'ASC');
//         } else {
//             benhNhans = await BenhNhan.getAll();
//         }

//         res.status(200).json({ 
//             msg: 'Lấy danh sách bệnh nhân thành công!', 
//             success: true, 
//             data: benhNhans 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const getBenhNhanById = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_benh_nhan = req.params.id_benh_nhan;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'benh_nhan' && req.decoded.id_nguoi_dung !== parseInt(id_benh_nhan)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         if (!['benh_nhan', 'bac_si', 'quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const benhNhan = await BenhNhan.getByIdWithUserInfo(id_benh_nhan);
//         if (!benhNhan) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             data: benhNhan 
//         });
//     } catch (error) {
//         res.status(500).json({
//             msg: error.message,
//             success: false,
//             stack: error.stack
//         });
//     }
// };

// const login = async (req, res) =>{
//     try {
//         const Email = req.body.Email;
//         const MatKhau = req.body.MatKhau;
//         const user = await BenhNhan.findOne({Email: Email});
//         if(!user){
//             res.status(404).json({msg: 'User not found!',success: false});
//             return;
//         }
//         const checkMatKhau = await comparePassword(MatKhau, user.MatKhau);
//         if (!checkMatKhau) {
//             return res.status(401).json({ msg: 'Incorrect password!', success: false });
//         }
//         const accessToken = generateAccessToken(user,DB_CONFID.resourses.user.role);
//         const refreshToken = generateRefreshToken(user,DB_CONFID.resourses.user.role);
//         res.status(200).json({msg: 'Login sussecfully!',success: true,accessToken,refreshToken, userInfo: user, role: DB_CONFID.resourses.user.role});
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }
// const createBenhNhan = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const { ho_ten, email, so_dien_thoai, ten_dang_nhap, mat_khau, ngay_sinh, gioi_tinh, so_cccd, dia_chi } = req.body;

//         // Kiểm tra tuổi
//         if (!checkAge(ngay_sinh)) {
//             return res.status(400).json({ success: false, message: "Tuổi phải trên 18." });
//         }

//         // Kiểm tra email đã tồn tại
//         let checkBenhNhan = await BenhNhan.findByEmail(email);
//         if (checkBenhNhan) {
//             return res.status(400).json({ success: false, message: "Email đã tồn tại." });
//         }

//         // Kiểm tra số điện thoại đã tồn tại
//         checkBenhNhan = await BenhNhan.findByPhone(so_dien_thoai);
//         if (checkBenhNhan) {
//             return res.status(400).json({ success: false, message: "Số điện thoại đã tồn tại." });
//         }

//         // Kiểm tra tên đăng nhập đã tồn tại
//         checkBenhNhan = await BenhNhan.findByUsername(ten_dang_nhap);
//         if (checkBenhNhan) {
//             return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại." });
//         }

//         // Kiểm tra CCCD đã tồn tại
//         checkBenhNhan = await BenhNhan.findByIdentityNumber(so_cccd);
//         if (checkBenhNhan) {
//             return res.status(400).json({ success: false, message: "Số CCCD đã tồn tại." });
//         }

//         const hashed = await hashedPassword(mat_khau);
//         const benhNhanData = { 
//             ho_ten, 
//             email, 
//             so_dien_thoai, 
//             ten_dang_nhap, 
//             mat_khau: hashed, 
//             ngay_sinh, 
//             gioi_tinh, 
//             so_cccd, 
//             dia_chi,
//             vai_tro: 'benh_nhan'
//         };

//         const newBenhNhanId = await BenhNhan.create(benhNhanData);
        
//         return res.status(201).json({ 
//             success: true, 
//             message: "Tạo bệnh nhân thành công.", 
//             id_benh_nhan: newBenhNhanId 
//         });
//     } catch (error) {
//         return res.status(500).json({ 
//             success: false, 
//             message: "Đã xảy ra lỗi.", 
//             error: error.message 
//         });
//     }
// };

// const updateBenhNhan = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         const id_benh_nhan = req.params.id_benh_nhan;
        
//         // Kiểm tra quyền truy cập
//         if (role === 'benh_nhan' && req.decoded.id_nguoi_dung !== parseInt(id_benh_nhan)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         if (!['benh_nhan', 'quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const { ho_ten, email, so_dien_thoai, ten_dang_nhap, mat_khau, ngay_sinh, gioi_tinh, dia_chi } = req.body;

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

//         // Cập nhật thông tin bệnh nhân
//         const updatedRows = await BenhNhan.update(updateData, id_benh_nhan);
//         if (!updatedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Cập nhật thông tin bệnh nhân thành công.",
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

// const deleteBenhNhan = async (req, res) => {
//     try {
//         const role = req.decoded.vai_tro;
//         if (!role || !['quan_tri_vien'].includes(role)) {
//             return res.status(401).json({ msg: 'Không có quyền truy cập!', success: false });
//         }

//         const id_benh_nhan = req.params.id_benh_nhan;
//         const deletedRows = await BenhNhan.delete(id_benh_nhan);
        
//         if (!deletedRows) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân." });
//         }

//         res.status(200).json({ 
//             success: true, 
//             message: "Xóa bệnh nhân thành công.",
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

// export { getBenhNhans, getBenhNhanById, createBenhNhan, updateBenhNhan, deleteBenhNhan, login };