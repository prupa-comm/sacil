import React, { useState } from 'react';
import { Download, Smartphone, CheckCircle, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, show a discreet badge or return null
  if (isInstalled) {
    return (
      <div id="pwa-installed-badge" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Terinstal di Ponsel</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install-android"
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition"
        title="Pasang aplikasi di layar utama Android"
      >
        <Smartphone className="w-4 h-4" />
        <span>Pasang di HP</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-orange-300 dark:border-orange-500/40 bg-orange-50 dark:bg-orange-950/40 px-3 py-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Pasang di iOS</span>
        </button>

        {showIOSGuide && (
          <div id="modal-ios-install" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  Pasang di iPhone / iPad
                </h3>
                <button
                  id="btn-close-ios-guide"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center text-xs">1</span>
                  <p>Buka tautan ini di peramban <strong>Safari</strong> pada iPhone/iPad Anda.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center text-xs">2</span>
                  <p>Tekan tombol <strong>Bagikan / Share</strong> (ikon kotak panah ke atas di bilah navigasi bawah).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold flex items-center justify-center text-xs">3</span>
                  <p>Gulir ke bawah dan pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</p>
                </div>
              </div>
              <button
                id="btn-confirm-close-ios"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
