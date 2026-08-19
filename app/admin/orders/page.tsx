import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { adminCustomerHref } from '@/lib/admin-customers'
import {
  adminOrdersHref,
  formatOrderDate,
  formatOrderMoney,
  isOrderFulfilled,
  listAdminOrders,
  orderItemCount,
  orderStatusBadgeClass,
  orderStatusLabel,
  parseOrderFilter,
  parseOrderSearch,
  type OrderFilter,
} from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const FILTER_TABS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'fulfilled', label: 'Fulfilled' },
  { id: 'closed', label: 'Refunded/Cancelled' },
]

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; filter?: string; q?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const filter = parseOrderFilter(params.filter)
  const q = parseOrderSearch(params.q)
  const orders = await listAdminOrders(filter, 100, q)

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Fulfillment</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Orders</h1>
      </header>

      {params.error === 'missing' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That order could not be found.
        </p>
      ) : null}

      <form action="/admin/orders" method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        {filter !== 'all' ? <input type="hidden" name="filter" value={filter} /> : null}
        <label className="block flex-1">
          <span className="sr-only">Search orders</span>
          <input
            className={fieldClass}
            name="q"
            defaultValue={q}
            placeholder="Search order ID, email, or name"
          />
        </label>
        <button
          type="submit"
          className="bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Search
        </button>
        {q ? (
          <Link
            href={adminOrdersHref(filter)}
            className="inline-flex items-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-100"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <nav aria-label="Filter orders" className="mb-8 flex flex-wrap gap-x-8 gap-y-3 border-b border-zinc-800 pb-4">
        {FILTER_TABS.map((tab) => {
          const active = tab.id === filter
          return (
            <Link
              key={tab.id}
              href={adminOrdersHref(tab.id, q)}
              className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                active ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          {q
            ? 'No orders match this search.'
            : filter === 'all'
              ? 'No orders yet. Paid checkouts are stored in MongoDB for review here.'
              : 'No orders match this filter.'}
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Fulfilled</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{order.orderId}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {order.email ? (
                      <Link href={adminCustomerHref(order.email)} className="hover:text-zinc-100">
                        {order.email}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-500">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-zinc-300">{orderItemCount(order)}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(order.totals?.total)}</td>
                  <td className="px-4 py-4">
                    <span className={orderStatusBadgeClass(order.status)}>
                      {orderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{isOrderFulfilled(order) ? 'Yes' : '—'}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                      className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
