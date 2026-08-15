/**
 * POST /api/checkout/complete
 *
 * Finalizes a paid (or locally completed) order: supplier routing + confirmation email.
 * Safe to retry — outgoing supplier/email calls carry an Idempotency-Key.
 */

import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/config/site'
import { getProductById } from '@/lib/products'
import {
  checkoutCustomerSchema,
  computeServerTotals,
  finalizePaidOrder,
  hydrateCartItems,
} from '@/lib/checkout-complete'

export async function POST(request) {
  try {
    const body = await request.json()
    const orderId = typeof body.orderId === 'string' ? body.orderId.trim() : ''
    if (!orderId.startsWith('R23-')) {
      return NextResponse.json({ error: 'A valid order id is required.' }, { status: 400 })
    }

    let items
    try {
      items = hydrateCartItems(body.cart, getProductById)
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
      appliedPromo: body.appliedPromo,
      freeShippingThreshold: SITE_CONFIG.freeShippingThreshold,
      flatShippingRate: SITE_CONFIG.flatShippingRate,
    })

    const finalized = await finalizePaidOrder(
      {
        orderId,
        email: customer.data.email,
        shippingAddress: customer.data.shippingAddress,
        items,
        totals,
        idempotencyKey: body.idempotencyKey || `checkout:${orderId}`,
      },
      {
        dryRun: process.env.NODE_ENV !== 'production',
      },
    )

    return NextResponse.json({
      success: true,
      pending: false,
      orderId: finalized.orderId,
      emailSent: finalized.emailSent,
      fulfillment: finalized.fulfillment,
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
    console.error(JSON.stringify({
      scope: 'checkout',
      message: 'Order completion failed',
      errorCode: err.code || 'CHECKOUT_COMPLETE_FAILED',
    }))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
