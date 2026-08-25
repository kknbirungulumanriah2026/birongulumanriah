'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DEFAULT_SITE_SETTINGS,
  VILLAGE_OFFICIALS,
  VILLAGE_STATS,
} from '@/src/data/portalData';
import {
  SiteSettings,
  VillageOfficial,
  VillageStat,
} from '@/src/types';
import {
  getSiteSettings,
  getVillageOfficials,
  getVillageStats,
} from '@/src/lib/repository';

import { isSupabaseConfigured } from '@/src/lib/supabase';

export default function ProfilPage() {
  const [settings, setSettings] = useState<SiteSettings>(
    isSupabaseConfigured ? ({} as SiteSettings) : DEFAULT_SITE_SETTINGS
  );
  const [officials, setOfficials] = useState<VillageOfficial[]>(
    isSupabaseConfigured ? [] : VILLAGE_OFFICIALS
  );
  const [stats, setStats] = useState<VillageStat[]>(isSupabaseConfigured ? [] : VILLAGE_STATS);

  useEffect(() => {
    const loadData = async () => {
      const [settingsData, officialsData, statsData] = await Promise.all([
        getSiteSettings(),
        getVillageOfficials(),
        getVillageStats(),
      ]);
      if (settingsData) setSettings(settingsData);
      if (officialsData && officialsData.length > 0) setOfficials(officialsData);
      if (statsData && statsData.length > 0) setStats(statsData);
    };
    loadData();
  }, []);

  const activeOfficials = officials.length > 0 ? officials : VILLAGE_OFFICIALS;
  const activeStats = stats.length > 0 ? stats : VILLAGE_STATS;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12 sm:py-20">
      {/* Hero Banner Profil */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img
            src={settings.logoUrl || '/birong.png'}
            alt="Logo Nagori"
            className="w-10 h-10 object-contain"
          />
          <h1 className="font-headline text-3xl sm:text-4xl font-semibold text-[#1A1A1A]">
            Profil {settings.villageName}
          </h1>
        </div>
        <p className="font-body text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {settings.heroSubtitle}
        </p>
      </div>

      {/* Visi & Misi */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EDEDE9] shadow-xs mb-10">
        <h2 className="font-headline text-xl font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">flag</span>
          Visi & Misi Nagori Digital 2024–2029
        </h2>
        <p className="font-body text-sm text-[#1A1A1A] leading-relaxed mb-6 italic font-medium bg-[#F7F7F5] p-4 rounded-lg border border-[#EDEDE9]">
          "Mewujudkan {settings.villageName} yang Mandiri, Sejahtera, Berkarakter Budaya, dan Terdepan dalam Pelayanan Digital Publik."
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
            <strong className="text-[#1A1A1A] block mb-1 font-semibold">1. Transparansi Tata Kelola</strong>
            Mengedepankan akuntabilitas publik dan transparansi anggaran Nagori.
          </div>
          <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
            <strong className="text-[#1A1A1A] block mb-1 font-semibold">2. Pemberdayaan Ekonomi</strong>
            Mengembangkan UMKM lokal, perkebunan teh, dan pertanian masyarakat.
          </div>
          <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
            <strong className="text-[#1A1A1A] block mb-1 font-semibold">3. Informasi Publik Terbuka</strong>
            Menyajikan berita, agenda, dan data Nagori secara digital untuk seluruh masyarakat.
          </div>
        </div>
      </section>

      {/* Statistik Desa */}
      <section className="mb-10">
        <h2 className="font-headline text-xl font-semibold text-[#1A1A1A] mb-6">
          Statistik & Capaian Desa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeStats.map((stat, idx) => (
            <div
              key={`${stat.label}-${idx}`}
              className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-xs text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
              </div>
              <span className="font-headline text-3xl font-semibold text-[#1A1A1A]">
                {stat.targetNumber.toLocaleString('id-ID')} <span className="text-base text-emerald-600">{stat.unit}</span>
              </span>
              <span className="font-body text-xs text-gray-500 mt-1">{stat.label}</span>
              <p className="font-body text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Jajaran Perangkat */}
      <section className="mb-10">
        <h2 className="font-headline text-xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">badge</span>
          Jajaran Perangkat {settings.villageName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeOfficials.map((official, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-xs text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center mb-3 text-gray-700">
                <span className="material-symbols-outlined text-2xl">
                  {official.icon || 'person'}
                </span>
              </div>
              {official.avatarUrl ? (
                <div className="mb-3">
                  <img
                    src={official.avatarUrl}
                    alt={official.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#EDEDE9]"
                  />
                </div>
              ) : null}
              <h3 className="font-headline text-sm font-semibold text-[#1A1A1A] line-clamp-1">
                {official.name}
              </h3>
              <span className="text-[11px] font-semibold text-gray-500 bg-[#F7F7F5] border border-[#EDEDE9] px-2.5 py-0.5 rounded-md mt-2">
                {official.role}
              </span>
              <p className="text-[11px] text-gray-400 mt-2 font-mono">
                {official.phone}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lokasi & Kontak */}
      <section className="bg-[#F7F7F5] p-6 sm:p-8 rounded-2xl border border-[#EDEDE9] mb-10">
        <h2 className="font-headline text-xl font-semibold text-[#1A1A1A] mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">map</span>
          Lokasi & Kontak Kantor Pangulu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <strong className="text-[#1A1A1A] block mb-2 font-semibold">
              Alamat Kantor Pangulu:
            </strong>
            <p className="text-gray-600 leading-relaxed">
              {settings.contactAddress}
            </p>
          </div>
          <div>
            <strong className="text-[#1A1A1A] block mb-2 font-semibold">
              Jam Pelayanan:
            </strong>
            <p className="text-gray-600">
              {settings.operatingHours}
              <br />
              <span className="text-black font-semibold">
                (Portal Online Berjalan 24 Jam)
              </span>
            </p>
          </div>
          <div>
            <strong className="text-[#1A1A1A] block mb-2 font-semibold">
              Email:
            </strong>
            <p className="text-gray-600">{settings.contactEmail}</p>
          </div>
          <div>
            <strong className="text-[#1A1A1A] block mb-2 font-semibold">
              Telepon / WhatsApp:
            </strong>
            <p className="text-gray-600">{settings.contactPhone}</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-8 border-t border-[#EDEDE9]">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-2.5 rounded-lg font-headline text-sm font-medium hover:bg-black transition-all cursor-pointer shadow-xs"
        >
          <span className="material-symbols-outlined">newspaper</span>
          <span>Baca Kabar Nagori Terkini</span>
        </Link>
      </div>
    </div>
  );
}
