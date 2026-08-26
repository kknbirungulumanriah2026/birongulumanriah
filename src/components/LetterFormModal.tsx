// src/components/LetterFormModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { LetterTemplate, TemplateField } from '../lib/templates';
import { usePublicSettings } from '../context/PublicSettingsContext';

interface LetterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: LetterTemplate | null;
}

type FormValues = Record<string, string | number>;

export const LetterFormModal: React.FC<LetterFormModalProps> = ({
  isOpen,
  onClose,
  template,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<FormValues>({});
  const settings = usePublicSettings();

  useEffect(() => {
    setStep(1);
    setValues({});
  }, [template?.id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !template) return null;

  const allFields = [
    ...template.fields.warga,
    ...template.fields.spesifik,
    ...template.fields.tambahan,
  ];

  const handleChange = (name: string, val: string | number) => {
    setValues((prev) => ({ ...prev, [name]: val }));
  };

  const isStep1Valid = (): boolean =>
    allFields
      .filter((f) => f.required)
      .every((f) => {
        const v = values[f.name];
        if (v === undefined || v === null || v === '') return false;
        if (f.maxLength && String(v).length !== f.maxLength) return false;
        return true;
      });

  const handlePrint = () => {
    // Pindahkan .printable-area ke body saat print agar terlepas dari
    // position:fixed + overflow:hidden milik modal (Chrome print engine
    // hanya render fixed-content di halaman pertama, & overflow:hidden
    // memotong konten yang overflow). Dipasang ulang via event 'afterprint'.
    const printableArea = document.querySelector(
      '.printable-area',
    ) as HTMLElement | null;

    if (printableArea) {
      const originalParent = printableArea.parentElement as HTMLElement;
      const originalNext = printableArea.nextSibling;
      document.body.appendChild(printableArea);

      const restore = () => {
        if (originalNext && originalNext.parentElement === originalParent) {
          originalParent.insertBefore(printableArea, originalNext);
        } else {
          originalParent.appendChild(printableArea);
        }
        window.removeEventListener('afterprint', restore);
      };
      window.addEventListener('afterprint', restore);
    }

    window.print();
    setStep(3);
  };

  const resetAndClose = () => {
    setValues({});
    setStep(1);
    onClose();
  };

  const formatDate = (iso: string): string => {
    if (!iso) return '-';
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ];
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  };

  const ROMAN_MONTHS = [
    'I', 'II', 'III', 'IV', 'V', 'VI',
    'VII', 'VIII', 'IX', 'X', 'XI', 'XII',
  ];

  const renderDisplayValue = (field: TemplateField, raw: string | number | undefined): string => {
    if (raw === undefined || raw === null || raw === '') return '-';
    if (field.type === 'date') return formatDate(String(raw));
    return String(raw);
  };

  const now = new Date();
  const bulanRomawi = ROMAN_MONTHS[now.getMonth()];
  const tahunTerbit = now.getFullYear();
  const nomorSurat = `${'\u00A0'.repeat(3)}/PPN/${bulanRomawi}/BUM/${tahunTerbit}`;

  const BULAN_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  const tanggalSurat = `${now.getDate()} ${BULAN_ID[now.getMonth()]} ${tahunTerbit}`;

  const toTitleCase = (s: string) =>
    s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  const namaNagori = toTitleCase(template.kop.nagori.replace('NAGORI ', ''));

  const pembuka = template.pembuka.replace(
    '{jabatanPangulu}',
    template.pejabat.jabatan,
  );

  const renderInput = (field: TemplateField) => {
    const val = values[field.name] ?? '';
    const base =
      'w-full rounded-lg border border-[#EDEDE9] bg-white px-3 py-2 text-sm font-body text-[#1A1A1A] placeholder:text-gray-400 focus:border-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] transition';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            className={base + ' min-h-[80px] resize-y'}
            placeholder={field.placeholder}
            required={field.required}
            value={String(val)}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
      case 'select':
        return (
          <select
            className={base}
            required={field.required}
            value={String(val)}
            onChange={(e) => handleChange(field.name, e.target.value)}
          >
            <option value="">-- Pilih --</option>
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            className={base}
            required={field.required}
            value={String(val)}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className={base}
            placeholder={field.placeholder}
            required={field.required}
            value={val as number | string}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
      case 'tel':
      case 'email':
        return (
          <input
            type={field.type}
            className={base}
            placeholder={field.placeholder}
            required={field.required}
            value={String(val)}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
      default:
        return (
          <input
            type="text"
            className={base}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={field.maxLength}
            value={String(val)}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  const renderFieldGroup = (title: string, subtitle: string, fields: TemplateField[]) => {
    if (fields.length === 0) return null;
    return (
      <div className="rounded-xl border border-[#EDEDE9] bg-white p-4 sm:p-5">
        <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-0.5">
          {title}
        </h4>
        <p className="font-body text-[11px] text-gray-500 mb-4">{subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="block font-body text-xs font-medium text-gray-700 mb-1.5">
                {f.label}
                {f.required && <span className="text-red-500 ml-0.5">*</span>}
                {f.maxLength && (
                  <span className="text-gray-400 text-[10px] ml-1">({f.maxLength} digit)</span>
                )}
              </label>
              {renderInput(f)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-fadeInUp">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-[#FCFCFC] sm:rounded-xl overflow-hidden flex flex-col border border-[#EDEDE9]">
        {/* Header (hidden on print via no-print) */}
        <div className="no-print flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#EDEDE9] bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[#1A1A1A]">
                {template.icon}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-body text-[10px] font-semibold tracking-widest text-gray-400 uppercase truncate">
                {template.kode}
              </p>
              <h3 className="font-headline text-sm sm:text-base font-semibold text-[#1A1A1A] truncate">
                {template.judul}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`w-6 h-1.5 rounded-full transition-all ${
                    step >= (n as 1 | 2 | 3)
                      ? 'bg-[#1A1A1A]'
                      : 'bg-[#EDEDE9]'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={resetAndClose}
              className="w-8 h-8 rounded-lg bg-[#F7F7F5] hover:bg-gray-100 flex items-center justify-center text-gray-600"
              aria-label="Tutup"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <div className="p-5 sm:p-6 space-y-4">
              {renderFieldGroup(
                'Data Pemohon',
                'Data diri sesuai KTP / Kartu Keluarga',
                template.fields.warga,
              )}
              {renderFieldGroup(
                'Detail Surat',
                'Informasi spesifik sesuai jenis surat yang diajukan',
                template.fields.spesifik,
              )}
              {renderFieldGroup(
                'Kontak & Keperluan',
                'Agar kami dapat menghubungi Anda jika diperlukan',
                template.fields.tambahan,
              )}
            </div>
          )}

          {step === 2 && (
            <div className="p-4 sm:p-6">
              <div
                className="printable-area letter-page bg-white p-8 sm:p-10 text-[#000000] text-[12pt]"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                  lineHeight: '1.5',
                }}
              >
                {/* Kop Surat */}
                <div className="letter-kop flex items-center border-b-2 border-black pb-2 mb-3">
                  <img
                    src={settings.logoUrl}
                    alt={`Logo ${settings.villageName}`}
                    className="w-20 h-20 object-contain flex-shrink-0 mr-4"
                  />
                  <div className="text-center flex-1">
                    <div className="text-[14pt] font-bold tracking-wide uppercase">
                      {template.kop.pemerintah}
                    </div>
                    <div className="text-[12pt] font-bold uppercase tracking-wider">
                      {template.kop.kecamatan} {template.kop.nagori}
                    </div>
                    <div className="text-[9pt] italic text-gray-700 mt-0.5">
                      Kecamatan Sidamanik, Kabupaten Simalungun, Sumatera Utara
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1.25fr] gap-8 mb-5">
                  <div className="space-y-0.5 text-[11pt]">
                    <div className="grid grid-cols-[5.2rem_1fr]">
                      <span>Nomor</span><span>: {nomorSurat}</span>
                    </div>
                    <div className="grid grid-cols-[5.2rem_1fr]">
                      <span>Sifat</span><span>: Penting</span>
                    </div>
                    <div className="grid grid-cols-[5.2rem_1fr]">
                      <span>Lampiran</span><span>: -</span>
                    </div>
                    <div className="grid grid-cols-[5.2rem_1fr] items-start">
                      <span>Perihal</span>
                      <span className="font-bold">: {template.judul}</span>
                    </div>
                  </div>
                  <div className="text-[11pt]">
                    <div className="text-right mb-4">{namaNagori}, {tanggalSurat}</div>
                    <div>Kepada Yth:</div>
                    <div className="font-bold">Yang Berkepentingan</div>
                    <div>di-</div>
                    <div className="pl-16">Tempat</div>
                  </div>
                </div>

                {/* Pembuka */}
                <p
                  className="text-[12pt] mb-2 text-justify"
                  style={{ textIndent: '1.27cm' }}
                >
                  {pembuka}
                </p>

                {/* Data Warga Table */}
                <table className="w-full border-collapse mb-2">
                  <tbody>
                    {allFields.map((f) => {
                      const raw = values[f.name];
                      if (raw === undefined || raw === null || raw === '') return null;
                      return (
                        <tr key={f.name} className="align-top">
                          <td className="py-[1px] pr-2 w-[38%] text-[11pt]">{f.label}</td>
                          <td className="py-[1px] pr-2 w-[2%] text-[11pt]">:</td>
                          <td className="py-[1px] text-[11pt]">{renderDisplayValue(f, raw)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Kalimat Penghubung */}
                <p
                  className="text-[12pt] mb-2 text-justify"
                  style={{ textIndent: '1.27cm' }}
                >
                  {template.kalimatPenghubung}
                </p>

                {/* Penutup */}
                <p
                  className="text-[12pt] mb-3 text-justify"
                  style={{ textIndent: '1.27cm' }}
                >
                  {template.kalimatPenutup}
                </p>

                {/* Tanda Tangan */}
                <div className="letter-ttd flex justify-end">
                  <div className="text-center w-64">
                    <div className="text-[11pt]" style={{ marginBottom: '3.5rem' }}>
                      {template.pejabat.jabatan}
                    </div>
                    <div className="text-[11pt] font-bold underline">
                      {template.pejabat.nama}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 sm:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-emerald-600">
                  check_circle
                </span>
              </div>
              <h3 className="font-headline text-xl font-semibold text-[#1A1A1A] mb-1">
                Surat Berhasil Disiapkan
              </h3>
              <p className="font-body text-sm text-gray-500 max-w-md mx-auto">
                Surat telah dikirim ke dialog cetak browser. Anda dapat menyimpannya sebagai PDF
                dengan memilih opsi &quot;Save as PDF&quot; pada dialog cetak.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="no-print border-t border-[#EDEDE9] bg-white px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => (step === 1 ? resetAndClose() : setStep((step - 1) as 1 | 2))}
            className="px-4 py-2 rounded-lg border border-[#EDEDE9] bg-white text-gray-700 text-xs font-medium hover:bg-gray-50"
          >
            {step === 1 ? 'Batal' : 'Kembali'}
          </button>

          {step === 1 && (
            <button
              disabled={!isStep1Valid()}
              onClick={() => setStep(2)}
              className="px-5 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-medium font-headline hover:bg-black transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <span>Lanjut ke Preview</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-medium font-headline hover:bg-black transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Cetak / Simpan PDF</span>
            </button>
          )}

          {step === 3 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setValues({});
                  setStep(1);
                }}
                className="px-4 py-2 rounded-lg border border-[#EDEDE9] bg-white text-gray-700 text-xs font-medium hover:bg-gray-50"
              >
                Buat Surat Lain
              </button>
              <button
                onClick={resetAndClose}
                className="px-5 py-2 rounded-lg bg-[#1A1A1A] text-white text-xs font-medium font-headline hover:bg-black transition"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
