import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getAdminAnalytics } from '@/lib/admin-analytics'
import {
  getResolvedProductOfTheMonth,
  isArchived,
  listAdminProducts,
} from '@/lib/admin-catalog'
import { couponExpiryDate, listAdminCoupons } from '@/lib/admin-coupons'
import { formatOrderDate, formatOrderMoney, orderStatusLabel } from '@/lib/admin-orders'
import { getAdminActionInbox, riskFlagChipClass } from '@/lib/admin-risk'
import { adminReturnsHref, formatRmaDate, listOpenRmas, rmaStatusLabel } from '@/lib/admin-returns'
import { getStoreSettings } from '@/lib/admin-settings'

export const dynamic = 'force-dynamic'

const QUICK_LINKS = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/returns', label: 'Returns' },
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
  const [products, productOfTheMonth, analytics, settings, coupons] = await Promise.all([
    listAdminProducts(),
    getResolvedProductOfTheMonth(),
    getAdminAnalytics(now),
    getStoreSettings(),
    listAdminCoupons(),
  ])

  const inbox = await getAdminActionInbox(products, now)
  const openRmas = await listOpenRmas(8)

  const activeCount = products.filter((product) => !isArchived(product)).length
  const activeCouponCount = coupons.filter((coupon) => {
    if (coupon.active === false) return false
    const expires = couponExpiryDate(coupon.expiresAt)
    return !expires || expires.getTime() >= now.getTime()
  }).length

  const inboxCount = inbox.orders.length + inbox.products.length + inbox.coupons.length + openRmas.length

  const stats = [
    { label: 'Products', value: String(activeCount) },
    { label: 'Low stock', value: String(analytics.lowStock) },
    { label: 'Open orders', value: String(analytics.openOrders) },
    { label: 'Product of the Month', value: productOfTheMonth?.name || 'Not set' },
    { label: 'Revenue · 7 days', value: formatOrderMoney(analytics.windows.last7.revenue) },
    { label: 'Est. margin · 7d', value: formatOrderMoney(analytics.windows.last7.margin) },
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

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
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

      <div className="mt-12 border border-zinc-800 bg-zinc-900">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Action inbox</p>
            <h2 className="mt-2 font-serif text-2xl text-zinc-100">Needs attention</h2>
            <p className="mt-2 text-sm text-zinc-500">
              {inboxCount === 0
                ? 'Nothing flagged right now.'
                : `${inboxCount} item${inboxCount === 1 ? '' : 's'} across orders, returns, inventory, and coupons.`}
            </p>
          </div>
        </div>

        {inboxCount === 0 ? (
          <p className="px-6 py-10 text-sm text-zinc-400">Queue is clear. Open orders, stock, and coupons look healthy.</p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {inbox.orders.length > 0 ? (
              <section>
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Orders</h3>
                  <Link
                    href="/admin/orders?view=open"
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
                  >
                    View all
                  </Link>
                </div>
                <ul>
                  {inbox.orders.map((entry) => (
                    <li key={entry.order.orderId} className="border-t border-zinc-800">
                      <Link
                        href={entry.href}
                        className="block px-6 py-4 hover:bg-zinc-950"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-zinc-100">{entry.order.orderId}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {entry.order.email || 'No email'} · {formatOrderDate(entry.order.createdAt)} ·{' '}
                              {orderStatusLabel(entry.order.status)} · {formatOrderMoney(entry.order.totals?.total)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {entry.flags.map((flag) => (
                            <span key={flag.id} className={riskFlagChipClass(flag.severity)}>
                              {flag.label}
                            </span>
                          ))}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {inbox.products.length > 0 ? (
              <section>
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Inventory</h3>
                  <Link
                    href="/admin/products?view=low_stock"
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
                  >
                    View all
                  </Link>
                </div>
                <ul>
                  {inbox.products.map((entry) => (
                    <li key={entry.product.id} className="border-t border-zinc-800">
                      <Link href={entry.href} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-950">
                        <div>
                          <p className="text-sm text-zinc-100">{entry.label}</p>
                          <p className="mt-1 text-xs text-zinc-500">Restock before fulfillment slips</p>
                        </div>
                        <span className={riskFlagChipClass(entry.detail === 'Out of stock' ? 'high' : 'medium')}>
                          {entry.detail}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {inbox.coupons.length > 0 ? (
              <section>
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Coupons</h3>
                  <Link
                    href="/admin/coupons"
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
                  >
                    View all
                  </Link>
                </div>
                <ul>
                  {inbox.coupons.map((entry) => (
                    <li key={entry.coupon.code} className="border-t border-zinc-800">
                      <Link href={entry.href} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-zinc-950">
                        <div>
                          <p className="text-sm text-zinc-100">{entry.label}</p>
                          <p className="mt-1 text-xs text-zinc-500">Expiring within 7 days</p>
                        </div>
                        <span className={riskFlagChipClass('low')}>{entry.detail}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {openRmas.length > 0 ? (
              <section>
                <div className="flex items-center justify-between gap-4 px-6 py-4">
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Returns</h3>
                  <Link
                    href={adminReturnsHref('open')}
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-200"
                  >
                    View all
                  </Link>
                </div>
                <ul>
                  {openRmas.map((rma) => (
                    <li key={rma.id} className="border-t border-zinc-800">
                      <Link
                        href={`/admin/returns/${encodeURIComponent(rma.id)}`}
                        className="block px-6 py-4 hover:bg-zinc-950"
                      >
                        <p className="text-sm text-zinc-100">{rma.id}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {rma.orderId} · {rmaStatusLabel(rma.status)} · {formatRmaDate(rma.createdAt)}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        )}
      </div>

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
    </section>
  )
}
