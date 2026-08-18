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

export const FULFILLED_LIKE_STATUSES = [
  'fulfilled',
  'shipped',
  'delivered',
  'complete',
  'completed',
] as const

export const REFUNDED_CANCELLED_STATUSES = ['refunded', 'cancelled', 'canceled'] as const

export const ORDER_FILTERS = ['all', 'open', 'fulfilled', 'closed'] as const
export type OrderFilter = (typeof ORDER_FILTERS)[number]

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
  createdAt?: Date | string
  updatedAt?: Date | string
  emailSent?: boolean
  adminReview?: boolean
  fulfilled?: boolean
  inventoryDecremented?: boolean
  fulfillment?: { status?: string; splitFulfillment?: boolean } | null
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  fulfilled: 'Fulfilled',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
  shipped: 'Shipped',
  delivered: 'Delivered',
  complete: 'Complete',
  completed: 'Complete',
  needs_review: 'Needs review',
  split: 'Split',
  routed: 'Routed',
}

const BADGE_BASE =
  'inline-flex border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]'

const STATUS_BADGE_CLASS: Record<string, string> = {
  paid: `${BADGE_BASE} border-zinc-500 text-zinc-200`,
  fulfilled: `${BADGE_BASE} border-zinc-300 text-zinc-100`,
  refunded: `${BADGE_BASE} border-zinc-600 text-zinc-400`,
  cancelled: `${BADGE_BASE} border-zinc-700 text-zinc-500`,
  canceled: `${BADGE_BASE} border-zinc-700 text-zinc-500`,
  shipped: `${BADGE_BASE} border-zinc-400 text-zinc-200`,
  delivered: `${BADGE_BASE} border-zinc-400 text-zinc-200`,
  complete: `${BADGE_BASE} border-zinc-400 text-zinc-200`,
  completed: `${BADGE_BASE} border-zinc-400 text-zinc-200`,
}

const DEFAULT_BADGE_CLASS = `${BADGE_BASE} border-zinc-700 text-zinc-400`

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

export function parseOrderFilter(value?: string | string[] | null): OrderFilter {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw && (ORDER_FILTERS as readonly string[]).includes(raw)) return raw as OrderFilter
  return 'all'
}

export function normalizeOrderStatus(status?: string) {
  return String(status || 'paid').trim().toLowerCase() || 'paid'
}

export function isClosedOrderStatus(status?: string) {
  return CLOSED_ORDER_STATUSES.includes(normalizeOrderStatus(status))
}

export function isOrderFulfilled(order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment'>) {
  if (order.fulfilled === true) return true
  const status = normalizeOrderStatus(order.status)
  if ((FULFILLED_LIKE_STATUSES as readonly string[]).includes(status)) return true
  return normalizeOrderStatus(order.fulfillment?.status) === 'fulfilled'
}

export function isOpenOrder(order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment'>) {
  return !isClosedOrderStatus(order.status) && order.fulfilled !== true
}

export function isRefundedOrCancelled(order: Pick<AdminOrder, 'status'>) {
  return (REFUNDED_CANCELLED_STATUSES as readonly string[]).includes(normalizeOrderStatus(order.status))
}

export function coerceOrderStatus(status?: string): OrderStatus {
  const value = normalizeOrderStatus(status)
  if (isOrderStatus(value)) return value
  if ((FULFILLED_LIKE_STATUSES as readonly string[]).includes(value)) return 'fulfilled'
  if ((REFUNDED_CANCELLED_STATUSES as readonly string[]).includes(value)) return 'cancelled'
  return 'paid'
}

export function orderStatusLabel(status?: string) {
  const value = normalizeOrderStatus(status)
  if (STATUS_LABELS[value]) return STATUS_LABELS[value]
  if (!status) return 'Paid'
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function orderStatusBadgeClass(status?: string) {
  return STATUS_BADGE_CLASS[normalizeOrderStatus(status)] || DEFAULT_BADGE_CLASS
}

export function orderItemCount(order: Pick<AdminOrder, 'items'>) {
  if (!Array.isArray(order.items) || order.items.length === 0) return 0
  return order.items.reduce((sum, item) => {
    const qty = Number(item?.qty)
    return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1)
  }, 0)
}

export function formatOrderMoney(value?: number | null) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return `$${amount.toFixed(2)}`
}

export function formatOrderDate(value?: Date | string | null) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatOrderDateTime(value?: Date | string | null) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function openOrdersQuery() {
  return {
    $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }],
  }
}

export function orderFilterQuery(filter: OrderFilter = 'all') {
  if (filter === 'open') return openOrdersQuery()
  if (filter === 'fulfilled') {
    return {
      $or: [{ status: { $in: [...FULFILLED_LIKE_STATUSES] } }, { fulfilled: true }],
    }
  }
  if (filter === 'closed') {
    return { status: { $in: [...REFUNDED_CANCELLED_STATUSES] } }
  }
  return {}
}

export function shouldDecrementInventory(order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'inventoryDecremented'>, nextStatus: string) {
  if (nextStatus !== 'fulfilled') return false
  if (order.inventoryDecremented === true) return false
  if (isOrderFulfilled(order)) return false
  return true
}

export function nextQuantityAfterDecrement(current: number | null | undefined, orderedQty: number) {
  if (typeof current !== 'number' || !Number.isFinite(current)) return null
  const qty = Math.max(1, Math.floor(Number(orderedQty) || 1))
  return Math.max(0, Math.floor(current) - qty)
}

export function buildOrderStatusUpdate(status: OrderStatus) {
  const now = new Date()
  const update: Record<string, unknown> = {
    status,
    fulfilled: status === 'fulfilled',
    updatedAt: now,
  }

  if (status === 'fulfilled') {
    update['fulfillment.status'] = 'fulfilled'
  }

  if (status === 'refunded' || status === 'cancelled') {
    update.fulfilled = false
  }

  return update
}

export function orderLineTotal(item?: { qty?: number; price?: number }) {
  const qty = Number(item?.qty)
  const price = Number(item?.price)
  const safeQty = Number.isFinite(qty) && qty > 0 ? qty : 1
  if (!Number.isFinite(price)) return null
  return safeQty * price
}

export async function listAdminOrders(
  filterOrLimit: OrderFilter | number = 'all',
  limit = 100,
): Promise<AdminOrder[]> {
  const filter = typeof filterOrLimit === 'number' ? 'all' : filterOrLimit
  const cap = typeof filterOrLimit === 'number' ? filterOrLimit : limit
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find(orderFilterQuery(filter))
    .sort({ createdAt: -1 })
    .limit(cap)
    .toArray()
}

export async function listRecentOpenOrders(limit = 5): Promise<AdminOrder[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find(openOrdersQuery())
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

export async function getAdminOrder(orderId: string): Promise<AdminOrder | null> {
  const db = await getRoom23Db()
  if (!db) return null
  return db.collection<AdminOrder>('orders').findOne({ orderId })
}

export async function countOpenOrders(): Promise<number> {
  const db = await getRoom23Db()
  if (!db) return 0
  return db.collection('orders').countDocuments(openOrdersQuery())
}
