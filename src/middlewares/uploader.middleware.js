import multer from "multer";

// Cấu hình Multer để lưu file vào RAM
const storage = multer.memoryStorage();

// Tạo uploader middleware
const uploader = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra loại file
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload file hình ảnh!'), false);
        }
    }
});

export default uploader;
