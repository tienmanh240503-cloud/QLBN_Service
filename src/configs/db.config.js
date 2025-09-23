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
        port: 3307,
        user: "manh",
        password: "Manh0385@",
        database: "hethongquanlybenhvien"
    },
    table:{
        NguoiDung: "NguoiDung",
        BenhNhan: "BenhNhan",
        ChuyenKhoa: "ChuyenKhoa",
        BacSi: "BacSi",
        ChuyenGiaDinhDuong: "ChuyenGiaDinhDuong",
        NhanVienQuay: "NhanVienQuay",
        NhanVienPhanCong: "NhanVienPhanCong",
        LichLamViec: "LichLamViec",
        KhungGioKham: "KhungGioKham",
        CuocHen: "CuocHen",
        HoSoKhamBenh: "HoSoKhamBenh",
        DonThuoc: "DonThuoc",
        Thuoc: "Thuoc",
        ChiTietDonThuoc: "ChiTietDonThuoc",
        ChiDinhXetNghiem: "ChiDinhXetNghiem",
        HoaDon: "HoaDon",
        CuocTroChuyen: "CuocTroChuyen",
        TinNhan: "TinNhan",
    }
}