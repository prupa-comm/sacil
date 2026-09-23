-- ========================================================================
-- SISTEM INFORMASI KAS & KEUANGAN EKSKUL BASKET SMAN 1 CILEUNYI (SACIL)
-- RDBMS: MySQL 8.0+ / MariaDB 10.4+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- Generated for SMAN 1 Cileunyi Basketball Club
-- ========================================================================

CREATE DATABASE IF NOT EXISTS `sacil_basket_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `sacil_basket_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `system_logs`;
DROP TABLE IF EXISTS `club_agendas`;
DROP TABLE IF EXISTS `inventory_items`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `member_payments`;
DROP TABLE IF EXISTS `members`;
DROP TABLE IF EXISTS `week_definitions`;
DROP TABLE IF EXISTS `account_codes`;
DROP TABLE IF EXISTS `club_settings`;
DROP TABLE IF EXISTS `app_users`;
DROP VIEW IF EXISTS `v_rekap_kas_siswa`;
DROP VIEW IF EXISTS `v_buku_kas_umum`;
DROP VIEW IF EXISTS `v_ringkasan_keuangan`;
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================================================
-- 1. TABEL: app_users (Autentikasi & Hak Akses: Bendahara vs Publik)
-- ========================================================================
CREATE TABLE `app_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Bcrypt hash password / PIN',
  `full_name` VARCHAR(150) NOT NULL,
  `role` ENUM('bendahara', 'publik', 'superadmin') NOT NULL DEFAULT 'publik',
  `phone` VARCHAR(30) NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 2. TABEL: club_settings (Konfigurasi Organisasi & Posisi Kas Faktual)
-- ========================================================================
CREATE TABLE `club_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `school_name` VARCHAR(150) NOT NULL DEFAULT 'SMA Negeri 1 Cileunyi',
  `club_name` VARCHAR(150) NOT NULL DEFAULT 'Ekskul Basket SACIL',
  `academic_year` VARCHAR(30) NOT NULL DEFAULT '2026/2027',
  `weekly_dues_amount` DECIMAL(12,2) NOT NULL DEFAULT 5000.00 COMMENT 'Tarif iuran kas mingguan per siswa',
  `headmaster_name` VARCHAR(150) NOT NULL DEFAULT 'Drs. Caswanda, M.Ag.',
  `headmaster_nip` VARCHAR(50) NULL,
  `supervisor_name` VARCHAR(150) NOT NULL DEFAULT 'Drs. Caswanda, M.Ag.' COMMENT 'Pembina Ekskul',
  `supervisor_nip` VARCHAR(50) NULL DEFAULT '196809061994121003',
  `coach_name` VARCHAR(150) NOT NULL DEFAULT 'Coach Hendra Kurniawan',
  `president_name` VARCHAR(150) NOT NULL DEFAULT 'Teisya' COMMENT 'Ketua Ekskul',
  `treasurer_name` VARCHAR(150) NOT NULL DEFAULT 'Assyfa Sadina Elvariyani' COMMENT 'Bendahara Ekskul',
  `google_sheet_url` TEXT NULL,
  `active_week_id` VARCHAR(50) NOT NULL DEFAULT 'september_3' COMMENT 'Minggu berjalan acuan batas tunggakan',
  `treasurer_cash_on_hand` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Faktual Kas Kecil di tangan Bendahara',
  `president_cash_on_hand` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Faktual Kas Besar di tangan Ketua',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 3. TABEL: account_codes (Bagan Akun Standar / Chart of Accounts)
