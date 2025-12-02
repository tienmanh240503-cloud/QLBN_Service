-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th12 01, 2025 lúc 09:26 AM
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
('BS_32355766-35ee-4667-b1a8-eb796a9b0411', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'aaa', 'aa', 'aaaa', 10, 1, 'aa', 'aa'),
('BS_4c76881e-ca8e-4806-b742-ba7624765fca', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'aa', 'aaa', 'aaaa', NULL, 1, 'aa', 'aa'),
('BS_5161a544-997b-4ff1-84ee-7659336016be', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
('BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'Nội tiết - Đái tháo đường', 'BS001234567', 'Bác sĩ chuyên khoa Nội tiết với 8 năm kinh nghiệm điều trị bệnh đái tháo đường và các rối loạn chuyển hóa.', 8, 1, 'Bác sĩ chuyên khoa', 'Phó trưởng khoa'),
('BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Tim mạch - Can thiệp tim', 'BS002345678', 'Bác sĩ chuyên khoa Tim mạch với 12 năm kinh nghiệm trong can thiệp tim mạch và điều trị các bệnh lý tim.', 12, 1, 'Bác sĩ chuyên khoa', 'Trưởng khoa'),
('BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL),
('BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'Nhi khoa - Hô hấp', 'BS003456789', 'Bác sĩ Nhi khoa chuyên về các bệnh lý hô hấp ở trẻ em với 6 năm kinh nghiệm.', 6, 1, 'Bác sĩ chuyên khoa', 'Bác sĩ'),
('BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'Sản phụ khoa - Siêu âm', 'BS004567890', 'Bác sĩ Sản phụ khoa chuyên về siêu âm thai nhi và chăm sóc sức khỏe phụ nữ với 10 năm kinh nghiệm.', 10, 1, 'Bác sĩ chuyên khoa', 'Phó trưởng khoa'),
('BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'Thần kinh - Đột quỵ', 'BS005678901', 'Bác sĩ chuyên khoa Thần kinh với 15 năm kinh nghiệm điều trị đột quỵ và các bệnh lý thần kinh.', 15, 1, 'Bác sĩ chuyên khoa', 'Trưởng khoa'),
('BS_c76d606e-1664-4d60-92bb-929f65667587', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', NULL, NULL, NULL, NULL, 1, NULL, NULL);

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
('BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Sinh viên', 'aaaaaa', 'Nguyen Tien Manh', '0906512691', 'aaaaa', 'aaaaa', 'BH3213247561'),
('BN_43ee82f9-b47d-4f7c-8cc7-03c3a79f72d7', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_5b123bbc-450d-40c6-9648-5d8566247692', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_63ff44ad-a567-41be-88ca-2a148a44772d', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_6dba3874-ffd3-4233-b66a-c10f0d284f4a', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_7c900d65-7564-4d2c-b83d-daca1ea63bd9', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'Giao vien', 'aaaaaa', 'Nguyen Tien Manh', '0906512691', 'aaaaaa', 'aaaaaa', 'BH3213213221'),
('BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Kỹ sư phần mềm', 'Bảo hiểm y tế công ty', 'Nguyễn Thị Lan', '0987654321', 'Tiền sử cao huyết áp, đái tháo đường type 2', 'Huyết áp ổn định, đường huyết kiểm soát tốt', 'DN123456789'),
('BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'Giáo viên', 'Bảo hiểm y tế nhà nước', 'Trần Văn Minh', '0912345678', 'Tiền sử viêm dạ dày', 'Sức khỏe ổn định, cần theo dõi định kỳ', 'GD987654321'),
('BN_e46b6e2d-cb98-4803-8247-4ecc35f6ea87', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
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
('CD_269f9e04-ad0d-4794-a763-3c3e99441418', 'CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'Xet nghiệm máu ', 'SAsSAsÁ', 'hoan_thanh', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', '2025-10-06 09:51:18'),
('CD_4199eaa4-e109-45be-8ffd-79c5cbc5c6e5', 'CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'Xet nghiệm máu ', 'aaaaaaaaaa', 'hoan_thanh', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', '2025-10-06 09:49:17'),
('CD_86360a70-d62c-4502-ac36-308da3e080ea', 'CH_4853c4ab-44a1-4fd6-a191-48587939ef57', 'Xet nghiệm máu ', 'AAAAAAAAAAAA', 'hoan_thanh', 'BS_c76d606e-1664-4d60-92bb-929f65667587', '2025-10-31 02:57:32'),
('CD_cb80f490-cd5b-44fd-9a36-8eb3bf86626b', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'Xet nghiệm máu ', 'aaaaaaaaaaa', '', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-11-16 07:11:14');

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
('DDT_184f8d7f-56e3-4642-a20b-eed041a79c52', 'DT_983f3e64-2054-4906-ab8f-1a4bd53423b2', 'T_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aaa', '', 1, 'aaa'),
('DDT_216d3587-c357-4d4d-9b42-a0c01016b53f', 'DT_98c3c54d-7692-447f-ab59-cb6b17da8bfa', 'T_9d7d052d-3ddd-4ea8-859e-422436a04502', 'aaaaa', 'aaaa', '', 1, 'aaaaaa'),
('DDT_30dbcf32-81de-453b-b1fb-c42522531723', 'DT_406788c9-eeee-48b7-811f-22b5fd6a20d6', 'T_0fe6a9f2-928b-4f3f-8c8c-6e01737865aa', 'aaaaa', 'aaaaa', '', 1, 'aaaaa'),
('DDT_9b3f2a9e-09bd-4278-860d-e7958c596748', 'DT_3ed21ad1-174a-42c0-9d46-7d7afa38c261', 'T_h8i9j0k1-l2m3-4567-hijk-890123456789', 'b', 'b', '', 1, 'b'),
('DDT_bd502028-38b6-4284-8226-c5d7fc8ca27a', 'DT_406788c9-eeee-48b7-811f-22b5fd6a20d6', 'T_e5f6g7h8-i9j0-1234-efgh-567890123456', 'ấdadasdasd', 'ádasdsadsadas', '', 1, 'đâsdasd'),
('DDT_bd701d13-2abb-42ab-8fe5-843a47a4965a', 'DT_983f3e64-2054-4906-ab8f-1a4bd53423b2', 'T_9d7d052d-3ddd-4ea8-859e-422436a04502', 'aaa', 'aa', '', 1, 'aa'),
('DDT_c7e81c67-61fa-484b-a41f-301fee781286', 'DT_3ed21ad1-174a-42c0-9d46-7d7afa38c261', 'T_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'a', 'a', '', 1, 'a'),
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
('DHD_0bbbb1db-52c8-4a31-b04d-77f2237bbfd6', 'HD_2e4e77b9-f16d-4c8b-851e-c96294011bc1', 'DV_c3d4e5f6-g7h8-9012-cdef-345678901234', 1, 300000.00),
('DHD_26b07b7d-17ec-4a33-ae72-08312fde375b', 'HD_745d5b69-2130-48a2-9776-1a282daf8cd2', 'DV_b2c3d4e5-f6g7-8901-bcde-f23456789012', 1, 80000.00),
('DHD_2c0b8c9c-3d4c-4e4d-9d1f-4c6bf22000ac', 'HD_aa788631-3645-437b-98a8-22db5853f559', 'DV_m3n4o5p6-q7r8-9012-mnop-345678901234', 1, 200000.00),
('DHD_2fe5ca4b-fb7f-4fc0-aaf6-47c9aabcf91c', 'HD_a5ef82ad-f2e5-4348-95af-c0239b72d7d7', 'DV_j0k1l2m3-n4o5-6789-jklm-012345678901', 1, 120000.00),
('DHD_31a11898-b860-4a1d-8212-c1f9dad522a9', 'HD_8aa42f3a-f100-4e87-a6ab-20f07f45aad9', 'DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 1, 60000.00),
('DHD_34b72748-2b52-4663-8a9e-0ae2336ee113', 'HD_f6bf599b-eabd-47ab-ac49-4ce2de0c7356', 'DV_m3n4o5p6-q7r8-9012-mnop-345678901234', 1, 200000.00),
('DHD_40c4eaa5-eee5-4752-bf85-5406be29a3c7', 'HD_1faef6b6-96dc-4312-9df2-b981d2967ff3', 'DV_m3n4o5p6-q7r8-9012-mnop-345678901234', 1, 200000.00),
('DHD_4864f532-1322-41c0-8f29-4c0a6a6433ac', 'HD_b56a101f-5834-4bfc-860e-e0305d4aba4e', 'DV_e5f6g7h8-i9j0-1234-efgh-567890123456', 1, 150000.00),
('DHD_4b6c5d2e-dde4-4291-ab72-adad22f7d525', 'HD_424d1448-b7f9-4f8b-91e2-72c4615a2d11', 'DV_c3d4e5f6-g7h8-9012-cdef-345678901234', 1, 300000.00),
('DHD_757acf46-759a-4a50-817e-0913e0324cd8', 'HD_36a76e4d-1478-4ab3-8f08-ecc0246870d5', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 2, 2000000.00),
('DHD_9682b7fd-f940-4d63-96ba-2cb7ba64a25b', 'HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 1, 200000.00),
('DHD_a3610019-4dc7-400f-9c0b-82002897f3a7', 'HD_97e5856c-5a12-496e-982d-222df32cca4d', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 1, 200000.00),
('DHD_b332e4b9-4d66-4236-bbed-0ca0bf1deb7c', 'HD_97e5856c-5a12-496e-982d-222df32cca4d', 'DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 1, 60000.00),
('DHD_badb3e0f-98fa-4d7f-8ea9-7a4f6181a0bd', 'HD_6978d4ba-9125-447f-a4a3-783e96fe6d1d', 'DV_d4e5f6g7-h8i9-0123-defg-456789012345', 1, 100000.00),
('DHD_ce7bc8b6-8342-4957-a85c-234865a9f09a', 'HD_33c5eec6-4290-4558-a1ce-2e9e2d363e2f', 'DV_g7h8i9j0-k1l2-3456-ghij-789012345678', 1, 800000.00),
('DHD_d520284f-f01d-4711-8d98-f86d7749689b', 'HD_a605f6fb-5940-46f1-9403-ca06deee1572', 'DV_b2c3d4e5-f6g7-8901-bcde-f23456789012', 1, 80000.00),
('DHD_d650251f-fde2-4b0d-a3d0-6c41911e79be', 'HD_184dea47-cc72-4dad-bde5-d61160330b76', 'DV_h8i9j0k1-l2m3-4567-hijk-890123456789', 1, 1500000.00),
('DHD_e5d37934-085d-446a-929f-d3cd71874280', 'HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'DV_8925ba1c-5f88-488c-bae1-6029924fd8d6', 1, 60000.00),
('DHD_f5596a70-c0d6-43e3-83ed-4bfd13327b56', 'HD_424d1448-b7f9-4f8b-91e2-72c4615a2d11', 'DV_4ae3cb02-1fab-4155-9dd0-37018932ad84', 1, 2000000.00);

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
('CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'Cu nhan', '1232313123123', 'aaaaa', 'aaaaaa', 'aaaaa'),
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Cu nhan', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyengia_chuyennganhdinhduong`
--

CREATE TABLE `chuyengia_chuyennganhdinhduong` (
  `id_chuyen_gia` varchar(50) NOT NULL,
  `id_chuyen_nganh` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chuyengia_chuyennganhdinhduong`
--

INSERT INTO `chuyengia_chuyennganhdinhduong` (`id_chuyen_gia`, `id_chuyen_nganh`) VALUES
('CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'CN_test235'),
('CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'CN_test236'),
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'CN_test234'),
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'CN_test235');

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
('CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'Khoa Nội tiết', 'Chuyên điều trị các bệnh lý nội tiết, tiểu đường và rối loạn chuyển hóa.', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1762108319/QLBN/ChuyenKhoa/chuyenkhoa_1762108316363.jpg', 'Máy đo đường huyết, Máy phân tích hormone', 'Thứ 2 - Thứ 6: 7h00 - 17h00'),
('CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'Khoa Tim mạch', 'Chuyên điều trị các bệnh lý tim mạch và huyết áp. Chúng tôi có đội ngũ bác sĩ giàu kinh nghiệm với máy móc hiện đại.', 'https://example.com/images/tim-mach.jpg', 'Máy siêu âm tim, Máy đo điện tim, Máy chụp MRI', 'Thứ 2 - Thứ 7: 7h00 - 17h00'),
('CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'Khoa Nhi khoa', 'Chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi với phương pháp hiện đại.', 'https://example.com/images/nhi-khoa.jpg', 'Máy theo dõi sức khỏe trẻ em, Hệ thống tiêm chủng', 'Thứ 2 - Chủ Nhật: 7h00 - 20h00'),
('CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'Khoa Sản phụ khoa', 'Chăm sóc sức khỏe phụ nữ, sản phụ và trẻ sơ sinh với đội ngũ chuyên môn cao.', 'https://example.com/images/san-phu.jpg', 'Máy siêu âm 4D, Phòng phẫu thuật hiện đại', 'Thứ 2 - Thứ 7: 7h00 - 17h00'),
('CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'Khoa Thần kinh', 'Chẩn đoán và điều trị các bệnh lý thần kinh, đau đầu, động kinh.', 'https://example.com/images/than-kinh.jpg', 'Máy EEG, Máy MRI thần kinh, Máy đo lưu huyết não', 'Thứ 2 - Thứ 6: 7h00 - 17h00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuyennganhdinhduong`
--

CREATE TABLE `chuyennganhdinhduong` (
  `id_chuyen_nganh` varchar(50) NOT NULL,
  `ten_chuyen_nganh` varchar(100) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `doi_tuong_phuc_vu` varchar(255) DEFAULT NULL,
  `thoi_gian_hoat_dong` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chuyennganhdinhduong`
--

INSERT INTO `chuyennganhdinhduong` (`id_chuyen_nganh`, `ten_chuyen_nganh`, `mo_ta`, `hinh_anh`, `doi_tuong_phuc_vu`, `thoi_gian_hoat_dong`) VALUES
('CN_test234', 'Dinh dưỡng thể thao', 'Tư vấn chế độ ăn và phục hồi năng lượng cho vận động viên', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1762844609/ChuyenNganhDinhDuong/image_1762844605424.jpg', 'Vận động viên, người tập gym', 'Thứ 2 - Thứ 7: 8h00 - 17h00'),
('CN_test235', 'Dinh dưỡng trẻ em', 'Hướng dẫn chế độ ăn phù hợp cho trẻ em và trẻ sơ sinh', 'dinh_duong_tre_em.jpg', 'Trẻ em, phụ huynh', 'Thứ 2 - Thứ 6: 7h30 - 16h30'),
('CN_test236', 'Dinh dưỡng lâm sàng', 'Tư vấn chế độ dinh dưỡng cho bệnh nhân điều trị tại bệnh viện', 'dinh_duong_lam_sang.jpg', 'Bệnh nhân nội trú, ngoại trú', 'Thứ 2 - Chủ nhật: 8h00 - 18h00');

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
  `loai_hen` enum('truc_tiep','online') DEFAULT NULL,
  `trang_thai` enum('cho_thanh_toan','da_dat','da_huy','da_hoan_thanh') DEFAULT 'cho_thanh_toan',
  `ly_do_kham` varchar(500) DEFAULT NULL,
  `trieu_chung` text DEFAULT NULL,
  `id_hoa_don_coc` varchar(50) DEFAULT NULL,
  `thoi_han_thanh_toan` timestamp NULL DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cuochenkhambenh`
--

INSERT INTO `cuochenkhambenh` (`id_cuoc_hen`, `id_benh_nhan`, `id_bac_si`, `id_chuyen_khoa`, `id_khung_gio`, `ngay_kham`, `loai_hen`, `trang_thai`, `ly_do_kham`, `trieu_chung`, `id_hoa_don_coc`, `thoi_han_thanh_toan`, `thoi_gian_tao`) VALUES
('CH_09433868-c11a-4427-a7c6-7b577cf4d2d4', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_1d2e3f4a-5b6c-7890-1234-efab56789012', '2025-12-06', 'truc_tiep', 'da_huy', 'aaa', NULL, 'HD_e8a134b5-5162-47df-9e35-43782edb37c9', '2025-11-27 13:51:30', '2025-11-26 13:51:30'),
('CH_13a4269b-7802-4b84-8644-3521033be9eb', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-12-06', 'truc_tiep', 'da_huy', 'aaaaaa', 'aaaa', 'HD_63af286f-c000-4642-929a-5bf7e6265578', '2025-11-26 10:25:12', '2025-11-26 10:15:12'),
('CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-25', 'truc_tiep', 'da_hoan_thanh', 'aa', 'aaa', NULL, NULL, '2025-11-24 11:24:24'),
('CH_192f4eac-947b-462b-a064-dade9cffd1eb', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-11-13', 'truc_tiep', 'da_hoan_thanh', 'aaaaaaaaaaaaa', 'aaaaaaaaaaaaaa', NULL, NULL, '2025-11-12 06:39:45'),
('CH_1d6aa622-e519-4553-b898-babafd548247', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-12-06', 'truc_tiep', 'da_huy', 'aaa', 'aaa', 'HD_26e57cf7-a5c1-48da-80d7-4ac46584a643', '2025-11-27 13:43:47', '2025-11-26 13:43:47'),
('CH_1dab699c-9cd5-4572-b1f1-e887d7916feb', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-10-28', 'truc_tiep', 'da_dat', 'Khám sức khỏe định kỳ', 'Ho, sốt nhẹ', NULL, NULL, '2025-10-28 15:58:11'),
('CH_259d50de-0f19-4a55-a868-15f777313752', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-25', 'online', 'da_hoan_thanh', 'aaaa', 'aaaa', NULL, NULL, '2025-11-24 11:24:42'),
('CH_278e0925-456c-473f-8595-a175b3a1b43d', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-27', 'truc_tiep', 'da_huy', 'aaaaaa', 'aaaa', 'HD_a121748b-a2cd-4648-a956-973a45c4ddab', '2025-11-26 10:19:17', '2025-11-26 10:09:17'),
('CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-17', 'truc_tiep', 'da_hoan_thanh', 'đau đẻ', NULL, NULL, NULL, '2025-11-16 06:40:42'),
('CH_2d9e3baf-89a6-4c1c-94b6-12ddbdda9865', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-27', 'truc_tiep', 'da_dat', 'aaaaa', NULL, NULL, NULL, '2025-11-26 08:07:33'),
('CH_330c842a-b1e4-4e46-ab28-1064cae35535', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-12-06', 'truc_tiep', 'da_huy', 'aa', 'aa', 'HD_caa2a2b9-379a-4a31-a89d-7991d0a3583d', '2025-11-27 14:01:39', '2025-11-26 14:01:39'),
('CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_1d2e3f4a-5b6c-7890-1234-efab56789012', '2025-12-06', 'truc_tiep', 'da_huy', 'Đau đẻ', NULL, 'HD_1dbc32a3-2f03-4d97-b3fc-9546c73d3e3b', '2025-11-26 10:27:55', '2025-11-26 10:17:55'),
('CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-25', 'truc_tiep', 'da_hoan_thanh', 'aaa', 'aaaa', NULL, NULL, '2025-11-24 10:39:28'),
('CH_4378e9d0-78be-4e7f-817e-c5bf4dd06b5e', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-12-06', 'truc_tiep', 'da_huy', 'aaa', NULL, 'HD_91cfccd0-a380-4220-ac33-644b775fe14f', '2025-11-27 13:56:19', '2025-11-26 13:56:19'),
('CH_4853c4ab-44a1-4fd6-a191-48587939ef57', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-10-30', 'truc_tiep', 'da_hoan_thanh', 'Khám sức khỏe định kỳ', 'Ho, sốt nhẹ', NULL, NULL, '2025-10-31 02:55:01'),
('CH_4b12c2cf-10d7-483f-8483-7bf649134968', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-17', 'truc_tiep', 'da_hoan_thanh', 'khám bệnh đau đẻ', NULL, NULL, NULL, '2025-11-16 06:16:53'),
('CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-10-06', 'online', 'da_hoan_thanh', 'Khám sức khỏe định kỳ', 'Đau ngực, khó thở', NULL, NULL, '2025-10-04 13:09:50'),
('CH_6dcde652-339e-4749-a7c8-2537a0a39a45', 'BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-10-30', 'truc_tiep', 'da_dat', 'Khám sức khỏe định kỳ', 'Ho, sốt nhẹ', NULL, NULL, '2025-10-31 02:56:26'),
('CH_89fdb566-0b4f-4a0f-b923-13112990f668', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-27', 'truc_tiep', 'da_huy', 'aaaa', NULL, 'HD_426c5a4d-bbc6-4cf5-961b-396441313230', '2025-11-26 09:56:42', '2025-11-26 09:46:42'),
('CH_91b92c19-e24c-409a-b616-01e91af1112a', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '2025-11-27', 'truc_tiep', 'da_huy', 'aaaa', NULL, 'HD_e821744d-0991-4e18-bb2d-050122df713c', '2025-11-26 10:07:14', '2025-11-26 09:57:14'),
('CH_9dad9fc6-0957-4939-962f-f4b8f8d2caab', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-30', 'truc_tiep', 'da_dat', 'aaa', NULL, 'HD_fdbb7673-6fb9-402e-9cd7-93bc3a53543e', '2025-11-30 02:33:42', '2025-11-29 02:33:42'),
('CH_a92e1bba-f810-40e3-8cd2-70e2f0ec0537', 'BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-01', 'truc_tiep', 'da_hoan_thanh', 'đau bụng đẻ', NULL, NULL, NULL, '2025-11-01 09:28:47'),
('CH_ae9195d5-229f-43a8-b463-e777094f1eb6', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '2025-11-25', 'online', 'da_hoan_thanh', 'aaaa', 'aaa', NULL, NULL, '2025-11-24 10:44:57'),
('CH_b068ff79-437e-4410-80cf-1fa6872918a3', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-10-07', 'online', 'da_dat', 'Tái khám sau điều trị', 'Cần theo dõi huyết áp', NULL, NULL, '2025-10-06 09:27:05'),
('CH_b8b2cde7-b7ab-4112-be01-406cde686dba', 'BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-10-31', 'truc_tiep', 'da_dat', 'Khám sức khỏe định kỳ', 'Ho, sốt nhẹ', NULL, NULL, '2025-10-31 02:53:07'),
('CH_b8c1c1cd-2680-42d5-8dcf-c5cdeea04ca0', 'BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-12', 'online', 'da_dat', 'aaaaaaaa', NULL, NULL, NULL, '2025-11-10 11:29:16'),
('CH_bd0eab68-9187-45b6-806e-dcf2c2e6db98', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-27', 'truc_tiep', 'da_huy', 'aaa', 'aaa', 'HD_e9f298b2-5a9a-4c94-9bd8-91cde2a6ae6a', '2025-11-26 10:13:35', '2025-11-26 10:03:35'),
('CH_bedcc300-ee67-4022-96b0-ffc35c2ca52d', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-12-06', 'truc_tiep', 'da_dat', 'aaaa', 'aaa', 'HD_aa89d476-d8f4-419b-a0dc-9e2e57a778d7', '2025-11-27 14:06:03', '2025-11-26 14:06:03'),
('CH_c1d2e3f4-g5h6-7890-abcd-ef1234567890', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '2025-10-08', 'truc_tiep', 'da_dat', 'Kiểm tra đường huyết', 'Mệt mỏi, khát nước nhiều', NULL, NULL, '2025-10-07 10:15:30'),
('CH_d2e3f4g5-h6i7-8901-bcde-f23456789012', 'BN_f3g4h5i6-j7k8-9012-defg-567890123456', 'BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'KG_9b0c1d2e-3f4a-5678-9012-cdef34567890', '2025-10-09', 'online', 'da_dat', 'Khám cho trẻ em', 'Sốt cao, ho khan', NULL, NULL, '2025-10-08 14:20:45'),
('CH_defdc026-aa0b-4235-81c8-f5cc3eaa5f56', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-27', 'truc_tiep', 'da_huy', 'aaa', 'aaa', 'HD_7a2394b2-1c4d-4f22-aa2a-4ee2e31f037b', '2025-11-26 10:15:14', '2025-11-26 10:05:14'),
('CH_e3f4g5h6-i7j8-9012-cdef-345678901234', 'BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-10-10', 'truc_tiep', 'da_huy', 'Khám thai định kỳ', 'Mang thai tuần 20', NULL, NULL, '2025-10-09 16:30:20'),
('CH_f3874b43-beba-4ac5-9527-8a067c703b78', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_8a9b0c1d-2e3f-4567-8901-bcde23456789', '2025-11-25', 'truc_tiep', 'da_hoan_thanh', 'aa', 'aaaa', NULL, NULL, '2025-11-24 11:24:59'),
('CH_f4g5h6i7-j8k9-0123-defg-456789012345', 'BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'KG_1d2e3f4a-5b6c-7890-1234-efab56789012', '2025-10-11', 'online', 'da_dat', 'Khám đau đầu', 'Đau đầu dữ dội, buồn nôn', NULL, NULL, '2025-10-10 11:45:15'),
('CH_f7c917a1-f898-4559-bce0-af54d603c9de', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'KG_7f8e9d0c-1b2a-3456-7890-abcd12345678', '2025-11-25', 'truc_tiep', 'da_hoan_thanh', 'aaaaaaaaaaaa', 'aaaaa', NULL, NULL, '2025-11-24 10:50:56');

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
  `trang_thai` enum('cho_thanh_toan','da_dat','da_huy','da_hoan_thanh') DEFAULT 'cho_thanh_toan',
  `ly_do_tu_van` varchar(500) DEFAULT NULL,
  `id_hoa_don_coc` varchar(50) DEFAULT NULL,
  `thoi_han_thanh_toan` timestamp NULL DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cuochentuvan`
--

INSERT INTO `cuochentuvan` (`id_cuoc_hen`, `id_benh_nhan`, `id_chuyen_gia`, `id_khung_gio`, `ngay_kham`, `loai_dinh_duong`, `loai_hen`, `trang_thai`, `ly_do_tu_van`, `id_hoa_don_coc`, `thoi_han_thanh_toan`, `thoi_gian_tao`) VALUES
('CH_02e9baa5-562e-4aaf-a572-23cf25d10ccf', 'BN_5b123bbc-450d-40c6-9648-5d8566247692', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-17', 'Dinh dưỡng thể thao', 'truc_tiep', 'da_hoan_thanh', 'dinh duong', NULL, NULL, '2025-11-16 07:04:12'),
('CH_2f8d0932-839d-422f-9da8-fe051ed9d6f5', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'KG_0c1d2e3f-4a5b-6789-0123-defa45678901', '2025-11-03', 'aaaaaaaa', 'truc_tiep', 'da_hoan_thanh', 'aaaaaa', NULL, NULL, '2025-11-02 19:36:43'),
('CH_379d51bd-04f2-48e3-9d38-c4c616bf4754', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'KG_3deb3d42-e393-43ee-9fe2-f3868ba3116f', '2025-11-24', 'Dinh dưỡng thể thao', 'truc_tiep', 'da_hoan_thanh', 'aaaaaaaa', NULL, NULL, '2025-11-24 10:15:01'),
('CH_7072fa4e-30d8-494b-9cd1-3dca2db46304', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'KG_2e3f4a5b-6c7d-8901-2345-fabc67890123', '2025-11-12', '', 'truc_tiep', 'da_dat', 'đau ỉa', NULL, NULL, '2025-11-12 03:59:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuoctrochuyen`
--

CREATE TABLE `cuoctrochuyen` (
  `id_cuoc_tro_chuyen` varchar(100) NOT NULL,
  `id_benh_nhan` varchar(50) DEFAULT NULL,
  `id_bac_si` varchar(50) DEFAULT NULL,
  `id_chuyen_gia_dinh_duong` varchar(50) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `trang_thai` varchar(20) DEFAULT 'dang_mo',
  `thoi_gian_tao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `cuoctrochuyen`
--

INSERT INTO `cuoctrochuyen` (`id_cuoc_tro_chuyen`, `id_benh_nhan`, `id_bac_si`, `id_chuyen_gia_dinh_duong`, `tieu_de`, `trang_thai`, `thoi_gian_tao`) VALUES
('CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'NV_phancong001', NULL, 'Cuộc trò chuyện: Trần Thị Lan - Hoàng Văn Long', 'dang_mo', '2025-10-31 16:26:28'),
('CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, 'Cuộc trò chuyện: Trần Thị Lan - Nguyễn Văn C', 'dang_mo', '2025-10-31 16:09:39'),
('CTC_27e45059-86aa-461b-b337-d1d8548da184', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_c76d606e-1664-4d60-92bb-929f65667587', NULL, 'Cuộc trò chuyện: TienManh - Nguyễn Văn A', 'dang_mo', '2025-10-31 23:03:53'),
('CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'Cuộc trò chuyện: Trần Thị Lan - TienManh', 'dang_mo', '2025-10-31 16:02:38'),
('CTC_3efee32c-4702-4fb0-a5a3-4771d8d89a08', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', NULL, NULL, 'Cuộc trò chuyện: Hoàng Văn Long - TienManh', 'dang_mo', '2025-11-08 22:42:50'),
('CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, 'Cuộc trò chuyện: Hoàng Văn Long - Nguyễn Văn C', 'dang_mo', '2025-10-31 22:50:28'),
('CTC_62a3df20-1ca9-48d2-b539-4ccc40be3700', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'Cuộc trò chuyện: Trần Thị Lan - Nguyễn Văn A', 'dang_mo', '2025-10-31 15:32:59'),
('CTC_7d539791-d986-413e-b73d-cd033cdd2b99', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', NULL, 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Cuộc trò chuyện: Nguyễn Văn C - TienManh', 'dang_mo', '2025-11-11 14:52:33'),
('CTC_a3d19086-6981-4f1f-99cb-bc1bae460863', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'Cuộc trò chuyện: Trần Thị Lan - Trần Văn Minh', 'dang_mo', '2025-10-31 15:51:05'),
('CTC_bbf8b18a-a213-4e14-a7f6-1e9b6efb68b2', 'NV_quay001', 'ADMIN_001', NULL, 'Cuộc trò chuyện: Phạm Thị Quỳnh - Nguyễn Văn Admin', 'dang_mo', '2025-11-03 17:47:22');

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
('DT_3ed21ad1-174a-42c0-9d46-7d7afa38c261', 'LSK_87cb21a9-b1e3-434c-93f0-d1d556718808', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'aaaa', 'dang_su_dung', '2025-11-24 04:30:50'),
('DT_406788c9-eeee-48b7-811f-22b5fd6a20d6', 'LSK_21a52d9b-79c2-4783-9d6f-d8d2ebff0c18', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', ' aaa', 'dang_su_dung', '2025-11-14 10:52:03'),
('DT_983f3e64-2054-4906-ab8f-1a4bd53423b2', 'LSK_d4cb4ee2-b215-4f78-8378-df5ab2ee26a1', 'KB_dc67f968-1196-4a22-8c52-a55eefa4a316', 'aaaaa', 'dang_su_dung', '2025-10-31 03:43:31'),
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
  `trang_thai` enum('chua_thanh_toan','da_thanh_toan','da_huy','da_hoan_tien') DEFAULT 'chua_thanh_toan',
  `phuong_thuc_thanh_toan` enum('tien_mat','chuyen_khoan','the','vi_dien_tu','momo','vnpay') DEFAULT NULL,
  `loai_hoa_don` enum('dich_vu','dat_coc','hoan_dat_coc') DEFAULT 'dich_vu',
  `id_hoa_don_tham_chieu` varchar(50) DEFAULT NULL,
  `ma_giao_dich` varchar(100) DEFAULT NULL,
  `thoi_han_thanh_toan` timestamp NULL DEFAULT NULL,
  `thoi_gian_thanh_toan` timestamp NULL DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`id_hoa_don`, `id_cuoc_hen_kham`, `id_cuoc_hen_tu_van`, `tong_tien`, `trang_thai`, `phuong_thuc_thanh_toan`, `loai_hoa_don`, `id_hoa_don_tham_chieu`, `ma_giao_dich`, `thoi_han_thanh_toan`, `thoi_gian_thanh_toan`, `thoi_gian_tao`) VALUES
('HD_184dea47-cc72-4dad-bde5-d61160330b76', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', NULL, 1500000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 09:59:53', '2025-11-24 04:30:50'),
('HD_1dbc32a3-2f03-4d97-b3fc-9546c73d3e3b', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', NULL, 100000.00, 'da_hoan_tien', 'momo', 'dat_coc', NULL, '4617136874', '2025-11-26 10:27:55', '2025-11-26 10:18:35', '2025-11-26 10:17:55'),
('HD_1faef6b6-96dc-4312-9df2-b981d2967ff3', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', NULL, 200000.00, 'da_thanh_toan', 'momo', 'dich_vu', NULL, NULL, NULL, NULL, '2025-11-24 11:26:11'),
('HD_26e57cf7-a5c1-48da-80d7-4ac46584a643', 'CH_1d6aa622-e519-4553-b898-babafd548247', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-27 13:43:47', NULL, '2025-11-26 13:43:47'),
('HD_2e4e77b9-f16d-4c8b-851e-c96294011bc1', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', NULL, 300000.00, 'chua_thanh_toan', NULL, 'dich_vu', NULL, NULL, NULL, NULL, '2025-11-24 10:40:01'),
('HD_33c5eec6-4290-4558-a1ce-2e9e2d363e2f', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', NULL, 800000.00, 'chua_thanh_toan', NULL, 'dich_vu', NULL, NULL, NULL, NULL, '2025-11-24 10:52:17'),
('HD_366b4214-1536-436a-a26e-b2388fad8775', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', NULL, 100000.00, 'da_thanh_toan', 'momo', 'hoan_dat_coc', 'HD_63af286f-c000-4642-929a-5bf7e6265578', NULL, NULL, '2025-11-26 10:16:38', '2025-11-26 10:16:38'),
('HD_36a76e4d-1478-4ab3-8f08-ecc0246870d5', 'CH_4853c4ab-44a1-4fd6-a191-48587939ef57', NULL, 4000000.00, 'da_thanh_toan', 'chuyen_khoan', 'dich_vu', NULL, NULL, NULL, '2025-11-02 21:23:23', '2025-10-31 03:43:31'),
('HD_424d1448-b7f9-4f8b-91e2-72c4615a2d11', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', NULL, 2300000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 09:59:50', '2025-11-14 10:52:03'),
('HD_426c5a4d-bbc6-4cf5-961b-396441313230', 'CH_89fdb566-0b4f-4a0f-b923-13112990f668', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-26 09:56:42', NULL, '2025-11-26 09:46:42'),
('HD_63af286f-c000-4642-929a-5bf7e6265578', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', NULL, 100000.00, 'da_hoan_tien', 'momo', 'dat_coc', NULL, '4617087214', '2025-11-26 10:25:12', '2025-11-26 10:15:47', '2025-11-26 10:15:12'),
('HD_6978d4ba-9125-447f-a4a3-783e96fe6d1d', 'CH_a92e1bba-f810-40e3-8cd2-70e2f0ec0537', NULL, 100000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 10:27:56', '2025-11-24 10:09:01'),
('HD_745d5b69-2130-48a2-9776-1a282daf8cd2', 'CH_259d50de-0f19-4a55-a868-15f777313752', NULL, 80000.00, 'chua_thanh_toan', NULL, 'dich_vu', NULL, NULL, NULL, NULL, '2025-11-24 11:30:20'),
('HD_7a2394b2-1c4d-4f22-aa2a-4ee2e31f037b', 'CH_defdc026-aa0b-4235-81c8-f5cc3eaa5f56', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-26 10:15:14', NULL, '2025-11-26 10:05:14'),
('HD_8aa42f3a-f100-4e87-a6ab-20f07f45aad9', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', NULL, 60000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 10:28:00', '2025-11-24 10:00:37'),
('HD_91cfccd0-a380-4220-ac33-644b775fe14f', 'CH_4378e9d0-78be-4e7f-817e-c5bf4dd06b5e', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-27 13:56:19', NULL, '2025-11-26 13:56:19'),
('HD_97e5856c-5a12-496e-982d-222df32cca4d', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', NULL, 260000.00, 'da_thanh_toan', 'vi_dien_tu', 'dich_vu', NULL, NULL, NULL, '2025-11-02 21:23:37', '2025-10-18 05:12:12'),
('HD_a121748b-a2cd-4648-a956-973a45c4ddab', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', NULL, 100000.00, 'da_thanh_toan', 'momo', 'dat_coc', NULL, '4617086615', '2025-11-26 10:19:17', '2025-11-26 10:11:57', '2025-11-26 10:09:17'),
('HD_a5ef82ad-f2e5-4348-95af-c0239b72d7d7', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', NULL, 120000.00, 'da_thanh_toan', 'momo', 'dich_vu', NULL, '4617116971', NULL, '2025-11-26 10:20:15', '2025-11-24 10:45:45'),
('HD_a605f6fb-5940-46f1-9403-ca06deee1572', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', NULL, 80000.00, 'da_thanh_toan', 'momo', 'dich_vu', NULL, NULL, NULL, '2025-11-26 08:18:03', '2025-11-26 08:08:07'),
('HD_aa788631-3645-437b-98a8-22db5853f559', NULL, 'CH_2f8d0932-839d-422f-9da8-fe051ed9d6f5', 200000.00, 'da_thanh_toan', 'chuyen_khoan', 'dich_vu', NULL, NULL, NULL, '2025-11-10 10:19:08', '2025-11-03 09:30:23'),
('HD_aa89d476-d8f4-419b-a0dc-9e2e57a778d7', 'CH_bedcc300-ee67-4022-96b0-ffc35c2ca52d', NULL, 100000.00, 'da_thanh_toan', 'momo', 'dat_coc', NULL, '4617224953', '2025-11-27 14:06:03', '2025-11-26 14:06:36', '2025-11-26 14:06:03'),
('HD_b56a101f-5834-4bfc-860e-e0305d4aba4e', NULL, 'CH_02e9baa5-562e-4aaf-a572-23cf25d10ccf', 150000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 10:28:03', '2025-11-24 10:17:34'),
('HD_c1e4f6e4-216a-404c-8497-5a397f49d6e9', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', NULL, 260000.00, 'da_thanh_toan', 'tien_mat', 'dich_vu', NULL, NULL, NULL, '2025-11-24 09:54:27', '2025-10-04 13:31:45'),
('HD_caa2a2b9-379a-4a31-a89d-7991d0a3583d', 'CH_330c842a-b1e4-4e46-ab28-1064cae35535', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-27 14:01:39', NULL, '2025-11-26 14:01:39'),
('HD_e821744d-0991-4e18-bb2d-050122df713c', 'CH_91b92c19-e24c-409a-b616-01e91af1112a', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-26 10:07:14', NULL, '2025-11-26 09:57:14'),
('HD_e8a134b5-5162-47df-9e35-43782edb37c9', 'CH_09433868-c11a-4427-a7c6-7b577cf4d2d4', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-27 13:51:30', NULL, '2025-11-26 13:51:30'),
('HD_e9f298b2-5a9a-4c94-9bd8-91cde2a6ae6a', 'CH_bd0eab68-9187-45b6-806e-dcf2c2e6db98', NULL, 100000.00, 'da_huy', NULL, 'dat_coc', NULL, NULL, '2025-11-26 10:13:35', NULL, '2025-11-26 10:03:35'),
('HD_eef8c81f-a842-4ca3-ac80-5c128845fa0a', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', NULL, 100000.00, 'da_thanh_toan', 'momo', 'hoan_dat_coc', 'HD_1dbc32a3-2f03-4d97-b3fc-9546c73d3e3b', NULL, NULL, '2025-11-26 10:20:36', '2025-11-26 10:20:36'),
('HD_f6bf599b-eabd-47ab-ac49-4ce2de0c7356', NULL, 'CH_379d51bd-04f2-48e3-9d38-c4c616bf4754', 200000.00, 'da_thanh_toan', 'momo', 'dich_vu', NULL, '4617067894', NULL, '2025-11-26 10:19:18', '2025-11-24 10:28:49'),
('HD_fdbb7673-6fb9-402e-9cd7-93bc3a53543e', 'CH_9dad9fc6-0957-4939-962f-f4b8f8d2caab', NULL, 100000.00, 'da_thanh_toan', 'momo', 'dat_coc', NULL, '4619099859', '2025-11-30 02:33:42', '2025-11-29 02:34:24', '2025-11-29 02:33:42');

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

--
-- Đang đổ dữ liệu cho bảng `hosodinhduong`
--

INSERT INTO `hosodinhduong` (`id_ho_so`, `id_benh_nhan`, `id_chuyen_gia`, `ho_ten`, `so_dien_thoai`, `tuoi`, `gioi_tinh`, `dan_toc`, `ma_BHYT`, `dia_chi`, `ngay_tao`, `chieu_cao`, `can_nang`, `vong_eo`, `mo_co_the`, `khoi_co`, `nuoc_trong_co_the`) VALUES
('DD_072dad20-c096-426a-b3db-27d1e0e287af', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'TienManh', '0976543213', 37, 'Nữ', 'Kinh', 'BH3213213211', '654 Đường MNO, Quận 5, TP.HCM', '2025-11-02 20:08:28', 165.00, 50.00, 30.00, 50.00, 50.00, 70.00),
('DD_31644454-9b20-4cb3-a218-6255b95f4128', 'BN_5b123bbc-450d-40c6-9648-5d8566247692', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Huyên Tạ', '0912345678', 35, 'Nam', 'Kinh', 'BH3213213213', 'aaaaaa', '2025-11-24 10:16:50', 160.00, 50.00, 60.00, 10.00, 25.00, 70.00);

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
('KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'Nguyen Van A', '0912345678', 35, 'Nam', 'Kinh', 'BH3213213213', 'HCM', '2025-10-04 13:24:15'),
('KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'TienManh', '0976543213', 37, 'Nam', 'Kinh', 'BH3213247561', '35/06 TL02, Thạch Lộc, Quận 12, TP. Hồ Chí Minh', '2025-11-14 10:50:53'),
('KB_dc67f968-1196-4a22-8c52-a55eefa4a316', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'Trần Văn Minh', '0912345679', 43, 'Nam', 'Kinh', 'GD987654321', '654 Đường MNO, Quận 5, TP.HCM', '2025-10-31 02:57:15'),
('KB_f651240d-222a-431a-9da4-01d41f0edab3', 'BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Nguyễn Lê A', '0912345671', 20, 'Nữ', 'Kinh', 'BH3213213221', '35/06 TL02 Thạch Lộc, Quận 12, TP. Hồ Chí Minh', '2025-11-11 07:38:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ketquaxetnghiem`
--

CREATE TABLE `ketquaxetnghiem` (
  `id_ket_qua` varchar(50) NOT NULL,
  `id_chi_dinh` varchar(50) NOT NULL,
  `id_nhan_vien_xet_nghiem` varchar(50) DEFAULT NULL,
  `ket_qua_van_ban` text DEFAULT NULL,
  `trang_thai_ket_qua` enum('binh_thuong','bat_thuong','can_xem_lai') DEFAULT NULL,
  `ghi_chu_ket_qua` text DEFAULT NULL,
  `duong_dan_file_ket_qua` varchar(500) DEFAULT NULL,
  `thoi_gian_ket_luan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `ketquaxetnghiem`
--

INSERT INTO `ketquaxetnghiem` (`id_ket_qua`, `id_chi_dinh`, `id_nhan_vien_xet_nghiem`, `ket_qua_van_ban`, `trang_thai_ket_qua`, `ghi_chu_ket_qua`, `duong_dan_file_ket_qua`, `thoi_gian_ket_luan`) VALUES
('KQ_0c652dc5-6b8c-4aea-8935-ff04e451d2e5', 'CD_cb80f490-cd5b-44fd-9a36-8eb3bf86626b', 'NVXN_001', 'aaaa', 'binh_thuong', 'aaaa', 'aaaa', '2025-11-16 00:14:21'),
('KQ_7fb9e83c-098f-4acd-9e62-957289160fe5', 'CD_86360a70-d62c-4502-ac36-308da3e080ea', 'NVXN_001', 'jjjjjj', 'binh_thuong', 'jjjj', 'jjjjjj', '2025-11-16 00:13:19'),
('KQ_7ff18edc-2713-44c0-adef-d979c7abd0d0', 'CD_4199eaa4-e109-45be-8ffd-79c5cbc5c6e5', 'NVXN_001', 'bbbbbb', 'can_xem_lai', 'aaaaa', '', '2025-11-08 11:48:38'),
('KQ_d7821e23-7d33-4c7b-9c07-612f860cb63d', 'CD_269f9e04-ad0d-4794-a763-3c3e99441418', 'NVXN_001', 'aaaaa', 'binh_thuong', 'aaaaa', '', '2025-11-08 11:36:55');

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
('L_1761886032634-h7k62cafy', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', NULL, 'PK_h8i9j0k1-l2m3-4567-hijk-890123456789', '2025-10-04', 'Sang'),
('L_1761889661590-yg96d5xdx', 'NV_quay001', NULL, NULL, '2025-10-31', 'Sang'),
('L_1761889780901-ndt9hj7p1', 'BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'PK_d4e5f6g7-h8i9-0123-defg-456789012345', '2025-10-23', 'Chieu'),
('L_1761889887631-8w32h9slr', 'NV_quay001', NULL, NULL, '2025-10-16', 'Sang'),
('L_1761889905846-irr0diair', 'NV_quay001', NULL, NULL, '2025-10-30', 'Chieu'),
('L_1761889977257-jb4oxjfco', 'NV_phancong001', NULL, NULL, '2025-10-31', 'Sang'),
('L_1761890055176-hf5xu6pj5', 'NVQ_8a7956f7-01cf-4fbf-bb46-9330d4e8433f', NULL, NULL, '2025-10-31', 'Sang'),
('L_1761890471470-ev87ogf3s', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, '2025-10-31', 'Sang'),
('L_1761890700206-cgjuy68w1', 'BS_c3d4e5f6-g7h8-9012-cdef-345678901234', NULL, 'PK_f6g7h8i9-j0k1-2345-fghi-678901234567', '2025-10-04', 'Sang'),
('L_1761895778975-4vip171xj', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-04', 'Sang'),
('L_1762504819332-c2ljgi6im', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, '2025-11-04', 'Sang'),
('L_1762505184754-1cw2fup5g', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, '2025-11-07', 'Chieu'),
('L_1762774050308-lcvwqi7g7', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', NULL, 'PK_c3d4e5f6-g7h8-9012-cdef-345678901234', '2025-11-12', 'Sang'),
('L_1762844815862-dganrlk10', 'NV_phancong001', NULL, NULL, '2025-11-12', 'Chieu'),
('L_1762844834968-wwbdm6hkq', 'NV_quay001', NULL, NULL, '2025-11-13', 'Chieu'),
('L_1762917886628-dm2aqnfxw', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, '2025-11-13', 'Chieu'),
('L_1762917907166-lqr1mdk6i', 'CG_6289ae86-620a-4e40-8517-52e070e8acfb', NULL, NULL, '2025-11-12', 'Toi'),
('L_1762918475967-2yevc0uee', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', NULL, 'PK_c3d4e5f6-g7h8-9012-cdef-345678901234', '2025-11-12', 'Chieu'),
('L_1762918487002-fluh8r9im', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-13', 'Chieu'),
('L_1762918521843-ekhka462t', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-13', 'Sang'),
('L_1763273653724-r5jp3xpsw', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-17', 'Sang'),
('L_1763273676903-6iyfaykc3', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, NULL, '2025-11-17', 'Sang'),
('L_1763960396347-110au8jah', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-25', 'Sang'),
('L_1763962014010-o5bd9l05j', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', NULL, 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234564851', '2025-11-24', 'Sang'),
('L_1764144397367-gfu4b63na', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-27', 'Sang'),
('L_1764152073705-652muvfe8', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-12-06', 'Chieu'),
('L_1764383449768-5asag75lh', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-30', 'Sang'),
('L_1764383460335-cgumge039', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', NULL, 'PK_e5f6g7h8-i9j0-1234-efgh-567890123456', '2025-11-30', 'Chieu'),
('L_3436c298-20f6-4370-af5d-80a0114b0510', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-10-04', 'Sang'),
('L_4eb27707-5cff-4961-b1c6-4a4e44958d4b', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-10-03', 'Chieu'),
('L_a3531195-c5a2-45ff-823e-f5a93cffa22c', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', '2025-09-04', 'Sang'),
('L_ab7df124-5870-4a3f-9c47-381c67f27df5', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'NV_phancong001', 'PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-10-04', 'Chieu'),
('L_b1c2d3e4-f5g6-7890-abcd-ef1234567890', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'NV_phancong001', 'PK_c3d4e5f6-g7h8-9012-cdef-345678901234', '2025-10-04', 'Sang'),
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
('LSK_084686f9-a9b0-4526-946e-d5fd02e5521e', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', '2025-11-26 08:07:55', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'â', 'aaa', 'aa', NULL, 'aaaa', 'aaa', 'aaa'),
('LSK_0b9e6d99-8b1a-47dd-b845-a15120b25117', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', '2025-11-24 10:45:32', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aa', 'aa', 'aaa', NULL, 'aa', 'a', 'aa'),
('LSK_21a52d9b-79c2-4783-9d6f-d8d2ebff0c18', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', '2025-11-14 10:51:03', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aaaa', 'aaa', NULL, 'aaaa', 'aaaa', 'aaaa'),
('LSK_25dafa60-340e-4740-b7ef-8f51be63aa02', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', '2025-11-24 10:51:55', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaaaaa', 'aa', 'aa', NULL, 'aaa', 'aaaaaaaa', 'aaaa'),
('LSK_26ffa616-ca34-4992-af7c-2a8e31e4026e', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', '2025-11-24 10:00:21', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aa', 'aaa', 'aaa', NULL, 'aaa', 'aaa', 'aaa'),
('LSK_5b803f77-9dfd-4758-bde8-d690a9e6cd58', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', '2025-11-24 11:26:00', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'â', 'aaaa', 'â', NULL, 'aa', 'aaa', 'aa'),
('LSK_66295972-e6de-4080-92fc-bf1e3f390397', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', '2025-11-24 10:39:48', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aaa', 'aaaa', NULL, 'aaaa', 'aaa', 'aaaa'),
('LSK_790ff1dc-f721-4ca7-9b24-18cd300f6392', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'CH_259d50de-0f19-4a55-a868-15f777313752', '2025-11-24 11:30:01', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aa', 'aaa', 'aaa', NULL, 'aa', 'aaa', 'aa'),
('LSK_82c99395-a515-465a-b750-a32c22ebdb2f', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'KB_9f39bee5-6a86-4490-8dab-59a698dd880e', 'CH_629c1a1c-b05f-488f-9600-e65f53e38a9d', '2025-10-04 13:24:50', 'BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'AAAAA', 'AAAAAAAA', 'AAAAAAAA', NULL, 'AAAAAAAAA', 'AAAAAAAAA', 'AAAAAAAAAA'),
('LSK_87cb21a9-b1e3-434c-93f0-d1d556718808', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', '2025-11-24 04:30:00', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aa', 'aaaa', NULL, 'aaa', 'aaa', 'aaa'),
('LSK_9b6e5278-3d91-4559-aa06-8862e20225c8', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'KB_b2034fbe-89b6-43b9-a10f-5d2029187726', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', '2025-11-16 07:15:49', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aaa', 'aaa', NULL, 'aa', 'aaa', 'aaa'),
('LSK_b267ad87-1f6c-461e-9b89-032b7120b348', 'BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'KB_f651240d-222a-431a-9da4-01d41f0edab3', 'CH_a92e1bba-f810-40e3-8cd2-70e2f0ec0537', '2025-11-24 10:08:49', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'aaa', 'aaaa', 'aaa', NULL, 'aaaa', 'aaa', 'aaaaa'),
('LSK_d4cb4ee2-b215-4f78-8378-df5ab2ee26a1', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'KB_dc67f968-1196-4a22-8c52-a55eefa4a316', 'CH_4853c4ab-44a1-4fd6-a191-48587939ef57', '2025-10-31 03:39:24', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'aaaa', 'aaaa', 'aaaa', NULL, 'aaaa', 'aaaa', 'aaaaa');

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
  `ghi_chu` text DEFAULT NULL,
  `muc_tieu_dinh_duong` enum('giam_can','tang_can','tang_co','duy_tri','cai_thien_suc_khoe') DEFAULT NULL COMMENT 'Mục tiêu dinh dưỡng',
  `muc_do_hoat_dong` enum('it','trung_binh','nhieu','rat_nhieu') DEFAULT NULL COMMENT 'Mức độ hoạt động',
  `che_do_an` varchar(255) DEFAULT NULL COMMENT 'Chế độ ăn đặc biệt (keto, low carb, vegetarian...)',
  `di_ung_thuc_pham` text DEFAULT NULL COMMENT 'Danh sách dị ứng thực phẩm',
  `bmr` decimal(8,2) DEFAULT NULL COMMENT 'Basal Metabolic Rate - Tỷ lệ trao đổi chất cơ bản',
  `tdee` decimal(8,2) DEFAULT NULL COMMENT 'Total Daily Energy Expenditure - Tổng năng lượng tiêu hao hàng ngày',
  `protein_target` decimal(6,2) DEFAULT NULL COMMENT 'Mục tiêu protein (g/ngày)',
  `carb_target` decimal(6,2) DEFAULT NULL COMMENT 'Mục tiêu carbohydrate (g/ngày)',
  `fat_target` decimal(6,2) DEFAULT NULL COMMENT 'Mục tiêu chất béo (g/ngày)',
  `ngay_tai_kham` date DEFAULT NULL COMMENT 'Ngày tái khám tiếp theo',
  `mo_ta_muc_tieu` text DEFAULT NULL COMMENT 'Mô tả chi tiết mục tiêu dinh dưỡng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lịch sử tư vấn dinh dưỡng';

--
-- Đang đổ dữ liệu cho bảng `lichsutuvan`
--

INSERT INTO `lichsutuvan` (`id_lich_su`, `id_benh_nhan`, `id_ho_so`, `id_cuoc_hen`, `thoi_gian_tu_van`, `nguoi_tao`, `ket_qua_cls`, `ke_hoach_dinh_duong`, `nhu_cau_calo`, `sang`, `trua`, `chieu`, `toi`, `cham_soc`, `ghi_chu`, `muc_tieu_dinh_duong`, `muc_do_hoat_dong`, `che_do_an`, `di_ung_thuc_pham`, `bmr`, `tdee`, `protein_target`, `carb_target`, `fat_target`, `ngay_tai_kham`, `mo_ta_muc_tieu`) VALUES
('LSTV_4764b5a4-10f5-4919-82ee-38ffc81d42c0', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'DD_072dad20-c096-426a-b3db-27d1e0e287af', 'CH_2f8d0932-839d-422f-9da8-fe051ed9d6f5', '2025-11-03 02:30:09', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'aaaa', 'aaaa', '2000', NULL, NULL, NULL, NULL, 'aaaaaa', 'aaaaa', 'giam_can', 'it', 'Keto', 'aaa', 1185.25, 1422.30, 106.70, 124.50, 55.30, '2025-11-07', 'aaaa'),
('LSTV_57c8e516-9e81-4c5b-b17d-ff4409aa3230', 'BN_5b123bbc-450d-40c6-9648-5d8566247692', 'DD_31644454-9b20-4cb3-a218-6255b95f4128', 'CH_02e9baa5-562e-4aaf-a572-23cf25d10ccf', '2025-11-24 03:17:28', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'aaa', 'aaaa', '2000', NULL, NULL, NULL, NULL, 'aaa', 'aaaa', 'giam_can', 'it', 'Low Carb', 'aaaa', 1330.00, 1596.00, 119.70, 139.60, 62.10, '2025-11-28', 'aaa'),
('LSTV_c167d2b3-2514-4207-8de3-f86f764385b8', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'DD_072dad20-c096-426a-b3db-27d1e0e287af', 'CH_379d51bd-04f2-48e3-9d38-c4c616bf4754', '2025-11-24 03:28:44', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'aaa', 'aaa', '1500', NULL, NULL, NULL, NULL, 'aaaa', 'aaaaa', 'duy_tri', 'trung_binh', 'Low Carb', 'aaaa', 1185.25, 1629.72, 101.90, 183.30, 54.30, '2025-11-24', 'aaa');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_su_gui_email`
--

CREATE TABLE `lich_su_gui_email` (
  `id_lich_su` varchar(50) NOT NULL,
  `id_yeu_cau` varchar(50) DEFAULT NULL COMMENT 'ID yêu cầu liên quan (nếu có)',
  `email_nguoi_nhan` varchar(255) NOT NULL COMMENT 'Email người nhận',
  `tieu_de` varchar(500) NOT NULL COMMENT 'Tiêu đề email',
  `noi_dung` text NOT NULL COMMENT 'Nội dung email',
  `loai_email` enum('tin_tuc_y_te','tu_van','thong_bao','khac') DEFAULT 'tin_tuc_y_te' COMMENT 'Loại email',
  `trang_thai_gui` enum('cho_gui','dang_gui','thanh_cong','that_bai') DEFAULT 'cho_gui' COMMENT 'Trạng thái gửi',
  `loi_gui` text DEFAULT NULL COMMENT 'Lỗi khi gửi (nếu có)',
  `id_quan_tri_vien` varchar(50) NOT NULL COMMENT 'ID quản trị viên gửi',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `thoi_gian_gui` timestamp NULL DEFAULT NULL COMMENT 'Thời gian gửi thực tế'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng lịch sử gửi email';

--
-- Đang đổ dữ liệu cho bảng `lich_su_gui_email`
--

INSERT INTO `lich_su_gui_email` (`id_lich_su`, `id_yeu_cau`, `email_nguoi_nhan`, `tieu_de`, `noi_dung`, `loai_email`, `trang_thai_gui`, `loi_gui`, `id_quan_tri_vien`, `thoi_gian_tao`, `thoi_gian_gui`) VALUES
('LS_a559a66a-1afd-42c4-9d8f-84a971e1bd9f', 'YC_c10c5abf-b01a-44a6-8725-a8b30925ed50', 'tienmanh240503@gmail.com', 'Chào mừng đến với Bản tin Y tế!', '<p>Nguyễn Tiến Manh - 21123851</p><h1>Chào tất cả mọi người mình tên là Nguyễn Tiến Mạnh</h1>', 'tin_tuc_y_te', 'thanh_cong', NULL, 'ADMIN_001', '2025-11-05 09:40:57', '2025-11-05 02:40:57'),
('LS_f72b1421-d88b-4030-b93e-3e9533adaf38', 'YC_c10c5abf-b01a-44a6-8725-a8b30925ed50', 'tienmanh240503@gmail.com', 'Chào mừng đến với Bản tin Y tế!', '<p>aaaaaaaaaaaaaaaaaa</p>', 'tin_tuc_y_te', 'thanh_cong', NULL, 'ADMIN_001', '2025-11-02 19:30:35', '2025-11-02 12:30:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mon_an_tham_khao`
--

CREATE TABLE `mon_an_tham_khao` (
  `id_mon_an` varchar(50) NOT NULL,
  `ten_mon` varchar(255) NOT NULL COMMENT 'Tên món ăn',
  `loai_mon` enum('com','thit','ca','rau','trai_cay','do_uong','khac') DEFAULT 'khac' COMMENT 'Loại món ăn',
  `khoi_luong_chuan` decimal(6,2) DEFAULT 100.00 COMMENT 'Khối lượng chuẩn (g)',
  `calo` decimal(8,2) DEFAULT NULL COMMENT 'Calo/100g (kcal)',
  `protein` decimal(6,2) DEFAULT NULL COMMENT 'Protein/100g (g)',
  `carb` decimal(6,2) DEFAULT NULL COMMENT 'Carb/100g (g)',
  `fat` decimal(6,2) DEFAULT NULL COMMENT 'Fat/100g (g)',
  `fiber` decimal(6,2) DEFAULT NULL COMMENT 'Chất xơ/100g (g)',
  `mo_ta` text DEFAULT NULL COMMENT 'Mô tả món ăn',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Danh sách món ăn tham khảo với giá trị dinh dưỡng';

--
-- Đang đổ dữ liệu cho bảng `mon_an_tham_khao`
--

INSERT INTO `mon_an_tham_khao` (`id_mon_an`, `ten_mon`, `loai_mon`, `khoi_luong_chuan`, `calo`, `protein`, `carb`, `fat`, `fiber`, `mo_ta`, `thoi_gian_tao`) VALUES
('MA_001', 'Cơm trắng', 'com', 100.00, 130.00, 2.70, 28.00, 0.30, 0.40, 'Cơm trắng nấu chín', '2025-11-02 20:21:06'),
('MA_002', 'Thịt heo nạc', 'thit', 100.00, 143.00, 21.60, 0.00, 5.60, 0.00, 'Thịt heo nạc luộc', '2025-11-02 20:21:06'),
('MA_003', 'Thịt gà nạc', 'thit', 100.00, 165.00, 31.00, 0.00, 3.60, 0.00, 'Thịt gà nạc luộc/bỏ da', '2025-11-02 20:21:06'),
('MA_004', 'Thịt bò nạc', 'thit', 100.00, 250.00, 26.00, 0.00, 15.00, 0.00, 'Thịt bò nạc', '2025-11-02 20:21:06'),
('MA_005', 'Cá hồi', 'ca', 100.00, 208.00, 20.00, 0.00, 12.00, 0.00, 'Cá hồi nướng', '2025-11-02 20:21:06'),
('MA_006', 'Cá basa', 'ca', 100.00, 90.00, 18.00, 0.00, 1.50, 0.00, 'Cá basa nướng/luộc', '2025-11-02 20:21:06'),
('MA_007', 'Trứng gà', 'thit', 100.00, 155.00, 13.00, 1.10, 11.00, 0.00, 'Trứng gà (1 quả ~50g)', '2025-11-02 20:21:06'),
('MA_008', 'Rau muống', 'rau', 100.00, 25.00, 2.60, 3.90, 0.30, 2.70, 'Rau muống luộc', '2025-11-02 20:21:06'),
('MA_009', 'Rau cải xanh', 'rau', 100.00, 22.00, 2.80, 3.80, 0.40, 2.50, 'Rau cải xanh luộc', '2025-11-02 20:21:06'),
('MA_010', 'Chuối', 'trai_cay', 100.00, 89.00, 1.10, 23.00, 0.30, 2.60, 'Chuối chín', '2025-11-02 20:21:06'),
('MA_011', 'Táo', 'trai_cay', 100.00, 52.00, 0.30, 14.00, 0.20, 2.40, 'Táo tươi', '2025-11-02 20:21:06'),
('MA_012', 'Cam', 'trai_cay', 100.00, 47.00, 0.90, 12.00, 0.10, 2.40, 'Cam tươi', '2025-11-02 20:21:06'),
('MA_013', 'Bánh mì trắng', 'com', 100.00, 265.00, 9.00, 49.00, 3.20, 2.70, 'Bánh mì trắng', '2025-11-02 20:21:06'),
('MA_014', 'Sữa tươi không đường', 'do_uong', 100.00, 42.00, 3.30, 5.00, 1.00, 0.00, 'Sữa tươi không đường (100ml)', '2025-11-02 20:21:06'),
('MA_015', 'Yến mạch', 'com', 100.00, 389.00, 16.90, 66.00, 6.90, 10.60, 'Yến mạch khô', '2025-11-02 20:21:06');

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
  `google_id` varchar(255) DEFAULT NULL,
  `vai_tro` enum('benh_nhan','bac_si','chuyen_gia_dinh_duong','nhan_vien_quay','nhan_vien_phan_cong','nhan_vien_xet_nghiem','quan_tri_vien') NOT NULL,
  `trang_thai_hoat_dong` tinyint(1) DEFAULT 1,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `thoi_gian_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau`, `email`, `so_dien_thoai`, `ho_ten`, `ngay_sinh`, `gioi_tinh`, `so_cccd`, `dia_chi`, `anh_dai_dien`, `google_id`, `vai_tro`, `trang_thai_hoat_dong`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
('ADMIN_001', 'admin', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'admin@hospital.com', '0901234567', 'Nguyễn Văn Admin', '1985-10-05', 'Nam', '456789012346', '753 Đường NOP, Quận Gò Vấp, TP.HCM', 'https://example.com/admin/admin.jpg', NULL, 'quan_tri_vien', 1, '2025-10-01 17:00:00', '2025-11-08 19:24:55'),
('BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'tienmanh1111', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'tienmanh1111@example.com', '0976543213', 'TienManh', '1988-08-08', 'Nam', '2112364111', '35/06 TL02, Thạch Lộc, Quận 12, TP. Hồ Chí Minh', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1762165509/QLBN/NguoiDung/user_1762165507148.jpg', NULL, 'benh_nhan', 1, '2025-10-28 15:57:33', '2025-11-12 06:36:38'),
('BN_43ee82f9-b47d-4f7c-8cc7-03c3a79f72d7', 'abcdef', '$2b$10$NzkXbSIs7a50HRSN.DIx8ep4R.3icNCBf8Z1xY4rW2bAn5ZDpdA0.', 'tienmanh11118@gmail.com', '0906512694', 'Nguyen Van A', '2025-11-05', 'Nam', '2112385114', '123 Hai Bà Trưng', NULL, NULL, 'benh_nhan', 1, '2025-11-05 09:47:17', '2025-11-05 09:47:17'),
('BN_5b123bbc-450d-40c6-9648-5d8566247692', 'tahuynhconghuyen352000_439626', '$2b$10$/7xbwcLB92vmt4yU6ma3FOYqP8OvWsa6juLBN8pAITIge5OGxaagG', 'tahuynhconghuyen352000@gmail.com', NULL, 'Huyên Tạ', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIS-Q0pV3sDzTv2oIAn68pxzfpYvGgJs1HC96aYMQCCVa2Uuif3=s96-c', '113251853782607473744', 'benh_nhan', 1, '2025-11-16 07:00:39', '2025-11-16 07:00:39'),
('BN_63ff44ad-a567-41be-88ca-2a148a44772d', 'abc', '$2b$10$4nUTxuBmMLnrm7wXnplqUeTKKT/FyH0mXtLvb6CDqxo/zGgOM1ZDe', 'tienmanh4321@gmail.com', '0912345123', 'A B C', '2025-11-03', 'Nam', '2112385117', 'aaaaaa', NULL, NULL, 'benh_nhan', 1, '2025-11-03 11:29:02', '2025-11-03 11:29:02'),
('BN_6dba3874-ffd3-4233-b66a-c10f0d284f4a', 'hacduc88988_883517', '$2b$10$dYlSFIPlFQkYtc9Kqq2AJuxpR0MeEAFbOyRoipQwIK7/KpxiDSZCS', 'hacduc88988@gmail.com', NULL, 'Huỳnh Đức', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocIstu8iJ9XcfeAZzLmji_EyTIm62SPYFMtK_IuIgYsMzuI74RU=s96-c', '100709726100867913052', 'benh_nhan', 1, '2025-11-16 07:24:43', '2025-11-16 07:24:43'),
('BN_7c900d65-7564-4d2c-b83d-daca1ea63bd9', 'dinhthang', '$2b$10$lBEu0lSeeZ2fGPzzC/doxeBXVdvU83BBbfzZrDz3CMeLbSoQir/Fi', 'dinhthang@gmail.com', '', 'Nguyễn Đình Thắng', '2016-02-03', 'Nam', NULL, NULL, NULL, NULL, 'benh_nhan', 1, '2025-11-08 19:16:48', '2025-11-08 19:16:48'),
('BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'nguyenlea', '$2b$10$lLjKhmKE37eYxLCp9./swuAbk/ziVhDgpiiat59PbpXhXWhtATsje', 'tienmanh8888@gmail.com', '0912345671', 'Nguyễn Lê A', '2005-07-15', 'Nữ', '2112385111', '35/06 TL02 Thạch Lộc, Quận 12, TP. Hồ Chí Minh', NULL, NULL, 'benh_nhan', 1, '2025-10-31 20:01:25', '2025-10-31 21:23:50'),
('BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'nguyenvana', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'nguyenvana@example.com', '0912345678', 'Nguyễn Văn A', '1990-01-01', 'Nam', '123456789012', '123 Đường ABC, Quận 1, TP.HCM', 'https://i.pinimg.com/736x/4a/f3/6a/4af36a126e1ca3e0895c0a5a6672652e.jpg', NULL, 'benh_nhan', 1, '2025-09-29 07:46:00', '2025-10-31 02:54:00'),
('BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'tranminh', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'tranminh@gmail.com', '0912345679', 'Trần Văn Minh', '1982-03-15', 'Nam', '567890123456', '654 Đường MNO, Quận 5, TP.HCM', 'https://example.com/patients/tranminh.jpg', NULL, 'benh_nhan', 1, '2025-10-01 08:00:00', '2025-10-31 02:54:03'),
('BN_e46b6e2d-cb98-4803-8247-4ecc35f6ea87', 'huynhzducwr_676727', '$2b$10$fMbBQClWKAt3yFAlxfWdkO5cH8H3/aeYOiRzymEx7Zcbrj2fsu5AO', 'huynhzducwr@gmail.com', NULL, 'Đức Huỳnh', NULL, NULL, NULL, NULL, 'https://lh3.googleusercontent.com/a/ACg8ocKhEvCFg6Dn06yCF1v1BD3wmPTsLfor7PC6ympPcFukK-xcL_jU=s96-c', '104988452064492040585', 'benh_nhan', 1, '2025-11-16 06:31:16', '2025-11-16 06:31:16'),
('BN_ef4af6b3-d7d7-4675-b4be-42286aa8141c', 'nhanvien1', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'nhanvien1@example.com', '0385743421', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, NULL, 'benh_nhan', 1, '2025-10-30 10:57:58', '2025-10-31 02:54:06'),
('BN_f3g4h5i6-j7k8-9012-defg-567890123456', 'lehoa', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'lehoa@gmail.com', '0923456789', 'Lê Thị Hoa', '1995-07-20', 'Nữ', '678901234567', '987 Đường PQR, Quận 6, TP.HCM', 'https://example.com/patients/lehoa.jpg', NULL, 'benh_nhan', 1, '2025-10-01 09:00:00', '2025-10-31 02:55:34'),
('BN_g4h5i6j7-k8l9-0123-efgh-678901234567', 'phamduc', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'phamduc@gmail.com', '0934567890', 'Phạm Văn Đức', '2000-11-10', 'Nam', '789012345678', '147 Đường STU, Quận 7, TP.HCM', 'https://example.com/patients/phamduc.jpg', NULL, 'benh_nhan', 1, '2025-10-01 10:00:00', '2025-10-31 02:55:37'),
('BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'hoangmai', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'hoangmai@gmail.com', '0945678901', 'Hoàng Thị Mai', '1988-09-25', 'Nữ', '890123456789', '258 Đường VWX, Quận 8, TP.HCM', 'https://example.com/patients/hoangmai.jpg', NULL, 'benh_nhan', 1, '2025-10-01 11:00:00', '2025-11-02 18:17:55'),
('BS_32355766-35ee-4667-b1a8-eb796a9b0411', 'Anh Huy', '$2b$10$wc19KaqWwA/vCfhkAJGJzuM/IDDSmT4GlkKu0YmpAzzQmISuhy3jm', 'huy8x11@gmail.com', '0912344563', 'Huy Hoang', '2001-11-22', 'Nam', '2112383232', '654 Đường MNO, Quận 5, TP.HCM', 'https://lh3.googleusercontent.com/a/ACg8ocIITj4osEIgYxn1N_FNAB9AIGIBTRhjYXReyTeY9YBT2AtB-A=s96-c', '107505118364274746790', 'bac_si', 1, '2025-11-10 07:46:07', '2025-11-16 04:27:53'),
('BS_4c76881e-ca8e-4806-b742-ba7624765fca', 'tienmanh0167', '$2b$10$k11HfDBk7EnTyOTUD63xR./Du6/03fG4F91MOAOYYGmBulsw5IILC', 'tienmanh0167@gmail.com', '0906534693', 'Nguyễn Đình Thống', '2001-08-10', 'Nam', '2112385333', '654 Đường MNO, Quận 5, TP.HCM', 'https://lh3.googleusercontent.com/a/ACg8ocLCEjQk_7LmUZdHIGguqVEgWZP94xJnqkcGMGHoUxULUO4lKQ=s96-c', '101395080192633837970', 'bac_si', 1, '2025-11-08 19:32:19', '2025-11-16 06:04:44'),
('BS_5161a544-997b-4ff1-84ee-7659336016be', 'bacsi2', '$2b$10$PXWEHOYRS3/7vHC/r1Sbo.1nnGTqXz61dkGMuKgYEjVWWbcoJMhFS', 'bacsi2@example.com', '0385743426', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, NULL, 'bac_si', 1, '2025-10-30 11:03:24', '2025-10-30 11:03:24'),
('BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'dr.tienmanh', '$2b$10$swB5/y/4ewgv90wxrQJFdezBdKKTMxr5Qkr98WZ3sO3KsxwBs4WXu', 'dr.tienmanh@hospital.com', '0906513333', 'Nguyễn Tiến Mạnh', '1987-05-24', 'Nam', '234567890123', '456 Đường DEF, Quận 2, TP.HCM', 'https://example.com/doctors/dr-tienmanh.jpg', NULL, 'bac_si', 1, '2025-09-29 07:11:46', '2025-09-29 07:11:46'),
('BS_63ade75e-bbd3-4785-95a2-cd85c0840b08', 'dr.vanb', '$2b$10$huHw9u5bPjlK5GB48ZVwmeuBispbDdkop2Eap1./YZ0lvs0sfj1Ju', 'dr.vanb@hospital.com', '0911111111', 'Nguyễn Văn B', '1985-05-05', 'Nam', '345678901234', '789 Đường GHI, Quận 3, TP.HCM', 'https://hthaostudio.com/wp-content/uploads/2022/03/Anh-bac-si-nam-7-min.jpg.webp', NULL, 'bac_si', 1, '2025-09-29 07:52:32', '2025-10-04 11:59:24'),
('BS_93b37ee5-c8ca-49d9-9cf7-f3164ee6db27', 'chuyengia01', '$2b$10$pbP/JQVtL6oZOA3t2nqdGujoX5oXY4mcTukXWAju7qf2bl2ThKUem', 'tienmanh@example.com', '0976543211', 'TienManh', '1988-08-08', 'Nữ', NULL, NULL, NULL, NULL, 'bac_si', 1, '2025-10-28 15:52:34', '2025-10-28 15:52:34'),
('BS_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'dr.nhikhang', '$2b$10$mno345pqr678stu901vwx234yz567abc890def123ghi456jkl', 'dr.nhikhang@hospital.com', '0956789012', 'Nguyễn Thị Khang', '1983-12-12', 'Nữ', '901234567890', '369 Đường YZA, Quận 9, TP.HCM', 'https://example.com/doctors/dr-nhikhang.jpg', NULL, 'bac_si', 1, '2025-10-01 12:00:00', '2025-10-01 12:00:00'),
('BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'dr.sanphu', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'dr.sanphu@hospital.com', '0967890123', 'Trần Thị Lan', '1980-04-18', 'Nữ', '012345678901', '741 Đường BCD, Quận 10, TP.HCM', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1762848018/QLBN/NguoiDung/user_1762848013534.jpg', NULL, 'bac_si', 1, '2025-10-01 13:00:00', '2025-11-11 08:00:21'),
('BS_c3d4e5f6-g7h8-9012-cdef-345678901234', 'dr.thankinh', '$2b$10$stu901vwx234yz567abc890def123ghi456jkl789mno012pqr', 'dr.thankinh@hospital.com', '0978901234', 'Lê Văn Nam', '1975-08-30', 'Nam', '123456789013', '852 Đường EFG, Quận 11, TP.HCM', 'https://example.com/doctors/dr-thankinh.jpg', NULL, 'bac_si', 1, '2025-10-01 14:00:00', '2025-10-01 14:00:00'),
('BS_c76d606e-1664-4d60-92bb-929f65667587', 'tienmanh9999', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'tienmanh9999@example.com', '0385743420', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, NULL, 'bac_si', 1, '2025-10-30 03:05:20', '2025-10-30 03:05:20'),
('CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'namhuynh098', '$2b$10$FZBQVzrFXeYEGtI4fUtq0uw44os/pdzq/jVoBJR7zS5hjdS/W3XmG', 'namhuynh098@gmail.com', '0912345789', 'Hoài Nam', '2003-02-12', 'Nam', '21123857777', '654 Đường MNO, Quận 5, TP.HCM', NULL, NULL, 'chuyen_gia_dinh_duong', 1, '2025-11-08 19:40:20', '2025-11-08 19:40:20'),
('CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'chuyengiadinhduong', '$2b$10$wbIW7ZQ6r6r1GTqqu3ghJuNAeruvm34JaNhvUswbmk4aKAZHHKAIS', 'dr.vanc@hospital.com', '0976543210', 'Nguyễn Văn C', '1988-08-08', 'Nữ', '456789012345', '321 Đường JKL, Quận 4, TP.HCM', 'https://example.com/nutritionists/dr-vanc.jpg', NULL, 'chuyen_gia_dinh_duong', 1, '2025-09-29 07:52:44', '2025-11-02 19:56:30'),
('NVQ_8a7956f7-01cf-4fbf-bb46-9330d4e8433f', 'nhanvienquay1', '$2b$10$JtEOiyh7wYWWXkB6v2pPROYI.IJ6yqgNCv5EvDyEQKT8l1HeniinW', 'nhanvien2@example.com', '0385743422', 'TienManh', '1988-08-08', 'Nam', NULL, NULL, NULL, NULL, 'nhan_vien_quay', 1, '2025-10-30 10:58:49', '2025-11-03 10:44:14'),
('NVXN_001', 'nhanvienxetnghiem', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'nhanvienxetnghiem@hospital.com', '0901234568', 'Nguyễn Thị Lan', '1990-05-15', 'Nữ', '123456789018', '123 Đường ABC, Quận 1, TP.HCM', NULL, NULL, 'nhan_vien_xet_nghiem', 1, '2025-11-08 18:14:27', '2025-11-08 18:14:27'),
('NV_phancong001', 'nhanvienphancong', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'nhanvienphancong@hospital.com', '0990123456', 'Hoàng Văn Long', '2025-11-08', 'Nam', '345678901235', '159 Đường KLM, Quận Bình Thạnh, TP.HCM', 'https://example.com/staff/nhanvienphancong.jpg', NULL, 'nhan_vien_phan_cong', 1, '2025-10-01 16:00:00', '2025-11-08 15:53:02'),
('NV_quay001', 'nhanvienquay', '$2b$10$7tgue0ctq0Yj/oPpILu10.TofEalGvD39oASye.L6AqkkEne7jO52', 'nhanvienquay@hospital.com', '0989012345', 'Phạm Thị Quỳnh', '1992-06-14', 'Nữ', '234567890124', '963 Đường HIJ, Quận 12, TP.HCM', 'https://example.com/staff/nhanvienquay.jpg', NULL, 'nhan_vien_quay', 1, '2025-10-01 15:00:00', '2025-11-03 10:44:46');

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
-- Cấu trúc bảng cho bảng `nhanvienxetnghiem`
--

CREATE TABLE `nhanvienxetnghiem` (
  `id_nhan_vien` varchar(50) NOT NULL,
  `chuyen_mon` varchar(255) DEFAULT NULL COMMENT 'Chuyên môn xét nghiệm',
  `so_chung_chi_hang_nghe` varchar(100) DEFAULT NULL COMMENT 'Số chứng chỉ hành nghề',
  `linh_vuc_chuyen_sau` varchar(255) DEFAULT NULL COMMENT 'Lĩnh vực chuyên sâu',
  `so_nam_kinh_nghiem` int(11) DEFAULT NULL COMMENT 'Số năm kinh nghiệm',
  `dang_lam_viec` tinyint(1) DEFAULT 1 COMMENT 'Đang làm việc',
  `chuc_vu` varchar(100) DEFAULT NULL COMMENT 'Chức vụ',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `thoi_gian_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `nhanvienxetnghiem`
--

INSERT INTO `nhanvienxetnghiem` (`id_nhan_vien`, `chuyen_mon`, `so_chung_chi_hang_nghe`, `linh_vuc_chuyen_sau`, `so_nam_kinh_nghiem`, `dang_lam_viec`, `chuc_vu`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
('NVXN_001', 'Xét nghiệm', '10', 'Xét nghiệm máu', 5, 1, 'Xét nghiệm máu', '2025-11-08 18:15:24', '2025-11-08 18:15:24');

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
  `loai_phong` enum('phong_kham_bac_si','phong_tu_van_dinh_duong','phong_lam_viec','phong_xet_nghiem','phong_khac') DEFAULT 'phong_kham_bac_si',
  `id_chuyen_nganh` varchar(50) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('HoatDong','BaoTri','Ngung') DEFAULT 'HoatDong',
  `thiet_bi` text DEFAULT NULL,
  `so_cho_ngoi` int(11) DEFAULT NULL,
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phongkham`
--

INSERT INTO `phongkham` (`id_phong_kham`, `ten_phong`, `so_phong`, `tang`, `id_chuyen_khoa`, `loai_phong`, `id_chuyen_nganh`, `mo_ta`, `trang_thai`, `thiet_bi`, `so_cho_ngoi`, `thoi_gian_tao`) VALUES
('PK_a1b2c3d4-e5f6-7890-abcd-ef1234564851', 'Phòng chuyên gia dinh dưỡng thể thao', 'P125', 1, NULL, 'phong_tu_van_dinh_duong', 'CN_test234', 'aaaaaa', 'HoatDong', 'aaaa', 10, '2025-11-24 05:25:18'),
('PK_a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Phòng khám Tim mạch 1', 'P101', 1, 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'phong_kham_bac_si', NULL, 'Phòng khám chuyên khoa Tim mạch với đầy đủ thiết bị hiện đại', 'BaoTri', 'Máy siêu âm tim, Máy đo điện tim, Máy đo huyết áp', 20, '2025-10-01 08:00:00'),
('PK_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Phòng khám Tim mạch 2', 'P102', 1, 'CK_b3ef44c8-85d0-45e5-b6aa-0b647153cbe5', 'phong_kham_bac_si', NULL, 'Phòng khám Tim mạch dự phòng', 'HoatDong', 'Máy siêu âm tim, Máy đo điện tim', 15, '2025-10-01 08:00:00'),
('PK_c3d4e5f6-g7h8-9012-cdef-345678901234', 'Phòng khám Nội tiết', 'P201', 2, 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'phong_kham_bac_si', NULL, 'Phòng khám chuyên khoa Nội tiết', 'HoatDong', 'Máy đo đường huyết, Máy phân tích hormone, Cân điện tử', 18, '2025-10-01 08:00:00'),
('PK_d4e5f6g7-h8i9-0123-defg-456789012345', 'Phòng khám Nhi khoa', 'P301', 3, 'CK_cf23d4e6-8a9b-4c5d-9e1f-2b3c4d5e6f7a', 'phong_kham_bac_si', NULL, 'Phòng khám Nhi khoa với không gian thân thiện cho trẻ em', 'HoatDong', 'Máy theo dõi sức khỏe trẻ em, Đồ chơi, Ghế khám đặc biệt', 25, '2025-10-01 08:00:00'),
('PK_e5f6g7h8-i9j0-1234-efgh-567890123456', 'Phòng khám Sản phụ khoa', 'P401', 4, 'CK_e4f56g7h-9i0j-4k5l-0m1n-3o4p5q6r7s8t', 'phong_kham_bac_si', NULL, 'Phòng khám Sản phụ khoa với thiết bị siêu âm hiện đại', 'HoatDong', 'Máy siêu âm 4D, Phòng khám riêng tư, Giường khám', 12, '2025-10-01 08:00:00'),
('PK_f6g7h8i9-j0k1-2345-fghi-678901234567', 'Phòng khám Thần kinh', 'P501', 5, 'CK_g8h9i0j1-2k3l-4m5n-6o7p-8q9r0s1t2u3v', 'phong_kham_bac_si', NULL, 'Phòng khám chuyên khoa Thần kinh', 'BaoTri', 'Máy EEG, Máy đo lưu huyết não, Bộ dụng cụ khám thần kinh', 16, '2025-10-01 08:00:00'),
('PK_g7h8i9j0-k1l2-3456-ghij-789012345678', 'Phòng khám Tổng quát', 'P001', 1, NULL, 'phong_lam_viec', NULL, 'Phòng khám tổng quát cho các trường hợp chung', 'BaoTri', 'Máy đo huyết áp, Nhiệt kế, Đèn khám, Bộ dụng cụ y tế cơ bản', 30, '2025-10-01 08:00:00'),
('PK_h8i9j0k1-l2m3-4567-hijk-890123456789', 'Phòng khám Cấp cứu', 'P000', 1, 'CK_89a12b4f-6c8d-4e2a-9f1b-3d5e7a8b9c0d', 'phong_kham_bac_si', NULL, 'Phòng khám cấp cứu 24/7', 'Ngung', 'Máy thở, Máy sốc tim, Bộ dụng cụ cấp cứu, Giường bệnh', 10, '2025-10-01 08:00:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quan_tri_vien`
--

CREATE TABLE `quan_tri_vien` (
  `id_quan_tri_vien` varchar(50) NOT NULL,
  `chuc_vu` varchar(100) DEFAULT NULL COMMENT 'Chức vụ (VD: Quản trị viên cấp cao, Quản trị viên hệ thống)',
  `quyen_han` text DEFAULT NULL COMMENT 'Danh sách quyền hạn (JSON hoặc text)',
  `ghi_chu` text DEFAULT NULL COMMENT 'Ghi chú',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `thoi_gian_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng quản trị viên';

--
-- Đang đổ dữ liệu cho bảng `quan_tri_vien`
--

INSERT INTO `quan_tri_vien` (`id_quan_tri_vien`, `chuc_vu`, `quyen_han`, `ghi_chu`, `thoi_gian_tao`, `thoi_gian_cap_nhat`) VALUES
('ADMIN_001', 'Quản trị viên', 'Quản trị hệ thống', NULL, '2025-11-02 19:30:29', '2025-11-02 19:30:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theodoi_tien_do`
--

CREATE TABLE `theodoi_tien_do` (
  `id_theo_doi` varchar(50) NOT NULL,
  `id_benh_nhan` varchar(50) NOT NULL,
  `id_ho_so` varchar(50) DEFAULT NULL COMMENT 'Liên kết với hồ sơ dinh dưỡng',
  `id_lich_su` varchar(50) DEFAULT NULL COMMENT 'Liên kết với lịch sử tư vấn',
  `ngay_kham` date NOT NULL COMMENT 'Ngày theo dõi',
  `can_nang` decimal(5,2) DEFAULT NULL COMMENT 'Cân nặng (kg)',
  `chieu_cao` decimal(5,2) DEFAULT NULL COMMENT 'Chiều cao (cm)',
  `vong_eo` decimal(5,2) DEFAULT NULL COMMENT 'Vòng eo (cm)',
  `vong_nguc` decimal(5,2) DEFAULT NULL COMMENT 'Vòng ngực (cm)',
  `vong_dui` decimal(5,2) DEFAULT NULL COMMENT 'Vòng đùi (cm)',
  `mo_co_the` decimal(5,2) DEFAULT NULL COMMENT 'Mỡ cơ thể (%)',
  `khoi_co` decimal(5,2) DEFAULT NULL COMMENT 'Khối cơ (kg)',
  `nuoc_trong_co_the` decimal(5,2) DEFAULT NULL COMMENT 'Nước trong cơ thể (%)',
  `bmi` decimal(4,2) DEFAULT NULL COMMENT 'Chỉ số BMI',
  `ghi_chu` text DEFAULT NULL COMMENT 'Ghi chú',
  `nguoi_tao` varchar(50) DEFAULT NULL COMMENT 'Người ghi nhận',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Theo dõi tiến độ dinh dưỡng theo thời gian';

--
-- Đang đổ dữ liệu cho bảng `theodoi_tien_do`
--

INSERT INTO `theodoi_tien_do` (`id_theo_doi`, `id_benh_nhan`, `id_ho_so`, `id_lich_su`, `ngay_kham`, `can_nang`, `chieu_cao`, `vong_eo`, `vong_nguc`, `vong_dui`, `mo_co_the`, `khoi_co`, `nuoc_trong_co_the`, `bmi`, `ghi_chu`, `nguoi_tao`, `thoi_gian_tao`) VALUES
('TDT_27402120-af5f-4e47-bed3-6b0723274fed', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'DD_072dad20-c096-426a-b3db-27d1e0e287af', 'LSTV_4764b5a4-10f5-4919-82ee-38ffc81d42c0', '2025-11-12', 59.00, 165.00, 90.00, 60.00, 60.00, 14.00, 20.00, 70.00, 21.67, 'aaaaa', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', '2025-11-04 10:37:44'),
('TDT_2dce11a8-8cc2-4807-ad73-cf3f53f66f3b', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'DD_072dad20-c096-426a-b3db-27d1e0e287af', 'LSTV_4764b5a4-10f5-4919-82ee-38ffc81d42c0', '2025-11-29', 59.00, 167.00, 90.00, 60.00, 60.00, 12.00, 12.00, 78.00, 21.16, 'aaa', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', '2025-11-04 10:38:50'),
('TDT_9de741dc-4cc1-4e29-ae2a-ef96cacc667d', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'DD_072dad20-c096-426a-b3db-27d1e0e287af', NULL, '2025-11-03', 50.00, 165.00, 90.00, 64.00, 59.00, 20.00, 17.00, 75.00, 18.37, 'aaaaa', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', '2025-11-03 09:06:27');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thongbao`
--

CREATE TABLE `thongbao` (
  `id_thong_bao` varchar(50) NOT NULL,
  `id_nguoi_nhan` varchar(50) NOT NULL COMMENT 'ID người nhận thông báo',
  `tieu_de` varchar(255) NOT NULL COMMENT 'Tiêu đề thông báo',
  `noi_dung` text NOT NULL COMMENT 'Nội dung thông báo',
  `loai_thong_bao` enum('cuoc_hen','hoa_don','chat','he_thong','khac') DEFAULT 'he_thong' COMMENT 'Loại thông báo',
  `id_lien_ket` varchar(50) DEFAULT NULL COMMENT 'ID liên kết (id_cuoc_hen, id_hoa_don, etc.)',
  `trang_thai` enum('chua_doc','da_doc','da_xoa') DEFAULT 'chua_doc' COMMENT 'Trạng thái đọc',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `thoi_gian_doc` timestamp NULL DEFAULT NULL COMMENT 'Thời gian đọc'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng thông báo hệ thống';

--
-- Đang đổ dữ liệu cho bảng `thongbao`
--

INSERT INTO `thongbao` (`id_thong_bao`, `id_nguoi_nhan`, `tieu_de`, `noi_dung`, `loai_thong_bao`, `id_lien_ket`, `trang_thai`, `thoi_gian_tao`, `thoi_gian_doc`) VALUES
('TB_015db5b4-2dcc-47a2-b3ac-13e349f09939', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Hoàng Văn Long', 'có gì hú t nhe ', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'chua_doc', '2025-12-01 08:16:19', NULL),
('TB_11721bee-901e-40b5-af26-c9446ea5c794', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-27 với Trần Thị Lan', 'cuoc_hen', 'CH_2d9e3baf-89a6-4c1c-94b6-12ddbdda9865', 'chua_doc', '2025-11-26 08:07:33', NULL),
('TB_121cabf5-ec30-4f20-a1c8-413913b37016', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', 'chua_doc', '2025-11-24 10:52:17', NULL),
('TB_13d2af9e-7069-45b3-9c97-ab830b302b27', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 200.000 VNĐ', 'hoa_don', 'HD_aa788631-3645-437b-98a8-22db5853f559', 'da_doc', '2025-11-03 09:30:23', '2025-11-10 03:18:22'),
('TB_158ce7dc-cbae-4377-aa4e-83826997c22e', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-27', 'cuoc_hen', 'CH_defdc026-aa0b-4235-81c8-f5cc3eaa5f56', 'chua_doc', '2025-11-26 10:05:14', NULL),
('TB_17afb82e-6856-4e19-9a65-5e84ff78f9b1', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Mon Nov 17 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'chua_doc', '2025-11-24 04:30:50', NULL),
('TB_184c416c-3c44-4167-8e56-c220d2ea9110', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 100000.00 VNĐ', 'hoa_don', 'HD_366b4214-1536-436a-a26e-b2388fad8775', 'chua_doc', '2025-11-26 10:16:38', NULL),
('TB_184d3867-880d-4618-a005-3fafd6dc13be', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 100000.00 VNĐ', 'hoa_don', 'HD_eef8c81f-a842-4ca3-ac80-5c128845fa0a', 'chua_doc', '2025-11-26 10:20:36', NULL),
('TB_1a193ef5-3a3b-4db5-9440-350672ea1411', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', 'da_doc', '2025-11-26 10:11:57', '2025-11-26 03:12:58'),
('TB_1a9d61e6-aac9-4e4c-9d30-075e60dca897', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_1d6aa622-e519-4553-b898-babafd548247', 'chua_doc', '2025-11-26 14:00:43', NULL),
('TB_259ee188-adca-4e3b-9e6d-f9b19215cd0c', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_259d50de-0f19-4a55-a868-15f777313752', 'chua_doc', '2025-11-24 11:24:42', NULL),
('TB_26db45d0-5e73-4451-a893-97139ad97657', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', 'chua_doc', '2025-11-24 10:40:01', NULL),
('TB_29d938de-b927-49cb-88d4-97b9492234b3', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Trần Thị Lan', 'cuoc_hen', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', 'da_doc', '2025-11-16 06:16:53', '2025-11-23 20:30:33'),
('TB_29e31f2c-f468-4bba-849d-a16ad3d18186', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_330c842a-b1e4-4e46-ab28-1064cae35535', 'chua_doc', '2025-11-26 14:05:25', NULL),
('TB_2c556ee7-d402-4cc5-bab4-8242b65a7bdd', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Tin nhắn mới từ Trần Văn Minh', 'tôi có việc bận ạ ', 'chat', 'CTC_a3d19086-6981-4f1f-99cb-bc1bae460863', 'da_xoa', '2025-11-02 17:14:48', '2025-11-02 10:16:43'),
('TB_2e430ac0-3245-47f5-bd01-e96e9425391d', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 2.300.000 VNĐ', 'hoa_don', 'HD_424d1448-b7f9-4f8b-91e2-72c4615a2d11', 'da_doc', '2025-11-14 10:52:03', '2025-11-15 23:22:23'),
('TB_30514e83-c8a8-4749-a867-a18d94b2e122', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_91b92c19-e24c-409a-b616-01e91af1112a', 'chua_doc', '2025-11-26 10:03:08', NULL),
('TB_31510007-af79-4e74-997a-fa984ffc11ef', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Trần Thị Lan', 'cuoc_hen', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', 'chua_doc', '2025-11-16 06:16:53', NULL),
('TB_32529667-9ec7-4cec-85d6-8c14d7701ecc', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', 'chua_doc', '2025-11-24 10:52:17', NULL),
('TB_3441d840-fac1-4f5a-bee7-d6e5abfed4ee', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-27', 'cuoc_hen', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', 'chua_doc', '2025-11-26 10:09:17', NULL),
('TB_3a0b6bba-78a4-4d47-83d6-43563bf5ba86', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-13 với Trần Thị Lan', 'cuoc_hen', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', 'chua_doc', '2025-11-12 06:39:45', NULL),
('TB_41a768cd-6b85-43cc-8344-4cc2d1b81a72', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'chua_doc', '2025-11-26 10:17:55', NULL),
('TB_471f97f8-0235-4c74-a1dd-010f95dca402', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'chua_doc', '2025-11-26 10:20:36', NULL),
('TB_479da91a-6a9b-4abd-8900-ace122e81107', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_4378e9d0-78be-4e7f-817e-c5bf4dd06b5e', 'chua_doc', '2025-11-26 14:00:58', NULL),
('TB_490ba518-6a0f-4b6d-bdb4-e9cd55863ff2', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_09433868-c11a-4427-a7c6-7b577cf4d2d4', 'chua_doc', '2025-11-26 13:51:30', NULL),
('TB_493d807d-8880-4be9-b6f2-d8aa658d71d0', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', 'chua_doc', '2025-11-24 11:26:11', NULL),
('TB_4995419c-4a1b-4f23-b36d-66b141c1fab3', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', 'chua_doc', '2025-11-24 10:44:57', NULL),
('TB_4a7d3561-3e54-45dc-9ad5-165ade6e487a', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_259d50de-0f19-4a55-a868-15f777313752', 'chua_doc', '2025-11-24 11:24:42', NULL),
('TB_4ba00017-0164-499b-aeb8-8aaf82ef9266', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Tin nhắn mới từ Trần Thị Lan', 'Nguyen-Tien-Manh-CV.pdf', 'chat', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'chua_doc', '2025-11-16 07:17:29', NULL),
('TB_501b59dc-f20e-463b-a58c-bafee4d0d60d', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', 'chua_doc', '2025-11-24 10:39:28', NULL),
('TB_52d7f311-c8dd-4466-b75d-dcfdc6d5761e', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', 'chua_doc', '2025-11-24 11:24:24', NULL),
('TB_542e45c1-52d3-48fa-bd52-3bb25596f914', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', 'chua_doc', '2025-11-24 10:44:57', NULL),
('TB_5b2b64b1-5f37-4081-80e1-3634f5e08198', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 120.000 VNĐ', 'hoa_don', 'HD_a5ef82ad-f2e5-4348-95af-c0239b72d7d7', 'chua_doc', '2025-11-24 10:45:45', NULL),
('TB_5b402091-86e7-4de1-ad4f-b42c2d905a64', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_91b92c19-e24c-409a-b616-01e91af1112a', 'chua_doc', '2025-11-26 10:03:08', NULL),
('TB_5be3a89f-6bc7-4f68-9a2f-b0fec8e4a2f6', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_4378e9d0-78be-4e7f-817e-c5bf4dd06b5e', 'chua_doc', '2025-11-26 14:00:58', NULL),
('TB_5f3ec312-7a9e-4a6b-9e8a-16241246f458', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-12 với Hoài Nam', 'cuoc_hen', 'CH_7072fa4e-30d8-494b-9cd1-3dca2db46304', 'chua_doc', '2025-11-12 03:59:13', NULL),
('TB_62fa50ca-77d0-4414-b155-8b6d9b497155', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Hoàng Văn Long', 'gọi tý đi ', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'chua_doc', '2025-12-01 08:16:43', NULL),
('TB_63212010-9ce9-424f-953b-30800ccf9a96', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Trần Thị Lan', 'Khong có gì đâu nhe ', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'chua_doc', '2025-11-24 03:26:26', NULL),
('TB_63d3cdee-7783-4953-af86-56e6221c569c', 'ADMIN_001', 'Tin nhắn mới từ Phạm Thị Quỳnh', 'alo', 'chat', 'CTC_bbf8b18a-a213-4e14-a7f6-1e9b6efb68b2', 'chua_doc', '2025-11-03 10:47:27', NULL),
('TB_64b33701-bd74-4732-b667-84db9ca39871', 'BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Sat Nov 01 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_a92e1bba-f810-40e3-8cd2-70e2f0ec0537', 'chua_doc', '2025-11-24 10:09:01', NULL),
('TB_64cfd99a-6cf4-4939-aed1-ff23aeecbbc3', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', 'chua_doc', '2025-11-26 10:15:12', NULL),
('TB_6a318f67-4429-4f2e-baee-37c7cd16e38f', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 80.000 VNĐ', 'hoa_don', 'HD_a605f6fb-5940-46f1-9403-ca06deee1572', 'chua_doc', '2025-11-26 08:08:08', NULL),
('TB_6b444192-054c-44f9-bafe-48fc1b8f386a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'chua_doc', '2025-11-26 10:18:35', NULL),
('TB_6bcd9ac0-2254-4579-98a6-09ffb7851164', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-27', 'cuoc_hen', 'CH_89fdb566-0b4f-4a0f-b923-13112990f668', 'da_doc', '2025-11-26 09:46:42', '2025-11-26 02:47:46'),
('TB_6fd70f42-0030-4878-963d-94c07555774a', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Mon Nov 17 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', 'chua_doc', '2025-11-24 10:00:37', NULL),
('TB_6fd76e01-6668-42ba-8f70-0182da5933c7', 'NV_phancong001', 'Tin nhắn mới từ Nguyễn Văn C', 'ok nhe ', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'da_doc', '2025-12-01 08:16:35', '2025-12-01 01:17:15'),
('TB_72adc9a3-4fce-4c33-8eb7-83d0bdb633f5', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_4378e9d0-78be-4e7f-817e-c5bf4dd06b5e', 'chua_doc', '2025-11-26 13:56:19', NULL),
('TB_7402c839-4cee-40b8-b9f0-e4438c5d8f8d', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Mon Nov 17 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'chua_doc', '2025-11-24 04:30:50', NULL),
('TB_75aea9f2-33da-4c22-993e-3d770f3ed047', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', 'da_doc', '2025-11-26 10:15:47', '2025-11-26 03:16:08'),
('TB_75af0d85-db6c-4128-a1c8-e719d4e6ad17', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_bd0eab68-9187-45b6-806e-dcf2c2e6db98', 'chua_doc', '2025-11-26 10:04:56', NULL),
('TB_77aee8de-acb1-4ba1-8644-fad89835451d', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_defdc026-aa0b-4235-81c8-f5cc3eaa5f56', 'chua_doc', '2025-11-26 10:08:59', NULL),
('TB_79891196-dba8-4a70-8b51-8eee9ac93f87', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', 'chua_doc', '2025-11-24 10:50:56', NULL),
('TB_79d85b5c-ab44-4d4d-9f98-37f88572496c', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-24 với Nguyễn Văn C', 'cuoc_hen', 'CH_379d51bd-04f2-48e3-9d38-c4c616bf4754', 'chua_doc', '2025-11-24 10:15:01', NULL),
('TB_7cb446b4-2161-4e2f-8293-b9ec32774f36', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Nguyễn Văn C', 'cuoc_hen', 'CH_02e9baa5-562e-4aaf-a572-23cf25d10ccf', 'chua_doc', '2025-11-16 07:04:12', NULL),
('TB_825659d3-d7ab-425a-a3c8-8c24c4b4183f', 'NV_phancong001', 'Tin nhắn mới từ Nguyễn Văn C', 'DailyReport.docx', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'da_xoa', '2025-11-04 10:41:29', '2025-11-05 02:49:33'),
('TB_84d7eb00-178e-491f-9bed-8ec9f7b62107', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', 'chua_doc', '2025-11-24 10:45:45', NULL),
('TB_866bb935-4582-44cd-8c90-a6d602706588', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_bd0eab68-9187-45b6-806e-dcf2c2e6db98', 'chua_doc', '2025-11-26 10:04:56', NULL),
('TB_8882d231-6579-4e74-9bf4-86230eafe115', 'NV_phancong001', 'Tin nhắn mới từ Nguyễn Văn C', 'top-cac-mau-balo-saigon-swagger-ca-tinh-thu-hut-su-chu-y-tu-cac-ban-tre-01-1678948628.jpeg', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'da_xoa', '2025-11-04 10:41:04', '2025-11-05 02:49:41'),
('TB_8a0d7e6b-18e2-4889-a7fc-7cf0228b3739', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_1d6aa622-e519-4553-b898-babafd548247', 'chua_doc', '2025-11-26 14:00:43', NULL),
('TB_8ec3d1db-f78d-4788-8fb8-5379f5f2dab9', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-27', 'cuoc_hen', 'CH_bd0eab68-9187-45b6-806e-dcf2c2e6db98', 'chua_doc', '2025-11-26 10:03:36', NULL),
('TB_9294e4db-360a-4bb8-88e5-55951f1ced96', 'BN_5b123bbc-450d-40c6-9648-5d8566247692', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Nguyễn Văn C', 'cuoc_hen', 'CH_02e9baa5-562e-4aaf-a572-23cf25d10ccf', 'da_doc', '2025-11-16 07:04:12', '2025-11-16 00:04:46'),
('TB_92c2e94a-1ebb-43e0-9075-bad8f2fc1ca8', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-24 với Nguyễn Văn C', 'cuoc_hen', 'CH_379d51bd-04f2-48e3-9d38-c4c616bf4754', 'chua_doc', '2025-11-24 10:15:01', NULL),
('TB_954bf4c2-5e3b-4b99-a099-924388911297', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', 'chua_doc', '2025-11-26 08:08:08', NULL),
('TB_9dfd3ee4-6079-4cd7-8c30-7e147a24ea8a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Tin nhắn mới từ TienManh', 'chào ạ ', 'chat', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'da_doc', '2025-11-03 10:16:21', '2025-11-05 02:37:24'),
('TB_9ff7cc09-1d27-42e8-9b50-db60d0b1ed7c', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_09433868-c11a-4427-a7c6-7b577cf4d2d4', 'chua_doc', '2025-11-26 14:00:45', NULL),
('TB_a1375254-3e1d-493f-a88b-a6703c888f83', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', 'chua_doc', '2025-11-26 08:08:08', NULL),
('TB_a141e2ea-96ae-4395-a1f2-2baccb8d0441', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', 'chua_doc', '2025-11-24 10:40:01', NULL),
('TB_a222b62f-d4e6-41b4-8f04-ecba89cc73fa', 'CG_6289ae86-620a-4e40-8517-52e070e8acfb', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-12 với Hoài Nam', 'cuoc_hen', 'CH_7072fa4e-30d8-494b-9cd1-3dca2db46304', 'chua_doc', '2025-11-12 03:59:13', NULL),
('TB_a4ebf5bf-967e-48b2-897c-17eee3d77ed6', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_f7c917a1-f898-4559-bce0-af54d603c9de', 'chua_doc', '2025-11-24 10:50:56', NULL),
('TB_a4f1dbea-24a7-4180-b621-f55c635d0673', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', 'chua_doc', '2025-11-24 11:24:59', NULL),
('TB_a82da538-3d5c-4741-b537-7c8473947f76', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Trần Thị Lan', 'Thật ngại quá hôm nay tôi có việc bận mấy ', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'chua_doc', '2025-11-24 03:26:10', NULL),
('TB_a8ee3e2f-5ee1-4569-8533-61a3f5baed36', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Tin nhắn mới từ Trần Thị Lan', 'aothun1.jpg', 'chat', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'chua_doc', '2025-11-16 07:17:14', NULL),
('TB_a9053a59-009a-4974-b9f6-2f7e1e5c40c7', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', 'chua_doc', '2025-11-24 11:26:11', NULL),
('TB_aec29b29-cdd3-4a76-807e-4d90256c3c48', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 800.000 VNĐ', 'hoa_don', 'HD_33c5eec6-4290-4558-a1ce-2e9e2d363e2f', 'chua_doc', '2025-11-24 10:52:17', NULL),
('TB_b074f440-ef5d-44ec-b7ec-11f2f7799e9e', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_330c842a-b1e4-4e46-ab28-1064cae35535', 'chua_doc', '2025-11-26 14:01:39', NULL),
('TB_b18d2543-2967-42ed-a297-45c1444dccec', 'BN_9303ce6f-6ca8-4a17-9435-6b5e90a5144b', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 100.000 VNĐ', 'hoa_don', 'HD_6978d4ba-9125-447f-a4a3-783e96fe6d1d', 'chua_doc', '2025-11-24 10:09:01', NULL),
('TB_b31f7510-eb03-46f1-a67d-1ee239ff19f1', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 200.000 VNĐ', 'hoa_don', 'HD_f6bf599b-eabd-47ab-ac49-4ce2de0c7356', 'chua_doc', '2025-11-24 10:28:49', NULL),
('TB_b489243e-737d-4a00-b3e7-7070143449a8', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 1.500.000 VNĐ', 'hoa_don', 'HD_184dea47-cc72-4dad-bde5-d61160330b76', 'da_doc', '2025-11-24 04:30:50', '2025-11-24 00:06:24'),
('TB_b4ae80ac-a6e2-41f3-bd31-5ccacfc29656', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Trần Thị Lan', 'cuoc_hen', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'da_doc', '2025-11-16 06:40:42', '2025-11-15 23:49:43'),
('TB_b9f45205-8007-40f6-ac4c-994269330f70', 'NV_phancong001', 'Tin nhắn mới từ Nguyễn Văn C', 'gi m', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'da_xoa', '2025-11-04 10:40:18', '2025-11-05 02:49:24'),
('TB_bcb45e7a-222f-4281-8042-d71779534e10', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Hoàng Văn Long', 'gọi cái được không ', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'chua_doc', '2025-12-01 08:15:33', NULL),
('TB_bd064de5-2046-49eb-a192-ff18c476b020', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-30', 'cuoc_hen', 'CH_9dad9fc6-0957-4939-962f-f4b8f8d2caab', 'chua_doc', '2025-11-29 02:33:42', NULL),
('TB_be401c01-12a7-4a8b-935b-6a255f979b88', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', 'chua_doc', '2025-11-26 10:13:27', NULL),
('TB_bf0a3852-baed-4bf0-b119-31c3b9c6ed6e', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_259d50de-0f19-4a55-a868-15f777313752', 'chua_doc', '2025-11-24 11:30:20', NULL),
('TB_c06f6a36-bb04-465e-bc6c-d2e710f39fc1', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Tin nhắn mới từ Hoàng Văn Long', 'hi', 'chat', 'CTC_3efee32c-4702-4fb0-a5a3-4771d8d89a08', 'da_doc', '2025-11-08 15:42:57', '2025-11-08 09:10:13'),
('TB_c10657c5-f3d0-4ba1-ae48-ebf5d705a3a9', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sun Nov 30 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_9dad9fc6-0957-4939-962f-f4b8f8d2caab', 'chua_doc', '2025-11-29 02:34:24', NULL),
('TB_c1666447-bc81-4865-b502-c3eefedacf88', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Trần Thị Lan', 'ok nhe ', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'chua_doc', '2025-11-29 02:27:38', NULL),
('TB_c32c90cf-c73f-4591-a96c-6fdb335113a3', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Tin nhắn mới từ Nguyễn Văn C', 'ok để tôi suy nghĩ nhe ', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'da_doc', '2025-11-24 03:28:24', '2025-11-23 20:30:03'),
('TB_c422c4df-8001-4af4-8f31-f7550312a529', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-27 với Trần Thị Lan', 'cuoc_hen', 'CH_2d9e3baf-89a6-4c1c-94b6-12ddbdda9865', 'chua_doc', '2025-11-26 08:07:33', NULL),
('TB_c53ba2d7-b940-4f51-9bf0-537ceb39a603', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'da_doc', '2025-11-26 10:18:35', '2025-11-26 03:20:22'),
('TB_c661d9af-f49b-40d9-b2cf-3c0704b5cfa1', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', 'chua_doc', '2025-11-26 10:16:38', NULL),
('TB_c6e3a0d5-db24-47b6-aa23-3defc873ec6b', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_bedcc300-ee67-4022-96b0-ffc35c2ca52d', 'chua_doc', '2025-11-26 14:06:03', NULL),
('TB_c9324c69-4153-416c-bf32-0645fa08edca', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Mon Nov 17 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_4b12c2cf-10d7-483f-8483-7bf649134968', 'chua_doc', '2025-11-24 10:00:37', NULL),
('TB_cd96bc0d-0a15-417a-b4e0-9a1b7ae920ce', 'BS_5ad2c972-b614-41a3-9852-af4b9aef8685', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-12 với Nguyễn Tiến Mạnh', 'cuoc_hen', 'CH_b8c1c1cd-2680-42d5-8dcf-c5cdeea04ca0', 'chua_doc', '2025-11-10 11:29:16', NULL),
('TB_cea7efef-2d28-4edb-88e0-3b691c78dbf2', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Thu Nov 13 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', 'chua_doc', '2025-11-14 10:52:03', NULL),
('TB_d04efd90-b85c-4412-93df-4ea1d7a73d30', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_f3874b43-beba-4ac5-9527-8a067c703b78', 'chua_doc', '2025-11-24 11:24:59', NULL),
('TB_d08e0e0b-cb1e-4b44-8fcc-e306d0e7f3f2', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 80.000 VNĐ', 'hoa_don', 'HD_745d5b69-2130-48a2-9776-1a282daf8cd2', 'chua_doc', '2025-11-24 11:30:20', NULL),
('TB_d0e90fe4-f032-4b6f-b9b4-79e94c9411ba', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Thu Nov 13 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', 'da_doc', '2025-11-14 10:52:03', '2025-11-23 20:30:33'),
('TB_d283e3e4-d443-49a5-a7f6-ccc38e55c394', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_89fdb566-0b4f-4a0f-b923-13112990f668', 'da_doc', '2025-11-26 09:57:28', '2025-11-26 03:03:00'),
('TB_d38b6ac1-0c8d-42f2-905c-c8db0fa7f242', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_15d1507b-3ea3-431e-8e8f-e158dd0bffac', 'chua_doc', '2025-11-24 11:24:24', NULL),
('TB_d519e9b8-c569-4f9f-9fd5-68a75699de6e', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_ae9195d5-229f-43a8-b463-e777094f1eb6', 'chua_doc', '2025-11-24 10:45:45', NULL),
('TB_da531e59-e3bb-44ba-a580-2f4872f90e5b', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', 'chua_doc', '2025-11-26 10:13:27', NULL),
('TB_da5bf738-ecaa-45cc-8b7d-c9ea393a8ac7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_09433868-c11a-4427-a7c6-7b577cf4d2d4', 'chua_doc', '2025-11-26 14:00:45', NULL),
('TB_dcb94ad4-d1ba-45dd-856d-8fd43354eabd', 'BN_d14d07f0-60d8-4ab2-9d80-a4f0e9f80a26', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 200.000 VNĐ', 'hoa_don', 'HD_1faef6b6-96dc-4312-9df2-b981d2967ff3', 'chua_doc', '2025-11-24 11:26:11', NULL),
('TB_df01c736-e5c7-4189-924e-c82ac34c5249', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-11-27', 'cuoc_hen', 'CH_91b92c19-e24c-409a-b616-01e91af1112a', 'chua_doc', '2025-11-26 09:57:14', NULL),
('TB_e2eda216-5e32-4385-bc01-1e0d17c44b67', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_bedcc300-ee67-4022-96b0-ffc35c2ca52d', 'chua_doc', '2025-11-26 14:06:36', NULL),
('TB_e389d195-16ea-469c-8439-b2a9b307a94c', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Sat Nov 01 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_a92e1bba-f810-40e3-8cd2-70e2f0ec0537', 'chua_doc', '2025-11-24 10:09:01', NULL),
('TB_e3ede37f-14bf-4c82-a2e2-43d062c05087', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_bedcc300-ee67-4022-96b0-ffc35c2ca52d', 'chua_doc', '2025-11-26 14:06:36', NULL),
('TB_e7ac6a33-2266-4753-a326-94e635a3078c', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã hoàn thành', 'Cuộc hẹn của bạn vào ngày Tue Nov 25 2025 00:00:00 GMT+0700 (Indochina Time) đã hoàn thành', 'cuoc_hen', 'CH_259d50de-0f19-4a55-a868-15f777313752', 'chua_doc', '2025-11-24 11:30:20', NULL),
('TB_e966dacf-f0a5-4743-9572-e76fd89ac7fe', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-25 với Trần Thị Lan', 'cuoc_hen', 'CH_3bd800f8-372f-44ea-b8d3-d4a1e8232cb9', 'chua_doc', '2025-11-24 10:39:28', NULL),
('TB_e9c24ba4-8a52-44ee-a726-bdb0984501e9', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', 'chua_doc', '2025-11-26 10:16:38', NULL),
('TB_eae37b71-e02c-477e-bd71-889a6eecb2b6', 'BN_h5i6j7k8-l9m0-1234-fghi-789012345678', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-12 với Nguyễn Tiến Mạnh', 'cuoc_hen', 'CH_b8c1c1cd-2680-42d5-8dcf-c5cdeea04ca0', 'chua_doc', '2025-11-10 11:29:16', NULL),
('TB_eb8c879e-1610-43a9-8ec5-4a0899dc44c9', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_278e0925-456c-473f-8595-a175b3a1b43d', 'chua_doc', '2025-11-26 10:11:57', NULL),
('TB_edd803fa-5d8b-40de-8f21-108a549f6e4b', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 300.000 VNĐ', 'hoa_don', 'HD_2e4e77b9-f16d-4c8b-851e-c96294011bc1', 'chua_doc', '2025-11-24 10:40:01', NULL),
('TB_eed52126-22e7-4155-9ae1-5f886c850b58', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-17 với Trần Thị Lan', 'cuoc_hen', 'CH_27e062f8-3f55-4938-95f6-b900097e2e07', 'chua_doc', '2025-11-16 06:40:42', NULL),
('TB_f115bfce-8be5-4f11-96e2-40e8d8decf56', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sun Nov 30 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_9dad9fc6-0957-4939-962f-f4b8f8d2caab', 'chua_doc', '2025-11-29 02:34:24', NULL),
('TB_f14b245c-d969-4aac-af37-630bafd86f4c', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Thu Nov 27 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_defdc026-aa0b-4235-81c8-f5cc3eaa5f56', 'chua_doc', '2025-11-26 10:08:59', NULL),
('TB_f1ae3b5f-56c7-423f-bf5f-d441721d71c7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_34bbf0a5-d033-4840-bc59-228dab0fe3c7', 'chua_doc', '2025-11-26 10:20:36', NULL),
('TB_f1c0a4f7-b7b0-4053-8e92-8d4dd5d0510a', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'Tin nhắn mới từ Trần Thị Lan', 'Chào nha', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'chua_doc', '2025-11-24 03:25:03', NULL),
('TB_f5277025-ac12-4d49-a991-e4edd7b0094c', 'NV_phancong001', 'Tin nhắn mới từ Nguyễn Văn C', 'để suy nghĩ ', 'chat', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'da_doc', '2025-12-01 08:15:45', '2025-12-01 01:17:13'),
('TB_f5664146-ebd7-46d5-bcc3-851de4caac50', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) với Trần Thị Lan', 'cuoc_hen', 'CH_13a4269b-7802-4b84-8644-3521033be9eb', 'chua_doc', '2025-11-26 10:15:47', NULL),
('TB_f5ca5229-62e5-4fad-9c32-374aa2ab8cfd', 'BN_5b123bbc-450d-40c6-9648-5d8566247692', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 150.000 VNĐ', 'hoa_don', 'HD_b56a101f-5834-4bfc-860e-e0305d4aba4e', 'chua_doc', '2025-11-24 10:17:34', NULL),
('TB_f614c76a-2831-4de2-a76c-274a7c502066', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Hóa đơn mới', 'Bạn có hóa đơn mới với tổng tiền: 60.000 VNĐ', 'hoa_don', 'HD_8aa42f3a-f100-4e87-a6ab-20f07f45aad9', 'chua_doc', '2025-11-24 10:00:37', NULL),
('TB_f810c2bd-0ace-4cf9-b31a-8097fe1465c7', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đã bị hủy', 'Cuộc hẹn của bạn vào ngày Sat Dec 06 2025 00:00:00 GMT+0700 (Indochina Time) đã bị hủy', 'cuoc_hen', 'CH_330c842a-b1e4-4e46-ab28-1064cae35535', 'chua_doc', '2025-11-26 14:05:25', NULL),
('TB_f831ddd6-df45-4f67-8342-6a5f95740e56', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Tin nhắn mới từ Nguyễn Văn C', 'Hello', 'chat', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'da_doc', '2025-11-24 03:25:44', '2025-11-23 20:30:06'),
('TB_fb6d4ec6-6101-436c-8517-15f0c721efa0', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'Cuộc hẹn đang chờ thanh toán cọc', 'Vui lòng thanh toán tiền cọc để xác nhận cuộc hẹn ngày 2025-12-06', 'cuoc_hen', 'CH_1d6aa622-e519-4553-b898-babafd548247', 'chua_doc', '2025-11-26 13:43:47', NULL),
('TB_fec991f2-1af8-4468-90c5-deb46e073354', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'Cuộc hẹn mới đã được đặt', 'Bạn có cuộc hẹn mới vào ngày 2025-11-13 với Trần Thị Lan', 'cuoc_hen', 'CH_192f4eac-947b-462b-a064-dade9cffd1eb', 'da_doc', '2025-11-12 06:39:45', '2025-11-23 20:30:33');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thucdon_chi_tiet`
--

CREATE TABLE `thucdon_chi_tiet` (
  `id_thuc_don` varchar(50) NOT NULL,
  `id_lich_su` varchar(50) NOT NULL,
  `bua_an` enum('sang','trua','chieu','toi','phu') NOT NULL COMMENT 'Bữa ăn',
  `ten_mon` varchar(255) NOT NULL COMMENT 'Tên món ăn',
  `khoi_luong` decimal(6,2) DEFAULT NULL COMMENT 'Khối lượng (g)',
  `calo` decimal(8,2) DEFAULT NULL COMMENT 'Calo (kcal)',
  `protein` decimal(6,2) DEFAULT NULL COMMENT 'Protein (g)',
  `carb` decimal(6,2) DEFAULT NULL COMMENT 'Carbohydrate (g)',
  `fat` decimal(6,2) DEFAULT NULL COMMENT 'Chất béo (g)',
  `fiber` decimal(6,2) DEFAULT NULL COMMENT 'Chất xơ (g)',
  `ghi_chu` text DEFAULT NULL COMMENT 'Ghi chú về món ăn',
  `thoi_gian_an` time DEFAULT NULL COMMENT 'Thời gian ăn',
  `thu_tu` int(11) DEFAULT 0 COMMENT 'Thứ tự trong bữa ăn'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Chi tiết thực đơn từng bữa ăn';

--
-- Đang đổ dữ liệu cho bảng `thucdon_chi_tiet`
--

INSERT INTO `thucdon_chi_tiet` (`id_thuc_don`, `id_lich_su`, `bua_an`, `ten_mon`, `khoi_luong`, `calo`, `protein`, `carb`, `fat`, `fiber`, `ghi_chu`, `thoi_gian_an`, `thu_tu`) VALUES
('TDC_0a930efc-ac28-4d62-b03b-f1191c2c8864', 'LSTV_4764b5a4-10f5-4919-82ee-38ffc81d42c0', 'sang', 'Cơm trắng', 100.00, 130.00, 2.70, 28.00, 0.30, 0.40, 'aaaa', '07:00:00', 1);

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
  `id_tin_nhan` varchar(100) NOT NULL,
  `id_cuoc_tro_chuyen` varchar(100) NOT NULL,
  `id_nguoi_gui` varchar(50) NOT NULL,
  `loai_tin_nhan` varchar(20) DEFAULT 'van_ban',
  `noi_dung` text DEFAULT NULL,
  `duong_dan_tap_tin` text DEFAULT NULL,
  `thoi_gian_gui` datetime DEFAULT current_timestamp(),
  `da_doc` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tinnhan`
--

INSERT INTO `tinnhan` (`id_tin_nhan`, `id_cuoc_tro_chuyen`, `id_nguoi_gui`, `loai_tin_nhan`, `noi_dung`, `duong_dan_tap_tin`, `thoi_gian_gui`, `da_doc`) VALUES
('TN_017b2c85-e7dc-40a0-a266-f8dfd4c98594', 'CTC_27e45059-86aa-461b-b337-d1d8548da184', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'van_ban', 'alo', NULL, '2025-10-31 23:04:08', 1),
('TN_101a27ed-c0f2-4025-898e-a17a74fd07bd', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'van_ban', 'gi m', NULL, '2025-11-04 17:40:18', 1),
('TN_1803d8ff-59c6-4baa-ab07-408d0dc7fa0e', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'van_ban', 'gọi tý đi ', NULL, '2025-12-01 15:16:42', 1),
('TN_20226c06-4285-4670-8a60-479e1f1d5431', 'CTC_62a3df20-1ca9-48d2-b539-4ccc40be3700', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Chào anh', NULL, '2025-10-31 15:33:09', 1),
('TN_2776c01d-f7a6-41b0-9c98-edbc9445f9f0', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Chào nha', NULL, '2025-11-24 10:25:03', 1),
('TN_291aa621-453a-4be1-85fe-ee79fca5a809', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'hinh_anh', 'aothun1.jpg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1763277433/QLBN/Chat/chat_1763277431540_aothun1.jpg.jpg', '2025-11-16 14:17:14', 1),
('TN_31adc46d-b90f-4e8f-8b6c-a7352184a157', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'van_ban', 'ok nha ', NULL, '2025-10-31 16:28:03', 1),
('TN_32f6d367-163d-43e1-abb9-fd1d215096b2', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'tap_tin', 'Nguyen-Tien-Manh-CV.pdf', 'https://res.cloudinary.com/dh0lhvm9l/raw/upload/v1763277448/QLBN/Chat/chat_1763277445190_Nguyen-Tien-Manh-CV.pdf', '2025-11-16 14:17:29', 1),
('TN_3e160d92-5e51-48b2-8bfb-9373ed763058', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'alo', NULL, '2025-10-31 16:09:47', 1),
('TN_485c085d-80b7-4db1-a974-2df46cfb67fb', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'hi', NULL, '2025-10-31 16:27:03', 1),
('TN_49bb3fc7-ffd2-4a6a-beca-95c733e5b6c4', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'van_ban', 'ok để tôi suy nghĩ nhe ', NULL, '2025-11-24 10:28:24', 1),
('TN_4ac42f3b-429b-44b3-9feb-ae88963ae8ad', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'chao cau nha ', NULL, '2025-10-31 17:38:42', 1),
('TN_59c0b77b-7e9a-41e5-9b92-aecb984843de', 'CTC_bbf8b18a-a213-4e14-a7f6-1e9b6efb68b2', 'NV_quay001', 'van_ban', 'alo', NULL, '2025-11-03 17:47:27', 0),
('TN_5be2600e-ba29-4a11-a82d-6945436e0d2b', 'CTC_62a3df20-1ca9-48d2-b539-4ccc40be3700', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'hinh_anh', 'aothun1.jpg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1761899611/QLBN/Chat/chat_1761899607057_aothun1.jpg.jpg', '2025-10-31 15:33:31', 1),
('TN_5c77389f-28ab-4769-a655-b83c640ad24a', 'CTC_a3d19086-6981-4f1f-99cb-bc1bae460863', 'BN_e2f3g4h5-i6j7-8901-cdef-456789012345', 'van_ban', 'tôi có việc bận ạ ', NULL, '2025-11-03 00:14:48', 1),
('TN_5cee63bb-c275-4015-8c54-4be0bcaebc5c', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'ok nhe ', NULL, '2025-11-29 09:27:38', 1),
('TN_60e307f0-a58a-4efb-9cf7-8cd1176ccf7f', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'van_ban', 'ok nha ', NULL, '2025-10-31 23:08:15', 1),
('TN_6163030c-33fb-4c28-98a1-f0aa6d49a93b', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Alo nghe khong', NULL, '2025-10-31 16:26:39', 1),
('TN_653ab5ae-45fd-47fe-a313-624dbe2ff8a1', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'van_ban', 'gọi cái được không ', NULL, '2025-12-01 15:15:33', 1),
('TN_661b60b9-b1c3-4e1d-9b4e-acce631efa09', 'CTC_62a3df20-1ca9-48d2-b539-4ccc40be3700', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'alo anh bình gold ', NULL, '2025-10-31 15:41:03', 1),
('TN_74ddd2dc-0c7f-44d5-9484-adb518699e61', 'CTC_316abdce-a2d0-415c-97a2-d71abe7259ac', 'BN_2b417c16-1cc1-46b1-809c-47b9007f2554', 'van_ban', 'chào ạ ', NULL, '2025-11-03 17:16:21', 1),
('TN_74fb4058-698f-4f90-802e-65a174135ddf', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'tap_tin', 'hethongquanlybenhvien (1).sql', 'https://res.cloudinary.com/dh0lhvm9l/raw/upload/v1761904705/QLBN/Chat/chat_1761904703287_hethongquanlybenhvien__1_.sql', '2025-10-31 16:58:25', 1),
('TN_7dfd7e4b-c7f3-4b7a-925f-d4060fdddef2', 'CTC_62a3df20-1ca9-48d2-b539-4ccc40be3700', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'hinh_anh', 'aonhom2.jpg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1761900077/QLBN/Chat/chat_1761900072316_aonhom2.jpg.jpg', '2025-10-31 15:41:16', 1),
('TN_7e3266ba-1229-4d27-855d-cb5f89d8d58d', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'van_ban', 'Hello', NULL, '2025-11-24 10:25:44', 1),
('TN_894a4210-fbfc-4aaa-8e6e-83d8ce1d165d', 'CTC_a3d19086-6981-4f1f-99cb-bc1bae460863', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'thì ko biết tại sao hôm nay anh không tham gia buổi tái khám được ạ ', NULL, '2025-10-31 15:51:56', 1),
('TN_8c3b9ebd-066b-4f86-8bca-bf6730606104', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Khong có gì đâu nhe ', NULL, '2025-11-24 10:26:26', 1),
('TN_8dd1b286-99c8-49ae-9e95-d681ba471ab8', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'hinh_anh', 'top-cac-mau-balo-saigon-swagger-ca-tinh-thu-hut-su-chu-y-tu-cac-ban-tre-01-1678948628.jpeg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1762252864/QLBN/Chat/chat_1762252859791_top-cac-mau-balo-saigon-swagger-ca-tinh-thu-hut-su-chu-y-tu-cac-ban-tre-01-1678948628.jpeg.jpg', '2025-11-04 17:41:04', 1),
('TN_9029df42-f8ec-494c-92b5-1558344da0d4', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'van_ban', 'ok nhe ', NULL, '2025-12-01 15:16:35', 1),
('TN_93c43302-aed1-4cd0-8552-903238f311d7', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'hinh_anh', 'aonhom2.jpg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1761902894/QLBN/Chat/chat_1761902889245_aonhom2.jpg.jpg', '2025-10-31 16:28:14', 1),
('TN_94b610b8-13a1-466e-a018-b158443d13dd', 'CTC_22a5710d-95b3-4fef-9a5f-ca4bdbf4317a', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Thật ngại quá hôm nay tôi có việc bận mấy ', NULL, '2025-11-24 10:26:10', 1),
('TN_97571a25-2cb8-4eef-86f2-4f893c73819e', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'van_ban', 'chuc cau may man ', NULL, '2025-10-31 17:32:20', 1),
('TN_a4b255c4-2a2f-4274-8bc2-93eb3f9710a6', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'chieu di an khong', NULL, '2025-10-31 16:26:44', 1),
('TN_a99bc26e-b394-411d-a938-fbc1c27e97da', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'hinh_anh', 'aothun1.jpg', 'https://res.cloudinary.com/dh0lhvm9l/image/upload/v1761904689/QLBN/Chat/chat_1761904684577_aothun1.jpg.jpg', '2025-10-31 16:58:09', 1),
('TN_af349137-ca56-45de-9faa-150348e94d87', 'CTC_a3d19086-6981-4f1f-99cb-bc1bae460863', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', 'van_ban', 'Chào anh, hiện tại tôi thấy anh có lịch tái khám', NULL, '2025-10-31 15:51:22', 1),
('TN_b144c29d-e02b-463e-9cbc-ff29d81281f5', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'tap_tin', 'DailyReport.docx', 'https://res.cloudinary.com/dh0lhvm9l/raw/upload/v1762252889/QLBN/Chat/chat_1762252886449_DailyReport.docx', '2025-11-04 17:41:29', 1),
('TN_cc3750c9-0753-4d18-9ad9-945b21ee62ae', 'CTC_06bfdf30-f76e-4da8-ac52-2320612cc9c7', 'NV_phancong001', 'tap_tin', '1. XÃ¡c Äá»nh cÃ¡c yÃªu cáº§u chá»©c nÄng.docx', 'https://res.cloudinary.com/dh0lhvm9l/raw/upload/v1761904723/QLBN/Chat/chat_1761904719282_1._X__c______nh_c__c_y__u_c___u_ch___c_n__ng.docx', '2025-10-31 16:58:42', 1),
('TN_cdabc7be-ce2e-4c3b-b6f8-7c4623e121c4', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'CG_8156ad36-ddbb-4fff-9f49-a0f7ee83647d', 'van_ban', 'để suy nghĩ ', NULL, '2025-12-01 15:15:45', 1),
('TN_d63c22de-2ba8-4417-9fb7-568e323d8418', 'CTC_3efee32c-4702-4fb0-a5a3-4771d8d89a08', 'NV_phancong001', 'van_ban', 'hi', NULL, '2025-11-08 22:42:57', 1),
('TN_d8cfc4b5-4dea-4502-b3f8-0ccb57302dba', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'van_ban', 'Hi', NULL, '2025-10-31 22:50:34', 1),
('TN_f7951fff-1cbc-491e-9eb1-5fe424aaeec4', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'NV_phancong001', 'van_ban', 'có gì hú t nhe ', NULL, '2025-12-01 15:16:19', 1),
('TN_fd0821d3-addc-437f-97a4-c55ead87fb5a', 'CTC_611b0d0c-3936-4fe8-93a1-80dc9dc30c69', 'BS_c76d606e-1664-4d60-92bb-929f65667587', 'van_ban', 'hi', NULL, '2025-10-31 22:57:20', 1);

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
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `buoi_nghi` enum('sang','chieu','toi') DEFAULT NULL COMMENT 'Buổi nghỉ: sang (buổi sáng), chieu (buổi chiều), NULL (cả ngày)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `xinnghiphep`
--

INSERT INTO `xinnghiphep` (`id_xin_nghi`, `id_nguoi_dung`, `ngay_bat_dau`, `ngay_ket_thuc`, `ly_do`, `trang_thai`, `ngay_tao`, `buoi_nghi`) VALUES
('XN_39c5c25e-9978-45e1-a49d-da11c395d1b6', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-10-31', '2025-10-31', 'aaaaaaa', 'da_duyet', '2025-10-30 17:00:00', NULL),
('XN_8c33fd75-8214-4988-9bf6-38957a315bac', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-11-24', '2025-11-24', 'aaaaaaa\n', 'cho_duyet', '2025-11-23 17:00:00', 'sang'),
('XN_a34680eb-c478-46e2-a878-7e9e0dfa1994', 'BS_c76d606e-1664-4d60-92bb-929f65667587', '2025-11-03', '2025-11-05', 'aaaaaa', 'tu_choi', '2025-10-30 17:00:00', NULL),
('XN_b13acfe0-f191-42eb-9ad8-e8b9a8dd3ef6', 'BS_b2c3d4e5-f6g7-8901-bcde-f23456789012', '2025-11-16', '2025-11-16', 'aaaaaa', 'da_duyet', '2025-11-15 17:00:00', NULL),
('XN_f84052a7-d8a2-4223-8648-af367746d796', 'BS_c76d606e-1664-4d60-92bb-929f65667587', '2025-10-30', '2025-10-30', 'abcds', 'da_duyet', '2025-10-29 17:00:00', NULL);

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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `yeu_cau_email`
--

CREATE TABLE `yeu_cau_email` (
  `id_yeu_cau` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL COMMENT 'Email đăng ký',
  `ho_ten` varchar(255) DEFAULT NULL COMMENT 'Họ tên người đăng ký',
  `so_dien_thoai` varchar(20) DEFAULT NULL COMMENT 'Số điện thoại',
  `loai_yeu_cau` enum('dang_ky_nhan_tin_tuc','tu_van_y_te','thong_bao_hanh_chinh','khac') DEFAULT 'dang_ky_nhan_tin_tuc' COMMENT 'Loại yêu cầu',
  `trang_thai` enum('chua_xu_ly','dang_xu_ly','da_xu_ly','da_huy') DEFAULT 'chua_xu_ly' COMMENT 'Trạng thái xử lý',
  `ghi_chu` text DEFAULT NULL COMMENT 'Ghi chú của admin',
  `thoi_gian_tao` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `thoi_gian_xu_ly` timestamp NULL DEFAULT NULL COMMENT 'Thời gian xử lý',
  `id_quan_tri_vien` varchar(50) DEFAULT NULL COMMENT 'ID quản trị viên xử lý'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Bảng yêu cầu email';

--
-- Đang đổ dữ liệu cho bảng `yeu_cau_email`
--

INSERT INTO `yeu_cau_email` (`id_yeu_cau`, `email`, `ho_ten`, `so_dien_thoai`, `loai_yeu_cau`, `trang_thai`, `ghi_chu`, `thoi_gian_tao`, `thoi_gian_xu_ly`, `id_quan_tri_vien`) VALUES
('YC_42ecc4af-a6e1-4fd9-8e8a-6f26da103c8c', 'tienmanh0167@gmail.com', NULL, NULL, 'dang_ky_nhan_tin_tuc', 'chua_xu_ly', NULL, '2025-11-16 06:09:28', NULL, NULL),
('YC_6368abd2-6df7-4f3e-8518-a664edafaf01', 'namhuynh098@gmail.com', NULL, NULL, 'dang_ky_nhan_tin_tuc', 'da_xu_ly', NULL, '2025-11-02 19:54:54', '2025-11-05 02:40:11', 'ADMIN_001'),
('YC_89abdcab-a873-4ea8-92e4-caff8d98e441', 'huynhzducwr@gmail.com', NULL, NULL, 'dang_ky_nhan_tin_tuc', 'da_xu_ly', NULL, '2025-11-05 09:36:36', '2025-11-05 02:40:07', 'ADMIN_001'),
('YC_c10c5abf-b01a-44a6-8725-a8b30925ed50', 'tienmanh240503@gmail.com', NULL, NULL, 'dang_ky_nhan_tin_tuc', 'da_xu_ly', NULL, '2025-11-02 18:09:22', '2025-11-05 02:40:57', 'ADMIN_001');

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
-- Chỉ mục cho bảng `chuyengia_chuyennganhdinhduong`
--
ALTER TABLE `chuyengia_chuyennganhdinhduong`
  ADD PRIMARY KEY (`id_chuyen_gia`,`id_chuyen_nganh`),
  ADD KEY `id_chuyen_nganh` (`id_chuyen_nganh`);

--
-- Chỉ mục cho bảng `chuyenkhoa`
--
ALTER TABLE `chuyenkhoa`
  ADD PRIMARY KEY (`id_chuyen_khoa`),
  ADD UNIQUE KEY `ten_chuyen_khoa` (`ten_chuyen_khoa`);

--
-- Chỉ mục cho bảng `chuyennganhdinhduong`
--
ALTER TABLE `chuyennganhdinhduong`
  ADD PRIMARY KEY (`id_chuyen_nganh`);

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
  ADD KEY `id_benh_nhan` (`id_benh_nhan`),
  ADD KEY `id_bac_si` (`id_bac_si`),
  ADD KEY `id_chuyen_gia_dinh_duong` (`id_chuyen_gia_dinh_duong`);

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
  ADD UNIQUE KEY `id_chi_dinh` (`id_chi_dinh`),
  ADD KEY `idx_ketquaxetnghiem_nhanvien` (`id_nhan_vien_xet_nghiem`),
  ADD KEY `idx_ketquaxetnghiem_trangthai` (`trang_thai_ket_qua`);

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
  ADD KEY `fk_lichsutuvan_cuochen` (`id_cuoc_hen`),
  ADD KEY `idx_lichsu_muctieu` (`muc_tieu_dinh_duong`),
  ADD KEY `idx_lichsu_ngaytaikham` (`ngay_tai_kham`);

--
-- Chỉ mục cho bảng `lich_su_gui_email`
--
ALTER TABLE `lich_su_gui_email`
  ADD PRIMARY KEY (`id_lich_su`),
  ADD KEY `idx_email_nguoi_nhan` (`email_nguoi_nhan`),
  ADD KEY `idx_trang_thai_gui` (`trang_thai_gui`),
  ADD KEY `idx_thoi_gian_tao` (`thoi_gian_tao`),
  ADD KEY `idx_yeu_cau` (`id_yeu_cau`),
  ADD KEY `idx_quan_tri_vien` (`id_quan_tri_vien`);

--
-- Chỉ mục cho bảng `mon_an_tham_khao`
--
ALTER TABLE `mon_an_tham_khao`
  ADD PRIMARY KEY (`id_mon_an`),
  ADD KEY `idx_monan_loai` (`loai_mon`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id_nguoi_dung`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `so_cccd` (`so_cccd`),
  ADD UNIQUE KEY `unique_google_id` (`google_id`),
  ADD KEY `idx_google_id` (`google_id`);

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
-- Chỉ mục cho bảng `nhanvienxetnghiem`
--
ALTER TABLE `nhanvienxetnghiem`
  ADD PRIMARY KEY (`id_nhan_vien`);

--
-- Chỉ mục cho bảng `phongkham`
--
ALTER TABLE `phongkham`
  ADD PRIMARY KEY (`id_phong_kham`),
  ADD UNIQUE KEY `so_phong` (`so_phong`),
  ADD KEY `fk_phongkham_chuyenkhoa` (`id_chuyen_khoa`),
  ADD KEY `fk_phongkham_chuyennganh` (`id_chuyen_nganh`);

--
-- Chỉ mục cho bảng `quan_tri_vien`
--
ALTER TABLE `quan_tri_vien`
  ADD PRIMARY KEY (`id_quan_tri_vien`);

--
-- Chỉ mục cho bảng `theodoi_tien_do`
--
ALTER TABLE `theodoi_tien_do`
  ADD PRIMARY KEY (`id_theo_doi`),
  ADD KEY `fk_theodoi_benhnhan` (`id_benh_nhan`),
  ADD KEY `fk_theodoi_lichsu` (`id_lich_su`),
  ADD KEY `idx_theodoi_ngaykham` (`ngay_kham`),
  ADD KEY `idx_theodoi_hoso` (`id_ho_so`);

--
-- Chỉ mục cho bảng `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`id_thong_bao`),
  ADD KEY `idx_nguoi_nhan` (`id_nguoi_nhan`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_thoi_gian_tao` (`thoi_gian_tao`);

--
-- Chỉ mục cho bảng `thucdon_chi_tiet`
--
ALTER TABLE `thucdon_chi_tiet`
  ADD PRIMARY KEY (`id_thuc_don`),
  ADD KEY `fk_thucdon_lichsu` (`id_lich_su`),
  ADD KEY `idx_thucdon_buaan` (`bua_an`);

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
  ADD KEY `id_cuoc_tro_chuyen` (`id_cuoc_tro_chuyen`),
  ADD KEY `id_nguoi_gui` (`id_nguoi_gui`),
  ADD KEY `thoi_gian_gui` (`thoi_gian_gui`);

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
-- Chỉ mục cho bảng `yeu_cau_email`
--
ALTER TABLE `yeu_cau_email`
  ADD PRIMARY KEY (`id_yeu_cau`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_trang_thai` (`trang_thai`),
  ADD KEY `idx_thoi_gian_tao` (`thoi_gian_tao`),
  ADD KEY `idx_quan_tri_vien` (`id_quan_tri_vien`);

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
-- Các ràng buộc cho bảng `chuyengia_chuyennganhdinhduong`
--
ALTER TABLE `chuyengia_chuyennganhdinhduong`
  ADD CONSTRAINT `chuyengia_chuyennganhdinhduong_ibfk_1` FOREIGN KEY (`id_chuyen_gia`) REFERENCES `chuyengiadinhduong` (`id_chuyen_gia`),
  ADD CONSTRAINT `chuyengia_chuyennganhdinhduong_ibfk_2` FOREIGN KEY (`id_chuyen_nganh`) REFERENCES `chuyennganhdinhduong` (`id_chuyen_nganh`);

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
  ADD CONSTRAINT `fk_ketquaxetnghiem_chidinh` FOREIGN KEY (`id_chi_dinh`) REFERENCES `chidinhxetnghiem` (`id_chi_dinh`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ketquaxetnghiem_nhanvien` FOREIGN KEY (`id_nhan_vien_xet_nghiem`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE SET NULL;

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
-- Các ràng buộc cho bảng `lich_su_gui_email`
--
ALTER TABLE `lich_su_gui_email`
  ADD CONSTRAINT `fk_lich_su_quan_tri_vien` FOREIGN KEY (`id_quan_tri_vien`) REFERENCES `quan_tri_vien` (`id_quan_tri_vien`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_lich_su_yeu_cau` FOREIGN KEY (`id_yeu_cau`) REFERENCES `yeu_cau_email` (`id_yeu_cau`) ON DELETE SET NULL;

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
-- Các ràng buộc cho bảng `nhanvienxetnghiem`
--
ALTER TABLE `nhanvienxetnghiem`
  ADD CONSTRAINT `fk_nhanvienxetnghiem_nguoidung` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nguoidung` (`id_nguoi_dung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `phongkham`
--
ALTER TABLE `phongkham`
  ADD CONSTRAINT `fk_phongkham_chuyenkhoa` FOREIGN KEY (`id_chuyen_khoa`) REFERENCES `chuyenkhoa` (`id_chuyen_khoa`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `theodoi_tien_do`
--
ALTER TABLE `theodoi_tien_do`
  ADD CONSTRAINT `fk_theodoi_benhnhan` FOREIGN KEY (`id_benh_nhan`) REFERENCES `benhnhan` (`id_benh_nhan`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_theodoi_hosodinhduong` FOREIGN KEY (`id_ho_so`) REFERENCES `hosodinhduong` (`id_ho_so`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_theodoi_lichsu` FOREIGN KEY (`id_lich_su`) REFERENCES `lichsutuvan` (`id_lich_su`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `thucdon_chi_tiet`
--
ALTER TABLE `thucdon_chi_tiet`
  ADD CONSTRAINT `fk_thucdon_lichsu` FOREIGN KEY (`id_lich_su`) REFERENCES `lichsutuvan` (`id_lich_su`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `tinnhan`
--
ALTER TABLE `tinnhan`
  ADD CONSTRAINT `fk_tinnhan_cuoc_tro_chuyen` FOREIGN KEY (`id_cuoc_tro_chuyen`) REFERENCES `cuoctrochuyen` (`id_cuoc_tro_chuyen`) ON DELETE CASCADE;

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

--
-- Các ràng buộc cho bảng `yeu_cau_email`
--
ALTER TABLE `yeu_cau_email`
  ADD CONSTRAINT `fk_yeu_cau_quan_tri_vien` FOREIGN KEY (`id_quan_tri_vien`) REFERENCES `quan_tri_vien` (`id_quan_tri_vien`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
