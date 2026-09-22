import { Member, Transaction, ClubSettings, WeekDefinition, UserRole, InventoryItem, ClubAgenda } from '../types';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS, INITIAL_WEEKS } from '../data/initialData';
import { INITIAL_INVENTORY_ITEMS } from '../data/initialInventory';
import { INITIAL_AGENDAS } from '../data/initialAgendas';

const STORAGE_KEYS = {
  MEMBERS: 'sacil_basket_members_v2',
  TRANSACTIONS: 'sacil_basket_transactions_v2',
  SETTINGS: 'sacil_basket_settings_v2',
  WEEKS: 'sacil_basket_weeks_v2',
  USER_ROLE: 'sacil_basket_user_role_v2',
  TREASURER_PIN: 'sacil_basket_treasurer_pin_v2',
  LAST_SYNC: 'sacil_basket_last_sync_v2',
  INVENTORY: 'sacil_basket_inventory_v2',
  AGENDAS: 'sacil_basket_agendas_v1'
};

export const DEFAULT_TREASURER_PIN = '192837';

export const loadTreasurerPin = (): string => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TREASURER_PIN);
    if (raw && raw.trim().length >= 4) {
      return raw.trim();
    }
  } catch (e) {
    console.error('Failed to load treasurer PIN', e);
  }
  return DEFAULT_TREASURER_PIN;
};

export const saveTreasurerPin = (pin: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TREASURER_PIN, pin.trim());
  } catch (e) {
    console.error('Failed to save treasurer PIN', e);
  }
};

export const loadStoredUserRole = (): UserRole => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    if (raw === 'bendahara' || raw === 'publik') {
      return raw;
    }
  } catch (e) {
    console.error('Failed to parse stored user role', e);
  }
  return 'publik'; // Default safe read-only role for public/students
};

export const saveStoredUserRole = (role: UserRole): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  } catch (e) {
    console.error('Failed to save user role', e);
  }
};

/**
 * Compress an image file to a lightweight data URL suitable for localStorage storage
 */