-- ========================================================================
CREATE TABLE `account_codes` (
  `code` VARCHAR(20) PRIMARY KEY COMMENT 'Contoh: UM1, UK1, UK3, UK4, UK7, KK, KB',
  `category` ENUM('UMUM', 'PENDAPATAN', 'PENGELUARAN', 'UTANG', 'PIUTANG', 'INVENTARIS') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `formula_or_ref` VARCHAR(200) NULL,
  `default_type` ENUM('pemasukan', 'pengeluaran') NULL,
  INDEX `idx_account_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 4. TABEL: week_definitions (Daftar Minggu Pertemuan Kas per Semester)
-- ========================================================================
CREATE TABLE `week_definitions` (
  `id` VARCHAR(50) PRIMARY KEY COMMENT 'Contoh: juli_1, agustus_3, september_3',
  `month` VARCHAR(30) NOT NULL COMMENT 'Juli, Agustus, September, Oktober, dst',
  `week_code` VARCHAR(10) NOT NULL COMMENT 'M1, M2, M3, M4, M5',
  `label` VARCHAR(50) NOT NULL COMMENT 'Juli M1, Agustus M2',
  `col_order` INT NOT NULL COMMENT 'Urutan kolom matriks',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  INDEX `idx_weeks_order` (`col_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 5. TABEL: members (Roster Anggota & Atlet Basket SMAN 1 Cileunyi)
-- ========================================================================
CREATE TABLE `members` (
  `id` VARCHAR(50) PRIMARY KEY,
  `student_id` VARCHAR(30) NOT NULL UNIQUE COMMENT 'NIS / ID Siswa unik e.g. 39-001, 40-001',
  `no_urut` INT NOT NULL,
  `batch` INT NOT NULL COMMENT '39 (Kelas 11) atau 40 (Kelas 10)',
  `name` VARCHAR(150) NOT NULL,
  `grade` ENUM('Kelas 10', 'Kelas 11', 'Kelas 12') NOT NULL,
  `sub_class` VARCHAR(50) NOT NULL COMMENT 'e.g. 11 F1-A, 10-A',
  `jersey_number` INT NOT NULL DEFAULT 0,
  `position` ENUM('Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center') NOT NULL DEFAULT 'Point Guard',
  `gender` ENUM('Putra', 'Putri', 'Pria', 'Wanita') NOT NULL,
  `birth_date` DATE NULL,
  `phone` VARCHAR(30) NULL COMMENT 'Dilindungi hak akses publik',
  `avatar_url` TEXT NULL COMMENT 'Foto profil atlet',
  `min_weeks` INT NOT NULL DEFAULT 0 COMMENT 'Jumlah minggu tunggakan',
  `plus_weeks` INT NOT NULL DEFAULT 0 COMMENT 'Jumlah minggu bayar di muka',
  `total_paid_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_members_grade` (`grade`),
  INDEX `idx_members_batch` (`batch`),
  INDEX `idx_members_gender` (`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 6. TABEL: member_payments (Matriks Setoran Kas Mingguan Anggota)
-- ========================================================================
CREATE TABLE `member_payments` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `member_id` VARCHAR(50) NOT NULL,
  `week_id` VARCHAR(50) NOT NULL,
  `status` ENUM('paid', 'unpaid', 'off') NOT NULL DEFAULT 'unpaid',
  `nominal` DECIMAL(12,2) NOT NULL DEFAULT 5000.00,
  `paid_date` DATE NULL,
  `note` VARCHAR(255) NULL,
  `receipt_number` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_member_week` (`member_id`, `week_id`),
  CONSTRAINT `fk_payments_member` FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_week` FOREIGN KEY (`week_id`) REFERENCES `week_definitions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_payment_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 7. TABEL: transactions (Buku Kas Umum / Ledger Pengeluaran & Pemasukan)
-- ========================================================================
CREATE TABLE `transactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `trans_date` DATE NOT NULL,
  `receipt_number` VARCHAR(60) NOT NULL UNIQUE COMMENT 'Nomor Kuitansi BKM / BKK',
  `account_code` VARCHAR(20) NULL,
  `type` ENUM('pemasukan', 'pengeluaran') NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `destination_account` ENUM('Kas Kecil (Bendahara)', 'Kas Besar (Ketua/Pembina)') NOT NULL DEFAULT 'Kas Kecil (Bendahara)',
  `payer_or_payee` VARCHAR(150) NULL,
  `payment_method` ENUM('Tunai', 'Transfer Bank / QRIS', 'Kolektif Bendahara') NOT NULL DEFAULT 'Tunai',
  `proof_url` LONGTEXT NULL COMMENT 'Base64 atau link foto struk kuitansi',
  `notes` TEXT NULL,
  `created_at` BIGINT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_transactions_account` FOREIGN KEY (`account_code`) REFERENCES `account_codes`(`code`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_trans_date` (`trans_date`),
  INDEX `idx_trans_type` (`type`),
  INDEX `idx_trans_dest_account` (`destination_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 8. TABEL: inventory_items (Inventaris Logistik Peralatan & Perlengkapan)
-- ========================================================================
CREATE TABLE `inventory_items` (
  `id` VARCHAR(50) PRIMARY KEY,
  `type` ENUM('peralatan', 'perlengkapan') NOT NULL COMMENT 'Peralatan (UK4 - Aset) vs Perlengkapan (UK3 - Habis Pakai)',
  `account_code` ENUM('UK3', 'UK4') NOT NULL DEFAULT 'UK4',
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit` VARCHAR(50) NOT NULL DEFAULT 'Buah',
  `condition_state` ENUM('Baik', 'Cukup', 'Perlu Perbaikan / Habis') NOT NULL DEFAULT 'Baik',
  `purchase_date` DATE NOT NULL,
  `unit_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `total_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `location` VARCHAR(150) NOT NULL DEFAULT 'Gudang Olahraga / Lemari Ekskul SMAN 1 Cileunyi',
  `source_transaction_id` VARCHAR(50) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_inventory_transaction` FOREIGN KEY (`source_transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_inventory_type` (`type`),
  INDEX `idx_inventory_condition` (`condition_state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 9. TABEL: club_agendas (Jadwal Latihan, Sparring, Turnamen, Acara)
-- ========================================================================
CREATE TABLE `club_agendas` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` ENUM('Latihan Rutin', 'Kompetisi / Turnamen', 'Diskusi / Briefing', 'Sparring / Uji Coba', 'Acara Lain') NOT NULL DEFAULT 'Latihan Rutin',
  `event_date` DATE NOT NULL,
  `event_time` VARCHAR(100) NOT NULL COMMENT 'e.g. 15:30 - 17:30 WIB',
  `location` VARCHAR(150) NOT NULL DEFAULT 'Lapangan Basket SMAN 1 Cileunyi',
  `description` TEXT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `target_audience` ENUM('Semua Anggota', 'Tim Putra', 'Tim Putri', 'Pengurus & Panitia') NOT NULL DEFAULT 'Semua Anggota',
  `pic` VARCHAR(150) NOT NULL DEFAULT 'Coach Hendra / Teisya',
  `created_at` BIGINT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_agenda_date` (`event_date`),
  INDEX `idx_agenda_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- 10. TABEL: system_logs (Audit Trail Transaksi & Perubahan Data)
-- ========================================================================
CREATE TABLE `system_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(50) NOT NULL COMMENT 'CREATE_TRANSACTION, UPDATE_PAYMENT, DELETE_ITEM',
  `entity_name` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(50) NULL,
  `actor_role` VARCHAR(50) NOT NULL DEFAULT 'bendahara',
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_logs_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================================
-- VIEWS: MEMUDAHKAN REKAP LAPORAN KEUANGAN & AUDIT KAS
-- ========================================================================

-- View 1: Rekap Arus Kas Berjalan (Pemasukan, Pengeluaran, Saldo Kumulatif)
CREATE OR REPLACE VIEW `v_buku_kas_umum` AS
SELECT 
  t.`id`,
  t.`trans_date`,
  t.`receipt_number`,
  t.`account_code`,
  ac.`name` AS `account_name`,
  t.`type`,
  t.`category`,
  t.`description`,
  t.`destination_account`,
  t.`payment_method`,
  t.`payer_or_payee`,
  CASE WHEN t.`type` = 'pemasukan' THEN t.`amount` ELSE 0 END AS `debit_in`,
  CASE WHEN t.`type` = 'pengeluaran' THEN t.`amount` ELSE 0 END AS `credit_out`,
  t.`amount`,
  t.`notes`
FROM `transactions` t
LEFT JOIN `account_codes` ac ON t.`account_code` = ac.`code`
ORDER BY t.`trans_date` ASC, t.`created_at` ASC;

-- View 2: Ringkasan Total Saldo Kas Besar, Kas Kecil, Total Masuk & Keluar
CREATE OR REPLACE VIEW `v_ringkasan_keuangan` AS
SELECT 
  COALESCE(SUM(CASE WHEN `type` = 'pemasukan' THEN `amount` ELSE 0 END), 0) AS `total_pemasukan`,
  COALESCE(SUM(CASE WHEN `type` = 'pengeluaran' THEN `amount` ELSE 0 END), 0) AS `total_pengeluaran`,
  COALESCE(SUM(CASE WHEN `type` = 'pemasukan' THEN `amount` ELSE -`amount` END), 0) AS `saldo_organisasi`,
  COALESCE(SUM(CASE 
    WHEN `destination_account` = 'Kas Kecil (Bendahara)' AND `type` = 'pemasukan' THEN `amount`
    WHEN `destination_account` = 'Kas Kecil (Bendahara)' AND `type` = 'pengeluaran' THEN -`amount`
    ELSE 0 
  END), 0) AS `saldo_kas_kecil_bendahara`,
  COALESCE(SUM(CASE 
    WHEN `destination_account` = 'Kas Besar (Ketua/Pembina)' AND `type` = 'pemasukan' THEN `amount`
    WHEN `destination_account` = 'Kas Besar (Ketua/Pembina)' AND `type` = 'pengeluaran' THEN -`amount`
    ELSE 0 
  END), 0) AS `saldo_kas_besar_ketua`
FROM `transactions`;

-- View 3: Rekap Kepatuhan Iuran Kas per Anggota
CREATE OR REPLACE VIEW `v_rekap_kas_siswa` AS
SELECT 
  m.`id` AS `member_id`,
  m.`student_id`,
  m.`no_urut`,
  m.`name`,
  m.`grade`,
  m.`sub_class`,
  m.`jersey_number`,
  m.`gender`,
  COUNT(CASE WHEN mp.`status` = 'paid' THEN 1 END) AS `total_minggu_lunas`,
  COUNT(CASE WHEN mp.`status` = 'unpaid' THEN 1 END) AS `total_minggu_belum_bayar`,
  COUNT(CASE WHEN mp.`status` = 'off' THEN 1 END) AS `total_minggu_libur`,
  COALESCE(SUM(CASE WHEN mp.`status` = 'paid' THEN mp.`nominal` ELSE 0 END), 0) AS `total_iuran_terbayar`,
  m.`min_weeks`,
  m.`plus_weeks`
FROM `members` m
LEFT JOIN `member_payments` mp ON m.`id` = mp.`member_id`
GROUP BY m.`id`, m.`student_id`, m.`no_urut`, m.`name`, m.`grade`, m.`sub_class`, m.`jersey_number`, m.`gender`, m.`min_weeks`, m.`plus_weeks`;

-- ========================================================================
-- DATA AWAL / SEED DATA (SMAN 1 CILEUNYI)
-- ========================================================================

-- Akun Pengguna Default (PIN default bendahara: 2026 / 123456)
INSERT INTO `app_users` (`username`, `password_hash`, `full_name`, `role`, `phone`) VALUES
('bendahara', '$2b$10$wO8q9rJ25zU32k1k9wL5uevG8H6Xq3Q5lW6YdE0o5R1k1s6U5q6eW', 'Assyfa Sadina Elvariyani', 'bendahara', '085794567890'),
('ketua', '$2b$10$wO8q9rJ25zU32k1k9wL5uevG8H6Xq3Q5lW6YdE0o5R1k1s6U5q6eW', 'Teisya', 'bendahara', '085712345678'),
('publik', 'NO_PASSWORD', 'Wali Siswa & Anggota SACIL', 'publik', NULL);

-- Konfigurasi Awal
INSERT INTO `club_settings` (
  `id`, `school_name`, `club_name`, `academic_year`, `weekly_dues_amount`, 
  `headmaster_name`, `headmaster_nip`, `supervisor_name`, `supervisor_nip`, 
  `coach_name`, `president_name`, `treasurer_name`, `google_sheet_url`, 
  `active_week_id`, `treasurer_cash_on_hand`, `president_cash_on_hand`
) VALUES (
  1, 'SMA Negeri 1 Cileunyi', 'Ekskul Basket SACIL', '2026/2027', 5000.00,
  'Drs. Caswanda, M.Ag.', NULL, 'Drs. Caswanda, M.Ag.', '196809061994121003',
  'Coach Hendra Kurniawan', 'Teisya', 'Assyfa Sadina Elvariyani',
  'https://docs.google.com/spreadsheets/d/1yF9Sa3Mi94_IlDwocckF8cl6yrUqid7anQLqO31Ndt0/edit',
  'september_3', 385000.00, 500000.00
);

-- Bagan Akun (Chart of Accounts / COA)
INSERT INTO `account_codes` (`code`, `category`, `name`, `description`, `formula_or_ref`, `default_type`) VALUES
('SA', 'UMUM', 'Saldo Awal atau Pindahan Saldo', 'Saldo kas dari bulan sebelumnya', 'Saldo Awal Bulan Berjalan = Saldo Akhir Bulan Lalu', NULL),
('SB', 'UMUM', 'Saldo Akhir Bulan Berjalan', 'Total kas tersisa di akhir periode', 'Saldo Akhir = Pendapatan - Pengeluaran', NULL),
('KK', 'UMUM', 'Kas Kecil (Bendahara)', 'Dana operasional di tangan bendahara', '', NULL),
('KB', 'UMUM', 'Kas Besar (Ketua/Pembina)', 'Dana cadangan di tangan ketua/pembina', '', NULL),
('UM1', 'PENDAPATAN', 'Setoran Wajib Kas Peserta Ekskul', 'Iuran mingguan anggota Rp 5.000/minggu', '', 'pemasukan'),
('UM2', 'PENDAPATAN', 'Setoran Sukarela Peserta Ekskul', 'Uang pembinaan / partisipasi sukarela', '', 'pemasukan'),
('UM3', 'PENDAPATAN', 'Donasi/Sumbangan Perorangan (Non Sekolah)', 'Donasi alumni atau pemerhati basket', '', 'pemasukan'),
('UK1', 'PENGELUARAN', 'Biaya Air Minum / Konsumsi Latihan', 'Galon, es batu, dan makanan latihan', '', 'pengeluaran'),
('UK2', 'PENGELUARAN', 'Biaya Transportasi Latihan & Tanding', 'Transportasi kegiatan atau sparring', '', 'pengeluaran'),
('UK3', 'PENGELUARAN', 'Biaya Perlengkapan Habis Pakai', 'P3K, spidol, baterai, peluit, lakban', '', 'pengeluaran'),
('UK4', 'PENGELUARAN', 'Biaya Peralatan / Aset Olahraga', 'Pembelian bola basket, jaring ring, cone', '', 'pengeluaran'),
('UK5', 'PENGELUARAN', 'Honorarium Pelatih / Wasit', 'Insentif coach dan official pertandingan', '', 'pengeluaran'),
('UK6', 'PENGELUARAN', 'Pendaftaran Turnamen / Lomba', 'Biaya registrasi kompetisi DBL, O2SN, Cup', '', 'pengeluaran'),
('UK7', 'PENGELUARAN', 'Biaya Tak Terduga / Lain-Lain', 'Pengeluaran darurat operasional', '', 'pengeluaran');

-- Definisi Minggu Iuran (Juli s.d. September 2026)
INSERT INTO `week_definitions` (`id`, `month`, `week_code`, `label`, `col_order`, `is_active`) VALUES
('juli_1', 'Juli', 'M1', 'Juli M1', 1, TRUE),
('juli_2', 'Juli', 'M2', 'Juli M2', 2, TRUE),
('juli_3', 'Juli', 'M3', 'Juli M3', 3, TRUE),
('juli_4', 'Juli', 'M4', 'Juli M4', 4, TRUE),
('agustus_1', 'Agustus', 'M1', 'Agustus M1', 5, TRUE),
('agustus_2', 'Agustus', 'M2', 'Agustus M2', 6, TRUE),
('agustus_3', 'Agustus', 'M3', 'Agustus M3', 7, TRUE),
('agustus_4', 'Agustus', 'M4', 'Agustus M4', 8, TRUE),
('agustus_5', 'Agustus', 'M5', 'Agustus M5', 9, TRUE),
('september_1', 'September', 'M1', 'September M1', 10, TRUE),
('september_2', 'September', 'M2', 'September M2', 11, TRUE),
('september_3', 'September', 'M3', 'September M3', 12, TRUE),
('september_4', 'September', 'M4', 'September M4', 13, TRUE);

-- Jadwal Agenda Ekskul (Latihan, Sparring & Turnamen)
INSERT INTO `club_agendas` (`id`, `title`, `category`, `event_date`, `event_time`, `location`, `description`, `is_active`, `target_audience`, `pic`, `created_at`) VALUES
('agenda-1', 'Latihan Rutin Fundamental & Shooting Drills', 'Latihan Rutin', '2026-09-25', '15:30 - 17:30 WIB', 'Lapangan Basket SMAN 1 Cileunyi', 'Fokus latihan form shooting, fastbreak drill, dan transisi offense-defense.', TRUE, 'Semua Anggota', 'Coach Hendra Kurniawan', 1790400000000),
('agenda-2', 'Sparring Match vs SMAN 1 Rancaekek', 'Sparring / Uji Coba', '2026-09-28', '15:00 - 18:00 WIB', 'GOR Basket Cileunyi', 'Uji tanding persahabatan tim Putra & Putri menghadapi rival wilayah Bandung Timur.', TRUE, 'Semua Anggota', 'Teisya (Ketua Ekskul)', 1790600000000),
('agenda-3', 'Technical Meeting & Briefing O2SN / DBL Cup', 'Diskusi / Briefing', '2026-10-02', '16:00 - 17:00 WIB', 'Ruang Multimedia SMAN 1 Cileunyi', 'Sosialisasi regulasi turnamen, pembagian jersey pertandingan, dan koordinasi administrasi siswa.', TRUE, 'Pengurus & Panitia', 'Assyfa (Bendahara)', 1790900000000);

-- Data Inventaris Awal
INSERT INTO `inventory_items` (`id`, `type`, `account_code`, `name`, `category`, `quantity`, `unit`, `condition_state`, `purchase_date`, `unit_price`, `total_price`, `location`, `notes`) VALUES
('inv-1', 'peralatan', 'UK4', 'Bola Basket Molten GG7X Official', 'Bola Basket', 6, 'Buah', 'Baik', '2026-07-15', 450000.00, 2700000.00, 'Gudang Olahraga SMAN 1 Cileunyi', 'Bola kompetisi resmi latihan'),
('inv-2', 'peralatan', 'UK4', 'Agility Cones Latihan Kelincahan', 'Alat Latihan', 20, 'Buah', 'Baik', '2026-07-20', 15000.00, 300000.00, 'Lemari Ekskul Basket', 'Set cone kerucut latihan dribble'),
('inv-3', 'peralatan', 'UK4', 'Pompa Bola Manual & Digital Gauge', 'Perawatan', 2, 'Buah', 'Baik', '2026-07-18', 125000.00, 250000.00, 'Lemari Ekskul Basket', 'Lengkap dengan jarum pentil cadangan'),
('inv-4', 'perlengkapan', 'UK3', 'Paket Obat P3K, Spray Pain Relief & Kasa', 'Medis & P3K', 2, 'Set', 'Baik', '2026-08-05', 180000.00, 360000.00, 'Tas Medis Lapangan', 'Selalu dibawa saat latihan dan pertandingan');

-- Contoh Transaksi Awal Kas
INSERT INTO `transactions` (
  `id`, `trans_date`, `receipt_number`, `account_code`, `type`, `category`, 
  `description`, `amount`, `destination_account`, `payer_or_payee`, `payment_method`, `created_at`
) VALUES
('trx-001', '2026-07-01', 'BKM-2026-001', 'SA', 'pemasukan', 'Saldo Awal', 'Pindahan Saldo Kas Awal Tahun Ajaran 2026/2027', 650000.00, 'Kas Besar (Ketua/Pembina)', 'Pengurus Lama Angkatan 38', 'Transfer Bank / QRIS', 1782800000000),
('trx-002', '2026-07-28', 'BKM-2026-002', 'UM1', 'pemasukan', 'Iuran Kas Siswa', 'Penerimaan Kas Mingguan Kolektif Siswa Kelas 10 & 11 (Juli)', 480000.00, 'Kas Kecil (Bendahara)', 'Kolektif Siswa Kelas 10 & 11', 'Kolektif Bendahara', 1785200000000),
('trx-003', '2026-08-04', 'BKK-2026-001', 'UK1', 'pengeluaran', 'Konsumsi', 'Pembelian 6 Galon Air Minum & Es Batu untuk Latihan Rutin', 60000.00, 'Kas Kecil (Bendahara)', 'Depot Air Mineral Cileunyi', 'Tunai', 1785800000000),
('trx-004', '2026-08-15', 'BKK-2026-002', 'UK3', 'pengeluaran', 'Peralatan/Perlengkapan', 'Pembelian Spray Pereda Nyeri & Perban Elastis P3K', 85000.00, 'Kas Kecil (Bendahara)', 'Apotek Kimia Farma Cileunyi', 'Tunai', 1786800000000);

-- Catatan:
-- Data 48 Anggota & Matriks Iuran Mingguan dapat di-generate otomatis 
-- melalui tombol "Ekspor SQL Lengkap" di menu 'Laporan & Sync' pada aplikasi!
