'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NewsItem } from '../types';

interface NewsSectionProps {
  newsList?: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsList = [],
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const items = newsList;
  const mainNews = items.find((item) => item.isMain) || items[0];
  const secondaryList = items.filter((item) => item.id !== mainNews?.id);

  const categories = ['Semua', 'Agenda Desa', 'Publik', 'UMKM', 'Transparansi'];

  const filteredList =
    activeCategory === 'Semua'
      ? secondaryList
      : secondaryList.filter((item) => item.category === activeCategory);

  return (
    <section id="berita-agenda" className="w-full py-20 sm:py-28 px-6 max-w-7xl mx-auto">
      {/* Header and Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <span className="font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase block mb-1">
            Informasi Terpercaya
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-[#1A1A1A] tracking-tight">
            Kabar Terkini Desa
          </h2>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1A1A1A] text-white shadow-xs'
                  : 'bg-[#F7F7F5] border border-[#EDEDE9] text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}

          <Link
            href="/berita"
            className="font-body text-xs font-medium text-gray-700 flex items-center gap-1 hover:text-black ml-2 whitespace-nowrap group cursor-pointer"
          >
            <span>Lihat Semua Kabar</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
              east
            </span>
          </Link>
        </div>
      </div>

      {/* Grid: Main featured news on left, secondary list on right */}
      {!mainNews ? (
        <div className="bg-white p-10 rounded-xl border border-[#EDEDE9] text-center">
          <span className="material-symbols-outlined text-4xl text-gray-300 block mb-3 mx-auto">newspaper</span>
          <p className="font-headline text-sm font-semibold text-[#1A1A1A]">Belum ada kabar terbaru</p>
          <p className="font-body text-xs text-gray-500 mt-1">Berita dan agenda Nagori akan tampil di sini setelah dipublikasikan melalui panel admin.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Main News Card */}
        <Link href={`/berita/${mainNews.id}`}>
          <article 
            className="group cursor-pointer flex flex-col justify-between h-full bg-white p-5 rounded-xl border border-[#EDEDE9] hover:shadow-xl hover:shadow-gray-100 transition-all duration-300"
          >
            <div>
              <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg mb-5 bg-[#F1F1F0]">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${mainNews.imageUrl}')` }}
                ></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-[#EDEDE9]">
                  <span className="font-body text-[11px] font-medium text-gray-800">
                    {mainNews.category}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-normal">
                  <span>{mainNews.date}</span>
                  <span>•</span>
                  <span>{mainNews.author}</span>
                  <span>•</span>
                  <span>{mainNews.readTime} baca</span>
                </div>

                <h3 className="font-headline text-2xl font-semibold text-[#1A1A1A] mb-2.5 group-hover:text-black transition-colors leading-snug">
                  {mainNews.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {mainNews.snippet}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-gray-800 group-hover:text-black">
              <span>Baca Selengkapnya</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </article>
        </Link>

        {/* Secondary News List */}
        <div className="flex flex-col gap-5">
          {filteredList.map((news) => (
            <Link key={news.id} href={`/berita/${news.id}`}>
              <article
                className="flex gap-4 group cursor-pointer bg-white p-4 rounded-xl border border-[#EDEDE9] hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-[#F1F1F0]">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${news.imageUrl}')` }}
                  ></div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#F7F7F5] border border-[#EDEDE9] text-gray-700 uppercase tracking-wider">
                      {news.category}
                    </span>
                    <span>• {news.date}</span>
                  </div>

                  <h4 className="font-headline text-sm sm:text-base font-semibold text-[#1A1A1A] group-hover:text-black transition-colors mb-1 leading-snug line-clamp-2">
                    {news.title}
                  </h4>

                  <p className="font-body text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {news.snippet}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
      )}
    </section>
  );
};
