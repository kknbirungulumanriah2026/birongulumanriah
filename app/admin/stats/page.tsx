// app/admin/stats/page.tsx

'use client';

import React, { useState } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { VillageOfficial } from '../../../src/types';
import { AdminPageHeader } from '../../../src/components/admin/AdminPageHeader';

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 transition';

const labelClass = 'block font-body text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1';

export default function AdminStatsPage() {
  const {
    villageStats,
    setVillageStats,
    villageOfficials,
    syncVillageStats,
    saveOfficial,
    deleteOfficial,
  } = useAdmin();
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
    setVillageStats((prev) => [
      ...prev,
      { label: '', targetNumber: 0, unit: '', description: '', icon: 'analytics' },
    ]);
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
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Modul 04 • Data Nagori"
        title="Statistik & Perangkat"
        description="Atur indikator populasi, wilayah, dan susunan aparatur desa yang tampil di portal publik."
        icon="groups"
      />

      {/* Stats Config */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <header className="px-5 sm:px-7 py-5 border-b border-[#EDEDE9] flex items-center justify-between gap-4 bg-gradient-to-br from-[#FAFAF7] to-white">
          <div className="flex items-start gap-4">
            <span className="font-headline text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
              01
            </span>
            <div>
              <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
                Indikator Statistik Realtime
              </h3>
              <p className="font-body text-xs text-gray-500 mt-0.5">
                Counter yang muncul di section &quot;Capaian &amp; Statistik&quot;
                pada landing page.
              </p>
            </div>
          </div>
          <button
            onClick={handleAddStat}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-headline font-medium transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span className="hidden sm:inline">Tambah Indikator</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </header>

        <div className="p-5 sm:p-7">
          {villageStats.length === 0 ? (
            <div className="py-10 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block mx-auto">
                monitoring
              </span>
              <p className="font-headline text-sm font-semibold text-[#1A1A1A]">
                Belum ada indikator statistik
              </p>
              <p className="font-body text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Klik tombol &quot;Tambah Indikator&quot; untuk membuat data
                statistik pertama, lalu simpan ke Supabase.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {villageStats.map((stat, idx) => (
                <div
                  key={stat.id || `new-${idx}`}
                  className="relative p-4 sm:p-5 bg-[#FAFAF7] rounded-xl border border-[#EDEDE9] space-y-3 hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="material-symbols-outlined text-base text-emerald-600">
                        {stat.icon || 'analytics'}
                      </span>
                      <input
                        type="text"
                        placeholder="Nama indikator…"
                        value={stat.label}
                        onChange={(e) =>
                          setVillageStats((prev) =>
                            prev.map((s, i) =>
                              i === idx ? { ...s, label: e.target.value } : s
                            )
                          )
                        }
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded-lg text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 transition"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveStat(idx)}
                      title="Hapus indikator"
                      className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Nilai Angka</label>
                      <input
                        type="number"
                        value={stat.targetNumber}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setVillageStats((prev) =>
                            prev.map((s, i) =>
                              i === idx ? { ...s, targetNumber: val } : s
                            )
                          );
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Satuan</label>
                      <input
                        type="text"
                        value={stat.unit}
                        onChange={(e) => {
                          const val = e.target.value;
                          setVillageStats((prev) =>
                            prev.map((s, i) =>
                              i === idx ? { ...s, unit: val } : s
                            )
                          );
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Deskripsi</label>
                    <input
                      type="text"
                      value={stat.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setVillageStats((prev) =>
                          prev.map((s, i) =>
                            i === idx ? { ...s, description: val } : s
                          )
                        );
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleSyncStats}
            disabled={isSyncingStats || villageStats.length === 0}
            className="w-full mt-5 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-headline font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-base">
              {isSyncingStats ? 'progress_activity' : 'cloud_upload'}
            </span>
            <span>
              {isSyncingStats ? 'Menyimpan ke Supabase…' : 'Simpan Perubahan Statistik'}
            </span>
          </button>
        </div>
      </section>

      {/* Officials Config */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <header className="px-5 sm:px-7 py-5 border-b border-[#EDEDE9] flex items-center justify-between gap-4 bg-gradient-to-br from-[#FAFAF7] to-white">
          <div className="flex items-start gap-4">
            <span className="font-headline text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
              02
            </span>
            <div>
              <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
                Perangkat Nagori &amp; Kontak
              </h3>
              <p className="font-body text-xs text-gray-500 mt-0.5">
                Aparatur desa yang ditampilkan di halaman Profil publik.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAddOfficial}
            className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-headline font-medium transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span className="hidden sm:inline">Tambah Perangkat</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </header>

        <div className="p-5 sm:p-7">
          {villageOfficials.length === 0 ? (
            <div className="py-10 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2 block mx-auto">
                groups
              </span>
              <p className="font-headline text-sm font-semibold text-[#1A1A1A]">
                Belum ada perangkat desa terdaftar
              </p>
              <p className="font-body text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Klik tombol &quot;Tambah Perangkat&quot; untuk mulai mengelola
                aparatur Nagori.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {villageOfficials.map((official) => (
                <div
                  key={official.id || official.name}
                  className="group relative p-4 bg-[#FAFAF7] hover:bg-white rounded-xl border border-[#EDEDE9] hover:border-emerald-200 hover:shadow-sm text-center transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-[#EDEDE9] group-hover:bg-emerald-50 group-hover:border-emerald-200 flex items-center justify-center mx-auto text-gray-700 group-hover:text-emerald-600 transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {official.icon || 'person'}
                    </span>
                  </div>
                  <h5 className="font-headline text-xs font-semibold text-[#1A1A1A] mt-2.5 line-clamp-1">
                    {official.name}
                  </h5>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-gray-700 bg-white border border-[#EDEDE9] px-2 py-0.5 rounded-md">
                    {official.role}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1.5 font-mono">
                    {official.phone}
                  </p>
                  <div className="pt-2.5 mt-2 border-t border-[#EDEDE9] flex justify-center gap-1.5">
                    <button
                      onClick={() => handleEditOfficial(official)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#EDEDE9] hover:border-[#1A1A1A]/30 text-[10px] font-medium text-gray-700 hover:text-black transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        void deleteOfficial(official.id!).catch(() => undefined);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-[10px] font-medium text-red-600 hover:bg-red-100 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal Official */}
      {isOfficialModalOpen && editingOfficial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-fadeInUp">
          <div className="bg-[#FCFCFC] w-full max-w-md rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col">
            <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-emerald-300 text-xl">
                    badge
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    Editor Aparatur
                  </p>
                  <h3 className="font-headline text-sm font-semibold truncate">
                    Perangkat Desa
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOfficialModalOpen(false)}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Tutup"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form
              onSubmit={handleOfficialSubmit}
              className="p-5 sm:p-6 space-y-4 text-sm"
            >
              <div>
                <label className={labelClass.replace('text-[10px]', 'text-xs')}>
                  Jabatan / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pangulu Nagori"
                  value={editingOfficial.role}
                  onChange={(e) =>
                    setEditingOfficial({ ...editingOfficial, role: e.target.value })
                  }
                  className={inputClass.replace('text-xs', 'text-sm')}
                />
              </div>
              <div>
                <label className={labelClass.replace('text-[10px]', 'text-xs')}>
                  Nama Lengkap &amp; Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Drs. H. Ahmad Purba"
                  value={editingOfficial.name}
                  onChange={(e) =>
                    setEditingOfficial({ ...editingOfficial, name: e.target.value })
                  }
                  className={inputClass.replace('text-xs', 'text-sm')}
                />
              </div>
              <div>
                <label className={labelClass.replace('text-[10px]', 'text-xs')}>
                  Nomor HP / Kontak *
                </label>
                <input
                  type="text"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={editingOfficial.phone}
                  onChange={(e) =>
                    setEditingOfficial({ ...editingOfficial, phone: e.target.value })
                  }
                  className={inputClass.replace('text-xs', 'text-sm')}
                />
              </div>
              <div className="pt-4 border-t border-[#EDEDE9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOfficialModalOpen(false)}
                  disabled={isSavingOfficial}
                  className="px-4 py-2.5 rounded-xl border border-[#EDEDE9] bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingOfficial}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl hover:bg-black text-xs font-headline font-medium disabled:opacity-60 flex items-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-base">
                    {isSavingOfficial ? 'progress_activity' : 'cloud_upload'}
                  </span>
                  <span>{isSavingOfficial ? 'Menyimpan…' : 'Simpan Perangkat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}