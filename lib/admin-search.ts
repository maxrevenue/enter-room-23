import {
  adminCustomerHref,
  aggregateCustomersFromOrders,
  customerMatchesQuery,
  customerNameFromOrder,
  normalizeCustomerEmail,
} from '@/lib/admin-customers'
import { getRoom23Db } from '@/lib/admin-db'
import { listAdminProducts } from '@/lib/admin-catalog'
import { formatCouponValue, normalizeCouponCode, type AdminCoupon } from '@/lib/admin-coupons'
import {
  escapeRegex,
  formatOrderDate,
  formatOrderMoney,
  orderSearchQuery,
  orderStatusLabel,
  type AdminOrder,
} from '@/lib/admin-orders'

export type AdminSearchResultType = 'order' | 'product' | 'customer' | 'coupon'

export type AdminSearchResult = {
  type: AdminSearchResultType
  id: string
  title: string
  subtitle: string
  href: string
}

export const ADMIN_SEARCH_MIN_QUERY = 2

function orderHref(orderId: string) {
  return `/admin/orders/${encodeURIComponent(orderId)}`
}

function productHref(id: string) {
  return `/admin/products/${encodeURIComponent(id)}`
}

function couponHref(code: string) {
  return `/admin/coupons/${encodeURIComponent(code)}`
}

async function searchOrders(q: string, limit = 8): Promise<AdminSearchResult[]> {
  const db = await getRoom23Db()
  if (!db) return []

  const orders = await db
    .collection<AdminOrder>('orders')
    .find(orderSearchQuery(q))
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return orders.map((order) => {
    const email = String(order.email || '').trim()
    const name = customerNameFromOrder(order)
    const status = orderStatusLabel(order.status)
    const total = formatOrderMoney(order.totals?.total)
    const date = formatOrderDate(order.createdAt)
    const subtitleParts = [email || name, status, total, date].filter(Boolean)

    return {
      type: 'order' as const,
      id: order.orderId,
      title: order.orderId,
      subtitle: subtitleParts.join(' · '),
      href: orderHref(order.orderId),
    }
  })
}

async function searchProducts(q: string, limit = 8): Promise<AdminSearchResult[]> {
  const needle = q.trim().toLowerCase()
  if (needle.length < ADMIN_SEARCH_MIN_QUERY) return []

  const products = await listAdminProducts()
  return products
    .filter((product) => {
      const name = String(product.name || '').toLowerCase()
      const slug = String(product.slug || product.id || '').toLowerCase()
      const id = String(product.id || '').toLowerCase()
      return name.includes(needle) || slug.includes(needle) || id.includes(needle)
    })
    .slice(0, limit)
    .map((product) => ({
      type: 'product' as const,
      id: product.id,
      title: String(product.name || product.id),
      subtitle: [product.slug || product.id, product.category].filter(Boolean).join(' · '),
      href: productHref(product.id),
    }))
}

async function searchCustomers(q: string, limit = 6): Promise<AdminSearchResult[]> {
  const db = await getRoom23Db()
  if (!db) return []

  const regex = { $regex: escapeRegex(q.trim()), $options: 'i' }
  const orders = await db
    .collection<AdminOrder>('orders')
    .find({
      $or: [{ email: regex }, { 'shippingAddress.name': regex }],
    })
    .sort({ createdAt: -1 })
    .limit(250)
    .toArray()

  const customers = aggregateCustomersFromOrders(orders)
    .filter((customer) => customerMatchesQuery(customer, q))
    .slice(0, limit)

  return customers.map((customer) => ({
    type: 'customer' as const,
    id: normalizeCustomerEmail(customer.email),
    title: customer.name || customer.email,
    subtitle: [
      customer.email,
      `${customer.orderCount} order${customer.orderCount === 1 ? '' : 's'}`,
      formatOrderMoney(customer.totalSpent),
    ]
      .filter(Boolean)
      .join(' · '),
    href: adminCustomerHref(customer.email),
  }))
}

async function couponsCollectionExists(db: NonNullable<Awaited<ReturnType<typeof getRoom23Db>>>) {
  const collections = await db.listCollections({ name: 'coupons' }).toArray()
  return collections.length > 0
}

async function searchCoupons(q: string, limit = 5): Promise<AdminSearchResult[]> {
  const db = await getRoom23Db()
  if (!db) return []
  if (!(await couponsCollectionExists(db))) return []

  const codeNeedle = normalizeCouponCode(q)
  if (codeNeedle.length < ADMIN_SEARCH_MIN_QUERY) return []

  const coupons = await db
    .collection<AdminCoupon>('coupons')
    .find({ code: { $regex: escapeRegex(codeNeedle), $options: 'i' } })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray()

  return coupons.map((coupon) => ({
    type: 'coupon' as const,
    id: coupon.code,
    title: coupon.code,
    subtitle: [
      formatCouponValue(coupon),
      coupon.active === false ? 'Inactive' : 'Active',
      coupon.usedCount != null && coupon.usageLimit != null
        ? `${coupon.usedCount}/${coupon.usageLimit} used`
        : null,
    ]
      .filter(Boolean)
      .join(' · '),
    href: couponHref(coupon.code),
  }))
}

export async function searchAdminEntities(q: string): Promise<AdminSearchResult[]> {
  const needle = String(q || '').trim()
  if (needle.length < ADMIN_SEARCH_MIN_QUERY) return []

  const [orders, products, customers, coupons] = await Promise.all([
    searchOrders(needle),
    searchProducts(needle),
    searchCustomers(needle),
    searchCoupons(needle),
  ])

  return [...orders, ...products, ...customers, ...coupons]
}
