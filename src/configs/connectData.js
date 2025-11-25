import mysql from "mysql2";
import { DB_CONFID } from "./db.config.js"

// Tạo connection pool với cấu hình tối ưu
const pool = mysql.createPool({
    ...DB_CONFID.mysql_connect,
    waitForConnections: true,
    connectionLimit: 10, // Số lượng connection tối đa trong pool
    queueLimit: 0, // Không giới hạn số request chờ
    enableKeepAlive: true, // Giữ connection sống
    keepAliveInitialDelay: 0, // Không delay khi keep alive
});

// Export pool để sử dụng với promise style (mysql2/promise)
export const poolPromise = pool.promise();

// Export pool với callback style để tương thích với code cũ (db.query)
// Pool cũng hỗ trợ .query() method giống như connection
const db = {
    query: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        return pool.query(sql, params, callback);
    },
    // Thêm các method khác nếu cần
    getConnection: (callback) => {
        return pool.getConnection(callback);
    },
    // Expose pool để có thể dùng trực tiếp nếu cần
    pool: pool
};

// Test connection khi khởi động
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('✅ Database connection pool initialized successfully');
    connection.release(); // Trả connection về pool
});

export default db;