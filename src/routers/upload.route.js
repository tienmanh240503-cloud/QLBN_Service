import express from "express";
import {
    uploadUserImage,
    uploadChuyenKhoaImage,
    uploadImage,
    deleteImage
} from "../controllers/upload.controller.js";
import { verify } from "../middlewares/verifyToken.middleware.js";
import uploader from "../middlewares/uploader.middleware.js";

const router = express.Router();

// Upload hình ảnh cho người dùng
router.post("/user", verify, uploader.single("image"), uploadUserImage);

// Upload hình ảnh cho chuyên khoa
router.post("/chuyenkhoa", verify, uploader.single("image"), uploadChuyenKhoaImage);

// Upload hình ảnh tổng quát (có thể chỉ định folder)
router.post("/general", verify, uploader.single("image"), uploadImage);

// Xóa hình ảnh từ Cloudinary
router.delete("/:publicId", verify, deleteImage);

export default router;
