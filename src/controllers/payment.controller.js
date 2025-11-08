import { createMomoPayment, verifyMomoCallback, createVNPayPayment, verifyVNPayCallback } from '../services/payment.service.js';
import { HoaDon } from '../models/index.js';

/**
 * Tạo payment URL cho Momo
 */
export const createMomoPaymentUrl = async (req, res) => {
  try {
    const { id_hoa_don } = req.params;
    const { returnUrl, notifyUrl } = req.body;

    // Lấy thông tin hóa đơn
    const hoaDon = await HoaDon.findOne({ id_hoa_don });
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (hoaDon.trang_thai === 'da_thanh_toan') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán' });
    }

    // Tạo payment URL
    const result = await createMomoPayment({
      orderId: id_hoa_don,
      amount: hoaDon.tong_tien,
      orderInfo: `Thanh toan hoa don ${id_hoa_don}`,
      extraData: '',
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          paymentUrl: result.paymentUrl,
          qrCodeUrl: result.qrCodeUrl,
          orderId: result.orderId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message || 'Lỗi tạo payment URL',
      });
    }
  } catch (error) {
    console.error('Create Momo payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * Xử lý callback từ Momo (IPN - Instant Payment Notification)
 */
export const handleMomoCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Xác thực chữ ký
    const isValid = verifyMomoCallback(callbackData);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ',
      });
    }

    const { orderId, amount, resultCode, transId } = callbackData;

    // Cập nhật trạng thái hóa đơn
    if (resultCode === 0) {
      await HoaDon.update(
        {
          phuong_thuc_thanh_toan: 'momo',
          trang_thai: 'da_thanh_toan',
          thoi_gian_thanh_toan: new Date(),
        },
        orderId
      );

      // Trả về response cho Momo
      return res.status(200).json({
        resultCode: 0,
        message: 'Success',
      });
    } else {
      return res.status(200).json({
        resultCode: resultCode,
        message: callbackData.message || 'Payment failed',
      });
    }
  } catch (error) {
    console.error('Momo callback error:', error);
    return res.status(500).json({
      resultCode: -1,
      message: 'Server error',
    });
  }
};

/**
 * Tạo payment URL cho VNPay
 */
export const createVNPayPaymentUrl = async (req, res) => {
  try {
    const { id_hoa_don } = req.params;

    // Lấy thông tin hóa đơn
    const hoaDon = await HoaDon.findOne({ id_hoa_don });
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (hoaDon.trang_thai === 'da_thanh_toan') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán' });
    }

    // Tạo payment URL
    const result = createVNPayPayment({
      orderId: id_hoa_don,
      amount: hoaDon.tong_tien,
      orderDescription: `Thanh toan hoa don ${id_hoa_don}`,
      orderType: 'other',
      locale: 'vn',
    });

    return res.status(200).json({
      success: true,
      data: {
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
        amount: result.amount,
      },
    });
  } catch (error) {
    console.error('Create VNPay payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

/**
 * Xử lý callback từ VNPay (Return URL)
 */
export const handleVNPayCallback = async (req, res) => {
  try {
    const vnp_Params = req.query;

    // Xác thực chữ ký
    const verifyResult = verifyVNPayCallback(vnp_Params);

    if (!verifyResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ',
      });
    }

    const { orderId, isSuccess, amount, transactionId, message } = verifyResult;

    // Cập nhật trạng thái hóa đơn nếu thành công
    if (isSuccess) {
      await HoaDon.update(
        {
          phuong_thuc_thanh_toan: 'vnpay',
          trang_thai: 'da_thanh_toan',
          thoi_gian_thanh_toan: new Date(),
        },
        orderId
      );
    }

    // Redirect về frontend với kết quả
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/payment/callback/vnpay?success=${isSuccess}&orderId=${orderId}&message=${encodeURIComponent(message)}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('VNPay callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/payment/callback/vnpay?success=false&message=${encodeURIComponent('Lỗi xử lý thanh toán')}`);
  }
};

