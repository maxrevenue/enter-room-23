import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getAdminAnalytics } from '@/lib/admin-analytics'
import {
  getResolvedProductOfTheMonth,
  isArchived,
  isLowStock,
  listAdminProducts,
  quantityOf,
} from '@/lib/admin-catalog'
import { couponExpiryDate, listAdminCoupons } from '@/lib/admin-coupons'
import {
  formatOrderDate,
  formatOrderMoney,
  listRecentOpenOrders,
  orderStatusBadgeClass,
  orderStatusLabel,
} from '@/lib/admin-orders'
import { getStoreSettings } from '@/lib/admin-settings'

export const dynamic = 'force-dynamic'

const QUICK_LINKS = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/audit', label: 'Audit' },
]

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const now = new Date()
  const [products, productOfTheMonth, recentOpenOrders, analytics, settings, coupons] = await Promise.all([
    listAdminProducts(),
    getResolvedProductOfTheMonth(),
    listRecentOpenOrders(8),
    getAdminAnalytics(now),
    getStoreSettings(),
    listAdminCoupons(),
  ])

  const activeCount = products.filter((product) => !isArchived(product)).length
  const lowStockProducts = products
    .filter((product) => !isArchived(product) && (isLowStock(product) || quantityOf(product) === 0))
    .sort((a, b) => (quantityOf(a) ?? 9999) - (quantityOf(b) ?? 9999))
    .slice(0, 8)
  const activeCouponCount = coupons.filter((coupon) => {
    if (coupon.active === false) return false
    const expires = couponExpiryDate(coupon.expiresAt)
    return !expires || expires.getTime() >= now.getTime()
  }).length

  const stats = [
    { label: 'Products', value: String(activeCount) },
    { label: 'Low stock', value: String(analytics.lowStock) },
    { label: 'Open orders', value: String(analytics.openOrders) },
    { label: 'Product of the Month', value: productOfTheMonth?.name || 'Not set' },
    { label: 'Revenue · 7 days', value: formatOrderMoney(analytics.windows.last7.revenue) },
  ]

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Command</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Dashboard</h1>
      </header>

      <nav aria-label="Admin sections" className="mb-10 flex flex-wrap gap-x-8 gap-y-3 border-b border-zinc-800 pb-6">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 hover:text-zinc-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <li key={stat.label} className="border border-zinc-800 bg-zinc-900 px-6 py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">{stat.label}</p>
            <p className="mt-4 font-serif text-2xl tracking-tight text-zinc-100">{stat.value}</p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid grid-cols-1 gap-4 border border-zinc-800 bg-zinc-900 px-6 py-6 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Store</dt>
          <dd className="mt-2 text-sm text-zinc-100">{settings.storeOpen ? 'Open' : 'Closed'}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Active coupons</dt>
          <dd className="mt-2 text-sm text-zinc-100">{activeCouponCount}</dd>
        </div>
      </dl>

      <div className="mt-12 border border-zinc-800 bg-zinc-900 px-6 py-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Product of the Month</p>
        {productOfTheMonth ? (
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <p className="font-serif text-2xl tracking-tight text-zinc-100">{productOfTheMonth.name}</p>
            <Link
              href={`/admin/products/${encodeURIComponent(productOfTheMonth.id)}`}
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
            >
              Edit product
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <p className="text-sm text-zinc-400">Not set — choose one</p>
            <Link
              href="/admin/products"
              className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
            >
              Choose product
            </Link>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-zinc-800">
          <div className="flex items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Queue</p>
              <h2 className="mt-2 font-serif text-xl text-zinc-100">Needs attention</h2>
            </div>
            <Link
              href="/admin/orders?filter=open"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
            >
              View all
            </Link>
          </div>
          {recentOpenOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-400">No open orders.</p>
          ) : (
            <ul>
              {recentOpenOrders.map((order) => (
                <li key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900"
                  >
                    <div>
                      <p className="text-sm text-zinc-100">{order.orderId}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {order.email || '—'} · {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">{formatOrderMoney(order.totals?.total)}</p>
                      <span className={`mt-2 ${orderStatusBadgeClass(order.status)}`}>
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-zinc-800">
          <div className="flex items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Inventory</p>
              <h2 className="mt-2 font-serif text-xl text-zinc-100">Low stock</h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
            >
              View all
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-400">No low-stock products.</p>
          ) : (
            <ul>
              {lowStockProducts.map((product) => {
                const quantity = quantityOf(product)
                return (
                  <li key={product.id} className="border-b border-zinc-800 last:border-b-0">
                    <Link
                      href={`/admin/products/${encodeURIComponent(product.id)}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-900"
                    >
                      <p className="text-sm text-zinc-100">{product.name}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                        {quantity == null ? '—' : `${quantity} left`}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
