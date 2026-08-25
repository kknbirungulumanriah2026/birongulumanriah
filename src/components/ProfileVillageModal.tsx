'use client';

import React from 'react';
import Link from 'next/link';
import { VILLAGE_OFFICIALS, LOGO_URL } from '../data/portalData';
import { VillageOfficial, SiteSettings } from '../types';

interface ProfileVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  officials?: VillageOfficial[];
  settings?: SiteSettings;
}

export const ProfileVillageModal: React.FC<ProfileVillageModalProps> = ({
  isOpen,
  onClose,
  officials = VILLAGE_OFFICIALS,
  settings,
}) => {
  if (!isOpen) return null;

  const villageName = settings?.villageName || 'Nagori Birong Ulu Manriah';
  const activeOfficials = officials.length > 0 ? officials : VILLAGE_OFFICIALS;
  const address = settings?.contactAddress || 'Nagori Birong Ulu Manriah, Kecamatan Sidamanik, Kabupaten Simalungun, Sumatera Utara';
  const hours = settings?.operatingHours || 'Senin - Jumat: 08.00 - 15.30 WIB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeInUp">
      <div className="bg-[#FCFCFC] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#1A1A1A] rotate-45"></div>
            </div>
            <div>
              <h3 className="font-headline text-base font-semibold">Profil {villageName}</h3>
              <p className="font-body text-[11px] text-gray-300">
                Sejarah, Visi Misi, dan Struktur Aparatur Nagori Digital
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* Vision & Mission */}
          <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs">
            <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">flag</span>
              Visi & Misi Nagori Digital 2024–2029
            </h4>
            <p className="font-body text-xs sm:text-sm text-[#1A1A1A] leading-relaxed mb-4 italic font-medium bg-[#F7F7F5] p-3 rounded-lg border border-[#EDEDE9]">
              "Mewujudkan {villageName} yang Mandiri, Sejahtera, Berkarakter Budaya, dan Terdepan dalam Pelayanan Digital Publik."
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
                <strong className="text-[#1A1A1A] block mb-1 font-semibold">1. Transparansi Tata Kelola</strong>
                Mengedepankan akuntabilitas publik dan transparansi anggaran Nagori.
              </div>
              <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
                <strong className="text-[#1A1A1A] block mb-1 font-semibold">2. Pemberdayaan Ekonomi</strong>
                Mengembangkan UMKM lokal, perkebunan teh, dan pertanian masyarakat.
              </div>
              <div className="p-3 bg-[#F7F7F5] rounded-lg border border-[#EDEDE9]">
                <strong className="text-[#1A1A1A] block mb-1 font-semibold">3. Layanan Mandiri 24/7</strong>
                Permudahan pembuatan surat menyurat melalui layanan digital Nagori.
              </div>
            </div>
          </div>

          {/* Village Officials List */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">badge</span>
              Jajaran Perangkat Nagori
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeOfficials.map((official, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-xl border border-[#EDEDE9] shadow-2xs text-center flex flex-col items-center group hover:border-[#1A1A1A]/30 transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center mb-2.5 text-gray-700 shadow-2xs group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-2xl">{official.icon || 'person'}</span>
                  </div>
                  <h5 className="font-headline text-xs font-semibold text-[#1A1A1A] line-clamp-1">
                    {official.name}
                  </h5>
                  <span className="text-[10px] font-semibold text-gray-800 bg-[#F7F7F5] border border-[#EDEDE9] px-2 py-0.5 rounded-md mt-1 mb-1.5">
                    {official.role}
                  </span>
                  <p className="text-[10px] text-gray-500">{official.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Geography & Map Info */}
          <div className="bg-[#F7F7F5] p-5 rounded-xl border border-[#EDEDE9]">
            <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-base">map</span>
              Lokasi & Kontak Kantor Pangulu
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <strong className="text-[#1A1A1A] block mb-1 font-semibold">Alamat Kantor Pangulu:</strong>
                {address}
              </div>
              <div>
                <strong className="text-[#1A1A1A] block mb-1 font-semibold">Jam Pelayanan Tatap Muka:</strong>
                {hours}<br />
                <span className="text-black font-semibold">(Portal Online Berjalan 24 Jam)</span>
              </div>
            </div>
          </div>

          {/* Modal Bottom Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-[#EDEDE9]">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Tutup Modal
            </button>
            <Link
              href="/berita"
              onClick={onClose}
              className="bg-[#1A1A1A] text-white px-5 py-2 rounded-lg font-headline text-xs font-medium hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">newspaper</span>
              <span>Lihat Berita Nagori</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

