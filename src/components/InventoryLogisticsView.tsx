import React, { useState } from 'react';
import {
  Package,
  Layers,
  Wrench,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Search,
  Printer,
  Calendar,
  DollarSign,
  Tag,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { InventoryItem, UserRole } from '../types';
import { formatRupiah, formatDateIndo } from '../utils/storage';
import { printHtmlElement } from '../utils/printHelper';
import { PrintExportModal } from './PrintExportModal';

interface InventoryLogisticsViewProps {
  items: InventoryItem[];
  userRole: UserRole;
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (id: string, updated: Partial<InventoryItem>) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryLogisticsView: React.FC<InventoryLogisticsViewProps> = ({
  items,
  userRole,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const [activeTab, setActiveTab] = useState<'semua' | 'peralatan' | 'perlengkapan'>('peralatan');
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState<'Semua' | 'Baik' | 'Cukup' | 'Perlu Perbaikan / Habis'>('Semua');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formType, setFormType] = useState<'peralatan' | 'perlengkapan'>('peralatan');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formUnit, setFormUnit] = useState('Buah');
  const [formCondition, setFormCondition] = useState<'Baik' | 'Cukup' | 'Perlu Perbaikan / Habis'>('Baik');
  const [formPurchaseDate, setFormPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [formUnitPrice, setFormUnitPrice] = useState('');
  const [formLocation, setFormLocation] = useState('Gudang Olahraga SMAN 1 Cileunyi');
  const [formNotes, setFormNotes] = useState('');
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeTab === 'peralatan' && item.type !== 'peralatan') return false;
    if (activeTab === 'perlengkapan' && item.type !== 'perlengkapan') return false;
    if (conditionFilter !== 'Semua' && item.condition !== conditionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Aggregates
  const peralatanItems = items.filter((i) => i.type === 'peralatan');
  const perlengkapanItems = items.filter((i) => i.type === 'perlengkapan');

  const totalPeralatanValuation = peralatanItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalPerlengkapanValuation = perlengkapanItems.reduce((acc, i) => acc + i.totalPrice, 0);
  const totalAssetValuation = totalPeralatanValuation + totalPerlengkapanValuation;

  const totalGoodCondition = items.filter((i) => i.condition === 'Baik').length;
  const goodPercentage = items.length ? Math.round((totalGoodCondition / items.length) * 100) : 100;

  const handleOpenAdd = (type: 'peralatan' | 'perlengkapan') => {
    setFormType(type);
    setFormName('');
    setFormCategory(type === 'peralatan' ? 'Sarana Latihan & Pertandingan' : 'Bahan & Logistik Medis/Latihan');
    setFormQuantity(1);
    setFormUnit(type === 'peralatan' ? 'Buah' : 'Pcs');
    setFormCondition('Baik');
    setFormPurchaseDate(new Date().toISOString().slice(0, 10));
    setFormUnitPrice('');
    setFormLocation('Gudang Olahraga SMAN 1 Cileunyi');
    setFormNotes('');
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormType(item.type);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormQuantity(item.quantity);
    setFormUnit(item.unit);
    setFormCondition(item.condition);
    setFormPurchaseDate(item.purchaseDate);
    setFormUnitPrice(String(item.unitPrice));
    setFormLocation(item.location || 'Gudang Olahraga SMAN 1 Cileunyi');
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(formUnitPrice.replace(/\D/g, ''), 10) || 0;
    const total = priceNum * formQuantity;

    if (!formName.trim()) {
      alert('Nama barang tidak boleh kosong');
      return;
    }

    if (editingItem) {
      onUpdateItem(editingItem.id, {
        type: formType,
        accountCode: formType === 'peralatan' ? 'UK4' : 'UK3',
        name: formName.trim(),
        category: formCategory.trim() || (formType === 'peralatan' ? 'Sarana Bola & Aset' : 'Logistik Latihan'),
        quantity: formQuantity,
        unit: formUnit,
        condition: formCondition,
        purchaseDate: formPurchaseDate,
        unitPrice: priceNum,
        totalPrice: total,
        location: formLocation.trim(),
        notes: formNotes.trim() || undefined
      });
    } else {
      onAddItem({
        type: formType,
        accountCode: formType === 'peralatan' ? 'UK4' : 'UK3',
        name: formName.trim(),
        category: formCategory.trim() || (formType === 'peralatan' ? 'Sarana Bola & Aset' : 'Logistik Latihan'),
        quantity: formQuantity,
        unit: formUnit,
        condition: formCondition,
        purchaseDate: formPurchaseDate,
        unitPrice: priceNum,
        totalPrice: total,
        location: formLocation.trim(),
        notes: formNotes.trim() || undefined
      });
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Metrics */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span>Inventaris Aset Sarpras & Logistik Ekskul</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar terpisah Peralatan (UK4 - Sarana Tetap) dan Perlengkapan (UK3 - Habis Pakai)
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-print-inventory"
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berita Acara</span>
            </button>

            {userRole === 'bendahara' && (
              <button
                id="btn-add-inventory-item"
                onClick={() => handleOpenAdd(activeTab === 'perlengkapan' ? 'perlengkapan' : 'peralatan')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Barang Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Peralatan (UK4) */}
          <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-orange-700 dark:text-orange-300">
                Peralatan (UK4)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 font-bold">
                Aset Tetap
              </span>
            </div>
            <p className="text-base sm:text-lg font-black font-mono text-orange-950 dark:text-orange-100 mt-1">
              {formatRupiah(totalPeralatanValuation)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {peralatanItems.length} Jenis Sarana ({peralatanItems.reduce((s, i) => s + i.quantity, 0)} unit)
            </p>
          </div>

          {/* Card 2: Perlengkapan (UK3) */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-300">
                Perlengkapan (UK3)
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 font-bold">
                Habis Pakai
              </span>
            </div>
            <p className="text-base sm:text-lg font-black font-mono text-blue-950 dark:text-blue-100 mt-1">
              {formatRupiah(totalPerlengkapanValuation)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {perlengkapanItems.length} Jenis Logistik ({perlengkapanItems.reduce((s, i) => s + i.quantity, 0)} unit)
            </p>
          </div>

          {/* Card 3: Total Nilai Investasi */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-300 block">
              Total Nilai Aset Fisik
            </span>
            <p className="text-base sm:text-lg font-black font-mono text-emerald-950 dark:text-emerald-100 mt-1">
              {formatRupiah(totalAssetValuation)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Akumulasi belanja sarpras organisasi
            </p>
          </div>

          {/* Card 4: Kelaikan Pakai */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-400 block">
              Kelaikan Kondisi
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {goodPercentage}%
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">Siap Latihan</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {totalGoodCondition} dari {items.length} barang kondisi prima
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Peralatan vs Perlengkapan) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              id="tab-inventory-peralatan"
              onClick={() => setActiveTab('peralatan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'peralatan'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>1. Daftar Peralatan (UK4)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-white">
                {peralatanItems.length}
              </span>
            </button>

            <button
              id="tab-inventory-perlengkapan"
              onClick={() => setActiveTab('perlengkapan')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'perlengkapan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. Daftar Perlengkapan (UK3)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-white">
                {perlengkapanItems.length}
              </span>
            </button>

            <button
              id="tab-inventory-semua"
              onClick={() => setActiveTab('semua')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'semua'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua ({items.length})
            </button>
          </div>

          {/* Search & Condition Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama barang / lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
            >
              <option value="Semua">Semua Kondisi</option>
              <option value="Baik">Kondisi Baik</option>
              <option value="Cukup">Kondisi Cukup</option>
              <option value="Perlu Perbaikan / Habis">Perlu Perbaikan / Habis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table Container (Printable Area) */}
      <div
        id="printable-inventory-list"
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 sm:p-5 print:p-0 print:border-none"
      >
        {/* Print Header */}
        <div className="hidden print:block border-b-2 border-slate-900 pb-3 mb-4 text-center">
          <h2 className="text-base font-black uppercase tracking-tight">
            BUKU REGISTER INVENTARIS SARANA & PRASARANA
          </h2>
          <p className="text-xs font-bold text-orange-600 uppercase">
            EKSTRAKURIKULER BOLA BASKET SACIL • SMAN 1 CILEUNYI
          </p>
          <p className="text-[10px] text-slate-500">
            Klasifikasi: {activeTab === 'peralatan' ? 'Peralatan Aset Tetap (UK4)' : activeTab === 'perlengkapan' ? 'Perlengkapan Habis Pakai (UK3)' : 'Seluruh Aset Organisasi'} • Dicetak pada {formatDateIndo(new Date().toISOString().slice(0, 10))}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 font-bold">
                <th className="py-3 px-3 w-10 text-center">NO</th>
                <th className="py-3 px-3">NAMA BARANG & SPESIFIKASI</th>
                <th className="py-3 px-3">KATEGORI & KODE</th>
                <th className="py-3 px-3 text-center">JUMLAH</th>
                <th className="py-3 px-3 text-center">KONDISI</th>
                <th className="py-3 px-3 text-right">HARGA SATUAN</th>
                <th className="py-3 px-3 text-right">TOTAL NILAI</th>
                <th className="py-3 px-3">LOKASI FISIK</th>
                {userRole === 'bendahara' && (
                  <th className="py-3 px-3 text-center print:hidden">AKSI</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'bendahara' ? 9 : 8} className="py-8 text-center text-slate-400">
                    Tidak ada barang inventaris yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="py-3 px-3 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Beli: {formatDateIndo(item.purchaseDate)}</span>
                        {item.notes && (
                          <>
                            <span>•</span>
                            <span className="italic">{item.notes}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.type === 'peralatan'
                            ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        <span>{item.accountCode} - {item.type === 'peralatan' ? 'Peralatan' : 'Perlengkapan'}</span>
                      </span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.category}</p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.condition === 'Baik'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : item.condition === 'Cukup'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {item.condition === 'Baik' ? (
                          <CheckCircle className="w-2.5 h-2.5" />
                        ) : (
                          <AlertTriangle className="w-2.5 h-2.5" />
                        )}
                        <span>{item.condition}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {formatRupiah(item.totalPrice)}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {item.location || 'Gudang Olahraga'}
                    </td>
                    {userRole === 'bendahara' && (
                      <td className="py-3 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-orange-600 transition"
                            title="Edit data barang"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete(item)}
                            className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Hapus barang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                <td colSpan={3} className="py-3 px-3 text-slate-800 dark:text-slate-200 uppercase text-[11px]">
                  Total Akumulasi Nilai Aset Terpilih
                </td>
                <td className="py-3 px-3 text-center font-mono">
                  {filteredItems.reduce((acc, i) => acc + i.quantity, 0)} unit
                </td>
                <td colSpan={2}></td>
                <td className="py-3 px-3 text-right font-mono text-orange-600 dark:text-orange-400 text-sm">
                  {formatRupiah(filteredItems.reduce((acc, i) => acc + i.totalPrice, 0))}
                </td>
                <td colSpan={userRole === 'bendahara' ? 2 : 1}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {editingItem ? 'Edit Data Inventaris' : 'Tambah Inventaris Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFormType('peralatan')}
                  className={`py-2 rounded-lg font-bold text-center transition cursor-pointer ${
                    formType === 'peralatan'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Peralatan (UK4 - Sarana Tetap)
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('perlengkapan')}
                  className={`py-2 rounded-lg font-bold text-center transition cursor-pointer ${
                    formType === 'perlengkapan'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Perlengkapan (UK3 - Habis Pakai)
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Barang & Merek/Spesifikasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bola Basket Molten GG7X Official Match"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Category & Quantity Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Pengelompokan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bola & Keranjang / Medis Latihan"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah & Satuan
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      required
                      value={formQuantity}
                      onChange={(e) => setFormQuantity(parseInt(e.target.value, 10) || 1)}
                      className="w-20 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Buah/Pcs/Set"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Price & Purchase Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 350.000"
                    value={formUnitPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormUnitPrice(val ? Number(val).toLocaleString('id-ID') : '');
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Beli / Masuk
                  </label>
                  <input
                    type="date"
                    required
                    value={formPurchaseDate}
                    onChange={(e) => setFormPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Condition & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kondisi Fisik
                  </label>
                  <select
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  >
                    <option value="Baik">Baik (Layak Pakai)</option>
                    <option value="Cukup">Cukup (Sedikit Aus)</option>
                    <option value="Perlu Perbaikan / Habis">Perlu Perbaikan / Habis</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Penyimpanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rak Besi Lapangan / Lemari UKS"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Diberi stempel marker SACIL nomor 01-05"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold shadow-md transition"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Item Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Trash2 className="w-5 h-5" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Hapus Data Barang
                </h4>
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Apakah Anda yakin ingin menghapus data barang <strong>{itemToDelete.name}</strong> ({itemToDelete.quantity} {itemToDelete.unit}) dari daftar inventaris?
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteItem(itemToDelete.id);
                    setItemToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md transition cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PrintExportModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        targetElementId="printable-inventory-list"
        documentTitle="Laporan & Berita Acara Inventaris Basket SACIL"
        defaultFilename="Berita-Acara-Inventaris-Basket-SACIL.pdf"
        documentSubtitle="Daftar Sarana (UK4 - Sarana Tetap) & Perlengkapan (UK3 - Habis Pakai) SMAN 1 Cileunyi"
      />
    </div>
  );
};
