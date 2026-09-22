import React, { useState } from 'react';
import { X, Printer, CheckCircle, Share2, Plus, Minus } from 'lucide-react';
import { Member, ClubSettings } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/storage';
import { printHtmlElement } from '../utils/printHelper';
import { PrintExportModal } from './PrintExportModal';

interface ReceiptModalProps {
  member: Member;
  amount: number;
  weeksPaidCount: number;
  paymentDate: string;
  receiptNumber: string;
  notes?: string;
  settings: ClubSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  member,
  amount: initialAmount,
  weeksPaidCount: initialWeeksCount,
  paymentDate,
  receiptNumber,
  notes,
  settings,
  onClose
}) => {
  const [weeksCount, setWeeksCount] = useState<number>(initialWeeksCount || 1);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const totalAmount = weeksCount * settings.weeklyDuesAmount;

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleShareWA = () => {
    const text = `*KUITANSI RESMI SETORAN KAS BASKET SACIL*
SMAN 1 CILEUNYI
-----------------------------------
No. Kuitansi: ${receiptNumber}
Tanggal: ${formatDateIndo(paymentDate)}
Nama Siswa: ${member.name}
Kelas: ${member.grade} (${member.subClass})
Nomor Jersey: #${member.jerseyNumber}
Jumlah Dibayar: ${formatRupiah(totalAmount)} (${weeksCount} Minggu @${formatRupiah(settings.weeklyDuesAmount)})
Status Tunggakan: ${member.minWeeks > 0 ? `${member.minWeeks} Minggu (${formatRupiah(member.minWeeks * settings.weeklyDuesAmount)})` : 'LUNAS / Bebas Tunggakan'}
Catatan: ${notes || 'Setoran kas mingguan ekskul basket'}
-----------------------------------
Terima kasih atas kontribusinya untuk kemajuan Ekskul Basket SACIL!
_Bendahara Basket SACIL - SMAN 1 Cileunyi_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div id="modal-receipt-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div id="receipt-card-container" className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Bar - hidden on print */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Kuitansi Pembayaran Kas</span>
          </div>
          <button
            id="btn-close-receipt"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Week adjustment control - print:hidden */}
        <div className="px-6 py-2.5 bg-orange-50 dark:bg-orange-950/40 border-b border-orange-200 flex items-center justify-between text-xs print:hidden">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Setel Jumlah Pekan Dibayar:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeeksCount(Math.max(1, weeksCount - 1))}
              className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono font-bold text-orange-700 px-2">{weeksCount} Minggu</span>
            <button
              type="button"
              onClick={() => setWeeksCount(weeksCount + 1)}
              className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Receipt Body (Print Area) */}
        <div id="printable-receipt" className="p-6 text-slate-800 bg-amber-50/20 border-b border-dashed border-slate-300">
          {/* Header with Dual Logos */}
          <div className="flex items-center justify-between gap-3 border-b-2 border-slate-900 pb-3">
            <img
              src="/assets/logo-sman1-cileunyi.png"
              alt="Logo SMAN 1 Cileunyi"
              className="w-12 h-12 object-contain"
            />
            <div className="flex-1 text-center min-w-0">
              <h4 className="font-extrabold text-xs tracking-tight text-slate-900 uppercase leading-tight">
                EKSTRAKURIKULER BOLA BASKET
              </h4>
              <p className="font-black text-sm text-orange-600 uppercase tracking-wide">{settings.schoolName}</p>
              <p className="text-[10px] text-slate-500">Tahun Ajaran {settings.academicYear}</p>
            </div>
            <img
              src="/assets/logo-basket-sacil.png"
              alt="Logo Basket SACIL"
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Metadata */}
          <div className="mt-4 flex justify-between items-center text-xs text-slate-600 pb-2 border-b border-slate-200">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">No. Kuitansi Bukti</p>
              <p className="font-mono font-bold text-slate-900">{receiptNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Tanggal Bayar</p>
              <p className="font-semibold text-slate-900">{formatDateIndo(paymentDate)}</p>
            </div>
          </div>

          {/* Member Details */}
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nama Siswa / Atlet:</span>
              <span className="font-bold text-slate-900">{member.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Kelas / Rombel:</span>
              <span className="font-semibold text-slate-800">{member.grade} ({member.subClass})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nomor Punggung / Posisi:</span>
              <span className="font-semibold text-slate-800">#{member.jerseyNumber} • {member.position}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Iuran Kas Dibayarkan:</span>
              <span className="font-semibold text-slate-800 font-mono">
                {weeksCount} Pekan (@{formatRupiah(settings.weeklyDuesAmount)})
              </span>
            </div>
            {notes && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Keterangan:</span>
                <span className="font-medium text-slate-700 italic">{notes}</span>
              </div>
            )}
          </div>

          {/* Total Amount Box */}
          <div className="mt-5 p-3.5 rounded-xl bg-orange-500/10 border border-orange-400/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-950 uppercase block">Total Sah Diterima</span>
              <span className="text-[11px] text-orange-800 font-medium">Lunas {weeksCount} Pekan</span>
            </div>
            <span className="text-xl font-black text-orange-600 font-mono">{formatRupiah(totalAmount)}</span>
          </div>

          {/* Signatures & Official Stempel */}
          <div className="mt-6 pt-3 grid grid-cols-2 text-center text-[11px] text-slate-600">
            <div>
              <p>Penyetor / Siswa</p>
              <div className="h-12"></div>
              <p className="font-bold underline text-slate-800">{member.name}</p>
            </div>
            <div>
              <p>Bendahara Ekskul</p>
              <div className="h-12 relative flex items-center justify-center">
                <img
                  src="/assets/sacil-basket-stempel.png"
                  alt="Stempel Resmi SACIL"
                  className="w-16 h-16 object-contain opacity-90 -rotate-6 pointer-events-none drop-shadow-xs"
                />
              </div>
              <p className="font-bold underline text-slate-800">{settings.treasurerName}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Print / Share / Close) */}
        <div className="p-4 bg-slate-50 flex items-center gap-2.5 print:hidden">
          <button
            id="btn-print-receipt"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kuitansi</span>
          </button>
          <button
            id="btn-share-receipt-wa"
            onClick={handleShareWA}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 py-2.5 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim WhatsApp</span>
          </button>
        </div>
      </div>
      <PrintExportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        targetElementId="printable-receipt"
        documentTitle={`Kuitansi Kas Basket SACIL - ${member.name}`}
        defaultFilename={`Kuitansi-Kas-${member.name.replace(/\s+/g, '_')}.pdf`}
        documentSubtitle={`No: ${receiptNumber} • ${member.name} (${member.subClass}) • ${formatRupiah(totalAmount)}`}
      />
    </div>
  );
};

