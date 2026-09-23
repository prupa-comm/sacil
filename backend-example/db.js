const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool koneksi MySQL dengan konfigurasi tangguh
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sacil_basket_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  decimalNumbers: true
});

// Tes koneksi database
pool.getConnection()
  .then(conn => {
    console.log('✅ Berhasil terhubung ke database MySQL: ' + (process.env.DB_NAME || 'sacil_basket_db'));
    conn.release();
  })
  .catch(err => {
    console.error('❌ Gagal terhubung ke database MySQL:', err.message);
  });

module.exports = pool;
