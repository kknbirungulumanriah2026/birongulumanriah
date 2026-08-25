/**
 * Admin mutation client.
 *
 * All writes are routed through `/api/admin`. The server validates the
 * signed, HttpOnly admin session and uses the Supabase service-role key.
 */
import { NewsItem, SiteSettings, VillageOfficial, VillageStat } from '../types';
import {
  getNews,
  getSiteSettings,
  getVillageOfficials,
  getVillageStats,
} from './repository';

type Resource = 'site_settings' | 'news' | 'village_officials' | 'village_stats';

async function request(resource: Resource, operation: 'upsert' | 'delete', data?: unknown, id?: string) {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ resource, operation, data, id }),
  });
  const result = (await response.json().catch(() => ({}))) as { error?: string };
  if (!response.ok) throw new Error(result.error ?? 'Permintaan admin gagal.');
}

export const adminGetSiteSettings = getSiteSettings;
export async function adminGetNews(): Promise<NewsItem[]> { return (await getNews()) ?? []; }
export async function adminGetVillageStats(): Promise<VillageStat[]> { return (await getVillageStats()) ?? []; }
export async function adminGetVillageOfficials(): Promise<VillageOfficial[]> { return (await getVillageOfficials()) ?? []; }

export async function adminUpdateSiteSettings(settings: SiteSettings, _legacyPasscode?: string) {
  await request('site_settings', 'upsert', settings);
}
export async function adminUpsertNews(news: NewsItem, _legacyPasscode?: string) {
  await request('news', 'upsert', news);
}
export async function adminDeleteNews(id: string, _legacyPasscode?: string) {
  await request('news', 'delete', undefined, id);
}
export async function adminUpsertVillageOfficial(official: VillageOfficial, _legacyPasscode?: string) {
  await request('village_officials', 'upsert', official);
}
export async function adminDeleteVillageOfficial(id: string, _legacyPasscode?: string) {
  await request('village_officials', 'delete', undefined, id);
}
export async function adminSyncVillageStats(stats: VillageStat[], _legacyPasscode?: string) {
  await Promise.all(stats.map((stat, displayOrder) =>
    request('village_stats', 'upsert', { ...stat, displayOrder })
  ));
}
export async function adminUpsertVillageStat(stat: VillageStat) {
  await request('village_stats', 'upsert', stat);
}
export async function adminDeleteVillageStat(id: string) {
  await request('village_stats', 'delete', undefined, id);
}
