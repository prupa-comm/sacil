/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Users,
  FileText,
  Plus,
  Package,
  Calendar
} from 'lucide-react';
import {
  Member,
  Transaction,
  ClubSettings,
  WeekDefinition,
  ActiveTab,
  PaymentStatus,
  UserRole,
  InventoryItem,
  ClubAgenda
} from './types';
import {
  loadStoredMembers,
  saveStoredMembers,
  loadStoredTransactions,
  saveStoredTransactions,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredWeeks,
  saveStoredWeeks,
  loadStoredUserRole,
  saveStoredUserRole,
  loadStoredInventory,
  saveStoredInventory,
  loadStoredAgendas,
  saveStoredAgendas,
  formatRupiah
} from './utils/storage';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS, INITIAL_WEEKS } from './data/initialData';
import { INITIAL_INVENTORY_ITEMS } from './data/initialInventory';
import { INITIAL_AGENDAS } from './data/initialAgendas';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DashboardView } from './components/DashboardView';
import { WeeklyCashMatrixView } from './components/WeeklyCashMatrixView';
import { TransactionLedgerView } from './components/TransactionLedgerView';
import { MemberRosterView } from './components/MemberRosterView';
import { InventoryLogisticsView } from './components/InventoryLogisticsView';
import { NextAgendaView } from './components/NextAgendaView';
import { ReportsAndSyncView } from './components/ReportsAndSyncView';
import { TransactionModal } from './components/TransactionModal';
import { ReceiptModal } from './components/ReceiptModal';
import { TreasurerPinModal } from './components/TreasurerPinModal';
import { FloatingUtilityBar } from './components/FloatingUtilityBar';
import { useOnlineStatus } from './hooks/useOnlineStatus';

