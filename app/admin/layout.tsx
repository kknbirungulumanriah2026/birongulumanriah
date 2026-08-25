// app/admin/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '../../src/context/AdminContext';

const AdminLayoutContent = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toastMessage } = useAdmin();

  const navItems = [
    { href: '/admin/dashboard', label: 'Ringkasan', icon: 'dashboard' },
    { href: '/admin/settings', label: 'Banner & Landing Page', icon: 'aspect_ratio' },
    { href: '/admin/news', label: 'Berita & Agenda', icon: 'newspaper' },
    { href: '/admin/stats', label: 'Statistik & Perangkat', icon: 'groups' },
    { href: '/admin/security', label: 'Keamanan Admin', icon: 'key' },
  ];

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      await fetch('/api/admin', { method: 'DELETE', credentials: 'same-origin' });
      router.replace('/admin/login');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex flex-col flex-shrink-0 min-h-screen">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-headline font-semibold">Admin Panel</h1>
          <p className="text-xs text-gray-400">Kelola Landing Page</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 w-full transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto relative">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-gray-700 flex items-center gap-2 animate-fadeInUp">
            <span>{toastMessage}</span>
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
