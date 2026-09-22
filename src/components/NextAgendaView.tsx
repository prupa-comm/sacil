import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Share2,
  Trophy,
  Activity,
  MessageSquare,
  Flame,
  Sparkles,
  AlertCircle,
  X,
  Check,
  CalendarPlus
} from 'lucide-react';
import { ClubAgenda, AgendaCategory, UserRole } from '../types';

interface NextAgendaViewProps {
  agendas: ClubAgenda[];
  userRole: UserRole;
  onAddAgenda: (agenda: Omit<ClubAgenda, 'id' | 'createdAt'>) => void;
  onUpdateAgenda: (agenda: ClubAgenda) => void;
  onDeleteAgenda: (agendaId: string) => void;
  onToggleActiveAgenda: (agendaId: string) => void;
}

export const NextAgendaView: React.FC<NextAgendaViewProps> = ({
  agendas,
  userRole,
  onAddAgenda,
  onUpdateAgenda,
  onDeleteAgenda,
  onToggleActiveAgenda
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | 'aktif' | 'nonaktif'>('Semua');
  const [selectedAudience, setSelectedAudience] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<ClubAgenda | null>(null);
  const [deletingAgendaId, setDeletingAgendaId] = useState<string | null>(null);
  const [copyToast, setCopyToast] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<AgendaCategory>('Latihan Rutin');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('15:30 - 17:30 WIB');
  const [formLocation, setFormLocation] = useState('Lapangan Basket SMAN 1 Cileunyi');
  const [formTargetAudience, setFormTargetAudience] = useState<'Semua Anggota' | 'Tim Putra' | 'Tim Putri' | 'Pengurus & Panitia'>('Semua Anggota');
  const [formPic, setFormPic] = useState('Coach Hendra Kurniawan');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Helper date parsing
  const parseDateDetails = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const monthIndex = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const dateObj = new Date(year, monthIndex, day);

        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const fullMonths = [
          'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
          'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const dayName = days[dateObj.getDay()];
        const monthShort = months[monthIndex];
        const monthFull = fullMonths[monthIndex];

        // Countdown calculation
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(year, monthIndex, day);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let countdown = '';
        let isPast = false;
        if (diffDays === 0) {
          countdown = 'Hari Ini!';
        } else if (diffDays === 1) {
          countdown = 'Besok';
        } else if (diffDays > 1 && diffDays <= 7) {
          countdown = `${diffDays} hari lagi`;
        } else if (diffDays > 7) {
          countdown = `${diffDays} hari lagi`;
        } else {
          isPast = true;
          countdown = 'Selesai';
        }

        return { day, dayName, monthShort, monthFull, year, countdown, isPast };
      }
    } catch {
      // fallback
    }
    return { day: 1, dayName: 'Hari', monthShort: 'Bln', monthFull: 'Bulan', year: 2026, countdown: '', isPast: false };
  };

  // Open add modal
  const handleOpenAddModal = () => {
    setEditingAgenda(null);
    setFormTitle('');
    setFormCategory('Latihan Rutin');
    const todayStr = new Date().toISOString().slice(0, 10);
    setFormDate(todayStr);
    setFormTime('15:30 - 17:30 WIB');
    setFormLocation('Lapangan Basket SMAN 1 Cileunyi');
    setFormTargetAudience('Semua Anggota');
    setFormPic('Coach Hendra Kurniawan');
    setFormDescription('');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEditModal = (agenda: ClubAgenda) => {
    setEditingAgenda(agenda);
    setFormTitle(agenda.title);
    setFormCategory(agenda.category);
    setFormDate(agenda.date);
    setFormTime(agenda.time);
    setFormLocation(agenda.location);
    setFormTargetAudience(agenda.targetAudience);
    setFormPic(agenda.pic);
    setFormDescription(agenda.description || '');
    setFormIsActive(agenda.isActive);
    setIsModalOpen(true);
  };

  // Handle submit
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate.trim()) {
      alert('Judul agenda dan tanggal wajib diisi!');
      return;
    }

    if (editingAgenda) {
      onUpdateAgenda({
        ...editingAgenda,
        title: formTitle.trim(),
        category: formCategory,
        date: formDate.trim(),
        time: formTime.trim(),
        location: formLocation.trim(),
        targetAudience: formTargetAudience,
        pic: formPic.trim(),
        description: formDescription.trim(),
        isActive: formIsActive
      });
    } else {
      onAddAgenda({
        title: formTitle.trim(),
        category: formCategory,
        date: formDate.trim(),
        time: formTime.trim(),
        location: formLocation.trim(),
        targetAudience: formTargetAudience,
        pic: formPic.trim(),
        description: formDescription.trim(),
        isActive: formIsActive
      });
    }

    setIsModalOpen(false);
  };

  // Share agenda text to clipboard
  const handleShareAgenda = (agenda: ClubAgenda) => {
    const details = parseDateDetails(agenda.date);
    const text = `🏀 *AGENDA SACIL BASKETBALL*\n\n📌 *${agenda.title}*\n🏷 Kategori: ${agenda.category}\n👥 Peserta: ${agenda.targetAudience}\n📅 Tanggal: ${details.dayName}, ${details.day} ${details.monthFull} ${details.year}\n⏰ Waktu: ${agenda.time}\n📍 Lokasi: ${agenda.location}\n👤 PIC: ${agenda.pic}\n${agenda.description ? `\n📝 *Catatan*: ${agenda.description}\n` : ''}\nInfo Resmi: Ekskul Basket SMAN 1 Cileunyi`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setCopyToast(`Agenda "${agenda.title}" berhasil disalin ke clipboard!`);
      setTimeout(() => setCopyToast(null), 3500);
    }
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = (agenda: ClubAgenda) => {
    const cleanDate = agenda.date.replace(/-/g, '');
    const title = encodeURIComponent(`[SACIL Basket] ${agenda.title}`);
    const details = encodeURIComponent(
      `${agenda.description || ''}\n\nKategori: ${agenda.category}\nTarget: ${agenda.targetAudience}\nPIC: ${agenda.pic}`
    );
    const location = encodeURIComponent(agenda.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${cleanDate}/${cleanDate}&details=${details}&location=${location}`;
  };

  // Filter agendas
  const filteredAgendas = agendas
    .filter((agenda) => {
      // In public mode, only show active agendas
      if (userRole === 'publik' && !agenda.isActive) return false;

      // Filter by status if bendahara
      if (userRole === 'bendahara' && selectedStatus !== 'Semua') {
        if (selectedStatus === 'aktif' && !agenda.isActive) return false;
        if (selectedStatus === 'nonaktif' && agenda.isActive) return false;
      }

      // Filter by category
      if (selectedCategory !== 'Semua' && agenda.category !== selectedCategory) return false;

      // Filter by audience
      if (selectedAudience !== 'Semua' && agenda.targetAudience !== selectedAudience) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = agenda.title.toLowerCase().includes(q);
        const matchLocation = agenda.location.toLowerCase().includes(q);
        const matchPic = agenda.pic.toLowerCase().includes(q);
        const matchDesc = (agenda.description || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLocation && !matchPic && !matchDesc) return false;
      }

      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  // Category visual styles helper
  const getCategoryTheme = (cat: AgendaCategory) => {
    switch (cat) {
      case 'Latihan Rutin':
        return {
          icon: <Activity className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />,
          badge: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/80',
          accent: 'border-l-orange-500'
        };
      case 'Kompetisi / Turnamen':
        return {
          icon: <Trophy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
          badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/80',
          accent: 'border-l-purple-500'
        };
      case 'Diskusi / Briefing':
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
          badge: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
          accent: 'border-l-sky-500'
        };
      case 'Sparring / Uji Coba':
        return {
          icon: <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          badge: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
          accent: 'border-l-emerald-500'
        };
      case 'Acara Lain':
      default:
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
          badge: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
          accent: 'border-l-amber-500'
        };
    }
  };

  const categories: ('Semua' | AgendaCategory)[] = [
    'Semua',
    'Latihan Rutin',
    'Kompetisi / Turnamen',
    'Sparring / Uji Coba',
    'Diskusi / Briefing',
    'Acara Lain'
  ];

  return (
    <div id="next-agenda-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-top-3 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wider uppercase border border-white/25">
                Official Calendar
              </span>
              <span className="text-xs text-orange-100 font-medium">
                SMA Negeri 1 Cileunyi
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Next Agenda & Jadwal Kegiatan
            </h2>
            <p className="text-sm text-orange-100 mt-1 max-w-2xl leading-relaxed">
              Jadwal resmi latihan rutin, turnamen/kompetisi, sparring antar sekolah, dan briefing organisasi basket SACIL.
              {userRole === 'publik' ? (
                <span className="block mt-1 text-xs text-white/90 font-medium">
                  Mode Publik: Informasi jadwal terverifikasi yang telah diaktifkan oleh pengurus.
                </span>
              ) : (
                <span className="block mt-1 text-xs text-orange-200 font-medium">
                  Mode Bendahara: Anda memiliki hak penuh untuk menambah, menyunting, mengaktifkan, dan menonaktifkan agenda.
                </span>
              )}
            </p>
          </div>

          {userRole === 'bendahara' && (
            <button
              id="btn-add-agenda"
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-orange-600 hover:bg-orange-50 font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Agenda Baru</span>
            </button>
          )}
        </div>

        {/* Stats strip for Bendahara */}
        {userRole === 'bendahara' && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-5 pt-4 border-t border-white/20 text-center text-xs">
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <span className="block text-[10px] text-orange-200 uppercase font-semibold">Total Agenda</span>
              <span className="text-lg font-black">{agendas.length}</span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <span className="block text-[10px] text-orange-200 uppercase font-semibold">Aktif (Publik)</span>
              <span className="text-lg font-black text-emerald-300">
                {agendas.filter((a) => a.isActive).length}
              </span>
            </div>
            <div className="bg-black/15 backdrop-blur-xs rounded-xl p-2">
              <span className="block text-[10px] text-orange-200 uppercase font-semibold">Non-Aktif / Draft</span>
              <span className="text-lg font-black text-orange-200">
                {agendas.filter((a) => !a.isActive).length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Status, Audience row */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kegiatan, lokasi, catatan, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-hidden cursor-pointer"
            >
              <option value="Semua">Semua Target</option>
              <option value="Semua Anggota">Semua Anggota</option>
              <option value="Tim Putra">Tim Putra</option>
              <option value="Tim Putri">Tim Putri</option>
              <option value="Pengurus & Panitia">Pengurus & Panitia</option>
            </select>

            {userRole === 'bendahara' && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-hidden cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="aktif">Hanya Aktif</option>
                <option value="nonaktif">Hanya Non-Aktif</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Agendas Grid */}
      {filteredAgendas.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <CalendarIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
            Tidak ada agenda yang ditemukan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {searchQuery || selectedCategory !== 'Semua' || selectedAudience !== 'Semua'
              ? 'Silakan ubah kata kunci pencarian atau setel ulang filter kategori.'
              : 'Belum ada agenda kegiatan yang terdaftar saat ini.'}
          </p>
          {userRole === 'bendahara' && (
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Buat Agenda Sekarang</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAgendas.map((agenda) => {
            const details = parseDateDetails(agenda.date);
            const theme = getCategoryTheme(agenda.category);

            return (
              <div
                key={agenda.id}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-orange-300 dark:hover:border-orange-700/60 transition relative overflow-hidden ${
                  !agenda.isActive ? 'opacity-80 bg-slate-50/70 dark:bg-slate-900/60' : ''
                }`}
              >
                <div>
                  {/* Top Bar: Date pill & Category + Status */}
                  <div className="flex items-start justify-between gap-3">
                    {/* Date Block */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 text-orange-600 dark:text-orange-400 shadow-2xs">
                        <span className="text-[10px] font-black uppercase tracking-wider leading-none">
                          {details.dayName.slice(0, 3)}
                        </span>
                        <span className="text-xl font-black font-mono leading-tight">
                          {details.day}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-none">
                          {details.monthShort}
                        </span>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${theme.badge}`}>
                            {theme.icon}
                            <span>{agenda.category}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                            {agenda.targetAudience}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {details.dayName}, {details.day} {details.monthFull} {details.year}
                          </span>
                          {details.countdown && (
                            <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              details.countdown === 'Hari Ini!'
                                ? 'bg-rose-500 text-white animate-pulse'
                                : details.isPast
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}>
                              {details.countdown}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active / Inactive Badge */}
                    <div>
                      {agenda.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                          <XCircle className="w-3 h-3" />
                          <span>Non-Aktif</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3.5 leading-snug">
                    {agenda.title}
                  </h3>

                  {/* Time & Location & PIC details */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span className="font-semibold">{agenda.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{agenda.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>PIC: <strong className="text-slate-800 dark:text-slate-100">{agenda.pic}</strong></span>
                    </div>
                  </div>

                  {/* Notes / Description */}
                  {agenda.description && (
                    <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] mb-0.5">Catatan / Keterangan:</span>
                      {agenda.description}
                    </div>
                  )}
                </div>

                {/* Bottom Action Controls */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShareAgenda(agenda)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Salin Rincian Agenda"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={getGoogleCalendarUrl(agenda)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Tambahkan ke Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Bendahara Controls */}
                  {userRole === 'bendahara' ? (
                    <div className="flex items-center gap-1.5">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => onToggleActiveAgenda(agenda.id)}
                        className={`px-2.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                          agenda.isActive
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                        title={agenda.isActive ? 'Nonaktifkan Agenda' : 'Aktifkan Agenda'}
                      >
                        {agenda.isActive ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Nonaktifkan</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Aktifkan</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(agenda)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Agenda"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeletingAgendaId(agenda.id)}
                        className="p-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                      Jadwal Resmi SACIL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAgendaId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Hapus Agenda Ini?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Agenda yang dihapus tidak dapat dipulihkan. Apakah Anda yakin ingin melanjutkan?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingAgendaId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAgenda(deletingAgendaId);
                  setDeletingAgendaId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Agenda Modal */}
      {isModalOpen && (
        <div
          id="modal-agenda-form-backdrop"
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            id="modal-agenda-form-content"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingAgenda ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAgenda} className="p-6 space-y-4">
              {/* Judul Kegiatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Kegiatan / Agenda <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Latihan Rutin Tim Putra (Drill Defense)"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Kategori & Target Peserta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Agenda
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AgendaCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Latihan Rutin">Latihan Rutin</option>
                    <option value="Kompetisi / Turnamen">Kompetisi / Turnamen</option>
                    <option value="Sparring / Uji Coba">Sparring / Uji Coba</option>
                    <option value="Diskusi / Briefing">Diskusi / Briefing</option>
                    <option value="Acara Lain">Acara Lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Peserta
                  </label>
                  <select
                    value={formTargetAudience}
                    onChange={(e) => setFormTargetAudience(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Semua Anggota">Semua Anggota</option>
                    <option value="Tim Putra">Tim Putra</option>
                    <option value="Tim Putri">Tim Putri</option>
                    <option value="Pengurus & Panitia">Pengurus & Panitia</option>
                  </select>
                </div>
              </div>

              {/* Tanggal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam / Waktu Kegiatan
                  </label>
                  <input
                    type="text"
                    placeholder="15:30 - 17:30 WIB"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                  <div className="flex gap-1 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormTime('15:30 - 17:30 WIB')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 hover:text-orange-600 cursor-pointer"
                    >
                      Sore 15:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTime('07:30 - 10:00 WIB')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 hover:text-orange-600 cursor-pointer"
                    >
                      Pagi 07:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormTime('08:00 - 17:00 WIB')}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 hover:text-orange-600 cursor-pointer"
                    >
                      Seharian
                    </button>
                  </div>
                </div>
              </div>

              {/* Lokasi & PIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi / Tempat
                  </label>
                  <input
                    type="text"
                    placeholder="Lapangan Utama SMAN 1 Cileunyi"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Penanggung Jawab (PIC)
                  </label>
                  <input
                    type="text"
                    placeholder="Coach Hendra / Teh Teisya"
                    value={formPic}
                    onChange={(e) => setFormPic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Deskripsi & Catatan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan / Instruksi Tambahan (Opsional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Wajib membawa jersey latihan hitam, botol minum, serta sepatu cadangan..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Status Aktif Switch */}
              <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Aktifkan & Publikasikan Jadwal
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Jika aktif, agenda ini langsung dapat dilihat oleh publik dan siswa di halaman Next Agenda.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  {editingAgenda ? 'Simpan Perubahan' : 'Terbitkan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
