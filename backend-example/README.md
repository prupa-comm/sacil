# 🏀 Panduan Implementasi Database MySQL & REST API
## Aplikasi Kas & Keuangan Ekskul Basket SMAN 1 Cileunyi (SACIL)

Panduan ini menjelaskan langkah demi langkah untuk mengimplementasikan basis data **MySQL** ke dalam aplikasi Kas Basket SACIL, baik untuk lingkungan lokal (XAMPP / Laragon) maupun server cloud/hosting (cPanel / VPS / Railway).

---

## 📁 Struktur Berkas yang Disediakan
- `/database/sacil_basket_mysql.sql` : Skema DDL lengkap, relasi foreign key, indeks, views akuntansi, dan data awal.
- `/public/database/sacil_basket_mysql.sql` : Berkas SQL siap unduh langsung dari antarmuka web.
- `/backend-example/server.js` : REST API Express.js lengkap dengan seluruh endpoint kas, anggota, inventaris, dan agenda.
- `/backend-example/db.js` : Modul koneksi pool MySQL (`mysql2/promise`).
- `/backend-example/.env.example` : Template variabel konfigurasi database.

---

## 🛠️ Langkah 1: Menyiapkan Database MySQL

### Opsi A: Menggunakan XAMPP / Laragon (Lokal Windows/Mac)
1. Buka aplikasi **XAMPP Control Panel** atau **Laragon**, lalu klik **Start** pada modul **Apache** dan **MySQL**.
2. Buka browser dan akses **phpMyAdmin**:
   ```
   http://localhost/phpmyadmin
   ```
3. Klik tab **"Databases" / "Basis Data"**, buat database baru dengan nama:
   ```
   sacil_basket_db
   ```
   *(Pilih collation: `utf8mb4_unicode_ci`)*.
4. Klik database `sacil_basket_db` yang baru dibuat, lalu buka tab **"Import"**.
5. Klik **"Choose File"**, pilih file `/database/sacil_basket_mysql.sql`.
6. Klik tombol **"Import" / "Kirim"** di bagian bawah. Seluruh tabel, view akuntansi, dan data awal akan terbentuk otomatis.

### Opsi B: Menggunakan Terminal / Command Line (Linux / VPS / Mac)
```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan query import langsung
CREATE DATABASE sacil_basket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import berkas SQL
mysql -u root -p sacil_basket_db < ./database/sacil_basket_mysql.sql
```

### Opsi C: Menggunakan cPanel Hosting Sekolah
1. Masuk ke cPanel hosting -> menu **"MySQL Database Wizard"**.
2. Buat database (misal: `sekolah_sacil_basket`), user database, dan password yang kuat.
3. Masuk ke **phpMyAdmin** di cPanel, pilih database tersebut, lalu klik tab **Import** dan pilih `sacil_basket_mysql.sql`.

---

## 🚀 Langkah 2: Menjalankan Server REST API Backend

Backend menggunakan Node.js dan Express yang ringan dan cepat.

1. Buka terminal dan masuk ke folder `backend-example`:
   ```bash
   cd backend-example
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` dari `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Sesuaikan file `.env` dengan kredensial MySQL Anda:
   ```ini
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=sacil_basket_db
   ```

5. Jalankan backend:
   ```bash
   npm start
   # atau untuk mode pengembangan auto-reload:
   npm run dev
   ```
   Jika berhasil, Anda akan melihat pesan:
   ```
   ✅ Berhasil terhubung ke database MySQL: sacil_basket_db
   🚀 Server Kas Basket SACIL MySQL berjalan di port 5000
   ```

---

## 🌐 Langkah 3: Menghubungkan Frontend React ke Backend MySQL

Aplikasi saat ini telah dirancang dengan arsitektur **Hybrid**:
- **Offline / Local**: Menggunakan `localStorage` (tetap bisa digunakan tanpa server).
- **Online / MySQL Mode**: Cukup arahkan panggilan API ke endpoint backend Express (`http://localhost:5000/api`).

### Contoh Panggilan dari Frontend:
```typescript
// Mengambil daftar anggota dari MySQL:
const response = await fetch('http://localhost:5000/api/members');
const members = await response.json();

// Menambah transaksi baru ke MySQL:
await fetch('http://localhost:5000/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newTransaction)
});
```

---

## 📊 Daftar Tabel & Relasi dalam MySQL

| Nama Tabel | Deskripsi | Keterangan Relasi |
| :--- | :--- | :--- |
| `club_settings` | Konfigurasi SMAN 1 Cileunyi, Pembina, Ketua, & Posisi Kas Faktual | Single row config |
| `app_users` | Autentikasi Bendahara, Ketua, & Akses Publik | Hash Bcrypt |
| `account_codes` | Bagan Akun Standar (COA: UM1, UK1..UK7) | Master Akun Keuangan |
| `week_definitions`| Definisi Minggu Kas (Juli M1 - September M4) | Master Kolom Matriks |
| `members` | 48 Anggota & Atlet Basket SACIL | Induk Data Siswa |
| `member_payments`| Catatan Iuran Mingguan per Siswa | Foreign Key ke `members` & `week_definitions` |
| `transactions` | Buku Kas Umum (BKM/BKK, Struk, Bukti Pembayaran) | Foreign Key ke `account_codes` |
| `inventory_items`| Logistik Peralatan (UK4) & Perlengkapan (UK3) | Foreign Key ke `transactions` |
| `club_agendas` | Jadwal Latihan Rutin, Sparring, & Turnamen | Jadwal Ekskul |
| `system_logs` | Audit Trail Mutasi Kas & Aktivitas | Riwayat Keamanan |

---

## 🛡️ Keamanan & Rekomendasi Produksi
1. **Password Hashing**: Simpan password bendahara selalu dengan `bcrypt` atau Argon2.
2. **Reverse Proxy & SSL**: Gunakan Nginx atau Cloudflare SSL (`https://`) jika di-hosting online.
3. **Backup Otomatis**: Buat cron job di server untuk melakukan dump otomatis harian:
   ```bash
   mysqldump -u root -p sacil_basket_db > /backup/sacil_$(date +%F).sql
   ```
