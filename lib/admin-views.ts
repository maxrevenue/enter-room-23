import {
  isArchived,
  isLowStock,
  quantityOf,
  type CatalogProduct,
} from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import {
  HIGH_VALUE_THRESHOLD,
  staleOpenCutoff,
} from '@/lib/admin-risk'
import {
  openOrdersQuery,
  orderFilterQuery,
  orderSearchQuery,
  type AdminOrder,
} from '@/lib/admin-orders'

export const ORDER_VIEW_IDS = [
  'all',
  'open',
  'unreviewed',
  'high_value',
  'stale',
  'fulfilled',
  'refunded_cancelled',
] as const

export type OrderViewId = (typeof ORDER_VIEW_IDS)[number]

export const PRODUCT_VIEW_IDS = [
  'all',
  'active',
  'archived',
  'low_stock',
  'out_of_stock',
  'hide_when_zero',
  'potm',
] as const

export type ProductViewId = (typeof PRODUCT_VIEW_IDS)[number]

export type AdminViewDefinition<T extends string = string> = {
  id: T
  label: string
  params: Record<string, string>
}

export const ORDER_VIEWS: AdminViewDefinition<OrderViewId>[] = [
  { id: 'all', label: 'All', params: {} },
  { id: 'open', label: 'Open', params: { view: 'open' } },
  { id: 'unreviewed', label: 'Unreviewed', params: { view: 'unreviewed' } },
  { id: 'high_value', label: 'High value', params: { view: 'high_value' } },
  { id: 'stale', label: 'Stale · 48h+', params: { view: 'stale' } },
  { id: 'fulfilled', label: 'Fulfilled', params: { view: 'fulfilled' } },
  {
    id: 'refunded_cancelled',
    label: 'Refunded/Cancelled',
    params: { view: 'refunded_cancelled' },
  },
]

export const PRODUCT_VIEWS: AdminViewDefinition<ProductViewId>[] = [
  { id: 'all', label: 'All', params: {} },
  { id: 'active', label: 'Active', params: { view: 'active' } },
  { id: 'archived', label: 'Archived', params: { view: 'archived' } },
  { id: 'low_stock', label: 'Low stock', params: { view: 'low_stock' } },
  { id: 'out_of_stock', label: 'Out of stock', params: { view: 'out_of_stock' } },
  { id: 'hide_when_zero', label: 'Hide when zero', params: { view: 'hide_when_zero' } },
  { id: 'potm', label: 'Product of the Month', params: { view: 'potm' } },
]

const ORDER_VIEW_SET = new Set<string>(ORDER_VIEW_IDS)
const PRODUCT_VIEW_SET = new Set<string>(PRODUCT_VIEW_IDS)

function composeQueries(...parts: Record<string, unknown>[]) {
  const active = parts.filter((part) => Object.keys(part).length > 0)
  if (!active.length) return {}
  if (active.length === 1) return active[0]
  return { $and: active }
}

export function isOrderViewId(value?: string | null): value is OrderViewId {
  return Boolean(value && ORDER_VIEW_SET.has(value))
}

export function isProductViewId(value?: string | null): value is ProductViewId {
  return Boolean(value && PRODUCT_VIEW_SET.has(value))
}

export function parseOrderView(params: {
  view?: string | string[] | null
  filter?: string | string[] | null
}): OrderViewId {
  const rawView = Array.isArray(params.view) ? params.view[0] : params.view
  const trimmedView = String(rawView || '').trim()
  if (isOrderViewId(trimmedView)) return trimmedView

  const legacy = String(Array.isArray(params.filter) ? params.filter[0] : params.filter || '').trim()
  if (legacy === 'closed') return 'refunded_cancelled'
  if (isOrderViewId(legacy)) return legacy

  return 'all'
}

export function parseProductView(params: {
  view?: string | string[] | null
}): ProductViewId {
  const raw = Array.isArray(params.view) ? params.view[0] : params.view
  const value = String(raw || '').trim()
  if (isProductViewId(value)) return value
  return 'all'
}

