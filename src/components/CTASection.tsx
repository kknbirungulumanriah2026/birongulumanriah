'use client';

import React from 'react';
import Link from 'next/link';
import { CTA_BG_URL } from '../data/portalData';
import { SiteSettings } from '../types';

interface CTASectionProps {
  settings?: SiteSettings;
}

export const CTASection: React.FC<CTASectionProps> = ({ settings }) => {
  const bgUrl = settings?.ctaBgUrl || CTA_BG_URL;
  const title = settings?.ctaTitle || 'Pantau Perkembangan Nagori Lewat Portal Digital';
  const subtitle =
    settings?.ctaSubtitle ||
    'Dapatkan informasi terkini mengenai berita, agenda, dan program Nagori Birong Ulu Manriah secara terbuka dan terpercaya kapan pun Anda membutuhkannya.';

  return (
    <section className="w-full px-6 max-w-7xl mx-auto pb-20 sm:pb-28">
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#1A1A1A] py-16 sm:py-24 text-center px-6 shadow-xl border border-[#27272A]">
        {/* Background Overlay Texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${bgUrl}')` }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full mb-6 text-white text-[11px] font-medium uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm text-emerald-400">campaign</span>
            Portal Informasi Nagori
          </div>

          <h2 className="font-headline text-3xl sm:text-5xl font-semibold text-white leading-tight mb-5 tracking-tight">
            {title}
          </h2>

          <p className="font-body text-xs sm:text-base text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/berita"
              className="bg-white text-[#1A1A1A] px-6 py-2.5 rounded-lg font-headline text-xs sm:text-sm font-medium hover:bg-gray-100 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Baca Berita Terbaru</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>

            <Link
              href="/profil"
              className="bg-transparent text-white border border-white/20 px-6 py-2.5 rounded-lg font-headline text-xs sm:text-sm font-medium hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">account_balance</span>
              <span>Profil Nagori</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

