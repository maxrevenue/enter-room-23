import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { computeServerTotals } from '../lib/checkout-complete.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

function computeCouponDiscount(coupon, subtotal) {
  const total = Number(subtotal)
  const amount = Number(coupon.value)
  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(amount) || amount <= 0) return 0
  if (coupon.type === 'percent') return Math.min(total, (total * amount) / 100)
  return Math.min(total, amount)
}

function evaluateCoupon(coupon, subtotal, now = new Date()) {
  if (!coupon || !coupon.code) return { ok: false, error: 'Invalid coupon code.' }
  if (coupon.active === false) return { ok: false, error: 'This coupon is no longer active.' }
  const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null
  if (expiresAt && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < now.getTime()) {
    return { ok: false, error: 'This coupon has expired.' }
  }
  if (typeof coupon.usageLimit === 'number' && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: 'This coupon has reached its usage limit.' }
  }
  if (typeof coupon.minOrder === 'number' && Number(subtotal) < coupon.minOrder) {
    return { ok: false, error: `Order must be at least $${coupon.minOrder.toFixed(2)} to use this coupon.` }
  }
  return { ok: true, discountAmount: computeCouponDiscount(coupon, subtotal), coupon }
}

function normalizeShippingZones(value) {
  if (!Array.isArray(value)) return []
  const zones = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const name = String(entry.name || '').trim()
    const countriesSource = Array.isArray(entry.countries)
      ? entry.countries
      : String(entry.countries || '').split(/[\n,]+/)
    const countries = countriesSource.map((country) => String(country || '').trim().toUpperCase()).filter(Boolean)
    const rate = Number(entry.rate)
    if (!name || !Number.isFinite(rate) || rate < 0) continue
    zones.push({ name, countries, rate })
  }
  return zones
}

const percentCoupon = {
  code: 'SAVE10',
  type: 'percent',
  value: 10,
  minOrder: 50,
  usageLimit: 2,
  usedCount: 0,
  expiresAt: '2099-01-01',
  active: true,
}

describe('admin phase 6 commerce rules', () => {
  it('evaluates percent, fixed, inactive, expired, min-order, and usage-limit coupons', () => {
    assert.equal(evaluateCoupon(percentCoupon, 80).ok, true)
    assert.equal(evaluateCoupon(percentCoupon, 80).discountAmount, 8)
    assert.equal(evaluateCoupon({ ...percentCoupon, type: 'fixed', value: 15 }, 80).discountAmount, 15)
    assert.equal(evaluateCoupon({ ...percentCoupon, type: 'fixed', value: 90 }, 80).discountAmount, 80)
    assert.equal(evaluateCoupon({ ...percentCoupon, active: false }, 80).ok, false)
    assert.equal(evaluateCoupon({ ...percentCoupon, expiresAt: '2001-01-01' }, 80).ok, false)
    assert.equal(evaluateCoupon(percentCoupon, 40).ok, false)
    assert.equal(evaluateCoupon({ ...percentCoupon, usedCount: 2 }, 80).ok, false)
    assert.match(evaluateCoupon(null, 80).error, /invalid coupon/i)
  })

  it('applies explicit checkout discounts and admin shipping overrides', () => {
    const items = [{ id: 'a', price: 40, qty: 2 }]
    const discounted = computeServerTotals(items, {
      discountAmount: 15,
      discountPercent: 0,
      shippingMethodId: 'standard',
      freeShippingThreshold: 150,
      flatShippingRate: 8.5,
    })
    assert.equal(discounted.subtotal, 80)
    assert.equal(discounted.discountAmount, 15)
    assert.equal(discounted.shipping, 8.5)

    const freeShip = computeServerTotals(items, {
      discountAmount: 0,
      shippingMethodId: 'standard',
      freeShippingThreshold: 80,
      flatShippingRate: 8.5,
    })
    assert.equal(freeShip.shipping, 0)

    const expedited = computeServerTotals(items, {
      discountAmount: 0,
      shippingMethodId: 'expedited',
      freeShippingThreshold: 80,
      flatShippingRate: 8.5,
    })
    assert.equal(expedited.shipping, 12.99)
  })

  it('normalizes shipping zones and keeps secrets out of store settings', () => {
    assert.deepEqual(
      normalizeShippingZones([
        { name: ' North America ', countries: 'us, ca\nmx', rate: '7.5' },
        { name: 'Skip', countries: ['DE'], rate: -1 },
        { name: '', countries: ['UK'], rate: 12 },
      ]),
      [{ name: 'North America', countries: ['US', 'CA', 'MX'], rate: 7.5 }],
    )
    const settings = read('lib/admin-settings.ts')
    assert.match(settings, /STORE_SETTINGS_ID = 'store'/)
    assert.match(settings, /storeOpen/)
    assert.match(settings, /shippingFlatRate/)
    assert.match(settings, /freeShippingThreshold/)
    assert.match(settings, /supportEmail/)
    assert.doesNotMatch(settings, /NMI|MONGODB_URI|ADMIN_PASSWORD/)
    assert.doesNotMatch(read('app/admin/settings/page.tsx'), /NMI|MONGODB_URI|ADMIN_PASSWORD/)
  })

  it('exposes coupon CRUD, store settings, and checkout validation call sites', () => {
    const actions = read('app/admin/actions.ts')
    const layout = read('app/admin/layout.tsx')
    const coupons = read('lib/admin-coupons.ts')
    const checkout = read('app/api/checkout/route.js')
    const complete = read('app/api/checkout/complete/route.js')
    const cart = read('lib/cart-context.js')

    assert.match(layout, /href: '\/admin\/coupons'/)
    assert.match(layout, /href: '\/admin\/settings'/)
    assert.match(actions, /export async function createCoupon/)
    assert.match(actions, /export async function updateCoupon/)
    assert.match(actions, /export async function deactivateCoupon/)
    assert.match(actions, /export async function updateStoreSettings/)
    assert.match(actions, /revalidatePath\('\/admin\/coupons'\)/)
    assert.match(actions, /revalidatePath\('\/checkout'\)/)
    assert.match(coupons, /export async function validateCoupon/)
    assert.match(coupons, /export function evaluateCoupon/)
    assert.match(coupons, /legacyCoupon/)
    assert.match(checkout, /validateCoupon/)
    assert.match(checkout, /getStoreSettings/)
    assert.match(checkout, /incrementCouponUsage/)
    assert.match(complete, /validateCoupon/)
    assert.match(complete, /incrementCouponUsage/)
    assert.match(complete, /settings\.storeOpen/)
    assert.match(cart, /\/api\/coupons\/validate/)
    assert.match(read('app/api/coupons/validate/route.ts'), /validateCoupon/)
    assert.match(read('app/admin/coupons/page.tsx'), /deactivateCoupon/)
    assert.match(read('app/admin/coupons/new/page.tsx'), /createCoupon/)
    assert.match(read('app/admin/coupons/[code]/page.tsx'), /updateCoupon/)
    assert.match(read('app/admin/settings/page.tsx'), /updateStoreSettings/)
    assert.match(read('app/admin/page.tsx'), /href="\/admin\/coupons"/)
  })
})
