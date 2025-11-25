-- Migration: Thêm trường buoi_nghi vào bảng xinnghiphep
-- Cho phép xin nghỉ nửa ngày (buổi sáng, buổi chiều hoặc buổi tối)

ALTER TABLE `xinnghiphep` 
ADD COLUMN `buoi_nghi` ENUM('sang', 'chieu', 'toi') DEFAULT NULL COMMENT 'Buổi nghỉ: sang (buổi sáng), chieu (buổi chiều), toi (buổi tối), NULL (cả ngày)';

