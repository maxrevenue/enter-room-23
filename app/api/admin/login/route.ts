import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'

function originFrom(request: Request) {
  const url = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || url.host
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
  return `${proto}://${host}`
}

export async function POST(request: Request) {
  const form = await request.formData()
  const password = String(form.get('password') || '')
  const expected = await resolveAdminPassword()
  const valid = await verifyAdminPassword(password, expected)

  console.info(
    JSON.stringify({
      scope: 'admin-login',
      hasSecret: Boolean(expected),
      secretLength: expected.length,
      inputLength: password.trim().length,
      match: valid,
    }),
  )

  if (!valid) {
    return NextResponse.redirect(new URL('/admin/login?error=1', originFrom(request)), 303)
  }

  const token = await createAdminSessionToken(expected)
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login?error=1', originFrom(request)), 303)
  }

  const response = NextResponse.redirect(new URL('/admin', originFrom(request)), 303)
  response.cookies.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions())
  return response
}
