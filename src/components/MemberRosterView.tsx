import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Send,
  Receipt,
  CheckCircle,
  AlertCircle,
  Phone,
  UserPlus,
  X,
  Check,
  ShieldAlert,
  Edit2,
  Trash2,
  Camera,
  Upload,
  Hash
} from 'lucide-react';
import { Member, ClubSettings, UserRole } from '../types';
import { formatRupiah, compressImageFile } from '../utils/storage';
import { EditMemberModal } from './EditMemberModal';
import { AvatarZoomModal } from './AvatarZoomModal';

interface MemberRosterViewProps {
  members: Member[];
  settings: ClubSettings;
  userRole: UserRole;
  onAddMember: (member: Omit<Member, 'id' | 'payments'>) => void;
  onUpdateMember?: (updatedMember: Member) => void;
  onDeleteMember?: (memberId: string) => void;
  onQuickPayMember: (member: Member) => void;
  onOpenReceipt: (member: Member) => void;
}

export const MemberRosterView: React.FC<MemberRosterViewProps> = ({
  members,
  settings,
  userRole,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onQuickPayMember,
  onOpenReceipt
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'Semua' | 'Kelas 10' | 'Kelas 11' | 'Kelas 12'>('Semua');
  const [selectedGender, setSelectedGender] = useState<'Semua' | 'Putra' | 'Putri'>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Editing state
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Lightbox / Popup Card Zoom state for Member
  const [zoomedMember, setZoomedMember] = useState<Member | null>(null);

  // Deleting confirmation state
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  // New member state
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState<'Kelas 10' | 'Kelas 11' | 'Kelas 12'>('Kelas 10');
  const [newSubClass, setNewSubClass] = useState('');
  const [newJersey, setNewJersey] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | undefined>(undefined);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState<boolean>(false);
  const [newPosition, setNewPosition] = useState<'Point Guard' | 'Shooting Guard' | 'Small Forward' | 'Power Forward' | 'Center'>('Point Guard');
  const [newGender, setNewGender] = useState<'Putra' | 'Putri'>('Putra');

  const filtered = members.filter((m) => {
    if (selectedGrade !== 'Semua' && m.grade !== selectedGrade) return false;
    if (selectedGender !== 'Semua') {
      const isPutri = m.gender === 'Putri' || m.gender === 'Wanita';
      if (selectedGender === 'Putri' && !isPutri) return false;
      if (selectedGender === 'Putra' && isPutri) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchClass = m.subClass.toLowerCase().includes(q) || m.grade.toLowerCase().includes(q);
      const matchPosition = m.position.toLowerCase().includes(q);
      const matchJersey = String(m.jerseyNumber).includes(q);
      const matchPhone = userRole === 'bendahara' && (m.phone || '').toLowerCase().includes(q);
      if (!matchName && !matchClass && !matchPosition && !matchJersey && !matchPhone) return false;
    }
    return true;
  });

  const handleSendReminderWA = (member: Member) => {
    const text = `Halo ${member.name} (${member.grade} - ${member.subClass}),
Salam olahraga! 🏀
Mengingatkan mengenai status uang kas Ekskul Basket SACIL SMAN 1 Cileunyi:

Status: ${member.minWeeks > 0 ? `Menunggak ${member.minWeeks} minggu (Total: ${formatRupiah(member.minWeeks * settings.weeklyDuesAmount)})` : 'Lunas / Bebas Tunggakan'}

Mohon konfirmasi pelunasan ke Bendahara Basket ya pada saat latihan berikutnya.
Terima kasih!
_Pengurus Ekskul Basket SACIL_`;

    const encoded = encodeURIComponent(text);
    let targetPhone = '';
    if (member.phone) {
      const digits = member.phone.replace(/\D/g, '');
      if (digits.startsWith('0')) {
        targetPhone = '62' + digits.slice(1);
      } else if (digits.startsWith('62')) {
        targetPhone = digits;
      } else if (digits.length > 0) {
        targetPhone = digits;
      }
    }

    const url = targetPhone ? `https://wa.me/${targetPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingAvatar(true);
      const compressed = await compressImageFile(file, 400, 0.8);
      setNewAvatarUrl(compressed);
    } catch (err) {
      console.error('Failed to compress avatar', err);
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const gradeBatch = newGrade === 'Kelas 10' ? 40 : (newGrade === 'Kelas 11' ? 39 : 38);
    const nextNo = members.filter(m => m.grade === newGrade).length + 1;

    onAddMember({
      studentId: `${gradeBatch}-${String(nextNo).padStart(3, '0')}`,
      no: nextNo,
      batch: gradeBatch,
      name: newName.trim(),
      grade: newGrade,
      subClass: newSubClass.trim() || newGrade.replace('Kelas ', ''),
      jerseyNumber: parseInt(newJersey, 10) || Math.floor(1 + Math.random() * 99),
      position: newPosition,
      gender: newGender,
      minWeeks: 0,
      plusWeeks: 0,
      totalPaidAmount: 0,
      phone: newPhone.trim() || undefined,
      avatarUrl: newAvatarUrl
    });

    setNewName('');
    setNewSubClass('');
    setNewJersey('');
    setNewPhone('');
    setNewAvatarUrl(undefined);
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (deletingMember && onDeleteMember) {
      onDeleteMember(deletingMember.id);
      setDeletingMember(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              <span>Roster Pemain & Anggota ({members.length} Siswa)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userRole === 'bendahara'
                ? 'Database atlet & siswa ekskul basket SMA Negeri 1 Cileunyi dengan profil nomor punggung, WhatsApp, & foto'
                : 'Daftar nama atlet, foto profil, kelas, gender, dan posisi tim bola basket SMA Negeri 1 Cileunyi'}
            </p>
          </div>

          {userRole === 'bendahara' && (
            <button
              id="btn-open-add-member"
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-xs font-bold text-white shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Tambah Anggota</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input-search-roster"
              placeholder={userRole === 'bendahara' ? "Cari nama, kelas, jersey, no WA..." : "Cari nama pemain, kelas, atau posisi..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          <select
            id="select-roster-grade"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            <option value="Semua">Semua Tingkat ({members.length} Siswa)</option>
            <option value="Kelas 10">Kelas 10 ({members.filter(m => m.grade === 'Kelas 10').length} Siswa)</option>
            <option value="Kelas 11">Kelas 11 ({members.filter(m => m.grade === 'Kelas 11').length} Siswa)</option>
            <option value="Kelas 12">Kelas 12 ({members.filter(m => m.grade === 'Kelas 12').length} Siswa)</option>
          </select>

          <select
            id="select-roster-gender"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
          >
            <option value="Semua">Semua Kategori (Putra & Putri)</option>
            <option value="Putra">Tim Putra</option>
            <option value="Putri">Tim Putri</option>
          </select>
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
            <Users className="w-8 h-8 mx-auto text-slate-300 mb-2 opacity-50" />
            <p className="font-semibold text-sm">Tidak ada data anggota yang sesuai filter.</p>
          </div>
        ) : (
          filtered.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-orange-300 dark:hover:border-orange-800 transition"
            >
              <div>
                {/* Top Profile Card Info: Foto/Avatar, Nama, Kelas, Gender */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Avatar Photo or Jersey Badge with Click to Zoom Popup Card */}
                    <button
                      type="button"
                      onClick={() => setZoomedMember(member)}
                      className="relative flex-shrink-0 cursor-pointer group text-left transition hover:scale-105"
                      title="Klik untuk membuka kartu profil atlet"
                    >
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-orange-500 shadow-xs ring-2 ring-orange-500/20 group-hover:ring-orange-500/60 transition"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black font-mono flex flex-col items-center justify-center text-sm shadow-xs border border-orange-400/40 group-hover:shadow-md transition">
                          <span className="text-[9px] font-sans opacity-75 leading-none">SACIL</span>
                          <span className="text-base leading-none">#{member.jerseyNumber}</span>
                        </div>
                      )}
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-md bg-slate-900 text-white font-mono font-bold text-[9px] border border-white dark:border-slate-800 shadow-2xs">
                        #{member.jerseyNumber}
                      </span>
                    </button>

                    <div className="min-w-0">
                      <h4
                        onClick={() => setZoomedMember(member)}
                        className="font-bold text-sm text-slate-900 dark:text-white truncate hover:text-orange-600 cursor-pointer transition"
                        title="Klik untuk melihat kartu profil atlet"
                      >
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {member.grade} • {member.subClass}
                      </p>
                      {userRole === 'bendahara' && member.phone && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      (member.gender === 'Putri' || member.gender === 'Wanita')
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    {member.gender}
                  </span>
                </div>

                {/* Position Row (And Kas Status ONLY in Bendahara mode) */}
                <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Posisi:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {member.position}
                    </span>
                  </div>

                  {userRole === 'bendahara' && (
                    member.minWeeks > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Nunggak {member.minWeeks} Mgg ({formatRupiah(member.minWeeks * settings.weeklyDuesAmount)})</span>
                      </span>
                    ) : member.plusWeeks > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Lebih {member.plusWeeks} Mgg</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Kas Lunas</span>
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons: ONLY rendered for Bendahara (Setor Kas, Edit, Hapus, WA Reminder, Kuitansi) */}
              {userRole === 'bendahara' && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => onQuickPayMember(member)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs transition active:scale-95 text-center cursor-pointer"
                  >
                    Setor Kas
                  </button>
                  {onUpdateMember && (
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-950/40 hover:text-orange-600 transition cursor-pointer"
                      title="Edit nomor punggung, kontak WA, foto, atau posisi"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDeleteMember && (
                    <button
                      onClick={() => setDeletingMember(member)}
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title="Hapus anggota dari roster"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleSendReminderWA(member)}
                    className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
                    title={`Kirim Pengingat Kas via WhatsApp ${member.phone ? `ke ${member.phone}` : ''}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenReceipt(member)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                    title="Cetak Kuitansi Digital"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Member Modal */}
      {editingMember && onUpdateMember && (
        <EditMemberModal
          member={editingMember}
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          onSave={(updated) => {
            onUpdateMember(updated);
            setEditingMember(null);
          }}
        />
      )}

      {/* Delete Member Confirmation Modal */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Hapus Anggota?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Konfirmasi tindakan bendahara
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-900 dark:text-white">{deletingMember.name}</strong> (Jersey #{deletingMember.jerseyNumber}, {deletingMember.grade}) dari roster ekskul basket? Data riwayat kas anggota ini juga akan disesuaikan.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                className="flex-1 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-delete-member"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-800 my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Tambah Anggota Basket Baru
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ekskul Basket SMAN 1 Cileunyi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="mt-4 space-y-3.5">
              {/* Avatar section in Add Form */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                {newAvatarUrl ? (
                  <img
                    src={newAvatarUrl}
                    alt="Foto Baru"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-xs flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-mono font-black flex items-center justify-center text-xs flex-shrink-0">
                    #{newJersey || '00'}
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Foto Avatar Anggota (Opsional)
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label
                      htmlFor="input-add-member-camera"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-semibold cursor-pointer transition"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Kamera</span>
                    </label>
                    <input
                      type="file"
                      id="input-add-member-camera"
                      accept="image/*"
                      capture="user"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />

                    <label
                      htmlFor="input-add-member-file"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer transition"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Galeri</span>
                    </label>
                    <input
                      type="file"
                      id="input-add-member-file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />

                    {newAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setNewAvatarUrl(undefined)}
                        className="text-[11px] text-rose-500 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Farhan Rizki"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Punggung (Jersey) *
                  </label>
                  <div className="relative">
                    <Hash className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 23"
                      value={newJersey}
                      onChange={(e) => setNewJersey(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                    <input
                      type="tel"
                      placeholder="08123456789"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat / Kelas *
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Kelas 10">Kelas 10</option>
                    <option value="Kelas 11">Kelas 11</option>
                    <option value="Kelas 12">Kelas 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rombel / Kelas Khusus
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 10-A atau 11 F1-A"
                    value={newSubClass}
                    onChange={(e) => setNewSubClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Posisi Bermain
                  </label>
                  <select
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Point Guard">Point Guard (PG)</option>
                    <option value="Shooting Guard">Shooting Guard (SG)</option>
                    <option value="Small Forward">Small Forward (SF)</option>
                    <option value="Power Forward">Power Forward (PF)</option>
                    <option value="Center">Center (C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Tim
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Putra">Putra</option>
                    <option value="Putri">Putri</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAvatar}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50"
                >
                  {isProcessingAvatar ? 'Memproses Foto...' : 'Simpan Anggota'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Popup Card Zoom Foto Atlet */}
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
