// app/(public)/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { HeroSection } from '@/src/components/HeroSection';
import { NewsSection } from '@/src/components/NewsSection';
import { StatisticsSection } from '@/src/components/StatisticsSection';
import { CTASection } from '@/src/components/CTASection';
import {
  DEFAULT_SITE_SETTINGS,
  NEWS_DATA,
  VILLAGE_STATS,
  VILLAGE_OFFICIALS,
} from '@/src/data/portalData';
import { SiteSettings, NewsItem, VillageStat, VillageOfficial } from '@/src/types';
import {
  getSiteSettings,
  getNews,
  getVillageOfficials,
  getVillageStats,
} from '@/src/lib/repository';
import { readCache } from '@/src/lib/cache';

export default function HomePage() {
  // Initial state MUST match server — read localStorage only inside useEffect.
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_DATA);
  const [villageStats, setVillageStats] = useState<VillageStat[]>(VILLAGE_STATS);
  const [villageOfficials, setVillageOfficials] = useState<VillageOfficial[]>(VILLAGE_OFFICIALS);

  useEffect(() => {
    // Restore from cache after mount to avoid hydration mismatch.
    const cachedSettings = readCache<SiteSettings>('site_settings');
    const cachedNews = readCache<NewsItem[]>('news');
    const cachedOfficials = readCache<VillageOfficial[]>('village_officials');
    const cachedStats = readCache<VillageStat[]>('village_stats');
    if (cachedSettings) setSettings(cachedSettings);
    if (cachedNews && cachedNews.length > 0) setNewsList(cachedNews);
    if (cachedOfficials && cachedOfficials.length > 0) setVillageOfficials(cachedOfficials);
    if (cachedStats && cachedStats.length > 0) setVillageStats(cachedStats);

    const loadData = async () => {
      try {
        const [settingsData, newsData, officialsData, statsData] = await Promise.all([
          getSiteSettings(),
          getNews(),
          getVillageOfficials(),
          getVillageStats(),
        ]);

        if (settingsData) setSettings(settingsData);
        if (newsData && newsData.length > 0) setNewsList(newsData);
        if (officialsData && officialsData.length > 0) setVillageOfficials(officialsData);
        if (statsData && statsData.length > 0) setVillageStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <HeroSection settings={settings} />
      <NewsSection newsList={newsList} />
      <StatisticsSection stats={villageStats} />
      <CTASection settings={settings} />
    </>
  );
}