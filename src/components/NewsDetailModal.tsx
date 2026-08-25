'use client';

import React from 'react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeInUp">
      <div className="bg-[#FCFCFC] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner Image Header */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-[#F1F1F0]">
          <img
            src={news.imageUrl}
            alt={news.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>

          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block border border-white/20">
              {news.category}
            </span>
            <h2 className="font-headline text-lg sm:text-2xl font-semibold leading-tight drop-shadow-xs">
              {news.title}
            </h2>
          </div>
        </div>

        {/* Metadata & Article Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EDEDE9] text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-[#1A1A1A]">Penulis: {news.author}</span>
              <span>•</span>
              <span>{news.date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 font-medium">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>Waktu Baca: {news.readTime}</span>
            </div>
          </div>

          {/* Body Text */}
          <div className="font-body text-xs sm:text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line space-y-4">
            {news.content}
          </div>

          {/* Social Share & Close Footer */}
          <div className="pt-5 border-t border-[#EDEDE9] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Bagikan Berita:</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Tautan berita berhasil disalin!');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 text-gray-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">link</span>
                Salin Tautan
              </button>
            </div>

            <button
              onClick={onClose}
              className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg font-headline text-xs font-medium hover:bg-black transition-colors cursor-pointer"
            >
              Tutup Berita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
