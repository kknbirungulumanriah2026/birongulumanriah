// app/admin/settings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { SiteSettings } from '../../../src/types';
import ImageUpload from '../../../src/components/admin/ImageUpload';

export default function AdminSettingsPage() {
  const { siteSettings, saveSettings } = useAdmin();
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettingsForm({ ...siteSettings });
  }, [siteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSettings(settingsForm);
    } catch {
      // Error toast already shown by AdminContext.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b pb-3 border-gray-200">
        <div>
          <h3 className="font-headline text-base font-semibold text-[#1A1A1A]">Pengaturan Banner & Tampilan Landing Page</h3>
          <p className="text-xs text-gray-500">Ubah judul hero, slogan, background image, logo, serta banner CTA secara fleksibel.</p>
        </div>
        <button type="submit" disabled={isSaving} className="bg-[#1A1A1A] hover:bg-black disabled:opacity-60 text-white px-5 py-2 rounded-lg text-xs font-medium shadow-xs transition-all flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">{isSaving ? 'progress_activity' : 'save'}</span>
          <span>{isSaving ? 'Menyimpan…' : 'Simpan Perubahan'}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
        <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">1. Konfigurasi Hero Banner Utama</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nama Nagori / Desa *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.villageName} 
              onChange={(e) => setSettingsForm({ ...settingsForm, villageName: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Estimasi Rata-Rata Waktu Pelayanan (Menit) *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.avgServiceTime} 
              onChange={(e) => setSettingsForm({ ...settingsForm, avgServiceTime: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Judul Baris 1 Hero *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.heroTitle} 
              onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Judul Baris 2 Highlight Hero *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.heroTitleHighlight} 
              onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleHighlight: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <ImageUpload
              label="Logo Nagori"
              value={settingsForm.logoUrl}
              onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
              folder="settings/logo"
              maxDim={512}
              maxSizeMB={0.05}
              transparent
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sub-Judul / Deskripsi Hero *</label>
          <textarea 
            rows={2} 
            required 
            value={settingsForm.heroSubtitle} 
            onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} 
            className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
          />
        </div>
        <ImageUpload
          label="Gambar Background Hero Banner"
          value={settingsForm.heroBgUrl}
          onChange={(url) => setSettingsForm({ ...settingsForm, heroBgUrl: url })}
          folder="settings/hero"
          maxDim={1600}
          maxSizeMB={0.2}
        />
        {/* Preview */}
        <div className="mt-3 p-4 rounded-xl relative overflow-hidden bg-black text-white h-36 flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url('${settingsForm.heroBgUrl}')` }} />
          <div className="relative z-10">
            <h5 className="font-headline text-lg font-bold">{settingsForm.heroTitle} <span className="text-gray-300 font-light">{settingsForm.heroTitleHighlight}</span></h5>
            <p className="text-[11px] text-gray-200 mt-1 max-w-md line-clamp-2">{settingsForm.heroSubtitle}</p>
          </div>
        </div>
      </div>

      {/* CTA & Contact */}
      <div className="bg-white p-5 rounded-xl border border-[#EDEDE9] shadow-2xs space-y-4">
        <h4 className="font-headline text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider border-b pb-2">2. Banner Call-To-Action (CTA) & Kontak Desa</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Judul Banner CTA *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.ctaTitle} 
              onChange={(e) => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <ImageUpload
              label="Gambar Background Banner CTA"
              value={settingsForm.ctaBgUrl}
              onChange={(url) => setSettingsForm({ ...settingsForm, ctaBgUrl: url })}
              folder="settings/cta"
              maxDim={1600}
              maxSizeMB={0.2}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi Banner CTA *</label>
          <textarea 
            rows={2} 
            required 
            value={settingsForm.ctaSubtitle} 
            onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubtitle: e.target.value })} 
            className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nomor Telepon Admin / WhatsApp *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.contactPhone} 
              onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Resmi Nagori *</label>
            <input 
              type="email" 
              required 
              value={settingsForm.contactEmail} 
              onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Alamat Kantor Pangulu Nagori *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.contactAddress} 
              onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Jam Operasional Kantor *</label>
            <input 
              type="text" 
              required 
              value={settingsForm.operatingHours} 
              onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })} 
              className="w-full px-3 py-2 rounded-lg border border-[#EDEDE9] bg-white text-xs text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-black" 
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button type="submit" disabled={isSaving} className="bg-[#1A1A1A] hover:bg-black disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-headline text-xs font-medium shadow-xs transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-base">{isSaving ? 'progress_activity' : 'save'}</span>
          <span>{isSaving ? 'Menyimpan ke Supabase…' : 'Simpan Semua Pengaturan Landing Page'}</span>
        </button>
      </div>
    </form>
  );
}