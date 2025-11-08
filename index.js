import express from 'express';
import dotenv from 'dotenv';
import { SERVER_CONFIG } from './src/configs/server.config.js';
// Import routes
import nguoiDungRouter from './src/routers/nguoiDung.router.js';
import thuocRouter from './src/routers/thuoc.router.js';
import hoSoKhamBenhRouter from './src/routers/hoSoKhamBenh.router.js';
import hoSoDinhDuongRouter from './src/routers/hoSoDinhDuong.router.js';
import donThuocRouter from './src/routers/donThuoc.router.js';
import chiTietDonThuocRouter from './src/routers/chitietdonthuoc.router.js';
import cuocHenKhamBenhRouter from './src/routers/cuocHenKhamBenh.router.js';
import cuocHenTuVanRouter from './src/routers/cuocHenTuVan.router.js';
import khungGioKhamRouter from './src/routers/khungGioKham.router.js';
import chuyenKhoa from './src/routers/chuyenkhoa.route.js';
import lichLamViec from './src/routers/lichlamviec.router.js';
import chiDinhXetNghiem from './src/routers/chiDinhXetNghiemRouter.js';
import ketQuaXetNghiem from './src/routers/ketQuaXetNghiemRouter.js';
import hoaDon from './src/routers/hoaDon.router.js';
import dichVu from './src/routers/dichVu.router.js';
import chiTietHoaDon from './src/routers/chiTietHoaDon.router.js';
import benhNhanRouter from './src/routers/benhNhan.router.js';
import bacSiRouter from './src/routers/bacSi.router.js';
import chuyenGiaDinhDuongRouter from './src/routers/chuyenGiaDinhDuong.router.js';
import nhanVienQuayRouter from './src/routers/nhanVienQuay.router.js';
import nhanVienPhanCongRouter from './src/routers/nhanVienPhanCong.router.js';
import lichSuKhamRouter from './src/routers/lichSuKham.router.js';
import lichSuTuVanRouter from './src/routers/lichSuTuVan.router.js';
import xinNghiPhepRouter from './src/routers/xinNghiPhep.router.js';
import uploadRouter from './src/routers/upload.route.js';
import phongKhamRouter from './src/routers/phongKham.router.js';
import tinNhanRouter from './src/routers/tinNhan.router.js';
import medicalChatRouter from './src/routers/medicalChat.router.js';
import dashboardRouter from './src/routers/dashboard.router.js';
import thongBaoRouter from './src/routers/thongBao.router.js';
import yeuCauEmailRouter from './src/routers/yeuCauEmail.router.js';
import thucDonChiTietRouter from './src/routers/thucDonChiTiet.router.js';
import theoDoiTienDoRouter from './src/routers/theoDoiTienDo.router.js';
import monAnThamKhaoRouter from './src/routers/monAnThamKhao.router.js';
import paymentRouter from './src/routers/payment.router.js';
// import quanTriVienRouter from './src/routers/quanTriVien.router.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/nguoi-dung', nguoiDungRouter);
app.use('/thuoc', thuocRouter);
app.use('/hoSoKhamBenh', hoSoKhamBenhRouter);
app.use('/hoSoDinhDuong', hoSoDinhDuongRouter);
app.use('/donThuoc', donThuocRouter);
app.use('/chiTietDonThuoc', chiTietDonThuocRouter);
app.use('/cuocHenKhamBenh', cuocHenKhamBenhRouter);
app.use('/cuocHenTuVan', cuocHenTuVanRouter);
app.use('/khungGioKham', khungGioKhamRouter);
app.use('/chuyenKhoa', chuyenKhoa);
app.use('/lichLamViec', lichLamViec);
app.use('/chiDinhXetNghiem', chiDinhXetNghiem);
app.use('/ketQuaXetNghiem', ketQuaXetNghiem);
app.use('/hoaDon', hoaDon);
app.use('/dichVu', dichVu);
app.use('/chiTietHoaDon', chiTietHoaDon);
app.use('/benh-nhan', benhNhanRouter);
app.use('/bac-si', bacSiRouter);
app.use('/chuyen-gia-dinh-duong', chuyenGiaDinhDuongRouter);
app.use('/nhan-vien-quay', nhanVienQuayRouter);
app.use('/nhan-vien-phan-cong', nhanVienPhanCongRouter);
app.use('/lichSuKham', lichSuKhamRouter);
app.use('/lichSuTuVan', lichSuTuVanRouter);
app.use('/xin-nghi-phep', xinNghiPhepRouter);
app.use('/upload', uploadRouter);
app.use('/phong-kham', phongKhamRouter);
app.use('/chat', tinNhanRouter);
app.use('/medical-chat', medicalChatRouter);
app.use('/dashboard', dashboardRouter);
app.use('/thong-bao', thongBaoRouter);
app.use('/yeu-cau-email', yeuCauEmailRouter);
app.use('/thuc-don-chi-tiet', thucDonChiTietRouter);
app.use('/theo-doi-tien-do', theoDoiTienDoRouter);
app.use('/mon-an-tham-khao', monAnThamKhaoRouter);
app.use('/api/payment', paymentRouter);
// app.use('/quan-tri-vien', quanTriVienRouter);

async function main() {
    try {
        app.listen(SERVER_CONFIG.PORT, () => {
            // Server started successfully
        })
    } catch (error) {
        // Error connecting to database
    }
}
main()