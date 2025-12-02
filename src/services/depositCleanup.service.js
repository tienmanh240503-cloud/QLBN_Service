import { CuocHenKhamBenh, CuocHenTuVan, HoaDon } from '../models/index.js';
import { createAppointmentNotification } from '../helpers/notificationHelper.js';

const BOOKING_DEPOSIT_SWEEP_MS = Number(process.env.BOOKING_DEPOSIT_SWEEP_MS || 60000);

const isExpired = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline).getTime() < Date.now();
};

const cancelPendingAppointment = async (model, appointment, type) => {
  try {
    await model.update({ trang_thai: 'da_huy' }, appointment.id_cuoc_hen);
  } catch (error) {
    console.error('Failed to mark appointment as cancelled after deposit expiry', appointment?.id_cuoc_hen, error);
  }

  if (appointment.id_hoa_don_coc) {
    try {
      await HoaDon.update({ trang_thai: 'da_huy' }, appointment.id_hoa_don_coc);
    } catch (error) {
      console.error('Failed to cancel deposit invoice after expiry', appointment?.id_hoa_don_coc, error);
    }
  }

  try {
    await createAppointmentNotification(
      appointment.id_benh_nhan,
      'da_huy',
      appointment.id_cuoc_hen,
      appointment.ngay_kham,
      type === 'kham' ? appointment.id_bac_si : null,
      type === 'tu_van' ? appointment.id_chuyen_gia : null
    );
  } catch (error) {
    console.error('Failed to notify user about expired deposit', appointment?.id_cuoc_hen, error);
  }
};

const sweepModel = async (model, type) => {
  try {
    const pending = await model.findAll({ trang_thai: 'cho_thanh_toan' });
    if (!Array.isArray(pending) || pending.length === 0) {
      return;
    }

    const expired = pending.filter((item) => isExpired(item?.thoi_han_thanh_toan));
    await Promise.all(expired.map((item) => cancelPendingAppointment(model, item, type)));
  } catch (error) {
    console.error('Deposit sweep failed for model', type, error);
  }
};

export const startDepositExpirationWatcher = () => {
  if (startDepositExpirationWatcher._timer) {
    return;
  }

  const runSweep = async () => {
    await Promise.all([
      sweepModel(CuocHenKhamBenh, 'kham'),
      sweepModel(CuocHenTuVan, 'tu_van'),
    ]);
  };

  startDepositExpirationWatcher._timer = setInterval(runSweep, BOOKING_DEPOSIT_SWEEP_MS);
  if (typeof startDepositExpirationWatcher._timer.unref === 'function') {
    startDepositExpirationWatcher._timer.unref();
  }

  // Trigger initial sweep
  runSweep().catch((error) => console.error('Initial deposit sweep failed', error));
};



