/**
 * POST /api/checkout
 *
 * Validates order totals server-side and generates a CCBill Dynamic Pricing
 * URL for the client to redirect to. Card data NEVER touches this server —
 * CCBill's hosted FlexForms handle all PCI-DSS scope.
 *
 * Required environment variables (set in Cloudflare Workers / .env.local):
 *   CCBILL_ACCOUNT_NUMBER   — your CCBill merchant account number
 *   CCBILL_SUB_ACCOUNT      — sub-account number (e.g. "0000")
 *   CCBILL_FLEXFORM_ID      — FlexForms form ID (e.g. "cc_billing_form.php")
 *   CCBILL_SALT             — Dynamic Pricing salt (from CCBill Admin)
 *   CCBILL_CURRENCY_CODE    — ISO 4217 numeric (840 = USD)
 *
 * CCBill Dynamic Pricing API reference:
 *   https://kb.ccbill.com/Dynamic+Pricing
 */

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { SITE_CONFIG } from '@/config/site'

// ── Promo code registry (server-side validation) ──────────────────────────
const VALID_PROMO_CODES = {
  SOFTLAUNCH10: 10,
  ROOM23: 10,
  WELCOME10: 10,
}

const TAX_RATE = 0.08

/**
 * Re-compute the authoritative order total server-side.
 * Never trust client-supplied totals for billing.
 */
function computeTotal({ cart, appliedPromo, subtotalFromClient }) {
  // 1. Re-derive subtotal from cart line items
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(item.price)
    const qty = Math.max(1, Math.floor(Number(item.qty)))
    if (!isFinite(price) || price <= 0) throw new Error(`Invalid price for item ${item.id}`)
    return sum + price * qty
  }, 0)

  // 2. Sanity-check against client-reported subtotal (±1 cent tolerance)
  if (Math.abs(subtotal - Number(subtotalFromClient)) > 0.02) {
    throw new Error('Cart total mismatch — please refresh and try again.')
  }

  // 3. Server-side promo validation
  const discountPercent = appliedPromo ? (VALID_PROMO_CODES[appliedPromo.toUpperCase()] ?? 0) : 0
  const discountAmount = (subtotal * discountPercent) / 100
  const discountedSubtotal = subtotal - discountAmount

  const shipping =
    subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const tax = discountedSubtotal * TAX_RATE
  const total = discountedSubtotal + tax + shipping

  return { subtotal, discountPercent, discountAmount, discountedSubtotal, tax, shipping, total }
}

/**
 * Build a CCBill Dynamic Pricing URL with a signed digest.
 * https://kb.ccbill.com/Dynamic+Pricing
 *
 * initialPrice and recurringPrice are expressed in USD with 2 decimal places.
 * The MD5 digest is over: initialPrice + initialPeriod + recurringPrice +
 *   recurringPeriod + currencyCode + salt
 */
function buildCCBillUrl({ total }) {
  const {
    CCBILL_ACCOUNT_NUMBER,
    CCBILL_SUB_ACCOUNT,
    CCBILL_FLEXFORM_ID,
    CCBILL_SALT,
    CCBILL_CURRENCY_CODE = '840',
  } = process.env

  if (!CCBILL_ACCOUNT_NUMBER || !CCBILL_SUB_ACCOUNT || !CCBILL_FLEXFORM_ID || !CCBILL_SALT) {
    throw new Error('CCBill environment variables are not configured.')
  }

  const initialPrice = total.toFixed(2)
  const initialPeriod = '2' // 2-day one-time charge period (required by CCBill for non-recurring)
  const recurringPrice = total.toFixed(2)
  const recurringPeriod = '2'
  const numRebills = '0'
  const currencyCode = CCBILL_CURRENCY_CODE

  // MD5 digest: initialPrice + initialPeriod + recurringPrice + recurringPeriod + currencyCode + salt
  const digestString = `${initialPrice}${initialPeriod}${recurringPrice}${recurringPeriod}${currencyCode}${CCBILL_SALT}`
  const formDigest = crypto.createHash('md5').update(digestString).digest('hex')

  const params = new URLSearchParams({
    clientAccnum: CCBILL_ACCOUNT_NUMBER,
    clientSubacc: CCBILL_SUB_ACCOUNT,
    initialPrice,
    initialPeriod,
    recurringPrice,
    recurringPeriod,
    numRebills,
    currencyCode,
    formDigest,
  })

  return `https://api.ccbill.com/wap-frontflex/flexforms/${CCBILL_FLEXFORM_ID}?${params.toString()}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { cart, subtotal: subtotalFromClient, appliedPromo } = body

    // ── Input validation ─────────────────────────────────────────────────
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
    }

    // ── Server-side total recomputation ──────────────────────────────────
    let totals
    try {
      totals = computeTotal({ cart, appliedPromo, subtotalFromClient })
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    // ── Build CCBill redirect URL ─────────────────────────────────────────
    let paymentUrl
    try {
      paymentUrl = buildCCBillUrl({ total: totals.total })
    } catch (err) {
      console.error('[checkout] CCBill URL build failed:', err.message)
      return NextResponse.json(
        { error: 'Payment gateway configuration error. Please contact support.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      paymentUrl,
      totals: {
        subtotal: totals.subtotal,
        discountPercent: totals.discountPercent,
        discountAmount: totals.discountAmount,
        tax: totals.tax,
        shipping: totals.shipping,
        total: totals.total,
      },
    })
  } catch (err) {
    console.error('[checkout] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
