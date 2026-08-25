import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'sidodadi_admin_session';

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function isValidSession(request: NextRequest) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || secret.length < 16 || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) <= Date.now()) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`admin:${expires}`)));
  let provided: Uint8Array;
  try { provided = fromBase64Url(signature); } catch { return false; }
  if (provided.length !== expected.length) return false;
  return expected.every((byte, index) => byte === provided[index]);
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next();
  if (await isValidSession(request)) return NextResponse.next();
  const login = new URL('/admin/login', request.url);
  login.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ['/admin/:path*'] };
