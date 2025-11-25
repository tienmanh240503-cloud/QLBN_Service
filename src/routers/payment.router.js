import express from 'express';
import {
  createMomoPaymentUrl,
  handleMomoCallback,
  createVNPayPaymentUrl,
  handleVNPayCallback,
  createVietQRPayment,
} from '../controllers/payment.controller.js';
import { verify } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

// Tạo payment URL cho Momo (cần đăng nhập)
router.post('/momo/:id_hoa_don', verify, createMomoPaymentUrl);

// Callback từ Momo (IPN - không cần đăng nhập vì là webhook)
router.post('/callback/momo', handleMomoCallback);

// Tạo payment URL cho VNPay (cần đăng nhập)
router.post('/vnpay/:id_hoa_don', verify, createVNPayPaymentUrl);

// Callback từ VNPay (Return URL - không cần đăng nhập)
router.get('/callback/vnpay', handleVNPayCallback);

// Tạo mã VietQR (cần đăng nhập)
router.post('/vietqr/:id_hoa_don', verify, createVietQRPayment);

export default router;

