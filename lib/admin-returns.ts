import {
  getAdminProduct,
  inventoryStatusFromQuantity,
  isArchived,
  quantityOf,
  visibilityFields,
} from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import { handleStockAlertAfterQuantityChange } from '@/lib/admin-stock-alerts'
import type { AdminOrder } from '@/lib/admin-orders'

export const RMAS_COLLECTION = 'rmas'

export const RMA_STATUSES = [
  'requested',
  'approved',
  'received',
  'restocked',
  'closed',
  'rejected',
] as const

export type RmaStatus = (typeof RMA_STATUSES)[number]

export const RMA_RESOLUTIONS = [
  'refund_pending',
  'refund_done_manual',
  'store_credit_note',
  'destroy',
  'restock',
] as const

export type RmaResolution = (typeof RMA_RESOLUTIONS)[number]

export const OPEN_RMA_STATUSES: RmaStatus[] = ['requested', 'approved', 'received']

export type RmaItem = {
  productId: string
  name: string
  qty: number
}

export type AdminRma = {
  id: string
  orderId: string
  email?: string
  items: RmaItem[]
  reason: string
  status: RmaStatus
  resolution?: RmaResolution
  restockApplied: boolean
  notes?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

const STATUS_LABELS: Record<RmaStatus, string> = {
  requested: 'Requested',
  approved: 'Approved',
  received: 'Received',
  restocked: 'Restocked',
  closed: 'Closed',
  rejected: 'Rejected',
}

const RESOLUTION_LABELS: Record<RmaResolution, string> = {
  refund_pending: 'Refund pending (CCBill manual)',
  refund_done_manual: 'Refund done (manual)',
  store_credit_note: 'Store credit note',
  destroy: 'Destroy / discard',
  restock: 'Restock inventory',
}

const STATUS_TRANSITIONS: Record<RmaStatus, RmaStatus[]> = {
  requested: ['approved', 'rejected'],
  approved: ['received', 'rejected'],
  received: ['restocked', 'closed'],
  restocked: ['closed'],
  rejected: ['closed'],
  closed: [],
}

const BADGE_BASE =
  'inline-flex border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]'

const STATUS_BADGE_CLASS: Record<RmaStatus, string> = {
  requested: `${BADGE_BASE} border-zinc-500 text-zinc-200`,
  approved: `${BADGE_BASE} border-zinc-400 text-zinc-100`,
  received: `${BADGE_BASE} border-zinc-600 text-zinc-300`,
  restocked: `${BADGE_BASE} border-zinc-300 text-zinc-100`,
  closed: `${BADGE_BASE} border-zinc-700 text-zinc-500`,
  rejected: `${BADGE_BASE} border-zinc-700 text-zinc-500`,
}

export function isRmaStatus(value?: string | null): value is RmaStatus {
  return Boolean(value && (RMA_STATUSES as readonly string[]).includes(value))
}

export function isRmaResolution(value?: string | null): value is RmaResolution {
  return Boolean(value && (RMA_RESOLUTIONS as readonly string[]).includes(value))
}

export function parseRmaListFilter(value?: string | string[] | null): RmaStatus | 'all' | 'open' {
  const raw = String(Array.isArray(value) ? value[0] : value || '')
    .trim()
    .toLowerCase()
  if (raw === 'open') return 'open'
  if (raw === 'all' || !raw) return 'all'
  if (isRmaStatus(raw)) return raw
  return 'all'
}

export function rmaStatusLabel(status?: string) {
  const value = String(status || 'requested').trim().toLowerCase()
  if (isRmaStatus(value)) return STATUS_LABELS[value]
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function rmaResolutionLabel(resolution?: string) {
  const value = String(resolution || '').trim().toLowerCase()
  if (isRmaResolution(value)) return RESOLUTION_LABELS[value]
  if (!value) return '—'
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function rmaStatusBadgeClass(status?: string) {
  const value = String(status || 'requested').trim().toLowerCase()
  if (isRmaStatus(value)) return STATUS_BADGE_CLASS[value]
  return `${BADGE_BASE} border-zinc-700 text-zinc-400`
}

export function allowedRmaStatusTransitions(status: RmaStatus): RmaStatus[] {
  return STATUS_TRANSITIONS[status] || []
}

export function isOpenRmaStatus(status?: string) {
  return OPEN_RMA_STATUSES.includes(String(status || '').trim().toLowerCase() as RmaStatus)
}

export function adminReturnsHref(status: RmaStatus | 'all' | 'open' = 'all') {
  if (status === 'all') return '/admin/returns'
  return `/admin/returns?status=${encodeURIComponent(status)}`
}

export function formatRmaDate(value?: Date | string | null) {
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

export function generateRmaId(orderId: string, now = new Date()) {
  const suffix = now.getTime().toString(36).toUpperCase().slice(-8)
  const orderPart = String(orderId || 'ORDER')
    .replace(/[^A-Z0-9]/gi, '')
    .slice(-6)
    .toUpperCase()
  return `RMA-${orderPart || 'X'}-${suffix}`
}

function docToRma(doc: Record<string, unknown> | null | undefined): AdminRma | null {
  if (!doc) return null
  const id = String(doc.id || '').trim()
  const orderId = String(doc.orderId || '').trim()
  if (!id || !orderId) return null

  const statusRaw = String(doc.status || 'requested').trim().toLowerCase()
  const status = isRmaStatus(statusRaw) ? statusRaw : 'requested'
  const resolutionRaw = String(doc.resolution || '').trim().toLowerCase()
  const resolution = isRmaResolution(resolutionRaw) ? resolutionRaw : undefined

  const items = Array.isArray(doc.items)
    ? doc.items
        .map((entry) => {
          if (!entry || typeof entry !== 'object') return null
          const record = entry as { productId?: unknown; name?: unknown; qty?: unknown }
          const productId = String(record.productId || '').trim()
          if (!productId) return null
          const qty = Math.max(1, Math.floor(Number(record.qty) || 1))
          return {
            productId,
            name: String(record.name || productId).trim() || productId,
            qty,
          }
        })
        .filter((item): item is RmaItem => item != null)
    : []

  return {
    id,
    orderId,
    email: String(doc.email || '').trim() || undefined,
    items,
    reason: String(doc.reason || '').trim(),
    status,
    resolution,
    restockApplied: doc.restockApplied === true,
    notes: String(doc.notes || '').trim() || undefined,
    createdAt: doc.createdAt as Date | string | undefined,
    updatedAt: doc.updatedAt as Date | string | undefined,
  }
}

function listFilterQuery(filter: RmaStatus | 'all' | 'open') {
  if (filter === 'open') return { status: { $in: OPEN_RMA_STATUSES } }
  if (filter === 'all') return {}
  return { status: filter }
}

export async function listAdminRmas(
  filter: RmaStatus | 'all' | 'open' = 'all',
  limit = 100,
): Promise<AdminRma[]> {
  const db = await getRoom23Db()
  if (!db) return []
  const docs = await db
    .collection(RMAS_COLLECTION)
    .find(listFilterQuery(filter))
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
  return docs.map((doc) => docToRma(doc)).filter((rma): rma is AdminRma => rma != null)
}

export async function listRmasForOrder(orderId: string): Promise<AdminRma[]> {
  const id = String(orderId || '').trim()
  if (!id) return []
  const db = await getRoom23Db()
  if (!db) return []
  const docs = await db
    .collection(RMAS_COLLECTION)
    .find({ orderId: id })
    .sort({ createdAt: -1 })
    .toArray()
  return docs.map((doc) => docToRma(doc)).filter((rma): rma is AdminRma => rma != null)
}

export async function getAdminRma(id: string): Promise<AdminRma | null> {
  const rmaId = String(id || '').trim()
  if (!rmaId) return null
  const db = await getRoom23Db()
  if (!db) return null
  const doc = await db.collection(RMAS_COLLECTION).findOne({ id: rmaId })
  return docToRma(doc)
}

export async function countOpenRmas(): Promise<number> {
  const db = await getRoom23Db()
  if (!db) return 0
  return db.collection(RMAS_COLLECTION).countDocuments({ status: { $in: OPEN_RMA_STATUSES } })
}

export async function listOpenRmas(limit = 8): Promise<AdminRma[]> {
  return listAdminRmas('open', limit)
}

export function parseCreateRmaItems(formData: FormData, order: AdminOrder): RmaItem[] {
  const lineCount = Math.max(0, Math.floor(Number(formData.get('lineCount')) || 0))
  const orderItems = Array.isArray(order.items) ? order.items : []
  const selected: RmaItem[] = []

  for (let index = 0; index < lineCount; index++) {
    if (String(formData.get(`include_${index}`) || '') !== 'on') continue
    const fallback = orderItems[index]
    const productId = String(formData.get(`productId_${index}`) || fallback?.id || '').trim()
    if (!productId) continue
    const name = String(formData.get(`name_${index}`) || fallback?.name || productId).trim() || productId
    const maxQty = Math.max(1, Math.floor(Number(fallback?.qty) || 1))
    const qty = Math.min(maxQty, Math.max(1, Math.floor(Number(formData.get(`qty_${index}`)) || maxQty)))
    selected.push({ productId, name, qty })
  }

  return selected
}

export type ApplyRmaRestockResult = 'applied' | 'already' | 'missing' | 'skip'

export async function applyRmaRestock(rmaId: string): Promise<ApplyRmaRestockResult> {
  const id = String(rmaId || '').trim()
  if (!id) return 'missing'

  const db = await getRoom23Db()
  if (!db) return 'missing'

  const existing = await getAdminRma(id)
  if (!existing) return 'missing'
  if (existing.resolution !== 'restock' || existing.status !== 'restocked') return 'skip'

  const claim = await db.collection(RMAS_COLLECTION).findOneAndUpdate(
    { id, restockApplied: { $ne: true } },
    { $set: { restockApplied: true, updatedAt: new Date() } },
    { returnDocument: 'after' },
  )

  const claimed = docToRma(claim)
  if (!claimed) return 'already'

  for (const item of claimed.items) {
    const productId = String(item.productId || '').trim()
    if (!productId) continue
    const product = await getAdminProduct(productId)
    if (!product) continue

    const orderedQty = Math.max(1, Math.floor(Number(item.qty) || 1))
    const current = quantityOf(product)
    const nextQuantity = current == null ? orderedQty : current + orderedQty
    const now = new Date()

    await db.collection('products').updateOne(
      { id: productId },
      {
        $set: {
          id: productId,
          quantity: nextQuantity,
          inventoryStatus: inventoryStatusFromQuantity(nextQuantity, product.inventoryStatus),
          updatedAt: now,
        },
        $setOnInsert: {
          name: product.name,
          slug: product.slug || productId,
          price: product.price,
          category: product.category,
          ...visibilityFields(isArchived(product)),
          isProductOfTheMonth: Boolean(product.isProductOfTheMonth),
          isFeatured: Boolean(product.isFeatured),
          createdAt: now,
        },
      },
      { upsert: true },
    )

    await handleStockAlertAfterQuantityChange({
      productId,
      productName: product.name,
      previousQuantity: current,
      nextQuantity,
      lowStockAlertSentAt: product.lowStockAlertSentAt,
      lowStockAlertLevel: product.lowStockAlertLevel ?? null,
    })
  }

  return 'applied'
}

export function rmaListEmptyMessage(filter: RmaStatus | 'all' | 'open') {
  if (filter === 'open') return 'No open returns right now.'
  if (filter === 'all') return 'No returns yet.'
  return `No returns with status ${rmaStatusLabel(filter)}.`
}

export const RMA_LIST_FILTERS: Array<{ id: RmaStatus | 'all' | 'open'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'requested', label: 'Requested' },
  { id: 'approved', label: 'Approved' },
  { id: 'received', label: 'Received' },
  { id: 'restocked', label: 'Restocked' },
  { id: 'closed', label: 'Closed' },
  { id: 'rejected', label: 'Rejected' },
]
