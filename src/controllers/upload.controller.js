import cloudinary from "../configs/cloudinary.config.js";
import { NguoiDung, ChuyenKhoa } from "../models/index.js";

// Upload hình ảnh cho người dùng
export const uploadUserImage = async (req, res) => {
    try {
        const file = req.file;
        const id_nguoi_dung = req.decoded.info.id_nguoi_dung;
        
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng chọn một tập tin hình ảnh" 
            });
        }

        // Chuyển đổi buffer thành base64
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const fileName = `user_${Date.now()}`;

        // Upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
                folder: "QLBN/NguoiDung"
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Cập nhật anh_dai_dien trong database
        await NguoiDung.update({ anh_dai_dien: result.secure_url }, id_nguoi_dung);

        res.status(200).json({
            success: true,
            message: "Upload hình ảnh thành công",
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                fileName: fileName
            }
        });

    } catch (error) {
        console.error("Lỗi upload hình ảnh người dùng:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi upload hình ảnh"
        });
    }
};

// Upload hình ảnh cho chuyên khoa
export const uploadChuyenKhoaImage = async (req, res) => {
    try {
        const file = req.file;
        const { id_chuyen_khoa } = req.body; // ID chuyên khoa từ body
        
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng chọn một tập tin hình ảnh" 
            });
        }

        if (!id_chuyen_khoa) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu ID chuyên khoa" 
            });
        }

        // Chuyển đổi buffer thành base64
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const fileName = `chuyenkhoa_${Date.now()}`;

        // Upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
                folder: "QLBN/ChuyenKhoa"
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        // Cập nhật hinh_anh trong database
        await ChuyenKhoa.update({ hinh_anh: result.secure_url }, id_chuyen_khoa);

        res.status(200).json({
            success: true,
            message: "Upload hình ảnh thành công",
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                fileName: fileName
            }
        });

    } catch (error) {
        console.error("Lỗi upload hình ảnh chuyên khoa:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi upload hình ảnh"
        });
    }
};

// Upload hình ảnh tổng quát
export const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        const { folder } = req.body; // folder tùy chọn
        
        if (!file) {
            return res.status(400).json({ 
                success: false, 
                message: "Vui lòng chọn một tập tin hình ảnh" 
            });
        }

        // Chuyển đổi buffer thành base64
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const fileName = `image_${Date.now()}`;
        const uploadFolder = folder || "QLBN/General";

        // Upload lên Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(dataUrl, {
                public_id: fileName,
                resource_type: 'auto',
                folder: uploadFolder
            }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        res.status(200).json({
            success: true,
            message: "Upload hình ảnh thành công",
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                fileName: fileName,
                folder: uploadFolder
            }
        });

    } catch (error) {
        console.error("Lỗi upload hình ảnh:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi upload hình ảnh"
        });
    }
};

// Xóa hình ảnh từ Cloudinary
export const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.params;
        
        if (!publicId) {
            return res.status(400).json({ 
                success: false, 
                message: "Thiếu public ID của hình ảnh" 
            });
        }

        // Xóa từ Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        res.status(200).json({
            success: true,
            message: "Xóa hình ảnh thành công",
            data: result
        });

    } catch (error) {
        console.error("Lỗi xóa hình ảnh:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa hình ảnh"
        });
    }
};
