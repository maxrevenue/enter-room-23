import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

const REFUNDED_CANCELLED_STATUSES = ['refunded', 'cancelled', 'canceled']

function normalizeCustomerEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function decodeCustomerEmailParam(raw) {
  const value = String(raw || '')
  try {
    return normalizeCustomerEmail(decodeURIComponent(value))
  } catch {
    return normalizeCustomerEmail(value)
  }
}

function isRefundedOrCancelled(order) {
  return REFUNDED_CANCELLED_STATUSES.includes(String(order.status || 'paid').trim().toLowerCase())
}

function orderSpendAmount(order) {
  const amount = Number(order.totals?.total)
  return Number.isFinite(amount) ? amount : 0
}

function orderTimestamp(value) {
  if (!value) return 0
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function aggregateCustomersFromOrders(orders) {
  const byEmail = new Map()
  for (const order of orders) {
    const email = normalizeCustomerEmail(order.email)
    if (!email) continue
    const ts = orderTimestamp(order.createdAt)
    const name = String(order.shippingAddress?.name || '').trim()
    const spend = isRefundedOrCancelled(order) ? 0 : orderSpendAmount(order)
    const current = byEmail.get(email)
    if (!current) {
      byEmail.set(email, {
        email,
        name,
        orderCount: 1,
        totalSpent: spend,
        lastOrderAt: order.createdAt || null,
        lastOrderId: order.orderId,
        lastTs: ts,
      })
      continue
    }
    current.orderCount += 1
    current.totalSpent += spend
    if (ts >= current.lastTs) {
      current.lastTs = ts
      current.lastOrderAt = order.createdAt
      current.lastOrderId = order.orderId
      if (name) current.name = name
    }
  }
  return [...byEmail.values()].sort((a, b) => b.lastTs - a.lastTs)
}

function customerMatchesQuery(customer, q) {
  const needle = String(q || '').trim().toLowerCase()
  if (!needle) return true
  return customer.email.includes(needle) || customer.name.toLowerCase().includes(needle)
}

function orderMatchesSearch(order, q) {
  const needle = String(q || '').trim().toLowerCase()
  if (!needle) return true
  const name = String(order.shippingAddress?.name || '').toLowerCase()
  return (
    String(order.orderId || '').toLowerCase().includes(needle) ||
    String(order.email || '').toLowerCase().includes(needle) ||
    name.includes(needle)
  )
}

function adminOrdersHref(filter = 'all', q = '') {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('filter', filter)
  if (String(q || '').trim()) params.set('q', String(q).trim())
  const query = params.toString()
  return query ? `/admin/orders?${query}` : '/admin/orders'
}

describe('admin phase 8 customers and order search', () => {
  it('aggregates unique customers from orders by email', () => {
    const customers = aggregateCustomersFromOrders([
      {
        orderId: 'R23-OLD',
        email: 'Alex@Room23.net',
        status: 'paid',
        totals: { total: 40 },
        createdAt: '2026-01-01',
        shippingAddress: { name: 'Alex One' },
      },
      {
        orderId: 'R23-NEW',
        email: 'alex@room23.net',
        status: 'fulfilled',
        totals: { total: 60 },
        createdAt: '2026-03-01',
        shippingAddress: { name: 'Alex Buyer' },
      },
      {
        orderId: 'R23-REF',
        email: 'alex@room23.net',
        status: 'refunded',
        totals: { total: 25 },
        createdAt: '2026-02-01',
      },
      {
        orderId: 'R23-OTHER',
        email: 'sam@room23.net',
        status: 'paid',
        totals: { total: 18 },
        createdAt: '2026-04-01',
        shippingAddress: { name: 'Sam' },
      },
      {
        orderId: 'R23-NONE',
        email: '  ',
        status: 'paid',
        totals: { total: 99 },
      },
    ])

    assert.equal(customers.length, 2)
    assert.equal(customers[0].email, 'sam@room23.net')
    assert.equal(customers[1].email, 'alex@room23.net')
    assert.equal(customers[1].name, 'Alex Buyer')
    assert.equal(customers[1].orderCount, 3)
    assert.equal(customers[1].totalSpent, 100)
    assert.equal(customers[1].lastOrderId, 'R23-NEW')
    assert.equal(customerMatchesQuery(customers[1], 'alex'), true)
    assert.equal(customerMatchesQuery(customers[1], 'buyer'), true)
    assert.equal(customerMatchesQuery(customers[0], 'alex'), false)
    assert.equal(decodeCustomerEmailParam('Alex%40Room23.net'), 'alex@room23.net')
  })

  it('matches order search by id, email, and shipping name', () => {
    const order = {
      orderId: 'R23-ABC',
      email: 'buyer@room23.net',
      shippingAddress: { name: 'Alex Buyer' },
    }
    assert.equal(orderMatchesSearch(order, 'r23-abc'), true)
    assert.equal(orderMatchesSearch(order, 'BUYER@'), true)
    assert.equal(orderMatchesSearch(order, 'alex'), true)
    assert.equal(orderMatchesSearch(order, 'missing'), false)
    assert.equal(adminOrdersHref('open', ' alex@x.com '), '/admin/orders?filter=open&q=alex%40x.com')
    assert.equal(adminOrdersHref('all'), '/admin/orders')
  })

  it('wires customers pages, nav, order search, and existing resend', () => {
    const layout = read('app/admin/layout.tsx')
    const actions = read('app/admin/actions.ts')
    const ordersPage = read('app/admin/orders/page.tsx')
    const customers = read('lib/admin-customers.ts')
    const helpers = read('lib/admin-orders.ts')
    const detail = read('app/admin/orders/[id]/page.tsx')

    assert.match(layout, /href: '\/admin\/customers'/)
    assert.match(customers, /export function aggregateCustomersFromOrders/)
    assert.match(customers, /export async function listAdminCustomers/)
    assert.match(customers, /export async function getAdminCustomer/)
    assert.match(customers, /decodeCustomerEmailParam/)
    assert.match(read('app/admin/customers/page.tsx'), /searchParams: Promise<\{ q\?: string \}>/)
    assert.match(read('app/admin/customers/page.tsx'), /method="get"/)
    assert.match(read('app/admin/customers/[email]/page.tsx'), /await params/)
    assert.match(read('app/admin/customers/[email]/page.tsx'), /\/admin\/orders\/\$\{encodeURIComponent\(order\.orderId\)\}/)
    assert.match(ordersPage, /parseOrderSearch/)
    assert.match(ordersPage, /name="q"/)
    assert.match(ordersPage, /method="get"/)
    assert.match(ordersPage, /No orders match this search/)
    assert.match(helpers, /export function orderSearchQuery/)
    assert.match(helpers, /export function buildOrdersListQuery/)
    assert.match(helpers, /listAdminOrders\(\s*filterOrLimit: OrderFilter \| number = 'all',\s*limit = 100,\s*q = '',/)
    assert.match(actions, /revalidatePath\('\/admin\/customers'\)/)
    assert.match(actions, /export async function resendOrderEmail/)
    assert.match(detail, /resendOrderEmail/)
    assert.match(detail, /adminCustomerHref/)
    assert.match(read('app/admin/page.tsx'), /href="\/admin\/customers"/)
    assert.doesNotMatch(read('app/admin/customers/page.tsx'), /useState/)
    assert.doesNotMatch(ordersPage, /useState/)
  })
})
