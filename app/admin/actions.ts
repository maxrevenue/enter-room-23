'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get('password') || '')
  const expected = await resolveAdminPassword()
  const valid = await verifyAdminPassword(password, expected)

  if (!valid) {
    redirect('/admin/login?error=1')
  }

  const token = await createAdminSessionToken(expected)
  if (!token) {
    redirect('/admin/login?error=1')
  }

  const jar = await cookies()
  jar.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions())
  redirect('/admin')
}

export async function logoutAdmin() {
  const jar = await cookies()
  jar.set(ADMIN_COOKIE_NAME, '', { ...getAdminCookieOptions(), maxAge: 0 })
  jar.delete({ name: ADMIN_COOKIE_NAME, path: '/' })
  redirect('/admin/login')
}
