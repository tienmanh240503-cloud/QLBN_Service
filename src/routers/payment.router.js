import express from 'express';
import {
  createMomoPaymentUrl,
  handleMomoCallback,
  confirmMomoReturn,
  createVNPayPaymentUrl,
  handleVNPayCallback,
  createVietQRPayment,
  renderMockMomoPage,
  mockMomoConfirmPayment,
  mockMomoCancelPayment,
} from '../controllers/payment.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

// Tạo payment URL cho Momo (cần đăng nhập)
router.post('/momo/:id_hoa_don', verify, createMomoPaymentUrl);

// Callback từ Momo (IPN - không cần đăng nhập vì là webhook)
router.post('/callback/momo', handleMomoCallback);

// Fallback xác nhận Momo (khi IPN không tới được)
router.post('/callback/momo/confirm', confirmMomoReturn);

// Tạo payment URL cho VNPay (cần đăng nhập)
router.post('/vnpay/:id_hoa_don', verify, createVNPayPaymentUrl);

// Callback từ VNPay (Return URL - không cần đăng nhập)
router.get('/callback/vnpay', handleVNPayCallback);

// Tạo mã VietQR (cần đăng nhập)
router.post('/vietqr/:id_hoa_don', verify, createVietQRPayment);

// Mock MoMo portal (không cần đăng nhập - phục vụ mô phỏng)
router.get('/mock/momo/:id_hoa_don', renderMockMomoPage);
router.post('/mock/momo/:id_hoa_don/confirm', mockMomoConfirmPayment);
router.post('/mock/momo/:id_hoa_don/cancel', mockMomoCancelPayment);

export default router;

