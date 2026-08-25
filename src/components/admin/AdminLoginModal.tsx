'use client';

import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ operation: 'login', passcode }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Login gagal.');
      setErrorMsg('');
      setPasscode('');
      onLoginSuccess();
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Login gagal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeInUp">
      <div className="bg-[#FCFCFC] w-full max-w-md rounded-2xl shadow-2xl border border-[#EDEDE9] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-headline text-base font-semibold">Autentikasi Admin</h3>
              <p className="font-body text-[11px] text-gray-300">
                Masuk ke Panel Pengaturan Landing Page
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Masukkan Kata Sandi / PIN Admin *
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Masukkan kata sandi..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-3 pr-10 py-2.5 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPasscode ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errorMsg && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-sm">error</span>
                {errorMsg}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2 rounded-lg font-headline text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Buka Panel Admin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
