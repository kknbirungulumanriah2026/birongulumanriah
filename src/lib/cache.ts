/**
 * Tiny TTL cache backed by localStorage.
 *
 * - `readCache` returns the cached value (or null) so callers can pre-populate
 *   state synchronously and avoid a flash of empty UI before the network fetch.
 * - `writeCache` is called after a successful Supabase fetch, so the next page
 *   load with no/limited network still has data to show.
 * - Entries auto-expire after `MAX_AGE_MS`. A separate `FRESH_MS` lets the
 *   repository short-circuit fetches when the cache is still fresh.
 */
const PREFIX = 'portal:cache:v1:';
const FRESH_MS = 5 * 60 * 1000;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type CacheEnvelope<T> = {
  ts: number;
  data: T;
};

function safeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCache<T>(key: string): T | null {
  const ls = safeLocalStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(PREFIX + key);
    if (!raw) return null;
    const env = JSON.parse(raw) as CacheEnvelope<T>;
    if (!env || typeof env.ts !== 'number') return null;
    if (Date.now() - env.ts > MAX_AGE_MS) return null;
    return env.data;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    const env: CacheEnvelope<T> = { ts: Date.now(), data };
    ls.setItem(PREFIX + key, JSON.stringify(env));
  } catch {
    // ignore quota errors or disabled storage
  }
}

export function isCacheFresh(key: string): boolean {
  const ls = safeLocalStorage();
  if (!ls) return false;
  try {
    const raw = ls.getItem(PREFIX + key);
    if (!raw) return false;
    const env = JSON.parse(raw) as CacheEnvelope<unknown>;
    if (!env || typeof env.ts !== 'number') return false;
    return Date.now() - env.ts <= FRESH_MS;
  } catch {
    return false;
  }
}

export function clearCache(key: string): void {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}