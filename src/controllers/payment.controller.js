import { createMomoPayment, verifyMomoCallback, createVNPayPayment, verifyVNPayCallback, generateVietQRPayment } from '../services/payment.service.js';
import { HoaDon, CuocHenKhamBenh, CuocHenTuVan } from '../models/index.js';
import { createAppointmentNotification } from '../helpers/notificationHelper.js';

const isDepositInvoice = (invoice) => invoice?.loai_hoa_don === 'dat_coc';

const isDeadlineExpired = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

const finalizeDepositForAppointment = async (invoice) => {
  if (!isDepositInvoice(invoice)) return;

  const { id_cuoc_hen_kham, id_cuoc_hen_tu_van } = invoice;
  const isKham = Boolean(id_cuoc_hen_kham);
  const model = isKham ? CuocHenKhamBenh : CuocHenTuVan;
  const appointmentId = isKham ? id_cuoc_hen_kham : id_cuoc_hen_tu_van;
  if (!appointmentId) return;

  try {
    const appointment = await model.findOne({ id_cuoc_hen: appointmentId });
    if (!appointment) {
      return;
    }

    if (appointment.trang_thai === 'da_huy') {
      return;
    }

    if (appointment.trang_thai === 'cho_thanh_toan') {
      if (isDeadlineExpired(appointment.thoi_han_thanh_toan)) {
        await model.update({ trang_thai: 'da_huy' }, appointmentId);
        await HoaDon.update({ trang_thai: 'da_huy' }, invoice.id_hoa_don);
        return;
      }

      await model.update({ trang_thai: 'da_dat' }, appointmentId);
      await createAppointmentNotification(
        appointment.id_benh_nhan,
        'da_dat',
        appointmentId,
        appointment.ngay_kham,
        isKham ? appointment.id_bac_si : null,
        isKham ? null : appointment.id_chuyen_gia
      );

      if (isKham && appointment.id_bac_si && appointment.id_bac_si !== appointment.id_benh_nhan) {
        await createAppointmentNotification(
          appointment.id_bac_si,
          'da_dat',
          appointmentId,
          appointment.ngay_kham,
          appointment.id_bac_si,
          null
        );
      }

      if (!isKham && appointment.id_chuyen_gia && appointment.id_chuyen_gia !== appointment.id_benh_nhan) {
        await createAppointmentNotification(
          appointment.id_chuyen_gia,
          'da_dat',
          appointmentId,
          appointment.ngay_kham,
          null,
          appointment.id_chuyen_gia
        );
      }
    }
  } catch (error) {
    console.error('Failed to finalize deposit appointment', invoice?.id_hoa_don, error);
  }
};

const isMockPortalEnabled = () => {
  const mode = (process.env.MOMO_GATEWAY_MODE || 'mock').trim().toLowerCase();
  if (mode === 'gateway') {
    return (process.env.MOMO_ALLOW_MOCK_PORTAL || 'false').trim().toLowerCase() === 'true';
  }
  return true;
};

const formatCurrency = (value = 0) => Number(value || 0).toLocaleString('vi-VN');

const cancelAppointmentFromInvoice = async (invoice) => {
  try {
    if (invoice.id_cuoc_hen_kham) {
      const appointment = await CuocHenKhamBenh.findOne({ id_cuoc_hen: invoice.id_cuoc_hen_kham });
      await CuocHenKhamBenh.update({ trang_thai: 'da_huy' }, invoice.id_cuoc_hen_kham);
      if (appointment) {
        await createAppointmentNotification(
          appointment.id_benh_nhan,
          'da_huy',
          appointment.id_cuoc_hen,
          appointment.ngay_kham,
          appointment.id_bac_si,
          null
        );
        if (appointment.id_bac_si && appointment.id_bac_si !== appointment.id_benh_nhan) {
          await createAppointmentNotification(
            appointment.id_bac_si,
            'da_huy',
            appointment.id_cuoc_hen,
            appointment.ngay_kham,
            appointment.id_bac_si,
            null
          );
        }
      }
    }

    if (invoice.id_cuoc_hen_tu_van) {
      const appointment = await CuocHenTuVan.findOne({ id_cuoc_hen: invoice.id_cuoc_hen_tu_van });
      await CuocHenTuVan.update({ trang_thai: 'da_huy' }, invoice.id_cuoc_hen_tu_van);
      if (appointment) {
        await createAppointmentNotification(
          appointment.id_benh_nhan,
          'da_huy',
          appointment.id_cuoc_hen,
          appointment.ngay_kham,
          null,
          appointment.id_chuyen_gia
        );
        if (appointment.id_chuyen_gia && appointment.id_chuyen_gia !== appointment.id_benh_nhan) {
          await createAppointmentNotification(
            appointment.id_chuyen_gia,
            'da_huy',
            appointment.id_cuoc_hen,
            appointment.ngay_kham,
            null,
            appointment.id_chuyen_gia
          );
        }
      }
    }
  } catch (error) {
    console.error('Failed to cancel appointment from invoice', invoice?.id_hoa_don, error);
  }
};

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
        ma_giao_dich: transId || existingInvoice?.ma_giao_dich || null,
      };
      console.log('🔄 Update data:', updateData);
      
      await HoaDon.update(updateData, targetInvoiceId);
      const refreshedInvoice = await HoaDon.findOne({ id_hoa_don: targetInvoiceId });
      await finalizeDepositForAppointment(refreshedInvoice);

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

    await HoaDon.update(
      {
        phuong_thuc_thanh_toan: 'momo',
        trang_thai: 'da_thanh_toan',
        thoi_gian_thanh_toan: new Date(),
        ma_giao_dich: transId || existingInvoice.ma_giao_dich || null,
      },
      existingInvoice.id_hoa_don
    );

    const refreshedInvoice = await HoaDon.findOne({ id_hoa_don: existingInvoice.id_hoa_don });
    await finalizeDepositForAppointment(refreshedInvoice);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thanh toán thành công',
      data: refreshedInvoice,
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

