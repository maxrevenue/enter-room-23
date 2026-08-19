import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  decodeCustomerEmailParam,
  formatCustomerDate,
  formatCustomerSpend,
  getAdminCustomer,
} from '@/lib/admin-customers'
import {
  formatOrderDate,
  formatOrderMoney,
  orderItemCount,
  orderStatusBadgeClass,
  orderStatusLabel,
} from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { email: rawEmail } = await params
  const email = decodeCustomerEmailParam(rawEmail)
  const result = await getAdminCustomer(email)
  if (!result) notFound()

  const { customer, orders } = result
  const address = customer.shippingAddress
  const cityLine = [address?.city, address?.state, address?.postalCode].filter(Boolean).join(', ')

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/customers" className="hover:text-zinc-300">
          Customers
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">{customer.email}</h1>
      <p className="mt-3 text-sm text-zinc-400">{customer.name || 'No name on file'}</p>

      <dl className="mt-10 grid grid-cols-1 gap-6 border border-zinc-800 bg-zinc-900 px-6 py-8 text-sm sm:grid-cols-3">
        <div>
          <dt className={labelClass}>Orders</dt>
          <dd className="text-zinc-100">{customer.orderCount}</dd>
        </div>
        <div>
          <dt className={labelClass}>Lifetime spend</dt>
          <dd className="text-zinc-100">{formatCustomerSpend(customer.totalSpent)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Last order</dt>
          <dd className="text-zinc-100">{formatCustomerDate(customer.lastOrderAt)}</dd>
        </div>
      </dl>

      <div className="mt-10 border border-zinc-800 bg-zinc-900 px-6 py-8">
        <p className={labelClass}>Latest shipping address</p>
        {address ? (
          <address className="not-italic text-sm leading-7 text-zinc-300">
            {address.name ? <p>{address.name}</p> : null}
            {address.line1 ? <p>{address.line1}</p> : null}
            {address.line2 ? <p>{address.line2}</p> : null}
            {cityLine ? <p>{cityLine}</p> : null}
            {address.country ? <p>{address.country}</p> : null}
            {address.phone ? <p>{address.phone}</p> : null}
          </address>
        ) : (
          <p className="text-sm text-zinc-500">No shipping address on file.</p>
        )}
      </div>

      <div className="mt-10">
        <p className={labelClass}>Order history</p>
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{order.orderId}</td>
                  <td className="px-4 py-4 text-zinc-500">{formatOrderDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-zinc-300">{orderItemCount(order)}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatOrderMoney(order.totals?.total)}</td>
                  <td className="px-4 py-4">
                    <span className={orderStatusBadgeClass(order.status)}>{orderStatusLabel(order.status)}</span>
                  </td>
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
      </div>
    </section>
  )
}
