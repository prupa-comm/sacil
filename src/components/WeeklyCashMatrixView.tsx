import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Receipt,
  Plus,
  ArrowUpDown,
  Sparkles,
  Info,
  Calendar,
  Eye,
  Lock,
  DollarSign,
  X,
  Clock,
  Check,
  Edit3
} from 'lucide-react';
import { Member, WeekDefinition, ClubSettings, PaymentStatus, UserRole } from '../types';
import { formatRupiah, exportGoogleSheetCSV } from '../utils/storage';
import { AvatarZoomModal } from './AvatarZoomModal';

interface WeeklyCashMatrixViewProps {
  members: Member[];
  weeks: WeekDefinition[];
  settings: ClubSettings;
  userRole: UserRole;
  initialGradeFilter?: 'Semua' | 'Kelas 10' | 'Kelas 11' | 'Kelas 12';
  onUpdatePayment: (memberId: string, weekId: string, status: PaymentStatus, date?: string) => void;
  onBatchPay: (memberId: string, numberOfWeeks: number, customDate?: string) => void;
  onShowReceipt: (member: Member, amount: number, weeksCount: number) => void;
}

export const WeeklyCashMatrixView: React.FC<WeeklyCashMatrixViewProps> = ({
  members,
  weeks,
  settings,
  userRole,
  initialGradeFilter,
  onUpdatePayment,
  onBatchPay,
  onShowReceipt
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'Semua' | 'Kelas 10' | 'Kelas 11' | 'Kelas 12'>(initialGradeFilter || 'Semua');
  const [selectedMonth, setSelectedMonth] = useState<string>('September');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'nunggak' | 'lunas' | 'surplus'>('Semua');
  const [quickPayMember, setQuickPayMember] = useState<Member | null>(null);
  const [quickPayWeeks, setQuickPayWeeks] = useState<number>(1);
  const [quickPayDate, setQuickPayDate] = useState<string>('');
  const [zoomedMember, setZoomedMember] = useState<Member | null>(null);

  // Quick Date presets helper (e.g. Jumat Lalu, Hari Ini, dll)
  const getQuickDatePresets = () => {
    const now = new Date();
    const formatDM = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;

    const todayStr = formatDM(now);

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = formatDM(yesterday);

    // Jumat Lalu (terdekat ke belakang)
    const lastFriday = new Date(now);
    const day = now.getDay(); // 0: Sun, 1: Mon, ..., 5: Fri
    let diffFri = (day - 5 + 7) % 7;
    if (diffFri === 0) diffFri = 7;
    lastFriday.setDate(now.getDate() - diffFri);
    const lastFridayStr = formatDM(lastFriday);

    // Sabtu Lalu (terdekat ke belakang)
    const lastSaturday = new Date(now);
    let diffSat = (day - 6 + 7) % 7;
    if (diffSat === 0) diffSat = 7;
    lastSaturday.setDate(now.getDate() - diffSat);
    const lastSaturdayStr = formatDM(lastSaturday);

    return {
      today: todayStr,
      yesterday: yesterdayStr,
      lastFriday: lastFridayStr,
      lastSaturday: lastSaturdayStr
    };
  };

  const presets = getQuickDatePresets();

  // Cell Action Modal (ON / OFF / BLANK / KUITANSI / EDIT TANGGAL)
  const [cellActionData, setCellActionData] = useState<{
    member: Member;
    week: WeekDefinition;
    status: PaymentStatus;
    customDate: string;
  } | null>(null);

  // Avatar Zoom Modal
  const [avatarZoomMember, setAvatarZoomMember] = useState<Member | null>(null);

  // Sync initialGradeFilter if changed from outside (e.g. Dashboard shortcut)
  useEffect(() => {
    if (initialGradeFilter) {
      setSelectedGrade(initialGradeFilter);
    }
  }, [initialGradeFilter]);

  // Month list
  const months = ['Semua', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  // Filtered weeks
  const visibleWeeks = weeks.filter((w) => {
    if (selectedMonth === 'Semua') return true;
    return w.month.toLowerCase() === selectedMonth.toLowerCase();
  });

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (selectedGrade !== 'Semua' && m.grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchClass = m.subClass.toLowerCase().includes(q);
      const matchJersey = String(m.jerseyNumber).includes(q);
      if (!matchName && !matchClass && !matchJersey) return false;
    }
    if (statusFilter === 'nunggak' && m.minWeeks <= 0) return false;
    if (statusFilter === 'lunas' && (m.minWeeks > 0 || m.plusWeeks > 0)) return false;
    if (statusFilter === 'surplus' && m.plusWeeks <= 0) return false;
    return true;
  });

  // Aggregate totals
  const totalPaidInVisible = filteredMembers.reduce((sum, m) => {
    const paidCount = visibleWeeks.reduce((acc, w) => {
      const p = m.payments[w.id];
      return p && p.status === 'paid' ? acc + 1 : acc;
    }, 0);
    return sum + paidCount;
  }, 0);

  const totalNominalInVisible = totalPaidInVisible * settings.weeklyDuesAmount;

  const handleCellClick = (member: Member, week: WeekDefinition) => {
    const currentPay = member.payments[week.id];
    const currentStatus = currentPay?.status || 'unpaid';

    if (userRole === 'publik') {
      // In read-only mode, clicking a cell doesn't alter data, but shows receipt if paid
      if (currentStatus === 'paid') {
        onShowReceipt(member, settings.weeklyDuesAmount, 1);
      }
      return;
    }

    // Mode Bendahara: Buka modal edit status & tanggal pembayaran
    const existingDate = currentPay?.date || presets.today;
    setCellActionData({
      member,
      week,
      status: currentStatus === 'unpaid' ? 'paid' : currentStatus,
      customDate: existingDate
    });
  };

  const handleSaveCellStatus = (status: PaymentStatus, date?: string) => {
    if (!cellActionData) return;
    onUpdatePayment(cellActionData.member.id, cellActionData.week.id, status, date);
    setCellActionData(null);
  };

  const executeQuickPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPayMember) return;
    const finalDate = quickPayDate.trim() || presets.today;
    onBatchPay(quickPayMember.id, quickPayWeeks, finalDate);
    onShowReceipt(quickPayMember, quickPayWeeks * settings.weeklyDuesAmount, quickPayWeeks);
    setQuickPayMember(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/assets/sacil-basket-stempel.png"
              alt="Stempel Resmi SACIL Basket"
              className="w-12 h-12 object-contain opacity-90 drop-shadow-xs flex-shrink-0"
              title="Stempel Resmi SACIL Basket"
            />
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                <span>Matriks Setoran Kas Mingguan Siswa</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-mono font-bold">
                  @{formatRupiah(settings.weeklyDuesAmount)}/minggu
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Format matriks sesuai Google Sheet resmi Ekstrakurikuler Basket SMAN 1 Cileunyi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-export-matrix-csv"
              onClick={() => exportGoogleSheetCSV(members, weeks, settings)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white shadow-xs transition cursor-pointer"
              title="Unduh file CSV format Google Sheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV Google Sheet</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-student"
              placeholder="Cari nama atau nomor punggung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Grade Filter */}
          <select
            id="select-grade-filter"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            <option value="Semua">Semua Tingkat ({members.length} Siswa)</option>
            <option value="Kelas 10">Kelas 10 ({members.filter(m => m.grade === 'Kelas 10').length} Siswa)</option>
            <option value="Kelas 11">Kelas 11 ({members.filter(m => m.grade === 'Kelas 11').length} Siswa)</option>
          </select>

          {/* Month Filter */}
          <select
            id="select-month-filter"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m === 'Semua' ? 'Semua Bulan (Semester Ganjil)' : `Bulan ${m} (Fokus)`}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="select-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            <option value="Semua">Semua Status Kas</option>
            <option value="nunggak">Memiliki Tunggakan (MIN &gt; 0)</option>
            <option value="lunas">Pas Lunas (MIN 0, PLUS 0)</option>
            <option value="surplus">Bayar Di Muka (PLUS &gt; 0)</option>
          </select>
        </div>

        {/* Quick Hint / Guide */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
            <span>
              {userRole === 'bendahara' ? (
                <>
                  <strong>Mode Bendahara:</strong> Rotasi status sel: Klik 1 = Lunas (Tanggal), Klik 2 = OFF Libur (Mengurangi Tunggakan), Klik 3 = Belum Bayar. Tunggakan dihitung mundur sampai <strong>Minggu Ini ({settings.activeWeekId || 'september_3'})</strong>. Minggu Depan bukan tunggakan.
                </>
              ) : (
                <>
                  <strong>Mode Publik:</strong> Hanya melihat data setoran. Klik pada sel yang sudah lunas untuk melihat kuitansi digital Anda.
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Lunas (Tanggal)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> OFF (Libur - Kurangi Tunggakan)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Belum Bayar (Tunggakan)
            </span>
          </div>
        </div>
      </div>

      {/* Cash Sheet Matrix Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="sticky top-0 z-30 shadow-xs">
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-3 font-bold sticky left-0 z-20 bg-slate-100 dark:bg-slate-800 min-w-[45px] text-center border-r border-slate-200 dark:border-slate-700">
                  NO
                </th>
                <th className="py-3 px-3 font-bold sticky left-[45px] z-20 bg-slate-100 dark:bg-slate-800 min-w-[160px] border-r border-slate-200 dark:border-slate-700">
                  NAMA LENGKAP
                </th>
                <th className="py-3 px-2 font-bold text-center min-w-[70px] border-r border-slate-200 dark:border-slate-700">
                  KELAS
                </th>
                <th className="py-3 px-2 font-bold text-center min-w-[55px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-r border-slate-200 dark:border-slate-700" title="Tunggakan Pekan (Minus)">
                  MIN
                </th>
                <th className="py-3 px-2 font-bold text-center min-w-[55px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700" title="Kelebihan Bayar Pekan (Plus)">
                  PLUS
                </th>
                {visibleWeeks.map((w) => {
                  const activeWeekId = settings.activeWeekId || 'september_3';
                  const activeWeekIndex = weeks.findIndex((item) => item.id === activeWeekId);
                  const validActiveIndex = activeWeekIndex !== -1 ? activeWeekIndex : 11;
                  const wIndex = weeks.findIndex((item) => item.id === w.id);
                  const isActiveWeek = w.id === activeWeekId;
                  const isFutureWeek = wIndex > validActiveIndex;

                  return (
                    <th
                      key={w.id}
                      className={`py-2.5 px-2 font-bold text-center min-w-[85px] border-r border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors ${
                        isActiveWeek
                          ? 'bg-orange-100/90 dark:bg-orange-950/50 text-orange-950 dark:text-orange-200 ring-1 ring-inset ring-orange-400/50'
                          : isFutureWeek
                          ? 'bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400'
                          : w.month === 'September'
                          ? 'bg-orange-50/50 dark:bg-orange-950/20 text-orange-900 dark:text-orange-200'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{w.month}</span>
                        {isActiveWeek && (
                          <span className="px-1 py-0.2 rounded-xs bg-orange-600 text-[8.5px] font-black text-white tracking-wider uppercase">
                            Minggu Ini
                          </span>
                        )}
                        {isFutureWeek && (
                          <span className="px-1 py-0.2 rounded-xs bg-slate-200 dark:bg-slate-700 text-[8.5px] font-semibold text-slate-600 dark:text-slate-300">
                            Depan
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {w.week} {isActiveWeek ? '• Aktif' : isFutureWeek ? '• Bukan Tunggakan' : ''}
                      </div>
                    </th>
                  );
                })}
                <th className="py-3 px-3 font-bold text-center min-w-[100px] bg-slate-100 dark:bg-slate-800">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => {
                const isArrears = member.minWeeks > 0;
                const isSurplus = member.plusWeeks > 0;

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* NO */}
                    <td className="py-2.5 px-3 font-mono text-center text-slate-500 sticky left-0 z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                      {member.no}
                    </td>

                    {/* NAMA with Avatar Thumbnail */}
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white sticky left-[45px] z-10 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setZoomedMember(member)}
                          className="relative flex-shrink-0 cursor-pointer group"
                          title={`Buka kartu profil ${member.name}`}
                        >
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-orange-500/80 group-hover:scale-110 group-hover:ring-2 group-hover:ring-orange-500 transition shadow-2xs"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white font-mono font-bold text-[10px] flex items-center justify-center group-hover:scale-110 transition shadow-2xs border border-orange-400/40">
                              #{member.jerseyNumber}
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setZoomedMember(member)}
                            className="truncate font-semibold text-left text-slate-900 dark:text-white hover:text-orange-600 cursor-pointer transition"
                            title="Buka popup kartu atlet"
                          >
                            {member.name}
                          </button>
                          {member.jerseyNumber ? (
                            <span className="text-[10px] text-slate-400 font-mono">#{member.jerseyNumber}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* KELAS */}
                    <td className="py-2.5 px-2 text-center text-slate-600 dark:text-slate-300 font-medium border-r border-slate-100 dark:border-slate-800">
                      {member.subClass}
                    </td>

                    {/* MIN */}
                    <td
                      className={`py-2.5 px-2 text-center font-bold font-mono border-r border-slate-100 dark:border-slate-800 ${
                        isArrears
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {member.minWeeks}
                    </td>

                    {/* PLUS */}
                    <td
                      className={`py-2.5 px-2 text-center font-bold font-mono border-r border-slate-100 dark:border-slate-800 ${
                        isSurplus
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {member.plusWeeks}
                    </td>

                    {/* WEEK CELLS */}
                    {visibleWeeks.map((week) => {
                      const pay = member.payments[week.id];
                      const status = pay?.status || 'unpaid';
                      const activeWeekId = settings.activeWeekId || 'september_3';
                      const activeWeekIndex = weeks.findIndex((item) => item.id === activeWeekId);
                      const validActiveIndex = activeWeekIndex !== -1 ? activeWeekIndex : 11;
                      const wIndex = weeks.findIndex((item) => item.id === week.id);
                      const isFuture = wIndex > validActiveIndex;

                      let cellBg = '';
                      let content = (
                        <span className={`text-[10px] ${isFuture ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                          -
                        </span>
                      );

                      if (status === 'paid') {
                        cellBg = 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold';
                        content = (
                          <span className="inline-block px-1 py-0.2 rounded-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold text-[9.5px]">
                            {pay.date || 'Lunas'}
                          </span>
                        );
                      } else if (status === 'off') {
                        cellBg = 'bg-amber-500/15 dark:bg-amber-500/25 text-amber-800 dark:text-amber-300 font-bold';
                        content = (
                          <span className="inline-block px-1.5 py-0.2 rounded-xs bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 font-black text-[9.5px]">
                            OFF
                          </span>
                        );
                      }

                      return (
                        <td
                          key={week.id}
                          onClick={() => handleCellClick(member, week)}
                          className={`py-2 px-1 text-center font-mono text-[11px] border-r border-slate-100 dark:border-slate-800 transition select-none ${cellBg} ${
                            userRole === 'bendahara' ? 'cursor-pointer hover:ring-2 hover:ring-orange-500' : 'cursor-default'
                          }`}
                          title={
                            userRole === 'bendahara'
                              ? `${member.name} (${week.month} ${week.week}): Klik 1 = Lunas, Klik 2 = OFF Libur (Kurangi Tunggakan), Klik 3 = Belum Bayar`
                              : `${member.name} (${week.month} ${week.week}): ${status === 'paid' ? 'Lunas ' + pay.date : status === 'off' ? 'OFF (Libur/Bebas)' : 'Belum Bayar'}`
                          }
                        >
                          {content}
                        </td>
                      );
                    })}

                    {/* AKSI */}
                    <td className="py-2 px-2 text-center whitespace-nowrap bg-white dark:bg-slate-900">
                      {userRole === 'bendahara' ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setQuickPayMember(member);
                              setQuickPayWeeks(member.minWeeks > 0 ? member.minWeeks : 1);
                              setQuickPayDate(presets.today);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-[11px] shadow-xs transition cursor-pointer"
                            title="Setor Cepat & Buat Kuitansi"
                          >
                            Setor
                          </button>
                          <button
                            onClick={() => onShowReceipt(member, settings.weeklyDuesAmount, 1)}
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Cetak Kuitansi Terakhir"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onShowReceipt(member, settings.weeklyDuesAmount, 1)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition flex items-center gap-1 mx-auto"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Kuitansi</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-600 dark:text-slate-300">
              Menampilkan <strong>{filteredMembers.length}</strong> siswa
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Total Pekan Terbayar ({selectedMonth}): {totalPaidInVisible} setoran
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Estimasi Terkumpul:</span>
            <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
              {formatRupiah(totalNominalInVisible)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Batch Pay Modal (Only in Bendahara mode) */}
      {quickPayMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Setoran Kas Cepat
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {quickPayMember.name} ({quickPayMember.grade} - {quickPayMember.subClass})
                </p>
              </div>
              <button
                onClick={() => setQuickPayMember(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={executeQuickPay} className="p-5 space-y-4">
              {quickPayMember.minWeeks > 0 && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
                  Siswa ini memiliki tunggakan <strong>{quickPayMember.minWeeks} minggu</strong> ({formatRupiah(quickPayMember.minWeeks * settings.weeklyDuesAmount)}).
                </div>
              )}

              {/* Quick Choice Buttons */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Paket Setoran:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setQuickPayWeeks(w)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center ${
                        quickPayWeeks === w
                          ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{w} Pekan</span>
                      <span className="text-[11px] font-mono opacity-90">{formatRupiah(w * settings.weeklyDuesAmount)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Number of Weeks */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Atau Masukkan Jumlah Pekan:
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={quickPayWeeks}
                  onChange={(e) => setQuickPayWeeks(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                />
              </div>

              {/* Tanggal Pembayaran (Edit Date feature for Bendahara) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tanggal Pembayaran:
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Contoh: setoran jumat lalu</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setQuickPayDate(presets.today)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                      quickPayDate === presets.today
                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Hari Ini ({presets.today})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPayDate(presets.lastFriday)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                      quickPayDate === presets.lastFriday
                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Jumat Lalu ({presets.lastFriday})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPayDate(presets.lastSaturday)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                      quickPayDate === presets.lastSaturday
                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Sabtu Lalu ({presets.lastSaturday})
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPayDate(presets.yesterday)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                      quickPayDate === presets.yesterday
                        ? 'bg-orange-600 text-white border-orange-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Kemarin ({presets.yesterday})
                  </button>
                </div>
                <input
                  type="text"
                  value={quickPayDate}
                  onChange={(e) => setQuickPayDate(e.target.value)}
                  placeholder="DD/MM (contoh: 18/9)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
                />
              </div>

              {/* Total Calculation */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total Uang Diterima:</span>
                <span className="font-mono font-black text-base text-orange-600 dark:text-orange-400">
                  {formatRupiah(quickPayWeeks * settings.weeklyDuesAmount)}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickPayMember(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
                >
                  Simpan & Kuitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mode Bendahara: Modal Edit Status & Tanggal Pembayaran Kas Pekan */}
      {cellActionData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Edit Iuran Kas & Tanggal
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cellActionData.member.name} ({cellActionData.member.grade} - {cellActionData.member.subClass})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCellActionData(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Info Pekan */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Pekan Pembayaran:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cellActionData.week.month} - {cellActionData.week.week} ({cellActionData.week.label})
                </span>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih Status Iuran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCellActionData({ ...cellActionData, status: 'paid' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      cellActionData.status === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Lunas (Paid)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCellActionData({ ...cellActionData, status: 'off' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      cellActionData.status === 'off'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>OFF (Libur)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCellActionData({ ...cellActionData, status: 'unpaid' })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      cellActionData.status === 'unpaid'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Belum Bayar</span>
                  </button>
                </div>
              </div>

              {/* Tanggal Pembayaran (Hanya jika status === 'paid') */}
              {cellActionData.status === 'paid' && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tanggal Pembayaran Kas:</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                      Nominal: {formatRupiah(settings.weeklyDuesAmount)}
                    </span>
                  </div>

                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Pilih tanggal pembayaran iuran. Bendahara dapat mencatatkan setoran hari Jumat/Sabtu lalu pada hari ini:
                  </p>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCellActionData({ ...cellActionData, customDate: presets.today })}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                        cellActionData.customDate === presets.today
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Hari Ini ({presets.today})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCellActionData({ ...cellActionData, customDate: presets.lastFriday })}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                        cellActionData.customDate === presets.lastFriday
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Jumat Lalu ({presets.lastFriday})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCellActionData({ ...cellActionData, customDate: presets.lastSaturday })}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                        cellActionData.customDate === presets.lastSaturday
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Sabtu Lalu ({presets.lastSaturday})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCellActionData({ ...cellActionData, customDate: presets.yesterday })}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border transition text-center cursor-pointer ${
                        cellActionData.customDate === presets.yesterday
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Kemarin ({presets.yesterday})
                    </button>
                  </div>

                  {/* Custom Date Input */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      Atau Ketik Tanggal Tertentu (DD/MM):
                    </label>
                    <input
                      type="text"
                      value={cellActionData.customDate}
                      onChange={(e) => setCellActionData({ ...cellActionData, customDate: e.target.value })}
                      placeholder="DD/MM (contoh: 18/9)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Note for OFF status */}
              {cellActionData.status === 'off' && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                  Pekan ini berstatus <strong>OFF (Libur Ekskul / Bebas Bayar)</strong>. Siswa tidak akan dibebankan iuran dan tidak akan dihitung sebagai tunggakan.
                </div>
              )}

              {/* Note for Unpaid status */}
              {cellActionData.status === 'unpaid' && (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
                  Status akan diubah menjadi <strong>Belum Bayar (-)</strong>. Siswa akan tercatat menunggak sebesar Rp 5.000 jika pekan ini telah aktif.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCellActionData(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>

                {cellActionData.status === 'paid' && (
                  <button
                    type="button"
                    onClick={() => {
                      onShowReceipt(cellActionData.member, settings.weeklyDuesAmount, 1);
                    }}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer"
                    title="Cetak Kuitansi"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Kuitansi</span>
                  </button>
                )}

                <button
                  type="button"
                  id="btn-save-cell-status"
                  onClick={() => {
                    const finalDate = cellActionData.status === 'paid' ? (cellActionData.customDate.trim() || presets.today) : undefined;
                    handleSaveCellStatus(cellActionData.status, finalDate);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal Zoom Profil Atlet */}
      {zoomedMember && (
        <AvatarZoomModal
          member={zoomedMember}
          userRole={userRole}
          onClose={() => setZoomedMember(null)}
        />
      )}
    </div>
  );
};
