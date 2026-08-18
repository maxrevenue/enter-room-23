import { getRoom23Db } from '@/lib/admin-db'

export const ORDER_STATUSES = ['paid', 'fulfilled', 'refunded', 'cancelled'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const CLOSED_ORDER_STATUSES = [
  'fulfilled',
  'refunded',
  'cancelled',
  'shipped',
  'delivered',
  'complete',
  'completed',
]

export const ORDER_LIST_FILTERS = ['all', 'open', 'fulfilled', 'closed'] as const
export type OrderListFilter = (typeof ORDER_LIST_FILTERS)[number]

export type AdminOrder = {
  orderId: string
  email?: string
  shippingAddress?: {
    name?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  } | null
  items?: Array<{ id?: string; name?: string; qty?: number; price?: number }>
  totals?: { subtotal?: number; shipping?: number; tax?: number; total?: number } | null
  status?: string
  notes?: string
  adminNotes?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  emailSent?: boolean
  adminReview?: boolean
  fulfilled?: boolean
  fulfillment?: { status?: string; splitFulfillment?: boolean } | null
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

export function normalizeOrderFilter(value?: string): OrderListFilter {
  if (value === 'open' || value === 'fulfilled' || value === 'closed') return value
  return 'all'
}

export function isClosedOrderStatus(status?: string) {
  return CLOSED_ORDER_STATUSES.includes(String(status || '').toLowerCase())
}

export function isOrderFulfilled(order: AdminOrder) {
  const status = String(order.status || '').toLowerCase()
  return (
    order.fulfilled === true ||
    status === 'fulfilled' ||
    status === 'shipped' ||
    status === 'delivered' ||
    String(order.fulfillment?.status || '').toLowerCase() === 'fulfilled'
  )
}

export function isOrderOpen(order: AdminOrder) {
  return !isClosedOrderStatus(order.status) && order.fulfilled !== true
}

export function orderItemCount(order: AdminOrder) {
  if (!Array.isArray(order.items)) return 0
  return order.items.reduce((sum, item) => sum + Math.max(1, Math.floor(Number(item.qty) || 1)), 0)
}

export function orderNotes(order: AdminOrder) {
  return String(order.notes || order.adminNotes || '')
}

export function formatOrderMoney(value?: number) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return `$${amount.toFixed(2)}`
}

export function formatOrderDate(value?: Date | string, withTime = false) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  if (withTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function orderStatusLabel(status?: string) {
  const value = String(status || 'paid').trim() || 'paid'
  return value.replace(/-/g, ' ')
}

export function orderStatusClass(status?: string) {
  const value = String(status || 'paid').toLowerCase()
  if (
    value === 'fulfilled' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'complete' ||
    value === 'completed'
  ) {
    return 'border-zinc-200 bg-zinc-100 text-zinc-950'
  }
  if (value === 'cancelled' || value === 'refunded') {
    return 'border-zinc-800 bg-zinc-950 text-zinc-500'
  }
  return 'border-zinc-700 bg-zinc-900 text-zinc-200'
}

export function orderStatusPatch(status: OrderStatus) {
  const now = new Date()
  if (status === 'fulfilled') {
    return {
      status,
      fulfilled: true,
      fulfillment: { status: 'fulfilled' },
      updatedAt: now,
    }
  }
  if (status === 'refunded' || status === 'cancelled') {
    return {
      status,
      fulfilled: true,
      fulfillment: { status },
      updatedAt: now,
    }
  }
  return {
    status,
    fulfilled: false,
    fulfillment: { status: 'open' },
    updatedAt: now,
  }
}

function orderFilterQuery(filter: OrderListFilter) {
  if (filter === 'open') {
    return {
      $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }],
    }
  }
  if (filter === 'fulfilled') {
    return {
      $or: [
        { status: 'fulfilled' },
        { status: { $in: ['shipped', 'delivered', 'complete', 'completed'] } },
        { 'fulfillment.status': 'fulfilled' },
        { fulfilled: true, status: { $nin: ['refunded', 'cancelled'] } },
      ],
    }
  }
  if (filter === 'closed') {
    return { status: { $in: ['refunded', 'cancelled'] } }
  }
  return {}
}

export async function listAdminOrders(limit = 80, filter: OrderListFilter = 'all'): Promise<AdminOrder[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find(orderFilterQuery(filter))
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

export async function listRecentOpenOrders(limit = 5): Promise<AdminOrder[]> {
  return listAdminOrders(limit, 'open')
}

export async function getAdminOrder(orderId: string): Promise<AdminOrder | null> {
  const db = await getRoom23Db()
  if (!db) return null
  return db.collection<AdminOrder>('orders').findOne({ orderId })
}

export async function countOpenOrders(): Promise<number> {
  const db = await getRoom23Db()
  if (!db) return 0
  return db.collection('orders').countDocuments({
    $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }],
  })
}
