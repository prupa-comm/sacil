import { Member, WeekDefinition, Transaction, ClubSettings, AccountCode } from '../types';

export const COA_CODES: AccountCode[] = [
  {
    "code": "SA",
    "category": "UMUM",
    "name": "Saldo Awal atau pindahan dari saldo akhir bulan sebelumnya",
    "description": "Saldo Awal atau pindahan dari saldo akhir bulan sebelumnya",
    "formulaOrRef": "Saldo Awal Bulan Berjalan = Saldo Akhir Bulan Sebelumnya",
    "defaultType": null
  },
  {
    "code": "SB",
    "category": "UMUM",
    "name": "Saldo Akhir Bulan Berjalan",
    "description": "Saldo Akhir Bulan Berjalan",
    "formulaOrRef": "Saldo Akhir = Pendapatan - Pengeluaran",
    "defaultType": null
  },
  {
    "code": "KK",
    "category": "UMUM",
    "name": "Kas Kecil (Bendahara)",
    "description": "Kas Kecil (Bendahara)",
    "formulaOrRef": "",
    "defaultType": null
  },
  {
    "code": "KB",
    "category": "UMUM",
    "name": "Kas Besar (Ketua)",
    "description": "Kas Besar (Ketua)",
    "formulaOrRef": "",
    "defaultType": null
  },
  {
    "code": "UM1",
    "category": "PENDAPATAN",
    "name": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Wajib Kas Peserta Ekskul",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM2",
    "category": "PENDAPATAN",
    "name": "Setoran Sukarela Peserta Ekskul",
    "description": "Setoran Sukarela Peserta Ekskul",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM3",
    "category": "PENDAPATAN",
    "name": "Donasi/Sumbangan Perorangan (Non Sekolah)",
    "description": "Donasi/Sumbangan Perorangan (Non Sekolah)",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM4",
    "category": "PENDAPATAN",
    "name": "Dana Bantuan Sekolah/Pemerintah",
    "description": "Dana Bantuan Sekolah/Pemerintah",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM5",
    "category": "PENDAPATAN",
    "name": "Sponsorship",
    "description": "Sponsorship",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM6",
    "category": "PENDAPATAN",
    "name": "(slot tambahan)",
    "description": "(slot tambahan)",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM7",
    "category": "PENDAPATAN",
    "name": "Setor dari Kas Besar Ke Kas Kecil",
    "description": "Penerimaan dana dari Kas Besar (Ketua/Pembina) ke Kas Kecil (Bendahara) untuk operasional",
    "formulaOrRef": "Uang masuk operasional dari Kas Besar ke Kas Kecil",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM8",
    "category": "PENDAPATAN",
    "name": "Pendapatan Lainnya",
    "description": "Pendapatan Lainnya",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UM9",
    "category": "PENDAPATAN",
    "name": "Uang Masuk Tidak Terdeteksi",
    "description": "Uang Masuk Tidak Terdeteksi",
    "formulaOrRef": "",
    "defaultType": "pemasukan"
  },
  {
    "code": "UK1",
    "category": "PENGELUARAN",
    "name": "Administrasi Organisasi (print, surat, dokumen)",
    "description": "Administrasi Organisasi (print, surat, dokumen)",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK2",
    "category": "PENGELUARAN",
    "name": "Operasional Lapangan (latihan, kompetisi)",
    "description": "Operasional Lapangan (latihan, kompetisi)",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK3",
    "category": "PENGELUARAN",
    "name": "Pembelian Peralatan Tetap",
    "description": "Pembelian Peralatan Tetap",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK4",
    "category": "PENGELUARAN",
    "name": "Pembelian Perlengkapan Habis Pakai",
    "description": "Pembelian Perlengkapan Habis Pakai",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK5",
    "category": "PENGELUARAN",
    "name": "(slot tambahan)",
    "description": "(slot tambahan)",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK6",
    "category": "PENGELUARAN",
    "name": "(slot tambahan)",
    "description": "(slot tambahan)",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK7",
    "category": "PENGELUARAN",
    "name": "Setor dari Kas Kecil Ke Kas Besar",
    "description": "Setor dari Kas Kecil Ke Kas Besar",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK8",
    "category": "PENGELUARAN",
    "name": "Pengeluaran Lainnya",
    "description": "Pengeluaran Lainnya",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UK9",
    "category": "PENGELUARAN",
    "name": "Pengeluaran Tidak Terdeteksi",
    "description": "Pengeluaran Tidak Terdeteksi",
    "formulaOrRef": "",
    "defaultType": "pengeluaran"
  },
  {
    "code": "UT1",
    "category": "UTANG",
    "name": "Pinjaman Perorangan/institusi (Nama)",
    "description": "Pinjaman Perorangan/institusi (Nama)",
    "formulaOrRef": "",
    "defaultType": null
  },
  {
    "code": "UT2",
    "category": "UTANG",
    "name": "Pengembalian Pinjaman Perorangan/institusi (Nama)",
    "description": "Pengembalian Pinjaman Perorangan/institusi (Nama)",
    "formulaOrRef": "",
    "defaultType": null
  },
  {
    "code": "UT3",
    "category": "UTANG",
    "name": "Surplus Setoran Wajib",
    "description": "Surplus Setoran Wajib",
    "formulaOrRef": "Terhubung dengan KODE UM1",
    "defaultType": null
  },
  {
    "code": "PT1",
    "category": "PIUTANG",
    "name": "Piutang Setoran Wajib",
    "description": "Piutang Setoran Wajib",
    "formulaOrRef": "Terhubung dengan KODE UM1",
    "defaultType": null
  },
  {
    "code": "IV1",
    "category": "INVENTARIS",
    "name": "Peralatan Milik Organisasi",
    "description": "Peralatan Milik Organisasi",
    "formulaOrRef": "Terhubung dengan KODE UK3",
    "defaultType": null
  },
  {
    "code": "IV2",
    "category": "INVENTARIS",
    "name": "Perlengkapan Milik Organisasi",
    "description": "Perlengkapan Milik Organisasi",
    "formulaOrRef": "Terhubung dengan KODE UK4",
    "defaultType": null
  }
];

