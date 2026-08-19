import {
  ORDER_EVENTS_COLLECTION,
  type OrderEventDoc,
  getRoom23Db,
} from '@/lib/admin-db'
import { orderStatusLabel, type AdminOrder } from '@/lib/admin-orders'

export const ORDER_EVENT_TYPES = [
  'created',
  'status_changed',
  'note_updated',
  'reviewed',
  'inventory_decremented',
  'email_sent',
  'flag_note',
  'supplier_submitted',
  'supplier_tracking',
  'supplier_failed',
  'supplier_inventory_checked',
] as const

export type OrderEventType = (typeof ORDER_EVENT_TYPES)[number]
export type OrderEventActor = 'admin' | 'system'

export type OrderEvent = {
  orderId: string
  at: Date | string
  type: OrderEventType
  message: string
  meta?: Record<string, unknown>
  actor?: OrderEventActor
}

export type InsertOrderEventInput = {
  orderId: string
  type: OrderEventType
  message: string
  meta?: Record<string, unknown>
  actor?: OrderEventActor
  at?: Date
}

const TYPE_LABELS: Record<OrderEventType, string> = {
  created: 'Created',
  status_changed: 'Status',
  note_updated: 'Notes',
  reviewed: 'Review',
  inventory_decremented: 'Inventory',
  email_sent: 'Email',
  flag_note: 'Note',
  supplier_submitted: 'Supplier',
  supplier_tracking: 'Tracking',
  supplier_failed: 'Supplier',
  supplier_inventory_checked: 'Supplier stock',
}

export function isOrderEventType(value: string): value is OrderEventType {
  return (ORDER_EVENT_TYPES as readonly string[]).includes(value)
}

export function orderEventTypeLabel(type: OrderEventType) {
  return TYPE_LABELS[type] || 'Event'
}

function parseEventDate(value?: Date | string | null) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function formatOrderEventTime(value?: Date | string | null) {
  const date = parseEventDate(value)
  if (!date) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function docToEvent(doc: OrderEventDoc): OrderEvent | null {
  const orderId = String(doc.orderId || '').trim()
  const type = String(doc.type || '').trim()
  if (!orderId || !isOrderEventType(type)) return null
  return {
    orderId,
    at: doc.at,
    type,
    message: String(doc.message || '').trim() || orderEventTypeLabel(type),
    meta: doc.meta,
    actor: doc.actor === 'admin' || doc.actor === 'system' ? doc.actor : undefined,
  }
}

export function synthesizeOrderTimelineBackfill(order: AdminOrder): OrderEvent {
  const at = parseEventDate(order.createdAt) || new Date()
  const status = orderStatusLabel(order.status)
  return {
    orderId: order.orderId,
    at,
    type: 'created',
    message: `Order recorded · ${status}`,
    actor: 'system',
    meta: { backfill: true, status: order.status || 'paid' },
  }
}

export async function insertOrderEvent(input: InsertOrderEventInput): Promise<void> {
  const orderId = String(input.orderId || '').trim()
  if (!orderId || !isOrderEventType(input.type)) return

  const db = await getRoom23Db()
  if (!db) return

  const doc: OrderEventDoc = {
    orderId,
    at: input.at ?? new Date(),
    type: input.type,
    message: String(input.message || '').trim().slice(0, 500) || orderEventTypeLabel(input.type),
    actor: input.actor === 'system' ? 'system' : 'admin',
  }
  if (input.meta && typeof input.meta === 'object' && Object.keys(input.meta).length > 0) {
    doc.meta = input.meta
  }

  await db.collection<OrderEventDoc>(ORDER_EVENTS_COLLECTION).insertOne(doc)
}

export async function safeInsertOrderEvent(input: InsertOrderEventInput): Promise<void> {
  try {
    await insertOrderEvent(input)
  } catch (error) {
    console.error('[order_events]', error)
  }
}

export async function listOrderEvents(orderId: string, limit = 100): Promise<OrderEvent[]> {
  const id = String(orderId || '').trim()
  if (!id) return []

  const db = await getRoom23Db()
  if (!db) return []

  const docs = await db
    .collection<OrderEventDoc>(ORDER_EVENTS_COLLECTION)
    .find({ orderId: id })
    .sort({ at: -1 })
    .limit(limit)
    .toArray()

  return docs.map(docToEvent).filter((event): event is OrderEvent => event != null)
}

export async function getOrderTimeline(order: AdminOrder, limit = 100): Promise<OrderEvent[]> {
  const events = await listOrderEvents(order.orderId, limit)
  if (events.length > 0) return events
  return [synthesizeOrderTimelineBackfill(order)]
}
