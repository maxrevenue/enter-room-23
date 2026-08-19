import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { csvAttachment, csvFilename, listProductsForExport, productsToCsv } from '@/lib/admin-analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!authed) {
    return NextResponse.redirect(new URL('/admin/login', request.url), 303)
  }

  const products = await listProductsForExport()
  return csvAttachment(csvFilename('room23-products'), productsToCsv(products))
}
