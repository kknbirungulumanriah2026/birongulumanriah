'use client';

import { useState, useEffect } from 'react';
import { NewsSection } from '@/src/components/NewsSection';
import { NEWS_DATA } from '@/src/data/portalData';
import { NewsItem } from '@/src/types';
import { getNews } from '@/src/lib/repository';

import { isSupabaseConfigured } from '@/src/lib/supabase';

export default function BeritaPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>(
    isSupabaseConfigured ? [] : NEWS_DATA
  );

  useEffect(() => {
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
