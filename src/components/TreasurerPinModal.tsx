import React, { useState } from 'react';
import { Lock, Unlock, X, KeyRound, ShieldAlert, Check, Eye, EyeOff, Settings } from 'lucide-react';
import { loadTreasurerPin, saveTreasurerPin, DEFAULT_TREASURER_PIN } from '../utils/storage';

interface TreasurerPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TreasurerPinModal: React.FC<TreasurerPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pinInput, setPinInput] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);

  // States for changing PIN
  const [currentPinVerify, setCurrentPinVerify] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmNewPin, setConfirmNewPin] = useState<string>('');
  const [changeSuccessMsg, setChangeSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const currentStoredPin = loadTreasurerPin();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (pinInput.trim() === currentStoredPin) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('PIN yang Anda masukkan salah. Silakan coba kembali.');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setChangeSuccessMsg('');

    if (currentPinVerify.trim() !== currentStoredPin) {
      setErrorMsg('PIN Lama tidak sesuai.');
      return;
    }
    if (newPin.trim().length < 4) {
      setErrorMsg('PIN Baru minimal terdiri dari 4 digit.');
      return;
    }
    if (newPin.trim() !== confirmNewPin.trim()) {
      setErrorMsg('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    saveTreasurerPin(newPin.trim());
    setChangeSuccessMsg('PIN Pengurus Bendahara berhasil diperbarui!');
    setCurrentPinVerify('');
    setNewPin('');
    setConfirmNewPin('');
    setTimeout(() => {
      setIsChangingPin(false);
      setChangeSuccessMsg('');
    }, 1500);
  };

  return (
    <div
      id="modal-treasurer-pin-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
    >
      <div
        id="card-treasurer-pin"
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {isChangingPin ? 'Ganti PIN Bendahara' : 'Kunci Akses Bendahara'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ekskul Basket SMAN 1 Cileunyi
              </p>
            </div>
          </div>
          <button
            id="btn-close-pin-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isChangingPin ? (
          <form onSubmit={handleVerify} className="p-5 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Masukkan PIN Pengurus untuk mengaktifkan izin modifikasi data, catat kas, dan hapus/edit anggota.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kode PIN Bendahara
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  id="input-treasurer-pin"
                  required
                  autoFocus
                  maxLength={12}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Masukkan PIN..."
                  className="w-full pl-4 pr-11 py-3 text-center tracking-widest text-lg font-mono font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg && (
                <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              )}
            </div>

            {/* Hint default PIN */}
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
              <span className="font-bold">PIN Bawaan Awal:</span>{' '}
              <code className="font-mono font-black bg-amber-200/60 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-950 dark:text-amber-100">
                {DEFAULT_TREASURER_PIN}
              </code>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                id="btn-submit-verify-pin"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-bold text-white shadow-md transition"
              >
                <Unlock className="w-4 h-4" />
                <span>Buka Akses Bendahara</span>
              </button>

              <button
                type="button"
                id="btn-switch-change-pin"
                onClick={() => {
                  setErrorMsg('');
                  setIsChangingPin(true);
                }}
                className="w-full py-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 text-center transition"
              >
                Ingin mengubah PIN pengurus? Klik di sini
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="p-5 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PIN Lama
              </label>
              <input
                type="password"
                required
                maxLength={12}
                value={currentPinVerify}
                onChange={(e) => setCurrentPinVerify(e.target.value)}
                placeholder="Masukkan PIN saat ini"
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                PIN Baru
              </label>
              <input
                type="password"
                required
                maxLength={12}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Minimal 4 digit"
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Konfirmasi PIN Baru
              </label>
              <input
                type="password"
                required
                maxLength={12}
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
                placeholder="Ulangi PIN baru"
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{errorMsg}</span>
              </p>
            )}

            {changeSuccessMsg && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{changeSuccessMsg}</span>
              </p>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setIsChangingPin(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition"
              >
                Simpan PIN Baru
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
