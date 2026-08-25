'use client';

import React, { useState } from 'react';
import {
  NewsItem,
  VillageStat,
  VillageOfficial,
  SiteSettings,
} from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import * as adminRepository from '../../lib/adminRepository';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  // State props
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  newsList: NewsItem[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  villageStats: VillageStat[];
  setVillageStats: React.Dispatch<React.SetStateAction<VillageStat[]>>;
  villageOfficials: VillageOfficial[];
  setVillageOfficials: React.Dispatch<React.SetStateAction<VillageOfficial[]>>;
  currentPasscode: string;
  setCurrentPasscode: (pass: string) => void;
  onResetData: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  siteSettings,
  setSiteSettings,
  newsList,
  setNewsList,
  villageStats,
  setVillageStats,
  villageOfficials,
  setVillageOfficials,
  currentPasscode,
  setCurrentPasscode,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'siteSettings' | 'news' | 'statsOfficials' | 'security'
  >('overview');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Site Settings Form State ---
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });

  // --- News Edit/Add State ---
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsCategoryFilter, setNewsCategoryFilter] = useState('Semua');

  // --- Village Official Edit/Add State ---
  const [editingOfficial, setEditingOfficial] = useState<VillageOfficial | null>(null);
  const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);

  // --- Security PIN Form State ---
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');

  if (!isOpen) return null;

  // Save Site Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiteSettings({ ...settingsForm });
    showToast('✅ Tampilan Landing Page & Kontak berhasil diperbarui!');
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminUpdateSiteSettings(settingsForm, currentPasscode);
      } catch (err) {
        showToast(
          `⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }
  };

  // News Handlers
  const handleOpenAddNews = () => {
    setEditingNews({
      id: `news-${Date.now()}`,
      title: '',
      category: 'Agenda Desa',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),

      snippet: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      imageAlt: 'Gambar Berita Desa',
      author: 'Admin Nagori',
      readTime: '3 min',
      isMain: false,
    });
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    setNewsList((prev) => {
      const exists = prev.some((n) => n.id === editingNews.id);
      let updated = exists
        ? prev.map((n) => (n.id === editingNews.id ? editingNews : n))
        : [editingNews, ...prev];

      // If set as main, unset others
      if (editingNews.isMain) {
        updated = updated.map((n) => ({
          ...n,
          isMain: n.id === editingNews.id,
        }));
      }
      return updated;
    });

    setIsNewsModalOpen(false);
    showToast('✅ Berita berhasil disimpan!');

    if (isSupabaseConfigured) {
      // Persist editingNews + null-out isMain on every other row (DB has a
      // partial unique index on news.is_main=true).
      try {
        await adminRepository.adminUpsertNews(editingNews, currentPasscode);
        if (editingNews.isMain) {
          const others = newsList.filter((n) => n.id !== editingNews.id);
          for (const other of others) {
            if (other.isMain) {
              await adminRepository.adminUpsertNews(
                { ...other, isMain: false },
                currentPasscode
              );
            }
          }
        }
      } catch (err) {
        showToast(
          `⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita untuk ini?')) {
      setNewsList((prev) => prev.filter((n) => n.id !== id));
      showToast('🗑️ Berita berhasil dihapus!');
      if (isSupabaseConfigured) {
        try {
          await adminRepository.adminDeleteNews(id, currentPasscode);
        } catch (err) {
          showToast(
            `⚠️ Gagal hapus di Supabase: ${err instanceof Error ? err.message : 'unknown'}`
          );
        }
      }
    }
  };

  const handleToggleMainNews = async (id: string) => {
    const previous = newsList;
    setNewsList((prev) =>
      prev.map((n) => ({
        ...n,
        isMain: n.id === id,
      }))
    );
    showToast('⭐ Berita utama landing page berhasil diubah!');
    if (isSupabaseConfigured) {
      try {
        // Flip main off for everyone, then set on the target.
        for (const n of previous) {
          const nextIsMain = n.id === id;
          if (n.isMain !== nextIsMain) {
            await adminRepository.adminUpsertNews(
              { ...n, isMain: nextIsMain },
              currentPasscode
            );
          }
        }
      } catch (err) {
        showToast(
          `⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }
  };

  // Village Officials Handlers
  const handleSaveOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial) return;

    setVillageOfficials((prev) => {
      const exists = prev.some((o) => o.name === editingOfficial.name && o.role === editingOfficial.role);
      return exists
        ? prev.map((o) => (o.name === editingOfficial.name ? editingOfficial : o))
        : [...prev, editingOfficial];
    });

    setIsOfficialModalOpen(false);
    showToast('✅ Data Perangkat Nagori disimpan!');
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminUpsertVillageOfficial(editingOfficial, currentPasscode);
      } catch (err) {
        showToast(
          `⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }
  };

  const handleDeleteOfficial = async (index: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus perangkat desa ini?')) {
      const target = villageOfficials[index];
      setVillageOfficials((prev) => prev.filter((_, i) => i !== index));
      showToast('🗑️ Perangkat desa dihapus!');
      if (isSupabaseConfigured && target) {
        // Village officials are keyed by name+role (no exposed id in the UI),
        // so we need to look up the DB id. We fetch once and match.
        try {
          const supabase = (await import('../../lib/supabase')).supabase;
          if (supabase) {
            const { data } = await supabase
              .from('village_officials')
              .select('id')
              .eq('name', target.name)
              .eq('role', target.role)
              .maybeSingle();
            const id = (data as { id?: string } | null)?.id;
            if (id) {
              await adminRepository.adminDeleteVillageOfficial(id, currentPasscode);
            }
          }
        } catch (err) {
          showToast(
            `⚠️ Gagal hapus di Supabase: ${err instanceof Error ? err.message : 'unknown'}`
          );
        }
      }
    }
  };

  // Sync inline-edited village stats to Supabase
  const handleSyncVillageStats = async () => {
    if (!isSupabaseConfigured) {
      showToast('⚠️ Mode offline — perubahan hanya tersimpan di perangkat ini');
      return;
    }
    try {
      await adminRepository.adminSyncVillageStats(villageStats, currentPasscode);
      showToast('✅ Statistik desa berhasil disimpan ke Supabase');
    } catch (err) {
      showToast(
        `⚠️ Gagal sinkron statistik: ${err instanceof Error ? err.message : 'unknown'}`
      );
    }
  };

  // Save Passcode
  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPass !== currentPasscode) {
      setPassError('Kata sandi lama tidak cocok!');
      return;
    }
    if (newPass.length < 4) {
      setPassError('Kata sandi baru minimal 4 karakter!');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    setCurrentPasscode(newPass);
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setPassError('');
    showToast('🔒 Kata sandi admin berhasil diperbarui!');

    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminUpdateSiteSettings(
          { ...siteSettings, adminPasscode: newPass } as unknown as SiteSettings,
          currentPasscode
        );
      } catch (err) {
        showToast(
          `⚠️ Gagal sinkron passcode ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`
        );
      }
    }
  };

  // Filtered news
  const filteredNews = newsList.filter((n) => {
    const matchCat = newsCategoryFilter === 'Semua' || n.category === newsCategoryFilter;
    const matchSearch = n.title.toLowerCase().includes(newsSearch.toLowerCase()) || n.snippet.toLowerCase().includes(newsSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeInUp">
      <div className="bg-[#FCFCFC] w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col relative">
        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="absolute top-4 right-16 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-fadeInUp">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin Header */}
        <div className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-base sm:text-lg font-semibold">
                  Panel Admin Landing Page
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Mode Aktif
                </span>
              </div>
              <p className="font-body text-[11px] text-gray-400">
                Kelola Tampilan Landing Page, Berita, Statistik, dan Perangkat Nagori
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 text-xs font-medium hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>Tinjau Landing Page</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Bar Tabs */}
        <div className="bg-[#F7F7F5] border-b border-[#EDEDE9] px-6 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-black text-black font-semibold bg-white/60'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            <span>Ringkasan</span>
          </button>

          <button
            onClick={() => {
              setSettingsForm({ ...siteSettings });
              setActiveTab('siteSettings');
            }}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'siteSettings'
                ? 'border-black text-black font-semibold bg-white/60'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-base">aspect_ratio</span>
            <span>Banner & Landing Page</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'news'
                ? 'border-black text-black font-semibold bg-white/60'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-base">newspaper</span>
            <span>Berita & Agenda ({newsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('statsOfficials')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'statsOfficials'
                ? 'border-black text-black font-semibold bg-white/60'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            <span>Statistik & Perangkat</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-black text-black font-semibold bg-white/60'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <span className="material-symbols-outlined text-base">key</span>
            <span>Keamanan Admin</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Banner Alert */}
              <div className="bg-[#1A1A1A] text-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <h3 className="font-headline text-lg font-semibold">Selamat Datang di Panel Pengelola Landing Page</h3>
                  <p className="font-body text-xs text-gray-300 mt-1">
                    Semua perubahan pada tampilan landing page dan berita akan langsung tersinkronisasi ke portal publik.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">desktop_windows</span>
                  <span>Lihat Tampilan Publik</span>
                </button>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Kabar Berita Aktif</span>
                    <span className="material-symbols-outlined text-emerald-600">newspaper</span>
                  </div>
                  <div className="font-headline text-3xl font-bold text-[#1A1A1A]">
                    {newsList.length}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    {newsList.filter((n) => n.isMain).length} Berita Utama Featured
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Perangkat Nagori</span>
                    <span className="material-symbols-outlined text-blue-600">groups</span>
                  </div>
                  <div className="font-headline text-3xl font-bold text-[#1A1A1A]">
                    {villageOfficials.length}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Aparatur aktif Nagori</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
                  <div className="flex items-center justify-between text-gray-500 mb-2">
                    <span className="text-xs font-medium uppercase tracking-wider">Indikator Statistik</span>
                    <span className="material-symbols-outlined text-purple-600">monitoring</span>
                  </div>
                  <div className="font-headline text-3xl font-bold text-[#1A1A1A]">
                    {villageStats.length}
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">Counter realtime landing page</span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs">
                <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-3">
                  Aksi Cepat Pengaturan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => {
                      setSettingsForm({ ...siteSettings });
                      setActiveTab('siteSettings');
                    }}
                    className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-xl text-black">edit_note</span>
                    <span className="font-semibold text-gray-800">Ubah Banner Hero</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('news');
                      handleOpenAddNews();
                    }}
                    className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-xl text-emerald-600">add_circle</span>
                    <span className="font-semibold text-gray-800">Tambah Berita Baru</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('statsOfficials')}
                    className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-xl text-blue-600">groups</span>
                    <span className="font-semibold text-gray-800">Kelola Perangkat</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-center"
                  >
                    <span className="material-symbols-outlined text-xl text-amber-600">key</span>
                    <span className="font-semibold text-gray-800">Ubah Kata Sandi</span>
                  </button>
                </div>
              </div>

              {/* Recent News Preview */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-headline text-sm font-semibold text-[#1A1A1A]">
                    Berita Terbaru
                  </h4>
                  <button
                    onClick={() => setActiveTab('news')}
                    className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Lihat Semua ({newsList.length})
                    <span className="material-symbols-outlined text-sm">east</span>
                  </button>
                </div>

                {newsList.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4 text-center">Belum ada berita terpublikasi.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {newsList.slice(0, 4).map((news) => (
                      <div key={news.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="font-semibold text-black">{news.title}</strong>
                          </div>
                          <p className="text-gray-500 mt-0.5">{news.category} • {news.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {news.isMain && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                              ⭐ Utama
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setEditingNews({ ...news });
                              setIsNewsModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 font-medium text-gray-700 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SITE SETTINGS */}
          {activeTab === 'siteSettings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                <div>
                  <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
                    Pengaturan Banner & Tampilan Landing Page
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ubah judul hero, slogan, background image, logo, serta banner CTA secara fleksibel.
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2 rounded-lg text-xs font-medium shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Simpan Perubahan</span>
                </button>
              </div>

              {/* Section 1: Hero Banner */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
                <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">
                  1. Konfigurasi Hero Banner Utama
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nama Nagori / Desa *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.villageName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, villageName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Estimasi Rata-Rata Waktu Pelayanan (Menit) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.avgServiceTime}
                      onChange={(e) => setSettingsForm({ ...settingsForm, avgServiceTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Judul Baris 1 Hero *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.heroTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Judul Baris 2 Highlight Hero *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.heroTitleHighlight}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleHighlight: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Sub-Judul / Deskripsi Hero *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    URL Gambar Background Hero Banner *
                  </label>
                  <input
                    type="url"
                    required
                    value={settingsForm.heroBgUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroBgUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {/* Hero Live Preview */}
                <div className="mt-3 p-4 rounded-xl relative overflow-hidden bg-black text-white h-36 flex flex-col justify-center items-center text-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url('${settingsForm.heroBgUrl}')` }}
                  ></div>
                  <div className="relative z-10">
                    <h5 className="font-headline text-lg font-bold">
                      {settingsForm.heroTitle} <span className="text-gray-300 font-light">{settingsForm.heroTitleHighlight}</span>
                    </h5>
                    <p className="text-[11px] text-gray-200 mt-1 max-w-md line-clamp-2">
                      {settingsForm.heroSubtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: CTA Banner & Contact Info */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
                <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">
                  2. Banner Call-To-Action (CTA) & Kontak Desa
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Judul Banner CTA *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.ctaTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      URL Background Banner CTA *
                    </label>
                    <input
                      type="url"
                      required
                      value={settingsForm.ctaBgUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, ctaBgUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Deskripsi Banner CTA *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={settingsForm.ctaSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nomor Telepon Admin / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.contactPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Resmi Nagori *
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsForm.contactEmail}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alamat Kantor Pangulu Nagori *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.contactAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Jam Operasional Kantor *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.operatingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#1A1A1A] hover:bg-black text-white px-6 py-2.5 rounded-lg font-headline text-xs font-medium shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Simpan Semua Pengaturan Landing Page</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: NEWS MANAGER */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-gray-200">
                <div>
                  <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
                    Kelola Berita, Pengumuman & Agenda Desa
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tambah, perbarui, atur berita utama featured, dan publikasikan kabar terkini untuk warga.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddNews}
                  className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-medium shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-[#EDEDE9]">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari judul berita..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#EDEDE9] text-xs focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {['Semua', 'Agenda Nagori', 'Agenda Desa', 'Publik', 'UMKM', 'Transparansi'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewsCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        newsCategoryFilter === cat
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-[#F7F7F5] border border-[#EDEDE9] text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNews.map((news) => (
                  <div
                    key={news.id}
                    className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-gray-100">
                        <img
                          src={news.imageUrl}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-gray-800">
                            {news.category}
                          </span>
                          {news.isMain && (
                            <span className="bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-semibold shadow-2xs">
                              ⭐ Utama Landing Page
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-400 mb-1">
                        {news.date} • {news.author}
                      </div>

                      <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-1 leading-snug line-clamp-2">
                        {news.title}
                      </h4>

                      <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {news.snippet}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleMainNews(news.id)}
                        className={`text-xs font-medium flex items-center gap-1 cursor-pointer ${
                          news.isMain ? 'text-amber-600' : 'text-gray-500 hover:text-amber-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">star</span>
                        <span>{news.isMain ? 'Berita Utama' : 'Jadikan Utama'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingNews({ ...news });
                            setIsNewsModalOpen(true);
                          }}
                          className="px-3 py-1 rounded bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 text-xs font-medium text-gray-700 cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteNews(news.id)}
                          className="px-3 py-1 rounded bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs font-medium cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STATS & OFFICIALS */}
          {activeTab === 'statsOfficials' && (
            <div className="space-y-6">
              <div className="border-b pb-3 border-gray-200">
                <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
                  Statistik Desa & Jajaran Perangkat Nagori
                </h3>
                <p className="text-xs text-gray-500">
                  Ubah indikator populasi, wilayah, serta susunan aparatur desa yang tampil di portal.
                </p>
              </div>

              {/* Village Stats Config */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
                <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">
                  1. Indikator Statistik Utama Realtime
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {villageStats.map((stat, idx) => (
                    <div key={idx} className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[#EDEDE9] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800">{stat.label}</span>
                        <span className="material-symbols-outlined text-base text-gray-600">{stat.icon}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-gray-500 font-medium">Nilai Angka</label>
                          <input
                            type="number"
                            value={stat.targetNumber}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setVillageStats((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, targetNumber: val } : s))
                              );
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
                              setVillageStats((prev) =>
                                prev.map((s, i) => (i === idx ? { ...s, unit: val } : s))
                              );
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
                            setVillageStats((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, description: val } : s))
                              );
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#EDEDE9] rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleSyncVillageStats}
                  className="w-full mt-2 px-3.5 py-2 rounded-lg bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">cloud_upload</span>
                  <span>Simpan Perubahan Statistik ke Supabase</span>
                </button>
              </div>

              {/* Village Officials Config */}
              <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    2. Perangkat Nagori & Kontak Telepon
                  </h4>
                  <button
                    onClick={() => {
                      setEditingOfficial({ name: '', role: '', icon: 'person', phone: '' });
                      setIsOfficialModalOpen(true);
                    }}
                    className="bg-[#1A1A1A] text-white px-3 py-1 rounded text-xs font-medium hover:bg-black cursor-pointer"
                  >
                    + Tambah Perangkat
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {villageOfficials.map((official, idx) => (
                    <div key={idx} className="p-3.5 bg-[#F7F7F5] rounded-xl border border-[#EDEDE9] text-center space-y-1 relative">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EDEDE9] flex items-center justify-center mx-auto text-gray-800 font-semibold">
                        <span className="material-symbols-outlined">{official.icon || 'person'}</span>
                      </div>
                      <h5 className="font-headline text-xs font-semibold text-black">{official.name}</h5>
                      <span className="text-[10px] text-gray-600 block">{official.role}</span>
                      <span className="text-[10px] text-gray-500 block font-mono">{official.phone}</span>

                      <div className="pt-2 flex justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingOfficial({ ...official });
                            setIsOfficialModalOpen(true);
                          }}
                          className="px-2 py-0.5 rounded bg-white border text-[10px] font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOfficial(idx)}
                          className="px-2 py-0.5 rounded bg-red-50 border border-red-100 text-[10px] font-medium text-red-600 hover:bg-red-100 cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-md space-y-6">
              <div className="border-b pb-3 border-gray-200">
                <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
                  Keamanan & Sandi Admin
                </h3>
                <p className="text-xs text-gray-500">
                  Ubah kata sandi login admin atau reset data ke standar bawaan.
                </p>
              </div>

              <form onSubmit={handleChangePasscode} className="bg-white p-5 rounded-xl border border-[#EDEDE9] space-y-4">
                <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">
                  Ubah Kata Sandi Admin
                </h4>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Kata Sandi Saat Ini *
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Kata Sandi Baru *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ulangi Kata Sandi Baru *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                {passError && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {passError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#1A1A1A] hover:bg-black text-white py-2 rounded-lg text-xs font-medium shadow-xs cursor-pointer"
                >
                  Simpan Kata Sandi Baru
                </button>
              </form>

              <div className="bg-red-50 border border-red-200 p-5 rounded-xl space-y-2">
                <h4 className="font-headline text-xs font-semibold text-red-800 uppercase tracking-wider">
                  Reset Data Ke Default
                </h4>
                <p className="text-xs text-red-700">
                  Mengembalikan semua data berita, statistik, dan konfigurasi landing page ke kondisi awal.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Apakah Anda benar-benar yakin ingin mengembalikan seluruh data ke kondisi default?')) {
                      onResetData();
                      showToast('🔄 Seluruh data portal berhasil direset ke default!');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Reset Seluruh Data Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDIT BERITA */}
      {isNewsModalOpen && editingNews && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFCFC] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-semibold">Form Editor Berita & Agenda</h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-white hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Kategori Berita *</label>
                  <select
                    value={editingNews.category}
                    onChange={(e) =>
                      setEditingNews({ ...editingNews, category: e.target.value as NewsItem['category'] })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  >
                    <option value="Agenda Nagori">Agenda Nagori</option>
                    <option value="Publik">Publik</option>
                    <option value="UMKM">UMKM</option>
                    <option value="Transparansi">Transparansi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={editingNews.author}
                    onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">URL Gambar Berita *</label>
                <input
                  type="url"
                  required
                  value={editingNews.imageUrl}
                  onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Ringkasan Snippet Singkat *</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.snippet}
                  onChange={(e) => setEditingNews({ ...editingNews, snippet: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Isi Berita Lengkap *</label>
                <textarea
                  rows={5}
                  required
                  value={editingNews.content}
                  onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isMainCheck"
                  checked={editingNews.isMain || false}
                  onChange={(e) => setEditingNews({ ...editingNews, isMain: e.target.checked })}
                  className="w-4 h-4 rounded text-black focus:ring-black"
                />
                <label htmlFor="isMainCheck" className="text-xs font-semibold text-gray-800 cursor-pointer">
                  Tampilkan Sebagai Berita Utama Featured di Landing Page
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-black font-medium"
                >
                  Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PERANGKAT NAGORI */}
      {isOfficialModalOpen && editingOfficial && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFCFC] w-full max-w-md rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col">
            <div className="bg-[#1A1A1A] text-white p-4 flex items-center justify-between">
              <h3 className="font-headline text-sm font-semibold">Editor Perangkat Desa</h3>
              <button onClick={() => setIsOfficialModalOpen(false)} className="text-white hover:text-gray-300">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOfficial} className="p-6 space-y-3.5 text-xs">
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
                <button
                  type="button"
                  onClick={() => setIsOfficialModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-black font-medium"
                >
                  Simpan Perangkat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};