const mockPortalDisabledResponse = (res) => {
  res.status(403).send('Mock MoMo đang bị vô hiệu hoá. Thiết lập MOMO_GATEWAY_MODE=mock hoặc MOMO_ALLOW_MOCK_PORTAL=true để sử dụng.');
};

export const renderMockMomoPage = async (req, res) => {
  try {
    if (!isMockPortalEnabled()) {
      return mockPortalDisabledResponse(res);
    }

    const { id_hoa_don } = req.params;
    const invoice = await HoaDon.findOne({ id_hoa_don });

    if (!invoice) {
      return res.status(404).send('Không tìm thấy hóa đơn.');
    }

    if (!isDepositInvoice(invoice)) {
      return res.status(400).send('Hóa đơn này không thuộc khoản đặt cọc.');
    }

    const amountFormatted = formatCurrency(invoice.tong_tien);
    const deadlineText = invoice.thoi_han_thanh_toan
      ? new Date(invoice.thoi_han_thanh_toan).toLocaleString('vi-VN')
      : 'Không xác định';

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>MoMo - Thanh toán tiền cọc</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f6f6f6; padding: 24px; }
    .card { max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 20px; margin-bottom: 12px; color: #8a0a9a; }
    .info { margin-bottom: 16px; line-height: 1.6; }
    .actions { display: flex; gap: 12px; }
    button { flex: 1; padding: 12px; border: none; border-radius: 8px; font-size: 15px; cursor: pointer; }
    .pay { background: #d82d8b; color: #fff; }
    .cancel { background: #e0e0e0; }
    #result { margin-top: 16px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MoMo - Thanh toán tiền cọc</h1>
    <div class="info">
      <div><strong>Mã hóa đơn:</strong> ${invoice.id_hoa_don}</div>
      <div><strong>Số tiền:</strong> ${amountFormatted} VNĐ</div>
      <div><strong>Hạn thanh toán:</strong> ${deadlineText}</div>
    </div>
    <div class="actions">
      <button class="pay" id="payBtn">Thanh toán thành công</button>
      <button class="cancel" id="cancelBtn">Hủy giao dịch</button>
    </div>
    <div id="result"></div>
  </div>
  <script>
    const showMessage = (msg, success) => {
      const el = document.getElementById('result');
      el.textContent = msg;
      el.style.color = success ? '#2e7d32' : '#c62828';
    };
    const post = async (path) => {
      const resp = await fetch(path, { method: 'POST' });
      const data = await resp.json().catch(() => ({}));
      showMessage(data.message || 'Không xác định', data.success);
    };
    document.getElementById('payBtn').onclick = () => post('confirm');
    document.getElementById('cancelBtn').onclick = () => post('cancel');
  </script>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (error) {
    console.error('Render mock MoMo page error:', error);
    return res.status(500).send('Lỗi server khi tải trang mô phỏng MoMo.');
  }
};

export const mockMomoConfirmPayment = async (req, res) => {
  try {
    if (!isMockPortalEnabled()) {
      return mockPortalDisabledResponse(res);
    }

    const { id_hoa_don } = req.params;
    const invoice = await HoaDon.findOne({ id_hoa_don });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (invoice.trang_thai === 'da_thanh_toan') {
      return res.json({ success: true, message: 'Hóa đơn đã được thanh toán trước đó' });
    }

    await HoaDon.update(
      {
        phuong_thuc_thanh_toan: 'momo',
        trang_thai: 'da_thanh_toan',
        thoi_gian_thanh_toan: new Date(),
        ma_giao_dich: `MOCK-${Date.now()}`
      },
      id_hoa_don
    );

    const refreshedInvoice = await HoaDon.findOne({ id_hoa_don });
    await finalizeDepositForAppointment(refreshedInvoice);

    return res.json({ success: true, message: 'Thanh toán mô phỏng thành công', data: refreshedInvoice });
  } catch (error) {
    console.error('Mock MoMo confirm error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xác nhận thanh toán' });
  }
};

export const mockMomoCancelPayment = async (req, res) => {
  try {
    if (!isMockPortalEnabled()) {
      return mockPortalDisabledResponse(res);
    }

    const { id_hoa_don } = req.params;
    const invoice = await HoaDon.findOne({ id_hoa_don });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hóa đơn' });
    }

    if (invoice.trang_thai === 'da_huy') {
      return res.json({ success: true, message: 'Hóa đơn đã được hủy trước đó' });
    }

    await HoaDon.update({ trang_thai: 'da_huy' }, id_hoa_don);
    await cancelAppointmentFromInvoice(invoice);

    return res.json({ success: true, message: 'Đã hủy hóa đơn mô phỏng MoMo' });
  } catch (error) {
    console.error('Mock MoMo cancel error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi hủy thanh toán' });
  }
};

