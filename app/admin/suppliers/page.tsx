import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { formatOrderDateTime, orderStatusLabel } from '@/lib/admin-orders'
import { listSupplierOpsOrders, supplierVendorLabel } from '@/lib/admin-suppliers'

export const dynamic = 'force-dynamic'

const labelClass = 'text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500'

export default async function AdminSuppliersPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const rows = await listSupplierOpsOrders(100)
  const failures = rows.filter((row) => row.supplierError)
  const submissions = rows.filter((row) => row.supplierOrderId)

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Operations</p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Suppliers</h1>
      <p className="mt-4 max-w-2xl text-sm text-zinc-400">
        Recent dropship submissions and supplier failures from order fulfillment records. Supplier trade names stay
        admin-only.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-zinc-800 bg-zinc-900 px-6 py-6">
          <p className={labelClass}>Submissions</p>
          <p className="mt-2 font-serif text-3xl text-zinc-100">{submissions.length}</p>
        </div>
        <div className="border border-zinc-800 bg-zinc-900 px-6 py-6">
          <p className={labelClass}>Failures</p>
          <p className="mt-2 font-serif text-3xl text-zinc-100">{failures.length}</p>
        </div>
      </div>

      <div className="mt-10 overflow-x-auto border border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Supplier ID</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Tracking</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-zinc-500" colSpan={6}>
                  No supplier submissions yet.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={`${row.orderId}:${row.supplierOrderId || 'error'}:${index}`}
                  className="border-b border-zinc-800 last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(row.orderId)}`}
                      className="text-zinc-100 hover:text-zinc-300"
                    >
                      {row.orderId}
                    </Link>
                    <p className="mt-1 text-xs text-zinc-600">{orderStatusLabel(row.status)}</p>
                    {row.supplierError ? (
                      <p className="mt-2 text-xs text-zinc-500">{row.supplierError}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{row.vendor ? supplierVendorLabel(row.vendor) : '—'}</td>
                  <td className="px-4 py-4 font-mono text-xs text-zinc-400">{row.supplierOrderId || '—'}</td>
                  <td className="px-4 py-4 text-zinc-400">{row.supplierStatus || row.trackingStatus || '—'}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {row.trackingNumber ? (
                      <>
                        {row.trackingNumber}
                        {row.trackingStatus ? (
                          <span className="block text-xs text-zinc-600">{row.trackingStatus}</span>
                        ) : null}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-500">
                    {row.submittedAt ? formatOrderDateTime(row.submittedAt) : formatOrderDateTime(row.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
