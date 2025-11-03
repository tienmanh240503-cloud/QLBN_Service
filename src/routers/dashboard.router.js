import express from 'express';
import {
    getDoctorDashboard,
    getReceptionistDashboard,
    getStaffDashboard,
    getAdminDashboard,
    getNutritionistDashboard
} from '../controllers/dashboard.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Dashboard bác sĩ
router.get('/doctor', verify, getDoctorDashboard);

// Dashboard nhân viên quầy
router.get('/receptionist', verify, getReceptionistDashboard);

// Dashboard nhân viên phân công
router.get('/staff', verify, getStaffDashboard);

// Dashboard admin
router.get('/admin', verify, getAdminDashboard);

// Dashboard chuyên gia dinh dưỡng
router.get('/nutritionist', verify, getNutritionistDashboard);

export default router;

