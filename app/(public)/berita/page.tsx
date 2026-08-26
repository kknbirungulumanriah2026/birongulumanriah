'use client';

import { useState, useEffect } from 'react';
import { NewsSection } from '@/src/components/NewsSection';
import { NEWS_DATA } from '@/src/data/portalData';
import { NewsItem } from '@/src/types';
import { getNews } from '@/src/lib/repository';
import { readCache } from '@/src/lib/cache';

export default function BeritaPage() {
  // Initial state MUST match server — read localStorage only inside useEffect.
  const [newsList, setNewsList] = useState<NewsItem[]>(NEWS_DATA);

  useEffect(() => {
    const cached = readCache<NewsItem[]>('news');
    if (cached && cached.length > 0) setNewsList(cached);

    const loadNews = async () => {
      const data = await getNews();
      if (data && data.length > 0) setNewsList(data);
    };
    loadNews();
  }, []);

  return (
    <div className="pt-8">
      <NewsSection newsList={newsList} />
    </div>
  );
}
