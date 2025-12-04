import multer from "multer";

// Cấu hình Multer để lưu file vào RAM cho chat
const storage = multer.memoryStorage();

// Tạo uploader middleware cho chat - hỗ trợ cả hình ảnh và file tài liệu
const chatUploader = multer({ 
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024, // Giới hạn 30MB cho file chat
    },
    fileFilter: (req, file, cb) => {
        // Cho phép tất cả các loại file (hình ảnh, PDF, Word, Excel, v.v.)
        cb(null, true);
    }
});

export default chatUploader;