export function adminOrdersViewHref(view: OrderViewId = 'all', q = '', extra: Record<string, string> = {}) {
  const params = new URLSearchParams()
  if (view !== 'all') params.set('view', view)
  if (String(q || '').trim()) params.set('q', String(q).trim())
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/admin/orders?${query}` : '/admin/orders'
}

export function adminProductsViewHref(view: ProductViewId = 'all', extra: Record<string, string> = {}) {
  const params = new URLSearchParams()
  if (view !== 'all') params.set('view', view)
  for (const [key, value] of Object.entries(extra)) {
    if (value) params.set(key, value)
  }
  const query = params.toString()
  return query ? `/admin/products?${query}` : '/admin/products'
}

export function buildOrdersViewQuery(view: OrderViewId, now = new Date()) {
  switch (view) {
    case 'open':
      return openOrdersQuery()
    case 'unreviewed':
      return composeQueries(openOrdersQuery(), { adminReview: { $ne: true } })
    case 'high_value':
      return { 'totals.total': { $gte: HIGH_VALUE_THRESHOLD } }
    case 'stale':
      return composeQueries(openOrdersQuery(), { createdAt: { $lte: staleOpenCutoff(now) } })
    case 'fulfilled':
      return orderFilterQuery('fulfilled')
    case 'refunded_cancelled':
      return orderFilterQuery('closed')
    default:
      return {}
  }
}

export function buildOrdersListQueryForView(view: OrderViewId = 'all', q = '', now = new Date()) {
  return composeQueries(buildOrdersViewQuery(view, now), orderSearchQuery(q))
}

export async function listAdminOrdersForView(
  view: OrderViewId = 'all',
  limit = 100,
  q = '',
  now = new Date(),
): Promise<AdminOrder[]> {
  const db = await getRoom23Db()
  if (!db) return []
  return db
    .collection<AdminOrder>('orders')
    .find(buildOrdersListQueryForView(view, q, now))
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

export function filterProductsByView(products: CatalogProduct[], view: ProductViewId = 'all') {
  switch (view) {
    case 'active':
      return products.filter((product) => !isArchived(product))
    case 'archived':
      return products.filter((product) => isArchived(product))
    case 'low_stock':
      return products.filter((product) => !isArchived(product) && isLowStock(product))
    case 'out_of_stock':
      return products.filter((product) => !isArchived(product) && quantityOf(product) === 0)
    case 'hide_when_zero':
      return products.filter((product) => Boolean(product.hideWhenZero))
    case 'potm':
      return products.filter((product) => Boolean(product.isProductOfTheMonth || product.isFeatured))
    default:
      return products
  }
}

export function orderViewEmptyMessage(view: OrderViewId, q = '') {
  if (String(q || '').trim()) return 'No orders match this search in this view.'
  switch (view) {
    case 'open':
      return 'No open orders right now.'
    case 'unreviewed':
      return 'No unreviewed open orders.'
    case 'high_value':
      return `No orders at or above $${HIGH_VALUE_THRESHOLD}.`
    case 'stale':
      return 'No open orders older than 48 hours.'
    case 'fulfilled':
      return 'No fulfilled orders yet.'
    case 'refunded_cancelled':
      return 'No refunded or cancelled orders.'
    default:
      return 'No orders yet. Paid checkouts are stored in MongoDB for review here.'
  }
}

export function productViewEmptyMessage(view: ProductViewId) {
  switch (view) {
    case 'active':
      return 'No active products in the catalog.'
    case 'archived':
      return 'No archived products.'
    case 'low_stock':
      return 'No low-stock products.'
    case 'out_of_stock':
      return 'No out-of-stock products.'
    case 'hide_when_zero':
      return 'No products have hide-when-zero enabled.'
    case 'potm':
      return 'No Product of the Month is set.'
    default:
      return 'No products in the catalog.'
  }
}

export function orderViewLabel(view: OrderViewId) {
  return ORDER_VIEWS.find((entry) => entry.id === view)?.label || 'All'
}

export function productViewLabel(view: ProductViewId) {
  return PRODUCT_VIEWS.find((entry) => entry.id === view)?.label || 'All'
}

export {
  isHighValueOrder,
  isStaleOpenOrder,
  isUnreviewedOpenOrder,
  staleOpenCutoff,
} from '@/lib/admin-risk'
