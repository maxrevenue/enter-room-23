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
  fulfillment?: { status?: string } | null
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value)
}

export async function listAdminOrders(limit = 50): Promise<AdminOrder[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find({})
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
  return db.collection('orders').countDocuments({
    $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }],
  })
}
