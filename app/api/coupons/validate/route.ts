import { NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/admin-coupons'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const code = typeof body?.code === 'string' ? body.code : ''
    const subtotal = Number(body?.subtotal)
    const result = await validateCoupon(code, Number.isFinite(subtotal) ? subtotal : 0)
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ ok: false, error: 'Unable to validate coupon.' }, { status: 500 })
  }
}
