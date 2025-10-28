import GenericModel from './generic.model.js';

const NguoiDung = new GenericModel('nguoidung', 'id_nguoi_dung');
const BenhNhan = new GenericModel('benhnhan', 'id_benh_nhan');
const ChuyenKhoa = new GenericModel('chuyenkhoa', 'id_chuyen_khoa');
const BacSi = new GenericModel('bacsi', 'id_bac_si');
const ChuyenGiaDinhDuong = new GenericModel('chuyengiadinhduong', 'id_chuyen_gia');
const NhanVienQuay = new GenericModel('nhanvienquay', 'id_nhan_vien_quay');
const NhanVienPhanCong = new GenericModel('nhanvienphancong', 'id_nhan_vien_phan_cong');
const LichLamViec = new GenericModel('lichlamviec', 'id_lich_lam_viec');
const KhungGioKham = new GenericModel('khunggiokham', 'id_khung_gio');
const CuocHenKhamBenh = new GenericModel('cuochenkhambenh', 'id_cuoc_hen');
const CuocHenTuVan = new GenericModel('cuochentuvan', 'id_cuoc_hen');
const HoSoKhamBenh = new GenericModel('hosokhambenh', 'id_ho_so');
const HoSoDinhDuong = new GenericModel('hosodinhduong', 'id_ho_so');
const DonThuoc = new GenericModel('donthuoc', 'id_don_thuoc');
const Thuoc = new GenericModel('thuoc', 'id_thuoc');
const ChiTietDonThuoc = new GenericModel('chitietdonthuoc', 'id_chi_tiet_don_thuoc');
const ChiDinhXetNghiem = new GenericModel('chidinhxetnghiem', 'id_chi_dinh');
const KetQuaXetNghiem = new GenericModel('ketquaxetnghiem', 'id_ket_qua');
const DichVu = new GenericModel('dichvu', 'id_dich_vu');
const HoaDon = new GenericModel('hoadon', 'id_hoa_don');
const ChiTietHoaDon = new GenericModel('chitiethoadon', 'id_chi_tiet');
const CuocTroChuyen = new GenericModel('cuoctrochuyen', 'id_cuoc_tro_chuyen');
const TinNhan = new GenericModel('tinnhan', 'id_tin_nhan');
const LichSuKham = new GenericModel('lichsukham', 'id_lich_su');
const LichSuTuVan = new GenericModel('lichsutuvan', 'id_lich_su');
const XinNghiPhep = new GenericModel('xinnghiphep', 'id_xin_nghi');
const DoiCa = new GenericModel('doica', 'id_doi_ca');

export {
    NguoiDung, BenhNhan, ChuyenKhoa, BacSi, ChuyenGiaDinhDuong, NhanVienQuay,
    NhanVienPhanCong, LichLamViec, KhungGioKham, CuocHenKhamBenh, CuocHenTuVan,
    HoSoKhamBenh, HoSoDinhDuong, DonThuoc, Thuoc, ChiTietDonThuoc,
    ChiDinhXetNghiem, KetQuaXetNghiem, DichVu, HoaDon, ChiTietHoaDon,
    CuocTroChuyen, TinNhan, LichSuKham, LichSuTuVan, XinNghiPhep, DoiCa
};
