// app/admin/settings/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../src/context/AdminContext';
import { SiteSettings } from '../../../src/types';
import { AdminPageHeader } from '../../../src/components/admin/AdminPageHeader';
import ImageUpload from '../../../src/components/admin/ImageUpload';

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg border border-[#EDEDE9] bg-white text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 transition';

const labelClass = 'block font-body text-xs font-medium text-gray-700 mb-1.5';

export default function AdminSettingsPage() {
  const { siteSettings, saveSettings } = useAdmin();
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set());
  const missionItems = settingsForm.mission ? settingsForm.mission.split('\n') : [''];
  const isUploading = uploadingFields.size > 0;

  useEffect(() => {
    setSettingsForm({ ...siteSettings });
  }, [siteSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;
    setIsSaving(true);
    try {
      await saveSettings(settingsForm);
    } catch {
      // Error toast already shown by AdminContext.
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadingChange = (field: string, uploading: boolean) => {
    setUploadingFields((current) => {
      const next = new Set(current);
      if (uploading) next.add(field);
      else next.delete(field);
      return next;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl min-w-0">
      <AdminPageHeader
        eyebrow="Modul 01 • Tampilan"
        title="Banner & Landing Page"
        description="Atur judul hero, slogan, logo, background banner CTA, dan deskripsi footer yang tampil di portal publik."
        icon="aspect_ratio"
        actions={
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="bg-[#1A1A1A] hover:bg-black disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-headline font-medium shadow-sm transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              {isSaving || isUploading ? 'progress_activity' : 'save'}
            </span>
            <span>{isUploading ? 'Menunggu upload…' : isSaving ? 'Menyimpan…' : 'Simpan Pengaturan'}</span>
          </button>
        }
          />

      {/* Hero Banner */}
      <SettingsSection
        index="01"
        title="Konfigurasi Hero Banner"
        description="Bagian utama yang pertama kali dilihat pengunjung."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Nagori / Desa *">
            <input
              type="text"
              required
              value={settingsForm.villageName}
              onChange={(e) => setSettingsForm({ ...settingsForm, villageName: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Estimasi Rata-Rata Waktu Pelayanan (Menit) *">
            <input
              type="text"
              required
              value={settingsForm.avgServiceTime}
              onChange={(e) => setSettingsForm({ ...settingsForm, avgServiceTime: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Judul Baris 1 Hero *">
            <input
              type="text"
              required
              value={settingsForm.heroTitle}
              onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Judul Baris 2 Highlight Hero *">
            <input
              type="text"
              required
              value={settingsForm.heroTitleHighlight}
              onChange={(e) =>
                setSettingsForm({ ...settingsForm, heroTitleHighlight: e.target.value })
              }
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="Sub-Judul / Deskripsi Hero *">
          <textarea
            rows={2}
            required
            value={settingsForm.heroSubtitle}
            onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
            className={inputClass + ' resize-y'}
          />
        </Field>
        <ImageUpload
          label="Logo Nagori"
          value={settingsForm.logoUrl}
          onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
          folder="settings/logo"
          maxDim={512}
          maxSizeMB={0.05}
          transparent
          onUploadingChange={(uploading) => handleUploadingChange('logo', uploading)}
        />
        <ImageUpload
          label="Gambar Background Hero Banner"
          value={settingsForm.heroBgUrl}
          onChange={(url) => setSettingsForm({ ...settingsForm, heroBgUrl: url })}
          folder="settings/hero"
          maxDim={1600}
          maxSizeMB={0.2}
          onUploadingChange={(uploading) => handleUploadingChange('hero', uploading)}
        />

        {/* Preview */}
        <div className="mt-2 rounded-2xl overflow-hidden bg-[#1A1A1A] text-white border border-[#27272A]">
          <div className="px-5 py-2 border-b border-white/10 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            <span>Pratinjau Live</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Hero Section
            </span>
          </div>
          <div className="relative h-44 flex flex-col justify-center items-center text-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url('${settingsForm.heroBgUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            <div className="relative z-10 px-4 max-w-xl">
              <h5 className="font-headline text-lg sm:text-xl font-semibold tracking-tight">
                {settingsForm.heroTitle}{' '}
                <span className="text-gray-300 font-light">
                  {settingsForm.heroTitleHighlight}
                </span>
              </h5>
              <p className="text-[11px] text-gray-200 mt-1.5 line-clamp-2">
                {settingsForm.heroSubtitle}
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* CTA Banner & Contact */}
      <SettingsSection
        index="02"
        title="Banner Call-To-Action & Kontak"
        description="Banner ajakan dan informasi kontak di footer portal publik."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Judul Banner CTA *">
            <input
              type="text"
              required
              value={settingsForm.ctaTitle}
              onChange={(e) => setSettingsForm({ ...settingsForm, ctaTitle: e.target.value })}
              className={inputClass}
            />
          </Field>
          <div className="sm:pt-7">
            <ImageUpload
              label="Gambar Background Banner CTA"
              value={settingsForm.ctaBgUrl}
              onChange={(url) => setSettingsForm({ ...settingsForm, ctaBgUrl: url })}
              folder="settings/cta"
              maxDim={1600}
              maxSizeMB={0.2}
              onUploadingChange={(uploading) => handleUploadingChange('cta', uploading)}
            />
          </div>
        </div>
        <Field label="Deskripsi Banner CTA *">
          <textarea
            rows={2}
            required
            value={settingsForm.ctaSubtitle}
            onChange={(e) => setSettingsForm({ ...settingsForm, ctaSubtitle: e.target.value })}
            className={inputClass + ' resize-y'}
          />
        </Field>
        <div className="border-t border-[#EDEDE9] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nomor Telepon Admin / WhatsApp *">
            <input
              type="text"
              required
              value={settingsForm.contactPhone}
              onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Email Resmi Nagori *">
            <input
              type="email"
              required
              value={settingsForm.contactEmail}
              onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Alamat Kantor Pangulu Nagori *">
            <input
              type="text"
              required
              value={settingsForm.contactAddress}
              onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Jam Operasional Kantor *">
            <input
              type="text"
              required
              value={settingsForm.operatingHours}
              onChange={(e) => setSettingsForm({ ...settingsForm, operatingHours: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </SettingsSection>

      {/* Footer, Vision & Mission */}
      <SettingsSection
        index="03"
        title="Footer, Visi & Misi"
        description="Narasi desa yang muncul di footer dan halaman profil publik."
      >
        <Field label="Deskripsi Footer *">
          <textarea
            rows={3}
            required
            value={settingsForm.footerDescription}
            onChange={(e) =>
              setSettingsForm({ ...settingsForm, footerDescription: e.target.value })
            }
            className={inputClass + ' resize-y'}
          />
        </Field>
        <Field label="Visi *">
          <textarea
            rows={3}
            required
            value={settingsForm.vision}
            onChange={(e) => setSettingsForm({ ...settingsForm, vision: e.target.value })}
            className={inputClass + ' resize-y'}
          />
        </Field>
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <label className={labelClass + ' mb-0'}>Misi *</label>
            <button
              type="button"
              onClick={() =>
                setSettingsForm({
                  ...settingsForm,
                  mission: [...missionItems, ''].join('\n'),
                })
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Tambah Kolom</span>
            </button>
          </div>
          <div className="space-y-2.5">
            {missionItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-center text-xs font-semibold text-gray-400 font-body">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => {
                    const nextItems = [...missionItems];
                    nextItems[index] = e.target.value;
                    setSettingsForm({ ...settingsForm, mission: nextItems.join('\n') });
                  }}
                  className={inputClass}
                  placeholder={`Misi ${index + 1}`}
                />
                {missionItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm({
                        ...settingsForm,
                        mission: missionItems.filter((_, i) => i !== index).join('\n'),
                      })
                    }
                    className="w-9 h-9 shrink-0 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                    aria-label={`Hapus Misi ${index + 1}`}
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="font-body text-[11px] text-gray-400 mt-2">
            Tambahkan kolom sesuai jumlah misi yang diperlukan. Tekan Enter
            atau gunakan tombol tambah untuk kolom baru.
          </p>
        </div>
      </SettingsSection>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[#EDEDE9]">
        <button
          type="button"
          onClick={() => setSettingsForm({ ...siteSettings })}
          className="px-5 py-2.5 rounded-xl border border-[#EDEDE9] bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}

interface SettingsSectionProps {
  index: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({ index, title, description, children }: SettingsSectionProps) {
  return (
    <section className="bg-white rounded-2xl border border-[#EDEDE9] shadow-xs overflow-hidden">
      <header className="px-5 sm:px-7 py-5 border-b border-[#EDEDE9] flex items-start gap-4 bg-gradient-to-br from-[#FAFAF7] to-white">
        <span className="font-headline text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
          {index}
        </span>
        <div className="min-w-0">
          <h3 className="font-headline text-base sm:text-lg font-semibold text-[#1A1A1A] tracking-tight">
            {title}
          </h3>
          <p className="font-body text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
      </header>
      <div className="p-5 sm:p-7 space-y-5">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}