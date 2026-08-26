'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NEWS_DATA } from '@/src/data/portalData';
import { NewsItem } from '@/src/types';
import { getNews } from '@/src/lib/repository';
import { readCache } from '@/src/lib/cache';

interface BeritaDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchNews = async () => {
      setLoading(true);
      const data = await getNews();
      const cached = readCache<NewsItem[]>('news');
      const source = data && data.length > 0
        ? data
        : cached && cached.length > 0
          ? cached
          : NEWS_DATA;
      const found = source.find((n) => n.id === slug);
      setNewsItem(found || null);
      setLoading(false);
    };

    fetchNews();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-[#1A1A1A] rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-xs text-gray-500">Memuat berita...</p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 block">
            error_news
          </span>
          <h2 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-2">
            Berita Tidak Ditemukan
          </h2>
          <p className="font-body text-sm text-gray-500 mb-6">
            Sayangnya, berita yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2 rounded-lg font-headline text-xs font-medium hover:bg-black transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Kembali ke Berita</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="w-full max-w-4xl mx-auto px-6 py-12 sm:py-20">
      {/* Back Button */}
      <Link
        href="/berita"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-black transition-colors mb-6"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        <span>Kembali ke Berita</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-[#EDEDE9] text-[10px] font-medium text-gray-800 uppercase tracking-wider mb-4">
          {newsItem.category}
        </span>

        <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-[#1A1A1A] leading-tight mb-4">
          {newsItem.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-gray-400 font-normal">
          <span>{newsItem.date}</span>
          <span>•</span>
          <span>{newsItem.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {newsItem.readTime} baca
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-8 bg-[#F1F1F0]">
        <img
          src={newsItem.imageUrl}
          alt={newsItem.imageAlt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="font-body text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line space-y-6">
        {newsItem.content}
      </div>

      {/* Social Share */}
      <div className="mt-12 pt-8 border-t border-[#EDEDE9] flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500 font-medium">Bagikan Berita:</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Tautan berita berhasil disalin!');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 text-gray-800 text-xs font-medium flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">link</span>
            Salin Tautan
          </button>
        </div>

        <Link
          href="/berita"
          className="px-4 py-2 rounded-lg bg-white border border-[#EDEDE9] text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Semua Berita
        </Link>
      </div>
    </article>
  );
}
