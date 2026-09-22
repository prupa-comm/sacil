import React, { useState } from 'react';
import { X, PlusCircle, ArrowDownCircle, ArrowUpCircle, Camera, Check, Upload, Trash2 } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../data/initialData';
import { compressImageFile } from '../utils/storage';

interface TransactionModalProps {
  initialType?: TransactionType;
  onSave: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  initialType = 'pemasukan',
  onSave,
  onClose
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const initialCategoryFull = initialType === 'pemasukan' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0];
  const [category, setCategory] = useState<string>(
    initialCategoryFull.split(' - ').slice(1).join(' - ') || initialCategoryFull
  );
  const [accountCode, setAccountCode] = useState<string>(
    initialCategoryFull.split(' - ')[0] || (initialType === 'pemasukan' ? 'UM1' : 'UK1')
  );
  const [destinationAccount, setDestinationAccount] = useState<'Kas Kecil (Bendahara)' | 'Kas Besar (Ketua/Pembina)'>('Kas Kecil (Bendahara)');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [payerOrPayee, setPayerOrPayee] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank / QRIS' | 'Kolektif Bendahara'>('Tunai');
  const [notes, setNotes] = useState<string>('');
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const [isCompressingProof, setIsCompressingProof] = useState(false);

  const autoReceiptNumber = `${type === 'pemasukan' ? 'BKM' : 'BKK'}/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const catList = newType === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const firstCat = catList[0];
    const code = firstCat.split(' - ')[0];
    const cleanCat = firstCat.split(' - ').slice(1).join(' - ') || firstCat;
    setCategory(cleanCat);
    setAccountCode(code);
  };

  const handleCategorySelect = (fullCatString: string) => {
    const parts = fullCatString.split(' - ');
    const code = parts[0]?.trim();
    const cleanCat = parts.slice(1).join(' - ').trim() || fullCatString;
    setCategory(cleanCat);
    setAccountCode(code);

    if (code === 'UM7') {
      setDestinationAccount('Kas Kecil (Bendahara)');
      if (!description) setDescription('Setor dari Kas Besar Ke Kas Kecil');
      if (!payerOrPayee) setPayerOrPayee('Teh Teisya (Ketua) / Pembina');
    } else if (code === 'UK7') {
      setDestinationAccount('Kas Besar (Ketua/Pembina)');
      if (!description) setDescription('Penyetoran Kas Kecil Ke Kas Besar (Teh Teisya)');
      if (!payerOrPayee) setPayerOrPayee('Teh Teisya (Ketua Ekskul)');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressingProof(true);
      const compressedDataUrl = await compressImageFile(file, 900, 0.75);
      setProofPreview(compressedDataUrl);
    } catch (err) {
      console.error('Failed to compress receipt photo', err);
      // Fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingProof(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount.replace(/\D/g, ''), 10);
    if (isNaN(num) || num <= 0) {
      alert('Masukkan nominal yang valid');
      return;
    }
    if (!description.trim()) {
      alert('Uraian transaksi tidak boleh kosong');
      return;
    }

    onSave({
      date,
      receiptNumber: autoReceiptNumber,
      accountCode,
      destinationAccount,
      type,
      category,
      description: description.trim(),
      amount: num,
      payerOrPayee: payerOrPayee.trim() || undefined,
      paymentMethod,
      notes: notes.trim() || undefined,
      proofUrl: proofPreview || undefined
    });
    onClose();
  };

  return (
    <div id="modal-transaction-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${type === 'pemasukan' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'}`}>
              {type === 'pemasukan' ? <ArrowDownCircle className="w-5 h-5" /> : <ArrowUpCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Catat Transaksi Kas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ekskul Basket SMAN 1 Cileunyi</p>
            </div>
          </div>
          <button
            id="btn-close-transaction-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              id="btn-type-pemasukan"
              onClick={() => handleTypeChange('pemasukan')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                type === 'pemasukan'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>Kas Masuk (Pemasukan)</span>
            </button>
            <button
              type="button"
              id="btn-type-pengeluaran"
              onClick={() => handleTypeChange('pengeluaran')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
                type === 'pengeluaran'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4" />
              <span>Kas Keluar (Pengeluaran)</span>
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nominal Transaksi (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
              <input
                type="text"
                id="input-transaction-amount"
                required
                placeholder="Contoh: 150.000"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (!val) {
                    setAmount('');
                  } else {
                    setAmount(Number(val).toLocaleString('id-ID'));
                  }
                }}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-base focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal *
              </label>
              <input
                type="date"
                id="input-transaction-date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori *
              </label>
              <select
                id="select-transaction-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                {(type === 'pemasukan' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Uraian / Keterangan Transaksi *
            </label>
            <input
              type="text"
              id="input-transaction-desc"
              required
              placeholder={type === 'pemasukan' ? 'Contoh: Uang kas kelas 10 sesi latihan Sabtu' : 'Contoh: Sewa Lapangan GOR Indoor Cileunyi'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Payer/Payee & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {type === 'pemasukan' ? 'Pihak Penyetor / Sumber' : 'Pihak Penerima / Vendor'}
              </label>
              <input
                type="text"
                id="input-transaction-party"
                placeholder={type === 'pemasukan' ? 'Siswa / Kesiswaan' : 'Coach / Toko Sport'}
                value={payerOrPayee}
                onChange={(e) => setPayerOrPayee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Metode Pembayaran
              </label>
              <select
                id="select-transaction-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer Bank / QRIS">Transfer Bank / QRIS</option>
                <option value="Kolektif Bendahara">Kolektif Bendahara</option>
              </select>
            </div>
          </div>

          {/* Receipt / Proof Upload (Camera friendly on smartphone) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Foto Bukti Nota / Kwitansi (Opsional)
            </label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <label
                  htmlFor="input-transaction-proof-camera"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil Foto Kamera</span>
                </label>
                <input
                  type="file"
                  id="input-transaction-proof-camera"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="input-transaction-proof-file"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih dari Galeri</span>
                </label>
                <input
                  type="file"
                  id="input-transaction-proof-file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {isCompressingProof && (
                  <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold animate-pulse">
                    Mengompres & menyimpan foto...
                  </span>
                )}
              </div>

              {proofPreview && (
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/50">
                  <img
                    src={proofPreview}
                    alt="Pratinjau Bukti"
                    className="w-14 h-14 object-cover rounded-xl border-2 border-orange-500 shadow-xs flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      Foto Nota Berhasil Dilampirkan
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                      ✓ Siap disimpan ke Buku Kas & Laporan
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProofPreview(null)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition flex-shrink-0"
                    title="Hapus foto nota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Tambahan
            </label>
            <textarea
              id="input-transaction-notes"
              rows={2}
              placeholder="Catatan verifikasi atau rincian spesifik..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancel-transaction"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-transaction"
              disabled={isCompressingProof}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50 ${
                type === 'pemasukan' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompressingProof ? 'Memproses Foto...' : 'Simpan Transaksi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
