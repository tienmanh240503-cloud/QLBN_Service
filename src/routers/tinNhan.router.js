import express from 'express';
import { verify } from '../middlewares/verifyToken.middleware.js';
import { 
    getOrCreateConversation,
    getConversations,
    sendMessage,
    getMessages,
    markAsRead,
    deleteMessage
} from '../controllers/tinNhan.controller.js';
import chatUploader from '../middlewares/chatUploader.middleware.js';

const router = express.Router();

// Lấy hoặc tạo cuộc trò chuyện
router.post('/conversations', verify, getOrCreateConversation);

// Lấy danh sách cuộc trò chuyện của người dùng
router.get('/conversations', verify, getConversations);

// Gửi tin nhắn (có thể kèm file)
router.post('/messages', verify, chatUploader.single('file'), sendMessage);

// Lấy danh sách tin nhắn của cuộc trò chuyện
router.get('/messages/:id_cuoc_tro_chuyen', verify, getMessages);

// Đánh dấu tin nhắn đã đọc
router.put('/messages/:id_cuoc_tro_chuyen/read', verify, markAsRead);

// Xóa tin nhắn
router.delete('/messages/:id_tin_nhan', verify, deleteMessage);

export default router;

