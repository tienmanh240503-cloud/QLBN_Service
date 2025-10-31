-- ============================================
-- 测试数据 - 医院管理系统
-- 所有用户密码: 123456
-- 密码哈希: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe
-- ============================================

-- 清空现有数据 (按正确顺序删除以避免外键约束错误)
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `chitietdonthuoc`;
TRUNCATE TABLE `chitiethoadon`;
TRUNCATE TABLE `ketquaxetnghiem`;
TRUNCATE TABLE `chidinhxetnghiem`;
TRUNCATE TABLE `donthuoc`;
TRUNCATE TABLE `lichsukham`;
TRUNCATE TABLE `lichsutuvan`;
TRUNCATE TABLE `hoadon`;
TRUNCATE TABLE `cuochenkhambenh`;
TRUNCATE TABLE `cuochentuvan`;
TRUNCATE TABLE `tinnhan`;
TRUNCATE TABLE `cuoctrochuyen`;
TRUNCATE TABLE `lichsudoica`;
TRUNCATE TABLE `yeucaudoica`;
TRUNCATE TABLE `xinnghiphep`;
TRUNCATE TABLE `lichlamviec`;
TRUNCATE TABLE `hosokhambenh`;
TRUNCATE TABLE `hosodinhduong`;
TRUNCATE TABLE `bacsi`;
TRUNCATE TABLE `benhnhan`;
TRUNCATE TABLE `chuyengiadinhduong`;
TRUNCATE TABLE `nhanvienquay`;
TRUNCATE TABLE `nhanvienphancong`;
TRUNCATE TABLE `nguoidung`;
TRUNCATE TABLE `chuyenkhoa`;
TRUNCATE TABLE `phongkham`;
TRUNCATE TABLE `dichvu`;
TRUNCATE TABLE `thuoc`;
TRUNCATE TABLE `khunggiokham`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 1. 插入专科数据
-- ============================================
INSERT INTO `chuyenkhoa` (`id_chuyen_khoa`, `ten_chuyen_khoa`, `mo_ta`, `hinh_anh`, `thiet_bi`, `thoi_gian_hoat_dong`) VALUES
('CK_001', 'Khoa Tim mạch', 'Chuyên điều trị các bệnh lý tim mạch, huyết áp cao, suy tim, rối loạn nhịp tim. Đội ngũ bác sĩ giàu kinh nghiệm với trang thiết bị hiện đại.', 'https://cdn.hellobacsi.com/wp-content/uploads/2023/01/kham-tim-mach-o-dau.jpg', 'Máy siêu âm tim 4D, Máy đo điện tim 12 kênh, Máy theo dõi Holter 24h, Máy chụp mạch vành', 'Thứ 2 - Chủ nhật: 7h00 - 20h00'),
('CK_002', 'Khoa Nội tiết - Đái tháo đường', 'Chuyên điều trị đái tháo đường, rối loạn tuyến giáp, béo phì, rối loạn chuyển hóa lipid và các bệnh nội tiết khác.', 'https://medlatec.vn/media/3525/content/20210315_co-nen-kham-noi-tiet-o-benh-vien-medlatec-hay-khong-01.jpg', 'Máy đo đường huyết liên tục CGM, Máy phân tích hormone, Máy đo mật độ xương DEXA', 'Thứ 2 - Thứ 7: 7h30 - 17h00'),
('CK_003', 'Khoa Nhi', 'Khám và điều trị bệnh cho trẻ em từ sơ sinh đến 16 tuổi. Chuyên về tiêm chủng, dinh dưỡng, hô hấp, tiêu hóa trẻ em.', 'https://benhviendk.vn/upload_images/images/2021/11/18/kham-nhi-khoa-o-dau-tot-tai-tphcm-1.jpg', 'Máy thở trẻ em, Lồng ấp, Đèn chiếu điều trị vàng da, Hệ thống tiêm chủng an toàn', 'Thứ 2 - Chủ nhật: 6h30 - 21h00'),
('CK_004', 'Khoa Sản phụ khoa', 'Khám thai định kỳ, siêu âm 4D, tư vấn sinh đẻ, điều trị vô sinh hiếm muộn, các bệnh phụ khoa.', 'https://benhvienphusantrunguong.org.vn/uploads/2020/07/khoa-san.jpg', 'Máy siêu âm 4D GE Voluson, Máy theo dõi thai nhi NST, Phòng sinh LDR hiện đại', 'Thứ 2 - Chủ nhật: 7h00 - 18h00'),
('CK_005', 'Khoa Thần kinh', 'Điều trị đau đầu, chóng mặt, đột quỵ não, động kinh, Parkinson, sa sút trí tuệ và các bệnh thần kinh khác.', 'https://cdn.tgdd.vn/Files/2021/08/26/1378254/kham-than-kinh-o-dau-tot-top-5-phong-kham-than-kinh-uy-tin-tai-ha-noi-va-tp-hcm-202108261533108175.jpg', 'Máy chụp CT 64 lát cắt, Máy MRI 1.5 Tesla, Máy điện não đồ EEG, Máy đo tốc độ dẫn truyền thần kinh', 'Thứ 2 - Thứ 7: 7h00 - 17h00'),
('CK_006', 'Khoa Tiêu hóa', 'Chẩn đoán và điều trị viêm loét dạ dày, trào ngược dạ dày, viêm gan, sỏi mật, các bệnh đường ruột.', 'https://medlatec.vn/media/3478/content/20210308_kham-tieu-hoa-o-dau-tot-tphcm-1.jpg', 'Máy nội soi dạ dày-tá tràng Olympus, Máy nội soi đại trực tràng, Máy cắt polyp, Test HP', 'Thứ 2 - Thứ 6: 7h00 - 17h00'),
('CK_007', 'Khoa Cơ xương khớp', 'Điều trị viêm khớp, thoái hóa khớp, loãng xương, đau lưng, thoát vị đĩa đệm, gout.', 'https://tamanhhospital.vn/wp-content/uploads/2021/06/kham-xuong-khop-o-dau-tot-nhat.jpg', 'Máy X-quang kỹ thuật số, Máy đo mật độ xương, Máy siêu âm cơ xương khớp, Thiết bị vật lý trị liệu', 'Thứ 2 - Thứ 7: 7h30 - 17h30'),
('CK_008', 'Khoa Tai Mũi Họng', 'Khám và điều trị viêm xoang, viêm amidan, viêm tai giữa, ngạt mũi, polyp mũi, rối loạn thanh quản.', 'https://medlatec.vn/media/11421/content/kham-tai-mui-hong-o-dau-tot.jpg', 'Máy nội soi tai mũi họng, Máy đo thính lực, Máy điều trị viêm xoang, Microdebrider', 'Thứ 2 - Thứ 7: 7h00 - 17h00');

