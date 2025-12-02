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
  refundEndpoint: process.env.MOMO_REFUND_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/refund',
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

// Cấu hình VietQR (Napas 2.0)
const VIETQR_CONFIG = {
  endpoint: process.env.VIETQR_ENDPOINT || 'https://api.vietqr.io/v2/generate',
  acqId: process.env.VIETQR_ACQ_ID || '',
  accountNo: process.env.VIETQR_ACCOUNT_NO || '',
  accountName: process.env.VIETQR_ACCOUNT_NAME || '',
  template: process.env.VIETQR_TEMPLATE || 'compact',
  format: process.env.VIETQR_FORMAT || 'text',
  clientId: process.env.VIETQR_CLIENT_ID || '',
  apiKey: process.env.VIETQR_API_KEY || '',
  allowAmountEditable: process.env.VIETQR_ALLOW_AMOUNT_OVERRIDE === 'true',
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
  const rawOrderId = orderId || requestId;
  const requestType = 'captureWallet';
  const amountFormatted = String(Math.round(Number(amount) || 0));
  const orderInfoFormatted = (orderInfo || `Thanh toan hoa don ${rawOrderId}`).substring(0, 90);
  const extraDataFormatted = extraData || '';
  const orderIdFormatted = rawOrderId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 34) || requestId;

  if (Number(amountFormatted) <= 0) {
    return {
      success: false,
      message: 'Số tiền thanh toán không hợp lệ cho Momo.',
    };
  }

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
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Cannot parse Momo response as JSON:', {
        status: response.status,
        statusText: response.statusText,
        responseText: responseText?.substring(0, 500),
      });
      return {
        success: false,
        message: 'Không nhận được phản hồi JSON hợp lệ từ Momo',
        status: response.status,
        rawResponse: responseText,
      };
    }

    if (result.resultCode === 0) {
      return {
        success: true,
        paymentUrl: result.payUrl,
        orderId: orderIdFormatted,
        requestId: requestId,
        qrCodeUrl: result.qrCodeUrl || null,
      };
    } else {
      console.error('MoMo create payment failed:', {
        resultCode: result.resultCode,
        message: result.message,
        orderId: orderIdFormatted,
        raw: result,
      });
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

  const normalize = (value) => {
    if (value === undefined || value === null) return '';
    return String(value);
  };

  // Tạo object chứa các tham số để verify chữ ký (sắp xếp theo alphabet)
  const signatureParams = {
    accessKey: normalize(MOMO_CONFIG.accessKey),
    amount: normalize(amount),
    extraData: normalize(extraData),
    message: normalize(message),
    orderId: normalize(orderId),
    orderInfo: normalize(orderInfo),
    orderType: normalize(orderType),
    partnerCode: normalize(partnerCode),
    payType: normalize(payType),
    requestId: normalize(requestId),
    responseTime: normalize(responseTime),
    resultCode: normalize(resultCode),
    transId: normalize(transId),
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

  const isValid = verifySignature === signature;

  if (!isValid && process.env.NODE_ENV !== 'production') {
    console.warn('Momo callback signature mismatch', {
      rawSignature,
      expectedSignature: verifySignature,
      receivedSignature: signature,
    });
  }

  return isValid;
};

/**
 * Yêu cầu hoàn tiền qua Momo
 * @param {Object} params
 * @param {string} params.orderId - Mã hóa đơn gốc
 * @param {number} params.amount - Số tiền hoàn
 * @param {string|number} params.transId - Mã giao dịch Momo gốc
 * @param {string} [params.description] - Ghi chú hoàn tiền
 * @returns {Promise<{success: boolean, message?: string, resultCode?: number, data?: any}>}
 */
export const refundMomoPayment = async (params = {}) => {
  if (!MOMO_CONFIG.secretKey || !MOMO_CONFIG.accessKey) {
    return {
      success: false,
      message: 'Momo config chưa đầy đủ để hoàn tiền',
    };
  }

  const { orderId, amount, transId, description } = params;
  if (!transId) {
    return {
      success: false,
      message: 'Thiếu mã giao dịch (transId) để hoàn tiền qua Momo',
    };
  }

  const requestId = `${MOMO_CONFIG.partnerCode}${Date.now()}RF`;
  const normalizedOrderId =
    (orderId || requestId).toString().replace(/[^a-zA-Z0-9]/g, '').substring(0, 50) || requestId;
  const normalizedAmount = String(Math.round(Number(amount) || 0));
  if (Number(normalizedAmount) <= 0) {
    return {
      success: false,
      message: 'Số tiền hoàn không hợp lệ',
    };
  }

  const descriptionValue =
    description?.toString().substring(0, 190) || `Refund for order ${normalizedOrderId}`;
  const signatureParams = {
    accessKey: MOMO_CONFIG.accessKey,
    amount: normalizedAmount,
    description: descriptionValue,
    orderId: normalizedOrderId,
    partnerCode: MOMO_CONFIG.partnerCode,
    requestId,
    transId: String(transId),
  };

  const sortedKeys = Object.keys(signatureParams).sort();
  const rawSignature = sortedKeys.map((key) => `${key}=${signatureParams[key]}`).join('&');
  const signature = crypto.createHmac('sha256', MOMO_CONFIG.secretKey).update(rawSignature).digest('hex');

  const requestBody = {
    ...signatureParams,
    lang: 'vi',
    signature,
  };

  try {
    const response = await fetch(MOMO_CONFIG.refundEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Cannot parse Momo refund response as JSON:', {
        status: response.status,
        statusText: response.statusText,
        responseText: responseText?.substring(0, 500),
      });
      return {
        success: false,
        message: 'Không nhận được phản hồi JSON hợp lệ từ Momo khi hoàn tiền',
      };
    }

    if (result.resultCode === 0) {
      return {
        success: true,
        data: result,
      };
    }

    return {
      success: false,
      message: result.message || 'Momo hoàn tiền thất bại',
      resultCode: result.resultCode,
    };
  } catch (error) {
    console.error('Momo refund error:', error);
    return {
      success: false,
      message: 'Lỗi kết nối với Momo khi hoàn tiền',
      error: error.message,
    };
  }
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

