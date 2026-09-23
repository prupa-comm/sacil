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

export const loadTreasurerPin = (settings?: ClubSettings): string => {
  // 1. Check settings in memory
  if (settings?.treasurerPin && settings.treasurerPin.trim().length >= 4) {
    return settings.treasurerPin.trim();
  }
  // 2. Check standalone localStorage key
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TREASURER_PIN);
    if (raw && raw.trim().length >= 4) {
      return raw.trim();
    }
    // 3. Check stored settings in localStorage
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      const parsedSettings = JSON.parse(rawSettings);
      if (parsedSettings?.treasurerPin && parsedSettings.treasurerPin.trim().length >= 4) {
        return parsedSettings.treasurerPin.trim();
      }
    }
  } catch (e) {
    console.error('Failed to load treasurer PIN', e);
  }
  return DEFAULT_TREASURER_PIN;
};

export const saveTreasurerPin = (pin: string): void => {
  const cleanPin = pin.trim();
  try {
    localStorage.setItem(STORAGE_KEYS.TREASURER_PIN, cleanPin);
    const rawSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      parsed.treasurerPin = cleanPin;
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
    }
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

export const ensureMemberAllWeeks = (members: Member[], weeks: WeekDefinition[] = INITIAL_WEEKS): Member[] => {
  return members.map((m) => {
    let hasChanges = false;
    const payments = { ...m.payments };
    weeks.forEach((w) => {
      if (!payments[w.id]) {
        payments[w.id] = { status: 'unpaid', nominal: 0 };
        hasChanges = true;
      }
    });
    return hasChanges ? { ...m, payments } : m;
  });
};

export const loadStoredMembers = (): Member[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // PERBAIKAN: JANGAN panggil sanitizeMemberAnomalies(parsed)!
        // Data yang sudah diperbaiki oleh bendahara (termasuk Dwinantara & Husni)
        // harus tetap dipertahankan sesuai data riil yang tersimpan di localStorage.
        return ensureMemberBirthDates(ensureMemberAllWeeks(parsed));
      }
    }
  } catch (e) {
    console.error('Failed to parse stored members, using defaults', e);
  }
  // Hanya jalankan sanitizeMemberAnomalies saat pertama kali membaca data bawaan (INITIAL_MEMBERS)
  return ensureMemberBirthDates(ensureMemberAllWeeks(sanitizeMemberAnomalies(INITIAL_MEMBERS)));
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
      if (Array.isArray(parsed) && parsed.length >= 30) {
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

// Helper function to safely escape strings for SQL
const sqlEscape = (str: string | undefined | null): string => {
  if (str === undefined || str === null) return 'NULL';
  return `'${String(str).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%': return '\\' + char;
      default: return char;
    }
  })}'`;
};

// Export Full Live MySQL Database Dump (.SQL) with current data
export const exportMySQLDump = (
  members: Member[],
  transactions: Transaction[],
  settings: ClubSettings,
  weeks: WeekDefinition[],
  inventory: InventoryItem[] = [],
  agendas: ClubAgenda[] = []
): void => {
  const sql: string[] = [];
  const timestamp = new Date().toISOString();

  sql.push(`-- ========================================================`);
  sql.push(`-- SISTEM INFORMASI KAS & KEUANGAN EKSKUL BASKET SMAN 1 CILEUNYI`);
  sql.push(`-- MYSQL DATABASE DUMP (LIVE EXPORT)`);
  sql.push(`-- Waktu Ekspor: ${timestamp}`);
  sql.push(`-- Total Anggota: ${members.length} | Transaksi: ${transactions.length}`);
  sql.push(`-- ========================================================`);
  sql.push(``);
  sql.push(`CREATE DATABASE IF NOT EXISTS \`sacil_basket_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  sql.push(`USE \`sacil_basket_db\`;`);
  sql.push(``);
  sql.push(`SET FOREIGN_KEY_CHECKS = 0;`);
  sql.push(`DROP TABLE IF EXISTS \`member_payments\`;`);
  sql.push(`DROP TABLE IF EXISTS \`members\`;`);
  sql.push(`DROP TABLE IF EXISTS \`transactions\`;`);
  sql.push(`DROP TABLE IF EXISTS \`inventory_items\`;`);
  sql.push(`DROP TABLE IF EXISTS \`club_agendas\`;`);
  sql.push(`DROP TABLE IF EXISTS \`week_definitions\`;`);
  sql.push(`DROP TABLE IF EXISTS \`club_settings\`;`);
  sql.push(`DROP TABLE IF EXISTS \`account_codes\`;`);
  sql.push(`DROP TABLE IF EXISTS \`app_users\`;`);
  sql.push(`SET FOREIGN_KEY_CHECKS = 1;`);
  sql.push(``);

  // Settings
  sql.push(`-- 1. TABEL club_settings`);
  sql.push(`CREATE TABLE \`club_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`school_name\` VARCHAR(150) NOT NULL,
  \`club_name\` VARCHAR(150) NOT NULL,
  \`academic_year\` VARCHAR(30) NOT NULL,
  \`weekly_dues_amount\` DECIMAL(12,2) NOT NULL,
  \`headmaster_name\` VARCHAR(150) NOT NULL,
  \`headmaster_nip\` VARCHAR(50) NULL,
  \`supervisor_name\` VARCHAR(150) NOT NULL,
  \`supervisor_nip\` VARCHAR(50) NULL,
  \`coach_name\` VARCHAR(150) NOT NULL,
  \`president_name\` VARCHAR(150) NOT NULL,
  \`treasurer_name\` VARCHAR(150) NOT NULL,
  \`google_sheet_url\` TEXT NULL,
  \`active_week_id\` VARCHAR(50) NOT NULL,
  \`treasurer_cash_on_hand\` DECIMAL(15,2) NOT NULL,
  \`president_cash_on_hand\` DECIMAL(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  sql.push(`INSERT INTO \`club_settings\` VALUES (1, ${sqlEscape(settings.schoolName)}, ${sqlEscape(settings.clubName)}, ${sqlEscape(settings.academicYear)}, ${settings.weeklyDuesAmount}, ${sqlEscape(settings.headmasterName)}, ${sqlEscape(settings.headmasterNip)}, ${sqlEscape(settings.supervisorName)}, ${sqlEscape(settings.supervisorNip)}, ${sqlEscape(settings.coachName)}, ${sqlEscape(settings.presidentName)}, ${sqlEscape(settings.treasurerName)}, ${sqlEscape(settings.googleSheetUrl)}, ${sqlEscape(settings.activeWeekId || 'september_3')}, ${settings.factualCashPositions?.treasurerCashOnHand || 0}, ${settings.factualCashPositions?.presidentCashOnHand || 0});`);
  sql.push(``);

  // Week definitions
  sql.push(`-- 2. TABEL week_definitions`);
  sql.push(`CREATE TABLE \`week_definitions\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`month\` VARCHAR(30) NOT NULL,
  \`week_code\` VARCHAR(10) NOT NULL,
  \`label\` VARCHAR(50) NOT NULL,
  \`col_order\` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  if (weeks.length > 0) {
    const wVals = weeks.map((w, i) => `(${sqlEscape(w.id)}, ${sqlEscape(w.month)}, ${sqlEscape(w.week)}, ${sqlEscape(w.label)}, ${w.col || i + 1})`).join(',\n');
    sql.push(`INSERT INTO \`week_definitions\` VALUES \n${wVals};`);
  }
  sql.push(``);

  // Members
  sql.push(`-- 3. TABEL members`);
  sql.push(`CREATE TABLE \`members\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`student_id\` VARCHAR(30) NOT NULL UNIQUE,
  \`no_urut\` INT NOT NULL,
  \`batch\` INT NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`grade\` VARCHAR(20) NOT NULL,
  \`sub_class\` VARCHAR(50) NOT NULL,
  \`jersey_number\` INT NOT NULL DEFAULT 0,
  \`position\` VARCHAR(50) NOT NULL,
  \`gender\` VARCHAR(20) NOT NULL,
  \`birth_date\` DATE NULL,
  \`phone\` VARCHAR(30) NULL,
  \`avatar_url\` TEXT NULL,
  \`min_weeks\` INT NOT NULL DEFAULT 0,
  \`plus_weeks\` INT NOT NULL DEFAULT 0,
  \`total_paid_amount\` DECIMAL(15,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  if (members.length > 0) {
    const mVals = members.map(m => `(${sqlEscape(m.id)}, ${sqlEscape(m.studentId)}, ${m.no}, ${m.batch}, ${sqlEscape(m.name)}, ${sqlEscape(m.grade)}, ${sqlEscape(m.subClass)}, ${m.jerseyNumber || 0}, ${sqlEscape(m.position)}, ${sqlEscape(m.gender)}, ${m.birthDate ? sqlEscape(m.birthDate) : 'NULL'}, ${sqlEscape(m.phone)}, ${sqlEscape(m.avatarUrl)}, ${m.minWeeks || 0}, ${m.plusWeeks || 0}, ${m.totalPaidAmount || 0})`).join(',\n');
    sql.push(`INSERT INTO \`members\` VALUES \n${mVals};`);
  }
  sql.push(``);

  // Member Payments
  sql.push(`-- 4. TABEL member_payments`);
  sql.push(`CREATE TABLE \`member_payments\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`member_id\` VARCHAR(50) NOT NULL,
  \`week_id\` VARCHAR(50) NOT NULL,
  \`status\` ENUM('paid', 'unpaid', 'off') NOT NULL DEFAULT 'unpaid',
  \`nominal\` DECIMAL(12,2) NOT NULL DEFAULT 5000.00,
  \`paid_date\` DATE NULL,
  \`note\` VARCHAR(255) NULL,
  UNIQUE KEY \`uniq_mem_week\` (\`member_id\`, \`week_id\`),
  CONSTRAINT \`fk_pay_mem\` FOREIGN KEY (\`member_id\`) REFERENCES \`members\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);

  const pRows: string[] = [];
  members.forEach(m => {
    Object.entries(m.payments || {}).forEach(([wId, p]) => {
      if (p) {
        pRows.push(`(${sqlEscape(m.id)}, ${sqlEscape(wId)}, ${sqlEscape(p.status)}, ${p.nominal || 5000}, ${p.date ? sqlEscape(p.date) : 'NULL'}, ${sqlEscape(p.note)})`);
      }
    });
  });
  if (pRows.length > 0) {
    // Insert in chunks of 100 for MySQL stability
    for (let i = 0; i < pRows.length; i += 100) {
      const chunk = pRows.slice(i, i + 100);
      sql.push(`INSERT INTO \`member_payments\` (\`member_id\`, \`week_id\`, \`status\`, \`nominal\`, \`paid_date\`, \`note\`) VALUES \n${chunk.join(',\n')};`);
    }
  }
  sql.push(``);

  // Transactions
  sql.push(`-- 5. TABEL transactions`);
  sql.push(`CREATE TABLE \`transactions\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`trans_date\` DATE NOT NULL,
  \`receipt_number\` VARCHAR(60) NOT NULL UNIQUE,
  \`account_code\` VARCHAR(20) NULL,
  \`type\` ENUM('pemasukan', 'pengeluaran') NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`description\` TEXT NOT NULL,
  \`amount\` DECIMAL(15,2) NOT NULL,
  \`destination_account\` VARCHAR(60) NOT NULL,
  \`payer_or_payee\` VARCHAR(150) NULL,
  \`payment_method\` VARCHAR(50) NOT NULL,
  \`proof_url\` LONGTEXT NULL,
  \`notes\` TEXT NULL,
  \`created_at\` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  if (transactions.length > 0) {
    const tVals = transactions.map(t => `(${sqlEscape(t.id)}, ${sqlEscape(t.date)}, ${sqlEscape(t.receiptNumber)}, ${sqlEscape(t.accountCode)}, ${sqlEscape(t.type)}, ${sqlEscape(t.category)}, ${sqlEscape(t.description)}, ${t.amount}, ${sqlEscape(t.destinationAccount || 'Kas Kecil (Bendahara)')}, ${sqlEscape(t.payerOrPayee)}, ${sqlEscape(t.paymentMethod)}, ${sqlEscape(t.proofUrl)}, ${sqlEscape(t.notes)}, ${t.createdAt || Date.now()})`).join(',\n');
    sql.push(`INSERT INTO \`transactions\` VALUES \n${tVals};`);
  }
  sql.push(``);

  // Inventory
  sql.push(`-- 6. TABEL inventory_items`);
  sql.push(`CREATE TABLE \`inventory_items\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`type\` VARCHAR(20) NOT NULL,
  \`account_code\` VARCHAR(10) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`quantity\` INT NOT NULL,
  \`unit\` VARCHAR(50) NOT NULL,
  \`condition_state\` VARCHAR(50) NOT NULL,
  \`purchase_date\` DATE NOT NULL,
  \`unit_price\` DECIMAL(15,2) NOT NULL,
  \`total_price\` DECIMAL(15,2) NOT NULL,
  \`location\` VARCHAR(150) NOT NULL,
  \`notes\` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  if (inventory.length > 0) {
    const invVals = inventory.map(item => `(${sqlEscape(item.id)}, ${sqlEscape(item.type)}, ${sqlEscape(item.accountCode)}, ${sqlEscape(item.name)}, ${sqlEscape(item.category)}, ${item.quantity}, ${sqlEscape(item.unit)}, ${sqlEscape(item.condition)}, ${sqlEscape(item.purchaseDate)}, ${item.unitPrice}, ${item.totalPrice}, ${sqlEscape(item.location || 'Gudang Olahraga')}, ${sqlEscape(item.notes)})`).join(',\n');
    sql.push(`INSERT INTO \`inventory_items\` VALUES \n${invVals};`);
  }
  sql.push(``);

  // Agendas
  sql.push(`-- 7. TABEL club_agendas`);
  sql.push(`CREATE TABLE \`club_agendas\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(200) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`event_date\` DATE NOT NULL,
  \`event_time\` VARCHAR(100) NOT NULL,
  \`location\` VARCHAR(150) NOT NULL,
  \`description\` TEXT NULL,
  \`is_active\` BOOLEAN NOT NULL DEFAULT TRUE,
  \`target_audience\` VARCHAR(100) NOT NULL,
  \`pic\` VARCHAR(150) NOT NULL,
  \`created_at\` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`);
  if (agendas.length > 0) {
    const agVals = agendas.map(a => `(${sqlEscape(a.id)}, ${sqlEscape(a.title)}, ${sqlEscape(a.category)}, ${sqlEscape(a.date)}, ${sqlEscape(a.time)}, ${sqlEscape(a.location)}, ${sqlEscape(a.description)}, ${a.isActive ? 1 : 0}, ${sqlEscape(a.targetAudience)}, ${sqlEscape(a.pic)}, ${a.createdAt || Date.now()})`).join(',\n');
    sql.push(`INSERT INTO \`club_agendas\` VALUES \n${agVals};`);
  }
  sql.push(``);

  // Useful Views
  sql.push(`-- 8. VIEWS AKUNTANSI`);
  sql.push(`CREATE OR REPLACE VIEW \`v_ringkasan_keuangan\` AS
SELECT 
  COALESCE(SUM(CASE WHEN \`type\` = 'pemasukan' THEN \`amount\` ELSE 0 END), 0) AS \`total_pemasukan\`,
  COALESCE(SUM(CASE WHEN \`type\` = 'pengeluaran' THEN \`amount\` ELSE 0 END), 0) AS \`total_pengeluaran\`,
  COALESCE(SUM(CASE WHEN \`type\` = 'pemasukan' THEN \`amount\` ELSE -\`amount\` END), 0) AS \`saldo_organisasi\`
FROM \`transactions\`;`);

  const blob = new Blob([sql.join('\n')], { type: 'application/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `sacil_basket_mysql_dump_${new Date().toISOString().slice(0, 10)}.sql`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

