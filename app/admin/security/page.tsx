'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../../../src/context/AdminContext';
import { AdminPageHeader } from '../../../src/components/admin/AdminPageHeader';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#EDEDE9] bg-white text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 transition';

const labelClass = 'block font-body text-xs font-medium text-gray-700 mb-1.5';

export default function AdminSecurityPage() {
  const { resetData, showToast } = useAdmin();
  const router = useRouter();
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isChangingPasscode, setIsChangingPasscode] = useState(false);

  useEffect(() => {
    fetch('/api/admin', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Sesi admin tidak valid.');
        const result = (await response.json()) as { expiresAt?: number };
        setExpiresAt(result.expiresAt ?? null);
      })
      .catch(() => showToast('Sesi admin tidak valid atau telah berakhir.'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleReset = () => {
    if (
      confirm(
        'Reset hanya mengembalikan tampilan sementara. Data di Supabase tidak akan dihapus. Lanjutkan?'
      )
    ) {
      resetData();
      showToast('Tampilan admin dikembalikan ke data bawaan.');
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch('/api/admin', { method: 'DELETE', credentials: 'same-origin' });
    router.replace('/');
    router.refresh();
  };

  const handleChangePasscode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPasscode !== confirmPasscode) {
      showToast('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }
    setIsChangingPasscode(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          operation: 'change_password',
          currentPasscode,
          newPasscode,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Penggantian kata sandi gagal.');
      setCurrentPasscode('');
      setNewPasscode('');
      setConfirmPasscode('');
      showToast('Kata sandi berhasil diganti. Sesi tetap aktif.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Penggantian kata sandi gagal.');
    } finally {
      setIsChangingPasscode(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl min-w-0">
      <AdminPageHeader
        eyebrow="Modul 05 • Akun"
        title="Keamanan Admin"
        description="Akses admin diamankan oleh sesi server yang kedaluwarsa otomatis setelah 8 jam. Perbarui kata sandi secara berkala untuk menjaga keamanan."
        icon="key"
      />

      {/* Session card */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <header className="px-5 sm:px-7 py-5 border-b border-[#EDEDE9] flex items-center gap-4 bg-gradient-to-br from-[#FAFAF7] to-white">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              expiresAt
                ? 'bg-emerald-50 ring-1 ring-emerald-100 text-emerald-600'
                : 'bg-red-50 ring-1 ring-red-100 text-red-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {expiresAt ? 'verified_user' : 'error'}
            </span>
          </div>
          <div className="min-w-0">
            <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-emerald-700">
              Status Sesi
            </span>
            <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Sesi Aktif
            </h3>
          </div>
        </header>
        <div className="p-5 sm:p-7 space-y-4">
          <p className="font-body text-sm text-gray-600 leading-relaxed">
            {isLoading
              ? 'Memeriksa sesi...'
              : expiresAt
                ? `Sesi berlaku sampai ${new Date(expiresAt).toLocaleString('id-ID')}.`
                : 'Sesi tidak tersedia.'}
          </p>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut || !expiresAt}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-700 text-xs font-headline font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>{isLoggingOut ? 'Mengakhiri sesi...' : 'Keluar Sekarang'}</span>
          </button>
        </div>
      </section>

      {/* Change password */}
      <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
        <header className="px-5 sm:px-7 py-5 border-b border-[#EDEDE9] flex items-center gap-4 bg-gradient-to-br from-[#FAFAF7] to-white">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">lock_reset</span>
          </div>
          <div className="min-w-0">
            <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-emerald-700">
              Kredensial
            </span>
            <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
              Ganti Kata Sandi
            </h3>
          </div>
        </header>

        <form onSubmit={handleChangePasscode} className="p-5 sm:p-7 space-y-4">
          <p className="font-body text-xs text-gray-500 leading-relaxed bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl p-3.5">
            Kata sandi diproses di server dan disimpan sebagai hash. Gunakan
            minimal <strong className="text-[#1A1A1A]">12 karakter</strong>.
            Pastikan migration{' '}
            <code className="bg-white px-1.5 py-0.5 rounded border border-[#EDEDE9] font-mono text-[11px]">
              0006_admin_credentials.sql
            </code>{' '}
            sudah dijalankan di Supabase.
          </p>
          <div>
            <label className={labelClass}>Kata Sandi Saat Ini *</label>
            <input
              type="password"
              required
              value={currentPasscode}
              onChange={(event) => setCurrentPasscode(event.target.value)}
              placeholder="Masukkan kata sandi aktif"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kata Sandi Baru *</label>
              <input
                type="password"
                required
                minLength={12}
                value={newPasscode}
                onChange={(event) => setNewPasscode(event.target.value)}
                placeholder="Minimal 12 karakter"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Ulangi Kata Sandi Baru *</label>
              <input
                type="password"
                required
                minLength={12}
                value={confirmPasscode}
                onChange={(event) => setConfirmPasscode(event.target.value)}
                placeholder="Ketik ulang kata sandi baru"
                className={inputClass}
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isChangingPasscode}
              className="bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-headline font-medium shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">
                {isChangingPasscode ? 'progress_activity' : 'lock_reset'}
              </span>
              <span>{isChangingPasscode ? 'Menyimpan...' : 'Ganti Kata Sandi'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="bg-white rounded-2xl border border-red-200 shadow-xs overflow-hidden">
        <header className="px-5 sm:px-7 py-5 border-b border-red-100 flex items-center gap-4 bg-red-50/40">
          <div className="w-11 h-11 rounded-xl bg-red-50 ring-1 ring-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <div className="min-w-0">
            <span className="font-body text-[10px] font-semibold tracking-[0.18em] uppercase text-red-700">
              Zona Berbahaya
            </span>
            <h3 className="font-headline text-base sm:text-lg font-semibold text-red-900 tracking-tight">
              Reset Tampilan Lokal
            </h3>
          </div>
        </header>
        <div className="p-5 sm:p-7 space-y-3">
          <p className="font-body text-xs text-red-700 leading-relaxed">
            Tindakan ini mengembalikan tampilan portal di perangkat ini ke data
            bawaan. Data di Supabase{' '}
            <strong className="text-red-900">tidak akan dihapus</strong> dan
            kredensial server tetap aman.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-headline font-medium transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">restart_alt</span>
            <span>Reset Tampilan Lokal</span>
          </button>
        </div>
      </section>
    </div>
  );
}