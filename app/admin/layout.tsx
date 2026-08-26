// app/admin/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '../../src/context/AdminContext';

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { toastMessage } = useAdmin();

  const navItems = [
    { href: '/admin/dashboard', label: 'Ringkasan', icon: 'dashboard', eyebrow: '01' },
    { href: '/admin/settings', label: 'Banner & Landing Page', icon: 'aspect_ratio', eyebrow: '02' },
    { href: '/admin/news', label: 'Berita & Agenda', icon: 'newspaper', eyebrow: '03' },
    { href: '/admin/stats', label: 'Statistik & Perangkat', icon: 'groups', eyebrow: '04' },
    { href: '/admin/security', label: 'Keamanan Admin', icon: 'key', eyebrow: '05' },
  ];

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await fetch('/api/admin', { method: 'DELETE', credentials: 'same-origin' });
      router.replace('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex min-w-0 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu admin"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden cursor-default"
        />
      )}

      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden w-10 h-10 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-lg"
        aria-label="Buka menu admin"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 h-screen max-h-screen overflow-y-auto bg-[#0F0F0F] text-white flex flex-col transition-transform lg:sticky lg:top-0 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-white/5 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <span className="material-symbols-outlined text-white text-xl">
                  admin_panel_settings
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="font-headline text-base font-semibold tracking-tight truncate">
                  Admin Panel
                </h1>
                <p className="font-body text-[11px] text-gray-400 truncate">
                  Nagori Birong Ulu Manriah
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-300"
              aria-label="Tutup menu admin"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <span className="absolute top-5 right-5 hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-500 px-3 mb-2 mt-1">
            Menu Navigasi
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center gap-3 pl-3 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-0.5 rounded-full bg-emerald-400" />
                )}
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                <span className="font-body text-[10px] font-mono text-gray-600 group-hover:text-gray-400">
                  {item.eyebrow}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">desktop_windows</span>
            <span className="flex-1">Lihat Portal Publik</span>
            <span className="material-symbols-outlined text-base text-gray-600">open_in_new</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300/80 hover:text-red-200 hover:bg-red-500/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="flex-1 text-left">Keluar</span>
          </button>
          <div className="pt-3 mt-2 border-t border-white/5 text-center">
            <p className="font-body text-[10px] text-gray-600">
              © 2026 Portal Desa Digital
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 pt-20 sm:p-8 sm:pt-10 lg:p-10 lg:pt-10 relative max-w-[1400px] mx-auto w-full">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl border border-white/10 flex items-center gap-2 animate-fadeInUp">
            <span className="material-symbols-outlined text-base text-emerald-400">
              notifications
            </span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminProvider>
    <AdminLayoutContent>{children}</AdminLayoutContent>
  </AdminProvider>
);

export default AdminLayout;