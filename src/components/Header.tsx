'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOGO_URL } from '../data/portalData';

interface HeaderProps {
  villageName?: string;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  villageName = 'Nagori Birong Ulu Manriah',
  logoUrl = LOGO_URL,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAdminLoggedIn(localStorage.getItem('sidodadi_adminLoggedIn') === 'true');
  }, [pathname]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FCFCFC]/85 backdrop-blur-md border-b border-[#EDEDE9] transition-all">
      <div className="h-16 w-full px-6 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link 
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <img src={logoUrl || LOGO_URL} alt="Logo Nagori" className="w-8 h-8 object-contain" />
          <span className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
            {villageName}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className={`font-body text-xs font-medium transition-colors ${
              pathname === '/' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            className={`font-body text-xs font-medium transition-colors ${
              pathname === '/profil' ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
            }`}
          >
            Profil Nagori
          </Link>
          <Link
            href="/berita"
            className={`font-body text-xs font-medium transition-colors ${
              pathname.startsWith('/berita') ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
            }`}
          >
            Berita & Agenda
          </Link>
          <Link
            href="/layanan"
            className={`font-body text-xs font-medium transition-colors ${
              pathname.startsWith('/layanan') ? 'text-black font-semibold' : 'text-gray-500 hover:text-black'
            }`}
          >
            Layanan Surat
          </Link>
        </nav>

        {/* Actions (CTA Button & Admin Trigger) */}
        <div className="flex items-center gap-2">
          {/* Admin Panel Button */}
          <Link
            href="/admin/login"
            title="Kelola & Atur Landing Page (Admin)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-2xs cursor-pointer ${
              isAdminLoggedIn
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isAdminLoggedIn ? 'admin_panel_settings' : 'shield_person'}
            </span>
            <span className="hidden sm:inline">
              {isAdminLoggedIn ? 'Panel Admin' : 'Kelola Panel'}
            </span>
          </Link>

          <Link
            href="/berita"
            className="hidden sm:flex bg-[#1A1A1A] text-white px-4 py-1.5 rounded-lg font-headline text-xs font-medium hover:bg-black transition-all shadow-xs"
          >
            Lihat Berita
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center text-gray-700"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FCFCFC] border-b border-[#EDEDE9] px-6 py-4 shadow-md animate-fadeInUp">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={closeMenu}
              className="py-2 text-[#1A1A1A] text-sm font-medium border-b border-[#EDEDE9]"
            >
              Beranda
            </Link>
            <Link
              href="/profil"
              onClick={closeMenu}
              className="py-2 text-[#1A1A1A] text-sm font-medium border-b border-[#EDEDE9]"
            >
              Profil Nagori
            </Link>
            <Link
              href="/berita"
              onClick={closeMenu}
              className="py-2 text-[#1A1A1A] text-sm font-medium border-b border-[#EDEDE9]"
            >
              Berita & Agenda
            </Link>
            <Link
              href="/layanan"
              onClick={closeMenu}
              className={`py-2 text-sm font-medium border-b border-[#EDEDE9] ${
                pathname.startsWith('/layanan')
                  ? 'text-[#1A1A1A] font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Layanan Surat
            </Link>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/admin"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 border border-emerald-300 bg-emerald-50 text-emerald-900 py-2 rounded-lg text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                {isAdminLoggedIn ? 'Buka Panel Admin' : 'Kelola Landing Page (Admin)'}
              </Link>
              <Link
                href="/berita"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 border border-[#EDEDE9] bg-white text-gray-800 py-2 rounded-lg text-xs font-medium"
              >
                <span className="material-symbols-outlined text-sm">newspaper</span>
                Lihat Berita & Agenda
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
