// app/admin/stats/page.tsx

'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { VillageOfficial } from '../../../src/types';

export default function AdminStatsPage() {
  const { villageStats, setVillageStats, villageOfficials, syncVillageStats, saveOfficial, deleteOfficial } = useAdmin();
  const [editingOfficial, setEditingOfficial] = useState<VillageOfficial | null>(null);
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
  const [isSavingOfficial, setIsSavingOfficial] = useState(false);
  const [isSyncingStats, setIsSyncingStats] = useState(false);

  const handleOpenAddOfficial = () => {
    setEditingOfficial({ name: '', role: '', icon: 'person', phone: '' });
    setIsOfficialModalOpen(true);
  };

  const handleEditOfficial = (official: VillageOfficial) => {
    setEditingOfficial({ ...official });
    setIsOfficialModalOpen(true);
  };

  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial) return;
    setIsSavingOfficial(true);
    try {
      await saveOfficial(editingOfficial);
      setIsOfficialModalOpen(false);
    } catch {
      // Error toast already shown by AdminContext; keep modal open.
    } finally {
      setIsSavingOfficial(false);
    }
  };

  const handleAddStat = () => {
    setVillageStats((prev) => [...prev, { label: '', targetNumber: 0, unit: '', description: '', icon: 'analytics' }]);
  };

  const handleRemoveStat = (idx: number) => {
    setVillageStats((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSyncStats = () => {
    setIsSyncingStats(true);
    syncVillageStats()
      .catch(() => undefined)
      .finally(() => setIsSyncingStats(false));
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-3 border-gray-200">
        <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">Statistik Desa & Jajaran Perangkat Nagori</h3>
        <p className="text-xs text-gray-500">Ubah indikator populasi, wilayah, serta susunan aparatur desa yang tampil di portal.</p>
      </div>

      {/* Stats Config */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">1. Indikator Statistik Utama Realtime</h4>
          <button onClick={handleAddStat} className="bg-[#1A1A1A] text-white px-3 py-1 rounded text-xs font-medium hover:bg-black">+ Tambah Indikator</button>
        </div>
        {villageStats.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">Belum ada indikator statistik. Klik "+ Tambah Indikator" lalu simpan ke Supabase.</p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {villageStats.map((stat, idx) => (
            <div key={stat.id || `new-${idx}`} className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[#EDEDE9] space-y-2">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  placeholder="Nama indikator…"
                  value={stat.label}
                  onChange={(e) => setVillageStats((prev) => prev.map((s, i) => i === idx ? { ...s, label: e.target.value } : s))}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded text-xs font-bold text-gray-800 focus:outline-none"
                />
                <button onClick={() => handleRemoveStat(idx)} title="Hapus indikator" className="text-red-500 hover:text-red-700">
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-gray-500 font-medium">Nilai Angka</label>
                  <input 
                    type="number" 
                    value={stat.targetNumber} 
                    onChange={(e) => { 
                      const val = Number(e.target.value); 
                      setVillageStats((prev) => prev.map((s, i) => i === idx ? { ...s, targetNumber: val } : s)); 
                    }} 
                    className="w-full px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded text-xs focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 font-medium">Satuan (Unit)</label>
                  <input 
                    type="text" 
                    value={stat.unit} 
                    onChange={(e) => { 
                      const val = e.target.value; 
                      setVillageStats((prev) => prev.map((s, i) => i === idx ? { ...s, unit: val } : s)); 
                    }} 
                    className="w-full px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded text-xs focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-medium">Deskripsi Keterangan</label>
                <input 
                  type="text" 
                  value={stat.description} 
                  onChange={(e) => { 
                    const val = e.target.value; 
                    setVillageStats((prev) => prev.map((s, i) => i === idx ? { ...s, description: val } : s)); 
                  }} 
                  className="w-full px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded text-xs focus:outline-none" 
                />
              </div>
            </div>
          ))}
        </div>
        )}
        <button 
          type="button" 
          onClick={handleSyncStats} 
          disabled={isSyncingStats}
          className="w-full mt-2 px-3.5 py-2 rounded-lg bg-[#1A1A1A] hover:bg-black disabled:opacity-60 text-white text-xs font-medium flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">{isSyncingStats ? 'progress_activity' : 'cloud_upload'}</span>
          <span>{isSyncingStats ? 'Menyimpan ke Supabase…' : 'Simpan Perubahan Statistik ke Supabase'}</span>
        </button>
      </div>

      {/* Officials Config */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">2. Perangkat Nagori & Kontak Telepon</h4>
          <button onClick={handleOpenAddOfficial} className="bg-[#1A1A1A] text-white px-3 py-1 rounded text-xs font-medium hover:bg-black">+ Tambah Perangkat</button>
        </div>
        {villageOfficials.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">Belum ada perangkat desa terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {villageOfficials.map((official) => (
              <div key={official.id || official.name} className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[#EDEDE9] text-center space-y-1 relative">
                <div className="w-10 h-10 rounded-full bg-white border border-[#EDEDE9] flex items-center justify-center mx-auto text-gray-800 font-semibold">
                  <span className="material-symbols-outlined">{official.icon || 'person'}</span>
                </div>
                <h5 className="font-headline text-xs font-semibold text-black">{official.name}</h5>
                <span className="text-[10px] text-gray-600 block">{official.role}</span>
                <span className="text-[10px] text-gray-500 block font-mono">{official.phone}</span>
                <div className="pt-2 flex justify-center gap-1.5">
                  <button onClick={() => handleEditOfficial(official)} className="px-2 py-0.5 rounded bg-white border text-[10px] font-medium text-gray-700 hover:bg-gray-100">Edit</button>
                  <button onClick={() => { void deleteOfficial(official.id!).catch(() => undefined); }} className="px-2 py-0.5 rounded bg-red-50 border border-red-100 text-[10px] font-medium text-red-600 hover:bg-red-100">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Official */}
      {isOfficialModalOpen && editingOfficial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFCFC] w-full max-w-md rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col">
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-semibold">Editor Perangkat Desa</h3>
              <button onClick={() => setIsOfficialModalOpen(false)} className="text-white hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleOfficialSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Jabatan / Role *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Pangulu Nagori" 
                  value={editingOfficial.role} 
                  onChange={(e) => setEditingOfficial({ ...editingOfficial, role: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Nama Lengkap & Gelar *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Drs. H. Ahmad Purba" 
                  value={editingOfficial.name} 
                  onChange={(e) => setEditingOfficial({ ...editingOfficial, name: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Nomor HP / Kontak *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="0812-xxxx-xxxx" 
                  value={editingOfficial.phone} 
                  onChange={(e) => setEditingOfficial({ ...editingOfficial, phone: e.target.value })} 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white" 
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsOfficialModalOpen(false)} disabled={isSavingOfficial} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-60">Batal</button>
                <button type="submit" disabled={isSavingOfficial} className="px-5 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-black font-medium disabled:opacity-60 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">{isSavingOfficial ? 'progress_activity' : 'save'}</span>
                  <span>{isSavingOfficial ? 'Menyimpan ke Supabase…' : 'Simpan Perangkat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}