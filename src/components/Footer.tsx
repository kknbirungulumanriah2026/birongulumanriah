'use client';

import React from 'react';
import Link from 'next/link';
import { LOGO_URL } from '../data/portalData';
import { SiteSettings } from '../types';

interface FooterProps {
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
}) => {
  const villageName = settings?.villageName || 'Nagori Birong Ulu Manriah';
  const logoUrl = settings?.logoUrl || LOGO_URL;
  const email = settings?.contactEmail || 'halo@birongulumanriah.desa.id';
  const address = settings?.contactAddress || 'Nagori Birong Ulu Manriah, Kec. Sidamanik, Kab. Simalungun, Sumatera Utara 21171';
  const hours = settings?.operatingHours || 'Senin - Jumat | 08:00 - 15:30 WIB';

  return (
    <footer className="w-full bg-[#F7F7F5] pt-16 pb-8 border-t border-[#EDEDE9] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoUrl} alt="Logo Nagori" className="w-7 h-7 object-contain" />
              <span className="font-headline text-base font-semibold text-[#1A1A1A]">
                Portal {villageName}
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-gray-500 max-w-md leading-relaxed mb-6">
              Melayani warga dengan transparansi, kemudahan, dan ketulusan hati demi kemajuan {villageName} yang mandiri dan sejahtera.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-600">
              <Link href="/profil" className="hover:text-black cursor-pointer">Tentang Nagori</Link>
              <span>•</span>
              <Link href="/berita" className="hover:text-black cursor-pointer">Berita & Agenda</Link>
              <span>•</span>
              <Link href="/admin" className="text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                Panel Admin
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">
              Kontak Kami
            </h4>
            <p className="font-body text-xs sm:text-sm text-gray-500 leading-relaxed">
              {address}<br />
              <span className="text-[#1A1A1A] font-medium block mt-1">{email}</span>
            </p>
          </div>

          {/* Social Media & QR */}
          <div>
            <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-4">
              Akses Cepat
            </h4>
            <div className="flex items-center gap-2.5 mb-4">
              <span
                title="Pojok QR Nagori"
                className="material-symbols-outlined text-gray-600 hover:text-black cursor-pointer transition-colors p-2 bg-white rounded-lg border border-[#EDEDE9] shadow-2xs"
              >
                qr_code_2
              </span>
              <span
                title="Website Resmi"
                className="material-symbols-outlined text-gray-600 hover:text-black cursor-pointer transition-colors p-2 bg-white rounded-lg border border-[#EDEDE9] shadow-2xs"
              >
                language
              </span>
              <span
                title="Email Sekretariat"
                className="material-symbols-outlined text-gray-600 hover:text-black cursor-pointer transition-colors p-2 bg-white rounded-lg border border-[#EDEDE9] shadow-2xs"
              >
                mail
              </span>
            </div>
            <p className="font-body text-xs text-gray-500">
              Jam Operasional Kantor Pangulu:<br />
              {hours}
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#EDEDE9] text-center">
          <p className="font-body text-xs text-gray-400">
            © 2024 Portal {villageName}. Seluruh Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};
