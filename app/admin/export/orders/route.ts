import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  csvAttachment,
  csvFilename,
  listOrdersForExport,
  ordersToCsv,
} from '@/lib/admin-analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!authed) {
    return NextResponse.redirect(new URL('/admin/login', request.url), 303)
  }

  const { searchParams } = new URL(request.url)
  const orders = await listOrdersForExport({
    status: searchParams.get('status'),
    from: searchParams.get('from'),
    to: searchParams.get('to'),
  })

  return csvAttachment(csvFilename('room23-orders'), ordersToCsv(orders))
}
