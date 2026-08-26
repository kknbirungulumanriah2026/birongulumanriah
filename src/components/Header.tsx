'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  villageName?: string;
  logoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  villageName = '',
  logoUrl = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const villageNameClickRef = useRef({ count: 0, lastClickAt: 0 });
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => setMobileMenuOpen(false);

  const handleVillageNameClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    const clickState = villageNameClickRef.current;
    clickState.count = now - clickState.lastClickAt < 700 ? clickState.count + 1 : 1;
    clickState.lastClickAt = now;

    if (clickState.count === 3) {
      clickState.count = 0;
      clickState.lastClickAt = 0;
      router.push('/admin/login');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FCFCFC]/85 backdrop-blur-md border-b border-[#EDEDE9] transition-all">
      <div className="h-16 w-full px-6 max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <Link 
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          {logoUrl && <img src={logoUrl} alt={`Logo ${villageName}`} className="w-8 h-8 object-contain" />}
          <span
            onClick={handleVillageNameClick}
            className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight"
          >
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

        {/* Actions */}
        <div className="flex items-center gap-2">
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

          </div>
        </div>
      )}
    </header>
  );
};
