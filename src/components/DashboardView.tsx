import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trophy,
  Award,
  Crown,
  Sparkles,
  ShieldCheck,
  Building2,
  Send,
  HelpCircle,
  Eye,
  Lock,
  Flame,
  CreditCard,
  Camera,
  Calendar,
  MapPin,
  UserCheck
} from 'lucide-react';
import { Member, Transaction, ClubSettings, WeekDefinition, ActiveTab, UserRole, Grade, ClubAgenda } from '../types';
import { formatRupiah, formatDateIndo, calculateCashPositions, cleanTransactionTitle } from '../utils/storage';
import { MonthlyCashflowChart } from './MonthlyCashflowChart';
import { ReceiptPhotoModal } from './ReceiptPhotoModal';
import { AvatarZoomModal } from './AvatarZoomModal';

interface DashboardViewProps {
  members: Member[];
  transactions: Transaction[];
  settings: ClubSettings;
  weeks: WeekDefinition[];
  userRole: UserRole;
  agendas?: ClubAgenda[];
  onOpenTransactionModal: (type?: 'pemasukan' | 'pengeluaran') => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onNavigateToMatrixWithGrade?: (grade: 'Kelas 10' | 'Kelas 11' | 'Kelas 12') => void;
  onChangeRole?: (role: UserRole) => void;
  onToggleRole?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  members,
  transactions,
  settings,
  weeks,
  userRole,
  agendas = [],
  onOpenTransactionModal,
  onNavigateTab,
  onNavigateToMatrixWithGrade,
  onChangeRole,
  onToggleRole
}) => {
  const [selectedProofTrx, setSelectedProofTrx] = React.useState<Transaction | null>(null);
  const [zoomedMember, setZoomedMember] = React.useState<Member | null>(null);

  // Factual Cash Positions calculated dynamically from the ledger
  const cashPositions = calculateCashPositions(transactions);
  const kasKecilAmount = cashPositions.kasKecil;
  const kasBesarAmount = cashPositions.kasBesar;
  const totalFactualCash = cashPositions.totalOrganizationCash;

  // Latest transaction date inputted by treasurer
  const latestTrx = [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)[0];
  const latestDateFormatted = latestTrx ? formatDateIndo(latestTrx.date) : formatDateIndo(new Date().toISOString().slice(0, 10));

  // Member dues calculations
  const totalArrearsWeeks = members.reduce((sum, m) => sum + m.minWeeks, 0);
  const totalArrearsAmount = totalArrearsWeeks * settings.weeklyDuesAmount;

  const totalAdvanceWeeks = members.reduce((sum, m) => sum + m.plusWeeks, 0);
  const totalAdvanceAmount = totalAdvanceWeeks * settings.weeklyDuesAmount;

  // Members who are in arrears (Top debtor list)
  const arrearsMembers = members
    .filter((m) => m.minWeeks > 0)
    .sort((a, b) => b.minWeeks - a.minWeeks);

  // Members who paid in advance
  const advanceMembers = members
    .filter((m) => m.plusWeeks > 0)
    .sort((a, b) => b.plusWeeks - a.plusWeeks);

  // Dynamic Top 5 Contributors (Hall of Fame)
  const rankedMembers = [...members]
    .map((m) => {
      const paidWeeks = Object.values(m.payments).filter((p) => p.status === 'paid').length;
      const totalContributed = paidWeeks * settings.weeklyDuesAmount;
      return {
        ...m,
        paidWeeksCount: paidWeeks,
        totalContributed
      };
    })
    .sort((a, b) => b.totalContributed - a.totalContributed || b.plusWeeks - a.plusWeeks || a.no - b.no)
    .slice(0, 5);

  // Grade breakdown (Kelas 10 vs Kelas 11)
  const grades = ['Kelas 10', 'Kelas 11'] as const;
  const gradeStats = grades.map((g) => {
    const list = members.filter((m) => m.grade === g);
    const inArrears = list.filter((m) => m.minWeeks > 0).length;
    const paidWeeks = list.reduce((acc, m) => {
      const pCount = Object.values(m.payments).filter((p) => p.status === 'paid').length;
      return acc + pCount;
    }, 0);
    const totalCollected = paidWeeks * settings.weeklyDuesAmount;
    const compliantCount = list.length - inArrears;
    const compliancePercent = list.length ? Math.round((compliantCount / list.length) * 100) : 0;
    return {
      grade: g,
      totalStudents: list.length,
      inArrears,
      compliantCount,
      compliancePercent,
      paidWeeksTotal: paidWeeks,
      totalCollected
    };
  });

  const totalCollectedAllGrades = gradeStats.reduce((acc, g) => acc + g.totalCollected, 0);

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Role Banner Notification */}
      <div
        className={`px-4 py-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border ${
          userRole === 'bendahara'
            ? 'bg-orange-500/10 border-orange-500/30 text-orange-950 dark:text-orange-200'
            : 'bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg ${
              userRole === 'bendahara' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {userRole === 'bendahara' ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </div>
          <div>
            <span className="font-bold">
              {userRole === 'bendahara' ? 'Hak Akses: Bendahara (CRUD Aktif)' : 'Hak Akses: Transparansi Publik (Read Only)'}
            </span>
            <p className="text-[11px] opacity-80">
              {userRole === 'bendahara'
                ? 'Anda dapat mencatat mutasi, mengelola peserta, dan memperbarui status setoran kas.'
                : 'Mode aman untuk Siswa, Orang Tua, dan Pembina. Data keuangan disajikan transparan tanpa risiko perubahan tidak sengaja.'}
            </p>
          </div>
        </div>

        {onToggleRole && (
          <button
            onClick={onToggleRole}
            className="self-start sm:self-center px-3 py-1 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition"
          >
            Ganti ke Mode {userRole === 'bendahara' ? 'Publik' : 'Bendahara'}
          </button>
        )}
      </div>

      {/* Hero Banner with Official SACIL Basketball Branding */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 text-white shadow-xl border border-slate-700/60 p-5 sm:p-7">
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative flex-shrink-0">
              {/* Transparent PNG Logo */}
              <img
                src="/assets/logo-basket-sacil.png"
                alt="Logo Sacil Basketball"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_12px_rgba(249,115,22,0.4)]"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-[11px] font-bold tracking-wider uppercase">
                  {settings.clubName}
                </span>
                <span className="text-slate-300 text-xs font-medium">• TA {settings.academicYear}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  • Update: {latestDateFormatted}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mt-1">
                {settings.schoolName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">
                Sistem Akuntansi Kas Ekskul Sederhana & Transparan (KISS Principle)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons (Only visible or enabled in Bendahara mode) */}
          {userRole === 'bendahara' ? (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                id="btn-quick-income"
                onClick={() => onOpenTransactionModal('pemasukan')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white shadow-md transition cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>+ Kas Masuk</span>
              </button>
              <button
                id="btn-quick-expense"
                onClick={() => onOpenTransactionModal('pengeluaran')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-xs font-bold text-white shadow-md transition cursor-pointer"
              >
                <TrendingDown className="w-4 h-4" />
                <span>- Kas Keluar</span>
              </button>
              <button
                id="btn-quick-dues-check"
                onClick={() => onNavigateTab('kas-mingguan')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-xs font-bold text-white shadow-md transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Matriks Kas Siswa</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('kas-mingguan')}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-md transition flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Status Pembayaran Saya</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* STRATEGIC REQUIREMENT 5: POSISI KAS FAKTUAL (BENDAHARA VS PEMBINA) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-600" />
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Posisi Saldo Kas Faktual Organisasi
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pemisahan kas operasional bendahara dan kas besar pembina/ketua guna mencegah risiko manipulasi.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Kondisi per {latestDateFormatted}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Kas Bersih */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">
                Total Kas Bersih Organisasi
              </span>
              <Wallet className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="mt-2">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {formatRupiah(totalFactualCash)}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                Akumulasi seluruh kas ekskul (Kas Kecil + Kas Besar)
              </p>
            </div>
          </div>

          {/* Kas di Bendahara (Kas Kecil) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kas Kecil di Bendahara
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                Operasional
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatRupiah(kasKecilAmount)}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Pegang: <strong className="text-slate-700 dark:text-slate-300">{settings.treasurerName}</strong> (Bendahara)
              </p>
            </div>
          </div>

          {/* Kas di Pembina / Ketua (Kas Besar) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Kas Disetor ke Pembina / Ketua
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                Kode UK7
              </span>
            </div>
            <div className="mt-2">
              <h4 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {formatRupiah(kasBesarAmount)}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Disetor ke: <strong className="text-slate-700 dark:text-slate-300">{settings.presidentName}</strong> (Ketua / Pembina)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT AGENDA WIDGET: Jadwal Terdekat Latihan & Kegiatan Ekskul */}
      {agendas && agendas.filter((a) => a.isActive).length > 0 && (
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Next Agenda & Jadwal Terdekat
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Kegiatan resmi latihan, turnamen, dan rapat ekskul basket SACIL
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('agenda')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition"
            >
              <span>Lihat Semua Jadwal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {agendas
              .filter((a) => a.isActive)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 2)
              .map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => onNavigateTab('agenda')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-orange-400 dark:hover:border-orange-600 transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 flex flex-col items-center justify-center flex-shrink-0 shadow-2xs">
                      <span className="text-[9px] font-black uppercase leading-none">{ag.date.slice(5, 7)}/{ag.date.slice(8, 10)}</span>
                      <span className="text-base font-black font-mono leading-tight">{ag.date.slice(8, 10)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-2 py-0.2 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[10px] font-bold">
                          {ag.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ag.targetAudience}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-orange-600 transition">
                        {ag.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          {ag.time}
                        </span>
                        <span>•</span>
                        <span className="truncate">{ag.location}</span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-0.5 transition flex-shrink-0" />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* STRATEGIC REQUIREMENT: TREN ARUS KAS BULANAN (RECHARTS VISUALIZATION) */}
      <MonthlyCashflowChart transactions={transactions} />

      {/* STRATEGIC REQUIREMENT 6: TOP 5 RANKING PESERTA EKSKUL (LEADERBOARD) */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Top 5 Kontributor Kas Terbaik</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                  Hall of Fame
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Siswa paling disiplin dan tercepat dalam melunasi serta membayar kas di muka.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Update Otomatis Real-Time</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {rankedMembers.map((member, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            return (
              <div
                key={member.id}
                className={`relative p-4 rounded-2xl border transition-all hover:scale-[1.02] flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent border-amber-400/50 shadow-sm'
                    : isSecond
                    ? 'bg-gradient-to-b from-slate-400/15 via-slate-400/5 to-transparent border-slate-400/40'
                    : isThird
                    ? 'bg-gradient-to-b from-orange-400/15 via-orange-400/5 to-transparent border-orange-400/40'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-xs ${
                        isFirst
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                          : isSecond
                          ? 'bg-slate-300 text-slate-900 ring-2 ring-slate-200'
                          : isThird
                          ? 'bg-orange-400 text-slate-950 ring-2 ring-orange-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </span>

                    {member.plusWeeks > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        +{member.plusWeeks} Mgg Dimuka
                      </span>
                    )}
                  </div>

                  {/* Member Avatar with Click to Zoom */}
                  <div className="flex items-center gap-2.5 my-2">
                    <button
                      type="button"
                      onClick={() => setZoomedMember(member)}
                      className="relative group cursor-pointer flex-shrink-0"
                      title="Klik untuk zoom foto profil atlet"
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-500 shadow-xs group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black font-mono flex flex-col items-center justify-center text-xs shadow-xs border border-orange-400/40 group-hover:scale-105 transition">
                          <span className="text-[7px] font-sans opacity-75 leading-none">SACIL</span>
                          <span className="text-xs leading-none">#{member.jerseyNumber}</span>
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 text-white shadow-xs">
                        <Eye className="w-2.5 h-2.5 text-amber-400" />
                      </span>
                    </button>

                    <div className="min-w-0">
                      <h4
                        onClick={() => setZoomedMember(member)}
                        className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-orange-600 cursor-pointer transition"
                      >
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {member.subClass} • #{member.jerseyNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">Total Setoran:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatRupiah(member.totalContributed)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STRATEGIC REQUIREMENT 7: KONTRIBUSI SETIAP ANGKATAN (KELAS 10 VS KELAS 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {gradeStats.map((stat, idx) => {
          const sharePercent = totalCollectedAllGrades
            ? Math.round((stat.totalCollected / totalCollectedAllGrades) * 100)
            : 0;

          return (
            <div
              key={stat.grade}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      {idx === 0 ? 'Angkatan Junior' : 'Angkatan Senior'}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {stat.grade}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {stat.totalStudents} Siswa Terdaftar
                  </span>
                </div>

                {/* Contribution Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total Terkumpul</span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                      {formatRupiah(stat.totalCollected)}
                    </h4>
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
                      {sharePercent}% dari seluruh iuran
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Disiplin Kas</span>
                    <h4 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      {stat.compliancePercent}%
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {stat.compliantCount} dari {stat.totalStudents} siswa lunas
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Persentase Kepatuhan Kas</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{stat.compliancePercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        idx === 0 ? 'bg-orange-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${stat.compliancePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {stat.inArrears > 0 ? `${stat.inArrears} siswa menunggak` : 'Seluruh siswa tertib'}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToMatrixWithGrade ? onNavigateToMatrixWithGrade(stat.grade as any) : onNavigateTab('kas-mingguan')}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Detail {stat.grade}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* STRATEGIC REQUIREMENT 3 & 4: PIUTANG KAS (PT1) & KELEBIHAN KAS (UT3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Piutang Kas / Tunggakan */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Piutang Kas Peserta (PT1)
              </h4>
            </div>
            <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">
              {formatRupiah(totalArrearsAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {totalArrearsWeeks} pekan belum tertagih dari {arrearsMembers.length} siswa.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
            {arrearsMembers.slice(0, 4).map((m) => (
              <div key={m.id} className="py-2 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                  <p className="text-[10px] text-slate-400">{m.subClass} • #{m.jerseyNumber}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {m.minWeeks} Minggu Nunggak
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {formatRupiah(m.minWeeks * settings.weeklyDuesAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('kas-mingguan')}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition text-center block"
          >
            Lihat Daftar Lengkap Penagihan
          </button>
        </div>

        {/* Kelebihan Kas / Dibayar Dimuka */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Kelebihan Kas Dibayar Dimuka (UT3)
              </h4>
            </div>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatRupiah(totalAdvanceAmount)}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Total {totalAdvanceWeeks} pekan dibayar sebelum waktunya (tabungan kas siswa).
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-48 overflow-y-auto pr-1">
            {advanceMembers.length > 0 ? (
              advanceMembers.map((m) => (
                <div key={m.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.subClass} • #{m.jerseyNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      +{m.plusWeeks} Minggu Surplus
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {formatRupiah(m.plusWeeks * settings.weeklyDuesAmount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-slate-400">Belum ada siswa yang membayar di muka.</p>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('anggota')}
            className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition text-center block"
          >
            Lihat Roster Anggota
          </button>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Transaksi Mutasi Kas Terbaru</h3>
          </div>
          <button
            onClick={() => onNavigateTab('transaksi')}
            className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
          >
            <span>Buku Kas Umum (BKU) Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentTransactions.map((trx) => (
            <div
              key={trx.id}
              className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl flex-shrink-0 ${
                    trx.type === 'pemasukan'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                  }`}
                >
                  {trx.type === 'pemasukan' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {trx.accountCode && (
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] flex-shrink-0">
                        {trx.accountCode}
                      </span>
                    )}
                    <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {cleanTransactionTitle(trx.description)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                    <span className="font-mono">{trx.receiptNumber}</span>
                    <span>•</span>
                    <span>{formatDateIndo(trx.date)}</span>
                    <span>•</span>
                    <span>{trx.paymentMethod}</span>
                    {trx.payerOrPayee && (
                      <>
                        <span>•</span>
                        <span>{trx.payerOrPayee}</span>
                      </>
                    )}
                    {trx.proofUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedProofTrx(trx)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] font-bold border border-orange-200 dark:border-orange-800 hover:bg-orange-200 transition cursor-pointer"
                        title="Buka foto nota fisik"
                      >
                        <Camera className="w-3 h-3 text-orange-600" />
                        <span>Foto Nota</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span
                  className={`font-mono font-bold text-xs sm:text-sm ${
                    trx.type === 'pemasukan'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {trx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(trx.amount)}
                </span>
                <p className="text-[10px] text-slate-400">{trx.paymentMethod}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal Foto Nota/Kwitansi */}
      {selectedProofTrx && (
        <ReceiptPhotoModal
          transaction={selectedProofTrx}
          onClose={() => setSelectedProofTrx(null)}
        />
      )}

      {/* Lightbox Modal Zoom Foto Atlet */}
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
