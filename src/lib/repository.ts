/**
 * Public data access layer.
 *
 * When `isSupabaseConfigured === true`, all reads go through Supabase using
 * the anon client (RLS enforced). When Supabase is not configured, the
 * repository functions resolve with `null` (caller should fall back to
 * bundled default data).
 *
 * Admin write operations (UPDATE/DELETE) are NOT exposed here — they go
 * through `src/lib/adminRepository.ts` which calls a server-side route
 * handler that uses the service-role key.
 */
import { supabase, isSupabaseConfigured } from './supabase';
import {
  NewsItem,
  VillageOfficial,
  VillageStat,
  SiteSettings,
} from '../types';

// ---------------------------------------------------------------------------
// Row → App mappers (DB uses snake_case, app uses camelCase)
// ---------------------------------------------------------------------------
type SiteSettingsRow = {
  village_name: string;
  logo_url: string | null;
  hero_title: string | null;
  hero_title_highlight: string | null;
  hero_subtitle: string | null;
  hero_bg_url: string | null;
  cta_title: string | null;
  cta_subtitle: string | null;
  cta_bg_url: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  contact_address: string | null;
  operating_hours: string | null;
  avg_service_time: string | null;
};

const LEGACY_HERO_TITLE = 'Tradisi Bertemu';
const LEGACY_HERO_HIGHLIGHT = 'Efisiensi.';
const LEGACY_HERO_SUBTITLE = 'Membangun masa depan Nagori Birong Ulu Manriah yang mandiri melalui integrasi teknologi tanpa meninggalkan akar budaya Simalungun.';

const toSiteSettings = (r: SiteSettingsRow): SiteSettings => ({
  villageName: r.village_name,
  logoUrl: r.logo_url ?? '',
  heroTitle: r.hero_title === LEGACY_HERO_TITLE ? 'Nagori' : r.hero_title ?? '',
  heroTitleHighlight: r.hero_title_highlight === LEGACY_HERO_HIGHLIGHT ? 'Birong Ulu Manriah.' : r.hero_title_highlight ?? '',
  heroSubtitle: r.hero_subtitle === LEGACY_HERO_SUBTITLE ? 'Kec. Sidamanik Kab. Simalungun' : r.hero_subtitle ?? '',
  heroBgUrl: r.hero_bg_url ?? '',
  ctaTitle: r.cta_title ?? '',
  ctaSubtitle: r.cta_subtitle ?? '',
  ctaBgUrl: r.cta_bg_url ?? '',
  contactPhone: r.contact_phone ?? '',
  contactEmail: r.contact_email ?? '',
  contactAddress: r.contact_address ?? '',
  operatingHours: r.operating_hours ?? '',
  avgServiceTime: r.avg_service_time ?? '',
});

type NewsRow = {
  id: string;
  title: string;
  category: string;
  date: string;
  snippet: string;
  content: string;
  image_url: string | null;
  image_alt: string | null;
  author: string | null;
  read_time: string | null;
  is_main: boolean;
};

const toNews = (r: NewsRow): NewsItem => ({
  id: r.id,
  title: r.title,
  category: r.category as NewsItem['category'],
  date: r.date,
  snippet: r.snippet,
  content: r.content,
  imageUrl: r.image_url ?? '',
  imageAlt: r.image_alt ?? '',
  author: r.author ?? '',
  readTime: r.read_time ?? '',
  isMain: r.is_main,
});

type VillageOfficialRow = {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  icon: string | null;
  phone: string | null;
  display_order: number;
};

const toVillageOfficial = (r: VillageOfficialRow): VillageOfficial => ({
  id: r.id,
  name: r.name,
  role: r.role,
  avatarUrl: r.avatar_url ?? undefined,
  icon: r.icon ?? undefined,
  phone: r.phone ?? '',
  displayOrder: r.display_order,
});

type VillageStatRow = {
  id: string;
  label: string;
  target_number: number;
  unit: string;
  description: string;
  icon: string | null;
  display_order: number;
};

const toVillageStat = (r: VillageStatRow): VillageStat => ({
  id: r.id,
  label: r.label,
  targetNumber: r.target_number,
  unit: r.unit,
  description: r.description,
  icon: r.icon ?? 'analytics',
  displayOrder: r.display_order,
});

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('site_settings_public')
    .select('*')
    .eq('id', 'singleton')
    .maybeSingle();
  if (error) {
    console.warn('[repository] getSiteSettings failed:', error.message);
    return null;
  }
  return data ? toSiteSettings(data as SiteSettingsRow) : null;
}

export async function getNews(): Promise<NewsItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[repository] getNews failed:', error.message);
    return null;
  }
  return (data as NewsRow[]).map(toNews);
}

export async function getVillageOfficials(): Promise<VillageOfficial[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('village_officials')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.warn('[repository] getVillageOfficials failed:', error.message);
    return null;
  }
  return (data as VillageOfficialRow[]).map(toVillageOfficial);
}

export async function getVillageStats(): Promise<VillageStat[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from('village_stats')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) {
    console.warn('[repository] getVillageStats failed:', error.message);
    return null;
  }
  return (data as VillageStatRow[]).map(toVillageStat);
}

export { toNews, toVillageOfficial, toVillageStat, toSiteSettings };
