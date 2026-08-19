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
import { listAdminProducts } from '@/lib/admin-catalog'
import { adminCustomerHref } from '@/lib/admin-customers'
import {
  coerceOrderStatus,
  formatOrderDateTime,
  formatOrderMoney,
  isOrderFulfilled,
  getAdminOrder,
  ORDER_STATUSES,
  orderLineTotal,
  orderStatusBadgeClass,
  orderStatusLabel,
} from '@/lib/admin-orders'
import {
  buildProductsByIdMap,
  collectOrderProductIds,
  getOrderRiskFlags,
  riskFlagChipClass,
} from '@/lib/admin-risk'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const ghostButtonClass =
  'border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500'
const primaryButtonClass =
  'bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200'

function flashMessage(query: { error?: string; saved?: string; inventory?: string }) {
  if (query.error === 'invalid') return { role: 'alert' as const, text: 'Choose a valid status and try again.' }
  if (query.error === 'db') return { role: 'alert' as const, text: 'MongoDB is not available. Changes were not saved.' }
  if (query.error === 'email') {
    return {
      role: 'alert' as const,
      text: 'Confirmation email was not sent. Check the customer address, line items, and Resend configuration.',
    }
  }
  if (query.saved === 'status' && query.inventory === '1') {
    return { role: 'status' as const, text: 'Status saved. Inventory was decremented.' }
  }
  if (query.saved === 'status') return { role: 'status' as const, text: 'Status saved.' }
  if (query.saved === 'notes') return { role: 'status' as const, text: 'Notes saved.' }
  if (query.saved === 'reviewed') return { role: 'status' as const, text: 'Review flag updated.' }
  if (query.saved === 'email') return { role: 'status' as const, text: 'Confirmation email sent.' }
  if (query.saved === '1') return { role: 'status' as const, text: 'Saved.' }
  return null
}

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; saved?: string; inventory?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { id } = await params
  const query = await searchParams
  const order = await getAdminOrder(decodeURIComponent(id))
  if (!order) notFound()

  const [products] = await Promise.all([listAdminProducts()])
  const productsById = buildProductsByIdMap(products, collectOrderProductIds([order]))
  const riskFlags = getOrderRiskFlags(order, productsById)

  const address = order.shippingAddress
  const items = Array.isArray(order.items) ? order.items : []
  const currentStatus = coerceOrderStatus(order.status)
  const flash = flashMessage(query)
  const needsReview = Boolean(order.adminReview)
  const canResend = Boolean(process.env.RESEND_API_KEY && order.email && items.length > 0)
  const cityLine = [address?.city, address?.state, address?.postalCode].filter(Boolean).join(', ')

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/orders" className="hover:text-zinc-300">
          Orders
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl tracking-tight text-zinc-100">{order.orderId}</h1>
        <span className={orderStatusBadgeClass(order.status)}>{orderStatusLabel(order.status)}</span>
      </div>

      {riskFlags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {riskFlags.map((flag) => (
            <span key={flag.id} className={riskFlagChipClass(flag.severity)}>
              {flag.label}
            </span>
          ))}
        </div>
      ) : null}

      {flash ? (
        <p className="mt-6 text-sm text-zinc-400" role={flash.role}>
          {flash.text}
        </p>
      ) : null}

      <dl className="mt-10 grid grid-cols-1 gap-6 border border-zinc-800 bg-zinc-900 px-6 py-8 text-sm sm:grid-cols-2">
        <div>
          <dt className={labelClass}>Order ID</dt>
          <dd className="text-zinc-100">{order.orderId}</dd>
        </div>
        <div>
          <dt className={labelClass}>Status</dt>
          <dd className="text-zinc-100">{orderStatusLabel(order.status)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Created</dt>
          <dd className="text-zinc-300">{formatOrderDateTime(order.createdAt)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Updated</dt>
          <dd className="text-zinc-300">{formatOrderDateTime(order.updatedAt)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Customer email</dt>
          <dd className="text-zinc-100">
            {order.email ? (
              <Link href={adminCustomerHref(order.email)} className="hover:text-zinc-300">
                {order.email}
              </Link>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Fulfillment</dt>
          <dd className="text-zinc-300">{isOrderFulfilled(order) ? 'Fulfilled' : 'Open'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Admin review</dt>
          <dd className="text-zinc-300">{needsReview ? 'Needs review' : 'Reviewed'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Confirmation email</dt>
          <dd className="text-zinc-300">{order.emailSent ? 'Sent' : 'Not sent'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Inventory</dt>
          <dd className="text-zinc-300">{order.inventoryDecremented ? 'Decremented on fulfill' : 'Not decremented'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={labelClass}>Shipping address</dt>
          <dd className="text-zinc-300">
            {address ? (
              <>
                {address.name || '—'}
                {address.line1 ? (
                  <>
                    <br />
                    {address.line1}
                  </>
                ) : null}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                {cityLine ? (
                  <>
                    <br />
                    {cityLine}
                  </>
                ) : null}
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
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Unit price</th>
              <th className="px-4 py-3 font-medium">Line total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={4}>
                  No line items on this order.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={`${item.id || item.name || index}`} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 text-zinc-100">{item.name || item.id || 'Item'}</td>
                  <td className="px-4 py-4 text-zinc-400">{item.qty || 1}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(item.price)}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(orderLineTotal(item))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <dl className="mt-8 max-w-md space-y-3 border border-zinc-800 bg-zinc-900 px-6 py-6 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Subtotal</dt>
          <dd className="text-zinc-300">{formatOrderMoney(order.totals?.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Shipping</dt>
          <dd className="text-zinc-300">{formatOrderMoney(order.totals?.shipping)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">Tax</dt>
          <dd className="text-zinc-300">{formatOrderMoney(order.totals?.tax)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-zinc-800 pt-3">
          <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400">Total</dt>
          <dd className="font-medium text-zinc-100">{formatOrderMoney(order.totals?.total)}</dd>
        </div>
      </dl>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <form action={updateOrderStatus} className="space-y-6">
          <input type="hidden" name="orderId" value={order.orderId} />
          <label className="block">
            <span className={labelClass}>Status</span>
            <select className={fieldClass} name="status" defaultValue={currentStatus}>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {orderStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-zinc-500">
            Fulfilled sets the fulfillment marker. Refunded and cancelled close the order so it leaves the open
            queue.
          </p>
          <p className="text-xs text-zinc-500">
            Card refunds are processed in the CCBill merchant dashboard — not from this panel while underwriting is
            pending.
          </p>
          <button type="submit" className={primaryButtonClass}>
            Update status
          </button>
        </form>

        <form action={updateOrderNotes} className="space-y-6">
          <input type="hidden" name="orderId" value={order.orderId} />
          <label className="block">
            <span className={labelClass}>Internal notes</span>
            <textarea
              className={`${fieldClass} min-h-28`}
              name="notes"
              defaultValue={order.notes || ''}
              rows={5}
              maxLength={2000}
            />
          </label>
          <button type="submit" className={primaryButtonClass}>
            Save notes
          </button>
        </form>
      </div>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-zinc-800 pt-10">
        <form action={markOrderReviewed}>
          <input type="hidden" name="orderId" value={order.orderId} />
          <input type="hidden" name="adminReview" value={needsReview ? '0' : '1'} />
          <button type="submit" className={ghostButtonClass}>
            {needsReview ? 'Mark as reviewed' : 'Flag for review'}
          </button>
        </form>

        <form action={resendOrderEmail}>
          <input type="hidden" name="orderId" value={order.orderId} />
          <button
            type="submit"
            className={`${ghostButtonClass} disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600`}
            disabled={!canResend}
          >
            Resend confirmation email
          </button>
        </form>
      </div>
      {!canResend ? (
        <p className="mt-4 text-xs text-zinc-500">
          Resend is unavailable until a customer email, line items, and Resend are configured.
        </p>
      ) : null}

      <div className="mt-10 border border-zinc-800 bg-zinc-900 px-6 py-6">
        <p className={labelClass}>Refunds</p>
        <p className="mt-3 text-sm text-zinc-400">
          Refunds via CCBill dashboard. This admin panel records order status only — it does not issue card refunds.
        </p>
        <button
          type="button"
          disabled
          className="mt-4 cursor-not-allowed border border-zinc-800 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-600"
        >
          Refunds via CCBill dashboard
        </button>
      </div>
    </section>
  )
}
