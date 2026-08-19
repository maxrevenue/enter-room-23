import {
  isArchived,
  isLowStock,
  listAdminProducts,
  quantityOf,
  type CatalogProduct,
} from '@/lib/admin-catalog'
import { couponExpiryDate, listAdminCoupons, type AdminCoupon } from '@/lib/admin-coupons'
import { orderTimestamp } from '@/lib/admin-customers'
import {
  CRITICAL_HOURS,
  isStaleOpenOrder,
  slaSortWeight,
} from '@/lib/admin-sla'
import {
  isOpenOrder,
  listAdminOrders,
  type AdminOrder,
} from '@/lib/admin-orders'

export const HIGH_VALUE_THRESHOLD = 150
export const COUPON_EXPIRY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000
export const INBOX_ORDER_LIMIT = 10
export const INBOX_PRODUCT_LIMIT = 8
export const INBOX_COUPON_LIMIT = 5

export type RiskFlagSeverity = 'critical' | 'high' | 'medium' | 'low'

export type RiskFlag = {
  id: string
  label: string
  severity: RiskFlagSeverity
}

export type InboxOrderEntry = {
  kind: 'order'
  order: AdminOrder
  flags: RiskFlag[]
  href: string
  severityScore: number
}

export type InboxProductEntry = {
  kind: 'product'
  product: CatalogProduct
  href: string
  label: string
  detail: string
}

export type InboxCouponEntry = {
  kind: 'coupon'
  coupon: AdminCoupon
  href: string
  label: string
  detail: string
}

export type AdminActionInbox = {
  orders: InboxOrderEntry[]
  products: InboxProductEntry[]
  coupons: InboxCouponEntry[]
}

const SEVERITY_SCORE: Record<RiskFlagSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const CHIP_BASE =
  'inline-flex border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]'

const SEVERITY_CHIP_CLASS: Record<RiskFlagSeverity, string> = {
  critical: `${CHIP_BASE} border-zinc-200 text-zinc-100`,
  high: `${CHIP_BASE} border-zinc-400 text-zinc-200`,
  medium: `${CHIP_BASE} border-zinc-600 text-zinc-300`,
  low: `${CHIP_BASE} border-zinc-700 text-zinc-500`,
}

export function riskFlagChipClass(severity: RiskFlagSeverity) {
  return SEVERITY_CHIP_CLASS[severity]
}

export function isHighValueOrder(order: Pick<AdminOrder, 'totals'>) {
  const total = Number(order.totals?.total)
  return Number.isFinite(total) && total >= HIGH_VALUE_THRESHOLD
}

export function isUnreviewedOpenOrder(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'adminReview'>,
) {
  return isOpenOrder(order) && order.adminReview !== true
}

export function maxRiskSeverityScore(flags: RiskFlag[]) {
  return flags.reduce((max, flag) => Math.max(max, SEVERITY_SCORE[flag.severity]), 0)
}

export function collectOrderProductIds(orders: AdminOrder[]) {
  const ids = new Set<string>()
  for (const order of orders) {
    for (const item of order.items ?? []) {
      const id = String(item?.id || '').trim()
      if (id) ids.add(id)
    }
  }
  return [...ids]
}

export function buildProductsByIdMap(products: CatalogProduct[], ids: string[]) {
  const wanted = new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))
  const map = new Map<string, CatalogProduct>()
  if (!wanted.size) return map
  for (const product of products) {
    if (wanted.has(product.id)) map.set(product.id, product)
  }
  return map
}

export function getOrderRiskFlags(
  order: AdminOrder,
  productsById?: Map<string, Pick<CatalogProduct, 'id' | 'quantity'>>,
  now = new Date(),
): RiskFlag[] {
  const flags: RiskFlag[] = []

  if (!String(order.email || '').trim()) {
    flags.push({ id: 'missing_email', label: 'Missing email', severity: 'high' })
  }

  const total = Number(order.totals?.total)
  if (isHighValueOrder(order)) {
    flags.push({ id: 'high_value', label: 'High value', severity: 'medium' })
  }

  if (isOpenOrder(order)) {
    if (isUnreviewedOpenOrder(order)) {
      flags.push({ id: 'unreviewed', label: 'Unreviewed', severity: 'medium' })
    }

    if (isStaleOpenOrder(order, now)) {
      flags.push({ id: 'stale_open', label: `Stale · ${CRITICAL_HOURS}h+`, severity: 'low' })
    }
  }

  if (productsById && Array.isArray(order.items)) {
    for (const item of order.items) {
      const id = String(item?.id || '').trim()
      if (!id) continue
      const product = productsById.get(id)
      if (product && quantityOf(product) === 0) {
        flags.push({ id: 'out_of_stock_item', label: 'Out of stock item', severity: 'high' })
        break
      }
    }
  }

  return flags
}

