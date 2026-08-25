// src/context/AdminContext.tsx

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { NewsItem, VillageStat, VillageOfficial, SiteSettings } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';
import * as adminRepository from '../lib/adminRepository';
import { DEFAULT_SITE_SETTINGS } from '../data/portalData';

interface AdminContextType {
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  newsList: NewsItem[];
  setNewsList: React.Dispatch<React.SetStateAction<NewsItem[]>>;
  villageStats: VillageStat[];
  setVillageStats: React.Dispatch<React.SetStateAction<VillageStat[]>>;
  villageOfficials: VillageOfficial[];
  setVillageOfficials: React.Dispatch<React.SetStateAction<VillageOfficial[]>>;
  saveSettings: (settings: SiteSettings) => Promise<void>;
  saveNews: (news: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  toggleMainNews: (id: string) => Promise<void>;
  saveOfficial: (official: VillageOfficial) => Promise<void>;
  deleteOfficial: (id: string) => Promise<void>;
  syncVillageStats: () => Promise<void>;
  resetData: () => void;
  showToast: (msg: string) => void;
  toastMessage: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};

// Data default — konten sesungguhnya hidup di Supabase.
const defaultSiteSettings: SiteSettings = DEFAULT_SITE_SETTINGS;
const defaultVillageStats: VillageStat[] = [];
const defaultOfficials: VillageOfficial[] = [];

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [villageStats, setVillageStats] = useState<VillageStat[]>(defaultVillageStats);
  const [villageOfficials, setVillageOfficials] = useState<VillageOfficial[]>(defaultOfficials);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load data dari Supabase
  useEffect(() => {
    if (isSupabaseConfigured) {
      const fetchData = async () => {
        try {
          const settings = await adminRepository.adminGetSiteSettings();
          if (settings) {
            setSiteSettings(settings);
          }
          
          const news = await adminRepository.adminGetNews();
          if (news) setNewsList(news);
          
          const stats = await adminRepository.adminGetVillageStats();
          if (stats && stats.length > 0) setVillageStats(stats);
          
          const officials = await adminRepository.adminGetVillageOfficials();
          if (officials && officials.length > 0) setVillageOfficials(officials);
        } catch (err) {
          console.error('Error loading admin data:', err);
          showToast('⚠️ Gagal memuat data dari database');
        }
      };
      fetchData();
    }
  }, []);

