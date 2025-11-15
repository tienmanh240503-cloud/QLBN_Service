import crypto from 'crypto';
import querystring from 'querystring';

/**
 * Payment Service - Tích hợp Momo và VNPay
 */

// Cấu hình Momo (cần thay bằng thông tin thật từ Momo Partner)
const MOMO_CONFIG = {
  partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
  accessKey: process.env.MOMO_ACCESS_KEY || '',
  secretKey: process.env.MOMO_SECRET_KEY || '',
  endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
  returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:5173/payment/callback/momo',
  notifyUrl: process.env.MOMO_NOTIFY_URL || 'http://localhost:5005/api/payment/callback/momo',
};

// Cấu hình VNPay (cần thay bằng thông tin thật từ VNPay)
const VNPAY_CONFIG = {
  tmnCode: process.env.VNPAY_TMN_CODE || 'YOUR_TMN_CODE',
  secretKey: process.env.VNPAY_SECRET_KEY || 'YOUR_SECRET_KEY',
  url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:5173/payment/callback/vnpay',
};

/**
 * Tạo payment URL cho Momo
 * @param {Object} params - Thông tin thanh toán
 * @param {string} params.orderId - Mã đơn hàng (id_hoa_don)
 * @param {number} params.amount - Số tiền
 * @param {string} params.orderInfo - Thông tin đơn hàng
 * @param {string} params.extraData - Dữ liệu bổ sung
 * @returns {Promise<Object>} Payment URL và thông tin
 */
export const createMomoPayment = async (params) => {
  const { orderId, amount, orderInfo, extraData = '' } = params;

  const requestId = `${MOMO_CONFIG.partnerCode}${Date.now()}`;
  const orderIdFormatted = orderId;
  const requestType = 'captureWallet';
  const amountFormatted = amount;
  const orderInfoFormatted = orderInfo || `Thanh toan hoa don ${orderId}`;
  const extraDataFormatted = extraData || '';

  // Tạo object chứa các tham số để tạo chữ ký (sắp xếp theo alphabet)
  const signatureParams = {
    accessKey: MOMO_CONFIG.accessKey,
    amount: amountFormatted,
    extraData: extraDataFormatted,
    ipnUrl: MOMO_CONFIG.notifyUrl,
    orderId: orderIdFormatted,
    orderInfo: orderInfoFormatted,
    partnerCode: MOMO_CONFIG.partnerCode,
    redirectUrl: MOMO_CONFIG.returnUrl,
    requestId: requestId,
    requestType: requestType,
  };

  // Kiểm tra config
  if (!MOMO_CONFIG.secretKey || !MOMO_CONFIG.accessKey) {
    return {
      success: false,
      message: 'Momo config chưa được thiết lập đầy đủ. Vui lòng kiểm tra MOMO_SECRET_KEY và MOMO_ACCESS_KEY trong file .env',
    };
  }

  // Sắp xếp các key theo thứ tự alphabet và tạo query string
  const sortedKeys = Object.keys(signatureParams).sort();
  const rawSignature = sortedKeys
    .map((key) => `${key}=${signatureParams[key]}`)
    .join('&');

  // Log raw signature để debug (chỉ trong development)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Momo raw signature:', rawSignature);
  }

  // Tạo signature bằng HMAC SHA256
  const signature = crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawSignature)
    .digest('hex');

  // Tạo request body
  const requestBody = {
    partnerCode: MOMO_CONFIG.partnerCode,
    partnerName: 'PHONG KHAM MEDPRO',
    storeId: 'MEDPRO',
    requestId: requestId,
    amount: amountFormatted,
    orderId: orderIdFormatted,
    orderInfo: orderInfoFormatted,
    redirectUrl: MOMO_CONFIG.returnUrl,
    ipnUrl: MOMO_CONFIG.notifyUrl,
    lang: 'vi',
    extraData: extraDataFormatted,
    requestType: requestType,
    autoCapture: true,
    orderGroupId: '',
    signature: signature,
  };

  try {
    // Gọi API Momo để tạo payment URL
    const response = await fetch(MOMO_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (result.resultCode === 0) {
      return {
        success: true,
        paymentUrl: result.payUrl,
        orderId: orderIdFormatted,
        requestId: requestId,
        qrCodeUrl: result.qrCodeUrl || null,
      };
    } else {
      return {
        success: false,
        message: result.message || 'Lỗi tạo payment URL từ Momo',
      };
    }
  } catch (error) {
    console.error('Momo payment error:', error);
    return {
      success: false,
      message: 'Lỗi kết nối với Momo',
      error: error.message,
    };
  }
};

/**
 * Xác thực callback từ Momo
 * @param {Object} params - Thông tin từ callback
 * @returns {boolean} True nếu hợp lệ
 */
export const verifyMomoCallback = (params) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = params;

  // Tạo object chứa các tham số để verify chữ ký (sắp xếp theo alphabet)
  const signatureParams = {
    accessKey: MOMO_CONFIG.accessKey,
    amount: amount,
    extraData: extraData || '',
    message: message || '',
    orderId: orderId,
    orderInfo: orderInfo,
    orderType: orderType,
    partnerCode: partnerCode,
    payType: payType,
    requestId: requestId,
    responseTime: responseTime,
    resultCode: resultCode,
    transId: transId,
  };

  // Sắp xếp các key theo thứ tự alphabet và tạo query string
  const sortedKeys = Object.keys(signatureParams).sort();
  const rawSignature = sortedKeys
    .map((key) => `${key}=${signatureParams[key]}`)
    .join('&');

  const verifySignature = crypto
    .createHmac('sha256', MOMO_CONFIG.secretKey)
    .update(rawSignature)
    .digest('hex');

  return verifySignature === signature && resultCode === 0;
};

