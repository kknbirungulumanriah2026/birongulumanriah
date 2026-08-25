// app/(public)/layanan/page.tsx

'use client';

import React, { useState } from 'react';
import { TEMPLATES, LetterTemplate } from '@/src/lib/templates';
import { LetterFormModal } from '@/src/components/LetterFormModal';

export default function LayananPage() {
  const [activeTemplate, setActiveTemplate] = useState<LetterTemplate | null>(null);

  return (
    <section className="w-full py-20 sm:py-28 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="max-w-2xl mb-12">
        <span className="font-body text-[11px] font-semibold text-gray-400 tracking-widest uppercase block mb-1">
          Layanan Mandiri 24 Jam
        </span>
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1A1A1A] tracking-tight mb-3">
          Surat Keterangan Nagori
        </h1>
        <p className="font-body text-sm sm:text-base text-gray-500 leading-relaxed">
          Ajukan surat keterangan resmi Nagori Birong Ulu Manriah secara daring.
          Isi formulir, tinjau preview, lalu cetak atau simpan sebagai PDF — tanpa
          perlu antre di kantor Nagori.
        </p>
      </div>

      {/* Panduan singkat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: 'touch_app', title: 'Pilih Jenis Surat', desc: 'Klik kartu jenis surat yang Anda butuhkan di bawah.' },
          { icon: 'edit_note', title: 'Isi Data Lengkap', desc: 'Lengkapi formulir sesuai KTP / KK dengan teliti.' },
          { icon: 'print', title: 'Cetak / PDF', desc: 'Preview langsung dan cetak atau simpan sebagai PDF.' },
        ].map((s) => (
          <div
            key={s.title}
            className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#EDEDE9]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px] text-[#1A1A1A]">
                {s.icon}
              </span>
            </div>
            <div>
              <h3 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-0.5">
                {s.title}
              </h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((t) => (
          <article
            key={t.id}
            className="flex flex-col justify-between bg-white p-5 sm:p-6 rounded-xl border border-[#EDEDE9] hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F7F7F5] border border-[#EDEDE9] flex items-center justify-center group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl text-[#1A1A1A] group-hover:text-white">
                    {t.icon}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-[#F7F7F5] border border-[#EDEDE9] font-body text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
                  {t.kode}
                </span>
              </div>

              <h3 className="font-headline text-lg font-semibold text-[#1A1A1A] leading-snug mb-1.5">
                {t.judul}
              </h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed mb-4">
                {t.deskripsi}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
                <span className="material-symbols-outlined text-[16px] text-gray-400">
                  schedule
                </span>
                <span>Estimasi {t.estimasi}</span>
              </div>

              <div className="border-t border-[#EDEDE9] pt-3 mb-4">
                <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-2">
                  Persyaratan
                </p>
                <ul className="space-y-1.5">
                  {t.persyaratan.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 font-body text-xs text-gray-600 leading-relaxed"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 mt-0.5 flex-shrink-0">
                        check_circle
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setActiveTemplate(t)}
              className="w-full mt-2 flex items-center justify-center gap-1.5 bg-[#1A1A1A] text-white px-4 py-2.5 rounded-lg font-headline text-xs font-medium hover:bg-black transition-all cursor-pointer"
            >
              <span>Buat Surat</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </article>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-[#F7F7F5] border border-[#EDEDE9] rounded-xl p-5 flex items-start gap-3">
        <span className="material-symbols-outlined text-xl text-gray-500 flex-shrink-0 mt-0.5">
          info
        </span>
        <div>
          <h4 className="font-headline text-sm font-semibold text-[#1A1A1A] mb-0.5">
            Catatan Penting
          </h4>
          <p className="font-body text-xs text-gray-600 leading-relaxed">
            Surat yang dicetak melalui portal ini merupakan draf resmi. Untuk
            pengesahan akhir (tanda tangan basah + stempel Nagori), silakan
            membawa hasil cetakan beserta dokumen persyaratan ke Kantor Nagori
            Birong Ulu Manriah pada jam kerja.
          </p>
        </div>
      </div>

      <LetterFormModal
        isOpen={!!activeTemplate}
        onClose={() => setActiveTemplate(null)}
        template={activeTemplate}
      />
    </section>
  );
}
