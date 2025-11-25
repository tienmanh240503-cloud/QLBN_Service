import multer from "multer";

// Cấu hình Multer để lưu file vào RAM cho file upload
const storage = multer.memoryStorage();

// Tạo uploader middleware cho file - hỗ trợ tất cả các loại file
const fileUploader = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Giới hạn 10MB
    },
    fileFilter: (req, file, cb) => {
        // Cho phép tất cả các loại file (hình ảnh, PDF, Word, Excel, v.v.)
        cb(null, true);
    }
});

export default fileUploader;

