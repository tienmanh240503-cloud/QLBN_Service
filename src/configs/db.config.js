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
        host: "localhost",
        port: 3306,
        user: "qlbn_user",
        password: "Manh0385@",
        database: "hethongquanlybenhvien"
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
