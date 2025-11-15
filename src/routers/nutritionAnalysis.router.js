import express from 'express';
import { analyzeNutrition } from '../controllers/nutritionAnalysis.controller.js';

const router = express.Router();

// API endpoint để phân tích lý do tư vấn dinh dưỡng và gợi ý chuyên ngành dinh dưỡng
router.post('/analyze', analyzeNutrition);

export default router;

