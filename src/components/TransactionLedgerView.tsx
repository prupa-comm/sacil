import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Download,
  Search,
  Filter,
  Trash2,
  Image as ImageIcon,
  Receipt,
  FileSpreadsheet,
  ArrowUpDown,
  Tag,
  Building2,
  Lock,
  Eye,
  Camera
} from 'lucide-react';
import { Transaction, ClubSettings, UserRole } from '../types';
import { formatRupiah, formatDateIndo, exportTransactionsCSV } from '../utils/storage';
import { ReceiptPhotoModal } from './ReceiptPhotoModal';

interface TransactionLedgerViewProps {
  transactions: Transaction[];
  settings: ClubSettings;
  userRole: UserRole;
  onOpenAddModal: () => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionLedgerView: React.FC<TransactionLedgerViewProps> = ({
  transactions,
  settings,
  userRole,
  onOpenAddModal,
  onDeleteTransaction
}) => {
  const [filterType, setFilterType] = useState<'semua' | 'pemasukan' | 'pengeluaran'>('semua');
  const [selectedCoa, setSelectedCoa] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProofTrx, setSelectedProofTrx] = useState<Transaction | null>(null);
  const [trxToDelete, setTrxToDelete] = useState<Transaction | null>(null);

  // Sort ascending by date for running balance
  const sortedAsc = [...transactions].sort((a, b) => {
    const d = a.date.localeCompare(b.date);
    if (d !== 0) return d;
    return a.createdAt - b.createdAt;
  });

  // Calculate running balance
  let running = 0;
  const withRunningBalance = sortedAsc.map((t) => {
    if (t.type === 'pemasukan') {
      running += t.amount;
    } else {
      running -= t.amount;
    }
    return { ...t, runningBalance: running };
  });

  // Display descending (latest first)
  const displayList = [...withRunningBalance].reverse().filter((t) => {
    if (filterType !== 'semua' && t.type !== filterType) return false;
    if (selectedCoa !== 'semua') {
      if (!t.accountCode || !t.accountCode.startsWith(selectedCoa)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchReceipt = t.receiptNumber.toLowerCase().includes(q);
      const matchCat = t.category.toLowerCase().includes(q);
      const matchParty = (t.payerOrPayee || '').toLowerCase().includes(q);
      const matchCoa = (t.accountCode || '').toLowerCase().includes(q);
      if (!matchDesc && !matchReceipt && !matchCat && !matchParty && !matchCoa) return false;
    }
    return true;
  });

  const totalIn = transactions.filter(t => t.type === 'pemasukan').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'pengeluaran').reduce((s, t) => s + t.amount, 0);
  const runningEndBalance = totalIn - totalOut;

