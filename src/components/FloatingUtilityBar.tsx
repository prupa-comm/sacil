import React, { useState } from 'react';
import {
  Lock,
  Eye,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  Settings2,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { UserRole } from '../types';

interface FloatingUtilityBarProps {
  userRole: UserRole;
  onToggleRole: () => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  onSetFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isOnline: boolean;
}

export const FloatingUtilityBar: React.FC<FloatingUtilityBarProps> = ({
  userRole,
  onToggleRole,
  fontSize,
  onSetFontSize,
  theme,
  onToggleTheme,
  isOnline
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <>
      {/* Desktop & Tablet Floating Dock (Clean, neat, separated from top menu) */}
      <aside
        id="floating-utility-dock"
        aria-label="Panel Utilitas dan Pengaturan Tampilan"
        className="hidden md:flex fixed bottom-5 right-6 z-40 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-200/90 dark:border-slate-800/90 transition-all duration-200"
      >
        {/* Role Switcher Pill */}
        <button
          type="button"
          id="btn-dock-toggle-role"
          onClick={onToggleRole}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
            userRole === 'bendahara'
              ? 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/25'
              : 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25'
          }`}
          title="Beralih mode: Bendahara (PIN) vs Publik (Transparan)"
        >
          {userRole === 'bendahara' ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{userRole === 'bendahara' ? 'Mode Bendahara' : 'Mode Publik'}</span>
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        {/* Text Size Switcher (A, A+, A++) */}
        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            id="btn-dock-font-normal"
            onClick={() => onSetFontSize('normal')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              fontSize === 'normal'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Ukuran teks standar (A)"
          >
            A
          </button>
          <button
            type="button"
            id="btn-dock-font-large"
            onClick={() => onSetFontSize('large')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              fontSize === 'large'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Ukuran teks sedang (A+)"
          >
            A+
          </button>
          <button
            type="button"
            id="btn-dock-font-xlarge"
            onClick={() => onSetFontSize('xlarge')}
            className={`px-2 py-1 rounded-lg transition cursor-pointer ${
              fontSize === 'xlarge'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Ukuran teks besar (A++)"
          >
            A++
          </button>
        </div>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        {/* Dark / Light Mode Switcher */}
        <button
          type="button"
          id="btn-dock-toggle-theme"
          onClick={onToggleTheme}
          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
          title={theme === 'dark' ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        {/* Wifi / Network Status indicator */}
        <div
          id="dock-wifi-status"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}
          title={isOnline ? 'Terhubung (Online)' : 'Mode On-Premise Lokal (Offline)'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="text-[11px] font-bold">{isOnline ? 'Online' : 'On-Premise'}</span>
        </div>
      </aside>

      {/* Mobile Floating Utility Widget (Placed neatly above bottom nav, clean & collapsible) */}
      <aside
        id="mobile-floating-utility"
        aria-label="Panel Utilitas Mobile"
        className="md:hidden fixed bottom-16 left-3 z-30 flex flex-col items-start"
      >
        {mobileExpanded && (
          <div className="mb-2 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150 w-56">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pengaturan Tampilan
              </span>
              <button
                onClick={() => setMobileExpanded(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-0.5"
              >
                ✕
              </button>
            </div>

            {/* Role switch in mobile */}
            <button
              type="button"
              onClick={() => {
                onToggleRole();
                setMobileExpanded(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                userRole === 'bendahara'
                  ? 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300'
                  : 'bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {userRole === 'bendahara' ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{userRole === 'bendahara' ? 'Bendahara (PIN)' : 'Publik (Lihat)'}</span>
              </div>
              <span className="text-[10px] uppercase font-mono opacity-80">Ganti</span>
            </button>

            {/* Text Zoom */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Ukuran Teks:</span>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-bold border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onSetFontSize('normal')}
                  className={`px-2 py-0.5 rounded-lg transition ${fontSize === 'normal' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold' : 'text-slate-500'}`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => onSetFontSize('large')}
                  className={`px-2 py-0.5 rounded-lg transition ${fontSize === 'large' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold' : 'text-slate-500'}`}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => onSetFontSize('xlarge')}
                  className={`px-2 py-0.5 rounded-lg transition ${fontSize === 'xlarge' ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-2xs font-extrabold' : 'text-slate-500'}`}
                >
                  A++
                </button>
              </div>
            </div>

            {/* Theme & Wifi Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                <span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
              </button>

              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold border ${
                  isOnline
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                }`}
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Compact Trigger Button on Mobile */}
        <button
          type="button"
          id="btn-mobile-utility-trigger"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition cursor-pointer"
          title="Pengaturan Mode & Tampilan"
        >
          <Sliders className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-[11px]">
            {userRole === 'bendahara' ? 'Bendahara' : 'Publik'}
          </span>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {mobileExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronUp className="w-3 h-3 text-slate-400" />}
        </button>
      </aside>
    </>
  );
};
