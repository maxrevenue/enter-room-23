import { VALID_PROMO_CODES } from '@/lib/promos'
import { getRoom23Db } from '@/lib/admin-db'

export const COUPON_TYPES = ['percent', 'fixed'] as const
export type CouponType = (typeof COUPON_TYPES)[number]

export type AdminCoupon = {
  code: string
  type: CouponType
  value: number
  minOrder?: number | null
  usageLimit?: number | null
  usedCount: number
  expiresAt?: Date | string | null
  active: boolean
  note?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type CouponValidationSuccess = {
  ok: true
  discountAmount: number
  coupon: AdminCoupon
}

export type CouponValidationFailure = {
  ok: false
  error: string
}

export type CouponValidationResult = CouponValidationSuccess | CouponValidationFailure

export function normalizeCouponCode(code?: string | null) {
  return String(code || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
}

export function isCouponType(value: string): value is CouponType {
  return (COUPON_TYPES as readonly string[]).includes(value)
}

export function formatCouponValue(coupon: Pick<AdminCoupon, 'type' | 'value'>) {
  if (coupon.type === 'percent') return `${Number(coupon.value)}%`
  return `$${Number(coupon.value).toFixed(2)}`
}

export function couponExpiryDate(value?: Date | string | null) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function computeCouponDiscount(coupon: Pick<AdminCoupon, 'type' | 'value'>, subtotal: number) {
  const total = Number(subtotal)
  const amount = Number(coupon.value)
  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(amount) || amount <= 0) return 0
  if (coupon.type === 'percent') return Math.min(total, (total * amount) / 100)
  return Math.min(total, amount)
}

export function evaluateCoupon(
  coupon: AdminCoupon | null | undefined,
  subtotal: number,
  now = new Date(),
): CouponValidationResult {
  if (!coupon || !coupon.code) {
    return { ok: false, error: 'Invalid coupon code.' }
  }
  if (coupon.active === false) {
    return { ok: false, error: 'This coupon is no longer active.' }
  }
  const expiresAt = couponExpiryDate(coupon.expiresAt)
  if (expiresAt && expiresAt.getTime() < now.getTime()) {
    return { ok: false, error: 'This coupon has expired.' }
  }
  const usageLimit = coupon.usageLimit
  if (typeof usageLimit === 'number' && Number.isFinite(usageLimit) && coupon.usedCount >= usageLimit) {
    return { ok: false, error: 'This coupon has reached its usage limit.' }
  }
  const minOrder = coupon.minOrder
  if (typeof minOrder === 'number' && Number.isFinite(minOrder) && Number(subtotal) < minOrder) {
    return { ok: false, error: `Order must be at least $${minOrder.toFixed(2)} to use this coupon.` }
  }
  return {
    ok: true,
    discountAmount: computeCouponDiscount(coupon, subtotal),
    coupon,
  }
}

function legacyCoupon(code: string): AdminCoupon | null {
  const percent = (VALID_PROMO_CODES as Record<string, number>)[code]
  if (typeof percent !== 'number' || !Number.isFinite(percent) || percent <= 0) return null
  return {
    code,
    type: 'percent',
    value: percent,
    minOrder: null,
    usageLimit: null,
    usedCount: 0,
    expiresAt: null,
    active: true,
    note: 'Legacy storefront code',
  }
}

export async function listAdminCoupons(): Promise<AdminCoupon[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db.collection<AdminCoupon>('coupons').find({}).sort({ code: 1 }).toArray()
}

export async function getAdminCoupon(code: string): Promise<AdminCoupon | null> {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return null
  const db = await getRoom23Db()
  if (!db) return null
  return db.collection<AdminCoupon>('coupons').findOne({ code: normalized })
}

export async function getCouponForValidation(code: string): Promise<AdminCoupon | null> {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return null
  return (await getAdminCoupon(normalized)) || legacyCoupon(normalized)
}

export async function validateCoupon(code: string, subtotal: number, now = new Date()): Promise<CouponValidationResult> {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return { ok: false, error: 'Enter a valid coupon code.' }
  const coupon = await getCouponForValidation(normalized)
  return evaluateCoupon(coupon, subtotal, now)
}

export async function incrementCouponUsage(code: string) {
  const normalized = normalizeCouponCode(code)
  if (!normalized) return
  const db = await getRoom23Db()
  if (!db) return
  await db.collection('coupons').updateOne(
    { code: normalized },
    { $inc: { usedCount: 1 }, $set: { updatedAt: new Date() } },
  )
}