/**
 * Tạo payment URL cho VNPay
 * @param {Object} params - Thông tin thanh toán
 * @param {string} params.orderId - Mã đơn hàng (id_hoa_don)
 * @param {number} params.amount - Số tiền (VND)
 * @param {string} params.orderDescription - Mô tả đơn hàng
 * @param {string} params.orderType - Loại đơn hàng
 * @param {string} params.locale - Ngôn ngữ (vn/en)
 * @param {string} params.ipAddr - IP address của client
 * @returns {Object} Payment URL và thông tin
 */
export const createVNPayPayment = (params) => {
  const { orderId, amount, orderDescription, orderType = 'other', locale = 'vn', ipAddr = '127.0.0.1' } = params;

  // Kiểm tra config
  if (!VNPAY_CONFIG.tmnCode || VNPAY_CONFIG.tmnCode === 'YOUR_TMN_CODE' || 
      !VNPAY_CONFIG.secretKey || VNPAY_CONFIG.secretKey === 'YOUR_SECRET_KEY') {
    return {
      success: false,
      message: 'VNPay config chưa được thiết lập đầy đủ. Vui lòng kiểm tra VNPAY_TMN_CODE và VNPAY_SECRET_KEY trong file .env',
    };
  }

  // Format ngày tháng theo timezone GMT+7 (VN) - Format: yyyyMMddHHmmss
  const now = new Date();
  // Chuyển sang timezone GMT+7 (VN)
  const vnOffset = 7 * 60 * 60 * 1000; // GMT+7 in milliseconds
  const vnTime = new Date(now.getTime() + vnOffset);
  
  // Format: yyyyMMddHHmmss (14 ký tự) - sử dụng UTC methods vì đã cộng offset
  const year = vnTime.getUTCFullYear();
  const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getUTCDate()).padStart(2, '0');
  const hours = String(vnTime.getUTCHours()).padStart(2, '0');
  const minutes = String(vnTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(vnTime.getUTCSeconds()).padStart(2, '0');
  const createDate = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
  // Expire date: +15 phút
  const expireTime = new Date(now.getTime() + vnOffset + (15 * 60 * 1000));
  const expireYear = expireTime.getUTCFullYear();
  const expireMonth = String(expireTime.getUTCMonth() + 1).padStart(2, '0');
  const expireDay = String(expireTime.getUTCDate()).padStart(2, '0');
  const expireHours = String(expireTime.getUTCHours()).padStart(2, '0');
  const expireMinutes = String(expireTime.getUTCMinutes()).padStart(2, '0');
  const expireSeconds = String(expireTime.getUTCSeconds()).padStart(2, '0');
  const expireDate = `${expireYear}${expireMonth}${expireDay}${expireHours}${expireMinutes}${expireSeconds}`;

  // Làm sạch orderId - chỉ giữ chữ số, chữ cái, dấu gạch dưới, dấu gạch ngang
  const cleanOrderId = String(orderId).replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 100);
  
  // Làm sạch orderDescription - loại bỏ ký tự đặc biệt, chỉ giữ chữ cái, số, khoảng trắng
  const cleanOrderDescription = (orderDescription || `Thanh toan hoa don ${cleanOrderId}`)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim()
    .substring(0, 255); // VNPAY giới hạn 255 ký tự

  // Đảm bảo amount là số nguyên
  const amountInt = Math.round(Number(amount));
  if (isNaN(amountInt) || amountInt <= 0) {
    return {
      success: false,
      message: 'Số tiền không hợp lệ',
    };
  }

  // Tạo các tham số
  const vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPAY_CONFIG.tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: cleanOrderId,
    vnp_OrderInfo: cleanOrderDescription,
    vnp_OrderType: orderType,
    vnp_Amount: amountInt * 100, // VNPay yêu cầu số tiền nhân 100
    vnp_ReturnUrl: VNPAY_CONFIG.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = vnp_Params[key];
      return acc;
    }, {});

  // Tạo query string
  const signData = querystring.stringify(sortedParams, { encode: false });
  
  // Tạo chữ ký bằng HMAC SHA512
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  
  // Thêm chữ ký vào params
  vnp_Params['vnp_SecureHash'] = signed;

  // Tạo payment URL
  const paymentUrl = `${VNPAY_CONFIG.url}?${querystring.stringify(vnp_Params, { encode: false })}`;

  return {
    success: true,
    paymentUrl: paymentUrl,
    orderId: cleanOrderId,
    amount: amountInt,
  };
};

/**
 * Xác thực callback từ VNPay
 * @param {Object} params - Thông tin từ callback
 * @returns {Object} Kết quả xác thực
 */
export const verifyVNPayCallback = (params) => {
  const vnp_Params = { ...params };
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp các tham số
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((acc, key) => {
      if (vnp_Params[key]) {
        acc[key] = vnp_Params[key];
      }
      return acc;
    }, {});

  // Tạo query string
  const signData = querystring.stringify(sortedParams, { encode: false });

  // Tạo chữ ký
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // Kiểm tra chữ ký và response code
  const isValid = secureHash === signed;
  const isSuccess = vnp_Params['vnp_ResponseCode'] === '00';

  return {
    isValid,
    isSuccess,
    orderId: vnp_Params['vnp_TxnRef'],
    amount: vnp_Params['vnp_Amount'] ? parseInt(vnp_Params['vnp_Amount']) / 100 : 0,
    transactionId: vnp_Params['vnp_TransactionNo'],
    responseCode: vnp_Params['vnp_ResponseCode'],
    message: vnp_Params['vnp_TransactionStatus'] === '00' ? 'Giao dịch thành công' : 'Giao dịch thất bại',
  };
};

