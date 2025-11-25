import dotenv from 'dotenv';

dotenv.config();

export const DB_CONFID = {
    baseUrl: "http://localhost:3000",
    resourses: {
        user: {
            contextPath: "/users",
            role: 'nguoidung'
        },
        admin: {
            contextPath: "/admins",
            role: 'Admin'
        },
        giangvien: {
            contextPath: "/giangviens",
            role: 'GiangVien'
        }
    },
    mysql_connect: {
        host: process.env.DB_HOST,
        port: process.env.PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },    
    cloudinary_connect: {
        cloud_name: 'dh0lhvm9l',
        api_key: '314188383667441',
        api_secret: 'g_PBWzOuyUVbjMZymyMR8BjwfZE'
    },
    table: {
        NguoiDung: "NguoiDung",
        BenhNhan: "BenhNhan",
        ChuyenKhoa: "ChuyenKhoa",
        BacSi: "BacSi",
        ChuyenGiaDinhDuong: "ChuyenGiaDinhDuong",
        NhanVienQuay: "NhanVienQuay",
        NhanVienPhanCong: "NhanVienPhanCong",
        LichLamViec: "LichLamViec",
        KhungGioKham: "KhungGioKham",
        CuocHenKhamBenh: "CuocHenKhamBenh",
        CuocHenTuVan: "CuocHenTuVan",
        HoSoKhamBenh: "HoSoKhamBenh",
        HoSoDinhDuong: "HoSoDinhDuong",
        DonThuoc: "DonThuoc",
        Thuoc: "Thuoc",
        ChiTietDonThuoc: "ChiTietDonThuoc",
        ChiDinhXetNghiem: "ChiDinhXetNghiem",
        KetQuaXetNghiem: "KetQuaXetNghiem",
        DichVu: "DichVu",
        HoaDon: "HoaDon",
        ChiTietHoaDon: "ChiTietHoaDon",
        CuocTroChuyen: "CuocTroChuyen",
        TinNhan: "TinNhan",
        LichSuKham: "LichSuKham",
        LichSuTuVan: "LichSuTuVan"
    }
}
