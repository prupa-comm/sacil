import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Copy,
  Check,
  Server,
  Terminal,
  Layers,
  Code,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Member, Transaction, ClubSettings, WeekDefinition, InventoryItem, ClubAgenda } from '../types';
import { exportMySQLDump } from '../utils/storage';

interface MySQLGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  transactions: Transaction[];
  settings: ClubSettings;
  weeks: WeekDefinition[];
  inventory?: InventoryItem[];
  agendas?: ClubAgenda[];
}

export const MySQLGuideModal: React.FC<MySQLGuideModalProps> = ({
  isOpen,
  onClose,
  members,
  transactions,
  settings,
  weeks,
  inventory = [],
  agendas = []
}) => {
  const [activeTab, setActiveTab] = useState<'langkah' | 'tabel' | 'query' | 'api'>('langkah');
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuery(id);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Basis Data MySQL & REST API SACIL Basket
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Panduan instalasi, struktur tabel relasional, dan integrasi server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Download SQL Buttons) */}
        <div className="p-4 bg-orange-50/70 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-orange-900 dark:text-orange-300">
            <span className="font-bold">File SQL Siap Impor:</span> Tersedia skema DDL bawaan & live dump data terkini.
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/database/sacil_basket_mysql.sql"
              download="sacil_basket_mysql.sql"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-bold text-xs shadow-2xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Skema Bersih (.sql)</span>
            </a>
            <button
              onClick={() => exportMySQLDump(members, transactions, settings, weeks, inventory, agendas)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Live Data ke MySQL (.sql)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 bg-white dark:bg-slate-900 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('langkah')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'langkah'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Langkah Implementasi</span>
          </button>
          <button
            onClick={() => setActiveTab('tabel')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'tabel'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Daftar Tabel & Relasi</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'api'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>REST API Backend</span>
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeTab === 'query'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Query SQL Siap Pakai</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
          {activeTab === 'langkah' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Menyiapkan Database di MySQL / phpMyAdmin (XAMPP / Laragon / cPanel)
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>Buka <strong>XAMPP / Laragon</strong> dan hidupkan layanan <strong>MySQL</strong>.</li>
                  <li>Buka browser dan buka <code>http://localhost/phpmyadmin</code>.</li>
                  <li>Klik menu <strong>New / Basis Data</strong>, isi nama: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">sacil_basket_db</code>, pilih collation <code className="font-mono">utf8mb4_unicode_ci</code>, lalu klik <strong>Create</strong>.</li>
                  <li>Pilih database <code>sacil_basket_db</code>, klik tab <strong>Import</strong>.</li>
                  <li>Pilih berkas <code className="font-mono">sacil_basket_mysql.sql</code> yang Anda unduh dari tombol di atas, lalu klik <strong>Kirim / Import</strong>.</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Menjalankan REST API Backend (Node.js + Express)
                </h4>
                <p className="mb-2">
                  Folder <code className="font-mono">/backend-example</code> sudah berisi kode lengkap server backend siap pakai.
                </p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                  <p className="text-slate-400"># 1. Masuk ke direktori backend</p>
                  <p>cd backend-example</p>
                  <p className="text-slate-400"># 2. Pasang dependensi express & mysql2</p>
                  <p>npm install</p>
                  <p className="text-slate-400"># 3. Jalankan server</p>
                  <p>npm start</p>
                </div>
                <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Server akan aktif pada: <code>http://localhost:5000/api</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-black text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px]">3</span>
                  Mode Operasi: Offline-First + Sinkronisasi MySQL
                </h4>
                <p>
                  Aplikasi web ini menggunakan arsitektur <strong>Hybrid Offline-First</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-600 dark:text-slate-300">
                  <li>Data selalu tersimpan aman di peramban (browser) via LocalStorage/IndexedDB meskipun internet sekolah mati.</li>
                  <li>Ketika terkoneksi ke backend MySQL, aplikasi dapat melakukan sinkronisasi dua arah secara instan atau melalui tombol Ekspor/Impor MySQL Dump.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'tabel' && (
            <div className="space-y-4">
              <p className="text-slate-500">
                Skema MySQL dirancang dengan normalisasi 3NF dan integritas referensial (Foreign Key) untuk menjamin akurasi buku kas dan absensi iuran kas siswa:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase">
                      <th className="p-2.5">Nama Tabel</th>
                      <th className="p-2.5">Fungsi / Deskripsi</th>
                      <th className="p-2.5">Relasi (Foreign Keys)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">club_settings</td>
                      <td className="p-2.5">Konfigurasi organisasi SACIL, pembina, ketua, bendahara & saldo faktual</td>
                      <td className="p-2.5 text-slate-400">Master (1 baris)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">account_codes</td>
                      <td className="p-2.5">Bagan Akun Standar (COA): UM1, UK1-UK7, KK, KB</td>
                      <td className="p-2.5 text-slate-400">Master Kode Akun</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">week_definitions</td>
                      <td className="p-2.5">Definisi minggu iuran kas per semester (Juli M1 - September M4)</td>
                      <td className="p-2.5 text-slate-400">Master Kolom Matriks</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">members</td>
                      <td className="p-2.5">Data atlet basket (NIS, no punggung, posisi, kelas, gender, HP)</td>
                      <td className="p-2.5 text-slate-400">Induk Anggota (48 siswa)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">member_payments</td>
                      <td className="p-2.5">Matriks status setoran kas mingguan (paid, unpaid, off)</td>
                      <td className="p-2.5 font-mono text-[10px]">FK: member_id, week_id</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">transactions</td>
                      <td className="p-2.5">Buku Kas Umum / Ledger, nomor kuitansi BKM/BKK, struk, metode bayar</td>
                      <td className="p-2.5 font-mono text-[10px]">FK: account_code</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">inventory_items</td>
                      <td className="p-2.5">Inventaris logistik peralatan (UK4) & perlengkapan (UK3)</td>
                      <td className="p-2.5 font-mono text-[10px]">FK: source_transaction_id</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">club_agendas</td>
                      <td className="p-2.5">Jadwal latihan rutin, turnamen DBL/O2SN, sparring, lokasi & PIC</td>
                      <td className="p-2.5 text-slate-400">Jadwal Ekskul</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-orange-600">app_users</td>
                      <td className="p-2.5">Hak akses pengguna: bendahara (CRUD) & publik (Read-Only)</td>
                      <td className="p-2.5 text-slate-400">Autentikasi</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-600">v_ringkasan_keuangan</td>
                      <td className="p-2.5">VIEW: Total pemasukan, pengeluaran, dan saldo kas secara real-time</td>
                      <td className="p-2.5 text-emerald-500 font-bold">SQL View Otomatis</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-slate-500">
                Endpoint REST API yang disediakan oleh server Express (<code className="font-mono">/backend-example/server.js</code>):
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">GET</span>
                    <span>/api/members</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Ambil 48 anggota & matriks kas</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px]">PUT</span>
                    <span>/api/members/:memberId/payments/:weekId</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Update status iuran minggu siswa</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">GET</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">POST</span>
                    <span>/api/transactions</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Buku kas & catat mutasi kuitansi</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">GET</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">POST</span>
                    <span>/api/inventory</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Logistik sarana peralatan/perlengkapan</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">GET</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">POST</span>
                    <span>/api/agendas</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Jadwal latihan, kompetisi & rapat</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">GET</span>
                    <span>/api/stats</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Rekap saldo kas kecil, kas besar & kas total</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'query' && (
            <div className="space-y-4">
              <p className="text-slate-500">
                Berikut adalah contoh query SQL praktis untuk keperluan pembukuan dan pelaporan sekolah:
              </p>

              {/* Query 1 */}
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-white">1. Menampilkan 5 Siswa dengan Tunggakan Tertinggi</span>
                  <button
                    onClick={() => copyToClipboard(`SELECT name, grade, sub_class, min_weeks, (min_weeks * 5000) AS total_tunggakan_rp FROM members WHERE min_weeks > 0 ORDER BY min_weeks DESC LIMIT 5;`, 'q1')}
                    className="flex items-center gap-1 text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    {copiedQuery === 'q1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === 'q1' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] overflow-x-auto text-emerald-400">
{`SELECT name, grade, sub_class, min_weeks, (min_weeks * 5000) AS total_tunggakan_rp
FROM members 
WHERE min_weeks > 0 
ORDER BY min_weeks DESC 
LIMIT 5;`}
                </pre>
              </div>

              {/* Query 2 */}
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-white">2. Rekap Total Pemasukan vs Pengeluaran per Kategori Akun</span>
                  <button
                    onClick={() => copyToClipboard(`SELECT ac.code, ac.name, t.type, SUM(t.amount) AS total_nominal FROM transactions t JOIN account_codes ac ON t.account_code = ac.code GROUP BY ac.code, ac.name, t.type ORDER BY total_nominal DESC;`, 'q2')}
                    className="flex items-center gap-1 text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    {copiedQuery === 'q2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === 'q2' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] overflow-x-auto text-emerald-400">
{`SELECT ac.code, ac.name, t.type, SUM(t.amount) AS total_nominal
FROM transactions t
JOIN account_codes ac ON t.account_code = ac.code
GROUP BY ac.code, ac.name, t.type
ORDER BY total_nominal DESC;`}
                </pre>
              </div>

              {/* Query 3 */}
              <div className="p-3 rounded-2xl bg-slate-900 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold text-white">3. Total Aset & Kondisi Peralatan Inventaris Ekskul</span>
                  <button
                    onClick={() => copyToClipboard(`SELECT condition_state, COUNT(*) as jumlah_item, SUM(quantity) as total_unit, SUM(total_price) as total_nilai_aset FROM inventory_items GROUP BY condition_state;`, 'q3')}
                    className="flex items-center gap-1 text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    {copiedQuery === 'q3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQuery === 'q3' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] overflow-x-auto text-emerald-400">
{`SELECT condition_state, COUNT(*) as jumlah_item, SUM(quantity) as total_unit, SUM(total_price) as total_nilai_aset
FROM inventory_items
GROUP BY condition_state;`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Arsitektur teruji kompatibel MySQL 8.0+, MariaDB 10.4+, XAMPP & phpMyAdmin.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
