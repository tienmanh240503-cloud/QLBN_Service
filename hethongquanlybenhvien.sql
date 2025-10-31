-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th10 30, 2025 lúc 12:07 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `hethongquanlybenhvien`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bacsi`
--

CREATE TABLE `bacsi` (
  `id_bac_si` varchar(50) NOT NULL,
  `id_chuyen_khoa` varchar(50) DEFAULT NULL,
  `chuyen_mon` varchar(255) DEFAULT NULL,
  `so_giay_phep_hang_nghe` varchar(100) DEFAULT NULL,
  `gioi_thieu_ban_than` text DEFAULT NULL,
  `so_nam_kinh_nghiem` int(11) DEFAULT NULL,
  `dang_lam_viec` tinyint(1) DEFAULT 1,
  `chuc_danh` varchar(100) DEFAULT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bacsi`
--

INSERT INTO `bacsi` (`id_bac_si`, `id_chuyen_khoa`, `chuyen_mon`, `so_giay_phep_hang_nghe`, `gioi_thieu_ban_than`, `so_nam_kinh_nghiem`, `dang_lam_viec`, `chuc_danh`, `chuc_vu`) VALUES
('BS_5161a544-997b-4ff1-84ee-7659336016be', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
('BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'Nội tiết - Đái tháo đường', 'BS001234567', 'Bác sĩ chuyên khoa Nội tiết với 8 năm kinh nghiệm điều trị bệnh đái tháo đường và các rối loạn chuyển hóa.', 8, 1, 'Bác sĩ chuyên khoa', 'Phó trưởng khoa'),
('BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Tim mạch - Can thiệp tim', 'BS002345678', 'Bác sĩ chuyên khoa Tim mạch với 12 năm kinh nghiệm trong can thiệp tim mạch và điều trị các bệnh lý tim.', 12, 1, 'Bác sĩ chuyên khoa', 'Trưởng khoa'),
('BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
('BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'Nhi khoa - Hô hấp', 'BS003456789', 'Bác sĩ Nhi khoa chuyên về các bệnh lý hô hấp ở trẻ em với 6 năm kinh nghiệm.', 6, 1, 'Bác sĩ chuyên khoa', 'Bác sĩ'),
('BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'Sản phụ khoa - Siêu âm', 'BS004567890', 'Bác sĩ Sản phụ khoa chuyên về siêu âm thai nhi và chăm sóc sức khỏe phụ nữ với 10 năm kinh nghiệm.', 10, 1, 'Bác sĩ chuyên khoa', 'Phó trưởng khoa'),
('BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'Thần kinh - Đột quỵ', 'BS005678901', 'Bác sĩ chuyên khoa Thần kinh với 15 năm kinh nghiệm điều trị đột quỵ và các bệnh lý thần kinh.', 15, 1, 'Bác sĩ chuyên khoa', 'Trưởng khoa'),
('BS_c76d606e-1664-4d60-92bb-929f65667587', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `benhnhan`
--

CREATE TABLE `benhnhan` (
  `id_benh_nhan` varchar(50) NOT NULL,
  `nghe_nghiep` varchar(255) DEFAULT NULL,
  `thong_tin_bao_hiem` varchar(500) DEFAULT NULL,
  `ten_nguoi_lien_he_khan_cap` varchar(255) DEFAULT NULL,
  `sdt_nguoi_lien_he_khan_cap` varchar(20) DEFAULT NULL,
  `tien_su_benh_ly` text DEFAULT NULL,
  `tinh_trang_suc_khoe_hien_tai` text DEFAULT NULL,
  `ma_BHYT` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `benhnhan`
--

INSERT INTO `benhnhan` (`id_benh_nhan`, `nghe_nghiep`, `thong_tin_bao_hiem`, `ten_nguoi_lien_he_khan_cap`, `sdt_nguoi_lien_he_khan_cap`, `tien_su_benh_ly`, `tinh_trang_suc_khoe_hien_tai`, `ma_BHYT`) VALUES
('BN_2b417c16-1cc1-46b1-809c-47b9007f2554', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Kỹ sư phần mềm', 'Bảo hiểm y tế công ty', 'Nguyễn Thị Lan', '0987654321', 'Tiền sử cao huyết áp, đái tháo đường type 2', 'Huyết áp ổn định, đường huyết kiểm soát tốt', 'DN123456789'),
('BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'Giáo viên', 'Bảo hiểm y tế nhà nước', 'Trần Văn Minh', '0912345678', 'Tiền sử viêm dạ dày', 'Sức khỏe ổn định, cần theo dõi định kỳ', 'GD987654321'),
('BN_ef4af6b3-d7d7-4675-b4be-42286aa8141c', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_f3g4h5i6-j7k8-9012-defg-567890123456', 'Nhân viên văn phòng', 'Bảo hiểm y tế tự nguyện', 'Lê Thị Hoa', '0923456789', 'Không có tiền sử bệnh lý nghiêm trọng', 'Sức khỏe tốt', 'TN456789123'),
('BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'Sinh viên', 'Bảo hiểm y tế học sinh', 'Phạm Văn Đức', '0934567890', 'Dị ứng thuốc kháng sinh', 'Cần cẩn thận khi sử dụng thuốc', 'HS789123456'),
('BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'Công nhân', 'Bảo hiểm y tế công ty', 'Hoàng Thị Mai', '0945678901', 'Tiền sử hen suyễn', 'Hen suyễn được kiểm soát tốt', 'CN123789456');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chidinhxetnghiem`
--

CREATE TABLE `chidinhxetnghiem` (
  `id_chi_dinh` varchar(50) NOT NULL,
  `id_cuoc_hen` varchar(50) NOT NULL,
  `ten_dich_vu` varchar(255) NOT NULL,
  `yeu_cau_ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('cho_xu_ly','hoan_thanh','da_huy') DEFAULT 'cho_xu_ly',
  `id_bac_si_chi_dinh` varchar(50) NOT NULL,
  `thoi_gian_chi_dinh` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chidinhxetnghiem`
--

INSERT INTO `chidinhxetnghiem` (`id_chi_dinh`, `id_cuoc_hen`, `ten_dich_vu`, `yeu_cau_ghi_chu`, `trang_thai`, `id_bac_si_chi_dinh`, `thoi_gian_chi_dinh`) VALUES
('CD_269f9e04-ad0d-4794-a763-3c3e99441418', 'CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'Xet nghiệm máu ', 'SAsSAsÁ', '', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', '2025-10-06 09:51:18'),
('CD_4199eaa4-e109-45be-8ffd-79c5cbc5c6e5', 'CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'Xet nghiệm máu ', 'aaaaaaaaaa', '', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', '2025-10-06 09:49:17');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonthuoc`
--

CREATE TABLE `chitietdonthuoc` (
  `id_chi_tiet_don_thuoc` varchar(50) NOT NULL,
  `id_don_thuoc` varchar(50) NOT NULL,
  `id_thuoc` varchar(50) NOT NULL,
  `lieu_dung` varchar(255) NOT NULL,
  `tan_suat` varchar(255) NOT NULL,
  `thoi_gian_dung` varchar(255) NOT NULL,
  `so_luong` int(11) NOT NULL,
  `ghi_chu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdonthuoc`
--

INSERT INTO `chitietdonthuoc` (`id_chi_tiet_don_thuoc`, `id_don_thuoc`, `id_thuoc`, `lieu_dung`, `tan_suat`, `thoi_gian_dung`, `so_luong`, `ghi_chu`) VALUES
('DDT_13ded121-66f3-46c9-bc8d-cff19487f2ff', 'DT_98c3c54d-7692-447f-ab59-cb6b17da8bfa', 'T_0fe6a9f2-928b-4f3f-8c8c-6e01737865aa', 'aa', 'aaa', '', 1, 'aaa'),
('DDT_216d3587-c357-4d4d-9b42-a0c01016b53f', 'DT_98c3c54d-7692-447f-ab59-cb6b17da8bfa', 'T_9d7d052d-3ddd-4ea8-859e-422436a04502', 'aaaaa', 'aaaa', '', 1, 'aaaaaa'),
('DDT_ce95b65e-3c08-4de8-8292-c69b82789194', 'DT_b70a3c30-9fce-40b3-a745-4c817654ad15', 'T_9d7d052d-3ddd-4ea8-859e-422436a04502', 'aaaaa', 'aaaa', '', 1, 'aaaaaa'),
('DDT_e85832c4-6232-4f72-9611-b0b89fbecd27', 'DT_b70a3c30-9fce-40b3-a745-4c817654ad15', 'T_0fe6a9f2-928b-4f3f-8c8c-6e01737865aa', 'aa', 'aaa', '', 1, 'aaa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `id_chi_tiet` varchar(50) NOT NULL,
  `id_hoa_don` varchar(50) NOT NULL,
  `id_dich_vu` varchar(50) NOT NULL,
  `so_luong` int(11) DEFAULT 1,
  `don_gia` decimal(15,2) NOT NULL,
  `thanh_tien` decimal(15,2) GENERATED ALWAYS AS (`so_luong` * `don_gia`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiethoadon`
--

INSERT INTO `chitiethoadon` (`id_chi_tiet`, `id_hoa_don`, `id_dich_vu`, `so_luong`, `don_gia`) VALUES
('DHD_9682b7fd-f940-4d63-96ba-2cb7ba64a25b', 'HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 1, 200000.00),
('DHD_a3610019-4dc7-400f-9c0b-82002897f3a7', 'HD_97e5856c-5a12-496e-982d-222df32cca4d', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 1, 200000.00),
('DHD_b332e4b9-4d66-4236-bbed-0ca0bf1deb7c', 'HD_97e5856c-5a12-496e-982d-222df32cca4d', 'DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 1, 60000.00),
('DHD_e5d37934-085d-446a-929f-d3cd71874280', 'HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 1, 60000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyengiadinhduong`
--

CREATE TABLE `chuyengiadinhduong` (
  `id_chuyen_gia` varchar(50) NOT NULL,
  `hoc_vi` enum('Cu nhan','Thac si','Tien si','Giao su') NOT NULL,
  `so_chung_chi_hang_nghe` varchar(100) DEFAULT NULL,
  `linh_vuc_chuyen_sau` varchar(255) DEFAULT NULL,
  `gioi_thieu_ban_than` text DEFAULT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chuyengiadinhduong`
--

INSERT INTO `chuyengiadinhduong` (`id_chuyen_gia`, `hoc_vi`, `so_chung_chi_hang_nghe`, `linh_vuc_chuyen_sau`, `gioi_thieu_ban_than`, `chuc_vu`) VALUES
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Cu nhan', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyenkhoa`
--

CREATE TABLE `chuyenkhoa` (
  `id_chuyen_khoa` varchar(50) NOT NULL,
  `ten_chuyen_khoa` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh` varchar(500) DEFAULT NULL,
  `thiet_bi` text DEFAULT NULL,
  `thoi_gian_hoat_dong` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chuyenkhoa`
--

INSERT INTO `chuyenkhoa` (`id_chuyen_khoa`, `ten_chuyen_khoa`, `mo_ta`, `hinh_anh`, `thiet_bi`, `thoi_gian_hoat_dong`) VALUES
('CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'Khoa Nội tiết', 'Chuyên điều trị các bệnh lý nội tiết, tiểu đường và rối loạn chuyển hóa.', 'https://example.com/images/noi-tiet.jpg', 'Máy đo đường huyết, Máy phân tích hormone', 'Thứ 2 - Thứ 6: 7h00 - 17h00'),
('CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Khoa Tim mạch', 'Chuyên điều trị các bệnh lý tim mạch và huyết áp. Chúng tôi có đội ngũ bác sĩ giàu kinh nghiệm với máy móc hiện đại.', 'https://example.com/images/tim-mach.jpg', 'Máy siêu âm tim, Máy đo điện tim, Máy chụp MRI', 'Thứ 2 - Thứ 7: 7h00 - 17h00'),
('CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'Khoa Nhi khoa', 'Chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi với phương pháp hiện đại.', 'https://example.com/images/nhi-khoa.jpg', 'Máy theo dõi sức khỏe trẻ em, Hệ thống tiêm chủng', 'Thứ 2 - Chủ Nhật: 7h00 - 20h00'),
('CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'Khoa Sản phụ khoa', 'Chăm sóc sức khỏe phụ nữ, sản phụ và trẻ sơ sinh với đội ngũ chuyên môn cao.', 'https://example.com/images/san-phu.jpg', 'Máy siêu âm 4D, Phòng phẫu thuật hiện đại', 'Thứ 2 - Thứ 7: 7h00 - 17h00'),
('CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'Khoa Thần kinh', 'Chẩn đoán và điều trị các bệnh lý thần kinh, đau đầu, động kinh.', 'https://example.com/images/than-kinh.jpg', 'Máy EEG, Máy MRI thần kinh, Máy đo lưu huyết não', 'Thứ 2 - Thứ 6: 7h00 - 17h00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuochenkhambenh`
--

CREATE TABLE `cuochenkhambenh` (
  `id_cuoc_hen` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_bac_si` varchar(50) DEFAULT NULL,
  `id_chuyen_khoa` varchar(50) DEFAULT NULL,
  `id_khung_gio` varchar(50) DEFAULT NULL,
  `ngay_kham` date NOT NULL,
  `loai_hen` enum('tai_kham','kham_moi') DEFAULT 'kham_moi',
  `trang_thai` enum('da_dat','da_huy','da_hoan_thanh') DEFAULT 'da_dat',
  `ly_do_kham` varchar(500) DEFAULT NULL,
  `trieu_chung` text DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cuochenkhambenh`
--

INSERT INTO `cuochenkhambenh` (`id_cuoc_hen`, `id_benh_nhan`, `id_bac_si`, `id_chuyen_khoa`, `id_khung_gio`, `ngay_kham`, `loai_hen`, `trang_thai`, `ly_do_kham`, `trieu_chung`, `thoi_gian_tao`) VALUES
('CH_1dab699c-9cd5-4572-b1f1-e887d7916feb', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-10-28', 'kham_moi', 'da_dat', 'Khám sức khỏe định kỳ', 'Ho, sốt nhẹ', '2025-10-28 15:58:11'),
('CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-10-06', 'kham_moi', 'da_hoan_thanh', 'Khám sức khỏe định kỳ', 'Đau ngực, khó thở', '2025-10-04 13:09:50'),
('CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-10-07', 'tai_kham', 'da_dat', 'Tái khám sau điều trị', 'Cần theo dõi huyết áp', '2025-10-06 09:27:05'),
('CH_c1d2e3f4-g5h6-7890-abcd-ef1234567890', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '2025-10-08', 'kham_moi', 'da_dat', 'Kiểm tra đường huyết', 'Mệt mỏi, khát nước nhiều', '2025-10-07 10:15:30'),
('CH_d2e3f4g5-h6i7-8901-bcde-f23456789012', 'BN_f3g4h5i6-j7k8-9012-defg-567890123456', 'BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-10-09', 'kham_moi', 'da_dat', 'Khám cho trẻ em', 'Sốt cao, ho khan', '2025-10-08 14:20:45'),
('CH_e3f4g5h6-i7j8-9012-cdef-345678901234', 'BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-10-10', 'kham_moi', 'da_dat', 'Khám thai định kỳ', 'Mang thai tuần 20', '2025-10-09 16:30:20'),
('CH_f4g5h6i7-j8k9-0123-defg-456789012345', 'BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'KG_1d2e3f4a-5b6c-7890-1234-efab56789012', '2025-10-11', 'kham_moi', 'da_dat', 'Khám đau đầu', 'Đau đầu dữ dội, buồn nôn', '2025-10-10 11:45:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuochentuvan`
--

CREATE TABLE `cuochentuvan` (
  `id_cuoc_hen` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_chuyen_gia` varchar(50) DEFAULT NULL,
  `id_khung_gio` varchar(50) NOT NULL,
  `ngay_kham` date NOT NULL,
  `loai_dinh_duong` varchar(255) DEFAULT NULL,
  `loai_hen` enum('online','truc_tiep') DEFAULT 'truc_tiep',
  `trang_thai` enum('da_dat','da_huy','da_hoan_thanh') DEFAULT 'da_dat',
  `ly_do_tu_van` varchar(500) DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuoctrochuyen`
--

CREATE TABLE `cuoctrochuyen` (
  `id_cuoc_tro_chuyen` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_bac_si` varchar(50) DEFAULT NULL,
  `id_chuyen_gia_dinh_duong` varchar(50) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `trang_thai` enum('dang_mo','da_dong') DEFAULT 'dang_mo',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dichvu`
--

CREATE TABLE `dichvu` (
  `id_dich_vu` varchar(50) NOT NULL,
  `ten_dich_vu` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `don_gia` decimal(15,2) NOT NULL,
  `trang_thai` enum('HoatDong','Ngung') DEFAULT 'HoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dichvu`
--

INSERT INTO `dichvu` (`id_dich_vu`, `ten_dich_vu`, `mo_ta`, `don_gia`, `trang_thai`) VALUES
('DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 'Xét nghiệm ADN', 'Xét nghiệm ADN để xác định quan hệ huyết thống và chẩn đoán di truyền', 2000000.00, 'HoatDong'),
('DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 'Xét nghiệm máu cơ bản', 'Kiểm tra công thức máu cơ bản bao gồm hồng cầu, bạch cầu, tiểu cầu', 60000.00, 'HoatDong'),
('DV_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Xét nghiệm đường huyết', 'Đo nồng độ glucose trong máu để chẩn đoán đái tháo đường', 50000.00, 'HoatDong'),
('DV_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Xét nghiệm lipid máu', 'Kiểm tra cholesterol, triglyceride và các chỉ số lipid khác', 80000.00, 'HoatDong'),
('DV_c3d4e5f6-g7h8-9012-cdef-345678901234', 'Siêu âm tim', 'Siêu âm tim để đánh giá chức năng tim và phát hiện bệnh lý tim mạch', 300000.00, 'HoatDong'),
('DV_d4e5f6g7-h8i9-0123-defg-456789012345', 'Điện tim (ECG)', 'Ghi điện tim để phát hiện các rối loạn nhịp tim và bệnh lý tim', 100000.00, 'HoatDong'),
('DV_e5f6g7h8-i9j0-1234-efgh-567890123456', 'X-quang ngực', 'Chụp X-quang ngực để phát hiện các bệnh lý phổi và tim', 150000.00, 'HoatDong'),
('DV_f6g7h8i9-j0k1-2345-fghi-678901234567', 'Siêu âm bụng', 'Siêu âm ổ bụng để kiểm tra gan, thận, túi mật và các cơ quan khác', 200000.00, 'HoatDong'),
('DV_g7h8i9j0-k1l2-3456-ghij-789012345678', 'Nội soi dạ dày', 'Nội soi đường tiêu hóa trên để chẩn đoán bệnh lý dạ dày', 800000.00, 'HoatDong'),
('DV_h8i9j0k1-l2m3-4567-hijk-890123456789', 'MRI não', 'Chụp cộng hưởng từ não để chẩn đoán các bệnh lý thần kinh', 1500000.00, 'HoatDong'),
('DV_i9j0k1l2-m3n4-5678-ijkl-901234567890', 'CT scan ngực', 'Chụp cắt lớp vi tính ngực để chẩn đoán chi tiết bệnh lý phổi', 1200000.00, 'HoatDong'),
('DV_j0k1l2m3-n4o5-6789-jklm-012345678901', 'Xét nghiệm chức năng thận', 'Đánh giá chức năng thận thông qua các chỉ số sinh hóa', 120000.00, 'HoatDong'),
('DV_k1l2m3n4-o5p6-7890-klmn-123456789012', 'Xét nghiệm chức năng gan', 'Kiểm tra các enzyme gan và chức năng gan', 100000.00, 'HoatDong'),
('DV_l2m3n4o5-p6q7-8901-lmno-234567890123', 'Siêu âm thai', 'Siêu âm thai nhi để theo dõi sự phát triển của thai nhi', 250000.00, 'HoatDong'),
('DV_m3n4o5p6-q7r8-9012-mnop-345678901234', 'Khám tổng quát', 'Khám sức khỏe tổng quát bao gồm đo huyết áp, cân nặng, chiều cao', 200000.00, 'HoatDong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doi_ca`
--

CREATE TABLE `doi_ca` (
  `id_doi_ca` int(11) NOT NULL,
  `id_bac_si` int(11) NOT NULL,
  `ngay_cu` date NOT NULL,
  `ca_cu` varchar(50) NOT NULL,
  `ngay_moi` date NOT NULL,
  `ca_moi` varchar(50) NOT NULL,
  `ly_do` text DEFAULT NULL,
  `trang_thai` varchar(50) DEFAULT 'Chờ duyệt',
  `ngay_tao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donthuoc`
--

CREATE TABLE `donthuoc` (
  `id_don_thuoc` varchar(50) NOT NULL,
  `id_lich_su` varchar(50) DEFAULT NULL,
  `id_ho_so` varchar(50) NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('dang_su_dung','hoan_thanh') DEFAULT 'dang_su_dung',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `donthuoc`
--

INSERT INTO `donthuoc` (`id_don_thuoc`, `id_lich_su`, `id_ho_so`, `ghi_chu`, `trang_thai`, `thoi_gian_tao`) VALUES
('DT_98c3c54d-7692-447f-ab59-cb6b17da8bfa', 'LSK_82c99395-a515-465a-b750-a32c22ebdb2f', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'aaaaaa', 'dang_su_dung', '2025-10-04 13:31:45'),
('DT_b70a3c30-9fce-40b3-a745-4c817654ad15', NULL, 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'aaaaaa', 'dang_su_dung', '2025-10-18 05:12:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `id_hoa_don` varchar(50) NOT NULL,
  `id_cuoc_hen_kham` varchar(50) DEFAULT NULL,
  `id_cuoc_hen_tu_van` varchar(50) DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL,
  `trang_thai` enum('chua_thanh_toan','da_thanh_toan','da_huy') DEFAULT 'chua_thanh_toan',
  `phuong_thuc_thanh_toan` enum('tien_mat','chuyen_khoan','the','vi_dien_tu') DEFAULT NULL,
  `thoi_gian_thanh_toan` timestamp NULL DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`id_hoa_don`, `id_cuoc_hen_kham`, `id_cuoc_hen_tu_van`, `tong_tien`, `trang_thai`, `phuong_thuc_thanh_toan`, `thoi_gian_thanh_toan`, `thoi_gian_tao`) VALUES
('HD_97e5856c-5a12-496e-982d-222df32cca4d', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', NULL, 260000.00, 'chua_thanh_toan', NULL, NULL, '2025-10-18 05:12:12'),
('HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', NULL, 260000.00, 'chua_thanh_toan', NULL, NULL, '2025-10-04 13:31:45');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hosodinhduong`
--

CREATE TABLE `hosodinhduong` (
  `id_ho_so` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_chuyen_gia` varchar(50) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `tuoi` int(11) DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `dan_toc` varchar(100) DEFAULT NULL,
  `ma_BHYT` varchar(50) DEFAULT NULL,
  `dia_chi` varchar(500) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `chieu_cao` decimal(5,2) DEFAULT NULL,
  `can_nang` decimal(5,2) DEFAULT NULL,
  `vong_eo` decimal(5,2) DEFAULT NULL,
  `mo_co_the` decimal(5,2) DEFAULT NULL,
  `khoi_co` decimal(5,2) DEFAULT NULL,
  `nuoc_trong_co_the` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hosokhambenh`
--

CREATE TABLE `hosokhambenh` (
  `id_ho_so` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_bac_si_tao` varchar(50) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `tuoi` int(11) DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `dan_toc` varchar(100) DEFAULT NULL,
  `ma_BHYT` varchar(50) DEFAULT NULL,
  `dia_chi` varchar(500) DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hosokhambenh`
--

INSERT INTO `hosokhambenh` (`id_ho_so`, `id_benh_nhan`, `id_bac_si_tao`, `ho_ten`, `so_dien_thoai`, `tuoi`, `gioi_tinh`, `dan_toc`, `ma_BHYT`, `dia_chi`, `thoi_gian_tao`) VALUES
('KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'Nguyen Van A', '0912345678', 35, 'Nam', 'Kinh', 'BH3213213213', 'HCM', '2025-10-04 13:24:15');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ketquaxetnghiem`
--

CREATE TABLE `ketquaxetnghiem` (
  `id_ket_qua` varchar(50) NOT NULL,
  `id_chi_dinh` varchar(50) NOT NULL,
  `ket_qua_van_ban` text DEFAULT NULL,
  `duong_dan_file_ket_qua` varchar(500) DEFAULT NULL,
  `thoi_gian_ket_luan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khunggiokham`
--

CREATE TABLE `khunggiokham` (
  `id_khung_gio` varchar(50) NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `ca` enum('Sang','Chieu','Toi') DEFAULT 'Sang',
  `mo_ta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `khunggiokham`
--

INSERT INTO `khunggiokham` (`id_khung_gio`, `gio_bat_dau`, `gio_ket_thuc`, `ca`, `mo_ta`) VALUES
('KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '15:00:00', '16:00:00', 'Chieu', 'Khám buổi chiều'),
('KG_1d2e3f4a-5b6c-7890-1234-efab56789012', '16:00:00', '17:00:00', 'Chieu', 'Khám buổi chiều'),
('KG_2e3f4a5b-6c7d-8901-2345-fabc67890123', '18:00:00', '19:00:00', 'Toi', 'Khám buổi tối'),
('KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '08:00:00', '09:00:00', 'Sang', 'Khám buổi sáng'),
('KG_3f4a5b6c-7d8e-9012-3456-abcd78901234', '19:00:00', '20:00:00', 'Toi', 'Khám buổi tối'),
('KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '09:00:00', '10:00:00', 'Sang', 'Khám buổi sáng'),
('KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '10:00:00', '11:00:00', 'Sang', 'Khám buổi sáng'),
('KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '14:00:00', '15:00:00', 'Chieu', 'Khám buổi chiều');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichlamviec`
--

CREATE TABLE `lichlamviec` (
  `id_lich_lam_viec` varchar(50) NOT NULL,
  `id_nguoi_dung` varchar(50) NOT NULL,
  `id_nguoi_tao` varchar(50) DEFAULT NULL,
  `id_phong_kham` varchar(50) DEFAULT NULL,
  `ngay_lam_viec` date NOT NULL,
  `ca` enum('Sang','Chieu','Toi') DEFAULT 'Sang'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichlamviec`
--

INSERT INTO `lichlamviec` (`id_lich_lam_viec`, `id_nguoi_dung`, `id_nguoi_tao`, `id_phong_kham`, `ngay_lam_viec`, `ca`) VALUES
('L_2737496d-fde1-4e58-be77-af1f0edd97e7', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, '2025-10-29', 'Chieu'),
('L_3436c298-20f6-4370-af5d-80a0114b0510', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-03', 'Sang'),
('L_4a1d18a5-abaf-4836-a05c-d6a0743740e3', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, '2025-10-29', 'Sang'),
('L_4eb27707-5cff-4961-b1c6-4a4e44958d4b', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-10-03', 'Chieu'),
('L_62c0e0bd-6d54-4c90-8ddb-fe68af514be4', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, '2025-10-30', 'Chieu'),
('L_69efe394-d9db-42ad-8de2-aa2cf9ff81e1', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, '2025-10-28', 'Sang'),
('L_a3531195-c5a2-45ff-823e-f5a93cffa22c', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-09-27', 'Sang'),
('L_ab7df124-5870-4a3f-9c47-381c67f27df5', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-10-01', 'Chieu'),
('L_b1c2d3e4-f5g6-7890-abcd-ef1234567890', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'NV_phancong001', 'PK_c3d4e5f6-g7h8-9012-cdef-345678901234', '2025-10-08', 'Sang'),
('L_c2d3e4f5-g6h7-8901-bcde-f23456789012', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'NV_phancong001', 'PK_c3d4e5f6-g7h8-9012-cdef-345678901234', '2025-10-08', 'Chieu'),
('L_d3e4f5g6-h7i8-9012-cdef-345678901234', 'BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'NV_phancong001', 'PK_d4e5f6g7-h8i9-0123-defg-456789012345', '2025-10-09', 'Sang'),
('L_e4f5g6h7-i8j9-0123-defg-456789012345', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'NV_phancong001', 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-10-10', 'Chieu'),
('L_e7d7b0ef-9e33-42ea-be0c-54cd742ad232', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-09-25', 'Sang'),
('L_f5g6h7i8-j9k0-1234-efgh-567890123456', 'BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'NV_phancong001', 'PK_f6g7h8i9-j0k1-2345-fghi-678901234567', '2025-10-11', 'Sang'),
('L_g6h7i8j9-k0l1-2345-fghi-678901234567', 'NV_quay001', 'NV_phancong001', 'PK_g7h8i9j0-k1l2-3456-ghij-789012345678', '2025-10-12', 'Sang'),
('L_h7i8j9k0-l1m2-3456-ghij-789012345678', 'NV_quay001', 'NV_phancong001', 'PK_g7h8i9j0-k1l2-3456-ghij-789012345678', '2025-10-12', 'Chieu'),
('L_i8j9k0l1-m2n3-4567-hijk-890123456789', 'NV_phancong001', 'ADMIN_001', 'PK_g7h8i9j0-k1l2-3456-ghij-789012345678', '2025-10-13', 'Sang'),
('L_j9k0l1m2-n3o4-5678-ijkl-901234567890', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'NV_phancong001', 'PK_g7h8i9j0-k1l2-3456-ghij-789012345678', '2025-10-14', 'Chieu');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsudoica`
--

CREATE TABLE `lichsudoica` (
  `id_lich_su` varchar(50) NOT NULL,
  `id_yeu_cau` varchar(50) NOT NULL,
  `trang_thai_cu` enum('cho_duyet','da_chap_nhan','da_tu_choi','da_huy') NOT NULL,
  `trang_thai_moi` enum('cho_duyet','da_chap_nhan','da_tu_choi','da_huy') NOT NULL,
  `nguoi_thay_doi` varchar(50) NOT NULL,
  `ly_do_thay_doi` text DEFAULT NULL,
  `thoi_gian_thay_doi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichsudoica`
--

INSERT INTO `lichsudoica` (`id_lich_su`, `id_yeu_cau`, `trang_thai_cu`, `trang_thai_moi`, `nguoi_thay_doi`, `ly_do_thay_doi`, `thoi_gian_thay_doi`) VALUES
('LS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YC_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'cho_duyet', 'da_chap_nhan', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'Đồng ý đổi ca để giúp đồng nghiệp', '2025-10-02 16:45:00'),
('LS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'YC_c3d4e5f6-g7h8-9012-cdef-345678901234', 'cho_duyet', 'da_tu_choi', 'NV_phancong001', 'Không thể đổi ca do có công việc quan trọng', '2025-10-11 16:30:00'),
('LS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'YC_d4e5f6g7-h8i9-0123-defg-456789012345', 'cho_duyet', 'da_huy', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Hủy yêu cầu do đã tìm được giải pháp khác', '2025-10-13 11:20:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsukham`
--

CREATE TABLE `lichsukham` (
  `id_lich_su` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_ho_so` varchar(50) NOT NULL,
  `id_cuoc_hen` varchar(50) NOT NULL,
  `thoi_gian_kham` timestamp NOT NULL DEFAULT current_timestamp(),
  `nguoi_tao` varchar(50) DEFAULT NULL,
  `ly_do_kham` text DEFAULT NULL,
  `chuan_doan` text DEFAULT NULL,
  `ket_qua_cls` text DEFAULT NULL,
  `tham_do_chuc_nang` text DEFAULT NULL,
  `dieu_tri` text DEFAULT NULL,
  `cham_soc` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lichsukham`
--

INSERT INTO `lichsukham` (`id_lich_su`, `id_benh_nhan`, `id_ho_so`, `id_cuoc_hen`, `thoi_gian_kham`, `nguoi_tao`, `ly_do_kham`, `chuan_doan`, `ket_qua_cls`, `tham_do_chuc_nang`, `dieu_tri`, `cham_soc`, `ghi_chu`) VALUES
('LSK_82c99395-a515-465a-b750-a32c22ebdb2f', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', '2025-10-04 13:24:50', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'AAAAA', 'AAAAAAAA', 'AAAAAAAA', NULL, 'AAAAAAAAA', 'AAAAAAAAA', 'AAAAAAAAAA');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsutuvan`
--

CREATE TABLE `lichsutuvan` (
  `id_lich_su` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_ho_so` varchar(50) NOT NULL,
  `id_cuoc_hen` varchar(50) NOT NULL,
  `thoi_gian_tu_van` timestamp NOT NULL DEFAULT current_timestamp(),
  `nguoi_tao` varchar(50) DEFAULT NULL,
  `ket_qua_cls` text DEFAULT NULL,
  `ke_hoach_dinh_duong` text DEFAULT NULL,
  `nhu_cau_calo` varchar(50) DEFAULT NULL,
  `sang` text DEFAULT NULL,
  `trua` text DEFAULT NULL,
  `chieu` text DEFAULT NULL,
  `toi` text DEFAULT NULL,
  `cham_soc` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id_nguoi_dung` varchar(50) NOT NULL,
  `ten_dang_nhap` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ','Khác') DEFAULT NULL,
  `so_cccd` varchar(20) DEFAULT NULL,
  `dia_chi` varchar(500) DEFAULT NULL,
  `anh_dai_dien` varchar(500) DEFAULT NULL,
  `vai_tro` enum('benh_nhan','bac_si','chuyen_gia_dinh_duong','nhan_vien_quay','nhan_vien_phan_cong','quan_tri_vien') NOT NULL,
  `trang_thai_hoat_dong` tinyint(1) DEFAULT 1,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `thoi_gian_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau`, `email`, `so_dien_thoai`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `so_cccd`, `dia_chi`, `anh_dai_dien`, `vai_tro`, `trang_thai_hoat_dong`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
('ADMIN_001', 'admin', '$2b$10$abc890def123ghi456jkl789mno012pqr345stu678vwx901yz', 'admin@hospital.com', '0901234567', 'Nguyễn Văn Admin', '1985-10-05', 'Nam', '456789012346', '753 Đường NOP, Quận Gò Vấp, TP.HCM', 'https://example.com/admin/admin.jpg', 'quan_tri_vien', 1, '2025-10-01 17:00:00', '2025-10-01 17:00:00'),
('BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'tienmanh1111', '$2b$10$fFehT.6mlGMn62FDz.edfeYwq628C.Sbwlevny/udByDm5nuSZ0py', 'tienmanh1111@example.com', '0976543213', 'TienManh', '1988-08-08', 'Nữ', NULL, NULL, NULL, 'benh_nhan', 1, '2025-10-28 15:57:33', '2025-10-28 15:57:33'),
('BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'nguyenvana', '$2b$10$s94MM/pXexLYlL1lVEKj2eGksu1D4.YhvHRc./Qh9xQHYcKFsxW56', 'nguyenvana@example.com', '0912345678', 'Nguyễn Văn A', '1990-01-01', 'Nam', '123456789012', '123 Đường ABC, Quận 1, TP.HCM', 'https://i.pinimg.com/736x/4a/f3/6a/4af36a126e1ca3e0895c0a5a6672652e.jpg', 'benh_nhan', 1, '2025-09-29 07:46:00', '2025-10-02 06:35:54'),
('BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'tranminh', '$2b$10$abc123def456ghi789jkl012mno345pqr678stu901vwx234yz', 'tranminh@gmail.com', '0912345679', 'Trần Văn Minh', '1982-03-15', 'Nam', '567890123456', '654 Đường MNO, Quận 5, TP.HCM', 'https://example.com/patients/tranminh.jpg', 'benh_nhan', 1, '2025-10-01 08:00:00', '2025-10-01 08:00:00'),
('BN_ef4af6b3-d7d7-4675-b4be-42286aa8141c', 'nhanvien1', '$2b$10$Urjo1PvAyxLtwO6jcsj8leDQUEBK1cT8.rvSzBTj7SgkM9v/O6t7O', 'nhanvien1@example.com', '0385743421', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, 'benh_nhan', 1, '2025-10-30 10:57:58', '2025-10-30 10:57:58'),
('BN_f3g4h5i6-j7k8-9012-defg-567890123456', 'lehoa', '$2b$10$def456ghi789jkl012mno345pqr678stu901vwx234yz567abc', 'lehoa@gmail.com', '0923456789', 'Lê Thị Hoa', '1995-07-20', 'Nữ', '678901234567', '987 Đường PQR, Quận 6, TP.HCM', 'https://example.com/patients/lehoa.jpg', 'benh_nhan', 1, '2025-10-01 09:00:00', '2025-10-01 09:00:00'),
('BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'phamduc', '$2b$10$ghi789jkl012mno345pqr678stu901vwx234yz567abc890def', 'phamduc@gmail.com', '0934567890', 'Phạm Văn Đức', '2000-11-10', 'Nam', '789012345678', '147 Đường STU, Quận 7, TP.HCM', 'https://example.com/patients/phamduc.jpg', 'benh_nhan', 1, '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
('BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'hoangmai', '$2b$10$jkl012mno345pqr678stu901vwx234yz567abc890def123ghi', 'hoangmai@gmail.com', '0945678901', 'Hoàng Thị Mai', '1988-09-25', 'Nữ', '890123456789', '258 Đường VWX, Quận 8, TP.HCM', 'https://example.com/patients/hoangmai.jpg', 'benh_nhan', 1, '2025-10-01 11:00:00', '2025-10-01 11:00:00'),
('BS_5161a544-997b-4ff1-84ee-7659336016be', 'bacsi2', '$2b$10$PXWEHOYRS3/7vHC/r1Sbo.1nnGTqXz61dkGMuKgYEjVWWbcoJMhFS', 'bacsi2@example.com', '0385743426', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, 'bac_si', 1, '2025-10-30 11:03:24', '2025-10-30 11:03:24'),
('BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'dr.tienmanh', '$2b$10$swB5/y/4ewgv90wxrQJFdezBdKKTMxr5Qkr98WZ3sO3KsxwBs4WXu', 'dr.tienmanh@hospital.com', '0906513333', 'Nguyễn Tiến Mạnh', '1987-05-24', 'Nam', '234567890123', '456 Đường DEF, Quận 2, TP.HCM', 'https://example.com/doctors/dr-tienmanh.jpg', 'bac_si', 1, '2025-09-29 07:11:46', '2025-09-29 07:11:46'),
('BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'dr.vanb', '$2b$10$huHw9u5bPjlK5GB48ZVwmeuBispbDdkop2Eap1./YZ0lvs0sfj1Ju', 'dr.vanb@hospital.com', '0911111111', 'Nguyễn Văn B', '1985-05-05', 'Nam', '345678901234', '789 Đường GHI, Quận 3, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp', 'bac_si', 1, '2025-09-29 07:52:32', '2025-10-04 11:59:24'),
('BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', 'chuyengia01', '$2b$10$pbP/JQVtL6oZOA3t2nqdGujoX5oXY4mcTukXWAju7qf2bl2ThKUem', 'tienmanh@example.com', '0976543211', 'TienManh', '1988-08-08', 'Nữ', NULL, NULL, NULL, 'bac_si', 1, '2025-10-28 15:52:34', '2025-10-28 15:52:34'),
('BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dr.nhikhang', '$2b$10$mno345pqr678stu901vwx234yz567abc890def123ghi456jkl', 'dr.nhikhang@hospital.com', '0956789012', 'Nguyễn Thị Khang', '1983-12-12', 'Nữ', '901234567890', '369 Đường YZA, Quận 9, TP.HCM', 'https://example.com/doctors/dr-nhikhang.jpg', 'bac_si', 1, '2025-10-01 12:00:00', '2025-10-01 12:00:00'),
('BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'dr.sanphu', '$2b$10$pqr678stu901vwx234yz567abc890def123ghi456jkl789mno', 'dr.sanphu@hospital.com', '0967890123', 'Trần Thị Lan', '1980-04-18', 'Nữ', '012345678901', '741 Đường BCD, Quận 10, TP.HCM', 'https://example.com/doctors/dr-sanphu.jpg', 'bac_si', 1, '2025-10-01 13:00:00', '2025-10-01 13:00:00'),
('BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'dr.thankinh', '$2b$10$stu901vwx234yz567abc890def123ghi456jkl789mno012pqr', 'dr.thankinh@hospital.com', '0978901234', 'Lê Văn Nam', '1975-08-30', 'Nam', '123456789013', '852 Đường EFG, Quận 11, TP.HCM', 'https://example.com/doctors/dr-thankinh.jpg', 'bac_si', 1, '2025-10-01 14:00:00', '2025-10-01 14:00:00'),
('BS_c76d606e-1664-4d60-92bb-929f65667587', 'tienmanh9999', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'tienmanh9999@example.com', '0385743420', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, 'bac_si', 1, '2025-10-30 03:05:20', '2025-10-30 03:05:20'),
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'dr.vanc', '$2b$10$wbIW7ZQ6r6r1GTqqu3ghJuNAeruvm34JaNhvUswbmk4aKAZHHKAIS', 'dr.vanc@hospital.com', '0976543210', 'Nguyễn Văn C', '1988-08-08', 'Nữ', '456789012345', '321 Đường JKL, Quận 4, TP.HCM', 'https://example.com/nutritionists/dr-vanc.jpg', 'chuyen_gia_dinh_duong', 1, '2025-09-29 07:52:44', '2025-09-29 07:52:44'),
('NVQ_8a7956f7-01cf-4fbf-bb46-9330d4e8433f', 'nhanvien2', '$2b$10$JtEOiyh7wYWWXkB6v2pPROYI.IJ6yqgNCv5EvDyEQKT8l1HeniinW', 'nhanvien2@example.com', '0385743422', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, 'nhan_vien_quay', 1, '2025-10-30 10:58:49', '2025-10-30 10:58:49'),
('NV_phancong001', 'nhanvienphancong', '$2b$10$yz567abc890def123ghi456jkl789mno012pqr345stu678vwx', 'nhanvienphancong@hospital.com', '0990123456', 'Hoàng Văn Long', '1989-01-22', 'Nam', '345678901235', '159 Đường KLM, Quận Bình Thạnh, TP.HCM', 'https://example.com/staff/nhanvienphancong.jpg', 'nhan_vien_phan_cong', 1, '2025-10-01 16:00:00', '2025-10-01 16:00:00'),
('NV_quay001', 'nhanvienquay', '$2b$10$vwx234yz567abc890def123ghi456jkl789mno012pqr345stu', 'nhanvienquay@hospital.com', '0989012345', 'Phạm Thị Quỳnh', '1992-06-14', 'Nữ', '234567890124', '963 Đường HIJ, Quận 12, TP.HCM', 'https://example.com/staff/nhanvienquay.jpg', 'nhan_vien_quay', 1, '2025-10-01 15:00:00', '2025-10-01 15:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvienphancong`
--

CREATE TABLE `nhanvienphancong` (
  `id_nhan_vien_phan_cong` varchar(50) NOT NULL,
  `ma_nhan_vien` varchar(50) NOT NULL,
  `quyen_han_phan_cong` enum('phong_kham','toan_benh_vien') DEFAULT 'phong_kham'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvienquay`
--

CREATE TABLE `nhanvienquay` (
  `id_nhan_vien_quay` varchar(50) NOT NULL,
  `ma_nhan_vien` varchar(50) NOT NULL,
  `bo_phan_lam_viec` varchar(255) DEFAULT NULL,
  `ca_lam_viec` enum('Sang','Chieu','Toi','Full') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhanvienquay`
--

INSERT INTO `nhanvienquay` (`id_nhan_vien_quay`, `ma_nhan_vien`, `bo_phan_lam_viec`, `ca_lam_viec`) VALUES
('NVQ_8a7956f7-01cf-4fbf-bb46-9330d4e8433f', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phongkham`
--

CREATE TABLE `phongkham` (
  `id_phong_kham` varchar(50) NOT NULL,
  `ten_phong` varchar(255) NOT NULL,
  `so_phong` varchar(20) NOT NULL,
  `tang` int(11) DEFAULT NULL,
  `id_chuyen_khoa` varchar(50) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('HoatDong','BaoTri','Ngung') DEFAULT 'HoatDong',
  `thiet_bi` text DEFAULT NULL,
  `so_cho_ngoi` int(11) DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phongkham`
--

INSERT INTO `phongkham` (`id_phong_kham`, `ten_phong`, `so_phong`, `tang`, `id_chuyen_khoa`, `mo_ta`, `trang_thai`, `thiet_bi`, `so_cho_ngoi`, `thoi_gian_tao`) VALUES
('PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Phòng khám Tim mạch 1', 'P101', 1, 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Phòng khám chuyên khoa Tim mạch với đầy đủ thiết bị hiện đại', 'HoatDong', 'Máy siêu âm tim, Máy đo điện tim, Máy đo huyết áp', 20, '2025-10-01 08:00:00'),
('PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Phòng khám Tim mạch 2', 'P102', 1, 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Phòng khám Tim mạch dự phòng', 'HoatDong', 'Máy siêu âm tim, Máy đo điện tim', 15, '2025-10-01 08:00:00'),
('PK_c3d4e5f6-g7h8-9012-cdef-345678901234', 'Phòng khám Nội tiết', 'P201', 2, 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'Phòng khám chuyên khoa Nội tiết', 'HoatDong', 'Máy đo đường huyết, Máy phân tích hormone, Cân điện tử', 18, '2025-10-01 08:00:00'),
('PK_d4e5f6g7-h8i9-0123-defg-456789012345', 'Phòng khám Nhi khoa', 'P301', 3, 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'Phòng khám Nhi khoa với không gian thân thiện cho trẻ em', 'HoatDong', 'Máy theo dõi sức khỏe trẻ em, Đồ chơi, Ghế khám đặc biệt', 25, '2025-10-01 08:00:00'),
('PK_e5f6g7h8-i9j0-1234-efgh-567890123456', 'Phòng khám Sản phụ khoa', 'P401', 4, 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'Phòng khám Sản phụ khoa với thiết bị siêu âm hiện đại', 'HoatDong', 'Máy siêu âm 4D, Phòng khám riêng tư, Giường khám', 12, '2025-10-01 08:00:00'),
('PK_f6g7h8i9-j0k1-2345-fghi-678901234567', 'Phòng khám Thần kinh', 'P501', 5, 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'Phòng khám chuyên khoa Thần kinh', 'HoatDong', 'Máy EEG, Máy đo lưu huyết não, Bộ dụng cụ khám thần kinh', 16, '2025-10-01 08:00:00'),
('PK_g7h8i9j0-k1l2-3456-ghij-789012345678', 'Phòng khám Tổng quát', 'P001', 1, NULL, 'Phòng khám tổng quát cho các trường hợp chung', 'HoatDong', 'Máy đo huyết áp, Nhiệt kế, Đèn khám, Bộ dụng cụ y tế cơ bản', 30, '2025-10-01 08:00:00'),
('PK_h8i9j0k1-l2m3-4567-hijk-890123456789', 'Phòng khám Cấp cứu', 'P000', 1, NULL, 'Phòng khám cấp cứu 24/7', 'HoatDong', 'Máy thở, Máy sốc tim, Bộ dụng cụ cấp cứu, Giường bệnh', 8, '2025-10-01 08:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuoc`
--

CREATE TABLE `thuoc` (
  `id_thuoc` varchar(50) NOT NULL,
  `ten_thuoc` varchar(255) NOT NULL,
  `hoatchat` varchar(500) DEFAULT NULL,
  `hang_bao_che` varchar(100) DEFAULT NULL,
  `don_vi_tinh` varchar(50) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `chong_chi_dinh` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `thuoc`
--

INSERT INTO `thuoc` (`id_thuoc`, `ten_thuoc`, `hoatchat`, `hang_bao_che`, `don_vi_tinh`, `mo_ta`, `chong_chi_dinh`) VALUES
('T_0fe6a9f2-928b-4f3f-8c8c-6e01737865aa', 'Paracetamol 300mg', 'Paracetamol', 'Công ty Dược Hậu Giang', 'Viên', 'Thuốc giảm đau, hạ sốt', 'Người suy gan, suy thận nặng'),
('T_9d7d052d-3ddd-4ea8-859e-422436a04502', 'Paracetamol 500mg', 'Paracetamol', 'Công ty Dược Hậu Giang', 'Viên', 'Thuốc giảm đau, hạ sốt', 'Người suy gan, suy thận nặng'),
('T_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Amoxicillin 500mg', 'Amoxicillin', 'Công ty Dược Traphaco', 'Viên', 'Kháng sinh điều trị nhiễm khuẩn', 'Dị ứng penicillin, suy thận'),
('T_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Metformin 500mg', 'Metformin', 'Công ty Dược Sanofi', 'Viên', 'Thuốc điều trị đái tháo đường type 2', 'Suy thận, suy gan, nhiễm toan'),
('T_c3d4e5f6-g7h8-9012-cdef-345678901234', 'Lisinopril 10mg', 'Lisinopril', 'Công ty Dược Pfizer', 'Viên', 'Thuốc điều trị cao huyết áp', 'Phụ nữ có thai, hẹp động mạch thận'),
('T_d4e5f6g7-h8i9-0123-defg-456789012345', 'Omeprazole 20mg', 'Omeprazole', 'Công ty Dược AstraZeneca', 'Viên', 'Thuốc điều trị viêm loét dạ dày', 'Trẻ em dưới 1 tuổi'),
('T_e5f6g7h8-i9j0-1234-efgh-567890123456', 'Atorvastatin 20mg', 'Atorvastatin', 'Công ty Dược Novartis', 'Viên', 'Thuốc hạ cholesterol máu', 'Phụ nữ có thai, cho con bú'),
('T_e693d103-5f84-4002-83b9-16a2019ef23c', 'Paracetamol 900mg', 'Paracetamol', 'Công ty Dược Hậu Giang', 'Viên', 'Thuốc giảm đau, hạ sốt', 'Người suy gan, suy thận nặng'),
('T_f2297102-b8c8-4d6a-b4ac-ce46fe641e69', 'Paracetamol 400mg', 'Paracetamol', 'Công ty Dược Hậu Giang', 'Viên', 'Thuốc giảm đau, hạ sốt', 'Người suy gan, suy thận nặng'),
('T_f6g7h8i9-j0k1-2345-fghi-678901234567', 'Ibuprofen 400mg', 'Ibuprofen', 'Công ty Dược Bayer', 'Viên', 'Thuốc chống viêm, giảm đau', 'Loét dạ dày, suy thận, suy gan'),
('T_g7h8i9j0-k1l2-3456-ghij-789012345678', 'Cetirizine 10mg', 'Cetirizine', 'Công ty Dược GlaxoSmithKline', 'Viên', 'Thuốc kháng histamine điều trị dị ứng', 'Phụ nữ có thai, cho con bú'),
('T_h8i9j0k1-l2m3-4567-hijk-890123456789', 'Salbutamol 4mg', 'Salbutamol', 'Công ty Dược Boehringer', 'Viên', 'Thuốc giãn phế quản điều trị hen suyễn', 'Tim mạch không ổn định'),
('T_i9j0k1l2-m3n4-5678-ijkl-901234567890', 'Furosemide 40mg', 'Furosemide', 'Công ty Dược Merck', 'Viên', 'Thuốc lợi tiểu điều trị phù', 'Suy thận nặng, hạ kali máu'),
('T_j0k1l2m3-n4o5-6789-jklm-012345678901', 'Warfarin 5mg', 'Warfarin', 'Công ty Dược Bristol Myers', 'Viên', 'Thuốc chống đông máu', 'Chảy máu, phụ nữ có thai'),
('T_k1l2m3n4-o5p6-7890-klmn-123456789012', 'Digoxin 0.25mg', 'Digoxin', 'Công ty Dược Roche', 'Viên', 'Thuốc điều trị suy tim', 'Rối loạn nhịp tim, suy thận');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinnhan`
--

CREATE TABLE `tinnhan` (
  `id_tin_nhan` varchar(50) NOT NULL,
  `id_cuoc_tro_chuyen` varchar(50) NOT NULL,
  `id_nguoi_gui` varchar(50) NOT NULL,
  `loai_tin_nhan` enum('van_ban','hinh_anh','tap_tin') DEFAULT 'van_ban',
  `noi_dung` text NOT NULL,
  `duong_dan_tap_tin` varchar(500) DEFAULT NULL,
  `thoi_gian_gui` timestamp NOT NULL DEFAULT current_timestamp(),
  `da_doc` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `xinnghiphep`
--

CREATE TABLE `xinnghiphep` (
  `id_xin_nghi` varchar(50) NOT NULL,
  `id_nguoi_dung` varchar(50) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `ly_do` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','da_duyet','tu_choi') DEFAULT 'cho_duyet',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xinnghiphep`
--

INSERT INTO `xinnghiphep` (`id_xin_nghi`, `id_nguoi_dung`, `ngay_bat_dau`, `ngay_ket_thuc`, `ly_do`, `trang_thai`, `ngay_tao`) VALUES
('XN_f84052a7-d8a2-4223-8648-af367746d796', 'BS_c76d606e-1664-4d60-92bb-929f65667587', '2025-10-30', '2025-10-30', 'abcds', 'cho_duyet', '2025-10-29 17:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `yeucaudoica`
--

CREATE TABLE `yeucaudoica` (
  `id_yeu_cau` varchar(50) NOT NULL,
  `id_nhan_vien_gui` varchar(50) NOT NULL,
  `id_nhan_vien_nhan` varchar(50) DEFAULT NULL,
  `id_lich_lam_viec_gui` varchar(50) NOT NULL,
  `id_lich_lam_viec_nhan` varchar(50) DEFAULT NULL,
  `ngay_lam_viec` date NOT NULL,
  `ca_gui` enum('Sang','Chieu','Toi') NOT NULL,
  `ca_nhan` enum('Sang','Chieu','Toi') DEFAULT NULL,
  `ly_do` text DEFAULT NULL,
  `trang_thai` enum('cho_duyet','da_chap_nhan','da_tu_choi','da_huy') DEFAULT 'cho_duyet',
  `thoi_gian_yeu_cau` timestamp NOT NULL DEFAULT current_timestamp(),
  `thoi_gian_phan_hoi` timestamp NULL DEFAULT NULL,
  `ghi_chu_phan_hoi` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `yeucaudoica`
--

INSERT INTO `yeucaudoica` (`id_yeu_cau`, `id_nhan_vien_gui`, `id_nhan_vien_nhan`, `id_lich_lam_viec_gui`, `id_lich_lam_viec_nhan`, `ngay_lam_viec`, `ca_gui`, `ca_nhan`, `ly_do`, `trang_thai`, `thoi_gian_yeu_cau`, `thoi_gian_phan_hoi`, `ghi_chu_phan_hoi`) VALUES
('YC_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'L_3436c298-20f6-4370-af5d-80a0114b0510', 'L_b1c2d3e4-f5g6-7890-abcd-ef1234567890', '2025-10-03', 'Sang', 'Sang', 'Có việc gia đình đột xuất cần nghỉ buổi sáng', 'da_chap_nhan', '2025-10-02 15:30:00', '2025-10-02 16:45:00', 'Đồng ý đổi ca, chúc bạn giải quyết được việc gia đình'),
('YC_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'L_d3e4f5g6-h7i8-9012-cdef-345678901234', 'L_e4f5g6h7-i8j9-0123-defg-456789012345', '2025-10-09', 'Sang', 'Chieu', 'Cần đi khám sức khỏe định kỳ', 'cho_duyet', '2025-10-08 10:20:00', NULL, NULL),
('YC_c3d4e5f6-g7h8-9012-cdef-345678901234', 'NV_quay001', 'NV_phancong001', 'L_g6h7i8j9-k0l1-2345-fghi-678901234567', 'L_i8j9k0l1-m2n3-4567-hijk-890123456789', '2025-10-12', 'Sang', 'Sang', 'Có hẹn với khách hàng quan trọng', 'da_tu_choi', '2025-10-11 14:15:00', '2025-10-11 16:30:00', 'Xin lỗi, tôi cũng có công việc quan trọng vào buổi sáng'),
('YC_d4e5f6g7-h8i9-0123-defg-456789012345', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, 'L_j9k0l1m2-n3o4-5678-ijkl-901234567890', NULL, '2025-10-14', 'Chieu', NULL, 'Cần nghỉ để chuẩn bị cho hội thảo dinh dưỡng', 'da_huy', '2025-10-13 09:45:00', '2025-10-13 11:20:00', 'Đã hủy yêu cầu do tìm được người thay thế khác');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bacsi`
--
ALTER TABLE `bacsi`
  ADD PRIMARY KEY (`id_bac_si`),
  ADD UNIQUE KEY `so_giay_phep_hang_nghe` (`so_giay_phep_hang_nghe`),
  ADD KEY `idx_bacsi_chuyen_khoa` (`id_chuyen_khoa`);

--
-- Chỉ mục cho bảng `benhnhan`
--
ALTER TABLE `benhnhan`
  ADD PRIMARY KEY (`id_benh_nhan`);

--
-- Chỉ mục cho bảng `chidinhxetnghiem`
--
ALTER TABLE `chidinhxetnghiem`
  ADD PRIMARY KEY (`id_chi_dinh`),
  ADD KEY `fk_chidinhxetnghiem_bacsi` (`id_bac_si_chi_dinh`),
  ADD KEY `fk_chidinh_cuoc_hen` (`id_cuoc_hen`);

--
-- Chỉ mục cho bảng `chitietdonthuoc`
--
ALTER TABLE `chitietdonthuoc`
  ADD PRIMARY KEY (`id_chi_tiet_don_thuoc`),
  ADD KEY `fk_chitietdonthuoc_donthuoc` (`id_don_thuoc`),
  ADD KEY `fk_chitietdonthuoc_thuoc` (`id_thuoc`);

--
-- Chỉ mục cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD PRIMARY KEY (`id_chi_tiet`),
  ADD KEY `fk_chitiethoadon_hoadon` (`id_hoa_don`),
  ADD KEY `fk_chitiethoadon_dichvu` (`id_dich_vu`);

--
-- Chỉ mục cho bảng `chuyengiadinhduong`
--
ALTER TABLE `chuyengiadinhduong`
  ADD PRIMARY KEY (`id_chuyen_gia`),
  ADD UNIQUE KEY `so_chung_chi_hang_nghe` (`so_chung_chi_hang_nghe`);

--
-- Chỉ mục cho bảng `chuyenkhoa`
--
ALTER TABLE `chuyenkhoa`
  ADD PRIMARY KEY (`id_chuyen_khoa`),
  ADD UNIQUE KEY `ten_chuyen_khoa` (`ten_chuyen_khoa`);

--
-- Chỉ mục cho bảng `cuochenkhambenh`
--
ALTER TABLE `cuochenkhambenh`
  ADD PRIMARY KEY (`id_cuoc_hen`),
  ADD KEY `fk_cuochenkham_bacsi` (`id_bac_si`),
  ADD KEY `fk_cuochenkham_chuyenkhoa` (`id_chuyen_khoa`),
  ADD KEY `fk_cuochenkham_khunggio` (`id_khung_gio`),
  ADD KEY `idx_cuochenkham_benhnhan` (`id_benh_nhan`);

--
-- Chỉ mục cho bảng `cuochentuvan`
--
ALTER TABLE `cuochentuvan`
  ADD PRIMARY KEY (`id_cuoc_hen`),
  ADD KEY `fk_cuochtuvan_chuyengia` (`id_chuyen_gia`),
  ADD KEY `fk_cuochtuvan_khunggio` (`id_khung_gio`),
  ADD KEY `idx_cuochtuvan_benhnhan` (`id_benh_nhan`);

--
-- Chỉ mục cho bảng `cuoctrochuyen`
--
ALTER TABLE `cuoctrochuyen`
  ADD PRIMARY KEY (`id_cuoc_tro_chuyen`),
  ADD KEY `fk_cuoctro_chuyen_benhnhan` (`id_benh_nhan`),
  ADD KEY `fk_cuoctro_chuyen_bacsi` (`id_bac_si`),
  ADD KEY `fk_cuoctro_chuyen_chuyengia` (`id_chuyen_gia_dinh_duong`);

--
-- Chỉ mục cho bảng `dichvu`
--
ALTER TABLE `dichvu`
  ADD PRIMARY KEY (`id_dich_vu`);

--
-- Chỉ mục cho bảng `doi_ca`
--
ALTER TABLE `doi_ca`
  ADD PRIMARY KEY (`id_doi_ca`);

--
-- Chỉ mục cho bảng `donthuoc`
--
ALTER TABLE `donthuoc`
  ADD PRIMARY KEY (`id_don_thuoc`),
  ADD KEY `fk_donthuoc_hoso` (`id_ho_so`),
  ADD KEY `fk_donthuoc_lichsukham` (`id_lich_su`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`id_hoa_don`),
  ADD KEY `fk_hoadon_cuochenkham` (`id_cuoc_hen_kham`),
  ADD KEY `fk_hoadon_cuochtuvan` (`id_cuoc_hen_tu_van`);

--
-- Chỉ mục cho bảng `hosodinhduong`
--
ALTER TABLE `hosodinhduong`
  ADD PRIMARY KEY (`id_ho_so`),
  ADD KEY `fk_hosodinhduong_chuyengia` (`id_chuyen_gia`),
  ADD KEY `idx_hosodinhduong_benhnhan` (`id_benh_nhan`);

--
-- Chỉ mục cho bảng `hosokhambenh`
--
ALTER TABLE `hosokhambenh`
  ADD PRIMARY KEY (`id_ho_so`),
  ADD KEY `fk_hosokhambenh_bacsi` (`id_bac_si_tao`),
  ADD KEY `idx_hosokhambenh_benhnhan` (`id_benh_nhan`);

--
-- Chỉ mục cho bảng `ketquaxetnghiem`
--
ALTER TABLE `ketquaxetnghiem`
  ADD PRIMARY KEY (`id_ket_qua`),
  ADD UNIQUE KEY `id_chi_dinh` (`id_chi_dinh`);

--
-- Chỉ mục cho bảng `khunggiokham`
--
ALTER TABLE `khunggiokham`
  ADD PRIMARY KEY (`id_khung_gio`);

--
-- Chỉ mục cho bảng `lichlamviec`
--
ALTER TABLE `lichlamviec`
  ADD PRIMARY KEY (`id_lich_lam_viec`),
  ADD KEY `fk_lichlamviec_nguoidung` (`id_nguoi_dung`),
  ADD KEY `fk_lichlamviec_nguoi_tao` (`id_nguoi_tao`),
  ADD KEY `fk_lichlamviec_phongkham` (`id_phong_kham`);

--
-- Chỉ mục cho bảng `lichsudoica`
--
ALTER TABLE `lichsudoica`
  ADD PRIMARY KEY (`id_lich_su`),
  ADD KEY `fk_lichsudoica_yeucau` (`id_yeu_cau`),
  ADD KEY `fk_lichsudoica_nguoidung` (`nguoi_thay_doi`);

--
-- Chỉ mục cho bảng `lichsukham`
--
ALTER TABLE `lichsukham`
  ADD PRIMARY KEY (`id_lich_su`),
  ADD KEY `fk_lichsukham_benhnhan` (`id_benh_nhan`),
  ADD KEY `fk_lichsukham_hoso` (`id_ho_so`),
  ADD KEY `fk_lichsukham_nguoidung` (`nguoi_tao`),
  ADD KEY `fk_lichsukham_cuochen` (`id_cuoc_hen`);

--
-- Chỉ mục cho bảng `lichsutuvan`
--
ALTER TABLE `lichsutuvan`
  ADD PRIMARY KEY (`id_lich_su`),
  ADD KEY `fk_lichsutuvan_benhnhan` (`id_benh_nhan`),
  ADD KEY `fk_lichsutuvan_hoso` (`id_ho_so`),
  ADD KEY `fk_lichsutuvan_nguoidung` (`nguoi_tao`),
  ADD KEY `fk_lichsutuvan_cuochen` (`id_cuoc_hen`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id_nguoi_dung`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `so_cccd` (`so_cccd`);

--
-- Chỉ mục cho bảng `nhanvienphancong`
--
ALTER TABLE `nhanvienphancong`
  ADD PRIMARY KEY (`id_nhan_vien_phan_cong`),
  ADD UNIQUE KEY `ma_nhan_vien` (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `nhanvienquay`
--
ALTER TABLE `nhanvienquay`
  ADD PRIMARY KEY (`id_nhan_vien_quay`),
  ADD UNIQUE KEY `ma_nhan_vien` (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `phongkham`
--
ALTER TABLE `phongkham`
  ADD PRIMARY KEY (`id_phong_kham`),
  ADD UNIQUE KEY `so_phong` (`so_phong`),
  ADD KEY `fk_phongkham_chuyenkhoa` (`id_chuyen_khoa`);

--
-- Chỉ mục cho bảng `thuoc`
--
ALTER TABLE `thuoc`
  ADD PRIMARY KEY (`id_thuoc`);

--
-- Chỉ mục cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD PRIMARY KEY (`id_tin_nhan`),
  ADD KEY `fk_tinnhan_cuoctro` (`id_cuoc_tro_chuyen`),
  ADD KEY `fk_tinnhan_nguoidung` (`id_nguoi_gui`);

--
-- Chỉ mục cho bảng `xinnghiphep`
--
ALTER TABLE `xinnghiphep`
  ADD PRIMARY KEY (`id_xin_nghi`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`);

--
-- Chỉ mục cho bảng `yeucaudoica`
--
ALTER TABLE `yeucaudoica`
  ADD PRIMARY KEY (`id_yeu_cau`),
  ADD KEY `fk_yeucaudoica_nhanvien_gui` (`id_nhan_vien_gui`),
  ADD KEY `fk_yeucaudoica_nhanvien_nhan` (`id_nhan_vien_nhan`),
  ADD KEY `fk_yeucaudoica_lichlamviec_gui` (`id_lich_lam_viec_gui`),
  ADD KEY `fk_yeucaudoica_lichlamviec_nhan` (`id_lich_lam_viec_nhan`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `doi_ca`
--
ALTER TABLE `doi_ca`
  MODIFY `id_doi_ca` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bacsi`
--
ALTER TABLE `bacsi`
  ADD CONSTRAINT `fk_bacsi_chuyenkhoa` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyenkhoa` (`id_chuyen_khoa`),
  ADD CONSTRAINT `fk_bacsi_nguoidung` FOREIGN KEY (`id_bac_si`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `benhnhan`
--
ALTER TABLE `benhnhan`
  ADD CONSTRAINT `fk_benhnhan_nguoidung` FOREIGN KEY (`id_benh_nhan`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chidinhxetnghiem`
--
ALTER TABLE `chidinhxetnghiem`
  ADD CONSTRAINT `fk_chidinh_cuoc_hen` FOREIGN KEY (`id_cuoc_hen`) REFERENCES `cuochenkhambenh` (`id_cuoc_hen`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_chidinhxetnghiem_bacsi` FOREIGN KEY (`id_bac_si_chi_dinh`) REFERENCES `bacsi` (`id_bac_si`);

--
-- Các ràng buộc cho bảng `chitietdonthuoc`
--
ALTER TABLE `chitietdonthuoc`
  ADD CONSTRAINT `fk_chitietdonthuoc_donthuoc` FOREIGN KEY (`id_don_thuoc`) REFERENCES `donthuoc` (`id_don_thuoc`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_chitietdonthuoc_thuoc` FOREIGN KEY (`id_thuoc`) REFERENCES `thuoc` (`id_thuoc`);

--
-- Các ràng buộc cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `fk_chitiethoadon_dichvu` FOREIGN KEY (`id_dich_vu`) REFERENCES `dichvu` (`id_dich_vu`),
  ADD CONSTRAINT `fk_chitiethoadon_hoadon` FOREIGN KEY (`id_hoa_don`) REFERENCES `hoadon` (`id_hoa_don`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chuyengiadinhduong`
--
ALTER TABLE `chuyengiadinhduong`
  ADD CONSTRAINT `fk_chuyengiandd_nguoidung` FOREIGN KEY (`id_chuyen_gia`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cuochenkhambenh`
--
ALTER TABLE `cuochenkhambenh`
  ADD CONSTRAINT `fk_cuochenkham_bacsi` FOREIGN KEY (`id_bac_si`) REFERENCES `bacsi` (`id_bac_si`),
  ADD CONSTRAINT `fk_cuochenkham_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`),
  ADD CONSTRAINT `fk_cuochenkham_chuyenkhoa` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyenkhoa` (`id_chuyen_khoa`),
  ADD CONSTRAINT `fk_cuochenkham_khunggio` FOREIGN KEY (`id_khung_gio`) REFERENCES `khunggiokham` (`id_khung_gio`);

--
-- Các ràng buộc cho bảng `cuochentuvan`
--
ALTER TABLE `cuochentuvan`
  ADD CONSTRAINT `fk_cuochtuvan_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`),
  ADD CONSTRAINT `fk_cuochtuvan_chuyengia` FOREIGN KEY (`id_chuyen_gia`) REFERENCES `chuyengiadinhduong` (`id_chuyen_gia`),
  ADD CONSTRAINT `fk_cuochtuvan_khunggio` FOREIGN KEY (`id_khung_gio`) REFERENCES `khunggiokham` (`id_khung_gio`);

--
-- Các ràng buộc cho bảng `cuoctrochuyen`
--
ALTER TABLE `cuoctrochuyen`
  ADD CONSTRAINT `fk_cuoctro_chuyen_bacsi` FOREIGN KEY (`id_bac_si`) REFERENCES `bacsi` (`id_bac_si`),
  ADD CONSTRAINT `fk_cuoctro_chuyen_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`),
  ADD CONSTRAINT `fk_cuoctro_chuyen_chuyengia` FOREIGN KEY (`id_chuyen_gia_dinh_duong`) REFERENCES `chuyengiadinhduong` (`id_chuyen_gia`);

--
-- Các ràng buộc cho bảng `donthuoc`
--
ALTER TABLE `donthuoc`
  ADD CONSTRAINT `fk_donthuoc_hoso` FOREIGN KEY (`id_ho_so`) REFERENCES `hosokhambenh` (`id_ho_so`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_donthuoc_lichsukham` FOREIGN KEY (`id_lich_su`) REFERENCES `lichsukham` (`id_lich_su`);

--
-- Các ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `fk_hoadon_cuochenkham` FOREIGN KEY (`id_cuoc_hen_kham`) REFERENCES `cuochenkhambenh` (`id_cuoc_hen`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hoadon_cuochtuvan` FOREIGN KEY (`id_cuoc_hen_tu_van`) REFERENCES `cuochentuvan` (`id_cuoc_hen`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hosodinhduong`
--
ALTER TABLE `hosodinhduong`
  ADD CONSTRAINT `fk_hosodinhduong_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hosodinhduong_chuyengia` FOREIGN KEY (`id_chuyen_gia`) REFERENCES `chuyengiadinhduong` (`id_chuyen_gia`);

--
-- Các ràng buộc cho bảng `hosokhambenh`
--
ALTER TABLE `hosokhambenh`
  ADD CONSTRAINT `fk_hosokhambenh_bacsi` FOREIGN KEY (`id_bac_si_tao`) REFERENCES `bacsi` (`id_bac_si`),
  ADD CONSTRAINT `fk_hosokhambenh_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `ketquaxetnghiem`
--
ALTER TABLE `ketquaxetnghiem`
  ADD CONSTRAINT `fk_ketquaxetnghiem_chidinh` FOREIGN KEY (`id_chi_dinh`) REFERENCES `chidinhxetnghiem` (`id_chi_dinh`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lichlamviec`
--
ALTER TABLE `lichlamviec`
  ADD CONSTRAINT `fk_lichlamviec_nguoi_tao` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `nguoidung` (`id_nguoi_dung`),
  ADD CONSTRAINT `fk_lichlamviec_nguoidung` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichlamviec_phongkham` FOREIGN KEY (`id_phong_kham`) REFERENCES `phongkham` (`id_phong_kham`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `lichsudoica`
--
ALTER TABLE `lichsudoica`
  ADD CONSTRAINT `fk_lichsudoica_nguoidung` FOREIGN KEY (`nguoi_thay_doi`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichsudoica_yeucau` FOREIGN KEY (`id_yeu_cau`) REFERENCES `yeucaudoica` (`id_yeu_cau`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lichsukham`
--
ALTER TABLE `lichsukham`
  ADD CONSTRAINT `fk_lichsukham_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichsukham_cuochen` FOREIGN KEY (`id_cuoc_hen`) REFERENCES `cuochenkhambenh` (`id_cuoc_hen`),
  ADD CONSTRAINT `fk_lichsukham_hoso` FOREIGN KEY (`id_ho_so`) REFERENCES `hosokhambenh` (`id_ho_so`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichsukham_nguoidung` FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoidung` (`id_nguoi_dung`);

--
-- Các ràng buộc cho bảng `lichsutuvan`
--
ALTER TABLE `lichsutuvan`
  ADD CONSTRAINT `fk_lichsutuvan_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichsutuvan_cuochen` FOREIGN KEY (`id_cuoc_hen`) REFERENCES `cuochentuvan` (`id_cuoc_hen`),
  ADD CONSTRAINT `fk_lichsutuvan_hoso` FOREIGN KEY (`id_ho_so`) REFERENCES `hosodinhduong` (`id_ho_so`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lichsutuvan_nguoidung` FOREIGN KEY (`nguoi_tao`) REFERENCES `nguoidung` (`id_nguoi_dung`);

--
-- Các ràng buộc cho bảng `nhanvienphancong`
--
ALTER TABLE `nhanvienphancong`
  ADD CONSTRAINT `fk_nhanvienphancong_nguoidung` FOREIGN KEY (`id_nhan_vien_phan_cong`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `nhanvienquay`
--
ALTER TABLE `nhanvienquay`
  ADD CONSTRAINT `fk_nhanvienquay_nguoidung` FOREIGN KEY (`id_nhan_vien_quay`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phongkham`
--
ALTER TABLE `phongkham`
  ADD CONSTRAINT `fk_phongkham_chuyenkhoa` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyenkhoa` (`id_chuyen_khoa`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD CONSTRAINT `fk_tinnhan_cuoctro` FOREIGN KEY (`id_cuoc_tro_chuyen`) REFERENCES `cuoctrochuyen` (`id_cuoc_tro_chuyen`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tinnhan_nguoidung` FOREIGN KEY (`id_nguoi_gui`) REFERENCES `nguoidung` (`id_nguoi_dung`);

--
-- Các ràng buộc cho bảng `xinnghiphep`
--
ALTER TABLE `xinnghiphep`
  ADD CONSTRAINT `xinnghiphep_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `yeucaudoica`
--
ALTER TABLE `yeucaudoica`
  ADD CONSTRAINT `fk_yeucaudoica_lichlamviec_gui` FOREIGN KEY (`id_lich_lam_viec_gui`) REFERENCES `lichlamviec` (`id_lich_lam_viec`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_yeucaudoica_lichlamviec_nhan` FOREIGN KEY (`id_lich_lam_viec_nhan`) REFERENCES `lichlamviec` (`id_lich_lam_viec`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_yeucaudoica_nhanvien_gui` FOREIGN KEY (`id_nhan_vien_gui`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_yeucaudoica_nhanvien_nhan` FOREIGN KEY (`id_nhan_vien_nhan`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
