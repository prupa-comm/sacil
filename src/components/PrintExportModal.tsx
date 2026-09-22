import React, { useState } from 'react';
import { X, FileDown, Printer, ExternalLink, CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { exportElementToPdf, openInNewTabForPrint, printHtmlElement } from '../utils/printHelper';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetElementId: string;
  documentTitle: string;
  defaultFilename?: string;
  documentSubtitle?: string;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  targetElementId,
  documentTitle,
  defaultFilename = 'Dokumen-Kas-Basket-SACIL.pdf',
  documentSubtitle = 'SMAN 1 Cileunyi • Ekstrakurikuler Bola Basket'
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setSuccess(false);
    setStatusMessage('Merender tata letak dokumen...');

    try {
      const cleanFilename = defaultFilename.endsWith('.pdf') ? defaultFilename : `${defaultFilename}.pdf`;
      const ok = await exportElementToPdf(targetElementId, cleanFilename, (msg) => {
        setStatusMessage(msg);
      });

      if (ok) {
        setSuccess(true);
        setStatusMessage('Berkas PDF berhasil diunduh ke perangkat Anda!');
        setTimeout(() => {
          setSuccess(false);
          setStatusMessage('');
        }, 4000);
      } else {
        setStatusMessage('Gagal merender PDF, silakan gunakan Cetak di Tab Baru.');
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Terjadi kesalahan saat membuat PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenNewTab = () => {
    openInNewTabForPrint(targetElementId, documentTitle);
  };

  const handleDirectPrint = () => {
    printHtmlElement(targetElementId, documentTitle);
  };

  return (
    <div
      id="modal-print-export-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="modal-print-export-container"
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Cetak & Ekspor Dokumen</h3>
              <p className="text-[11px] text-slate-300">Format Resmi Standar SMAN 1 Cileunyi</p>
            </div>
          </div>
          <button
            id="btn-close-print-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-slate-700 dark:text-slate-200">
          {/* Document Summary Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{documentTitle}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {documentSubtitle}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>Ukuran: A4 Portrait</span>
              <span>•</span>
              <span>Kop & Cap Resmi Sesuai Standar</span>
            </div>
          </div>

          {/* Feedback Status */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                success
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300'
              }`}
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{statusMessage}</span>
            </div>
          )}

          {/* Action Options */}
          <div className="space-y-2.5 pt-1">
            {/* Primary: Direct PDF Download */}
            <button
              id="btn-download-pdf-direct"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <FileDown className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-xs font-extrabold">Unduh Berkas PDF (.pdf)</div>
                  <div className="text-[10px] text-orange-100 font-normal">
                    Unduh file PDF resmi langsung ke memori perangkat
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] uppercase font-mono">
                Rekomendasi
              </span>
            </button>

            {/* Secondary: Open in New Tab for Printing */}
            <button
              id="btn-print-new-tab"
              onClick={handleOpenNewTab}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-700 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold">Buka & Cetak di Tab Baru</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    Membuka halaman cetak mandiri bebas batasan iframe
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Buka Tab →</span>
            </button>

            {/* Tertiary: Standard Browser Print */}
            <button
              id="btn-print-browser-direct"
              onClick={handleDirectPrint}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-800 transition active:scale-98 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Printer className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-medium">Cetak Langsung Dialog Browser (Ctrl + P)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Format didukung: PDF & Kertas A4</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
