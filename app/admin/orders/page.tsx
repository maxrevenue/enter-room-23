import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { listAdminOrders } from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

function formatMoney(value?: number) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return `$${amount.toFixed(2)}`
}

function formatDate(value?: Date | string) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const orders = await listAdminOrders()

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

      {orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          No orders yet. Paid checkouts are stored in MongoDB for review here.
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{order.orderId}</td>
                  <td className="px-4 py-4 text-zinc-400">{order.email || '—'}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatMoney(order.totals?.total)}</td>
                  <td className="px-4 py-4 text-zinc-400">{order.status || 'paid'}</td>
                  <td className="px-4 py-4 text-zinc-500">{formatDate(order.createdAt)}</td>
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
