import express from 'express';
import { calculateCalories } from '../controllers/calorieCalculator.controller.js';

const router = express.Router();

// API endpoint để tính calories từ danh sách món ăn
router.post('/calculate', calculateCalories);

export default router;

