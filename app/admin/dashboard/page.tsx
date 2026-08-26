// app/admin/dashboard/page.tsx

'use client';

import React from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { AdminPageHeader } from '../../../src/components/admin/AdminPageHeader';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { newsList, villageOfficials, villageStats } = useAdmin();

  const mainNewsCount = newsList.filter((n) => n.isMain).length;
  const latestNews = newsList.slice(0, 4);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Ringkasan Panel"
        title="Selamat Datang, Admin Nagori"
        description="Pantau ringkasan data portal publik, kelola konten, dan lakukan perubahan tampilan landing page dari satu tempat."
        icon="dashboard"
      />

      {/* Hero banner — matches public CTASection aesthetic */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1A1A1A] text-white p-6 sm:p-8 border border-[#27272A] shadow-xl">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at top right, rgba(16,185,129,0.35), transparent 55%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Portal Aktif & Sinkron
            </span>
            <h2 className="font-headline text-xl sm:text-2xl font-semibold mt-3 tracking-tight">
              Semua Perubahan Langsung Tersinkronisasi
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              Setiap pembaruan pada banner, berita, statistik, dan aparatur
              desa akan otomatis tampil di portal publik Nagori Birong Ulu
              Manriah.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] hover:bg-gray-100 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-headline font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-base">desktop_windows</span>
            <span>Lihat Tampilan Publik</span>
          </Link>
        </div>
      </section>

      {/* Metric Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="font-body text-[11px] font-semibold text-emerald-700 tracking-[0.18em] uppercase">
              Data Realtime
            </span>
            <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] mt-0.5">
              Ringkasan Konten Portal
            </h3>
          </div>
          <span className="font-body text-[11px] text-gray-500 hidden sm:inline">
            Data terakhir dimuat dari Supabase
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            eyebrow="Konten Berita"
            value={newsList.length}
            unit="item"
            label={`${mainNewsCount} Berita Utama Featured`}
            icon="newspaper"
            accent="emerald"
          />
          <MetricCard
            eyebrow="Aparatur Nagori"
            value={villageOfficials.length}
            unit="perangkat"
            label="Aparatur aktif yang ditampilkan"
            icon="groups"
            accent="blue"
          />
          <MetricCard
            eyebrow="Indikator Statistik"
            value={villageStats.length}
            unit="counter"
            label="Counter realtime landing page"
            icon="monitoring"
            accent="amber"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-[#EDEDE9] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600">bolt</span>
            <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
              Aksi Cepat Pengaturan
            </h3>
          </div>
          <span className="font-body text-[11px] text-gray-400 hidden sm:inline">
            Pintasan ke modul yang paling sering digunakan
          </span>
        </div>
        <div className="p-5 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction
            href="/admin/settings"
            icon="edit_note"
            label="Ubah Banner Hero"
            tint="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          />
          <QuickAction
            href="/admin/news"
            icon="add_circle"
            label="Tambah Berita Baru"
            tint="bg-blue-50 text-blue-700 ring-1 ring-blue-100"
          />
          <QuickAction
            href="/admin/stats"
            icon="groups"
            label="Kelola Perangkat"
            tint="bg-amber-50 text-amber-700 ring-1 ring-amber-100"
          />
          <QuickAction
            href="/admin/security"
            icon="key"
            label="Ubah Kata Sandi"
            tint="bg-violet-50 text-violet-700 ring-1 ring-violet-100"
          />
        </div>
      </section>

      {/* Recent News */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-[#EDEDE9] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600">newspaper</span>
            <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">
              Berita Terbaru
            </h3>
          </div>
          <Link
            href="/admin/news"
            className="font-body text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            <span>Lihat Semua ({newsList.length})</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">
              east
            </span>
          </Link>
        </div>
        {latestNews.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2 mx-auto">
              newspaper
            </span>
            <p className="font-headline text-sm font-semibold text-[#1A1A1A]">
              Belum ada berita terpublikasi
            </p>
            <p className="font-body text-xs text-gray-500 mt-1 mb-4 max-w-md mx-auto">
              Berita yang ditambahkan di modul &quot;Berita &amp; Agenda&quot;
              akan tampil di sini dan langsung terbit di landing page.
            </p>
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Buat Berita Pertama</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#EDEDE9]">
            {latestNews.map((news) => (
              <div
                key={news.id}
                className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#FAFAF7] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F7F7F5] border border-[#EDEDE9] flex-shrink-0 hidden sm:block">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-300">
                          image
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="bg-[#F7F7F5] border border-[#EDEDE9] text-gray-700 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">
                        {news.category}
                      </span>
                      {news.isMain && (
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          Utama
                        </span>
                      )}
                    </div>
                    <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] truncate">
                      {news.title}
                    </h4>
                    <p className="font-body text-[11px] text-gray-500 mt-0.5">
                      {news.date} • {news.author}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/news?edit=${news.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-white hover:border-[#1A1A1A]/30 text-xs font-medium text-gray-700 hover:text-black transition-colors flex items-center gap-1 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface MetricCardProps {
  eyebrow: string;
  value: number;
  unit: string;
  label: string;
  icon: string;
  accent: 'emerald' | 'blue' | 'amber';
}

const ACCENT_STYLES: Record<
  MetricCardProps['accent'],
  { tile: string; text: string; dot: string }
> = {
  emerald: {
    tile: 'bg-emerald-50 ring-1 ring-emerald-100',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
  },
  blue: {
    tile: 'bg-blue-50 ring-1 ring-blue-100',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
  },
  amber: {
    tile: 'bg-amber-50 ring-1 ring-amber-100',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
  },
};

function MetricCard({ eyebrow, value, unit, label, icon, accent }: MetricCardProps) {
  const palette = ACCENT_STYLES[accent];
  return (
    <div className="group relative bg-white p-5 sm:p-6 rounded-2xl border border-[#EDEDE9] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
      <span className="absolute left-0 top-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-emerald-400 to-emerald-600" />
      <div className="flex items-center justify-between mb-4">
        <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400">
          {eyebrow}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${palette.tile}`}>
          <span className={`material-symbols-outlined text-[20px] ${palette.text}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-headline text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1A1A]">
          {value.toLocaleString('id-ID')}
        </span>
        <span className="font-body text-xs font-medium text-gray-500">{unit}</span>
      </div>
      <p className="font-body text-[11px] text-gray-500 mt-1.5">{label}</p>
      <div className="mt-3 flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${palette.dot} animate-pulse`} />
        <span className="font-body text-[10px] font-medium text-gray-400 tracking-wider uppercase">
          Live
        </span>
      </div>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  icon: string;
  label: string;
  tint: string;
}

function QuickAction({ href, icon, label, tint }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group p-4 rounded-xl border border-[#EDEDE9] hover:border-emerald-200 hover:bg-emerald-50/40 flex flex-col items-center gap-2.5 transition-all hover:-translate-y-0.5 text-center"
    >
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}>
        <span className="material-symbols-outlined text-[22px]">{icon}</span>
      </span>
      <span className="font-headline text-xs font-semibold text-[#1A1A1A] leading-snug">
        {label}
      </span>
      <span className="material-symbols-outlined text-sm text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all">
        east
      </span>
    </Link>
  );
}