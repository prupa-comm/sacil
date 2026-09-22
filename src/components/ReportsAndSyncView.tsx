import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  Printer,
  ExternalLink,
  Database,
  FileCheck,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { Member, Transaction, ClubSettings, WeekDefinition, UserRole } from '../types';
import {
  formatRupiah,
  formatDateIndo,
  exportBackupJSON,
  exportGoogleSheetCSV,
  exportTransactionsCSV,
  calculateCashPositions
} from '../utils/storage';
import { printHtmlElement } from '../utils/printHelper';
import { PrintExportModal } from './PrintExportModal';

interface ReportsAndSyncViewProps {
  members: Member[];
  transactions: Transaction[];
  settings: ClubSettings;
  weeks: WeekDefinition[];
  userRole?: UserRole;
  onRestoreBackup: (data: { members: Member[]; transactions: Transaction[]; settings?: ClubSettings }) => void;
  onResetData: () => void;
}

export const ReportsAndSyncView: React.FC<ReportsAndSyncViewProps> = ({
  members,
  transactions,
  settings,
  weeks,
  userRole = 'publik',
  onRestoreBackup,
  onResetData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSubTab, setActiveSubTab] = useState<'lpj' | 'sync'>('lpj');
  const [restoreSuccess, setRestoreSuccess] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // In public mode, enforce LPJ sub-tab only
  const currentSubTab = userRole === 'bendahara' ? activeSubTab : 'lpj';

  // Dynamic cash position calculations from ledger
  const cashPositions = calculateCashPositions(transactions);
  const totalIncome = cashPositions.totalIncome;
  const totalExpense = cashPositions.totalExpense;
  const currentBalance = cashPositions.totalOrganizationCash;

  // Latest transaction date or current date
  const latestTrxDate = transactions.length > 0
    ? [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)[0].date
    : new Date().toISOString().slice(0, 10);

  // Breakdown by Category
  const incomeByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'pemasukan')
    .forEach((t) => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });

  const expenseByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'pengeluaran')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.members && parsed.transactions) {
          onRestoreBackup(parsed);
          setRestoreSuccess(true);
          setTimeout(() => setRestoreSuccess(false), 4000);
        } else {
          alert('Format berkas cadangan tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Tab Header (hidden on print) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-orange-600" />
            <span>
              {userRole === 'bendahara'
                ? 'Laporan Keuangan & Sinkronisasi Hybrid'
                : 'Laporan Pertanggungjawaban Kas (LPJ)'}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {userRole === 'bendahara'
              ? 'Laporan Pertanggungjawaban (LPJ), cadangan lokal on-premise, dan Google Sheet'
              : 'Laporan Pertanggungjawaban (LPJ) resmi kas ekskul basket SMA Negeri 1 Cileunyi'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'bendahara' && (
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveSubTab('lpj')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentSubTab === 'lpj'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Laporan LPJ Resmi
              </button>
              <button
                onClick={() => setActiveSubTab('sync')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  currentSubTab === 'sync'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Hybrid & Backup
              </button>
            </div>
          )}

          {currentSubTab === 'lpj' && (
            <button
              id="btn-print-lpj"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-bold text-white shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF</span>
            </button>
          )}
        </div>
      </div>

      {restoreSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 print:hidden">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Data berhasil dipulihkan dari berkas cadangan!</span>
        </div>
      )}

      {/* SUB-TAB 1: Laporan Pertanggungjawaban (LPJ) Resmi */}
      {currentSubTab === 'lpj' && (
        <div
          id="printable-lpj-document"
          className="rounded-2xl bg-white text-slate-900 shadow-sm border border-slate-200 p-6 sm:p-8 print:p-0 print:border-none print:shadow-none"
        >
          {/* KOP SURAT RESMI SMAN 1 CILEUNYI */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-between gap-4">
              <img
                src="/assets/logo-sman1-cileunyi.png"
                alt="Logo SMAN 1 Cileunyi"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
              />
              <div className="flex-1">
                <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-700 uppercase">
                  PEMERINTAH DAERAH PROVINSI JAWA BARAT
                </h2>
                <h2 className="text-xs sm:text-sm font-bold tracking-widest text-slate-700 uppercase">
                  DINAS PENDIDIKAN
                </h2>
                <h1 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-tight">
                  {settings.schoolName}
                </h1>
                <h3 className="text-xs sm:text-sm font-extrabold text-orange-700 uppercase tracking-wider">
                  EKSTRAKURIKULER BOLA BASKET ({settings.clubName})
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-600 mt-0.5">
                  Jl. Raya Cileunyi No. 1, Cileunyi, Kab. Bandung, Jawa Barat
                </p>
              </div>
              <img
                src="/assets/logo-basket-sacil.png"
                alt="Logo Basket SACIL"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
              />
            </div>
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <h3 className="font-extrabold text-sm sm:text-base tracking-tight uppercase underline">
              LAPORAN KAS & KEUANGAN EKSKUL BASKET
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Periode Tahun Ajaran {settings.academicYear}
            </p>
          </div>

          {/* Executive Summary Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl border border-slate-200 bg-emerald-50/50">
              <span className="text-[11px] font-semibold text-slate-600 block">Total Pemasukan (Debet)</span>
              <span className="font-mono font-black text-sm sm:text-base text-emerald-700">
                {formatRupiah(totalIncome)}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-rose-50/50">
              <span className="text-[11px] font-semibold text-slate-600 block">Total Pengeluaran (Kredit)</span>
              <span className="font-mono font-black text-sm sm:text-base text-rose-700">
                {formatRupiah(totalExpense)}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-orange-50/50">
              <span className="text-[11px] font-semibold text-slate-600 block">Total Saldo Kas Organisasi</span>
              <span className="font-mono font-black text-sm sm:text-base text-orange-700">
                {formatRupiah(currentBalance)}
              </span>
            </div>
          </div>

          {/* Posisi Saldo Kas Faktual */}
          <div className="mt-4 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-2 tracking-wide">
              Posisi Kas Faktual per {formatDateIndo(latestTrxDate)}:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Kas Kecil di Tangan Bendahara ({settings.treasurerName})</span>
                <span className="font-mono font-bold text-sm text-emerald-700">
                  {formatRupiah(cashPositions.kasKecil)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Kas Besar Disetor ke Ketua/Pembina ({settings.presidentName})</span>
                <span className="font-mono font-bold text-sm text-blue-700">
                  {formatRupiah(cashPositions.kasBesar)}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Pemasukan & Pengeluaran Side-by-Side */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rincian Pemasukan */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-700 text-white px-3 py-2 text-xs font-bold flex justify-between">
                <span>A. REKAP PEMASUKAN</span>
                <span>JUMLAH</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(incomeByCategory).map(([cat, amt], idx) => (
                  <div key={cat} className="px-3 py-2 flex justify-between">
                    <span className="text-slate-700">{idx + 1}. {cat}</span>
                    <span className="font-mono font-semibold text-slate-900">{formatRupiah(amt)}</span>
                  </div>
                ))}
                <div className="px-3 py-2 bg-slate-50 font-bold flex justify-between border-t-2 border-slate-200">
                  <span>TOTAL PEMASUKAN</span>
                  <span className="font-mono text-emerald-700">{formatRupiah(totalIncome)}</span>
                </div>
              </div>
            </div>

            {/* Rincian Pengeluaran */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-rose-700 text-white px-3 py-2 text-xs font-bold flex justify-between">
                <span>B. REKAP PENGELUARAN</span>
                <span>JUMLAH</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(expenseByCategory).map(([cat, amt], idx) => (
                  <div key={cat} className="px-3 py-2 flex justify-between">
                    <span className="text-slate-700">{idx + 1}. {cat}</span>
                    <span className="font-mono font-semibold text-slate-900">{formatRupiah(amt)}</span>
                  </div>
                ))}
                <div className="px-3 py-2 bg-slate-50 font-bold flex justify-between border-t-2 border-slate-200">
                  <span>TOTAL PENGELUARAN</span>
                  <span className="font-mono text-rose-700">{formatRupiah(totalExpense)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Iuran Anggota */}
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-800 text-white px-3 py-2 text-xs font-bold">
              <span>C. STATUS SETORAN KAS MINGGUAN ANGGOTA ({members.length} Siswa)</span>
            </div>
            <div className="p-3 text-xs grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50/50">
              {['Kelas 10', 'Kelas 11', 'Kelas 12'].map((grd) => {
                const list = members.filter(m => m.grade === grd);
                const nunggak = list.filter(m => m.minWeeks > 0).length;
                const totalNunggakNominal = list.reduce((s, m) => s + m.minWeeks, 0) * settings.weeklyDuesAmount;
                return (
                  <div key={grd} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <p className="font-bold text-slate-800">{grd} ({list.length} Siswa)</p>
                    <p className="text-slate-500 mt-1">Lunas: <strong>{list.length - nunggak} Siswa</strong></p>
                    <p className="text-rose-600 font-medium">Tunggakan: {nunggak} Siswa ({formatRupiah(totalNunggakNominal)})</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signature Section */}
          <div className="mt-8 pt-4 grid grid-cols-2 text-center text-xs text-slate-800 break-inside-avoid">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Pembina Ekskul Bola Basket</p>
              <div className="h-16 flex items-center justify-center"></div>
              <p className="font-bold underline">Drs. Caswanda, M.Ag.</p>
              <p className="text-[11px] text-slate-500 font-mono">NIP. 196809061994121003</p>
            </div>
            <div>
              <p>Cileunyi, {formatDateIndo(latestTrxDate)}</p>
              <p className="font-semibold">Bendahara Ekskul Basket</p>
              <div className="h-16 relative flex items-center justify-center">
                <img
                  src="/assets/sacil-basket-stempel.png"
                  alt="Stempel Resmi SACIL"
                  className="w-20 h-20 object-contain opacity-90 -rotate-6 pointer-events-none drop-shadow-xs"
                />
              </div>
              <p className="font-bold underline">{settings.treasurerName}</p>
              <p className="text-[11px] text-slate-500">Ekskul Basket SMAN 1 Cileunyi</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Hybrid, Backup & Google Sheet Integration (Bendahara only) */}
      {userRole === 'bendahara' && currentSubTab === 'sync' && (
        <div className="space-y-4">
          {/* Google Sheet Sync Direct Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tautan Google Drive & Google Sheet Resmi
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Folder acuan data kas ekskul basket yang disertakan pada arahan strategis
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  LAPORAN KEUANGAN BASKET (SMAN 1 CILEUNYI)
                </p>
                <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                  Folder ID: 1s7Xv2B0gqMuc7ql88fjgT7d1XW8m03zz
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://drive.google.com/drive/folders/1s7Xv2B0gqMuc7ql88fjgT7d1XW8m03zz"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Drive</span>
                </a>
                <a
                  href="https://docs.google.com/spreadsheets/d/1yF9Sa3Mi94_IlDwocckF8cl6yrUqid7anQLqO31Ndt0/edit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Google Sheet</span>
                </a>
              </div>
            </div>
          </div>

          {/* Local On-Premise Backup & Restore Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Penyimpanan On-Premise / Hybrid Lokal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cadangkan dan pulihkan seluruh basis data anggota, mutasi kas, dan kuitansi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Unduh Backup */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-orange-600" />
                  <span>Ekspor Cadangan Lengkap (.JSON)</span>
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Simpan seluruh data ke dalam 1 berkas aman. Berkas ini dapat dipindahkan ke komputer sekolah atau HP bendahara baru.
                </p>
                <button
                  id="btn-export-backup-json"
                  onClick={() => exportBackupJSON(members, transactions, settings, weeks)}
                  className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-bold text-white shadow-xs transition"
                >
                  Unduh Berkas Cadangan (.JSON)
                </button>
              </div>

              {/* Impor / Pulihkan Backup */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Pulihkan Data dari Cadangan (.JSON)</span>
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unggah berkas JSON cadangan untuk mengembalikan seluruh data kas secara instan.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  id="btn-trigger-upload-backup"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white shadow-xs transition"
                >
                  Pilih & Unggah Berkas (.JSON)
                </button>
              </div>
            </div>

            {/* Reset to Factory Defaults */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">Muat Ulang Data Awal SMAN 1 Cileunyi</p>
                <p className="text-[11px] text-slate-500">Kembalikan ke data bawaan Google Sheet 48 anggota SACIL Basket.</p>
              </div>
              <button
                id="btn-reset-data"
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin memuat ulang ke data awal bawaan Google Sheet?')) {
                    onResetData();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Reset Data Awal
              </button>
            </div>
          </div>
        </div>
      )}
      <PrintExportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        targetElementId="printable-lpj-document"
        documentTitle={`LPJ Kas Basket SACIL - ${settings.schoolName}`}
        defaultFilename={`LPJ-Kas-Basket-SACIL-${settings.academicYear.replace('/', '-')}.pdf`}
        documentSubtitle="Laporan Pertanggungjawaban Resmi Keuangan & Kas Ekstrakurikuler Bola Basket"
      />
    </div>
  );
};