export const INITIAL_WEEKS: WeekDefinition[] = [
  {
    "id": "juli_1",
    "col": 6,
    "month": "Juli",
    "week": "M1",
    "label": "Juli M1"
  },
  {
    "id": "juli_2",
    "col": 7,
    "month": "Juli",
    "week": "M2",
    "label": "Juli M2"
  },
  {
    "id": "juli_3",
    "col": 8,
    "month": "Juli",
    "week": "M3",
    "label": "Juli M3"
  },
  {
    "id": "juli_4",
    "col": 9,
    "month": "Juli",
    "week": "M4",
    "label": "Juli M4"
  },
  {
    "id": "agustus_1",
    "col": 10,
    "month": "Agustus",
    "week": "M1",
    "label": "Agustus M1"
  },
  {
    "id": "agustus_2",
    "col": 11,
    "month": "Agustus",
    "week": "M2",
    "label": "Agustus M2"
  },
  {
    "id": "agustus_3",
    "col": 12,
    "month": "Agustus",
    "week": "M3",
    "label": "Agustus M3"
  },
  {
    "id": "agustus_4",
    "col": 13,
    "month": "Agustus",
    "week": "M4",
    "label": "Agustus M4"
  },
  {
    "id": "agustus_5",
    "col": 14,
    "month": "Agustus",
    "week": "M5",
    "label": "Agustus M5"
  },
  {
    "id": "september_1",
    "col": 15,
    "month": "September",
    "week": "M1",
    "label": "September M1"
  },
  {
    "id": "september_2",
    "col": 16,
    "month": "September",
    "week": "M2",
    "label": "September M2"
  },
  {
    "id": "september_3",
    "col": 17,
    "month": "September",
    "week": "M3",
    "label": "September M3"
  },
  {
    "id": "september_4",
    "col": 18,
    "month": "September",
    "week": "M4",
    "label": "September M4"
  },
  {
    "id": "oktober_1",
    "col": 19,
    "month": "Oktober",
    "week": "M1",
    "label": "Oktober M1"
  },
  {
    "id": "oktober_2",
    "col": 20,
    "month": "Oktober",
    "week": "M2",
    "label": "Oktober M2"
  },
  {
    "id": "oktober_3",
    "col": 21,
    "month": "Oktober",
    "week": "M3",
    "label": "Oktober M3"
  },
  {
    "id": "oktober_4",
    "col": 22,
    "month": "Oktober",
    "week": "M4",
    "label": "Oktober M4"
  },
  {
    "id": "november_1",
    "col": 23,
    "month": "November",
    "week": "M1",
    "label": "November M1"
  },
  {
    "id": "november_2",
    "col": 24,
    "month": "November",
    "week": "M2",
    "label": "November M2"
  },
  {
    "id": "november_3",
    "col": 25,
    "month": "November",
    "week": "M3",
    "label": "November M3"
  },
  {
    "id": "november_4",
    "col": 26,
    "month": "November",
    "week": "M4",
    "label": "November M4"
  },
  {
    "id": "desember_1",
    "col": 27,
    "month": "Desember",
    "week": "M1",
    "label": "Desember M1"
  },
  {
    "id": "desember_2",
    "col": 28,
    "month": "Desember",
    "week": "M2",
    "label": "Desember M2"
  },
  {
    "id": "desember_3",
    "col": 29,
    "month": "Desember",
    "week": "M3",
    "label": "Desember M3"
  },
  {
    "id": "desember_4",
    "col": 30,
    "month": "Desember",
    "week": "M4",
    "label": "Desember M4"
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    "id": "member_39_001",
    "studentId": "39-001",
    "no": 1,
    "batch": 39,
    "name": "Arjuna Anggara A.S",
    "grade": "Kelas 11",
    "subClass": "11 F1-A",
    "jerseyNumber": 1,
    "position": "Point Guard",
    "gender": "Pria",
    "minWeeks": 2,
    "plusWeeks": 0,
    "phone": "+62812100123",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "paid",
        "date": "2026-08-19",
        "nominal": 5000,
        "note": "Kas Pekan 3"
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 15000
  },
  {
    "id": "member_39_002",
    "studentId": "39-002",
    "no": 2,
    "batch": 39,
    "name": "Richardo Anugrah Bako",
    "grade": "Kelas 11",
    "subClass": "11 F2-A",
    "jerseyNumber": 2,
    "position": "Shooting Guard",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812110130",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_39_003",
    "studentId": "39-003",
    "no": 3,
    "batch": 39,
    "name": "Meisya Anindya Nirbitha",
    "grade": "Kelas 11",
    "subClass": "11 F2-C",
    "jerseyNumber": 3,
    "position": "Small Forward",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812120137",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_39_004",
    "studentId": "39-004",
    "no": 4,
    "batch": 39,
    "name": "Raihan Fauzan Hanief",
    "grade": "Kelas 11",
    "subClass": "11 F2-C",
    "jerseyNumber": 4,
    "position": "Power Forward",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812130144",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_39_005",
    "studentId": "39-005",
    "no": 5,
    "batch": 39,
    "name": "Dwinantara Arsya R.C",
    "grade": "Kelas 11",
    "subClass": "11 F2-D",
    "jerseyNumber": 5,
    "position": "Center",
    "gender": "Pria",
    "minWeeks": 1,
    "plusWeeks": 0,
    "phone": "+62812140151",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "off",
        "nominal": 0,
        "note": "Libur Ekskul"
      },
      "september_2": {
        "status": "off",
        "nominal": 0,
        "note": "Libur Ekskul"
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_39_006",
    "studentId": "39-006",
    "no": 6,
    "batch": 39,
    "name": "Husni Ali Riyaddudin",
    "grade": "Kelas 11",
    "subClass": "11 F2-D",
    "jerseyNumber": 6,
    "position": "Point Guard",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812150158",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "off",
        "nominal": 0,
        "note": "Libur Ekskul"
      },
      "september_2": {
        "status": "off",
        "nominal": 0,
        "note": "Libur Ekskul"
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-21",
        "nominal": 5000,
        "note": "Kas Pekan 3"
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 10000
  },
  {
    "id": "member_39_007",
    "studentId": "39-007",
    "no": 7,
    "batch": 39,
    "name": "Rajendra Fadhil Alvaro",
    "grade": "Kelas 11",
    "subClass": "11 F2-D",
    "jerseyNumber": 7,
    "position": "Shooting Guard",
    "gender": "Pria",
    "minWeeks": 2,
    "plusWeeks": 0,
    "phone": "+62812160165",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_39_008",
    "studentId": "39-008",
    "no": 8,
    "batch": 39,
    "name": "Rismawati Sutoyo",
    "grade": "Kelas 11",
    "subClass": "11 F3-A",
    "jerseyNumber": 8,
    "position": "Small Forward",
    "gender": "Wanita",
    "minWeeks": 2,
    "plusWeeks": 0,
    "phone": "+62812170172",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 10000
  },
  {
    "id": "member_39_009",
    "studentId": "39-009",
    "no": 9,
    "batch": 39,
    "name": "Adelia Septiani",
    "grade": "Kelas 11",
    "subClass": "11 F3-C",
    "jerseyNumber": 9,
    "position": "Power Forward",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812180179",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_39_010",
    "studentId": "39-010",
    "no": 10,
    "batch": 39,
    "name": "Muhammad Rizki Aurelio",
    "grade": "Kelas 11",
    "subClass": "11 F3-C",
    "jerseyNumber": 10,
    "position": "Center",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812190186",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_39_011",
    "studentId": "39-011",
    "no": 11,
    "batch": 39,
    "name": "Syahla Athaya Nafisah Z",
    "grade": "Kelas 11",
    "subClass": "11 F3-E",
    "jerseyNumber": 11,
    "position": "Point Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812200193",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_39_012",
    "studentId": "39-012",
    "no": 12,
    "batch": 39,
    "name": "Assyfa Sadina Elvariyani",
    "grade": "Kelas 11",
    "subClass": "11 F3-F",
    "jerseyNumber": 12,
    "position": "Shooting Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812210200",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-02",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_39_013",
    "studentId": "39-013",
    "no": 13,
    "batch": 39,
    "name": "Guruh Dewantara",
    "grade": "Kelas 11",
    "subClass": "11 F3-F",
    "jerseyNumber": 13,
    "position": "Small Forward",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812220207",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_001",
    "studentId": "40-001",
    "no": 1,
    "batch": 40,
    "name": "Alfian Maulana",
    "grade": "Kelas 10",
    "subClass": "10-A",
    "jerseyNumber": 14,
    "position": "Power Forward",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812230214",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_002",
    "studentId": "40-002",
    "no": 2,
    "batch": 40,
    "name": "Aluna Sagita",
    "grade": "Kelas 10",
    "subClass": "10-A",
    "jerseyNumber": 15,
    "position": "Center",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812240221",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "paid",
        "date": "2026-08-19",
        "nominal": 5000,
        "note": "Kas Pekan 3"
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 10000
  },
  {
    "id": "member_40_003",
    "studentId": "40-003",
    "no": 3,
    "batch": 40,
    "name": "Muhammad Khadafi",
    "grade": "Kelas 10",
    "subClass": "10-A",
    "jerseyNumber": 16,
    "position": "Point Guard",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812250228",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "paid",
        "date": "2026-08-19",
        "nominal": 5000,
        "note": "Kas Pekan 4"
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 10000
  },
  {
    "id": "member_40_004",
    "studentId": "40-004",
    "no": 4,
    "batch": 40,
    "name": "Ghaisan Jaris",
    "grade": "Kelas 10",
    "subClass": "10-B",
    "jerseyNumber": 17,
    "position": "Shooting Guard",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812260235",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_40_005",
    "studentId": "40-005",
    "no": 5,
    "batch": 40,
    "name": "Yuane Silvia",
    "grade": "Kelas 10",
    "subClass": "10-B",
    "jerseyNumber": 18,
    "position": "Small Forward",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812270242",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_40_006",
    "studentId": "40-006",
    "no": 6,
    "batch": 40,
    "name": "Dema Kinan",
    "grade": "Kelas 10",
    "subClass": "10-D",
    "jerseyNumber": 19,
    "position": "Power Forward",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 1,
    "phone": "+62812280249",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "paid",
        "date": "2026-08-19",
        "nominal": 5000,
        "note": "Kas Pekan 3"
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000,
        "note": "Bayar Dimuka"
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 35000
  },
  {
    "id": "member_40_007",
    "studentId": "40-007",
    "no": 7,
    "batch": 40,
    "name": "Dendi Wijaya",
    "grade": "Kelas 10",
    "subClass": "10-E",
    "jerseyNumber": 20,
    "position": "Center",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812290256",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_008",
    "studentId": "40-008",
    "no": 8,
    "batch": 40,
    "name": "Nazriel Dwi",
    "grade": "Kelas 10",
    "subClass": "10-E",
    "jerseyNumber": 21,
    "position": "Point Guard",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812300263",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_009",
    "studentId": "40-009",
    "no": 9,
    "batch": 40,
    "name": "Aisyah Azkiya",
    "grade": "Kelas 10",
    "subClass": "10-F",
    "jerseyNumber": 22,
    "position": "Shooting Guard",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812310270",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_40_010",
    "studentId": "40-010",
    "no": 10,
    "batch": 40,
    "name": "Hafizh Rifqi",
    "grade": "Kelas 10",
    "subClass": "10-F",
    "jerseyNumber": 23,
    "position": "Small Forward",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812320277",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "paid",
        "date": "2026-08-19",
        "nominal": 5000,
        "note": "Kas Pekan 3"
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 25000
  },
  {
    "id": "member_40_011",
    "studentId": "40-011",
    "no": 11,
    "batch": 40,
    "name": "Muhammad Syakir Arviansyah",
    "grade": "Kelas 10",
    "subClass": "10-F",
    "jerseyNumber": 24,
    "position": "Power Forward",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 1,
    "phone": "+62812330284",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000,
        "note": "Bayar Dimuka"
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 25000
  },
  {
    "id": "member_40_012",
    "studentId": "40-012",
    "no": 12,
    "batch": 40,
    "name": "Elis Styaloka",
    "grade": "Kelas 10",
    "subClass": "10-G",
    "jerseyNumber": 25,
    "position": "Center",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812340291",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_013",
    "studentId": "40-013",
    "no": 13,
    "batch": 40,
    "name": "Muhammad Raga Pratama",
    "grade": "Kelas 10",
    "subClass": "10-G",
    "jerseyNumber": 26,
    "position": "Point Guard",
    "gender": "Pria",
    "minWeeks": 2,
    "plusWeeks": 0,
    "phone": "+62812350298",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 10000
  },
  {
    "id": "member_40_014",
    "studentId": "40-014",
    "no": 14,
    "batch": 40,
    "name": "Puan Sae",
    "grade": "Kelas 10",
    "subClass": "10-G",
    "jerseyNumber": 27,
    "position": "Shooting Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812360305",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 15000
  },
  {
    "id": "member_40_015",
    "studentId": "40-015",
    "no": 15,
    "batch": 40,
    "name": "Yusuf Gibran",
    "grade": "Kelas 10",
    "subClass": "10-G",
    "jerseyNumber": 28,
    "position": "Small Forward",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812370312",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_016",
    "studentId": "40-016",
    "no": 16,
    "batch": 40,
    "name": "Jihan Luthfi",
    "grade": "Kelas 10",
    "subClass": "10-H",
    "jerseyNumber": 29,
    "position": "Power Forward",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812380319",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-02",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_017",
    "studentId": "40-017",
    "no": 17,
    "batch": 40,
    "name": "Rajata Wira",
    "grade": "Kelas 10",
    "subClass": "10-H",
    "jerseyNumber": 30,
    "position": "Center",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812390326",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_018",
    "studentId": "40-018",
    "no": 18,
    "batch": 40,
    "name": "Dias Ikhsanul",
    "grade": "Kelas 10",
    "subClass": "10-I",
    "jerseyNumber": 31,
    "position": "Point Guard",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812400333",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_40_019",
    "studentId": "40-019",
    "no": 19,
    "batch": 40,
    "name": "Gantari Amyra",
    "grade": "Kelas 10",
    "subClass": "10-I",
    "jerseyNumber": 32,
    "position": "Shooting Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812410340",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_020",
    "studentId": "40-020",
    "no": 20,
    "batch": 40,
    "name": "Nasywa Salsabilallah",
    "grade": "Kelas 10",
    "subClass": "10-J",
    "jerseyNumber": 33,
    "position": "Small Forward",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812420347",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 0
  },
  {
    "id": "member_40_021",
    "studentId": "40-021",
    "no": 21,
    "batch": 40,
    "name": "Rizam Achmad",
    "grade": "Kelas 10",
    "subClass": "10-K",
    "jerseyNumber": 34,
    "position": "Power Forward",
    "gender": "Pria",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812430354",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-09",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_022",
    "studentId": "40-022",
    "no": 22,
    "batch": 40,
    "name": "Vina Aulia",
    "grade": "Kelas 10",
    "subClass": "10-K",
    "jerseyNumber": 35,
    "position": "Center",
    "gender": "Wanita",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812440361",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  },
  {
    "id": "member_40_023",
    "studentId": "40-023",
    "no": 23,
    "batch": 40,
    "name": "Nazfa Yulia",
    "grade": "Kelas 10",
    "subClass": "10-L",
    "jerseyNumber": 1,
    "position": "Point Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812450368",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-02",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_024",
    "studentId": "40-024",
    "no": 24,
    "batch": 40,
    "name": "Niken Alexandra",
    "grade": "Kelas 10",
    "subClass": "10-L",
    "jerseyNumber": 2,
    "position": "Shooting Guard",
    "gender": "Wanita",
    "minWeeks": 0,
    "plusWeeks": 0,
    "phone": "+62812460375",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_2": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_3": {
        "status": "paid",
        "date": "2026-09-16",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 20000
  },
  {
    "id": "member_40_025",
    "studentId": "40-025",
    "no": 25,
    "batch": 40,
    "name": "Nizab Alfahri",
    "grade": "Kelas 10",
    "subClass": "10-L",
    "jerseyNumber": 3,
    "position": "Small Forward",
    "gender": "Pria",
    "minWeeks": 3,
    "plusWeeks": 0,
    "phone": "+62812470382",
    "payments": {
      "juli_1": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_2": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_3": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "juli_4": {
        "status": "off",
        "nominal": 0,
        "note": "Masa Orientasi"
      },
      "agustus_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_2": {
        "status": "paid",
        "date": "2026-08-12",
        "nominal": 5000,
        "note": "Kas Pekan 2"
      },
      "agustus_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "agustus_5": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "september_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "oktober_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "november_4": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_1": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_2": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_3": {
        "status": "unpaid",
        "nominal": 5000
      },
      "desember_4": {
        "status": "unpaid",
        "nominal": 5000
      }
    },
    "totalPaidAmount": 5000
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    "id": "tx_20260812_01",
    "date": "2026-08-12",
    "receiptNumber": "BKM-2026-08-001",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 2 Agustus (20 Anggota Kelas 10 & 11)",
    "amount": 102000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1723446000000
  },
  {
    "id": "tx_20260812_02",
    "date": "2026-08-12",
    "receiptNumber": "BKM-2026-08-002",
    "accountCode": "UM9",
    "type": "pemasukan",
    "category": "Uang Masuk Tidak Terdeteksi",
    "description": "Selisih lebih uang masuk kas",
    "amount": 3000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Kas Box",
    "paymentMethod": "Tunai",
    "createdAt": 1723447800000
  },
  {
    "id": "tx_20260814_01",
    "date": "2026-08-14",
    "receiptNumber": "BKK-2026-08-001",
    "accountCode": "UK7",
    "type": "pengeluaran",
    "category": "Setor dari Kas Kecil Ke Kas Besar",
    "description": "Penyetoran Kas Kecil Bendahara ke Kas Besar (Teh Teisya - Ketua)",
    "amount": 105000,
    "destinationAccount": "Kas Besar (Ketua/Pembina)",
    "payerOrPayee": "Teh Teisya (Ketua Ekskul)",
    "paymentMethod": "Tunai",
    "notes": "Pengamanan kas operasional ke rekening/brankas pengawas",
    "createdAt": 1723618800000
  },
  {
    "id": "tx_20260819_01",
    "date": "2026-08-19",
    "receiptNumber": "BKM-2026-08-003",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 3 Agustus (14 Anggota)",
    "amount": 100000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1724050800000
  },
  {
    "id": "tx_20260819_02",
    "date": "2026-08-19",
    "receiptNumber": "BKK-2026-08-002",
    "accountCode": "UK7",
    "type": "pengeluaran",
    "category": "Setor dari Kas Kecil Ke Kas Besar",
    "description": "Penyetoran Kas Kecil Ke Kas Besar (Teh Teisya)",
    "amount": 100000,
    "destinationAccount": "Kas Besar (Ketua/Pembina)",
    "payerOrPayee": "Teh Teisya (Ketua Ekskul)",
    "paymentMethod": "Tunai",
    "createdAt": 1724054400000
  },
  {
    "id": "tx_20260826_01",
    "date": "2026-08-26",
    "receiptNumber": "BKM-2026-08-004",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 4 Agustus (6 Anggota)",
    "amount": 30000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1724655600000
  },
  {
    "id": "tx_20260828_01",
    "date": "2026-08-28",
    "receiptNumber": "BKK-2026-08-003",
    "accountCode": "UK7",
    "type": "pengeluaran",
    "category": "Setor dari Kas Kecil Ke Kas Besar",
    "description": "Penyetoran akhir bulan ke Kas Besar (Teh Teisya)",
    "amount": 30000,
    "destinationAccount": "Kas Besar (Ketua/Pembina)",
    "payerOrPayee": "Teh Teisya (Ketua Ekskul)",
    "paymentMethod": "Tunai",
    "createdAt": 1724828400000
  },
  {
    "id": "tx_20260902_01",
    "date": "2026-09-02",
    "receiptNumber": "BKM-2026-09-001",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 1 September (Jihan, Nazfa, Assyfa, Husni, Arif)",
    "amount": 22000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1725260400000
  },
  {
    "id": "tx_20260906_01",
    "date": "2026-09-06",
    "receiptNumber": "BKK-2026-09-001",
    "accountCode": "UK7",
    "type": "pengeluaran",
    "category": "Setor dari Kas Kecil Ke Kas Besar",
    "description": "Penyetoran Kas Kecil Ke Teh Teisya (Kas Besar)",
    "amount": 22000,
    "destinationAccount": "Kas Besar (Ketua/Pembina)",
    "payerOrPayee": "Teh Teisya (Ketua Ekskul)",
    "paymentMethod": "Tunai",
    "createdAt": 1725606000000
  },
  {
    "id": "tx_20260909_01",
    "date": "2026-09-09",
    "receiptNumber": "BKM-2026-09-002",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 2 September (10 Siswa Ekskul)",
    "amount": 55000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1725865200000
  },
  {
    "id": "tx_20260915_01",
    "date": "2026-09-15",
    "receiptNumber": "BKK-2026-09-002",
    "accountCode": "UK1",
    "type": "pengeluaran",
    "category": "Administrasi Organisasi",
    "description": "Pembelian Buku Absen & Presensi Latihan",
    "amount": 8000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Fotokopi & ATK Mandiri",
    "paymentMethod": "Tunai",
    "notes": "Pengadaan perlengkapan administrasi presensi",
    "createdAt": 1726383600000
  },
  {
    "id": "tx_20260916_01",
    "date": "2026-09-16",
    "receiptNumber": "BKM-2026-09-003",
    "accountCode": "UM1",
    "type": "pemasukan",
    "category": "Setoran Wajib Kas Peserta Ekskul",
    "description": "Setoran Kas Pekan 3 September (13 Siswa Ekskul - Rapel & Bayar Dimuka)",
    "amount": 170000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Siswa Ekskul Basket",
    "paymentMethod": "Kolektif Bendahara",
    "createdAt": 1726470000000
  },
  {
    "id": "tx_20260917_01",
    "date": "2026-09-17",
    "receiptNumber": "BKK-2026-09-003",
    "accountCode": "UK1",
    "type": "pengeluaran",
    "category": "Administrasi Organisasi",
    "description": "Print Surat Izin & Berkas Sertijab Organisasi",
    "amount": 7000,
    "destinationAccount": "Kas Kecil (Bendahara)",
    "payerOrPayee": "Digital Printing Cileunyi",
    "paymentMethod": "Tunai",
    "notes": "Surat permohonan dispensasi kegiatan sertijab",
    "createdAt": 1726556400000
  }
];

export const INITIAL_SETTINGS: ClubSettings = {
  schoolName: "SMA Negeri 1 Cileunyi",
  clubName: "Ekskul Basket SACIL",
  academicYear: "2026/2027",
  weeklyDuesAmount: 5000,
  headmasterName: "Drs. Caswanda, M.Ag.",
  headmasterNip: "196809061994121003",
  supervisorName: "Drs. Caswanda, M.Ag.",
  supervisorNip: "196809061994121003",
  coachName: "Coach Hendra Kurniawan",
  presidentName: "Teisya",
  treasurerName: "Assyfa Sadina Elvariyani",
  googleSheetUrl: "https://drive.google.com/drive/folders/1s7Xv2B0gqMuc7ql88fjgT7d1XW8m03zz",
  activeWeekId: "september_3",
  lastUpdatedTimestamp: "21 September 2026, 10:00 WIB"
};

export const INCOME_CATEGORIES = [
  "UM1 - Setoran Wajib Kas Peserta Ekskul",
  "UM2 - Setoran Sukarela Peserta Ekskul",
  "UM3 - Donasi/Sumbangan Perorangan (Non Sekolah)",
  "UM4 - Dana Bantuan Sekolah/Pemerintah",
  "UM5 - Sponsorship",
  "UM7 - Setor dari Kas Besar Ke Kas Kecil",
  "UM8 - Pendapatan Lainnya",
  "UM9 - Uang Masuk Tidak Terdeteksi"
];

export const EXPENSE_CATEGORIES = [
  "UK1 - Administrasi Organisasi (print, surat, dokumen)",
  "UK2 - Operasional Lapangan (latihan, kompetisi)",
  "UK3 - Pembelian Peralatan Tetap",
  "UK4 - Pembelian Perlengkapan Habis Pakai",
  "UK7 - Setor dari Kas Kecil Ke Kas Besar (Teh Teisya/Ketua)",
  "UK8 - Pengeluaran Lainnya",
  "UK9 - Pengeluaran Tidak Terdeteksi"
];
