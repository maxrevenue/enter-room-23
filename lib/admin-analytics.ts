import {
  countLowStockProducts,
  isArchived,
  listAdminProducts,
  quantityOf,
  type CatalogProduct,
} from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import {
  countOpenOrders,
  isOrderStatus,
  isRefundedOrCancelled,
  orderItemCount,
  ORDER_STATUSES,
  type AdminOrder,
} from '@/lib/admin-orders'

export const ANALYTICS_ORDER_SCAN_LIMIT = 2000
export const TOP_PRODUCTS_LIMIT = 8
export const RECENT_REFUNDS_LIMIT = 8
export const MS_PER_DAY = 24 * 60 * 60 * 1000

export type AnalyticsWindowKey = 'today' | 'last7' | 'last30'

export type AnalyticsWindowSnapshot = {
  orderCount: number
  revenue: number
}

export type TopProductRow = {
  id: string
  name: string
  units: number
  revenue: number
}

export type RefundRow = {
  orderId: string
  email?: string
  status?: string
  total?: number
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type AdminAnalytics = {
  windows: Record<AnalyticsWindowKey, AnalyticsWindowSnapshot>
  openOrders: number
  lowStock: number
  topProducts: TopProductRow[]
  recentRefunds: RefundRow[]
}

export type OrdersExportFilters = {
  status?: string | null
  from?: string | null
  to?: string | null
}

export function startOfUtcDay(now = new Date()) {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
}

export function analyticsWindowStarts(now = new Date()) {
  return {
    now,
    today: startOfUtcDay(now),
    last7: new Date(now.getTime() - 7 * MS_PER_DAY),
    last30: new Date(now.getTime() - 30 * MS_PER_DAY),
  }
}

export function parseOrderDate(value?: Date | string | null): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function isWithinWindow(value: Date | string | null | undefined, since: Date, until: Date) {
  const date = parseOrderDate(value)
  if (!date) return false
  return date >= since && date <= until
}

export function countsTowardRevenue(order: Pick<AdminOrder, 'status'>) {
  return !isRefundedOrCancelled(order)
}

export function orderRevenueTotal(order: Pick<AdminOrder, 'status' | 'totals'>) {
  if (!countsTowardRevenue(order)) return 0
  const amount = Number(order.totals?.total)
  return Number.isFinite(amount) ? amount : 0
}

export function snapshotForWindow(
  orders: Array<Pick<AdminOrder, 'status' | 'totals' | 'createdAt'>>,
  since: Date,
  until: Date,
): AnalyticsWindowSnapshot {
  let orderCount = 0
  let revenue = 0
  for (const order of orders) {
    if (!isWithinWindow(order.createdAt, since, until)) continue
    orderCount += 1
    revenue += orderRevenueTotal(order)
  }
  return { orderCount, revenue }
}

export function aggregateTopProducts(
  orders: Array<Pick<AdminOrder, 'status' | 'items' | 'createdAt'>>,
  since: Date,
  until: Date,
  limit = TOP_PRODUCTS_LIMIT,
): TopProductRow[] {
  const byId = new Map<string, TopProductRow>()

  for (const order of orders) {
    if (!isWithinWindow(order.createdAt, since, until)) continue
    if (!countsTowardRevenue(order)) continue
    const items = Array.isArray(order.items) ? order.items : []
    for (const item of items) {
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
    .slice(0, Math.max(1, limit))
}

export function parseCsvDateParam(value?: string | null, endOfDay = false): Date | null {
  const raw = String(value || '').trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const date = new Date(`${raw}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function parseOrdersExportStatus(value?: string | null) {
  const status = String(value || '').trim().toLowerCase()
  if (!status) return ''
  if (status === 'canceled') return 'cancelled'
  if (isOrderStatus(status)) return status
  return ''
}

export function buildOrdersExportQuery(filters: OrdersExportFilters = {}) {
  const clauses: Record<string, unknown>[] = []
  const status = parseOrdersExportStatus(filters.status)
  if (status === 'cancelled') {
    clauses.push({ status: { $in: ['cancelled', 'canceled'] } })
  } else if (status) {
    clauses.push({ status })
  }

  const from = parseCsvDateParam(filters.from, false)
  const to = parseCsvDateParam(filters.to, true)
  if (from || to) {
    const createdAt: Record<string, Date> = {}
    if (from) createdAt.$gte = from
    if (to) createdAt.$lte = to
    clauses.push({ createdAt })
  }

  if (clauses.length === 0) return {}
  if (clauses.length === 1) return clauses[0]
  return { $and: clauses }
}

export function csvCell(value: unknown) {
  if (value == null || value === '') return ''
  const text = value instanceof Date ? value.toISOString() : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCsv(headers: string[], rows: Array<Array<unknown>>) {
  const lines = [headers.map(csvCell).join(',')]
  for (const row of rows) lines.push(row.map(csvCell).join(','))
  return `${lines.join('\r\n')}\r\n`
}

export function csvFilename(prefix: string, now = new Date()) {
  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  return `${prefix}-${year}${month}${day}.csv`
}

export function csvAttachment(filename: string, body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

export function ordersToCsv(orders: AdminOrder[]) {
  const headers = [
    'orderId',
    'email',
    'status',
    'createdAt',
    'items',
    'subtotal',
    'shipping',
    'tax',
    'total',
    'name',
    'city',
    'state',
    'country',
  ]
  const rows = orders.map((order) => {
    const created = parseOrderDate(order.createdAt)
    return [
      order.orderId,
      order.email || '',
      order.status || 'paid',
      created ? created.toISOString() : '',
      orderItemCount(order),
      order.totals?.subtotal ?? '',
      order.totals?.shipping ?? '',
      order.totals?.tax ?? '',
      order.totals?.total ?? '',
      order.shippingAddress?.name || '',
      order.shippingAddress?.city || '',
      order.shippingAddress?.state || '',
      order.shippingAddress?.country || '',
    ]
  })
  return toCsv(headers, rows)
}

export function productsToCsv(products: CatalogProduct[]) {
  const headers = ['id', 'slug', 'name', 'price', 'quantity', 'category', 'status', 'featured', 'source']
  const rows = products.map((product) => [
    product.id,
    product.slug || product.id,
    product.name,
    product.price,
    quantityOf(product) ?? '',
    product.category || '',
    isArchived(product) ? 'archived' : 'active',
    product.isProductOfTheMonth || product.isFeatured ? 'yes' : '',
    product.source || 'catalog',
  ])
  return toCsv(headers, rows)
}

const EMPTY_WINDOW: AnalyticsWindowSnapshot = { orderCount: 0, revenue: 0 }

export function emptyAdminAnalytics(): AdminAnalytics {
  return {
    windows: {
      today: { ...EMPTY_WINDOW },
      last7: { ...EMPTY_WINDOW },
      last30: { ...EMPTY_WINDOW },
    },
    openOrders: 0,
    lowStock: 0,
    topProducts: [],
    recentRefunds: [],
  }
}

export async function getAdminAnalytics(now = new Date()): Promise<AdminAnalytics> {
  const { today, last7, last30 } = analyticsWindowStarts(now)
  const db = await getRoom23Db()

  const [openOrders, lowStock] = await Promise.all([countOpenOrders(), countLowStockProducts()])

  if (!db) {
    return { ...emptyAdminAnalytics(), openOrders, lowStock }
  }

  const [recentOrders, recentRefunds] = await Promise.all([
    db
      .collection<AdminOrder>('orders')
      .find({ createdAt: { $gte: last30 } })
      .sort({ createdAt: -1 })
      .limit(ANALYTICS_ORDER_SCAN_LIMIT)
      .toArray(),
    db
      .collection<AdminOrder>('orders')
      .find({ status: { $in: ['refunded', 'cancelled', 'canceled'] } })
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(RECENT_REFUNDS_LIMIT)
      .toArray(),
  ])

  return {
    windows: {
      today: snapshotForWindow(recentOrders, today, now),
      last7: snapshotForWindow(recentOrders, last7, now),
      last30: snapshotForWindow(recentOrders, last30, now),
    },
    openOrders,
    lowStock,
    topProducts: aggregateTopProducts(recentOrders, last30, now),
    recentRefunds: recentRefunds.map((order) => ({
      orderId: order.orderId,
      email: order.email,
      status: order.status,
      total: order.totals?.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    })),
  }
}

export async function listOrdersForExport(filters: OrdersExportFilters = {}): Promise<AdminOrder[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find(buildOrdersExportQuery(filters))
    .sort({ createdAt: -1 })
    .limit(ANALYTICS_ORDER_SCAN_LIMIT)
    .toArray()
}

export async function listProductsForExport(): Promise<CatalogProduct[]> {
  return listAdminProducts()
}

export const ORDER_EXPORT_STATUSES = ORDER_STATUSES
