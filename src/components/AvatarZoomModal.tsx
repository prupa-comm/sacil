import React from 'react';
import { X, Calendar, Award, Shield, MessageCircle, ExternalLink } from 'lucide-react';
import { Member, UserRole } from '../types';

interface AvatarZoomModalProps {
  member: Member;
  userRole?: UserRole;
  onClose: () => void;
}

export const AvatarZoomModal: React.FC<AvatarZoomModalProps> = ({ member, userRole = 'publik', onClose }) => {
  // Calculate age if birthDate available (only displayed in Bendahara mode)
  const getAgeInfo = (birthDateStr?: string) => {
    if (!birthDateStr) return null;
    const parts = birthDateStr.split('-');
    if (parts.length !== 3) return null;
    const birth = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const mDiff = now.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const formatted = `${parseInt(parts[2])} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
    return { age, formatted };
  };

  const ageInfo = getAgeInfo(member.birthDate);

  const cleanPhone = member.phone ? member.phone.replace(/\D/g, '') : '';
  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  return (
    <div
      id="modal-avatar-zoom-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="modal-avatar-zoom-content"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Profil Atlet SACIL
            </span>
          </div>
          <button
            id="btn-close-avatar-zoom"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Avatar Image Area */}
        <div className="relative bg-gradient-to-b from-orange-500/10 via-slate-100 dark:via-slate-800 to-slate-200 dark:to-slate-850 p-6 flex flex-col items-center justify-center">
          <div className="relative group">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover shadow-2xl ring-4 ring-orange-500/80 border-4 border-white dark:border-slate-900"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-slate-800 to-orange-600 flex flex-col items-center justify-center text-white shadow-2xl ring-4 ring-orange-500/80 border-4 border-white dark:border-slate-900">
                <span className="text-6xl font-black font-mono tracking-tighter">#{member.jerseyNumber}</span>
                <span className="text-xs uppercase tracking-widest font-semibold text-orange-200 mt-2">SACIL BASKET</span>
              </div>
            )}
            {/* Floating Jersey Number Badge */}
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-orange-600 text-white font-mono font-black text-sm shadow-lg border-2 border-white dark:border-slate-900 flex items-center gap-1">
              <span>#{member.jerseyNumber}</span>
            </div>
          </div>
        </div>

        {/* Member Details */}
        <div className="p-5 space-y-3">
          <div className="text-center">
            <h3 className="font-black text-lg text-slate-950 dark:text-white leading-tight">
              {member.name}
            </h3>
            <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5">
              {member.grade} • {member.subClass}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Posisi Lapangan</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <Award className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate">{member.position}</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Kategori Tim</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <span>Tim {member.gender}</span>
              </span>
            </div>
          </div>

          {/* Tanggal Lahir / Usia - HANYA DITAMPILKAN DI MODE BENDAHARA */}
          {userRole === 'bendahara' && ageInfo && (
            <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">Tanggal Lahir</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ageInfo.formatted}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-orange-600 text-white font-bold text-[11px]">
                {ageInfo.age} Tahun
              </span>
            </div>
          )}

          {/* Action Row: Mode Bendahara (WhatsApp) vs Mode Publik (Powered by Citalintas) */}
          {userRole === 'bendahara' ? (
            cleanPhone ? (
              <a
                id="btn-zoom-wa-link"
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo ${member.name} (#${member.jerseyNumber}), info dari Bendahara Ekskul Basket SACIL...`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi via WhatsApp ({member.phone})</span>
              </a>
            ) : (
              <div className="text-center text-[11px] text-slate-400 italic py-1">
                Belum ada nomor WhatsApp tersimpan
              </div>
            )
          ) : (
            <a
              id="btn-zoom-powered-citalintas"
              href="https://citalintas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-medium text-xs shadow-sm hover:shadow-md transition active:scale-98 cursor-pointer border border-slate-700/50"
              title="Kunjungi Website CITALINTAS"
            >
              <span className="text-slate-300">Powered by</span>
              <span className="font-extrabold text-orange-400 tracking-wider">CITALINTAS</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

