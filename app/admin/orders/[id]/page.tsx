import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { updateOrder } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getAdminOrder, ORDER_STATUSES } from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

function formatMoney(value?: number) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return `$${amount.toFixed(2)}`
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { id } = await params
  const query = await searchParams
  const order = await getAdminOrder(decodeURIComponent(id))
  if (!order) notFound()

  const address = order.shippingAddress
  const items = Array.isArray(order.items) ? order.items : []
  const currentStatus = ORDER_STATUSES.includes(order.status as (typeof ORDER_STATUSES)[number])
    ? order.status
    : 'paid'

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/orders" className="hover:text-zinc-300">
          Orders
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">{order.orderId}</h1>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Choose a valid status and try again.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}
      {query.saved === '1' ? (
        <p className="mt-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <dl className="mt-10 grid grid-cols-1 gap-6 border border-zinc-800 bg-zinc-900 px-6 py-8 text-sm sm:grid-cols-2">
        <div>
          <dt className={labelClass}>Email</dt>
          <dd className="text-zinc-100">{order.email || '—'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Total</dt>
          <dd className="text-zinc-100">{formatMoney(order.totals?.total)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={labelClass}>Ship to</dt>
          <dd className="text-zinc-300">
            {address ? (
              <>
                {address.name}
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
              </>
            ) : (
              '—'
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-8 overflow-x-auto border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.id || item.name || index}`} className="border-b border-zinc-800 last:border-b-0">
                <td className="px-4 py-4 text-zinc-100">{item.name || item.id || 'Item'}</td>
                <td className="px-4 py-4 text-zinc-400">{item.qty || 1}</td>
                <td className="px-4 py-4 text-zinc-300">{formatMoney(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={updateOrder} className="mt-10 max-w-xl space-y-6">
        <input type="hidden" name="orderId" value={order.orderId} />
        <label className="block">
          <span className={labelClass}>Status</span>
          <select className={fieldClass} name="status" defaultValue={currentStatus}>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Internal notes</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            name="notes"
            defaultValue={order.notes || ''}
            rows={4}
            maxLength={2000}
          />
        </label>
        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Update order
        </button>
      </form>
    </section>
  )
}