  // Save Settings
  const saveSettings = async (settings: SiteSettings) => {
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminUpdateSiteSettings(settings);
        setSiteSettings(settings);
        showToast('✅ Tampilan Landing Page & Kontak berhasil diperbarui!');
      } catch (err) {
        showToast(`⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    setSiteSettings(settings);
    showToast('⚠️ Mode offline — perubahan tidak tersinkron ke Supabase');
  };

  // Save News
  const saveNews = async (news: NewsItem) => {
    if (isSupabaseConfigured) {
      try {
        if (news.isMain) {
          for (const other of newsList) {
            if (other.id !== news.id && other.isMain) {
              await adminRepository.adminUpsertNews({ ...other, isMain: false });
            }
          }
        }
        await adminRepository.adminUpsertNews(news);
        setNewsList((prev) => {
          const exists = prev.some((n) => n.id === news.id);
          let updated = exists ? prev.map((n) => (n.id === news.id ? news : n)) : [news, ...prev];
          if (news.isMain) updated = updated.map((n) => ({ ...n, isMain: n.id === news.id }));
          return updated;
        });
        showToast('✅ Berita berhasil disimpan!');
      } catch (err) {
        showToast(`⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    setNewsList((prev) => {
      const exists = prev.some((n) => n.id === news.id);
      let updated = exists ? prev.map((n) => (n.id === news.id ? news : n)) : [news, ...prev];
      if (news.isMain) updated = updated.map((n) => ({ ...n, isMain: n.id === news.id }));
      return updated;
    });
    showToast('⚠️ Mode offline — berita tidak tersinkron ke Supabase');
  };

  // Delete News
  const deleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminDeleteNews(id);
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        showToast('🗑️ Berita berhasil dihapus!');
      } catch (err) {
        showToast(`⚠️ Gagal hapus di Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    setNewsList((prev) => prev.filter((n) => n.id !== id));
    showToast('🗑️ Berita dihapus (mode offline)');
  };

  // Toggle Main News
  const toggleMainNews = async (id: string) => {
    const target = newsList.find((n) => n.id === id);
    if (!target || target.isMain) return;
    if (isSupabaseConfigured) {
      try {
        for (const n of newsList) {
          if (n.isMain && n.id !== id) {
            await adminRepository.adminUpsertNews({ ...n, isMain: false });
          }
        }
        await adminRepository.adminUpsertNews({ ...target, isMain: true });
        setNewsList((prev) => prev.map((n) => ({ ...n, isMain: n.id === id })));
        showToast('⭐ Berita utama landing page berhasil diubah!');
      } catch (err) {
        showToast(`⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    setNewsList((prev) => prev.map((n) => ({ ...n, isMain: n.id === id })));
    showToast('⭐ Berita utama diubah (mode offline)');
  };

  // Save Official
  const saveOfficial = async (official: VillageOfficial) => {
    const withId: VillageOfficial = official.id ? official : { ...official, id: `official-${Date.now()}` };
    const applyLocal = () => {
      setVillageOfficials((prev) => {
        const exists = prev.some((o) => o.id === withId.id);
        return exists ? prev.map((o) => (o.id === withId.id ? withId : o)) : [...prev, withId];
      });
    };
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminUpsertVillageOfficial(withId);
        applyLocal();
        showToast('✅ Data Perangkat Nagori disimpan!');
      } catch (err) {
        showToast(`⚠️ Gagal sinkron ke Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    applyLocal();
    showToast('⚠️ Mode offline — perangkat tidak tersinkron ke Supabase');
  };

  // Delete Official
  const deleteOfficial = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus perangkat desa ini?')) return;
    if (isSupabaseConfigured) {
      try {
        await adminRepository.adminDeleteVillageOfficial(id);
        setVillageOfficials((prev) => prev.filter((o) => o.id !== id));
        showToast('🗑️ Perangkat desa dihapus!');
      } catch (err) {
        showToast(`⚠️ Gagal hapus di Supabase: ${err instanceof Error ? err.message : 'unknown'}`);
        throw err;
      }
      return;
    }
    setVillageOfficials((prev) => prev.filter((o) => o.id !== id));
    showToast('🗑️ Perangkat desa dihapus (mode offline)');
  };

  // Sync Village Stats (full replace: upsert current list, delete removed rows)
  const syncVillageStats = async () => {
    if (!isSupabaseConfigured) {
      showToast('⚠️ Mode offline — perubahan hanya tersimpan di perangkat ini');
      return;
    }
    try {
      const withIds: VillageStat[] = villageStats.map((stat, displayOrder) => ({
        ...stat,
        id: stat.id || `stat-${Date.now()}-${displayOrder}`,
        displayOrder,
      }));
      const existing = await adminRepository.adminGetVillageStats();
      for (const row of existing) {
        if (row.id && !withIds.some((stat) => stat.id === row.id)) {
          await adminRepository.adminDeleteVillageStat(row.id);
        }
      }
      await Promise.all(withIds.map((stat) => adminRepository.adminUpsertVillageStat(stat)));
      setVillageStats(withIds);
      showToast('✅ Statistik desa berhasil disimpan ke Supabase');
    } catch (err) {
      showToast(`⚠️ Gagal sinkron statistik: ${err instanceof Error ? err.message : 'unknown'}`);
      throw err;
    }
  };

  // Reset Data
  const resetData = () => {
    setSiteSettings(defaultSiteSettings);
    setNewsList([]);
    setVillageStats(defaultVillageStats);
    setVillageOfficials(defaultOfficials);
    showToast('🔄 Seluruh data portal berhasil direset ke default!');
  };

  return (
    <AdminContext.Provider
      value={{
        siteSettings,
        setSiteSettings,
        newsList,
        setNewsList,
        villageStats,
        setVillageStats,
        villageOfficials,
        setVillageOfficials,
        saveSettings,
        saveNews,
        deleteNews,
        toggleMainNews,
        saveOfficial,
        deleteOfficial,
        syncVillageStats,
        resetData,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
