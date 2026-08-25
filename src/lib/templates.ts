// src/lib/templates.ts

import skuTemplate from '../data/templates/sku.json';
import domisiliTemplate from '../data/templates/domisili.json';
import sktmTemplate from '../data/templates/sktm.json';
import skckTemplate from '../data/templates/skck.json';
import bedaNamaTemplate from '../data/templates/beda-nama.json';

export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'tel' | 'email';
  placeholder?: string;
  options?: string[];
  required: boolean;
  maxLength?: number;
}

export interface LetterTemplate {
  id: string;
  kodeSurat: string;
  kode: string;
  judul: string;
  deskripsi: string;
  icon: string;
  kop: {
    pemerintah: string;
    kecamatan: string;
    nagori: string;
  };
  estimasi: string;
  persyaratan: string[];
  fields: {
    warga: TemplateField[];
    spesifik: TemplateField[];
    tambahan: TemplateField[];
  };
  pembuka: string;
  kalimatPenghubung: string;
  kalimatPenutup: string;
  pejabat: {
    nama: string;
    jabatan: string;
  };
}

export const TEMPLATES: LetterTemplate[] = [
  skuTemplate as LetterTemplate,
  domisiliTemplate as LetterTemplate,
  sktmTemplate as LetterTemplate,
  skckTemplate as LetterTemplate,
  bedaNamaTemplate as LetterTemplate,
];

export function getTemplateById(id: string): LetterTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplateByKodeSurat(kodeSurat: string): LetterTemplate | undefined {
  return TEMPLATES.find((t) => t.kodeSurat === kodeSurat);
}
