import { getRoom23Db } from '@/lib/admin-db'
import {
  formatOrderDate,
  formatOrderMoney,
  isRefundedOrCancelled,
  type AdminOrder,
} from '@/lib/admin-orders'

export const CUSTOMER_AGGREGATION_LIMIT = 5000

export type AdminCustomer = {
  email: string
  name: string
  orderCount: number
  totalSpent: number
  lastOrderAt?: Date | string | null
  lastOrderId?: string
  shippingAddress?: AdminOrder['shippingAddress']
}

export function normalizeCustomerEmail(email?: string | null) {
  return String(email || '').trim().toLowerCase()
}

export function decodeCustomerEmailParam(raw?: string | null) {
  const value = String(raw || '')
  try {
    return normalizeCustomerEmail(decodeURIComponent(value))
  } catch {
    return normalizeCustomerEmail(value)
  }
}

export function parseCustomerSearch(value?: string | string[] | null) {
  const raw = Array.isArray(value) ? value[0] : value
  return String(raw || '').trim().slice(0, 80)
}

export function customerNameFromOrder(order: Pick<AdminOrder, 'shippingAddress'>) {
  return String(order.shippingAddress?.name || '').trim()
}

export function orderCountsTowardSpend(order: Pick<AdminOrder, 'status'>) {
  return !isRefundedOrCancelled(order)
}

export function orderSpendAmount(order: Pick<AdminOrder, 'totals'>) {
  const amount = Number(order.totals?.total)
  return Number.isFinite(amount) ? amount : 0
}

export function orderTimestamp(value?: Date | string | null) {
  if (!value) return 0
  const date = value instanceof Date ? value : new Date(value)
  const time = date.getTime()
  return Number.isNaN(time) ? 0 : time
}

export function customerMatchesQuery(customer: Pick<AdminCustomer, 'email' | 'name'>, q?: string) {
  const needle = String(q || '').trim().toLowerCase()
  if (!needle) return true
  return customer.email.includes(needle) || customer.name.toLowerCase().includes(needle)
}

export function adminCustomersHref(q = '') {
  const needle = String(q || '').trim()
  return needle ? `/admin/customers?q=${encodeURIComponent(needle)}` : '/admin/customers'
}

export function adminCustomerHref(email: string) {
  return `/admin/customers/${encodeURIComponent(normalizeCustomerEmail(email))}`
}

export function formatCustomerSpend(value?: number | null) {
  return formatOrderMoney(value)
}

export function formatCustomerDate(value?: Date | string | null) {
  return formatOrderDate(value)
}

export function aggregateCustomersFromOrders(orders: AdminOrder[]): AdminCustomer[] {
  const byEmail = new Map<string, AdminCustomer & { lastTs: number }>()

  for (const order of orders) {
    const email = normalizeCustomerEmail(order.email)
    if (!email) continue

    const ts = orderTimestamp(order.createdAt)
    const name = customerNameFromOrder(order)
    const spend = orderCountsTowardSpend(order) ? orderSpendAmount(order) : 0
    const current = byEmail.get(email)

    if (!current) {
      byEmail.set(email, {
        email,
        name,
        orderCount: 1,
        totalSpent: spend,
        lastOrderAt: order.createdAt || null,
        lastOrderId: order.orderId,
        shippingAddress: order.shippingAddress || null,
        lastTs: ts,
      })
      continue
    }

    current.orderCount += 1
    current.totalSpent += spend
    if (ts >= current.lastTs) {
      current.lastTs = ts
      current.lastOrderAt = order.createdAt || current.lastOrderAt
      current.lastOrderId = order.orderId
      if (name) current.name = name
      if (order.shippingAddress) current.shippingAddress = order.shippingAddress
    } else if (!current.name && name) {
      current.name = name
    }
  }

  return [...byEmail.values()]
    .sort((a, b) => b.lastTs - a.lastTs || a.email.localeCompare(b.email))
    .map(({ lastTs: _lastTs, ...customer }) => customer)
}

export async function listAdminCustomers(q = ''): Promise<AdminCustomer[]> {
  const db = await getRoom23Db()
  if (!db) return []
  const orders = await db
    .collection<AdminOrder>('orders')
    .find({ email: { $type: 'string', $ne: '' } })
    .sort({ createdAt: -1 })
    .limit(CUSTOMER_AGGREGATION_LIMIT)
    .toArray()
  const customers = aggregateCustomersFromOrders(orders)
  const needle = parseCustomerSearch(q)
  if (!needle) return customers
  return customers.filter((customer) => customerMatchesQuery(customer, needle))
}

export async function getAdminCustomer(email: string): Promise<{
  customer: AdminCustomer
  orders: AdminOrder[]
} | null> {
  const normalized = normalizeCustomerEmail(email)
  if (!normalized) return null
  const db = await getRoom23Db()
  if (!db) return null

  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const orders = await db
    .collection<AdminOrder>('orders')
    .find({ email: { $regex: `^${escaped}$`, $options: 'i' } })
    .sort({ createdAt: -1 })
    .limit(CUSTOMER_AGGREGATION_LIMIT)
    .toArray()

  const [customer] = aggregateCustomersFromOrders(orders)
  if (!customer) return null
  return { customer, orders }
}
