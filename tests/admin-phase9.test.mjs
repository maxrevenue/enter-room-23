import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function read(rel) {
  return readFileSync(join(root, rel), 'utf8')
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
const REFUNDED_CANCELLED_STATUSES = ['refunded', 'cancelled', 'canceled']

function startOfUtcDay(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

function analyticsWindowStarts(now = new Date()) {
  return {
    now,
    today: startOfUtcDay(now),
    last7: new Date(now.getTime() - 7 * MS_PER_DAY),
    last30: new Date(now.getTime() - 30 * MS_PER_DAY),
  }
}

function parseOrderDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function isWithinWindow(value, since, until) {
  const date = parseOrderDate(value)
  if (!date) return false
  return date >= since && date <= until
}

function isRefundedOrCancelled(order) {
  return REFUNDED_CANCELLED_STATUSES.includes(String(order.status || 'paid').trim().toLowerCase())
}

function countsTowardRevenue(order) {
  return !isRefundedOrCancelled(order)
}

function orderRevenueTotal(order) {
  if (!countsTowardRevenue(order)) return 0
  const amount = Number(order.totals?.total)
  return Number.isFinite(amount) ? amount : 0
}

function snapshotForWindow(orders, since, until) {
  let orderCount = 0
  let revenue = 0
  for (const order of orders) {
    if (!isWithinWindow(order.createdAt, since, until)) continue
    orderCount += 1
    revenue += orderRevenueTotal(order)
  }
  return { orderCount, revenue }
}

function aggregateTopProducts(orders, since, until, limit = 8) {
  const byId = new Map()
  for (const order of orders) {
    if (!isWithinWindow(order.createdAt, since, until)) continue
    if (!countsTowardRevenue(order)) continue
    for (const item of order.items || []) {
      const id = String(item?.id || item?.name || '').trim() || 'unknown'
      const name = String(item?.name || item?.id || 'Item').trim() || 'Item'
      const qty = Math.max(1, Math.floor(Number(item?.qty) || 1))
      const price = Number(item?.price)
      const line = Number.isFinite(price) ? price * qty : 0
      const current = byId.get(id)
      if (!current) {
        byId.set(id, { id, name, units: qty, revenue: line })
        continue
      }
      current.units += qty
      current.revenue += line
      if (name && name !== 'Item') current.name = name
    }
  }
  return [...byId.values()]
    .sort((a, b) => b.units - a.units || b.revenue - a.revenue || a.name.localeCompare(b.name))
    .slice(0, limit)
}

function csvCell(value) {
  if (value == null || value === '') return ''
  const text = value instanceof Date ? value.toISOString() : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function toCsv(headers, rows) {
  const lines = [headers.map(csvCell).join(',')]
  for (const row of rows) lines.push(row.map(csvCell).join(','))
  return `${lines.join('\r\n')}\r\n`
}

function parseCsvDateParam(value, endOfDay = false) {
  const raw = String(value || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const date = new Date(`${raw}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

function parseOrdersExportStatus(value) {
  const status = String(value || '').trim().toLowerCase()
  if (!status) return ''
  if (status === 'canceled') return 'cancelled'
  if (['paid', 'fulfilled', 'refunded', 'cancelled'].includes(status)) return status
  return ''
}

function buildOrdersExportQuery(filters = {}) {
  const clauses = []
  const status = parseOrdersExportStatus(filters.status)
  if (status === 'cancelled') {
    clauses.push({ status: { $in: ['cancelled', 'canceled'] } })
  } else if (status) {
    clauses.push({ status })
  }
  const from = parseCsvDateParam(filters.from, false)
  const to = parseCsvDateParam(filters.to, true)
  if (from || to) {
    const createdAt = {}
    if (from) createdAt.$gte = from
    if (to) createdAt.$lte = to
    clauses.push({ createdAt })
  }
  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]
  return { $and: clauses }
}

function buildAuditLog(input, at = new Date()) {
  const entry = {
    id: 'aud-test',
    at,
    action: String(input.action || '').trim() || 'unknown',
    entityType: input.entityType,
    entityId: String(input.entityId || '').trim() || 'unknown',
    message: String(input.message || '').trim().slice(0, 500),
    actor: 'admin',
  }
  if (input.meta && typeof input.meta === 'object' && Object.keys(input.meta).length > 0) {
    entry.meta = input.meta
  }
  return entry
}

describe('admin phase 9 analytics, csv, and audit', () => {
  it('counts orders in windows and sums paid+fulfilled revenue only', () => {
    const now = new Date('2026-08-18T18:00:00.000Z')
    const { today, last7, last30 } = analyticsWindowStarts(now)
    const orders = [
      { orderId: 'T1', status: 'paid', totals: { total: 40 }, createdAt: '2026-08-18T12:00:00.000Z' },
      { orderId: 'T2', status: 'fulfilled', totals: { total: 25 }, createdAt: '2026-08-18T01:00:00.000Z' },
      { orderId: 'R1', status: 'refunded', totals: { total: 99 }, createdAt: '2026-08-18T10:00:00.000Z' },
      { orderId: 'W7', status: 'paid', totals: { total: 10 }, createdAt: '2026-08-12T10:00:00.000Z' },
      { orderId: 'W30', status: 'fulfilled', totals: { total: 15 }, createdAt: '2026-07-25T10:00:00.000Z' },
      { orderId: 'OLD', status: 'paid', totals: { total: 80 }, createdAt: '2026-06-01T10:00:00.000Z' },
      { orderId: 'C1', status: 'cancelled', totals: { total: 12 }, createdAt: '2026-08-17T10:00:00.000Z' },
    ]

    assert.deepEqual(snapshotForWindow(orders, today, now), { orderCount: 3, revenue: 65 })
    assert.deepEqual(snapshotForWindow(orders, last7, now), { orderCount: 5, revenue: 75 })
    assert.equal(snapshotForWindow(orders, last30, now).orderCount, 6)
    assert.equal(snapshotForWindow(orders, last30, now).revenue, 90)
    assert.equal(orderRevenueTotal({ status: 'refunded', totals: { total: 50 } }), 0)
  })

  it('ranks top products by units sold in the last 30 days', () => {
    const now = new Date('2026-08-18T18:00:00.000Z')
    const since = new Date(now.getTime() - 30 * MS_PER_DAY)
    const top = aggregateTopProducts(
      [
        {
          status: 'paid',
          createdAt: '2026-08-10T00:00:00.000Z',
          items: [
            { id: 'oil', name: 'Body Oil', qty: 2, price: 40 },
            { id: 'candle', name: 'Candle', qty: 1, price: 28 },
          ],
        },
        {
          status: 'fulfilled',
          createdAt: '2026-08-01T00:00:00.000Z',
          items: [{ id: 'oil', name: 'Body Oil', qty: 3, price: 40 }],
        },
        {
          status: 'refunded',
          createdAt: '2026-08-05T00:00:00.000Z',
          items: [{ id: 'oil', name: 'Body Oil', qty: 9, price: 40 }],
        },
        {
          status: 'paid',
          createdAt: '2026-01-01T00:00:00.000Z',
          items: [{ id: 'legacy', name: 'Legacy', qty: 20, price: 10 }],
        },
      ],
      since,
      now,
    )

    assert.equal(top[0].id, 'oil')
    assert.equal(top[0].units, 5)
    assert.equal(top[0].revenue, 200)
    assert.equal(top[1].id, 'candle')
    assert.equal(top[1].units, 1)
    assert.equal(top.length, 2)
  })

  it('escapes csv cells and filters order exports by status and date', () => {
    const csv = toCsv(
      ['id', 'note'],
      [
        ['R23-1', 'hello, "world"'],
        ['R23-2', 'plain'],
      ],
    )
    assert.equal(csv, 'id,note\r\nR23-1,"hello, ""world"""\r\nR23-2,plain\r\n')

    const query = buildOrdersExportQuery({ status: 'canceled', from: '2026-08-01', to: '2026-08-18' })
    assert.deepEqual(query.$and[0], { status: { $in: ['cancelled', 'canceled'] } })
    assert.equal(query.$and[1].createdAt.$gte.toISOString(), '2026-08-01T00:00:00.000Z')
    assert.equal(query.$and[1].createdAt.$lte.toISOString(), '2026-08-18T23:59:59.999Z')
    assert.deepEqual(buildOrdersExportQuery({ status: 'paid' }), { status: 'paid' })
    assert.deepEqual(buildOrdersExportQuery({ status: 'nope' }), {})
  })

  it('builds audit rows with a hardcoded admin actor', () => {
    const at = new Date('2026-08-18T12:00:00.000Z')
    const entry = buildAuditLog(
      {
        action: 'product.price',
        entityType: 'product',
        entityId: 'body-oil',
        message: 'Price changed',
        meta: { from: 40, to: 48 },
      },
      at,
    )
    assert.equal(entry.actor, 'admin')
    assert.equal(entry.entityType, 'product')
    assert.equal(entry.action, 'product.price')
    assert.equal(entry.meta.from, 40)
    assert.equal(buildAuditLog({ action: 'x', entityType: 'order', entityId: '1', message: 'm' }).meta, undefined)
  })

  it('wires analytics, audit, csv export, and mutation hooks', () => {
    const layout = read('app/admin/layout.tsx')
    const dashboard = read('app/admin/page.tsx')
    const analytics = read('app/admin/analytics/page.tsx')
    const auditPage = read('app/admin/audit/page.tsx')
    const actions = read('app/admin/actions.ts')
    const analyticsLib = read('lib/admin-analytics.ts')
    const auditLib = read('lib/admin-audit.ts')
    const ordersExport = read('app/admin/export/orders/route.ts')
    const productsExport = read('app/admin/export/products/route.ts')

    assert.match(layout, /href: '\/admin\/analytics'/)
    assert.match(layout, /href: '\/admin\/audit'/)
    assert.match(dashboard, /href="\/admin\/analytics"/)
    assert.match(dashboard, /href="\/admin\/audit"/)
    assert.match(dashboard, /href="\/admin\/export\/orders"/)
    assert.match(dashboard, /href="\/admin\/export\/products"/)

    assert.match(analytics, /getAdminAnalytics/)
    assert.match(analytics, /Top products/)
    assert.match(analytics, /Recent refunds/)
    assert.match(analytics, /action="\/admin\/export\/orders"/)
    assert.match(analytics, /href="\/admin\/export\/products"/)
    assert.doesNotMatch(analytics, /use client/)
    assert.doesNotMatch(analytics, /recharts/)
    assert.doesNotMatch(analytics, /dark:/)

    assert.match(auditPage, /listAdminAuditLogs/)
    assert.match(auditPage, /No audit entries yet/)
    assert.doesNotMatch(auditPage, /use client/)

    assert.match(analyticsLib, /countOpenOrders/)
    assert.match(analyticsLib, /countLowStockProducts/)
    assert.match(analyticsLib, /text\/csv/)
    assert.match(analyticsLib, /Content-Disposition/)
    assert.match(analyticsLib, /getRoom23Db/)

    assert.match(auditLib, /audit_logs/)
    assert.match(auditLib, /actor: AUDIT_ACTOR/)
    assert.match(auditLib, /never throws|swallow/)
    assert.match(auditLib, /try \{/)
    assert.match(auditLib, /catch \{/)

    assert.match(ordersExport, /searchParams.get\('status'\)/)
    assert.match(ordersExport, /csvAttachment/)
    assert.match(productsExport, /listProductsForExport/)
    assert.match(ordersExport, /isAdminAuthenticated/)
    assert.match(productsExport, /isAdminAuthenticated/)

    assert.match(actions, /revalidatePath\('\/admin\/analytics'\)/)
    assert.match(actions, /revalidatePath\('\/admin\/audit'\)/)
    assert.match(actions, /action: 'product.price'/)
    assert.match(actions, /action: 'product.hide'/)
    assert.match(actions, /action: 'order.status'/)
    assert.match(actions, /action: 'settings.update'/)
    assert.match(actions, /writeAdminAudit/)
    assert.doesNotMatch(actions, /from 'recharts'/)
  })
})