-- ============================================
-- 2. 插入时间段数据
-- ============================================
INSERT INTO `khunggiokham` (`id_khung_gio`, `gio_bat_dau`, `gio_ket_thuc`, `ca`, `mo_ta`) VALUES
('KG_S1', '07:00:00', '08:00:00', 'Sang', 'Ca sáng - Khung 1'),
('KG_S2', '08:00:00', '09:00:00', 'Sang', 'Ca sáng - Khung 2'),
('KG_S3', '09:00:00', '10:00:00', 'Sang', 'Ca sáng - Khung 3'),
('KG_S4', '10:00:00', '11:00:00', 'Sang', 'Ca sáng - Khung 4'),
('KG_S5', '11:00:00', '12:00:00', 'Sang', 'Ca sáng - Khung 5'),
('KG_C1', '13:00:00', '14:00:00', 'Chieu', 'Ca chiều - Khung 1'),
('KG_C2', '14:00:00', '15:00:00', 'Chieu', 'Ca chiều - Khung 2'),
('KG_C3', '15:00:00', '16:00:00', 'Chieu', 'Ca chiều - Khung 3'),
('KG_C4', '16:00:00', '17:00:00', 'Chieu', 'Ca chiều - Khung 4'),
('KG_T1', '18:00:00', '19:00:00', 'Toi', 'Ca tối - Khung 1'),
('KG_T2', '19:00:00', '20:00:00', 'Toi', 'Ca tối - Khung 2'),
('KG_T3', '20:00:00', '21:00:00', 'Toi', 'Ca tối - Khung 3');

-- ============================================
-- 3. 插入诊室数据
-- ============================================
INSERT INTO `phongkham` (`id_phong_kham`, `ten_phong`, `so_phong`, `tang`, `id_chuyen_khoa`, `mo_ta`, `trang_thai`, `thiet_bi`, `so_cho_ngoi`, `thoi_gian_tao`) VALUES
('PK_001', 'Phòng khám Tim mạch 1', 'P101', 1, 'CK_001', 'Phòng khám tim mạch chính, trang bị đầy đủ thiết bị chẩn đoán', 'HoatDong', 'Máy siêu âm tim, ECG, Máy đo huyết áp tự động', 25, NOW()),
('PK_002', 'Phòng khám Tim mạch 2', 'P102', 1, 'CK_001', 'Phòng khám tim mạch phụ', 'HoatDong', 'ECG, Holter, Máy đo huyết áp', 20, NOW()),
('PK_003', 'Phòng khám Nội tiết', 'P201', 2, 'CK_002', 'Phòng khám chuyên khoa nội tiết', 'HoatDong', 'Máy đo đường huyết, Cân điện tử chính xác, Máy đo chiều cao', 20, NOW()),
('PK_004', 'Phòng khám Nhi 1', 'P301', 3, 'CK_003', 'Phòng khám nhi với không gian thân thiện cho trẻ', 'HoatDong', 'Bộ khám nhi cơ bản, Đồ chơi, Ghế khám trẻ em', 30, NOW()),
('PK_005', 'Phòng khám Nhi 2', 'P302', 3, 'CK_003', 'Phòng khám nhi và tiêm chủng', 'HoatDong', 'Tủ bảo quản vaccine, Bộ tiêm chủng an toàn', 25, NOW()),
('PK_006', 'Phòng khám Sản', 'P401', 4, 'CK_004', 'Phòng khám sản phụ khoa', 'HoatDong', 'Máy siêu âm 4D, Giường khám sản, Máy đo tim thai', 15, NOW()),
('PK_007', 'Phòng khám Thần kinh', 'P501', 5, 'CK_005', 'Phòng khám chuyên khoa thần kinh', 'HoatDong', 'Bộ dụng cụ khám thần kinh, Búa phản xạ, Đèn khám', 18, NOW()),
('PK_008', 'Phòng khám Tiêu hóa', 'P202', 2, 'CK_006', 'Phòng khám tiêu hóa và gan mật', 'HoatDong', 'Máy test HP, Bộ dụng cụ khám bụng', 20, NOW()),
('PK_009', 'Phòng khám Cơ xương khớp', 'P601', 6, 'CK_007', 'Phòng khám cơ xương khớp', 'HoatDong', 'Giường khám vật lý trị liệu, Dụng cụ đo góc khớp', 22, NOW()),
('PK_010', 'Phòng khám TMH', 'P701', 7, 'CK_008', 'Phòng khám tai mũi họng', 'HoatDong', 'Máy nội soi TMH, Máy hút dịch, Ghế khám TMH chuyên dụng', 18, NOW());

-- ============================================
-- 4. 插入用户数据 (密码全部是: 123456)
-- ============================================
INSERT INTO `nguoidung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau`, `email`, `so_dien_thoai`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `so_cccd`, `dia_chi`, `anh_dai_dien`, `vai_tro`, `trang_thai_hoat_dong`, `thoi_gian_tao`) VALUES
-- Quản trị viên
('ADMIN_001', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'admin@benhvien.vn', '0901000001', 'Nguyễn Văn Admin', '1980-01-15', 'Nam', '001080000001', '123 Nguyễn Huệ, Q1, TP.HCM', 'https://i.pravatar.cc/150?img=33', 'quan_tri_vien', 1, NOW()),

