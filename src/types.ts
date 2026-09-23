export type Grade = 'Kelas 10' | 'Kelas 11' | 'Kelas 12' | 'Semua';

export type UserRole = 'bendahara' | 'publik'; // Dual Privileges: Bendahara (CRUD) & Stakeholder/Siswa/Ortu (Read Only)

export type PaymentStatus = 'paid' | 'unpaid' | 'off';

export interface WeekPayment {
  status: PaymentStatus;
  date?: string;
  nominal: number; // default Rp 5.000
  note?: string;
}

export interface WeekDefinition {
  id: string; // e.g. 'juli_1'
  month: string; // 'Juli'
  week: string; // 'M1'
  label: string; // 'Juli M1'
  col?: number;
}

export interface Member {
  id: string; // Unique internal ID
  studentId: string; // e.g. '39-001', '40-001'
  no: number;
  batch: number; // 39 (Kelas 11) or 40 (Kelas 10)
  name: string;
  grade: 'Kelas 10' | 'Kelas 11' | 'Kelas 12';
  subClass: string; // e.g. '11 F1-A', '10-A'
  jerseyNumber: number;
  position: 'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center';
  gender: 'Pria' | 'Wanita' | 'Putra' | 'Putri';
  birthDate?: string; // Format: YYYY-MM-DD (e.g. '2009-08-14')
  minWeeks: number; // Tunggakan kas (minggu)
  plusWeeks: number; // Kelebihan bayar (minggu)
  phone?: string;
  avatarUrl?: string; // Foto profil / avatar atlet
  payments: Record<string, WeekPayment>; // key: weekId (e.g. 'juli_1')
  totalPaidAmount: number; // Total rupiah terkumpul dari siswa
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export interface AccountCode {
  code: string; // 'UM1', 'UK7', etc.
  category: 'UMUM' | 'PENDAPATAN' | 'PENGELUARAN' | 'UTANG' | 'PIUTANG' | 'INVENTARIS';
  name: string;
  description: string;
  formulaOrRef?: string;
  defaultType?: TransactionType | null;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  receiptNumber: string; // e.g. 'BKM-2026-001' or 'BKK-2026-001'
  accountCode?: string; // e.g. 'UM1', 'UK1', 'UK7'
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  destinationAccount?: 'Kas Kecil (Bendahara)' | 'Kas Besar (Ketua/Pembina)';
  payerOrPayee?: string; // e.g. 'Kas Kelas 10', 'Teh Teisya (Ketua)', 'GOR'
  paymentMethod: 'Tunai' | 'Transfer Bank / QRIS' | 'Kolektif Bendahara';
  proofUrl?: string; // base64 or attachment reference
  notes?: string;
  createdAt: number;
}

export interface InventoryItem {
  id: string;
  type: 'peralatan' | 'perlengkapan'; // Peralatan (UK4 - Aset Tetap/Sarana) vs Perlengkapan (UK3 - Barang Habis Pakai)
  accountCode: 'UK3' | 'UK4';
  name: string;
  category: string;
  quantity: number;
  unit: string; // e.g. 'Buah', 'Set', 'Pcs', 'Dus', 'Botol'
  condition: 'Baik' | 'Cukup' | 'Perlu Perbaikan / Habis';
  purchaseDate: string;
  unitPrice: number;
  totalPrice: number;
  location?: string; // e.g. 'Gudang Olahraga / Lemari Ekskul'
  sourceTransactionId?: string;
  notes?: string;
}

export interface ClubSettings {
  schoolName: string; // 'SMA Negeri 1 Cileunyi'
  clubName: string; // 'Ekskul Basket SACIL'
  academicYear: string; // '2026/2027'
  weeklyDuesAmount: number; // Rp 5.000 per minggu
  headmasterName: string; // 'Drs. Caswanda, M.Ag.'
  headmasterNip?: string;
  supervisorName: string; // 'Drs. Caswanda, M.Ag.' (Pembina)
  supervisorNip?: string; // '196809061994121003'
  coachName: string; // 'Coach Hendra Kurniawan'
  presidentName: string; // 'Teisya' (Ketua Ekskul)
  treasurerName: string; // 'Assyfa Sadina Elvariyani' (Bendahara)
  googleSheetUrl: string;
  activeWeekId?: string; // ID minggu aktif berjalan (e.g. 'september_3')
  lastUpdatedTimestamp: string;
  treasurerPin?: string;
  factualCashPositions?: {
    treasurerCashOnHand: number;
    presidentCashOnHand: number;
  };
}

export type AgendaCategory = 'Latihan Rutin' | 'Kompetisi / Turnamen' | 'Diskusi / Briefing' | 'Sparring / Uji Coba' | 'Acara Lain';

export interface ClubAgenda {
  id: string;
  title: string;
  category: AgendaCategory;
  date: string; // YYYY-MM-DD (e.g. '2026-09-25')
  time: string; // e.g. '15:30 - 17:30 WIB'
  location: string;
  description?: string;
  isActive: boolean; // Hanya bisa diaktifkan/diedit oleh bendahara
  targetAudience: 'Semua Anggota' | 'Tim Putra' | 'Tim Putri' | 'Pengurus & Panitia';
  pic: string; // Penanggung Jawab
  createdAt: number;
}

export type ActiveTab = 'dashboard' | 'kas-mingguan' | 'transaksi' | 'anggota' | 'agenda' | 'inventaris' | 'laporan';

