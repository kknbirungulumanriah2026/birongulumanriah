// app/admin/login/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ operation: 'login', passcode }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Login gagal.');
      const next = new URLSearchParams(window.location.search).get('next');
      // Hard navigation so middleware re-validates the fresh session cookie.
      window.location.assign(next?.startsWith('/admin/') ? next : '/admin/dashboard');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Login gagal.');
      setPasscode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5] p-4 relative overflow-hidden">
      {/* Decorative background — matches public StatisticsSection */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle, #D4D4D8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl"
      />

      <div className="relative w-full max-w-md">
        {/* Logo / brand */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] transition-colors text-xs font-medium"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Kembali ke Portal Publik</span>
          </Link>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-2xl shadow-xl border border-[#EDEDE9] relative overflow-hidden">
          {/* Top accent */}
          <span className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 mb-4">
              <span className="material-symbols-outlined text-3xl">
                admin_panel_settings
              </span>
            </div>
            <span className="block font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-emerald-700 mb-1">
              Panel Administrasi
            </span>
            <h1 className="font-headline text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
              Masuk Admin
            </h1>
            <p className="font-body text-sm text-gray-500 mt-1.5">
              Masukkan kata sandi untuk mengelola landing page Nagori.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-xs font-medium text-gray-700 mb-1.5">
                Kata Sandi Admin
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full px-4 py-3 rounded-xl border border-[#EDEDE9] bg-[#FAFAF7] text-sm focus:outline-none focus:border-[#1A1A1A] focus:bg-white focus:ring-2 focus:ring-[#1A1A1A]/10 transition"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100">
                <span className="material-symbols-outlined text-base text-red-600 flex-shrink-0">
                  error
                </span>
                <p className="font-body text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1A1A1A] hover:bg-black disabled:opacity-60 text-white py-3 rounded-xl font-headline text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  <span>Memverifikasi…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">login</span>
                  <span>Masuk Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#EDEDE9] text-center">
            <p className="font-body text-[10px] text-gray-400 tracking-wider uppercase">
              Nagori Birong Ulu Manriah • Portal Desa Digital
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}