import { countLowStockProducts, type CatalogProduct } from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import { countOpenOrders } from '@/lib/admin-orders'
import { countOpenRmas, adminReturnsHref } from '@/lib/admin-returns'
import { adminOrdersViewHref, adminProductsViewHref, buildOrdersListQueryForView } from '@/lib/admin-views'

export const OPS_HANDOFF_ID = 'ops_handoff'
export const HANDOFF_NOTE_MAX = 2000

export type OpsHandoff = {
  id: string
  note: string
  updatedAt?: Date | string | null
  updatedBy?: string
}

export type HandoffChecklistItem = {
  id: string
  label: string
  value: string
  href: string
}

export type HandoffChecklist = {
  items: HandoffChecklistItem[]
}

function normalizeHandoff(doc?: Partial<OpsHandoff> | null): OpsHandoff {
  return {
    id: OPS_HANDOFF_ID,
    note: String(doc?.note || '').trim().slice(0, HANDOFF_NOTE_MAX),
    updatedAt: doc?.updatedAt ?? null,
    updatedBy: String(doc?.updatedBy || 'admin').trim() || 'admin',
  }
}

export function formatHandoffUpdatedAt(value?: Date | string | null) {
  if (!value) return 'Not saved yet'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not saved yet'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export async function getOpsHandoff(): Promise<OpsHandoff> {
  const db = await getRoom23Db()
  if (!db) return normalizeHandoff(null)
  const doc = await db.collection<OpsHandoff>('settings').findOne({ id: OPS_HANDOFF_ID })
  return normalizeHandoff(doc)
}

export async function countUnreviewedOrders(now = new Date()): Promise<number> {
  const db = await getRoom23Db()
  if (!db) return 0
  return db.collection('orders').countDocuments(buildOrdersListQueryForView('unreviewed', '', now))
}

export async function buildHandoffChecklist(
  productOfTheMonth: CatalogProduct | null | undefined,
  now = new Date(),
): Promise<HandoffChecklist> {
  const [openOrders, unreviewedOrders, lowStock, openRmas] = await Promise.all([
    countOpenOrders(),
    countUnreviewedOrders(now),
    countLowStockProducts(),
    countOpenRmas(),
  ])

  const potmSet = Boolean(productOfTheMonth?.id)
  const potmHref = potmSet
    ? `/admin/products/${encodeURIComponent(productOfTheMonth!.id)}`
    : '/admin/products?view=potm'

  return {
    items: [
      {
        id: 'open_orders',
        label: 'Open orders',
        value: String(openOrders),
        href: adminOrdersViewHref('open'),
      },
      {
        id: 'unreviewed',
        label: 'Unreviewed',
        value: String(unreviewedOrders),
        href: adminOrdersViewHref('unreviewed'),
      },
      {
        id: 'low_stock',
        label: 'Low stock',
        value: String(lowStock),
        href: adminProductsViewHref('low_stock'),
      },
      {
        id: 'open_rmas',
        label: 'Open RMAs',
        value: String(openRmas),
        href: adminReturnsHref('open'),
      },
      {
        id: 'potm',
        label: 'Product of the Month',
        value: potmSet ? 'Yes' : 'No',
        href: potmHref,
      },
    ],
  }
}
