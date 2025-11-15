import express from 'express';
import { analyzeSymptoms } from '../controllers/symptomAnalysis.controller.js';

const router = express.Router();

// API endpoint để phân tích triệu chứng và gợi ý chuyên khoa
router.post('/analyze', analyzeSymptoms);

export default router;

