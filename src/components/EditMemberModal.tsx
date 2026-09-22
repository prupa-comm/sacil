import React, { useState } from 'react';
import { X, Camera, Check, User, Upload, Trash2, Phone, Hash, ShieldCheck } from 'lucide-react';
import { Member } from '../types';
import { compressImageFile } from '../utils/storage';

interface EditMemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: Member) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  member,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !member) return null;

  const [name, setName] = useState(member.name);
  const [grade, setGrade] = useState<'Kelas 10' | 'Kelas 11' | 'Kelas 12'>(member.grade);
  const [subClass, setSubClass] = useState(member.subClass);
  const [jerseyNumber, setJerseyNumber] = useState(String(member.jerseyNumber));
  const [position, setPosition] = useState(member.position);
  const [gender, setGender] = useState(member.gender);
  const [phone, setPhone] = useState(member.phone || '');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(member.avatarUrl);
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingImg(true);
      // Compress avatar to compact 400px width with 0.8 quality
      const compressed = await compressImageFile(file, 400, 0.8);
      setAvatarUrl(compressed);
    } catch (err) {
      console.error('Failed to compress avatar', err);
    } finally {
      setIsProcessingImg(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama anggota tidak boleh kosong');
      return;
    }

    const jNum = parseInt(jerseyNumber.replace(/\D/g, ''), 10);
    const validJersey = isNaN(jNum) ? member.jerseyNumber : jNum;

    const updated: Member = {
      ...member,
      name: name.trim(),
      grade,
      subClass: subClass.trim() || grade.replace('Kelas ', ''),
      jerseyNumber: validJersey,
      position,
      gender,
      phone: phone.trim() || undefined,
      avatarUrl: avatarUrl || undefined
    };

    onSave(updated);
    onClose();
  };

  return (
    <div
      id="modal-edit-member-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="card-edit-member"
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit Profil Anggota Basket
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {member.studentId} • #{member.jerseyNumber} {member.name}
              </p>
            </div>
          </div>
          <button
            id="btn-close-edit-member"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Avatar / Photo Upload & Preview Section */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black font-mono flex flex-col items-center justify-center text-xl shadow-md border-2 border-orange-400">
                  <span className="text-xs font-sans opacity-80">SACIL</span>
                  <span>#{jerseyNumber || '00'}</span>
                </div>
              )}

              {isProcessingImg && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-[10px] font-bold">
                  Memproses...
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Foto Profil / Avatar Anggota
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Gunakan kamera langsung atau pilih foto dari galeri HP/tablet.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <label
                  htmlFor="input-member-avatar-camera"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Ambil Foto</span>
                </label>
                <input
                  type="file"
                  id="input-member-avatar-camera"
                  accept="image/*"
                  capture="user"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="input-member-avatar-file"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Galeri File</span>
                </label>
                <input
                  type="file"
                  id="input-member-avatar-file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(undefined)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Member Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Siswa *
            </label>
            <input
              type="text"
              id="input-edit-member-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            />
          </div>

          {/* Jersey & WhatsApp Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor Punggung Jersey *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  id="input-edit-member-jersey"
                  required
                  placeholder="Contoh: 23"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / HP
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="tel"
                  id="input-edit-member-phone"
                  placeholder="Contoh: 08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Grade & SubClass */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tingkat Kelas
              </label>
              <select
                id="select-edit-member-grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="Kelas 10">Kelas 10 (Angkatan 40)</option>
                <option value="Kelas 11">Kelas 11 (Angkatan 39)</option>
                <option value="Kelas 12">Kelas 12 (Angkatan 38)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Rombel / Sub-Kelas
              </label>
              <input
                type="text"
                id="input-edit-member-subclass"
                placeholder="Contoh: 11 F1-A, 10-E"
                value={subClass}
                onChange={(e) => setSubClass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Position & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Posisi Bermain
              </label>
              <select
                id="select-edit-member-position"
                value={position}
                onChange={(e) => setPosition(e.target.value as any)}
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
                id="select-edit-member-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              >
                <option value="Putra">Tim Putra</option>
                <option value="Putri">Tim Putri</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-edit-member"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
