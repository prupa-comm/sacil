import { ClubAgenda } from '../types';

export const INITIAL_AGENDAS: ClubAgenda[] = [
  {
    id: 'agenda-1',
    title: 'Latihan Rutin Tim Putra (Drill Offense & Defense)',
    category: 'Latihan Rutin',
    date: '2026-09-25',
    time: '15:30 - 17:30 WIB',
    location: 'Lapangan Utama SMA Negeri 1 Cileunyi',
    description: 'Fokus materi: Fast break transition, defense 2-3 zone, free-throw conditioning. Wajib membawa jersey latihan dan botol minum sendiri.',
    isActive: true,
    targetAudience: 'Tim Putra',
    pic: 'Coach Hendra Kurniawan',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: 'agenda-2',
    title: 'Latihan Rutin Tim Putri (Fundamental Passing & Shooting)',
    category: 'Latihan Rutin',
    date: '2026-09-26',
    time: '07:30 - 10:00 WIB',
    location: 'Lapangan Utama SMA Negeri 1 Cileunyi',
    description: 'Drill ball-handling, lay-up contest, serta scrimmage game antar rombel kelas 10 dan 11. Diharapkan hadir 15 menit sebelum pemanasan.',
    isActive: true,
    targetAudience: 'Tim Putri',
    pic: 'Coach Hendra & Teh Teisya',
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'agenda-3',
    title: 'Sparring / Friendly Match vs SMAN Cikeruh',
    category: 'Sparring / Uji Coba',
    date: '2026-09-30',
    time: '15:45 - 18:00 WIB',
    location: 'GOR Basket Cileunyi',
    description: 'Pertandingan persahabatan uji coba persiapan kompetisi. Seluruh anggota tim putra dan putri diharapkan hadir untuk bertanding dan memberikan dukungan.',
    isActive: true,
    targetAudience: 'Semua Anggota',
    pic: 'Teisya (Ketua Ekskul)',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'agenda-4',
    title: 'Rapat Koordinasi & Evaluasi Keuangan Kas Ekskul',
    category: 'Diskusi / Briefing',
    date: '2026-10-02',
    time: '17:00 - 17:45 WIB',
    location: 'Ruang OSIS SMA Negeri 1 Cileunyi',
    description: 'Laporan kas masuk bulan September, evaluasi tunggakan kas, rencana pengadaan bola basket Molten BG4500 dan rompi latihan baru.',
    isActive: true,
    targetAudience: 'Pengurus & Panitia',
    pic: 'Assyfa Sadina (Bendahara)',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'agenda-5',
    title: 'Turnamen Bola Basket Pelajar Se-Bandung Timur',
    category: 'Kompetisi / Turnamen',
    date: '2026-10-17',
    time: '08:00 - 17:00 WIB',
    location: 'GOR Arcamanik Youth Center Bandung',
    description: 'Babak penyisihan turnamen resmi antar SMA se-Bandung Raya & Timur. Menggunakan jersey resmi pertandingan SACIL Basket.',
    isActive: true,
    targetAudience: 'Semua Anggota',
    pic: 'Coach Hendra & Drs. Caswanda, M.Ag.',
    createdAt: Date.now() - 86400000
  }
];
