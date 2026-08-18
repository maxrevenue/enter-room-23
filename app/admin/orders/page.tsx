import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  formatOrderDate,
  formatOrderMoney,
  isOrderFulfilled,
  listAdminOrders,
  normalizeOrderFilter,
  orderItemCount,
  orderStatusClass,
  orderStatusLabel,
  type OrderListFilter,
} from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const FILTERS: Array<{ id: OrderListFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'fulfilled', label: 'Fulfilled' },
  { id: 'closed', label: 'Refunded/Cancelled' },
]

function emptyCopy(filter: OrderListFilter) {
  if (filter === 'open') return 'No open orders.'
  if (filter === 'fulfilled') return 'No fulfilled orders.'
  if (filter === 'closed') return 'No refunded or cancelled orders.'
  return 'No orders yet. Paid checkouts are stored in MongoDB for review here.'
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; filter?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const filter = normalizeOrderFilter(params.filter)
  const orders = await listAdminOrders(80, filter)

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

      <nav aria-label="Order filters" className="mb-8 flex flex-wrap gap-x-6 gap-y-3 border-b border-zinc-800 pb-4">
        {FILTERS.map((item) => {
          const active = filter === item.id
          const href = item.id === 'all' ? '/admin/orders' : `/admin/orders?filter=${item.id}`
          return (
            <Link
              key={item.id}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
                active ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">{emptyCopy(filter)}</p>
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
                  <td className="px-4 py-4 text-zinc-400">{order.email || '—'}</td>
                  <td className="px-4 py-4 text-zinc-500">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-zinc-400">{orderItemCount(order)}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(order.totals?.total)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${orderStatusClass(order.status)}`}
                    >
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
