/**
 * Post-payment checkout pipeline: route fulfillment, then send confirmation.
 * Customer-facing results never include supplier names, raw email, or card data.
 */

import { z } from 'zod'
import { routeOrder } from './fulfillment.mjs'
import { sendOrderConfirmation } from './email/order-confirmation.mjs'
import { hashEmail } from './privacy.mjs'
import { VALID_PROMO_CODES } from './promos.mjs'
import { getShippingRate, DEFAULT_SHIPPING_METHOD } from './shipping.mjs'

export { VALID_PROMO_CODES }

export const TAX_RATE = 0.08

export const checkoutCustomerSchema = z.object({
  email: z.string().trim().email(),
  shippingAddress: z.object({
    name: z.string().trim().min(1).max(120),
    line1: z.string().trim().min(1).max(120),
    line2: z.string().trim().max(120).optional().or(z.literal('')),
    city: z.string().trim().min(1).max(80),
    state: z.string().trim().min(2).max(40),
    postalCode: z.string().trim().min(3).max(16),
    country: z.string().trim().min(2).max(2).default('US'),
    phone: z.string().trim().max(32).optional().or(z.literal('')),
  }),
})

export function generateOrderId() {
  const rand = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
  return `R23-${Date.now().toString(36).toUpperCase()}-${rand}`
}

export function hydrateCartItems(cart, getProduct) {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error('Cart is empty.')
  }

  return cart.map((line) => {
    const product = getProduct(line.id)
    if (!product) throw new Error('One or more items are no longer available.')
    const qty = Math.max(1, Math.floor(Number(line.qty) || 1))
    const price = Number(product.price)
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error('One or more items have an invalid price.')
    }
    return {
      id: product.id,
      name: product.name,
      qty,
      price,
      vendorType: product.vendorType,
      fulfillmentType: product.fulfillmentType,
      supplierSku: product.supplierSku || product.id,
    }
  })
}

export function computeServerTotals(items, {
  appliedPromo,
  freeShippingThreshold,
  flatShippingRate,
  shippingMethodId,
} = {}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const discountPercent = appliedPromo ? (VALID_PROMO_CODES[String(appliedPromo).toUpperCase()] ?? 0) : 0
  const discountAmount = (subtotal * discountPercent) / 100
  const discountedSubtotal = subtotal - discountAmount
  const shipping = shippingMethodId
    ? getShippingRate(subtotal, shippingMethodId)
    : (subtotal >= (freeShippingThreshold ?? 0) ? 0 : (flatShippingRate ?? getShippingRate(subtotal, DEFAULT_SHIPPING_METHOD)))
  const tax = discountedSubtotal * TAX_RATE
  const total = discountedSubtotal + tax + shipping
  return { subtotal, discountPercent, discountAmount, discountedSubtotal, tax, shipping, total }
}

function supplierEnvFromProcess(env = process.env) {
  return {
    ELDORADO_API_URL: env.ELDORADO_API_URL,
    ELDORADO_API_KEY: env.ELDORADO_API_KEY,
    ELDORADO_ACCOUNT: env.ELDORADO_ACCOUNT,
    WILLIAMS_API_URL: env.WILLIAMS_API_URL,
    WILLIAMS_API_KEY: env.WILLIAMS_API_KEY,
    WILLIAMS_ACCOUNT: env.WILLIAMS_ACCOUNT,
  }
}

/**
 * Route stock/dropship groups and send the lock-screen-neutral confirmation.
 * Fulfillment or email failures flag admin review and do not throw to the client.
 */
export async function finalizePaidOrder(order, options = {}) {
  const emailHash = await hashEmail(order.email)
  let fulfillment
  let emailSent = false
  let adminReview = false

  try {
    fulfillment = await routeOrder(order, {
      env: options.env || supplierEnvFromProcess(options.processEnv),
      fetchImpl: options.fetchImpl,
      dryRun: options.dryRun === true,
    })
    adminReview = Boolean(fulfillment.admin?.review)
  } catch (error) {
    adminReview = true
    console.error(
      JSON.stringify({
        scope: 'checkout',
        message: 'Fulfillment routing failed; flagged for admin review',
        orderId: order.orderId,
        emailHash,
        errorCode: error.code || 'FULFILLMENT_FAILED',
      }),
    )
    fulfillment = {
      customer: {
        orderId: order.orderId,
        status: 'needs_review',
        splitFulfillment: false,
        shipsSeparately: false,
        customerNotice: 'Your order is being reviewed. We will email you with an update.',
        packages: [],
        receipt: {
          items: order.items.map((item) => ({
            id: item.id,
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
          totals: order.totals,
          discreetShipping: 'Shipped in plain, neutral packaging',
        },
        adminReview: true,
      },
      admin: {
        orderId: order.orderId,
        emailHash,
        review: true,
        failures: [{ reason: error.code || 'FULFILLMENT_FAILED' }],
      },
    }
  }

  try {
    await sendOrderConfirmation(
      {
        orderId: order.orderId,
        email: order.email,
        items: order.items.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
        totals: {
          subtotal: order.totals.subtotal,
          shipping: order.totals.shipping,
          tax: order.totals.tax,
          total: order.totals.total,
        },
        splitFulfillment: fulfillment.customer.splitFulfillment,
      },
      {
        resend: options.resend,
        idempotencyKey: order.idempotencyKey || `order-email:${order.orderId}`,
      },
    )
    emailSent = true
  } catch (error) {
    adminReview = true
    console.error(
      JSON.stringify({
        scope: 'checkout',
        message: 'Confirmation email failed; flagged for admin review',
        orderId: order.orderId,
        emailHash,
        errorCode: error.code || 'EMAIL_SEND_FAILED',
      }),
    )
  }

  return {
    orderId: order.orderId,
    emailSent,
    adminReview,
    fulfillment: fulfillment.customer,
    admin: { ...fulfillment.admin, review: adminReview },
  }
}
