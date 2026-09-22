import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div id="offline-status-banner" className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-40 flex items-center justify-between gap-3 rounded-xl bg-slate-900/95 text-white border border-amber-500/40 px-4 py-2.5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
        <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <div className="text-xs">
          <p className="font-semibold text-amber-300">Mode On-Premise Offline</p>
          <p className="text-slate-300 text-[11px]">Data disimpan lokal di ponsel ini dengan aman.</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-400 border-l border-slate-700 pl-3">
        <Database className="w-3.5 h-3.5 text-emerald-400" />
        <span>Tersimpan</span>
      </div>
    </div>
  );
};
