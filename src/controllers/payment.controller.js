import { createMomoPayment, verifyMomoCallback, createVNPayPayment, verifyVNPayCallback, generateVietQRPayment } from '../services/payment.service.js';
import { HoaDon, CuocHenKhamBenh, CuocHenTuVan } from '../models/index.js';

/**
 * Tạo payment URL cho Momo
 */
export const createMomoPaymentUrl = async (req, res) => {
  try {
    const { id_hoa_don } = req.params;
    const {
      source = 'cashier',
      redirectPath,
      extraData: extraDataFromClient,
    } = req.body || {};

    // Lấy thông tin hóa đơn
    const hoaDon = await HoaDon.findOne({ id_hoa_don });
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (hoaDon.trang_thai === 'da_thanh_toan') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán' });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const defaultRedirects = {
      cashier: '/receptionist/billing',
      patient: '/invoices',
    };

    const sanitizeRedirectPath = (path) => {
      if (typeof path !== 'string' || !path.startsWith('/')) {
        return defaultRedirects[source] || '/';
      }
      return path;
    };

    const resolvedRedirectPath = sanitizeRedirectPath(redirectPath);
    let extraPayload = {
      source,
      redirectPath: resolvedRedirectPath,
      frontendUrl,
      invoiceId: id_hoa_don,
    };

    if (extraDataFromClient && typeof extraDataFromClient === 'object') {
      extraPayload = { ...extraPayload, ...extraDataFromClient };
    } else if (typeof extraDataFromClient === 'string' && extraDataFromClient.trim()) {
      extraPayload.custom = extraDataFromClient.trim();
    }

    const encodedExtraData = Buffer.from(JSON.stringify(extraPayload)).toString('base64');

    // Tạo payment URL
    const result = await createMomoPayment({
      orderId: id_hoa_don,
      amount: hoaDon.tong_tien,
      orderInfo: `Thanh toan hoa don ${id_hoa_don}`,
      extraData: encodedExtraData,
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
    console.log('🔔 Momo callback received:', JSON.stringify(req.body, null, 2));
    const callbackData = req.body;

    // Xác thực chữ ký
    const isValid = verifyMomoCallback(callbackData);
    console.log('✅ Signature valid:', isValid);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ',
      });
    }

    const { orderId, amount, resultCode, transId, extraData } = callbackData;
    console.log('📦 Callback data:', { orderId, amount, resultCode, transId, extraData });

    let invoiceIdFromExtraData = null;
    if (extraData) {
      try {
        const decodedExtra = JSON.parse(Buffer.from(extraData, 'base64').toString('utf-8'));
        invoiceIdFromExtraData = decodedExtra?.invoiceId || null;
        console.log('🔍 Decoded extraData:', decodedExtra);
      } catch (decodeError) {
        console.warn('❌ Cannot decode Momo extraData:', decodeError);
      }
    }
    
    const targetInvoiceId = invoiceIdFromExtraData || orderId;
    console.log('🎯 Target invoice ID:', targetInvoiceId);

    const normalizedResultCode = typeof resultCode === 'string' ? parseInt(resultCode, 10) : resultCode;
    console.log('🔢 Normalized resultCode:', normalizedResultCode);

    // Cập nhật trạng thái hóa đơn
    if (normalizedResultCode === 0) {
      console.log('💰 Payment successful, updating invoice...');
      
      // THÊM DEBUG: Kiểm tra xem invoice có tồn tại không
      const existingInvoice = await HoaDon.findOne({ id_hoa_don: targetInvoiceId });
      console.log('📄 Existing invoice:', existingInvoice);
      
      if (!existingInvoice) {
        console.log('❌ Invoice not found for ID:', targetInvoiceId);
        return res.status(200).json({
          resultCode: 0, // Vẫn trả về success cho Momo
          message: 'Invoice not found but payment recorded',
        });
      }

      // THÊM DEBUG: Log dữ liệu update
      const updateData = {
        phuong_thuc_thanh_toan: 'momo',
        trang_thai: 'da_thanh_toan',
        thoi_gian_thanh_toan: new Date(),
        ma_giao_dich: transId || null, // Lưu mã giao dịch Momo để có thể hoàn tiền sau này
      };
      console.log('🔄 Update data:', updateData);
      
      const updateResult = await HoaDon.update(updateData, targetInvoiceId);
      console.log('✅ Update result:', updateResult);

      // Cập nhật trạng thái cuộc hẹn từ "cho_thanh_toan" → "da_dat" nếu là hóa đơn cọc
      if (existingInvoice.loai_hoa_don === 'dat_coc') {
        try {
          // Tìm cuộc hẹn liên quan
          if (existingInvoice.id_cuoc_hen_kham) {
            const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_kham });
            if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
              await CuocHenKhamBenh.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_kham);
              console.log('✅ Updated appointment status to da_dat:', existingInvoice.id_cuoc_hen_kham);
            }
          } else if (existingInvoice.id_cuoc_hen_tu_van) {
            const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_tu_van });
            if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
              await CuocHenTuVan.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_tu_van);
              console.log('✅ Updated consultation status to da_dat:', existingInvoice.id_cuoc_hen_tu_van);
            }
          }
        } catch (updateError) {
          console.error('⚠️ Error updating appointment status:', updateError);
          // Không throw error để không ảnh hưởng đến response cho Momo
        }
      }

      // Trả về response cho Momo
      return res.status(200).json({
        resultCode: 0,
        message: 'Success',
      });
    } else {
      console.log('❌ Payment failed with resultCode:', normalizedResultCode);
      return res.status(200).json({
        resultCode: resultCode,
        message: callbackData.message || 'Payment failed',
      });
    }
  } catch (error) {
    console.error('💥 Momo callback error:', error);
    return res.status(500).json({
      resultCode: -1,
      message: 'Server error',
    });
  }
};