  return (
    <div className="space-y-4">
      {/* Header & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-orange-600" />
              <span>Buku Kas Umum (BKU) Ekskul Basket</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pencatatan mutasi kas debet & kredit resmi SMA Negeri 1 Cileunyi sesuai Kodefikasi Rekening
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-export-bku-csv"
              onClick={() => exportTransactionsCSV(transactions, settings)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-white shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor BKU CSV</span>
            </button>

            {userRole === 'bendahara' && (
              <button
                id="btn-add-transaction-bku"
                onClick={onOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-bold text-white shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Catat Transaksi</span>
              </button>
            )}
          </div>
        </div>

        {/* Running Balance Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Total Penerimaan (Debet):</span>
            <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              +{formatRupiah(totalIn)}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Total Pengeluaran (Kredit):</span>
            <p className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">
              -{formatRupiah(totalOut)}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Saldo Kas Akhir:</span>
            <p className="text-base font-black text-slate-900 dark:text-white font-mono">
              {formatRupiah(runningEndBalance)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-2.5">
          {/* Type Segment Control */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0">
            <button
              onClick={() => setFilterType('semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === 'semua'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('pemasukan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === 'pemasukan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setFilterType('pengeluaran')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === 'pengeluaran'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Keluar
            </button>
          </div>

          {/* Account Code Filter */}
          <select
            value={selectedCoa}
            onChange={(e) => setSelectedCoa(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            <option value="semua">Semua Kodefikasi Rekening</option>
            <option value="UM1">UM1 - Setoran Wajib Kas Siswa</option>
            <option value="UK1">UK1 - Administrasi & Surat</option>
            <option value="UK2">UK2 - Operasional Lapangan</option>
            <option value="UK7">UK7 - Setor Kas Kecil ke Kas Besar (Pembina)</option>
          </select>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-transaction"
              placeholder="Cari uraian, nomor kuitansi, atau pihak terkait..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3 font-bold text-center min-w-[45px]">NO</th>
                <th className="py-3 px-3 font-bold min-w-[95px]">TANGGAL</th>
                <th className="py-3 px-3 font-bold min-w-[130px]">NO BUKTI / KODE</th>
                <th className="py-3 px-4 font-bold min-w-[200px]">URAIAN / KETERANGAN</th>
                <th className="py-3 px-3 font-bold min-w-[110px]">PIHAK TERKAIT</th>
                <th className="py-3 px-3 font-bold text-right min-w-[110px] text-emerald-700 dark:text-emerald-400">
                  DEBET (MASUK)
                </th>
                <th className="py-3 px-3 font-bold text-right min-w-[110px] text-rose-700 dark:text-rose-400">
                  KREDIT (KELUAR)
                </th>
                <th className="py-3 px-3 font-bold text-right min-w-[115px]">SALDO AKHIR</th>
                {userRole === 'bendahara' && (
                  <th className="py-3 px-2 font-bold text-center min-w-[60px]">AKSI</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayList.length === 0 ? (
                <tr>
                  <td
                    colSpan={userRole === 'bendahara' ? 9 : 8}
                    className="py-12 text-center text-slate-400 font-medium"
                  >
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                displayList.map((trx, idx) => {
                  const isIncome = trx.type === 'pemasukan';

                  return (
                    <tr
                      key={trx.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* NO */}
                      <td className="py-3 px-3 font-mono text-center text-slate-400">
                        {idx + 1}
                      </td>

                      {/* TANGGAL */}
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {trx.date}
                      </td>

                      {/* NO BUKTI & KODE REKENING */}
                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">
                          {trx.receiptNumber}
                        </div>
                        {trx.accountCode && (
                          <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{trx.accountCode}</span>
                          </span>
                        )}
                      </td>

                      {/* URAIAN & BUKTI FOTO */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {trx.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {trx.category} {trx.paymentMethod ? `• ${trx.paymentMethod}` : ''}
                          </span>
                          {trx.proofUrl && (
                            <button
                              type="button"
                              onClick={() => setSelectedProofTrx(trx)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 hover:bg-orange-200 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 text-[10px] font-bold border border-orange-200 dark:border-orange-800 transition cursor-pointer"
                              title="Buka foto nota/kwitansi fisik"
                            >
                              <Camera className="w-3 h-3 text-orange-600" />
                              <span>Lihat Nota Foto</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* PIHAK TERKAIT */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {trx.payerOrPayee || '-'}
                      </td>

                      {/* DEBET (MASUK) */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        {isIncome ? formatRupiah(trx.amount) : '-'}
                      </td>

                      {/* KREDIT (KELUAR) */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                        {!isIncome ? formatRupiah(trx.amount) : '-'}
                      </td>

                      {/* SALDO AKHIR */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap bg-slate-50/50 dark:bg-slate-800/30">
                        {formatRupiah(trx.runningBalance || 0)}
                      </td>

                      {/* AKSI (Bendahara only) */}
                      {userRole === 'bendahara' && (
                        <td className="py-3 px-2 text-center">
                          <button
                            id={`btn-delete-trx-${trx.id}`}
                            onClick={() => setTrxToDelete(trx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                            title="Hapus transaksi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {trxToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Konfirmasi Hapus Transaksi
                </h4>
              </div>
              <button
                onClick={() => setTrxToDelete(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Apakah Anda yakin ingin menghapus data transaksi ini dari Buku Kas Umum (BKU)? Tindakan ini akan memperbarui saldo akhir secara otomatis.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatDateIndo(trxToDelete.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uraian / Deskripsi:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px] truncate">{trxToDelete.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis & Nominal:</span>
                  <span className={`font-mono font-black ${trxToDelete.type === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {trxToDelete.type === 'pemasukan' ? '+ ' : '- '}
                    {formatRupiah(trxToDelete.amount)}
                  </span>
                </div>
                {trxToDelete.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Bukti / Kuitansi:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{trxToDelete.receiptNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrxToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  id="btn-confirm-delete-trx"
                  onClick={() => {
                    onDeleteTransaction(trxToDelete.id);
                    setTrxToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
                >
                  Ya, Hapus Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt / Nota Photo Lightbox Modal */}
      {selectedProofTrx && (
        <ReceiptPhotoModal
          transaction={selectedProofTrx}
          onClose={() => setSelectedProofTrx(null)}
        />
      )}
    </div>
  );
};
