import express from 'express';
import { getMedicalChatResponse } from '../controllers/medicalChat.controller.js';

const router = express.Router();

// API endpoint để nhận câu hỏi y tế và trả về phản hồi từ AI
router.post('/chat', getMedicalChatResponse);

export default router;

