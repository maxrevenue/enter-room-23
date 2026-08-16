import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  checkoutCustomerSchema,
  computeServerTotals,
  finalizePaidOrder,
  hydrateCartItems,
} from '../lib/checkout-complete.mjs'
import { VENDOR_TYPES } from '../lib/fulfillment.mjs'

const catalog = {
  'lube-silicone-2oz': {
    id: 'lube-silicone-2oz',
    name: 'Platinum Silicone Lubricant - 2oz',
    price: 18,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
  },
  'ds-massage-oil': {
    id: 'ds-massage-oil',
    name: 'Midnight Bloom Massage Oil',
    price: 42,
    vendorType: VENDOR_TYPES.ELDORADO_DROPSHIP,
    supplierSku: 'ELD-1001',
  },
}

const shippingAddress = {
  name: 'Alex Buyer',
  line1: '123 Neutral Ave',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90036',
  country: 'US',
}

describe('checkout completion pipeline', () => {
  it('hydrates cart lines from the server catalog, not client prices', () => {
    const items = hydrateCartItems(
      [{ id: 'lube-silicone-2oz', qty: 2, price: 1 }],
      (id) => catalog[id],
    )
    assert.equal(items[0].price, 18)
    assert.equal(items[0].qty, 2)
    assert.equal(items[0].vendorType, VENDOR_TYPES.ROOM23_STOCK)
  })

  it('rejects an empty or unknown cart', () => {
    assert.throws(() => hydrateCartItems([], (id) => catalog[id]), /empty/i)
    assert.throws(
      () => hydrateCartItems([{ id: 'nope', qty: 1 }], (id) => catalog[id]),
      /no longer available/i,
    )
  })

  it('requires a valid email and shipping address', () => {
    assert.equal(checkoutCustomerSchema.safeParse({ email: 'bad', shippingAddress }).success, false)
    assert.equal(
      checkoutCustomerSchema.safeParse({ email: 'buyer@example.com', shippingAddress }).success,
      true,
    )
  })

  it('routes fulfillment and sends confirmation email', async () => {
    const items = hydrateCartItems(
      [
        { id: 'lube-silicone-2oz', qty: 1 },
        { id: 'ds-massage-oil', qty: 1 },
      ],
      (id) => catalog[id],
    )
    const totals = computeServerTotals(items, {
      appliedPromo: 'WELCOME10',
      freeShippingThreshold: 99,
      flatShippingRate: 5.99,
    })

    const sent = []
    const result = await finalizePaidOrder(
      {
        orderId: 'R23-TEST-1',
        email: 'buyer@example.com',
        shippingAddress,
        items,
        totals,
        idempotencyKey: 'checkout:R23-TEST-1',
      },
      {
        dryRun: true,
        resend: {
          emails: {
            send: async (payload) => {
              sent.push(payload)
              return { data: { id: 're_test' }, error: null }
            },
          },
        },
      },
    )

    assert.equal(result.emailSent, true)
    assert.equal(result.fulfillment.splitFulfillment, true)
    assert.match(result.fulfillment.customerNotice, /ship separately/i)
    assert.equal(sent[0].from, 'Room 23 <orders@room23.net>')
    assert.equal(sent[0].subject, 'Room 23: Order #R23-TEST-1 Confirmation')
    assert.match(sent[0].text, /Shipped in plain, neutral packaging|ship separately/i)
    assert.doesNotMatch(JSON.stringify(result.fulfillment), /eldorado|williams/i)
  })

  it('still returns a customer result when email sending fails', async () => {
    const items = hydrateCartItems([{ id: 'lube-silicone-2oz', qty: 1 }], (id) => catalog[id])
    const totals = computeServerTotals(items, { freeShippingThreshold: 99, flatShippingRate: 5.99 })

    const result = await finalizePaidOrder(
      {
        orderId: 'R23-TEST-2',
        email: 'buyer@example.com',
        shippingAddress,
        items,
        totals,
      },
      {
        dryRun: true,
        resend: {
          emails: {
            send: async () => {
              throw new Error('provider down')
            },
          },
        },
      },
    )

    assert.equal(result.emailSent, false)
    assert.equal(result.adminReview, true)
    assert.equal(result.fulfillment.orderId, 'R23-TEST-2')
  })
})
