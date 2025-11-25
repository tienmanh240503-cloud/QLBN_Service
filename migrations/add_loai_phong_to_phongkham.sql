-- Migration: Thêm trường loai_phong và id_chuyen_nganh vào bảng phongkham
-- Mục đích: Hỗ trợ phòng khám cho nhiều loại role (bác sĩ, chuyên gia dinh dưỡng, nhân viên)

-- Thêm trường loai_phong để phân loại phòng
ALTER TABLE `phongkham` 
ADD COLUMN `loai_phong` ENUM('phong_kham_bac_si', 'phong_tu_van_dinh_duong', 'phong_lam_viec', 'phong_xet_nghiem', 'phong_khac') 
DEFAULT 'phong_kham_bac_si' 
AFTER `id_chuyen_khoa`;

-- Thêm trường id_chuyen_nganh để liên kết với chuyên ngành dinh dưỡng
ALTER TABLE `phongkham` 
ADD COLUMN `id_chuyen_nganh` VARCHAR(50) DEFAULT NULL 
AFTER `loai_phong`;

-- Thêm index cho id_chuyen_nganh
ALTER TABLE `phongkham` 
ADD KEY `fk_phongkham_chuyennganh` (`id_chuyen_nganh`);

-- Thêm foreign key constraint (nếu bảng chuyennganhdinhduong tồn tại)
-- ALTER TABLE `phongkham` 
-- ADD CONSTRAINT `fk_phongkham_chuyennganh` 
-- FOREIGN KEY (`id_chuyen_nganh`) REFERENCES `chuyennganhdinhduong` (`id_chuyen_nganh`) 
-- ON DELETE SET NULL;

-- Cập nhật các phòng khám hiện tại: nếu có id_chuyen_khoa thì loai_phong = 'phong_kham_bac_si'
UPDATE `phongkham` 
SET `loai_phong` = 'phong_kham_bac_si' 
WHERE `id_chuyen_khoa` IS NOT NULL;

-- Cập nhật các phòng khám không có id_chuyen_khoa thành phòng làm việc chung
UPDATE `phongkham` 
SET `loai_phong` = 'phong_lam_viec' 
WHERE `id_chuyen_khoa` IS NULL;