export default function App() {
  const [members, setMembers] = useState<Member[]>(loadStoredMembers);
  const [transactions, setTransactions] = useState<Transaction[]>(loadStoredTransactions);
  const [settings, setSettings] = useState<ClubSettings>(loadStoredSettings);
  const [weeks, setWeeks] = useState<WeekDefinition[]>(loadStoredWeeks);
  const [userRole, setUserRole] = useState<UserRole>(loadStoredUserRole);
  const [inventory, setInventory] = useState<InventoryItem[]>(loadStoredInventory);
  const [agendas, setAgendas] = useState<ClubAgenda[]>(loadStoredAgendas);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedGradeForMatrix, setSelectedGradeForMatrix] = useState<'Semua' | 'Kelas 10' | 'Kelas 11' | 'Kelas 12'>('Semua');
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
  const [trxModalType, setTrxModalType] = useState<'pemasukan' | 'pengeluaran'>('pemasukan');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Dark / Light Mode state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('sacil_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'light';
  });

  // Font Size Accessibility State (Normal = 16px, Large = 17.5px, Extra Large = 19px)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>(() => {
    try {
      const stored = localStorage.getItem('sacil_font_size');
      if (stored === 'normal' || stored === 'large' || stored === 'xlarge') return stored;
    } catch {}
    return 'normal';
  });

  // Receipt Modal State
  const [receiptState, setReceiptState] = useState<{
    member: Member;
    amount: number;
    weeksCount: number;
    receiptNumber: string;
    date: string;
  } | null>(null);

  const isOnline = useOnlineStatus();

  // Persist theme and update DOM
  useEffect(() => {
    try {
      localStorage.setItem('sacil_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to sync theme', e);
    }
  }, [theme]);

  // Persist font size and update DOM root
  useEffect(() => {
    try {
      localStorage.setItem('sacil_font_size', fontSize);
      if (fontSize === 'large') {
        document.documentElement.style.fontSize = '17.5px';
      } else if (fontSize === 'xlarge') {
        document.documentElement.style.fontSize = '19px';
      } else {
        document.documentElement.style.fontSize = '16px';
      }
    } catch (e) {
      console.error('Failed to sync font size', e);
    }
  }, [fontSize]);

  // Persist whenever state changes
  useEffect(() => {
    saveStoredMembers(members);
  }, [members]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredWeeks(weeks);
  }, [weeks]);

  useEffect(() => {
    saveStoredUserRole(userRole);
  }, [userRole]);

  useEffect(() => {
    saveStoredInventory(inventory);
  }, [inventory]);

  useEffect(() => {
    saveStoredAgendas(agendas);
  }, [agendas]);

  // Recalculate Min and Plus weeks for a member based on payments
  // Aturan SMAN 1 Cileunyi:
  // 1. Batas maksimal perhitungan tunggakan adalah "minggu ini" (minggu aktif berjalan, default: september_3).
  // 2. Dihitung mundur dalam bulan aktif hingga minggu ini:
  //    - 'paid' -> Lunas (bukan tunggakan)
  //    - 'off' -> Libur / Dispensasi / Bebas Bayar (bukan tunggakan, sehingga klik ke-2 bendahara mengurangi total tunggakan)
  //    - 'unpaid' -> Menunggak (+1 ke minWeeks)
  // 3. "Minggu depan" (minggu setelah minggu aktif, misal september_4) BUKAN bagian dari minggu dimana iuran dihitung sebagai tunggakan.
  //    Jika siswa membayar minggu depan atau minggu di masa depan, dicatat sebagai 'plusWeeks' (kelebihan/bayar di muka).
  const recalculateMemberWeeks = (member: Member, updatedPayments: Record<string, any>): Member => {
    const activeWeekId = settings.activeWeekId || 'september_3';
    const activeIndex = weeks.findIndex((w) => w.id === activeWeekId);
    const validActiveIndex = activeIndex !== -1 ? activeIndex : Math.max(0, weeks.findIndex((w) => w.id === 'september_3'));
    const activeWeek = weeks[validActiveIndex];
    const activeMonth = activeWeek?.month || 'September';

    // Weeks in the current active month
    const activeMonthWeeks = weeks.filter(
      (w) => w.month.toLowerCase() === activeMonth.toLowerCase()
    );

    // Past and current weeks up to "minggu ini"
    const pastAndCurrentWeeks = activeMonthWeeks.filter((w) => {
      const idx = weeks.findIndex((item) => item.id === w.id);
      return idx <= validActiveIndex;
    });

    // Unpaid count: only weeks in pastAndCurrentWeeks that are NOT 'paid' and NOT 'off'
    const unpaidWeeksCount = pastAndCurrentWeeks.filter((w) => {
      const status = updatedPayments[w.id]?.status;
      return status !== 'paid' && status !== 'off';
    }).length;

    // Future paid weeks (weeks after validActiveIndex that are marked 'paid')
    const futurePaidWeeksCount = Object.keys(updatedPayments).filter((wId) => {
      const idx = weeks.findIndex((w) => w.id === wId);
      return idx > validActiveIndex && updatedPayments[wId]?.status === 'paid';
    }).length;

    // Total nominal collected from this student
    const totalPaidAmount = Object.values(updatedPayments).reduce((sum: number, p: any) => {
      return p?.status === 'paid' ? sum + (p.nominal || settings.weeklyDuesAmount) : sum;
    }, 0);

    return {
      ...member,
      payments: updatedPayments,
      minWeeks: unpaidWeeksCount,
      plusWeeks: futurePaidWeeksCount,
      totalPaidAmount
    };
  };

  // Matrix cell single update
  const handleUpdatePayment = (memberId: string, weekId: string, status: PaymentStatus, dateStr?: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;

        const currentPayments = { ...m.payments };
        if (status === 'paid') {
          currentPayments[weekId] = {
            status: 'paid',
            date: dateStr || `${new Date().getDate()}/${new Date().getMonth() + 1}`,
            nominal: settings.weeklyDuesAmount
          };
        } else if (status === 'unpaid') {
          currentPayments[weekId] = {
            status: 'unpaid',
            date: '',
            nominal: 0
          };
        } else if (status === 'off') {
          currentPayments[weekId] = {
            status: 'off',
            date: '',
            nominal: 0
          };
        }

        return recalculateMemberWeeks(m, currentPayments);
      })
    );
  };

  // Quick Batch Pay for student (e.g. paying 1, 2, or 4 weeks in bulk with date editing)
  const handleBatchPay = (memberId: string, numberOfWeeks: number, customDate?: string) => {
    const today = new Date();
    const todayFormatted = customDate || `${today.getDate()}/${today.getMonth() + 1}`;
    
    // Determine ISO date for transaction
    let trxDateISO = today.toISOString().slice(0, 10);
    if (customDate && customDate.includes('/')) {
      const parts = customDate.split('/');
      if (parts.length === 2) {
        const d = parts[0].padStart(2, '0');
        const m = parts[1].padStart(2, '0');
        trxDateISO = `${today.getFullYear()}-${m}-${d}`;
      }
    }
    const amount = numberOfWeeks * settings.weeklyDuesAmount;
    const receiptNum = `BKM/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`;

    let targetMember: Member | undefined;

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;

        const currentPayments = { ...m.payments };
        let weeksFilled = 0;

        // Fill unpaid weeks first
        for (const w of weeks) {
          if (weeksFilled >= numberOfWeeks) break;
          const p = currentPayments[w.id];
          if (!p || p.status === 'unpaid') {
            currentPayments[w.id] = {
              status: 'paid',
              date: todayFormatted,
              nominal: settings.weeklyDuesAmount
            };
            weeksFilled++;
          }
        }

        const updatedMember = recalculateMemberWeeks(m, currentPayments);
        targetMember = updatedMember;
        return updatedMember;
      })
    );

    // Record into General Cash Ledger (BKU) automatically
    if (targetMember) {
      const newTrx: Transaction = {
        id: `trx-${Date.now()}`,
        date: trxDateISO,
        receiptNumber: receiptNum,
        accountCode: 'UM1',
        destinationAccount: 'Kas Kecil (Bendahara)',
        type: 'pemasukan',
        category: 'Uang Kas Mingguan',
        description: `Setoran kas mingguan ${numberOfWeeks} minggu oleh ${targetMember.name} (${targetMember.grade} - ${targetMember.subClass}) [Tgl: ${todayFormatted}]`,
        amount: amount,
        payerOrPayee: targetMember.name,
        paymentMethod: 'Tunai',
        createdAt: Date.now()
      };
      setTransactions((prev) => [newTrx, ...prev]);
    }
  };

  // Show digital receipt (restricted to Bendahara only)
  const handleShowReceipt = (member: Member, amount: number, weeksCount: number) => {
    if (userRole !== 'bendahara') {
      return;
    }
    const today = new Date();
    const receiptNum = `KAS-SACIL/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`;
    setReceiptState({
      member,
      amount,
      weeksCount,
      receiptNumber: receiptNum,
      date: today.toISOString().slice(0, 10)
    });
  };

  // Open transaction modal
  const handleOpenTransactionModal = (type: 'pemasukan' | 'pengeluaran' = 'pemasukan') => {
    setTrxModalType(type);
    setIsTrxModalOpen(true);
  };

  // Save new transaction
  const handleSaveTransaction = (trxData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTrx: Transaction = {
      ...trxData,
      id: `trx-${Date.now()}`,
      createdAt: Date.now()
    };
    setTransactions((prev) => [newTrx, ...prev]);
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Add new member to roster
  const handleAddMember = (newMemberData: Omit<Member, 'id' | 'payments'>) => {
    const emptyPayments: Record<string, any> = {};
    weeks.forEach((w) => {
      emptyPayments[w.id] = { status: 'unpaid', date: '', nominal: 0 };
    });

    const rawMbr: Member = {
      ...newMemberData,
      id: `mbr-${Date.now()}`,
      payments: emptyPayments
    };
    const newMbr = recalculateMemberWeeks(rawMbr, emptyPayments);
    setMembers((prev) => [...prev, newMbr]);
  };

  // Update existing member in roster
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updatedMember.id ? updatedMember : m)));
  };

  // Delete member from roster
  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Role toggle with PIN protection
  const handleToggleRole = () => {
    if (userRole === 'bendahara') {
      // Locking back to safe public read-only mode
      setUserRole('publik');
    } else {
      // Opening PIN verification modal
      setIsPinModalOpen(true);
    }
  };

  // Restore backup
  const handleRestoreBackup = (data: { members: Member[]; transactions: Transaction[]; settings?: ClubSettings }) => {
    if (data.members) setMembers(data.members);
    if (data.transactions) setTransactions(data.transactions);
    if (data.settings) setSettings(data.settings);
  };

  // Inventory Handlers
  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: `inv-${Date.now()}`
    };
    setInventory((prev) => [item, ...prev]);
  };

  const handleUpdateItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const handleDeleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  // Agenda Management Handlers
  const handleAddAgenda = (agendaData: Omit<ClubAgenda, 'id' | 'createdAt'>) => {
    const newAgenda: ClubAgenda = {
      ...agendaData,
      id: `agenda-${Date.now()}`,
      createdAt: Date.now()
    };
    setAgendas((prev) => [newAgenda, ...prev]);
  };

  const handleUpdateAgenda = (updatedAgenda: ClubAgenda) => {
    setAgendas((prev) => prev.map((a) => (a.id === updatedAgenda.id ? updatedAgenda : a)));
  };

  const handleDeleteAgenda = (agendaId: string) => {
    setAgendas((prev) => prev.filter((a) => a.id !== agendaId));
  };

  const handleToggleActiveAgenda = (agendaId: string) => {
    setAgendas((prev) =>
      prev.map((a) => (a.id === agendaId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  // Reset to initial data
  const handleResetData = () => {
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setSettings(INITIAL_SETTINGS);
    setWeeks(INITIAL_WEEKS);
    setInventory(INITIAL_INVENTORY_ITEMS);
    setAgendas(INITIAL_AGENDAS);
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src="/assets/logo-basket-sacil.png"
                alt="Logo Sacil Basketball"
                className="w-10 h-10 object-contain drop-shadow-sm"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-600 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight truncate">
                  Kas Basket SACIL
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[10px] font-bold">
                  <img src="/assets/logo-sacil-small.png" alt="Logo SMAN 1 Cileunyi" className="w-3.5 h-3.5 object-contain" />
                  <span>SMAN 1 Cileunyi</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                Aplikasi Kas Ekskul Basket On-Premise / Hybrid
              </p>
            </div>
          </div>

          {/* Right Header Section: Desktop Navigation Tabs & PWA Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Ringkasan</span>
              </button>
              <button
                onClick={() => {
                  setSelectedGradeForMatrix('Semua');
                  setActiveTab('kas-mingguan');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'kas-mingguan'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Kas Mingguan</span>
              </button>
              <button
                onClick={() => setActiveTab('transaksi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'transaksi'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Buku Kas (BKU)</span>
              </button>
              <button
                onClick={() => setActiveTab('anggota')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'anggota'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Anggota ({members.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('agenda')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'agenda'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Next Agenda</span>
              </button>
              <button
                onClick={() => setActiveTab('inventaris')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'inventaris'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventaris</span>
              </button>
              <button
                onClick={() => setActiveTab('laporan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'laporan'
                    ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{userRole === 'publik' ? 'LPJ Kas' : 'Laporan & Sync'}</span>
              </button>
            </nav>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            members={members}
            transactions={transactions}
            settings={settings}
            weeks={weeks}
            userRole={userRole}
            agendas={agendas}
            onChangeRole={(r) => setUserRole(r)}
            onToggleRole={handleToggleRole}
            onOpenTransactionModal={handleOpenTransactionModal}
            onNavigateTab={(t) => setActiveTab(t)}
            onNavigateToMatrixWithGrade={(grade) => {
              setSelectedGradeForMatrix(grade);
              setActiveTab('kas-mingguan');
            }}
          />
        )}

        {activeTab === 'kas-mingguan' && (
          <WeeklyCashMatrixView
            members={members}
            weeks={weeks}
            settings={settings}
            userRole={userRole}
            initialGradeFilter={selectedGradeForMatrix}
            onUpdatePayment={handleUpdatePayment}
            onBatchPay={handleBatchPay}
            onShowReceipt={(mbr, amt, cnt) => handleShowReceipt(mbr, amt, cnt)}
          />
        )}

        {activeTab === 'transaksi' && (
          <TransactionLedgerView
            transactions={transactions}
            settings={settings}
            userRole={userRole}
            onOpenAddModal={() => handleOpenTransactionModal('pemasukan')}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'anggota' && (
          <MemberRosterView
            members={members}
            settings={settings}
            userRole={userRole}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onQuickPayMember={(m) => {
              handleBatchPay(m.id, 1);
              handleShowReceipt(m, settings.weeklyDuesAmount, 1);
            }}
            onOpenReceipt={(m) => handleShowReceipt(m, settings.weeklyDuesAmount, 1)}
          />
        )}

        {activeTab === 'inventaris' && (
          <InventoryLogisticsView
            items={inventory}
            userRole={userRole}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'agenda' && (
          <NextAgendaView
            agendas={agendas}
            userRole={userRole}
            onAddAgenda={handleAddAgenda}
            onUpdateAgenda={handleUpdateAgenda}
            onDeleteAgenda={handleDeleteAgenda}
            onToggleActiveAgenda={handleToggleActiveAgenda}
          />
        )}

        {activeTab === 'laporan' && (
          <ReportsAndSyncView
            members={members}
            transactions={transactions}
            settings={settings}
            weeks={weeks}
            inventory={inventory}
            agendas={agendas}
            userRole={userRole}
            onUpdateSettings={setSettings}
            onRestoreBackup={handleRestoreBackup}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) for Mobile Transaction Entry (Bendahara only) */}
      {userRole === 'bendahara' && (
        <div className="fixed bottom-20 right-4 sm:hidden z-30">
          <button
            id="btn-mobile-fab-trx"
            onClick={() => handleOpenTransactionModal('pemasukan')}
            className="w-13 h-13 rounded-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white shadow-xl flex items-center justify-center border-2 border-white dark:border-slate-900 transition cursor-pointer"
            title="Catat Kas Baru"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Global Application Footer with extra bottom clearance for navigation bar & floating dock */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs pt-7 pb-40 sm:pb-36 md:pb-28 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/logo-basket-sacil.png"
              alt="SACIL"
              className="w-5 h-5 object-contain"
            />
            <span className="font-medium">© 2026 {settings.clubName} • {settings.schoolName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>Powered by</span>
            <a
              href="https://citalintas.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-600 hover:text-orange-500 underline underline-offset-2 transition inline-flex items-center gap-1"
            >
              <span>CITALINTAS - Digital Intelligence</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Android Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-navbar"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden px-1 py-1 flex justify-around items-center overflow-x-auto scrollbar-none"
      >
        <button
          id="nav-tab-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'dashboard'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Ringkasan</span>
        </button>

        <button
          id="nav-tab-kas-mingguan"
          onClick={() => {
            setSelectedGradeForMatrix('Semua');
            setActiveTab('kas-mingguan');
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'kas-mingguan'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Kas Siswa</span>
        </button>

        <button
          id="nav-tab-agenda"
          onClick={() => setActiveTab('agenda')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'agenda'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Agenda</span>
        </button>

        <button
          id="nav-tab-transaksi"
          onClick={() => setActiveTab('transaksi')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'transaksi'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Buku Kas</span>
        </button>

        <button
          id="nav-tab-inventaris"
          onClick={() => setActiveTab('inventaris')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'inventaris'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Inventaris</span>
        </button>

        <button
          id="nav-tab-anggota"
          onClick={() => setActiveTab('anggota')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'anggota'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">Anggota</span>
        </button>

        <button
          id="nav-tab-laporan"
          onClick={() => setActiveTab('laporan')}
          className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition min-w-[42px] cursor-pointer flex-shrink-0 ${
            activeTab === 'laporan'
              ? 'text-orange-600 dark:text-orange-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap">{userRole === 'publik' ? 'LPJ' : 'LPJ/Sync'}</span>
        </button>
      </nav>

      {/* Modals & Overlays */}
      {isTrxModalOpen && (
        <TransactionModal
          initialType={trxModalType}
          onSave={handleSaveTransaction}
          onClose={() => setIsTrxModalOpen(false)}
        />
      )}

      {receiptState && userRole === 'bendahara' && (
        <ReceiptModal
          member={receiptState.member}
          amount={receiptState.amount}
          weeksPaidCount={receiptState.weeksCount}
          paymentDate={receiptState.date}
          receiptNumber={receiptState.receiptNumber}
          settings={settings}
          userRole={userRole}
          onClose={() => setReceiptState(null)}
        />
      )}

      {/* Treasurer Security PIN Modal */}
      <TreasurerPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => setUserRole('bendahara')}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Separated Floating Utility Dock (Role Switch, Font Size, Theme, Wifi Indicator) */}
      <FloatingUtilityBar
        userRole={userRole}
        onToggleRole={handleToggleRole}
        fontSize={fontSize}
        onSetFontSize={setFontSize}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        isOnline={isOnline}
      />

      {/* Offline Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}
