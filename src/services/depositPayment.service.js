import { createMomoPayment } from './payment.service.js';

const SERVER_PUBLIC_URL = (process.env.SERVER_PUBLIC_URL || 'http://localhost:5005').replace(/\/$/, '');
const BOOKING_DEPOSIT_AMOUNT = Number(process.env.BOOKING_DEPOSIT_AMOUNT || 100000);
const BOOKING_DEPOSIT_TIMEOUT_MINUTES = Number(process.env.BOOKING_DEPOSIT_TIMEOUT_MINUTES || 1440);

const resolveGatewayMode = () => (process.env.MOMO_GATEWAY_MODE || 'mock').trim().toLowerCase();
const allowMockFallback = () => (process.env.MOMO_ALLOW_MOCK_FALLBACK || 'true').trim().toLowerCase() !== 'false';

const buildExtraPayload = ({
  invoiceId,
  appointmentId,
  appointmentType,
  patientId,
  doctorId,
  specialistId,
  depositDeadline,
}) => ({
  invoiceId,
  appointmentId,
  appointmentType,
  deposit: true,
  depositAmount: BOOKING_DEPOSIT_AMOUNT,
  depositDeadline: depositDeadline.toISOString(),
  patientId,
  doctorId,
  specialistId,
});

const buildMockSession = (invoiceId, depositDeadline) => ({
  provider: 'momo',
  mode: 'mock',
  paymentUrl: `${SERVER_PUBLIC_URL}/api/payment/mock/momo/${invoiceId}`,
  qrCodeUrl: process.env.MOMO_MOCK_QR_URL || null,
  instructions:
    process.env.MOMO_MOCK_NOTE ||
    'Trang thanh toán mô phỏng MoMo - nhấn "Thanh toán" để hoàn tất giao dịch.',
  expiresAt: depositDeadline.toISOString(),
  orderId: invoiceId,
});

export const createDepositPaymentSession = async ({
  invoiceId,
  appointmentId,
  appointmentType,
  depositDeadline,
  patientId,
  doctorId,
  specialistId,
}) => {
  const gatewayMode = resolveGatewayMode();

  if (gatewayMode !== 'gateway') {
    return buildMockSession(invoiceId, depositDeadline);
  }

  const extraPayload = buildExtraPayload({
    invoiceId,
    appointmentId,
    appointmentType,
    patientId,
    doctorId,
    specialistId,
    depositDeadline,
  });

  const paymentResult = await createMomoPayment({
    orderId: invoiceId,
    amount: BOOKING_DEPOSIT_AMOUNT,
    orderInfo: `Thanh toan tien coc lich ${appointmentType} ${appointmentId}`,
    extraData: Buffer.from(JSON.stringify(extraPayload)).toString('base64'),
  });

  if (paymentResult.success) {
    return {
      provider: 'momo',
      mode: 'gateway',
      paymentUrl: paymentResult.paymentUrl,
      qrCodeUrl: paymentResult.qrCodeUrl || null,
      orderId: paymentResult.orderId || invoiceId,
      expiresAt: depositDeadline.toISOString(),
    };
  }

  if (allowMockFallback()) {
    console.warn(
      '[MoMo] Gateway trả về lỗi, chuyển sang chế độ mô phỏng:',
      paymentResult.message || 'unknown error'
    );
    return buildMockSession(invoiceId, depositDeadline);
  }

  throw new Error(paymentResult.message || 'Không thể khởi tạo thanh toán cọc MoMo');
};

export const isMockMomoMode = () => resolveGatewayMode() !== 'gateway';


