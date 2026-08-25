'use client';

import { useAdmin } from '../../../src/context/AdminContext';

export default function AdminSecurityPage() {
  const { resetData, showToast } = useAdmin();

  const handleReset = () => {
    if (confirm('Reset hanya mengembalikan tampilan sementara. Data di Supabase tidak akan dihapus. Lanjutkan?')) {
      resetData();
      showToast('Tampilan admin dikembalikan ke data bawaan.');
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div className="border-b pb-3 border-gray-200">
        <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">Keamanan Admin</h3>
        <p className="text-xs text-gray-500">Akses admin diamankan oleh sesi server yang kedaluwarsa otomatis setelah 8 jam.</p>
      </div>
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] space-y-3 text-xs text-gray-600 leading-relaxed">
        <h4 className="font-headline font-semibold text-[#1A1A1A]">Mengganti kata sandi</h4>
        <p>Kata sandi tidak disimpan atau dikirim ke browser. Ubah <code className="bg-gray-100 px-1 rounded">ADMIN_PASSCODE</code> di konfigurasi server, lalu restart/deploy aplikasi. Pastikan <code className="bg-gray-100 px-1 rounded">ADMIN_SESSION_SECRET</code> juga berupa nilai acak minimal 16 karakter.</p>
      </div>
      <div className="bg-red-50 border border-red-200 p-5 rounded-xl space-y-2">
        <h4 className="font-headline text-xs font-semibold text-red-800 uppercase tracking-wider">Reset tampilan lokal</h4>
        <p className="text-xs text-red-700">Ini tidak menghapus data Supabase dan tidak mengubah kredensial server.</p>
        <button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Reset Tampilan</button>
      </div>
    </div>
  );
}
