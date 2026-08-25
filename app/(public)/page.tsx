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
import {
  getSiteSettings,
  getNews,
  getVillageOfficials,
  getVillageStats,
} from '@/src/lib/repository';

export default function HomePage() {
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [newsList, setNewsList] = useState(NEWS_DATA);
  const [villageStats, setVillageStats] = useState(VILLAGE_STATS);
  const [villageOfficials, setVillageOfficials] = useState(VILLAGE_OFFICIALS);

  useEffect(() => {
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