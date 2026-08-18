/**
 * Minimal admin password gate.
 * Edge-safe (Web Crypto only). Do not import next/headers here —
 * middleware must be able to reuse these helpers.
 */

export const ADMIN_COOKIE_NAME = 'room23_admin'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SESSION_PAYLOAD = 'room23-admin-v1'

type CookieReader = {
  get: (name: string) => { value: string } | undefined
}

export function getAdminPassword(): string {
  const key = 'ADMIN_PASSWORD'
  const value = process.env[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function hasAdminSessionCookie(cookieStore: CookieReader): boolean {
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  return typeof token === 'string' && /^[0-9a-f]{64}$/.test(token)
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder()
  const bufA = encoder.encode(a)
  const bufB = encoder.encode(b)
  const len = Math.max(bufA.length, bufB.length)
  let mismatch = bufA.length ^ bufB.length
  for (let i = 0; i < len; i += 1) {
    mismatch |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0)
  }
  return mismatch === 0
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyBytes = encoder.encode(secret)
  if (keyBytes.byteLength === 0) return ''

  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function createAdminSessionToken(password = getAdminPassword()): Promise<string> {
  if (!password) return ''
  return hmacHex(SESSION_PAYLOAD, password)
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
  password = getAdminPassword(),
): Promise<boolean> {
  if (!token || !password) return false
  const expected = await createAdminSessionToken(password)
  if (!expected) return false
  return timingSafeEqual(token, expected)
}

export async function verifyAdminPassword(
  input: string,
  expected = getAdminPassword(),
): Promise<boolean> {
  const password = input.trim()
  const secret = expected.trim()
  if (!secret || !password) return false
  const [left, right] = await Promise.all([hmacHex(password, secret), hmacHex(secret, secret)])
  return timingSafeEqual(left, right)
}

export async function isAdminAuthenticated(
  cookieStore: CookieReader,
  password = getAdminPassword(),
): Promise<boolean> {
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value, password)
}

export function isAdminPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  return pathname === '/admin' || pathname.startsWith('/admin/')
}