/**
 * Tạo mã VietQR (thanh toán chuyển khoản Napas 2.0)
 * @param {Object} params
 * @param {string} params.orderId
 * @param {number} params.amount
 * @param {string} params.description
 * @returns {Promise<Object>}
 */
export const generateVietQRPayment = async (params) => {
  const { orderId, amount, description } = params;

  if (!VIETQR_CONFIG.accountNo || !VIETQR_CONFIG.accountName || !VIETQR_CONFIG.acqId) {
    return {
      success: false,
      message: 'VietQR chưa được cấu hình. Vui lòng bổ sung VIETQR_ACCOUNT_NO, VIETQR_ACCOUNT_NAME và VIETQR_ACQ_ID.',
    };
  }

  const amountInt = Math.round(Number(amount));
  if (Number.isNaN(amountInt) || amountInt <= 0) {
    return {
      success: false,
      message: 'Số tiền không hợp lệ để tạo VietQR.',
    };
  }

  const addInfo = (description || `Thanh toan hoa don ${orderId || ''}`).substring(0, 120);

  const payload = {
    accountNo: VIETQR_CONFIG.accountNo,
    accountName: VIETQR_CONFIG.accountName,
    acqId: Number(VIETQR_CONFIG.acqId),
    amount: amountInt,
    addInfo,
    template: VIETQR_CONFIG.template,
    format: VIETQR_CONFIG.format,
  };

  if (VIETQR_CONFIG.allowAmountEditable) {
    payload.amountEditable = true;
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (VIETQR_CONFIG.clientId) {
    headers['x-client-id'] = VIETQR_CONFIG.clientId;
  }

  if (VIETQR_CONFIG.apiKey) {
    headers['x-api-key'] = VIETQR_CONFIG.apiKey;
  }

  try {
    const response = await fetch(VIETQR_CONFIG.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if ((result?.code === '00' || result?.code === 0) && result?.data) {
      return {
        success: true,
        data: {
          qrDataURL: result.data.qrDataURL || null,
          qrCode: result.data.qrCode || null,
          bankName: result.data.bankName || result.data.accountName || VIETQR_CONFIG.accountName,
          accountNo: result.data.accountNo || VIETQR_CONFIG.accountNo,
          accountName: result.data.accountName || VIETQR_CONFIG.accountName,
          amount: result.data.amount || amountInt,
          addInfo: result.data.addInfo || addInfo,
          template: result.data.template || VIETQR_CONFIG.template,
          format: result.data.format || VIETQR_CONFIG.format,
          orderId,
        },
      };
    }

    return {
      success: false,
      message: result?.desc || result?.message || 'Không thể tạo mã VietQR. Vui lòng thử lại.',
    };
  } catch (error) {
    console.error('VietQR generate error:', error);
    return {
      success: false,
      message: 'Lỗi kết nối với VietQR.',
      error: error.message,
    };
  }
};

