// app/admin/dashboard/page.tsx

'use client';

import React from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { newsList, villageOfficials, villageStats } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Banner selamat datang */}
      <div className="bg-[#1A1A1A] text-white p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <h3 className="font-headline text-lg font-semibold">Selamat Datang di Panel Pengelola Landing Page</h3>
          <p className="font-body text-xs text-gray-300 mt-1">
            Semua perubahan pada tampilan landing page dan berita akan langsung tersinkronisasi ke portal publik.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-xs flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">desktop_windows</span>
          <span>Lihat Tampilan Publik</span>
        </Link>
      </div>

      {/* 3 kartu metrik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kabar Berita Aktif</span>
            <span className="material-symbols-outlined text-emerald-600">newspaper</span>
          </div>
          <div className="font-headline text-3xl font-bold text-[#1A1A1A]">{newsList.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">{newsList.filter((n) => n.isMain).length} Berita Utama</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Perangkat Nagori</span>
            <span className="material-symbols-outlined text-blue-600">groups</span>
          </div>
          <div className="font-headline text-3xl font-bold text-[#1A1A1A]">{villageOfficials.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Aparatur aktif Nagori</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Indikator Statistik</span>
            <span className="material-symbols-outlined text-purple-600">monitoring</span>
          </div>
          <div className="font-headline text-3xl font-bold text-[#1A1A1A]">{villageStats.length}</div>
          <span className="text-[11px] text-gray-500 mt-1 block">Counter realtime landing page</span>
        </div>
      </div>

      {/* Aksi cepat */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs">
        <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-3">Aksi Cepat Pengaturan</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link href="/admin/settings" className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors text-center">
            <span className="material-symbols-outlined text-xl text-black">edit_note</span>
            <span className="font-semibold text-gray-800">Ubah Banner Hero</span>
          </Link>
          <Link href="/admin/news" className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors text-center">
            <span className="material-symbols-outlined text-xl text-emerald-600">add_circle</span>
            <span className="font-semibold text-gray-800">Tambah Berita Baru</span>
          </Link>
          <Link href="/admin/stats" className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors text-center">
            <span className="material-symbols-outlined text-xl text-blue-600">groups</span>
            <span className="font-semibold text-gray-800">Kelola Perangkat</span>
          </Link>
          <Link href="/admin/security" className="p-3 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl hover:bg-gray-100 flex flex-col items-center gap-1.5 transition-colors text-center">
            <span className="material-symbols-outlined text-xl text-amber-600">key</span>
            <span className="font-semibold text-gray-800">Ubah Kata Sandi</span>
          </Link>
        </div>
      </div>

      {/* Pratinjau berita terbaru */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-headline text-sm font-semibold text-[#1A1A1A]">Berita Terbaru</h4>
          <Link href="/admin/news" className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
            Lihat Semua ({newsList.length})
            <span className="material-symbols-outlined text-sm">east</span>
          </Link>
        </div>
        {newsList.length === 0 ? (
          <p className="text-xs text-gray-500 py-4 text-center">Belum ada berita terpublikasi.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {newsList.slice(0, 4).map((news) => (
              <div key={news.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold text-black">{news.title}</strong>
                  </div>
                  <p className="text-gray-500 mt-0.5">{news.category} • {news.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {news.isMain && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">⭐ Utama</span>
                  )}
                  <Link href={`/admin/news?edit=${news.id}`} className="px-2.5 py-1 rounded bg-[#F7F7F5] border border-[#EDEDE9] hover:bg-gray-100 font-medium text-gray-700">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}