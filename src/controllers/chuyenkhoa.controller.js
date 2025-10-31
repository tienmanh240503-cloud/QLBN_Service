import { ChuyenKhoa } from "../models/index.js";
import { v4 as uuidv4 } from 'uuid';
import cloudinary from "../configs/cloudinary.config.js";

// Tạo chuyên khoa mới
export const createChuyenKhoa = async (req, res) => {
    try {
        const { ten_chuyen_khoa, mo_ta, thiet_bi, thoi_gian_hoat_dong } = req.body;
        const file = req.file;
        
        if (!ten_chuyen_khoa) {
            return res.status(400).json({ success: false, message: "Tên chuyên khoa là bắt buộc." });
        }
        
        // Kiểm tra trùng tên
        const existing = await ChuyenKhoa.findOne({ ten_chuyen_khoa });
        if (existing) {
            return res.status(409).json({ success: false, message: "Chuyên khoa đã tồn tại." });
        }

        const Id = `CK_${uuidv4()}`;
        
        let imageUrl;
        if (file) {
            try {
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

                imageUrl = result.secure_url;
            } catch (uploadError) {
                console.error("Lỗi upload hình ảnh chuyên khoa:", uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Lỗi khi upload hình ảnh", 
                    error: uploadError.message 
                });
            }
        }

        const ck = await ChuyenKhoa.create({
            id_chuyen_khoa : Id,
            ten_chuyen_khoa,
            mo_ta,
            hinh_anh: imageUrl,
            thiet_bi,
            thoi_gian_hoat_dong
        });

        return res.status(201).json({ 
            success: true, 
            message: "Thêm chuyên khoa thành công", 
            data: ck 
        });
    } catch (error) {
        console.error("Lỗi tạo chuyên khoa:", error);
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


// Lấy danh sách chuyên khoa
export const getAllChuyenKhoa = async (req, res) => {
    try {
        const cks = await ChuyenKhoa.getAll();
        return res.status(200).json({ success: true, data: cks });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 chuyên khoa theo id
export const getChuyenKhoaById = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });
        return res.status(200).json({ success: true, data: ck });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};

// Cập nhật chuyên khoa
export const updateChuyenKhoa = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Không có dữ liệu để cập nhật" });
        }

        const updateCK = await ChuyenKhoa.update(
            req.body,
            id_chuyen_khoa
        );
        return res.status(200).json({ success: true, message: "Cập nhật thành công", data: updateCK });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


// Xóa chuyên khoa
export const deleteChuyenKhoa = async (req, res) => {
    try {
        const { id_chuyen_khoa } = req.params;
        const ck = await ChuyenKhoa.getById(id_chuyen_khoa);
        if (!ck) return res.status(404).json({ success: false, message: "Không tìm thấy chuyên khoa" });
        await ChuyenKhoa.delete(id_chuyen_khoa);
        return res.status(200).json({ success: true, message: "Xóa chuyên khoa thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};
