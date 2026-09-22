import React from 'react';
import { X, Download, Camera, FileText, Calendar, Tag, CreditCard } from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/storage';

interface ReceiptPhotoModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptPhotoModal: React.FC<ReceiptPhotoModalProps> = ({
  transaction,
  onClose
}) => {
  if (!transaction || !transaction.proofUrl) return null;

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = transaction.proofUrl!;
    link.download = `Nota-${transaction.receiptNumber.replace(/[\/\\]/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isIncome = transaction.type === 'pemasukan';

  return (
    <div
      id="modal-receipt-photo-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="card-receipt-photo"
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Foto Bukti Fisik / Kwitansi</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {transaction.receiptNumber}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Arsip digital mutasi kas Ekskul Basket SACIL
              </p>
            </div>
          </div>
          <button
            id="btn-close-receipt-photo"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="p-4 bg-slate-950 flex items-center justify-center min-h-[260px] max-h-[480px] overflow-hidden">
          <img
            src={transaction.proofUrl}
            alt={`Bukti Transaksi ${transaction.receiptNumber}`}
            className="max-h-[440px] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
          />
        </div>

        {/* Transaction Details Card */}
        <div className="p-5 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-medium text-slate-500">Uraian Transaksi</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white">
                {transaction.description}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] font-medium text-slate-500">Nominal</span>
              <p
                className={`text-lg font-black font-mono ${
                  isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isIncome ? '+' : '-'}{formatRupiah(transaction.amount)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 text-[10px] block">Tanggal</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDateIndo(transaction.date)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <span className="text-slate-400 text-[10px] block">Kode Rekening</span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
                {transaction.accountCode || '-'}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] block">Metode Pembayaran</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {transaction.paymentMethod}
              </span>
            </div>
          </div>

          {transaction.notes && (
            <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Catatan: </span>
              <span>{transaction.notes}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas Foto</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
