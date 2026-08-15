import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { partitionItems, routeOrder, VENDOR_TYPES } from '../lib/fulfillment.mjs'
import { formatEldoradoOrder } from '../lib/suppliers/eldorado.mjs'
import { formatWilliamsOrder } from '../lib/suppliers/williams.mjs'

const address = {
  name: 'Alex Buyer',
  line1: '123 Neutral Ave',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90036',
  country: 'US',
}

function stockItem() {
  return {
    id: 'lube-silicone-2oz',
    name: 'Platinum Silicone Lubricant - 2oz',
    qty: 1,
    price: 18,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
  }
}

function eldoradoItem() {
  return {
    id: 'ds-massage-oil',
    name: 'Midnight Bloom Massage Oil',
    qty: 1,
    price: 42,
    vendorType: VENDOR_TYPES.ELDORADO_DROPSHIP,
    supplierSku: 'ELD-1001',
  }
}

function williamsItem() {
  return {
    id: 'ds-glass-wand',
    name: 'Obsidian Glass Massage Wand',
    qty: 1,
    price: 65,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    supplierSku: 'WIL-2200',
  }
}

describe('fulfillment router', () => {
  it('partitions cart items by vendor type', () => {
    const groups = partitionItems([stockItem(), eldoradoItem(), williamsItem()])
    assert.equal(groups[VENDOR_TYPES.ROOM23_STOCK].length, 1)
    assert.equal(groups[VENDOR_TYPES.ELDORADO_DROPSHIP].length, 1)
    assert.equal(groups[VENDOR_TYPES.WILLIAMS_DROPSHIP].length, 1)
  })

  it('returns split-fulfillment status for mixed stock and dropship orders', async () => {
    const result = await routeOrder(
      {
        orderId: 'R23-1001',
        email: 'buyer@example.com',
        items: [stockItem(), eldoradoItem()],
        shippingAddress: address,
        totals: { subtotal: 60, shipping: 8, tax: 4.8, total: 72.8 },
      },
      { dryRun: true },
    )

    assert.equal(result.customer.splitFulfillment, true)
    assert.equal(result.customer.shipsSeparately, true)
    assert.match(result.customer.customerNotice, /ship separately/i)
    assert.match(result.customer.customerNotice, /discreet packaging/i)
    assert.equal(result.customer.packages.length, 2)
  })

  it('strips supplier trade names from customer-facing receipts', async () => {
    const result = await routeOrder(
      {
        orderId: 'R23-1002',
        email: 'buyer@example.com',
        items: [
          { ...eldoradoItem(), name: 'Eldorado Midnight Oil' },
          { ...williamsItem(), name: 'Williams Trading Glass Wand' },
        ],
        shippingAddress: address,
      },
      { dryRun: true },
    )

    const blob = JSON.stringify(result.customer)
    assert.doesNotMatch(blob, /eldorado/i)
    assert.doesNotMatch(blob, /williams/i)
    assert.ok(result.customer.packages.every((pkg) => pkg.channel === 'partner_warehouse'))
    assert.ok(result.customer.receipt.items.every((item) => /partner/i.test(item.name)))
  })

  it('formats supplier payloads and sends Idempotency-Key', async () => {
    const order = {
      orderId: 'R23-1003',
      email: 'buyer@example.com',
      idempotencyKey: 'r23-1003-retry',
      items: [eldoradoItem()],
      shippingAddress: address,
    }

    const eldorado = formatEldoradoOrder({
      order,
      items: [eldoradoItem()],
      accountNumber: 'ACC-1',
    })
    assert.equal(eldorado.poNumber, 'R23-1003')
    assert.equal(eldorado.dropShip, true)
    assert.equal(eldorado.lines[0].itemNumber, 'ELD-1001')

    const williams = formatWilliamsOrder({
      order,
      items: [williamsItem()],
      customerNumber: 'W-9',
    })
    assert.equal(williams.orderNumber, 'R23-1003')
    assert.equal(williams.dropshipFlag, 'Y')
    assert.equal(williams.items[0].sku, 'WIL-2200')

    const calls = []
    const fetchImpl = async (url, init) => {
      calls.push({ url, init })
      return {
        ok: true,
        json: async () => ({ orderId: 'SUP-1', status: 'accepted' }),
      }
    }

    await routeOrder(order, {
      fetchImpl,
      env: {
        ELDORADO_API_URL: 'https://partners.example/eldorado',
        ELDORADO_API_KEY: 'test-key',
        ELDORADO_ACCOUNT: 'ACC-1',
      },
    })

    assert.equal(calls.length, 1)
    assert.equal(calls[0].init.headers['Idempotency-Key'], 'r23-1003-retry')
    assert.ok(!JSON.stringify(calls[0].init.body).includes('buyer@example.com'))
  })

  it('flags admin review on supplier failure without logging PII or keys', async () => {
    const logs = []
    const originalError = console.error
    console.error = (line) => logs.push(String(line))

    try {
      const result = await routeOrder(
        {
          orderId: 'R23-1004',
          email: 'buyer@example.com',
          items: [eldoradoItem()],
          shippingAddress: address,
        },
        {
          env: {
            ELDORADO_API_URL: 'https://partners.example/eldorado',
            ELDORADO_API_KEY: 'super-secret-key',
          },
          fetchImpl: async () => ({ ok: false, status: 502, json: async () => ({}) }),
        },
      )

      assert.equal(result.customer.adminReview, true)
      assert.equal(result.customer.status, 'needs_review')
      assert.equal(result.admin.review, true)
      const joined = logs.join('\n')
      assert.doesNotMatch(joined, /buyer@example.com/)
      assert.doesNotMatch(joined, /super-secret-key/)
      assert.doesNotMatch(joined, /4111|cvv/i)
    } finally {
      console.error = originalError
    }
  })
})
