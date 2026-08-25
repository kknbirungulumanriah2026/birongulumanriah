// app/admin/login/page.tsx

'use client';

import React, { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#EDEDE9] max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-3xl">admin_panel_settings</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-[#1A1A1A]">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Masukkan kata sandi untuk mengakses panel admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kata Sandi Admin</label>
            <input 
              type="password" 
              value={passcode} 
              onChange={(e) => setPasscode(e.target.value)} 
              placeholder="Masukkan kata sandi..." 
              className="w-full px-4 py-3 rounded-xl border border-[#EDEDE9] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent" 
              autoFocus
            />
          </div>
          {error && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </p>
          )}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-xl text-sm font-medium transition-colors"
          >
            {isSubmitting ? 'Memverifikasi…' : 'Masuk'}
          </button>
        </form>

      </div>
    </div>
  );
}
