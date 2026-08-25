// src/types.ts

export interface SiteSettings {
  id?: string;
  villageName: string;
  logoUrl: string;
  avgServiceTime: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBgUrl: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBgUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  operatingHours: string;
  created_at?: string;
  updated_at?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Agenda Nagori' | 'Agenda Desa' | 'Publik' | 'UMKM' | 'Transparansi';
  date: string;
  snippet: string;
  content: string;
  imageUrl: string;
  imageAlt?: string;
  author: string;
  readTime?: string;
  isMain: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VillageStat {
  id?: string;
  label: string;
  targetNumber: number;
  unit: string;
  description: string;
  icon: string;
  displayOrder?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VillageOfficial {
  id?: string;
  name: string;
  role: string;
  icon?: string;
  phone: string;
  avatarUrl?: string | null;
  displayOrder?: number;
  created_at?: string;
  updated_at?: string;
}
