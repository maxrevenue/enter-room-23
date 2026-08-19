import type { AdminOrder } from '@/lib/admin-orders'
import { isRefundedOrCancelled } from '@/lib/admin-orders'

export type MarginWindowSlice = {
  margin: number
  marginMissingCogs: number
}

export type MarginProduct = {
  price?: number
  cogs?: number | null
}

export type MarginOrderItem = {
  id?: string
  name?: string
  qty?: number
  price?: number
}

export function parseMarginDate(value?: Date | string | null): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function isWithinMarginWindow(value: Date | string | null | undefined, since: Date, until: Date) {
  const date = parseMarginDate(value)
  if (!date) return false
  return date >= since && date <= until
}

function countsTowardMargin(order: Pick<AdminOrder, 'status'>) {
  return !isRefundedOrCancelled(order)
}

export type OrderMarginResult = {
  margin: number
  revenue: number
  missingCogs: number
  complete: boolean
}

export type TopMarginProductRow = {
  id: string
  name: string
  units: number
  revenue: number
  margin: number
}

export function parseCogs(value: unknown): number | null {
  if (value == null || value === '') return null
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount < 0) return null
  return amount
}

export function unitMargin(price?: number | null, cogs?: number | null): number | null {
  const amount = Number(price)
  const cost = parseCogs(cogs)
  if (!Number.isFinite(amount) || cost == null) return null
  return amount - cost
}

export function unitMarginPct(price?: number | null, cogs?: number | null): number | null {
  const amount = Number(price)
  const cost = parseCogs(cogs)
  if (!Number.isFinite(amount) || amount === 0 || cost == null) return null
  return ((amount - cost) / amount) * 100
}

export function formatMarginMoney(value?: number | null) {
  if (value == null || !Number.isFinite(value)) return '—'
  return `$${value.toFixed(2)}`
}

export function formatMarginPct(value?: number | null) {
  if (value == null || !Number.isFinite(value)) return '—'
  return `${value.toFixed(1)}%`
}

export function productMarginPct(product: MarginProduct) {
  return unitMarginPct(product.price, product.cogs)
}

export function orderLineMargin(
  item: MarginOrderItem,
  product?: MarginProduct | null,
): { margin: number | null; missingCogs: boolean } {
  const qty = Math.max(1, Math.floor(Number(item.qty) || 1))
  const price = Number(item.price)
  const cogs = parseCogs(product?.cogs)
  if (!Number.isFinite(price) || cogs == null) {
    return { margin: null, missingCogs: cogs == null }
  }
  return { margin: (price - cogs) * qty, missingCogs: false }
}

export function orderMargin(
  order: Pick<AdminOrder, 'items'>,
  productsById: Map<string, MarginProduct>,
): OrderMarginResult {
  let margin = 0
  let revenue = 0
  let missingCogs = 0
  const items = Array.isArray(order.items) ? order.items : []

  for (const item of items) {
    const id = String(item.id || '').trim()
    const product = id ? productsById.get(id) : undefined
    const qty = Math.max(1, Math.floor(Number(item.qty) || 1))
    const price = Number(item.price)
    if (Number.isFinite(price)) revenue += price * qty

    const line = orderLineMargin(item, product)
    if (line.margin != null) margin += line.margin
    else if (line.missingCogs) missingCogs += qty
  }

  return {
    margin,
    revenue,
    missingCogs,
    complete: missingCogs === 0 && items.length > 0,
  }
}

export function collectProductIdsFromOrders(orders: Array<Pick<AdminOrder, 'items'>>) {
  const ids = new Set<string>()
  for (const order of orders) {
    for (const item of order.items || []) {
      const id = String(item.id || '').trim()
      if (id) ids.add(id)
    }
  }
  return [...ids]
}

export function buildMarginProductsByIdMap(
  products: Array<{ id: string; price?: number; cogs?: number | null }>,
  ids?: string[],
) {
  const idSet = ids?.length ? new Set(ids) : null
  const map = new Map<string, MarginProduct>()
  for (const product of products) {
    if (idSet && !idSet.has(product.id)) continue
    map.set(product.id, {
      price: product.price,
      cogs: parseCogs(product.cogs),
    })
  }
  return map
}

export function marginSnapshotForWindow(
  orders: Array<Pick<AdminOrder, 'status' | 'items' | 'createdAt' | 'totals'>>,
  productsById: Map<string, MarginProduct>,
  since: Date,
  until: Date,
): MarginWindowSlice {
  let margin = 0
  let marginMissingCogs = 0

  for (const order of orders) {
    if (!isWithinMarginWindow(order.createdAt, since, until)) continue
    if (!countsTowardMargin(order)) continue
    const result = orderMargin(order, productsById)
    margin += result.margin
    marginMissingCogs += result.missingCogs
  }

  return { margin, marginMissingCogs }
}

export function aggregateTopProductsByMargin(
  orders: Array<Pick<AdminOrder, 'status' | 'items' | 'createdAt'>>,
  productsById: Map<string, MarginProduct>,
  since: Date,
  until: Date,
  limit = 8,
): TopMarginProductRow[] {
  const byId = new Map<string, TopMarginProductRow>()

  for (const order of orders) {
    if (!isWithinMarginWindow(order.createdAt, since, until)) continue
    if (!countsTowardMargin(order)) continue

    for (const item of order.items || []) {
      const id = String(item.id || item.name || '').trim() || 'unknown'
      const name = String(item.name || item.id || 'Item').trim() || 'Item'
      const qty = Math.max(1, Math.floor(Number(item.qty) || 1))
      const price = Number(item.price)
      const product = productsById.get(String(item.id || '').trim())
      const line = orderLineMargin(item, product)
      const revenue = Number.isFinite(price) ? price * qty : 0
      const lineMargin = line.margin ?? 0

      const current = byId.get(id)
      if (!current) {
        byId.set(id, { id, name, units: qty, revenue, margin: lineMargin })
        continue
      }
      current.units += qty
      current.revenue += revenue
      current.margin += lineMargin
      if (name && name !== 'Item') current.name = name
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.margin - a.margin || b.revenue - a.revenue || a.name.localeCompare(b.name))
    .slice(0, Math.max(1, limit))
}
