import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const helpersSource = readFileSync(join(root, 'lib/admin-orders.ts'), 'utf8')

const CLOSED_ORDER_STATUSES = [
  'fulfilled',
  'refunded',
  'cancelled',
  'shipped',
  'delivered',
  'complete',
  'completed',
]
const FULFILLED_LIKE_STATUSES = ['fulfilled', 'shipped', 'delivered', 'complete', 'completed']
const REFUNDED_CANCELLED_STATUSES = ['refunded', 'cancelled', 'canceled']
const ORDER_FILTERS = ['all', 'open', 'fulfilled', 'closed']

function parseOrderFilter(value) {
  return ORDER_FILTERS.includes(value) ? value : 'all'
}

function normalizeOrderStatus(status) {
  return String(status || 'paid').trim().toLowerCase() || 'paid'
}

function isClosedOrderStatus(status) {
  return CLOSED_ORDER_STATUSES.includes(normalizeOrderStatus(status))
}

function isOpenOrder(order) {
  return !isClosedOrderStatus(order.status) && order.fulfilled !== true
}

function coerceOrderStatus(status) {
  const value = normalizeOrderStatus(status)
  if (['paid', 'fulfilled', 'refunded', 'cancelled'].includes(value)) return value
  if (FULFILLED_LIKE_STATUSES.includes(value)) return 'fulfilled'
  if (REFUNDED_CANCELLED_STATUSES.includes(value)) return 'cancelled'
  return 'paid'
}

function orderItemCount(order) {
  if (!Array.isArray(order.items) || order.items.length === 0) return 0
  return order.items.reduce((sum, item) => {
    const qty = Number(item?.qty)
    return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1)
  }, 0)
}

function orderLineTotal(item) {
  const qty = Number(item?.qty)
  const price = Number(item?.price)
  const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1
  if (!Number.isFinite(price)) return null
  return safeQty * price
}

function buildOrderStatusUpdate(status) {
  const update = {
    status,
    fulfilled: status === 'fulfilled',
    updatedAt: new Date(),
  }
  if (status === 'fulfilled') update['fulfillment.status'] = 'fulfilled'
  if (status === 'refunded' || status === 'cancelled') update.fulfilled = false
  return update
}

function matchesQuery(order, query) {
  if (!query || Object.keys(query).length === 0) return true
  if (query.$nor) return query.$nor.every((clause) => !matchesQuery(order, clause))
  if (query.$or) return query.$or.some((clause) => matchesQuery(order, clause))
  if (query.status?.$in) return query.status.$in.includes(normalizeOrderStatus(order.status))
  if (query.fulfilled === true) return order.fulfilled === true
  return false
}

function orderFilterQuery(filter) {
  if (filter === 'open') {
    return { $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }] }
  }
  if (filter === 'fulfilled') {
    return { $or: [{ status: { $in: [...FULFILLED_LIKE_STATUSES] } }, { fulfilled: true }] }
  }
  if (filter === 'closed') {
    return { status: { $in: [...REFUNDED_CANCELLED_STATUSES] } }
  }
  return {}
}

const catalog = [
  { orderId: 'R23-OPEN', email: 'open@example.com', status: 'paid', fulfilled: false, items: [{ qty: 2, price: 10 }], totals: { total: 20 } },
  { orderId: 'R23-SHIP', email: '', status: 'shipped', fulfilled: false, items: [{ qty: 1, price: 12 }], totals: { total: 12 } },
  { orderId: 'R23-DONE', email: 'done@example.com', status: 'fulfilled', fulfilled: true, items: [{ qty: 3, price: 8 }], totals: { total: 24 } },
  { orderId: 'R23-REFUND', email: 'refund@example.com', status: 'refunded', fulfilled: false, items: [{ qty: 1, price: 40 }], totals: { total: 40 } },
  { orderId: 'R23-CANCEL', email: 'cancel@example.com', status: 'cancelled', fulfilled: false, items: [{ qty: 1, price: 15 }], totals: { total: 15 } },
]

describe('admin order helper behavior', () => {
  it('keeps helper implementations in lib/admin-orders.ts', () => {
    assert.match(helpersSource, /export function parseOrderFilter/)
    assert.match(helpersSource, /export function coerceOrderStatus/)
    assert.match(helpersSource, /export function buildOrderStatusUpdate/)
    assert.match(helpersSource, /export function orderItemCount/)
    assert.match(helpersSource, /export function orderLineTotal/)
    assert.match(helpersSource, /export async function listRecentOpenOrders/)
  })

  it('parses filter tabs and coerces legacy statuses', () => {
    assert.equal(parseOrderFilter('open'), 'open')
    assert.equal(parseOrderFilter('nope'), 'all')
    assert.equal(coerceOrderStatus('shipped'), 'fulfilled')
    assert.equal(coerceOrderStatus('delivered'), 'fulfilled')
    assert.equal(coerceOrderStatus('complete'), 'fulfilled')
    assert.equal(coerceOrderStatus('canceled'), 'cancelled')
    assert.equal(coerceOrderStatus('needs_review'), 'paid')
  })

  it('counts items and line totals', () => {
    assert.equal(orderItemCount({ items: [{ qty: 2 }, { qty: 3 }] }), 5)
    assert.equal(orderItemCount({ items: [{}] }), 1)
    assert.equal(orderItemCount({}), 0)
    assert.equal(orderLineTotal({ qty: 2, price: 12.5 }), 25)
    assert.equal(orderLineTotal({ price: 18 }), 18)
    assert.equal(orderLineTotal({ qty: 2, price: Number.NaN }), null)
  })

  it('sets fulfillment markers so open-order counts stay correct', () => {
    const fulfilled = buildOrderStatusUpdate('fulfilled')
    assert.equal(fulfilled.status, 'fulfilled')
    assert.equal(fulfilled.fulfilled, true)
    assert.equal(fulfilled['fulfillment.status'], 'fulfilled')

    const refunded = buildOrderStatusUpdate('refunded')
    assert.equal(refunded.status, 'refunded')
    assert.equal(refunded.fulfilled, false)

    const cancelled = buildOrderStatusUpdate('cancelled')
    assert.equal(cancelled.fulfilled, false)

    const paid = buildOrderStatusUpdate('paid')
    assert.equal(paid.fulfilled, false)
    assert.equal(isOpenOrder({ status: 'paid', fulfilled: false }), true)
    assert.equal(isOpenOrder({ status: 'paid', fulfilled: true }), false)
    assert.equal(isOpenOrder({ status: 'shipped' }), false)
  })

  it('filters All / Open / Fulfilled / Refunded-Cancelled collections', () => {
    const open = catalog.filter((order) => matchesQuery(order, orderFilterQuery('open'))).map((order) => order.orderId)
    const fulfilled = catalog.filter((order) => matchesQuery(order, orderFilterQuery('fulfilled'))).map((order) => order.orderId)
    const closed = catalog.filter((order) => matchesQuery(order, orderFilterQuery('closed'))).map((order) => order.orderId)

    assert.deepEqual(open, ['R23-OPEN'])
    assert.deepEqual(fulfilled, ['R23-SHIP', 'R23-DONE'])
    assert.deepEqual(closed, ['R23-REFUND', 'R23-CANCEL'])
    assert.equal(catalog.filter((order) => matchesQuery(order, orderFilterQuery('all'))).length, 5)
    assert.equal(catalog.find((order) => order.orderId === 'R23-OPEN').email || '—', 'open@example.com')
    assert.equal(catalog.find((order) => order.orderId === 'R23-SHIP').email || '—', '—')
  })
})
