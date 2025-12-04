-- Tạo bảng lichsucuocgoi để lưu lịch sử cuộc gọi
CREATE TABLE IF NOT EXISTS `lichsucuocgoi` (
  `id_cuoc_goi` varchar(50) NOT NULL,
  `id_cuoc_tro_chuyen` varchar(50) NOT NULL,
  `nguoi_khoi_tao` varchar(50) NOT NULL,
  `nguoi_nhan_du_kien` varchar(50) DEFAULT NULL,
  `nguoi_nhan_thuc_te` varchar(50) DEFAULT NULL,
  `trang_thai` enum('dang_goi','dang_noi','bi_tu_choi','bi_huy','hoan_thanh','that_bai') NOT NULL DEFAULT 'dang_goi',
  `thoi_gian_khoi_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `thoi_gian_ket_thuc` timestamp NULL DEFAULT NULL,
  `ly_do_ket_thuc` text DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  PRIMARY KEY (`id_cuoc_goi`),
  KEY `idx_cuoc_tro_chuyen` (`id_cuoc_tro_chuyen`),
  KEY `idx_nguoi_khoi_tao` (`nguoi_khoi_tao`),
  KEY `idx_trang_thai` (`trang_thai`),
  KEY `idx_thoi_gian_khoi_tao` (`thoi_gian_khoi_tao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='Lịch sử cuộc gọi video/voice';

