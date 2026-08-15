/**
 * POST /api/checkout
 *
 * Validates the cart against the server catalog, then either:
 *   1. Returns a CCBill FlexForms URL when the gateway is configured, or
 *   2. Finalizes the order (fulfillment routing + confirmation email).
 *
 * Card data never touches this server.
 */

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { SITE_CONFIG } from '@/config/site'
import { getProductById } from '@/lib/products'
import {
  checkoutCustomerSchema,
  computeServerTotals,
  finalizePaidOrder,
  generateOrderId,
  hydrateCartItems,
} from '@/lib/checkout-complete'

function buildCCBillUrl({ total, orderId }) {
  const {
    CCBILL_ACCOUNT_NUMBER,
    CCBILL_SUB_ACCOUNT,
    CCBILL_FLEXFORM_ID,
    CCBILL_SALT,
    CCBILL_CURRENCY_CODE = '840',
  } = process.env

  if (!CCBILL_ACCOUNT_NUMBER || !CCBILL_SUB_ACCOUNT || !CCBILL_FLEXFORM_ID || !CCBILL_SALT) {
    return null
  }

  const initialPrice = total.toFixed(2)
  const initialPeriod = '2'
  const recurringPrice = total.toFixed(2)
  const recurringPeriod = '2'
  const numRebills = '0'
  const currencyCode = CCBILL_CURRENCY_CODE
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
    orderId,
    redirectUrl: `https://${SITE_CONFIG.domain}/order-confirmed`,
  })

  return `https://api.ccbill.com/wap-frontflex/flexforms/${CCBILL_FLEXFORM_ID}?${params.toString()}`
}

function publicTotals(totals) {
  return {
    subtotal: totals.subtotal,
    discountPercent: totals.discountPercent,
    discountAmount: totals.discountAmount,
    tax: totals.tax,
    shipping: totals.shipping,
    total: totals.total,
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { cart, subtotal: subtotalFromClient, appliedPromo } = body

    let items
    try {
      items = hydrateCartItems(cart, getProductById)
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    const customer = checkoutCustomerSchema.safeParse({
      email: body.email,
      shippingAddress: body.shippingAddress,
    })
    if (!customer.success) {
      return NextResponse.json({ error: 'A valid email and shipping address are required.' }, { status: 400 })
    }

    const totals = computeServerTotals(items, {
      appliedPromo,
      freeShippingThreshold: SITE_CONFIG.freeShippingThreshold,
      flatShippingRate: SITE_CONFIG.flatShippingRate,
    })

    if (
      subtotalFromClient != null &&
      Math.abs(totals.subtotal - Number(subtotalFromClient)) > 0.02
    ) {
      return NextResponse.json(
        { error: 'Cart total mismatch — please refresh and try again.' },
        { status: 400 },
      )
    }

    const orderId = typeof body.orderId === 'string' && body.orderId.startsWith('R23-')
      ? body.orderId
      : generateOrderId()
    const idempotencyKey = body.idempotencyKey || `checkout:${orderId}`
    const paymentUrl = buildCCBillUrl({ total: totals.total, orderId })

    if (paymentUrl) {
      return NextResponse.json({
        success: true,
        pending: true,
        orderId,
        paymentUrl,
        totals: publicTotals(totals),
      })
    }

    const finalized = await finalizePaidOrder(
      {
        orderId,
        email: customer.data.email,
        shippingAddress: customer.data.shippingAddress,
        items,
        totals,
        idempotencyKey,
      },
      {
        dryRun: process.env.NODE_ENV !== 'production',
      },
    )

    return NextResponse.json({
      success: true,
      pending: false,
      orderId: finalized.orderId,
      paymentUrl: null,
      emailSent: finalized.emailSent,
      fulfillment: finalized.fulfillment,
      totals: publicTotals(totals),
    })
  } catch (err) {
    console.error(JSON.stringify({
      scope: 'checkout',
      message: 'Unexpected checkout error',
      errorCode: err.code || 'CHECKOUT_FAILED',
    }))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
