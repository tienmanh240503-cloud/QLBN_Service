import { poolPromise } from '../configs/connectData.js';

/**
 * Ensure hoadon.phuong_thuc_thanh_toan enum supports all payment channels we use in code.
 * This runs on server start and is idempotent.
 */
export const ensurePaymentMethodEnum = async () => {
  const requiredValues = ['tien_mat', 'chuyen_khoan', 'the', 'vi_dien_tu', 'momo', 'vnpay'];
  try {
    const [columns] = await poolPromise.query("SHOW COLUMNS FROM hoadon LIKE 'phuong_thuc_thanh_toan'");
    if (!Array.isArray(columns) || columns.length === 0) {
      console.warn('⚠️ Cannot find phuong_thuc_thanh_toan column on hoadon table.');
      return;
    }

    const column = columns[0];
    const columnType = column.Type || column.COLUMN_TYPE || '';
    const missingValues = requiredValues.filter((value) => !columnType.includes(`'${value}'`));

    if (missingValues.length === 0) {
      return;
    }

    const enumDefinition = "ENUM('tien_mat','chuyen_khoan','the','vi_dien_tu','momo','vnpay')";
    await poolPromise.query(
      `ALTER TABLE hoadon MODIFY COLUMN phuong_thuc_thanh_toan ${enumDefinition} DEFAULT NULL`
    );
    console.log('✅ hoadon.phuong_thuc_thanh_toan enum updated to support momo & vnpay.');
  } catch (error) {
    console.warn('⚠️ Unable to ensure payment method enum, continuing without migration.', error);
  }
};

