import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getAdminAnalytics, ORDER_EXPORT_STATUSES } from '@/lib/admin-analytics'
import { formatMarginMoney } from '@/lib/admin-margin'
import { formatOrderDate, formatOrderMoney, orderStatusBadgeClass, orderStatusLabel } from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const fieldClass =
  'border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const ghostButtonClass =
  'inline-flex border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500'
const primaryButtonClass =
  'inline-flex bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200'

export default async function AdminAnalyticsPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const analytics = await getAdminAnalytics()

  const cards = [
    { label: 'Orders today', value: String(analytics.windows.today.orderCount) },
    { label: 'Orders · 7 days', value: String(analytics.windows.last7.orderCount) },
    { label: 'Orders · 30 days', value: String(analytics.windows.last30.orderCount) },
    { label: 'Revenue today', value: formatOrderMoney(analytics.windows.today.revenue) },
    { label: 'Revenue · 7 days', value: formatOrderMoney(analytics.windows.last7.revenue) },
    { label: 'Revenue · 30 days', value: formatOrderMoney(analytics.windows.last30.revenue) },
    { label: 'Est. margin · 7d', value: formatMarginMoney(analytics.windows.last7.margin) },
    { label: 'Est. margin · 30d', value: formatMarginMoney(analytics.windows.last30.margin) },
    { label: 'Open orders', value: String(analytics.openOrders) },
    { label: 'Low stock', value: String(analytics.lowStock) },
  ]

  return (
    <section>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Operations</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Analytics</h1>
        </div>
        <Link href="/admin/audit" className={ghostButtonClass}>
          Audit log
        </Link>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.label} className="border border-zinc-800 bg-zinc-900 px-6 py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">{card.label}</p>
            <p className="mt-4 font-serif text-2xl tracking-tight text-zinc-100">{card.value}</p>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-zinc-500">
        Revenue sums <span className="text-zinc-400">totals.total</span> for paid and fulfilled orders. Refunded and
        cancelled orders are excluded. Estimated margin uses admin COGS on known line items only.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-zinc-800 bg-zinc-900 px-6 py-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Contribution</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-zinc-500">Revenue · 7 days</p>
              <p className="mt-2 font-serif text-2xl text-zinc-100">{formatOrderMoney(analytics.windows.last7.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Est. margin · 7 days</p>
              <p className="mt-2 font-serif text-2xl text-zinc-100">{formatMarginMoney(analytics.windows.last7.margin)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Revenue · 30 days</p>
              <p className="mt-2 font-serif text-2xl text-zinc-100">{formatOrderMoney(analytics.windows.last30.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Est. margin · 30 days</p>
              <p className="mt-2 font-serif text-2xl text-zinc-100">{formatMarginMoney(analytics.windows.last30.margin)}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-zinc-800 bg-zinc-900">
          <header className="border-b border-zinc-800 px-6 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Catalog</p>
            <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">Top products · 30 days</h2>
          </header>
          {analytics.topProducts.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-500">No paid sales in the last 30 days.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Units</th>
                    <th className="px-6 py-3 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product) => (
                    <tr key={product.id} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-6 py-4 text-zinc-100">{product.name}</td>
                      <td className="px-4 py-4 text-zinc-400">{product.units}</td>
                      <td className="px-6 py-4 text-zinc-300">{formatOrderMoney(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-zinc-800 bg-zinc-900">
          <header className="border-b border-zinc-800 px-6 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Catalog</p>
            <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">Top products by margin · 30 days</h2>
          </header>
          {analytics.topProductsByMargin.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-500">No margin data in the last 30 days.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Units</th>
                    <th className="px-6 py-3 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProductsByMargin.map((product) => (
                    <tr key={`margin:${product.id}`} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-6 py-4 text-zinc-100">{product.name}</td>
                      <td className="px-4 py-4 text-zinc-400">{product.units}</td>
                      <td className="px-6 py-4 text-zinc-300">{formatMarginMoney(product.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="border border-zinc-800 bg-zinc-900 lg:col-span-2">
          <header className="flex items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Exceptions</p>
              <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">Recent refunds</h2>
            </div>
            <Link
              href="/admin/orders?view=refunded_cancelled"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-100"
            >
              View all
            </Link>
          </header>
          {analytics.recentRefunds.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-500">No refunded or cancelled orders.</p>
          ) : (
            <ul>
              {analytics.recentRefunds.map((order) => (
                <li key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                    className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-zinc-950"
                  >
                    <div>
                      <p className="text-sm text-zinc-100">{order.orderId}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {order.email || '—'} · {formatOrderDate(order.updatedAt || order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">{formatOrderMoney(order.total)}</p>
                      <p className="mt-2">
                        <span className={orderStatusBadgeClass(order.status)}>{orderStatusLabel(order.status)}</span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section id="export" className="mt-10 border border-zinc-800 bg-zinc-900">
        <header className="border-b border-zinc-800 px-6 py-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Export</p>
          <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">CSV downloads</h2>
        </header>
        <div className="grid grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-2">
          <form method="get" action="/admin/export/orders" className="space-y-5">
            <p className="text-sm text-zinc-400">Orders, optionally filtered by status and date.</p>
            <label className="block">
              <span className={labelClass}>Status</span>
              <select className={`${fieldClass} w-full`} name="status" defaultValue="">
                <option value="">All</option>
                {ORDER_EXPORT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelClass}>From</span>
                <input className={`${fieldClass} w-full`} type="date" name="from" />
              </label>
              <label className="block">
                <span className={labelClass}>To</span>
                <input className={`${fieldClass} w-full`} type="date" name="to" />
              </label>
            </div>
            <button type="submit" className={primaryButtonClass}>
              Export orders
            </button>
          </form>

          <div className="space-y-5">
            <p className="text-sm text-zinc-400">Admin catalog snapshot, including archived products.</p>
            <a href="/admin/export/products" className={ghostButtonClass}>
              Export products
            </a>
          </div>
        </div>
      </section>
    </section>
  )
}
