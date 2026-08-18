/**
 * POST /api/checkout
 *
 * Validates the cart against the server catalog, then either:
 *   1. Returns a CCBill FlexForms URL when the gateway is configured, or
 *   2. Finalizes via staging mock (CHECKOUT_MOCK / non-production), or
 *   3. Returns a hosted-payment placeholder URL at /pay.
 *
 * Card data never touches this server. Hardware SKUs are one-time charges.
 */

import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/config/site'
import { listStorefrontProducts } from '@/lib/admin-catalog'
import { buildCCBillFlexFormUrl, isCheckoutMockEnabled } from '@/lib/ccbill.mjs'
import {
  checkoutCustomerSchema,
  computeServerTotals,
  finalizePaidOrder,
  generateOrderId,
  hydrateCartItems,
} from '@/lib/checkout-complete'

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
    const { cart, subtotal: subtotalFromClient, appliedPromo, shippingMethodId } = body

    let items
    try {
      const catalog = await listStorefrontProducts()
      const byId = new Map(catalog.map((product) => [product.id, product]))
      items = hydrateCartItems(cart, (id) => byId.get(id))
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
      shippingMethodId,
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
    const paymentUrl = buildCCBillFlexFormUrl({
      total: totals.total,
      orderId,
      email: customer.data.email,
      domain: SITE_CONFIG.domain,
    })

    if (paymentUrl) {
      return NextResponse.json({
        success: true,
        pending: true,
        orderId,
        paymentUrl,
        totals: publicTotals(totals),
      })
    }

    if (isCheckoutMockEnabled()) {
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
          dryRun: true,
        },
      )

      return NextResponse.json({
        success: true,
        pending: false,
        mock: true,
        orderId: finalized.orderId,
        paymentUrl: null,
        emailSent: finalized.emailSent,
        fulfillment: finalized.fulfillment,
        totals: publicTotals(totals),
      })
    }

    return NextResponse.json({
      success: true,
      pending: true,
      orderId,
      paymentUrl: `/pay?order=${encodeURIComponent(orderId)}`,
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
