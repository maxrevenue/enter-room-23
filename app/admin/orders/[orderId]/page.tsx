import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import {
  markOrderReviewed,
  resendOrderEmail,
  updateOrderNotes,
  updateOrderStatus,
} from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  formatOrderDate,
  formatOrderMoney,
  getAdminOrder,
  isOrderFulfilled,
  ORDER_STATUSES,
  orderNotes,
  orderStatusClass,
  orderStatusLabel,
} from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const ghostButtonClass =
  'border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500'
const primaryButtonClass =
  'bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200'

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { orderId } = await params
  const query = await searchParams
  const order = await getAdminOrder(decodeURIComponent(orderId))
  if (!order) notFound()

  const address = order.shippingAddress
  const items = Array.isArray(order.items) ? order.items : []
  const currentStatus = ORDER_STATUSES.includes(order.status as (typeof ORDER_STATUSES)[number])
    ? order.status
    : 'paid'
  const reviewed = Boolean(order.adminReview)
  const canEmail = Boolean(order.email && items.length > 0 && order.totals)

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/orders" className="hover:text-zinc-300">
          Orders
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl tracking-tight text-zinc-100">{order.orderId}</h1>
        <span
          className={`inline-flex border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${orderStatusClass(order.status)}`}
        >
          {orderStatusLabel(order.status)}
        </span>
      </div>

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
      {query.error === 'email' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Confirmation email could not be sent.
        </p>
      ) : null}
      {query.saved === '1' ? (
        <p className="mt-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}
      {query.saved === 'email' ? (
        <p className="mt-6 text-sm text-zinc-400" role="status">
          Confirmation email sent.
        </p>
      ) : null}

      <dl className="mt-10 grid grid-cols-1 gap-6 border border-zinc-800 bg-zinc-900 px-6 py-8 text-sm sm:grid-cols-2">
        <div>
          <dt className={labelClass}>Created</dt>
          <dd className="text-zinc-100">{formatOrderDate(order.createdAt, true)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Updated</dt>
          <dd className="text-zinc-100">{formatOrderDate(order.updatedAt, true)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Email</dt>
          <dd className="text-zinc-100">{order.email || '—'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Fulfillment</dt>
          <dd className="text-zinc-100">{isOrderFulfilled(order) ? 'Fulfilled' : 'Open'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Review</dt>
          <dd className="text-zinc-100">{reviewed ? 'Reviewed' : 'Needs review'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Confirmation</dt>
          <dd className="text-zinc-100">{order.emailSent ? 'Sent' : 'Not sent'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={labelClass}>Ship to</dt>
          <dd className="text-zinc-300">
            {address ? (
              <>
                {address.name || '—'}
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
                {address.country ? (
                  <>
                    <br />
                    {address.country}
                  </>
                ) : null}
                {address.phone ? (
                  <>
                    <br />
                    {address.phone}
                  </>
                ) : null}
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
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">Line</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const qty = Math.max(1, Math.floor(Number(item.qty) || 1))
              const unit = Number(item.price)
              const line = Number.isFinite(unit) ? unit * qty : undefined
              return (
                <tr key={`${item.id || item.name || index}`} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 text-zinc-100">{item.name || item.id || 'Item'}</td>
                  <td className="px-4 py-4 text-zinc-400">{qty}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(unit)}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(line)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <dl className="mt-8 max-w-sm space-y-3 border border-zinc-800 bg-zinc-900 px-6 py-6 text-sm">
        <div className="flex justify-between gap-6">
          <dt className="text-zinc-500">Subtotal</dt>
          <dd className="text-zinc-200">{formatOrderMoney(order.totals?.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-zinc-500">Shipping</dt>
          <dd className="text-zinc-200">{formatOrderMoney(order.totals?.shipping)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-zinc-500">Tax</dt>
          <dd className="text-zinc-200">{formatOrderMoney(order.totals?.tax)}</dd>
        </div>
        <div className="flex justify-between gap-6 border-t border-zinc-800 pt-3">
          <dt className="text-zinc-400">Total</dt>
          <dd className="text-zinc-100">{formatOrderMoney(order.totals?.total)}</dd>
        </div>
      </dl>

      <form action={updateOrderStatus} className="mt-10 max-w-xl space-y-6">
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
        <button type="submit" className={primaryButtonClass}>
          Update status
        </button>
      </form>

      <form action={updateOrderNotes} className="mt-10 max-w-xl space-y-6">
        <input type="hidden" name="orderId" value={order.orderId} />
        <label className="block">
          <span className={labelClass}>Internal notes</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            name="notes"
            defaultValue={orderNotes(order)}
            rows={4}
            maxLength={2000}
          />
        </label>
        <button type="submit" className={ghostButtonClass}>
          Save notes
        </button>
      </form>

      <div className="mt-10 flex flex-wrap gap-3">
        <form action={markOrderReviewed}>
          <input type="hidden" name="orderId" value={order.orderId} />
          <input type="hidden" name="adminReview" value={reviewed ? '0' : '1'} />
          <button type="submit" className={ghostButtonClass}>
            {reviewed ? 'Clear review' : 'Mark as reviewed'}
          </button>
        </form>
        {canEmail ? (
          <form action={resendOrderEmail}>
            <input type="hidden" name="orderId" value={order.orderId} />
            <button type="submit" className={ghostButtonClass}>
              Resend confirmation
            </button>
          </form>
        ) : (
          <p className="self-center text-sm text-zinc-500">Confirmation email is unavailable for this order.</p>
        )}
      </div>
    </section>
  )
}