-- Nhân viên phân công
('NV_PC_001', 'nhanvienpc1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'phancong1@benhvien.vn', '0902000001', 'Trần Thị Phân Công', '1988-05-20', 'Nữ', '001088000002', '456 Lê Lợi, Q1, TP.HCM', 'https://i.pravatar.cc/150?img=47', 'nhan_vien_phan_cong', 1, NOW()),

-- Nhân viên quầy
('NV_Q_001', 'nhanvienquay1', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'quay1@benhvien.vn', '0903000001', 'Lê Văn Quầy', '1992-03-10', 'Nam', '001092000003', '789 Trần Hưng Đạo, Q5, TP.HCM', 'https://i.pravatar.cc/150?img=12', 'nhan_vien_quay', 1, NOW()),
('NV_Q_002', 'nhanvienquay2', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'quay2@benhvien.vn', '0903000002', 'Phạm Thị Thu', '1995-07-25', 'Nữ', '001095000004', '321 Võ Văn Tần, Q3, TP.HCM', 'https://i.pravatar.cc/150?img=48', 'nhan_vien_quay', 1, NOW()),

-- Bác sĩ Tim mạch
('BS_001', 'bs.tienmanhle', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.tienmanhle@benhvien.vn', '0904001001', 'BS. Lê Tiến Mạnh', '1978-08-15', 'Nam', '001078001001', '12 Pasteur, Q1, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp', 'bac_si', 1, NOW()),
('BS_002', 'bs.thuhang', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.thuhang@benhvien.vn', '0904001002', 'BS. Nguyễn Thu Hằng', '1982-12-20', 'Nữ', '001082001002', '34 Điện Biên Phủ, Q3, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-chan-dung-bac-si-nu-6.jpg.webp', 'bac_si', 1, NOW()),

-- Bác sĩ Nội tiết
('BS_003', 'bs.minhhieu', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.minhhieu@benhvien.vn', '0904002001', 'BS. Trần Minh Hiếu', '1980-04-18', 'Nam', '001080002001', '56 Cách Mạng Tháng 8, Q10, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-11.jpg.webp', 'bac_si', 1, NOW()),

-- Bác sĩ Nhi khoa
('BS_004', 'bs.kimchi', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.kimchi@benhvien.vn', '0904003001', 'BS. Võ Kim Chi', '1985-09-25', 'Nữ', '001085003001', '78 Hai Bà Trưng, Q1, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nu-7-1.jpg.webp', 'bac_si', 1, NOW()),
('BS_005', 'bs.vanminh', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.vanminh@benhvien.vn', '0904003002', 'BS. Hoàng Văn Minh', '1983-11-30', 'Nam', '001083003002', '90 Nguyễn Đình Chiểu, Q3, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-12.jpg.webp', 'bac_si', 1, NOW()),

-- Bác sĩ Sản phụ khoa
('BS_006', 'bs.thuylinh', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.thuylinh@benhvien.vn', '0904004001', 'BS. Lý Thủy Linh', '1986-06-12', 'Nữ', '001086004001', '45 Nam Kỳ Khởi Nghĩa, Q1, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nu-9.jpg.webp', 'bac_si', 1, NOW()),

-- Bác sĩ Thần kinh
('BS_007', 'bs.duclong', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.duclong@benhvien.vn', '0904005001', 'BS. Đặng Đức Long', '1975-02-28', 'Nam', '001075005001', '67 Lý Thường Kiệt, Q10, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-8.jpg.webp', 'bac_si', 1, NOW()),

-- Bác sĩ Tiêu hóa
('BS_008', 'bs.hongnhung', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'bs.hongnhung@benhvien.vn', '0904006001', 'BS. Phan Hồng Nhung', '1984-10-05', 'Nữ', '001084006001', '23 Cộng Hòa, Q.Tân Bình, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nu-10.jpg.webp', 'bac_si', 1, NOW()),

-- Chuyên gia dinh dưỡng
('CG_001', 'cg.minhchau', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'cg.minhchau@benhvien.vn', '0905001001', 'CN. Vũ Minh Châu', '1987-03-22', 'Nữ', '001087007001', '89 Hoàng Văn Thụ, Q.Phú Nhuận, TP.HCM', 'https://i.pravatar.cc/150?img=44', 'chuyen_gia_dinh_duong', 1, NOW()),
('CG_002', 'cg.thanhtruc', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'cg.thanhtruc@benhvien.vn', '0905001002', 'CN. Đỗ Thanh Trúc', '1990-07-18', 'Nữ', '001090007002', '12 Phan Đăng Lưu, Q.Bình Thạnh, TP.HCM', 'https://i.pravatar.cc/150?img=45', 'chuyen_gia_dinh_duong', 1, NOW()),

-- Bệnh nhân
('BN_001', 'nguyen.vana', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'nguyenvana@gmail.com', '0906001001', 'Nguyễn Văn A', '1990-05-15', 'Nam', '001090008001', '123 Lê Văn Sỹ, Q3, TP.HCM', 'https://i.pravatar.cc/150?img=51', 'benh_nhan', 1, NOW()),
('BN_002', 'tran.thib', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'tranthib@gmail.com', '0906001002', 'Trần Thị B', '1985-08-20', 'Nữ', '001085008002', '456 Nguyễn Thị Minh Khai, Q1, TP.HCM', 'https://i.pravatar.cc/150?img=32', 'benh_nhan', 1, NOW()),
('BN_003', 'le.vanc', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'levanc@gmail.com', '0906001003', 'Lê Văn C', '1978-12-10', 'Nam', '001078008003', '789 Trường Chinh, Q.Tân Bình, TP.HCM', 'https://i.pravatar.cc/150?img=52', 'benh_nhan', 1, NOW()),
('BN_004', 'pham.thid', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'phamthid@gmail.com', '0906001004', 'Phạm Thị D', '1995-03-25', 'Nữ', '001095008004', '321 Hoàng Sa, Q3, TP.HCM', 'https://i.pravatar.cc/150?img=31', 'benh_nhan', 1, NOW()),
('BN_005', 'hoang.vane', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'hoangvane@gmail.com', '0906001005', 'Hoàng Văn E', '1992-07-08', 'Nam', '001092008005', '654 Đinh Tiên Hoàng, Q1, TP.HCM', 'https://i.pravatar.cc/150?img=53', 'benh_nhan', 1, NOW()),
('BN_006', 'vo.thif', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'vothif@gmail.com', '0906001006', 'Võ Thị F', '1988-11-18', 'Nữ', '001088008006', '987 Lý Tự Trọng, Q1, TP.HCM', 'https://i.pravatar.cc/150?img=27', 'benh_nhan', 1, NOW()),
('BN_007', 'dang.vang', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'dangvang@gmail.com', '0906001007', 'Đặng Văn G', '1982-04-30', 'Nam', '001082008007', '147 Bà Huyện Thanh Quan, Q3, TP.HCM', 'https://i.pravatar.cc/150?img=54', 'benh_nhan', 1, NOW()),
('BN_008', 'bui.thih', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'buithih@gmail.com', '0906001008', 'Bùi Thị H', '1993-09-12', 'Nữ', '001093008008', '258 Nguyễn Trãi, Q5, TP.HCM', 'https://i.pravatar.cc/150?img=26', 'benh_nhan', 1, NOW()),
('BN_009', 'do.vani', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'dovani@gmail.com', '0906001009', 'Đỗ Văn I', '1987-02-14', 'Nam', '001087008009', '369 Võ Thị Sáu, Q3, TP.HCM', 'https://i.pravatar.cc/150?img=55', 'benh_nhan', 1, NOW()),
('BN_010', 'nguyen.thij', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdLlGZvxe', 'nguyenthij@gmail.com', '0906001010', 'Nguyễn Thị J', '1991-06-22', 'Nữ', '001091008010', '741 Nguyễn Kiệm, Q.Phú Nhuận, TP.HCM', 'https://i.pravatar.cc/150?img=25', 'benh_nhan', 1, NOW());

-- ============================================
-- 5. 插入医生信息
-- ============================================
INSERT INTO `bacsi` (`id_bac_si`, `id_chuyen_khoa`, `chuyen_mon`, `so_giay_phep_hang_nghe`, `gioi_thieu_ban_than`, `so_nam_kinh_nghiem`, `dang_lam_viec`, `chuc_danh`, `chuc_vu`) VALUES
('BS_001', 'CK_001', 'Tim mạch can thiệp, Siêu âm tim', 'BS-HCM-001-2005', 'Bác sĩ chuyên khoa Tim mạch với 19 năm kinh nghiệm. Từng tu nghiệp tại Nhật Bản về tim mạch can thiệp.', 19, 1, 'Bác sĩ Chuyên khoa II', 'Trưởng khoa Tim mạch'),
('BS_002', 'CK_001', 'Điện tim học, Rối loạn nhịp tim', 'BS-HCM-002-2008', 'Chuyên về chẩn đoán và điều trị rối loạn nhịp tim, đã thực hiện hơn 5000 ca siêu âm tim.', 16, 1, 'Bác sĩ Chuyên khoa II', 'Phó khoa Tim mạch'),
('BS_003', 'CK_002', 'Đái tháo đường, Tuyến giáp', 'BS-HCM-003-2010', 'Bác sĩ Nội tiết với nhiều công trình nghiên cứu về đái tháo đường type 2 tại người Việt Nam.', 14, 1, 'Bác sĩ Chuyên khoa II', 'Trưởng khoa Nội tiết'),
('BS_004', 'CK_003', 'Nhi hô hấp, Tiêm chủng', 'BS-HCM-004-2012', 'Chuyên gia về hô hấp trẻ em và tiêm chủng, tư vấn dinh dưỡng cho trẻ.', 12, 1, 'Bác sĩ Chuyên khoa I', 'Bác sĩ'),
('BS_005', 'CK_003', 'Nhi tiêu hóa, Dinh dưỡng trẻ em', 'BS-HCM-005-2013', 'Bác sĩ Nhi khoa giàu kinh nghiệm trong điều trị rối loạn tiêu hóa và tư vấn dinh dưỡng cho trẻ.', 11, 1, 'Bác sĩ Chuyên khoa I', 'Phó khoa Nhi'),
('BS_006', 'CK_004', 'Sản khoa, Siêu âm thai 4D', 'BS-HCM-006-2011', 'Chuyên gia về siêu âm thai, theo dõi thai kỳ và tư vấn sinh đẻ an toàn.', 13, 1, 'Bác sĩ Chuyên khoa II', 'Trưởng khoa Sản'),
('BS_007', 'CK_005', 'Đột quỵ não, Parkinson', 'BS-HCM-007-2006', 'Bác sĩ Thần kinh lão luyện, chuyên điều trị đột quỵ và các bệnh thoái hóa thần kinh.', 18, 1, 'Bác sĩ Chuyên khoa II', 'Trưởng khoa Thần kinh'),
('BS_008', 'CK_006', 'Nội soi tiêu hóa, Gan mật', 'BS-HCM-008-2009', 'Thạc sĩ Bác sĩ chuyên về nội soi tiêu hóa và điều trị các bệnh lý gan mật.', 15, 1, 'Thạc sĩ - Bác sĩ Chuyên khoa II', 'Trưởng khoa Tiêu hóa');

-- ============================================
-- 6. 插入营养师信息
-- ============================================
INSERT INTO `chuyengiadinhduong` (`id_chuyen_gia`, `hoc_vi`, `so_chung_chi_hang_nghe`, `linh_vuc_chuyen_sau`, `gioi_thieu_ban_than`, `chuc_vu`) VALUES
('CG_001', 'Thac si', 'CN-DD-001-2015', 'Dinh dưỡng lâm sàng, Béo phì', 'Chuyên gia dinh dưỡng với 9 năm kinh nghiệm tư vấn dinh dưỡng cho bệnh nhân đái tháo đường, béo phì.', 'Trưởng phòng Dinh dưỡng'),
('CG_002', 'Cu nhan', 'CN-DD-002-2017', 'Dinh dưỡng trẻ em, Dinh dưỡng bà mẹ', 'Chuyên tư vấn dinh dưỡng cho phụ nữ mang thai và trẻ em.', 'Chuyên viên dinh dưỡng');

-- ============================================
-- 7. 插入员工信息
-- ============================================
INSERT INTO `nhanvienphancong` (`id_nhan_vien_phan_cong`, `ma_nhan_vien`, `quyen_han_phan_cong`) VALUES
('NV_PC_001', 'NV-PC-001', 'toan_benh_vien');

INSERT INTO `nhanvienquay` (`id_nhan_vien_quay`, `ma_nhan_vien`, `bo_phan_lam_viec`, `ca_lam_viec`) VALUES
('NV_Q_001', 'NV-Q-001', 'Quầy tiếp nhận 1', 'Sang'),
('NV_Q_002', 'NV-Q-002', 'Quầy tiếp nhận 2', 'Chieu');

-- ============================================
-- 8. 插入患者信息
-- ============================================
INSERT INTO `benhnhan` (`id_benh_nhan`, `nghe_nghiep`, `thong_tin_bao_hiem`, `ten_nguoi_lien_he_khan_cap`, `sdt_nguoi_lien_he_khan_cap`, `tien_su_benh_ly`, `tinh_trang_suc_khoe_hien_tai`, `ma_BHYT`) VALUES
('BN_001', 'Kỹ sư phần mềm', 'BHYT Công ty FPT Software', 'Nguyễn Thị Lan (Vợ)', '0907111001', 'Cao huyết áp từ năm 2018', 'Đang dùng thuốc hạ huyết áp, huyết áp ổn định', 'DN4902901234567'),
('BN_002', 'Giáo viên', 'BHYT Nhà nước', 'Trần Văn Nam (Chồng)', '0907111002', 'Đái tháo đường type 2 từ năm 2020', 'Đang điều trị, đường huyết kiểm soát khá tốt', 'HS3901234567890'),
('BN_003', 'Nhân viên văn phòng', 'BHYT Công ty', 'Lê Thị Mai (Vợ)', '0907111003', 'Viêm loét dạ dày mạn tính', 'Đau dạ dày thỉnh thoảng, cần theo dõi', 'DN4872345678901'),
('BN_004', 'Sinh viên', 'BHYT Học sinh', 'Phạm Văn Tuấn (Bố)', '0907111004', 'Không có bệnh lý đặc biệt', 'Sức khỏe tốt', 'HS4952345678901'),
('BN_005', 'Kế toán', 'BHYT Công ty', 'Hoàng Thị Hoa (Vợ)', '0907111005', 'Rối loạn lipid máu', 'Đang điều chỉnh chế độ ăn', 'DN4923456789012'),
('BN_006', 'Nhân viên bán hàng', 'BHYT Nhà nước', 'Võ Văn Long (Chồng)', '0907111006', 'Hen suyễn nhẹ', 'Dùng thuốc khi cần, kiểm soát tốt', 'HS3934567890123'),
('BN_007', 'Kỹ thuật viên', 'BHYT Công ty', 'Đặng Thị Phương (Vợ)', '0907111007', 'Thoát vị đĩa đệm L4-L5', 'Đau lưng thường xuyên, đang vật lý trị liệu', 'DN4945678901234'),
('BN_008', 'Nhân viên ngân hàng', 'BHYT Công ty', 'Bùi Văn Hùng (Chồng)', '0907111008', 'Không có tiền sử bệnh lý', 'Sức khỏe tốt', 'DN4956789012345'),
('BN_009', 'Lập trình viên', 'BHYT Công ty', 'Đỗ Thị Hương (Vợ)', '0907111009', 'Cận thị cao, mỏi mắt', 'Cần kiểm tra mắt định kỳ', 'DN4967890123456'),
('BN_010', 'Giáo viên mầm non', 'BHYT Nhà nước', 'Nguyễn Văn Bình (Chồng)', '0907111010', 'Viêm xoang mạn tính', 'Thường xuyên bị viêm xoang khi thời tiết thay đổi', 'HS3978901234567');

-- ============================================
-- 9. 插入药品数据
-- ============================================
INSERT INTO `thuoc` (`id_thuoc`, `ten_thuoc`, `hoatchat`, `hang_bao_che`, `don_vi_tinh`, `mo_ta`, `chong_chi_dinh`) VALUES
('T_001', 'Paracetamol 500mg', 'Paracetamol', 'Công ty Dược Hậu Giang', 'Viên', 'Thuốc giảm đau, hạ sốt', 'Người suy gan nặng, quá mẫn với paracetamol'),
('T_002', 'Amoxicillin 500mg', 'Amoxicillin', 'Công ty Dược DHG Pharma', 'Viên', 'Kháng sinh nhóm Penicillin', 'Dị ứng với Penicillin và các beta-lactam'),
('T_003', 'Metformin 500mg', 'Metformin HCl', 'Công ty Dược Sanofi', 'Viên', 'Thuốc điều trị đái tháo đường type 2', 'Suy thận, suy gan, nhiễm toan lactic'),
('T_004', 'Amlodipine 5mg', 'Amlodipine', 'Công ty Dược Pfizer', 'Viên', 'Thuốc hạ huyết áp nhóm chẹn kênh canxi', 'Sốc, suy tim nặng, hẹp động mạch chủ'),
('T_005', 'Omeprazole 20mg', 'Omeprazole', 'Công ty Dược AstraZeneca', 'Viên', 'Thuốc ức chế bơm proton điều trị loét dạ dày', 'Quá mẫn với omeprazole, trẻ em dưới 1 tuổi'),
('T_006', 'Atorvastatin 20mg', 'Atorvastatin', 'Công ty Dược Novartis', 'Viên', 'Thuốc hạ mỡ máu', 'Bệnh gan tiến triển, phụ nữ có thai, cho con bú'),
('T_007', 'Losartan 50mg', 'Losartan Potassium', 'Công ty Dược MSD', 'Viên', 'Thuốc hạ huyết áp nhóm ức chế thụ thể AT1', 'Phụ nữ có thai, tăng kali máu'),
('T_008', 'Aspirin 100mg', 'Acetylsalicylic acid', 'Công ty Dược Bayer', 'Viên', 'Thuốc chống kết tập tiểu cầu', 'Loét dạ dày, xuất huyết, trẻ em dưới 16 tuổi'),
('T_009', 'Vitamin B1 100mg', 'Thiamine', 'Công ty Dược Hà Tây', 'Viên', 'Bổ sung vitamin B1', 'Quá mẫn với vitamin B1'),
('T_010', 'Vitamin C 500mg', 'Acid Ascorbic', 'Công ty Dược Hà Tây', 'Viên', 'Bổ sung vitamin C, tăng cường đề kháng', 'Sỏi thận oxalat canxi'),
('T_011', 'Cetirizine 10mg', 'Cetirizine HCl', 'Công ty Dược UCB', 'Viên', 'Thuốc kháng histamin điều trị dị ứng', 'Suy thận nặng, trẻ em dưới 2 tuổi'),
('T_012', 'Salbutamol 2mg', 'Salbutamol', 'Công ty Dược GSK', 'Viên', 'Thuốc giãn phế quản điều trị hen phế quản', 'Dọa sẩy thai, rối loạn nhịp tim'),
('T_013', 'Prednisolone 5mg', 'Prednisolone', 'Công ty Dược Roussel', 'Viên', 'Thuốc corticoid chống viêm', 'Nhiễm khuẩn nặng chưa điều trị, loét dạ dày'),
('T_014', 'Clopidogrel 75mg', 'Clopidogrel', 'Công ty Dược Sanofi', 'Viên', 'Thuốc chống kết tập tiểu cầu', 'Chảy máu đang tiến triển, suy gan nặng'),
('T_015', 'Insulin Glargine 100UI/ml', 'Insulin Glargine', 'Công ty Dược Sanofi', 'Lọ', 'Insulin nền điều trị đái tháo đường', 'Hạ đường huyết, quá mẫn với insulin');

-- ============================================
-- 10. 插入服务数据
-- ============================================
INSERT INTO `dichvu` (`id_dich_vu`, `ten_dich_vu`, `mo_ta`, `don_gia`, `trang_thai`) VALUES
('DV_001', 'Khám bệnh tổng quát', 'Khám sức khỏe tổng quát bao gồm khám lâm sàng cơ bản', 200000.00, 'HoatDong'),
('DV_002', 'Xét nghiệm máu tổng quát', 'Công thức máu: Hồng cầu, Bạch cầu, Tiểu cầu, Hb, Hct', 120000.00, 'HoatDong'),
('DV_003', 'Xét nghiệm đường huyết lúc đói', 'Đo glucose máu lúc đói', 50000.00, 'HoatDong'),
('DV_004', 'Xét nghiệm HbA1c', 'Đánh giá kiểm soát đường huyết 3 tháng', 180000.00, 'HoatDong'),
('DV_005', 'Xét nghiệm lipid máu', 'Cholesterol toàn phần, HDL, LDL, Triglyceride', 150000.00, 'HoatDong'),
('DV_006', 'Xét nghiệm chức năng gan', 'SGOT, SGPT, Bilirubin, Albumin', 200000.00, 'HoatDong'),
('DV_007', 'Xét nghiệm chức năng thận', 'Urê, Creatinin, Acid uric', 150000.00, 'HoatDong'),
('DV_008', 'Điện tim (ECG)', 'Ghi điện tim 12 chuyển đạo', 100000.00, 'HoatDong'),
('DV_009', 'Siêu âm tim', 'Siêu âm tim qua thành ngực', 350000.00, 'HoatDong'),
('DV_010', 'Siêu âm bụng tổng quát', 'Siêu âm gan, mật, tụy, lách, thận', 250000.00, 'HoatDong'),
('DV_011', 'X-quang ngực', 'Chụp X-quang phổi 1 tư thế', 120000.00, 'HoatDong'),
('DV_012', 'Nội soi dạ dày', 'Nội soi dạ dày - tá tràng có sinh thiết', 800000.00, 'HoatDong'),
('DV_013', 'Siêu âm thai thường', 'Siêu âm thai 2D đen trắng', 200000.00, 'HoatDong'),
('DV_014', 'Siêu âm thai 4D', 'Siêu âm thai 4D màu có video', 500000.00, 'HoatDong'),
('DV_015', 'Tư vấn dinh dưỡng', 'Tư vấn chế độ ăn cho người bệnh', 300000.00, 'HoatDong');

-- ============================================
-- 11. 插入工作日程 (最近30天)
-- ============================================
-- BS_001 (Tim mạch) - Ca sáng T2, T4, T6
INSERT INTO `lichlamviec` (`id_lich_lam_viec`, `id_nguoi_dung`, `id_nguoi_tao`, `id_phong_kham`, `ngay_lam_viec`, `ca`) VALUES
('LLV_001', 'BS_001', 'NV_PC_001', 'PK_001', '2025-10-27', 'Sang'),
('LLV_002', 'BS_001', 'NV_PC_001', 'PK_001', '2025-10-29', 'Sang'),
('LLV_003', 'BS_001', 'NV_PC_001', 'PK_001', '2025-10-31', 'Sang'),
('LLV_004', 'BS_001', 'NV_PC_001', 'PK_001', '2025-11-03', 'Sang'),
('LLV_005', 'BS_001', 'NV_PC_001', 'PK_001', '2025-11-05', 'Sang'),

-- BS_002 (Tim mạch) - Ca chiều T2, T3, T5
('LLV_006', 'BS_002', 'NV_PC_001', 'PK_001', '2025-10-27', 'Chieu'),
('LLV_007', 'BS_002', 'NV_PC_001', 'PK_002', '2025-10-28', 'Chieu'),
('LLV_008', 'BS_002', 'NV_PC_001', 'PK_001', '2025-10-30', 'Chieu'),
('LLV_009', 'BS_002', 'NV_PC_001', 'PK_002', '2025-11-03', 'Chieu'),
('LLV_010', 'BS_002', 'NV_PC_001', 'PK_001', '2025-11-04', 'Chieu'),

-- BS_003 (Nội tiết) - Ca sáng hàng ngày T2-T6
('LLV_011', 'BS_003', 'NV_PC_001', 'PK_003', '2025-10-27', 'Sang'),
('LLV_012', 'BS_003', 'NV_PC_001', 'PK_003', '2025-10-28', 'Sang'),
('LLV_013', 'BS_003', 'NV_PC_001', 'PK_003', '2025-10-29', 'Sang'),
('LLV_014', 'BS_003', 'NV_PC_001', 'PK_003', '2025-10-30', 'Sang'),
('LLV_015', 'BS_003', 'NV_PC_001', 'PK_003', '2025-10-31', 'Sang'),

-- BS_004 (Nhi) - Ca sáng + chiều T2, T4, T6
('LLV_016', 'BS_004', 'NV_PC_001', 'PK_004', '2025-10-27', 'Sang'),
('LLV_017', 'BS_004', 'NV_PC_001', 'PK_004', '2025-10-27', 'Chieu'),
('LLV_018', 'BS_004', 'NV_PC_001', 'PK_004', '2025-10-29', 'Sang'),
('LLV_019', 'BS_004', 'NV_PC_001', 'PK_004', '2025-10-29', 'Chieu'),
('LLV_020', 'BS_004', 'NV_PC_001', 'PK_004', '2025-10-31', 'Sang'),

-- BS_006 (Sản) - Ca sáng T2-T6
('LLV_021', 'BS_006', 'NV_PC_001', 'PK_006', '2025-10-27', 'Sang'),
('LLV_022', 'BS_006', 'NV_PC_001', 'PK_006', '2025-10-28', 'Sang'),
('LLV_023', 'BS_006', 'NV_PC_001', 'PK_006', '2025-10-29', 'Sang'),
('LLV_024', 'BS_006', 'NV_PC_001', 'PK_006', '2025-10-30', 'Sang'),
('LLV_025', 'BS_006', 'NV_PC_001', 'PK_006', '2025-10-31', 'Sang'),

-- CG_001 (Dinh dưỡng) - Ca chiều T3, T5, T7
('LLV_026', 'CG_001', 'NV_PC_001', NULL, '2025-10-28', 'Chieu'),
('LLV_027', 'CG_001', 'NV_PC_001', NULL, '2025-10-30', 'Chieu'),
('LLV_028', 'CG_001', 'NV_PC_001', NULL, '2025-11-01', 'Chieu');

-- ============================================
-- 12. 插入预约数据
-- ============================================
-- 已完成的预约
INSERT INTO `cuochenkhambenh` (`id_cuoc_hen`, `id_benh_nhan`, `id_bac_si`, `id_chuyen_khoa`, `id_khung_gio`, `ngay_kham`, `loai_hen`, `trang_thai`, `ly_do_kham`, `trieu_chung`, `thoi_gian_tao`) VALUES
('CH_001', 'BN_001', 'BS_001', 'CK_001', 'KG_S2', '2025-10-20', 'kham_moi', 'da_hoan_thanh', 'Đau ngực, khó thở khi gắng sức', 'Đau tức ngực, khó thở khi lên cầu thang', '2025-10-15 08:30:00'),
('CH_002', 'BN_002', 'BS_003', 'CK_002', 'KG_S3', '2025-10-22', 'tai_kham', 'da_hoan_thanh', 'Tái khám kiểm tra đường huyết', 'Mệt mỏi, đi tiểu nhiều', '2025-10-18 10:15:00'),
('CH_003', 'BN_003', 'BS_008', 'CK_006', 'KG_S2', '2025-10-23', 'kham_moi', 'da_hoan_thanh', 'Đau bụng vùng thượng vị', 'Đau bụng sau khi ăn, ợ nóng', '2025-10-19 14:20:00'),

-- Đã đặt - sắp tới
('CH_004', 'BN_004', 'BS_004', 'CK_003', 'KG_S2', '2025-11-01', 'kham_moi', 'da_dat', 'Khám sức khỏe định kỳ', 'Không có triệu chứng đặc biệt', '2025-10-25 09:00:00'),
('CH_005', 'BN_005', 'BS_001', 'CK_001', 'KG_S3', '2025-11-03', 'kham_moi', 'da_dat', 'Kiểm tra tim mạch', 'Hồi hộp, đánh trống ngực', '2025-10-26 11:30:00'),
('CH_006', 'BN_006', 'BS_006', 'CK_004', 'KG_S2', '2025-11-04', 'kham_moi', 'da_dat', 'Khám thai lần 1', 'Trễ kinh 2 tuần', '2025-10-27 08:45:00'),
('CH_007', 'BN_001', 'BS_001', 'CK_001', 'KG_S2', '2025-11-05', 'tai_kham', 'da_dat', 'Tái khám sau điều trị', 'Theo dõi sau điều trị', '2025-10-28 10:00:00'),

-- Đã hủy
('CH_008', 'BN_007', 'BS_002', 'CK_001', 'KG_C2', '2025-10-25', 'kham_moi', 'da_huy', 'Khám tim mạch', 'Bận việc đột xuất', '2025-10-20 15:30:00');

-- Cuộc hẹn tư vấn dinh dưỡng
INSERT INTO `cuochentuvan` (`id_cuoc_hen`, `id_benh_nhan`, `id_chuyen_gia`, `id_khung_gio`, `ngay_kham`, `loai_dinh_duong`, `loai_hen`, `trang_thai`, `ly_do_tu_van`, `thoi_gian_tao`) VALUES
('CHT_001', 'BN_002', 'CG_001', 'KG_C2', '2025-10-24', 'Đái tháo đường', 'truc_tiep', 'da_hoan_thanh', 'Tư vấn chế độ ăn cho người đái tháo đường', '2025-10-20 09:00:00'),
('CHT_002', 'BN_005', 'CG_001', 'KG_C2', '2025-11-01', 'Rối loạn lipid máu', 'truc_tiep', 'da_dat', 'Tư vấn giảm cholesterol', '2025-10-26 14:30:00');

-- ============================================
-- 13. 插入病历数据 (对于已完成的预约)
-- ============================================
-- Hồ sơ khám bệnh
INSERT INTO `hosokhambenh` (`id_ho_so`, `id_benh_nhan`, `id_bac_si_tao`, `ho_ten`, `so_dien_thoai`, `tuoi`, `gioi_tinh`, `dan_toc`, `ma_BHYT`, `dia_chi`, `thoi_gian_tao`) VALUES
('HSKB_001', 'BN_001', 'BS_001', 'Nguyễn Văn A', '0906001001', 34, 'Nam', 'Kinh', 'DN4902901234567', '123 Lê Văn Sỹ, Q3, TP.HCM', '2025-10-20 08:00:00'),
('HSKB_002', 'BN_002', 'BS_003', 'Trần Thị B', '0906001002', 39, 'Nữ', 'Kinh', 'HS3901234567890', '456 Nguyễn Thị Minh Khai, Q1, TP.HCM', '2025-10-22 08:00:00'),
('HSKB_003', 'BN_003', 'BS_008', 'Lê Văn C', '0906001003', 46, 'Nam', 'Kinh', 'DN4872345678901', '789 Trường Chinh, Q.Tân Bình, TP.HCM', '2025-10-23 08:00:00');

-- Lịch sử khám
INSERT INTO `lichsukham` (`id_lich_su`, `id_benh_nhan`, `id_ho_so`, `id_cuoc_hen`, `thoi_gian_kham`, `nguoi_tao`, `ly_do_kham`, `chuan_doan`, `ket_qua_cls`, `tham_do_chuc_nang`, `dieu_tri`, `cham_soc`, `ghi_chu`) VALUES
('LSK_001', 'BN_001', 'HSKB_001', 'CH_001', '2025-10-20 08:30:00', 'BS_001', 'Đau ngực, khó thở khi gắng sức', 
'Bệnh mạch vành. Tăng huyết áp độ 1', 
'ECG: Nhịp xoang, HR 78, không có ST-T thay đổi. Siêu âm tim: Phân suất tống máu 65%, van tim bình thường', 
'HA: 145/95 mmHg, Mạch: 78 lần/phút, Nhịp thở: 18 lần/phút', 
'Aspirin 100mg x 1 viên/ngày. Amlodipine 5mg x 1 viên/ngày. Atorvastatin 20mg x 1 viên/ngày buổi tối', 
'Chế độ ăn ít muối, tập thể dục nhẹ nhàng', 
'Tái khám sau 1 tháng. Cần làm xét nghiệm lipid máu'),

('LSK_002', 'BN_002', 'HSKB_002', 'CH_002', '2025-10-22 09:00:00', 'BS_003', 'Tái khám kiểm tra đường huyết', 
'Đái tháo đường type 2. Kiểm soát tốt', 
'Glucose lúc đói: 6.8 mmol/L. HbA1c: 6.8%. Lipid máu: Cholesterol 5.2, LDL 3.1, HDL 1.2, TG 1.8', 
NULL,
'Tiếp tục Metformin 500mg x 2 viên/ngày (sáng, tối sau ăn)', 
'Chế độ ăn kiêng đường, tập thể dục 30 phút/ngày', 
'Kết quả tốt, tiếp tục điều trị. Tái khám sau 3 tháng'),

('LSK_003', 'BN_003', 'HSKB_003', 'CH_003', '2025-10-23 08:30:00', 'BS_008', 'Đau bụng vùng thượng vị', 
'Viêm loét dạ dày - tá tràng. HP dương tính', 
'Nội soi: Viêm loét dạ dày hang vị. Test HP: Dương tính (+)', 
NULL,
'Omeprazole 20mg x 2 viên/ngày (sáng, tối trước ăn 30 phút). Amoxicillin 1g x 2 lần/ngày x 14 ngày. Clarithromycin 500mg x 2 lần/ngày x 14 ngày', 
'Ăn uống điều độ, tránh cay nóng, cà phê, rượu bia', 
'Điều trị diệt HP. Tái khám sau 1 tháng để đánh giá kết quả điều trị');

-- ============================================
-- 14. 插入处方数据
-- ============================================
INSERT INTO `donthuoc` (`id_don_thuoc`, `id_lich_su`, `id_ho_so`, `ghi_chu`, `trang_thai`, `thoi_gian_tao`) VALUES
('DT_001', 'LSK_001', 'HSKB_001', 'Uống thuốc đều đặn theo chỉ định. Không tự ý ngừng thuốc', 'dang_su_dung', '2025-10-20 09:00:00'),
('DT_002', 'LSK_002', 'HSKB_002', 'Uống thuốc sau ăn. Theo dõi đường huyết tại nhà', 'dang_su_dung', '2025-10-22 09:30:00'),
('DT_003', 'LSK_003', 'HSKB_003', 'Điều trị diệt HP trong 14 ngày. Uống đủ liệu trình', 'dang_su_dung', '2025-10-23 09:00:00');

-- Chi tiết đơn thuốc
INSERT INTO `chitietdonthuoc` (`id_chi_tiet_don_thuoc`, `id_don_thuoc`, `id_thuoc`, `lieu_dung`, `tan_suat`, `thoi_gian_dung`, `so_luong`, `ghi_chu`) VALUES
-- Đơn thuốc 1
('CTDT_001', 'DT_001', 'T_008', '1 viên', '1 lần/ngày', 'Sau ăn sáng', 30, 'Uống lâu dài'),
('CTDT_002', 'DT_001', 'T_004', '1 viên', '1 lần/ngày', 'Buổi sáng', 30, 'Uống lâu dài'),
('CTDT_003', 'DT_001', 'T_006', '1 viên', '1 lần/ngày', 'Buổi tối sau ăn', 30, 'Uống lâu dài'),

-- Đơn thuốc 2
('CTDT_004', 'DT_002', 'T_003', '2 viên', '2 lần/ngày', 'Sáng, tối sau ăn', 60, 'Uống sau ăn 30 phút'),

-- Đơn thuốc 3
('CTDT_005', 'DT_003', 'T_005', '2 viên', '2 lần/ngày', 'Sáng, tối trước ăn 30 phút', 30, 'Uống trước ăn'),
('CTDT_006', 'DT_003', 'T_002', '2 viên', '2 lần/ngày', 'Sau ăn sáng, tối', 30, 'Uống trong 14 ngày');

-- ============================================
-- 15. 插入发票数据
-- ============================================
INSERT INTO `hoadon` (`id_hoa_don`, `id_cuoc_hen_kham`, `id_cuoc_hen_tu_van`, `tong_tien`, `trang_thai`, `phuong_thuc_thanh_toan`, `thoi_gian_thanh_toan`, `thoi_gian_tao`) VALUES
('HD_001', 'CH_001', NULL, 970000.00, 'da_thanh_toan', 'tien_mat', '2025-10-20 10:00:00', '2025-10-20 09:30:00'),
('HD_002', 'CH_002', NULL, 580000.00, 'da_thanh_toan', 'chuyen_khoan', '2025-10-22 10:30:00', '2025-10-22 10:00:00'),
('HD_003', 'CH_003', NULL, 1320000.00, 'da_thanh_toan', 'the', '2025-10-23 10:00:00', '2025-10-23 09:30:00'),
('HD_004', NULL, 'CHT_001', 300000.00, 'da_thanh_toan', 'tien_mat', '2025-10-24 15:00:00', '2025-10-24 14:30:00');

-- Chi tiết hóa đơn
INSERT INTO `chitiethoadon` (`id_chi_tiet`, `id_hoa_don`, `id_dich_vu`, `so_luong`, `don_gia`) VALUES
-- Hóa đơn 1
('CTHD_001', 'HD_001', 'DV_001', 1, 200000.00),
('CTHD_002', 'HD_001', 'DV_008', 1, 100000.00),
('CTHD_003', 'HD_001', 'DV_009', 1, 350000.00),
('CTHD_004', 'HD_001', 'DV_002', 1, 120000.00),
('CTHD_005', 'HD_001', 'DV_005', 1, 150000.00),

-- Hóa đơn 2
('CTHD_006', 'HD_002', 'DV_001', 1, 200000.00),
('CTHD_007', 'HD_002', 'DV_003', 1, 50000.00),
('CTHD_008', 'HD_002', 'DV_004', 1, 180000.00),
('CTHD_009', 'HD_002', 'DV_005', 1, 150000.00),

-- Hóa đơn 3
('CTHD_010', 'HD_003', 'DV_001', 1, 200000.00),
('CTHD_011', 'HD_003', 'DV_002', 1, 120000.00),
('CTHD_012', 'HD_003', 'DV_012', 1, 800000.00),
('CTHD_013', 'HD_003', 'DV_001', 1, 200000.00),

-- Hóa đơn 4 (Tư vấn dinh dưỡng)
('CTHD_014', 'HD_004', 'DV_015', 1, 300000.00);

-- ============================================
-- 16. 插入检验指示数据
-- ============================================
INSERT INTO `chidinhxetnghiem` (`id_chi_dinh`, `id_cuoc_hen`, `ten_dich_vu`, `yeu_cau_ghi_chu`, `trang_thai`, `id_bac_si_chi_dinh`, `thoi_gian_chi_dinh`) VALUES
('CDX_001', 'CH_001', 'Xét nghiệm máu tổng quát', 'Lấy máu lúc đói', 'hoan_thanh', 'BS_001', '2025-10-20 08:45:00'),
('CDX_002', 'CH_001', 'Xét nghiệm lipid máu', 'Nhịn ăn 8-12 giờ trước khi lấy máu', 'hoan_thanh', 'BS_001', '2025-10-20 08:45:00'),
('CDX_003', 'CH_002', 'Xét nghiệm đường huyết lúc đói', 'Nhịn ăn từ 22h đêm hôm trước', 'hoan_thanh', 'BS_003', '2025-10-22 09:15:00'),
('CDX_004', 'CH_002', 'Xét nghiệm HbA1c', NULL, 'hoan_thanh', 'BS_003', '2025-10-22 09:15:00'),
('CDX_005', 'CH_003', 'Xét nghiệm HP (Helicobacter pylori)', 'Ngưng thuốc kháng sinh 2 tuần, ngưng thuốc ức chế acid 1 tuần', 'hoan_thanh', 'BS_008', '2025-10-23 08:45:00');

-- Kết quả xét nghiệm
INSERT INTO `ketquaxetnghiem` (`id_ket_qua`, `id_chi_dinh`, `ket_qua_van_ban`, `duong_dan_file_ket_qua`, `thoi_gian_ket_luan`) VALUES
('KQ_001', 'CDX_001', 'Hồng cầu: 5.2 T/L (BT: 4.5-5.5). Bạch cầu: 7.8 G/L (BT: 4-10). Hb: 145 g/L (BT: 130-170). Hct: 42% (BT: 40-50). Tiểu cầu: 250 G/L (BT: 150-400)', NULL, '2025-10-20 14:00:00'),
('KQ_002', 'CDX_002', 'Cholesterol toàn phần: 5.8 mmol/L (BT: <5.2). LDL: 3.8 mmol/L (BT: <3.4). HDL: 1.2 mmol/L (BT: >1.0). Triglyceride: 2.1 mmol/L (BT: <1.7)', NULL, '2025-10-20 14:00:00'),
('KQ_003', 'CDX_003', 'Glucose lúc đói: 6.8 mmol/L (BT: 3.9-6.1). Đái tháo đường đang được kiểm soát khá tốt', NULL, '2025-10-22 11:00:00'),
('KQ_004', 'CDX_004', 'HbA1c: 6.8% (BT: <5.7%). Mức kiểm soát đường huyết tốt trong 3 tháng qua', NULL, '2025-10-22 15:00:00'),
('KQ_005', 'CDX_005', 'Test nhanh HP: Dương tính (+). Có nhiễm Helicobacter pylori. Cần điều trị diệt HP', NULL, '2025-10-23 10:30:00');

-- ============================================
-- 完成!
-- ============================================

-- 验证数据
SELECT '=== TỔNG KẾT DỮ LIỆU ===' as '';
SELECT COUNT(*) as 'Số người dùng' FROM nguoidung;
SELECT COUNT(*) as 'Số bác sĩ' FROM bacsi;
SELECT COUNT(*) as 'Số bệnh nhân' FROM benhnhan;
SELECT COUNT(*) as 'Số cuộc hẹn khám' FROM cuochenkhambenh;
SELECT COUNT(*) as 'Số cuộc hẹn tư vấn' FROM cuochentuvan;
SELECT COUNT(*) as 'Số lịch làm việc' FROM lichlamviec;
SELECT COUNT(*) as 'Số hóa đơn' FROM hoadon;
SELECT COUNT(*) as 'Số đơn thuốc' FROM donthuoc;
SELECT '=== HOÀN THÀNH ===' as '';

