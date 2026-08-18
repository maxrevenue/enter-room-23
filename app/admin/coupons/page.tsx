import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { deactivateCoupon } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { couponExpiryDate, formatCouponValue, listAdminCoupons } from '@/lib/admin-coupons'

export const dynamic = 'force-dynamic'

const actionClass =
  'text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-100'

function formatExpiry(value?: Date | string | null) {
  const date = couponExpiryDate(value)
  if (!date) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const coupons = await listAdminCoupons()

  return (
    <section>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Commerce</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Coupons</h1>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          New coupon
        </Link>
      </header>

      {params.error === 'db' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}
      {params.error === 'missing' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That coupon could not be found.
        </p>
      ) : null}
      {params.saved === '1' ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      {coupons.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          No coupons yet. Create a code to replace hardcoded storefront promos.
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Value</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Used / limit</th>
                <th className="px-4 py-3 font-medium">Expiry</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.code} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{coupon.code}</td>
                  <td className="px-4 py-4 text-zinc-400">{coupon.type}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatCouponValue(coupon)}</td>
                  <td className="px-4 py-4 text-zinc-400">{coupon.active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {coupon.usedCount || 0}
                    {' / '}
                    {coupon.usageLimit != null ? coupon.usageLimit : '—'}
                  </td>
                  <td className="px-4 py-4 text-zinc-500">{formatExpiry(coupon.expiresAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link href={`/admin/coupons/${encodeURIComponent(coupon.code)}`} className={actionClass}>
                        Edit
                      </Link>
                      {coupon.active ? (
                        <form action={deactivateCoupon}>
                          <input type="hidden" name="code" value={coupon.code} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Disable
                          </button>
                        </form>
                      ) : null}
                    </div>
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