function sortFlaggedOrders(entries: InboxOrderEntry[], now = new Date()) {
  return [...entries].sort((a, b) => {
    const slaDelta = slaSortWeight(b.order, now) - slaSortWeight(a.order, now)
    if (slaDelta !== 0) return slaDelta
    const scoreDelta = b.severityScore - a.severityScore
    if (scoreDelta !== 0) return scoreDelta
    const aTs = orderTimestamp(a.order.createdAt)
    const bTs = orderTimestamp(b.order.createdAt)
    if (aTs !== bTs) return aTs - bTs
    return String(a.order.orderId).localeCompare(String(b.order.orderId))
  })
}

function lowStockProductEntries(products: CatalogProduct[], limit = INBOX_PRODUCT_LIMIT): InboxProductEntry[] {
  return products
    .filter((product) => !isArchived(product) && (isLowStock(product) || quantityOf(product) === 0))
    .sort((a, b) => (quantityOf(a) ?? 9999) - (quantityOf(b) ?? 9999))
    .slice(0, limit)
    .map((product) => {
      const quantity = quantityOf(product)
      const out = quantity === 0
      return {
        kind: 'product' as const,
        product,
        href: `/admin/products/${encodeURIComponent(product.id)}`,
        label: product.name,
        detail: out ? 'Out of stock' : `${quantity} left`,
      }
    })
}

function expiringCouponEntries(coupons: AdminCoupon[], now = new Date(), limit = INBOX_COUPON_LIMIT) {
  const horizon = now.getTime() + COUPON_EXPIRY_WINDOW_MS
  return coupons
    .filter((coupon) => {
      if (coupon.active === false) return false
      const expires = couponExpiryDate(coupon.expiresAt)
      if (!expires) return false
      const ts = expires.getTime()
      return ts >= now.getTime() && ts <= horizon
    })
    .sort((a, b) => {
      const aTs = couponExpiryDate(a.expiresAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
      const bTs = couponExpiryDate(b.expiresAt)?.getTime() ?? Number.MAX_SAFE_INTEGER
      return aTs - bTs
    })
    .slice(0, limit)
    .map((coupon) => ({
      kind: 'coupon' as const,
      coupon,
      href: `/admin/coupons/${encodeURIComponent(coupon.code)}`,
      label: coupon.code,
      detail: `Expires ${couponExpiryDate(coupon.expiresAt)?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`,
    }))
}

export async function getAdminActionInbox(
  products?: CatalogProduct[],
  now = new Date(),
): Promise<AdminActionInbox> {
  const [catalog, openOrders, coupons] = await Promise.all([
    products ? Promise.resolve(products) : listAdminProducts(),
    listAdminOrders('open', 100),
    listAdminCoupons(),
  ])

  const productsById = buildProductsByIdMap(catalog, collectOrderProductIds(openOrders))

  const flaggedOrders = sortFlaggedOrders(
    openOrders
      .map((order) => {
        const flags = getOrderRiskFlags(order, productsById, now)
        if (!flags.length) return null
        return {
          kind: 'order' as const,
          order,
          flags,
          href: `/admin/orders/${encodeURIComponent(order.orderId)}`,
          severityScore: maxRiskSeverityScore(flags),
        }
      })
      .filter((entry): entry is InboxOrderEntry => entry != null),
    now,
  ).slice(0, INBOX_ORDER_LIMIT)

  return {
    orders: flaggedOrders,
    products: lowStockProductEntries(catalog, INBOX_PRODUCT_LIMIT),
    coupons: expiringCouponEntries(coupons, now, INBOX_COUPON_LIMIT),
  }
}
