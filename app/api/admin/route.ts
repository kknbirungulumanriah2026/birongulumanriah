import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'sidodadi_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const resources = ['site_settings', 'news', 'village_officials', 'village_stats'] as const;
type Resource = (typeof resources)[number];
type Operation = 'upsert' | 'delete' | 'login' | 'change_password';

interface AdminRequest {
  resource?: Resource;
  operation: Operation;
  id?: string;
  data?: Record<string, unknown>;
  passcode?: string;
  currentPasscode?: string;
  newPasscode?: string;
}

let cachedAdminClient: SupabaseClient | null = null;

function requiredEnv(name: 'ADMIN_PASSCODE' | 'ADMIN_SESSION_SECRET'): string | null {
  const value = process.env[name];
  return value && value.length >= 16 ? value : null;
}

function sign(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

function isHttpsRequest(request: NextRequest) {
  return request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
}

function validSession(request: NextRequest) {
  const secret = requiredEnv('ADMIN_SESSION_SECRET');
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!secret || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  const expected = sign(`admin:${expires}`, secret);
  const supplied = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return supplied.length === expectedBuffer.length && timingSafeEqual(supplied, expectedBuffer);
}

function getAdminClient(): SupabaseClient | null {
  if (cachedAdminClient) return cachedAdminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  cachedAdminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return cachedAdminClient;
}

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const scrypt = promisify(scryptCallback);

async function hashPasscode(passcode: string, salt = randomBytes(16)) {
  const hash = await scrypt(passcode, salt, 64) as Buffer;
  return { hash: hash.toString('hex'), salt: salt.toString('hex') };
}

async function matchesHash(passcode: string, hash: string, salt: string) {
  const derived = await hashPasscode(passcode, Buffer.from(salt, 'hex'));
  const expected = Buffer.from(hash, 'hex');
  const received = Buffer.from(derived.hash, 'hex');
  return expected.length === received.length && timingSafeEqual(expected, received);
}

async function getStoredPasscode(admin: SupabaseClient) {
  const { data, error } = await admin
    .from('admin_credentials')
    .select('password_hash, password_salt')
    .eq('id', 'singleton')
    .maybeSingle();
  if (error) {
    // Existing deployments can still use ADMIN_PASSCODE until migration 0006 is applied.
    if (error.code === '42P01' || error.code === 'PGRST205') return null;
    throw error;
  }
  return data as { password_hash: string; password_salt: string } | null;
}

async function verifyPasscode(candidate: string, admin: SupabaseClient) {
  const stored = await getStoredPasscode(admin);
  if (stored) return matchesHash(candidate, stored.password_hash, stored.password_salt);
  const configured = requiredEnv('ADMIN_PASSCODE');
  if (!configured) return false;
  const expected = Buffer.from(configured);
  const received = Buffer.from(candidate);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function setSessionCookie(response: NextResponse, request: NextRequest, secret: string) {
  const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
  response.cookies.set(SESSION_COOKIE, `${expires}.${sign(`admin:${expires}`, secret)}`, { httpOnly: true, sameSite: 'strict', secure: isHttpsRequest(request), path: '/', maxAge: SESSION_TTL_SECONDS });
}

function requiredText(value: unknown, field: string) {
  const result = text(value);
  if (!result) throw new Error(`${field} wajib diisi`);
  return result;
}

function normalizeNews(data: Record<string, unknown>) {
  return { id: requiredText(data.id, 'id'), title: requiredText(data.title, 'title'), category: requiredText(data.category, 'category'), date: requiredText(data.date, 'date'), snippet: requiredText(data.snippet, 'snippet'), content: requiredText(data.content, 'content'), image_url: text(data.imageUrl) || null, image_alt: text(data.imageAlt) || null, author: text(data.author) || null, read_time: text(data.readTime) || null, is_main: Boolean(data.isMain) };
}
function normalizeOfficial(data: Record<string, unknown>) {
  return { id: text(data.id) || undefined, name: requiredText(data.name, 'name'), role: requiredText(data.role, 'role'), avatar_url: text(data.avatarUrl) || null, icon: text(data.icon) || null, phone: text(data.phone) || null, display_order: Number.isSafeInteger(Number(data.displayOrder)) ? Number(data.displayOrder) : 0 };
}
function normalizeStat(data: Record<string, unknown>) {
  const targetNumber = Number(data.targetNumber);
  if (!Number.isFinite(targetNumber)) throw new Error('targetNumber harus berupa angka');
  return { id: text(data.id) || undefined, label: requiredText(data.label, 'label'), target_number: targetNumber, unit: requiredText(data.unit, 'unit'), description: requiredText(data.description, 'description'), icon: text(data.icon) || null, display_order: Number.isSafeInteger(Number(data.displayOrder)) ? Number(data.displayOrder) : 0 };
}
function normalizeSiteSettings(data: Record<string, unknown>) {
  return { id: 'singleton', village_name: requiredText(data.villageName, 'villageName'), logo_url: text(data.logoUrl) || null, hero_title: text(data.heroTitle) || null, hero_title_highlight: text(data.heroTitleHighlight) || null, hero_subtitle: text(data.heroSubtitle) || null, hero_bg_url: text(data.heroBgUrl) || null, cta_title: text(data.ctaTitle) || null, cta_subtitle: text(data.ctaSubtitle) || null, cta_bg_url: text(data.ctaBgUrl) || null, contact_phone: text(data.contactPhone) || null, contact_email: text(data.contactEmail) || null, contact_address: text(data.contactAddress) || null, operating_hours: text(data.operatingHours) || null, footer_description: text(data.footerDescription) || null, vision: text(data.vision) || null, mission: text(data.mission) || null, avg_service_time: text(data.avgServiceTime) || null };
}

async function dispatch(body: Required<Pick<AdminRequest, 'resource' | 'operation'>> & AdminRequest, admin: SupabaseClient) {
  const { resource, operation, id, data = {} } = body;
  if (operation === 'delete') {
    if (!id) throw new Error('id wajib diisi untuk menghapus data');
    const { error } = await admin.from(resource).delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const row = resource === 'site_settings' ? normalizeSiteSettings(data) : resource === 'news' ? normalizeNews(data) : resource === 'village_officials' ? normalizeOfficial(data) : normalizeStat(data);
  // `resource` is runtime-dispatched after validation, so Supabase cannot
  // infer a single table row type here.
  const { error } = await admin.from(resource).upsert(row as never);
  if (error) throw error;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as AdminRequest | null;
  if (!body) return NextResponse.json({ error: 'JSON tidak valid.' }, { status: 400 });

  if (body.operation === 'login') {
    const secret = requiredEnv('ADMIN_SESSION_SECRET');
    const admin = getAdminClient();
    if (!secret || !admin) return NextResponse.json({ error: 'Konfigurasi keamanan admin belum lengkap di server.' }, { status: 503 });
    const candidate = body.passcode ?? '';
    if (!(await verifyPasscode(candidate, admin))) return NextResponse.json({ error: 'Kata sandi admin tidak valid.' }, { status: 401 });
    const response = NextResponse.json({ ok: true });
    setSessionCookie(response, request, secret);
    return response;
  }

  if (!validSession(request)) return NextResponse.json({ error: 'Sesi admin tidak valid atau telah berakhir.' }, { status: 401 });
  if (body.operation === 'change_password') {
    const admin = getAdminClient();
    const secret = requiredEnv('ADMIN_SESSION_SECRET');
    const currentPasscode = body.currentPasscode ?? '';
    const newPasscode = body.newPasscode ?? '';
    if (!admin || !secret) return NextResponse.json({ error: 'Konfigurasi keamanan admin belum lengkap di server.' }, { status: 503 });
    if (newPasscode.length < 12) return NextResponse.json({ error: 'Kata sandi baru minimal 12 karakter.' }, { status: 400 });
    try {
      if (!(await verifyPasscode(currentPasscode, admin))) return NextResponse.json({ error: 'Kata sandi saat ini tidak valid.' }, { status: 401 });
      const { hash, salt } = await hashPasscode(newPasscode);
      const { error } = await admin.from('admin_credentials').upsert({ id: 'singleton', password_hash: hash, password_salt: salt });
      if (error) throw error;
      const response = NextResponse.json({ ok: true });
      setSessionCookie(response, request, secret);
      return response;
    } catch (error) {
      console.error('[api/admin] change_password', error instanceof Error ? error.message : error);
      if (error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === 'PGRST205') {
        return NextResponse.json({ error: 'Tabel keamanan belum tersedia di Supabase. Terapkan migration 0006_admin_credentials.sql terlebih dahulu.' }, { status: 503 });
      }
      return NextResponse.json({ error: 'Penggantian kata sandi gagal. Pastikan migrasi keamanan sudah diterapkan.' }, { status: 503 });
    }
  }
  if (!body.resource || !resources.includes(body.resource) || !['upsert', 'delete'].includes(body.operation)) return NextResponse.json({ error: 'Operasi admin tidak valid.' }, { status: 400 });
  const admin = getAdminClient();
  if (!admin) return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.' }, { status: 503 });
  try {
    await dispatch(body as Required<Pick<AdminRequest, 'resource' | 'operation'>> & AdminRequest, admin);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kesalahan tidak diketahui';
    console.error('[api/admin]', body.resource, body.operation, message);
    return NextResponse.json({ error: `Operasi gagal: ${message}` }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  if (!validSession(request)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const expires = Number(request.cookies.get(SESSION_COOKIE)?.value.split('.')[0]);
  return NextResponse.json({ authenticated: true, expiresAt: expires });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 });
  return response;
}
