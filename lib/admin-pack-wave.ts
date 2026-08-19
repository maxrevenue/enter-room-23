export type PackWaveOrderItem = {
  id?: string
  name?: string
  qty?: number
}

export type PackWaveOrder = {
  orderId: string
  shippingAddress?: { name?: string } | null
  items?: PackWaveOrderItem[]
}

export const PACK_WAVE_LIMIT = 50

export type PickListLine = {
  key: string
  productId: string
  name: string
  totalQty: number
  orderCount: number
}

export type WaveOrderSummary = {
  orderId: string
  shipToName: string
  itemCount: number
  packingSlipHref: string
}

function packWaveItemCount(order: Pick<PackWaveOrder, 'items'>) {
  if (!Array.isArray(order.items) || order.items.length === 0) return 0
  return order.items.reduce((sum, item) => {
    const qty = Number(item?.qty)
    return sum + (Number.isFinite(qty) && qty > 0 ? qty : 1)
  }, 0)
}

function normalizeLineQty(qty?: number) {
  return Math.max(1, Math.floor(Number(qty) || 1))
}

function lineAggregateKey(item: PackWaveOrderItem) {
  const productId = String(item.id || '').trim()
  const name = String(item.name || item.id || 'Item').trim() || 'Item'
  return productId || `name:${name.toLowerCase()}`
}

export function parsePackWaveIds(raw?: string | string[] | null) {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value) return []
  const seen = new Set<string>()
  const ids: string[] = []
  for (const part of String(value).split(',')) {
    const id = decodeURIComponent(part.trim())
    if (!id || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
    if (ids.length >= PACK_WAVE_LIMIT) break
  }
  return ids
}

export function buildPackWaveHref(orderIds: string[]) {
  const encoded = orderIds
    .map((id) => String(id || '').trim())
    .filter(Boolean)
    .slice(0, PACK_WAVE_LIMIT)
    .map((id) => encodeURIComponent(id))
    .join(',')
  return encoded ? `/admin/pack-wave?ids=${encoded}` : '/admin/pack-wave'
}

export function aggregatePickList(orders: PackWaveOrder[]): PickListLine[] {
  const map = new Map<
    string,
    { productId: string; name: string; totalQty: number; orderIds: Set<string> }
  >()

  for (const order of orders) {
    for (const item of order.items ?? []) {
      const key = lineAggregateKey(item)
      const productId = String(item.id || '').trim()
      const name = String(item.name || item.id || 'Item').trim() || 'Item'
      const qty = normalizeLineQty(item.qty)
      const existing = map.get(key)
      if (existing) {
        existing.totalQty += qty
        existing.orderIds.add(order.orderId)
        if (name && existing.name === 'Item') existing.name = name
      } else {
        map.set(key, {
          productId: productId || '—',
          name,
          totalQty: qty,
          orderIds: new Set([order.orderId]),
        })
      }
    }
  }

  return [...map.entries()]
    .map(([key, entry]) => ({
      key,
      productId: entry.productId,
      name: entry.name,
      totalQty: entry.totalQty,
      orderCount: entry.orderIds.size,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export function buildWaveOrderSummaries(orders: PackWaveOrder[]): WaveOrderSummary[] {
  return orders.map((order) => ({
    orderId: order.orderId,
    shipToName: String(order.shippingAddress?.name || '—').trim() || '—',
    itemCount: packWaveItemCount(order),
    packingSlipHref: `/admin/orders/${encodeURIComponent(order.orderId)}/packing-slip`,
  }))
}
