import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createCoupon } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { COUPON_TYPES } from '@/lib/admin-coupons'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

export default async function AdminNewCouponPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const query = await searchParams

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/coupons" className="hover:text-zinc-300">
          Coupons
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">New coupon</h1>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Code, type, and a valid value are required. Percent values must be 1–100.
        </p>
      ) : null}
      {query.error === 'duplicate' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          That coupon code already exists.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}

      <form action={createCoupon} className="mt-10 max-w-xl space-y-6">
        <label className="block">
          <span className={labelClass}>Code</span>
          <input className={fieldClass} name="code" required minLength={3} placeholder="WELCOME10" />
        </label>
        <label className="block">
          <span className={labelClass}>Type</span>
          <select className={fieldClass} name="type" defaultValue="percent">
            {COUPON_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === 'percent' ? 'Percent' : 'Fixed amount'}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Value</span>
          <input className={fieldClass} name="value" type="number" min="0.01" step="0.01" required />
        </label>
        <label className="block">
          <span className={labelClass}>Minimum order</span>
          <input className={fieldClass} name="minOrder" type="number" min="0" step="0.01" />
        </label>
        <label className="block">
          <span className={labelClass}>Usage limit</span>
          <input className={fieldClass} name="usageLimit" type="number" min="0" step="1" />
        </label>
        <label className="block">
          <span className={labelClass}>Expires</span>
          <input className={fieldClass} name="expiresAt" type="date" />
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" name="active" className="h-4 w-4 border-zinc-700 bg-zinc-950" defaultChecked />
          Active
        </label>
        <label className="block">
          <span className={labelClass}>Internal note</span>
          <textarea className={`${fieldClass} min-h-24`} name="note" rows={3} maxLength={500} />
        </label>
        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Create coupon
        </button>
      </form>
    </section>
  )
}