/**
 * Fallback xác nhận thanh toán Momo thông qua trang redirect
 * Dùng khi IPN không truy cập được vào server (ví dụ môi trường dev nội bộ)
 */
export const confirmMomoReturn = async (req, res) => {
  try {
    const callbackData = req.body || {};

    if (!callbackData.signature) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu chữ ký xác thực từ Momo',
      });
    }

    const isValid = verifyMomoCallback(callbackData);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Chữ ký không hợp lệ',
      });
    }

    const normalizedResultCode =
      typeof callbackData.resultCode === 'string'
        ? parseInt(callbackData.resultCode, 10)
        : callbackData.resultCode;

    if (normalizedResultCode !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Giao dịch chưa thành công',
      });
    }

    const { orderId, amount, transId, extraData } = callbackData;

    let invoiceIdFromExtraData = null;
    if (extraData) {
      try {
        const decodedExtra = JSON.parse(Buffer.from(extraData, 'base64').toString('utf-8'));
        invoiceIdFromExtraData = decodedExtra?.invoiceId || null;
      } catch (decodeError) {
        console.warn('❌ Cannot decode Momo extraData (confirm route):', decodeError);
      }
    }

    const targetInvoiceId = invoiceIdFromExtraData || orderId;
    const existingInvoice = await HoaDon.findOne({ id_hoa_don: targetInvoiceId });

    if (!existingInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hóa đơn để cập nhật',
      });
    }

    if (existingInvoice.trang_thai === 'da_thanh_toan' && existingInvoice.phuong_thuc_thanh_toan === 'momo') {
      return res.status(200).json({
        success: true,
        message: 'Hóa đơn đã được cập nhật trước đó',
        data: existingInvoice,
      });
    }

    const updateResult = await HoaDon.update(
      {
        phuong_thuc_thanh_toan: 'momo',
        trang_thai: 'da_thanh_toan',
        thoi_gian_thanh_toan: new Date(),
        ma_giao_dich: transId || null, // Lưu mã giao dịch Momo để có thể hoàn tiền sau này
      },
      existingInvoice.id_hoa_don
    );

    // Cập nhật trạng thái cuộc hẹn từ "cho_thanh_toan" → "da_dat" nếu là hóa đơn cọc
    if (existingInvoice.loai_hoa_don === 'dat_coc') {
      try {
        if (existingInvoice.id_cuoc_hen_kham) {
          const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_kham });
          if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
            await CuocHenKhamBenh.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_kham);
          }
        } else if (existingInvoice.id_cuoc_hen_tu_van) {
          const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_tu_van });
          if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
            await CuocHenTuVan.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_tu_van);
          }
        }
      } catch (updateError) {
        console.error('⚠️ Error updating appointment status:', updateError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thanh toán thành công',
      data: updateResult?.result || updateResult,
    });
  } catch (error) {
    console.error('💥 Confirm Momo return error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác nhận thanh toán',
      error: error.message,
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

    // Lấy IP address từ request
    const ipAddr = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   req.socket?.remoteAddress ||
                   '127.0.0.1';

    // Tạo payment URL
    const result = createVNPayPayment({
      orderId: id_hoa_don,
      amount: hoaDon.tong_tien,
      orderDescription: `Thanh toan hoa don ${id_hoa_don}`,
      orderType: 'other',
      locale: 'vn',
      ipAddr: ipAddr,
    });

    // Kiểm tra nếu có lỗi từ service
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Lỗi tạo payment URL',
      });
    }

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
      const existingInvoice = await HoaDon.findOne({ id_hoa_don: orderId });
      if (existingInvoice) {
        await HoaDon.update(
          {
            phuong_thuc_thanh_toan: 'vnpay',
            trang_thai: 'da_thanh_toan',
            thoi_gian_thanh_toan: new Date(),
          },
          orderId
        );

        // Cập nhật trạng thái cuộc hẹn từ "cho_thanh_toan" → "da_dat" nếu là hóa đơn cọc
        if (existingInvoice.loai_hoa_don === 'dat_coc') {
          try {
            if (existingInvoice.id_cuoc_hen_kham) {
              const cuocHen = await CuocHenKhamBenh.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_kham });
              if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
                await CuocHenKhamBenh.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_kham);
              }
            } else if (existingInvoice.id_cuoc_hen_tu_van) {
              const cuocHen = await CuocHenTuVan.findOne({ id_cuoc_hen: existingInvoice.id_cuoc_hen_tu_van });
              if (cuocHen && cuocHen.trang_thai === 'cho_thanh_toan') {
                await CuocHenTuVan.update({ trang_thai: 'da_dat' }, existingInvoice.id_cuoc_hen_tu_van);
              }
            }
          } catch (updateError) {
            console.error('⚠️ Error updating appointment status (VNPay):', updateError);
          }
        }
      }
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

/**
 * Tạo mã VietQR cho hóa đơn
 */
export const createVietQRPayment = async (req, res) => {
  try {
    const { id_hoa_don } = req.params;

    const hoaDon = await HoaDon.findOne({ id_hoa_don });
    if (!hoaDon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (hoaDon.trang_thai === 'da_thanh_toan') {
      return res.status(400).json({ success: false, message: 'Hóa đơn đã được thanh toán' });
    }

    const result = await generateVietQRPayment({
      orderId: id_hoa_don,
      amount: hoaDon.tong_tien,
      description: `Thanh toan hoa don ${id_hoa_don}`,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: {
          ...result.data,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message || 'Không thể tạo mã VietQR',
    });
  } catch (error) {
    console.error('Create VietQR payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message,
    });
  }
};