export const compressImageFile = (file: File, maxWidth: number = 800, quality: number = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

export const cleanTransactionTitle = (desc?: string): string => {
  if (!desc) return '';
  return desc
    .replace(/^\[[A-Za-z0-9]+\]\s*/i, '')
    .replace(/^[A-Za-z]{2}[0-9]+\s*[-:]\s*/i, '')
    .replace(/^\([A-Za-z0-9]+\)\s*/i, '')
    .trim();
};

export const ensureMemberBirthDates = (members: Member[]): Member[] => {
  return members.map((m) => {
    if (m.birthDate) return m;
    const isK11 = m.grade.includes('11');
    const baseYear = isK11 ? 2009 : 2010;
    const month = ((m.no * 3) % 12) + 1;
    const day = ((m.no * 7) % 27) + 1;
    const birthDate = `${baseYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { ...m, birthDate };
  });
};

export const sanitizeMemberAnomalies = (members: Member[]): Member[] => {
  return members.map((m) => {
    // Anomali 1: Dwinantara Arsya R.C
    // Di sheet asli terjadi duplikasi copy-paste dari Yuane Silvia (tanggal 17/8, 16/10 dan MIN: 3).
    // Pekan September M1 & M2 adalah OFF (Libur), sehingga tunggakan aktif di September M3 hanya 1 pekan (minWeeks: 1).
    if (m.name.includes('Dwinantara') || m.id === 'member_39_005' || m.id === 'mbr-11-5') {
      const payments = { ...m.payments };
      payments['september_1'] = { status: 'off', nominal: 0, note: 'Libur Ekskul' };
      payments['september_2'] = { status: 'off', nominal: 0, note: 'Libur Ekskul' };
      payments['september_3'] = { status: 'unpaid', nominal: 5000 };
      payments['september_4'] = { status: 'unpaid', nominal: 5000 };
      ['oktober_1', 'oktober_2', 'oktober_3', 'oktober_4'].forEach((k) => {
        payments[k] = { status: 'unpaid', nominal: 5000 };
      });
      return {
        ...m,
        minWeeks: 1,
        plusWeeks: 0,
        payments,
        totalPaidAmount: 5000
      };
    }

    // Anomali 2: Husni Ali Riyaddudin
    // Di sheet asli September M1 & M2 berstatus OFF dan Husni telah lunas membayar di Pekan 3 (21/9),
    // namun di spreadsheet tertulis MIN 2 karena kesalahan kalkulasi manual kolom.
    // Husni tidak memiliki tunggakan (minWeeks: 0).
    if (m.name.includes('Husni') || m.id === 'member_39_006' || m.id === 'mbr-11-6') {
      const payments = { ...m.payments };
      payments['september_1'] = { status: 'off', nominal: 0, note: 'Libur Ekskul' };
      payments['september_2'] = { status: 'off', nominal: 0, note: 'Libur Ekskul' };
      payments['september_3'] = { status: 'paid', date: '2026-09-21', nominal: 5000, note: 'Kas Pekan 3' };
      payments['september_4'] = { status: 'unpaid', nominal: 5000 };
      return {
        ...m,
        minWeeks: 0,
        plusWeeks: 0,
        payments,
        totalPaidAmount: 10000
      };
    }

    return m;
  });
};

export const loadStoredMembers = (): Member[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return ensureMemberBirthDates(sanitizeMemberAnomalies(parsed));
      }
    }
  } catch (e) {
    console.error('Failed to parse stored members, using defaults', e);
  }
  return ensureMemberBirthDates(sanitizeMemberAnomalies(INITIAL_MEMBERS));
};

export const saveStoredMembers = (members: Member[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
};

export const loadStoredTransactions = (): Transaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored transactions, using defaults', e);
  }
  return INITIAL_TRANSACTIONS;
};

export const saveStoredTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions to localStorage', e);
  }
};

export const loadStoredSettings = (): ClubSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SETTINGS,
        ...parsed,
        supervisorName: 'Drs. Caswanda, M.Ag.',
        supervisorNip: '196809061994121003'
      };
    }
  } catch (e) {
    console.error('Failed to parse stored settings, using defaults', e);
  }
  return INITIAL_SETTINGS;
};

export const saveStoredSettings = (settings: ClubSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const loadStoredWeeks = (): WeekDefinition[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEEKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored weeks, using defaults', e);
  }
  return INITIAL_WEEKS;
};

export const saveStoredWeeks = (weeks: WeekDefinition[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(weeks));
  } catch (e) {
    console.error('Failed to save weeks to localStorage', e);
  }
};

export const loadStoredInventory = (): InventoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored inventory, using defaults', e);
  }
  return INITIAL_INVENTORY_ITEMS;
};

export const saveStoredInventory = (items: InventoryItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save inventory to localStorage', e);
  }
};

export const loadStoredAgendas = (): ClubAgenda[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AGENDAS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored agendas, using defaults', e);
  }
  return INITIAL_AGENDAS;
};

export const saveStoredAgendas = (agendas: ClubAgenda[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(agendas));
  } catch (e) {
    console.error('Failed to save agendas to localStorage', e);
  }
};

/**
 * Mathematically calculate real-time cash balance and cash positions:
 * - Kas Kecil (Bendahara): All external income enters Kas Kecil. Operational expenses are paid from Kas Kecil.
 *   UK7 (Setor Kas Kecil ke Kas Besar) decreases Kas Kecil, increases Kas Besar.
 *   UM7 (Setor Kas Besar ke Kas Kecil) increases Kas Kecil, decreases Kas Besar.
 * - Total Kas Bersih Organisasi = Kas Kecil (Bendahara) + Kas Besar (Disetor ke Ketua/Pembina).
 */
export const calculateCashPositions = (transactions: Transaction[]) => {
  let kasKecil = 0;
  let kasBesar = 0;
  let totalIncome = 0;
  let totalExpense = 0;

  // Process transactions chronologically
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);

  sorted.forEach((trx) => {
    const code = (trx.accountCode || '').toUpperCase().trim();
    if (trx.type === 'pemasukan') {
      totalIncome += trx.amount;
      if (code === 'UM7' || trx.category.toLowerCase().includes('kas besar ke kas kecil')) {
        // Transfer from Kas Besar into Kas Kecil
        kasKecil += trx.amount;
        kasBesar -= trx.amount;
      } else {
        // Standard external revenue into Kas Kecil
        kasKecil += trx.amount;
      }
    } else {
      totalExpense += trx.amount;
      if (code === 'UK7' || trx.category.toLowerCase().includes('kas kecil ke kas besar')) {
        // Deposit from Kas Kecil into Kas Besar (Teh Teisya / Pembina)
        kasKecil -= trx.amount;
        kasBesar += trx.amount;
      } else {
        // Operational expense from Kas Kecil
        kasKecil -= trx.amount;
      }
    }
  });

  const totalOrganizationCash = kasKecil + kasBesar;

  return {
    kasKecil,
    kasBesar,
    totalOrganizationCash,
    totalIncome,
    totalExpense
  };
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatShortRupiah = (amount: number): string => {
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')} jt`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} rb`;
  }
  return `Rp ${amount}`;
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
};

// Export Full On-Premise Backup JSON
export const exportBackupJSON = (
  members: Member[],
  transactions: Transaction[],
  settings: ClubSettings,
  weeks: WeekDefinition[],
  inventory?: InventoryItem[]
): void => {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    app: 'Kas Basket SACIL - SMAN 1 Cileunyi',
    settings,
    weeks,
    members,
    transactions,
    inventory: inventory || loadStoredInventory()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `backup_kas_basket_sacil_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Export to Google Sheet format CSV
export const exportGoogleSheetCSV = (
  members: Member[],
  weeks: WeekDefinition[],
  settings: ClubSettings
): void => {
  const lines: string[] = [];

  // Header 1: School Title
  lines.push(`SETORAN KAS EKSKUL BASKET`);
  lines.push(`${settings.schoolName}`);
  lines.push(`Tahun Ajaran ${settings.academicYear}`);
  lines.push(``);

  const grades: Array<'Kelas 10' | 'Kelas 11' | 'Kelas 12'> = ['Kelas 10', 'Kelas 11', 'Kelas 12'];

  grades.forEach((grade) => {
    lines.push(grade.toUpperCase());
    
    // Header Row 1: Months
    const monthHeaders = ['NO', 'NAMA', `KLS`, 'MIN', 'PLUS'];
    weeks.forEach((w) => {
      monthHeaders.push(`${w.month} ${w.week}`);
    });
    lines.push(monthHeaders.map(m => `"${m}"`).join(','));

    // Filter members for this grade
    const gradeMembers = members.filter(m => m.grade === grade);
    gradeMembers.forEach(member => {
      const row = [
        member.no.toString(),
        member.name,
        member.subClass,
        member.minWeeks.toString(),
        member.plusWeeks.toString()
      ];

      weeks.forEach(w => {
        const pay = member.payments[w.id];
        if (!pay) {
          row.push('');
        } else if (pay.status === 'off') {
          row.push('OFF');
        } else if (pay.status === 'paid') {
          row.push(pay.date || 'Lunas');
        } else {
          row.push('');
        }
      });

      lines.push(row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','));
    });

    lines.push(``);
  });

  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Setoran_Kas_Basket_SACIL_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// Export General Cash Ledger (BKU) to CSV
export const exportTransactionsCSV = (
  transactions: Transaction[],
  settings: ClubSettings
): void => {
  const lines: string[] = [];
  lines.push(`BUKU KAS UMUM EKSKUL BASKET`);
  lines.push(`${settings.schoolName}`);
  lines.push(`Periode: ${settings.academicYear}`);
  lines.push(``);

  const headers = ['No', 'Tanggal', 'No Bukti', 'Jenis', 'Kategori', 'Uraian / Deskripsi', 'Pihak Terkait', 'Metode Bayar', 'Debet (Masuk)', 'Kredit (Keluar)'];
  lines.push(headers.map(h => `"${h}"`).join(','));

  // Sort by date ascending
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  sorted.forEach((trx, idx) => {
    const debet = trx.type === 'pemasukan' ? trx.amount : 0;
    const kredit = trx.type === 'pengeluaran' ? trx.amount : 0;
    const row = [
      (idx + 1).toString(),
      trx.date,
      trx.receiptNumber,
      trx.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      trx.category,
      trx.description,
      trx.payerOrPayee || '-',
      trx.paymentMethod,
      debet.toString(),
      kredit.toString()
    ];
    lines.push(row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','));
  });

  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Buku_Kas_Umum_SACIL_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
