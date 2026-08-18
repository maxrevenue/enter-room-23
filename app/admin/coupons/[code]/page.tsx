import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { deactivateCoupon, updateCoupon } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { COUPON_TYPES, couponExpiryDate, getAdminCoupon } from '@/lib/admin-coupons'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const ghostButtonClass =
  'border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500'

function toDateInput(value?: Date | string | null) {
  const date = couponExpiryDate(value)
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

export default async function AdminCouponEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { code } = await params
  const query = await searchParams
  const coupon = await getAdminCoupon(decodeURIComponent(code))
  if (!coupon) notFound()

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/coupons" className="hover:text-zinc-300">
          Coupons
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">{coupon.code}</h1>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {coupon.active ? 'Active' : 'Disabled'} · {coupon.usedCount || 0}
        {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ''} used
      </p>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Check the fields and try again.
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

      <form action={updateCoupon} className="mt-10 max-w-xl space-y-6">
        <input type="hidden" name="originalCode" value={coupon.code} />
        <input type="hidden" name="code" value={coupon.code} />
        <div>
          <span className={labelClass}>Code</span>
          <p className="border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">{coupon.code}</p>
        </div>
        <label className="block">
          <span className={labelClass}>Type</span>
          <select className={fieldClass} name="type" defaultValue={coupon.type}>
            {COUPON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'percent' ? 'Percent' : 'Fixed amount'}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Value</span>
          <input
            className={fieldClass}
            name="value"
            type="number"
            min="0.01"
            step="0.01"
            defaultValue={coupon.value}
            required
          />
        </label>
        <label className="block">
          <span className={labelClass}>Minimum order</span>
          <input
            className={fieldClass}
            name="minOrder"
            type="number"
            min="0"
            step="0.01"
            defaultValue={coupon.minOrder ?? ''}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Usage limit</span>
          <input
            className={fieldClass}
            name="usageLimit"
            type="number"
            min="0"
            step="1"
            defaultValue={coupon.usageLimit ?? ''}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Expires</span>
          <input className={fieldClass} name="expiresAt" type="date" defaultValue={toDateInput(coupon.expiresAt)} />
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="active"
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
            defaultChecked={coupon.active !== false}
          />
          Active
        </label>
        <label className="block">
          <span className={labelClass}>Internal note</span>
          <textarea className={`${fieldClass} min-h-24`} name="note" rows={3} maxLength={500} defaultValue={coupon.note || ''} />
        </label>
        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Save coupon
        </button>
      </form>

      {coupon.active ? (
        <div className="mt-14 border-t border-zinc-800 pt-10">
          <p className={labelClass}>Disable</p>
          <p className="mt-2 text-sm text-zinc-400">Soft-disable this code without deleting it.</p>
          <form action={deactivateCoupon} className="mt-6">
            <input type="hidden" name="code" value={coupon.code} />
            <button type="submit" className={ghostButtonClass}>
              Disable coupon
            </button>
          </form>
        </div>
      ) : null}
    </section>
  )
}
