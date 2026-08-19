import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { updateRma } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  allowedRmaStatusTransitions,
  formatRmaDate,
  getAdminRma,
  RMA_RESOLUTIONS,
  rmaResolutionLabel,
  rmaStatusBadgeClass,
  rmaStatusLabel,
} from '@/lib/admin-returns'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const primaryButtonClass =
  'bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200'

function flashMessage(query: {
  error?: string
  saved?: string
  restock?: string
}) {
  if (query.error === 'invalid_transition') {
    return { role: 'alert' as const, text: 'That status transition is not allowed.' }
  }
  if (query.error === 'db') {
    return { role: 'alert' as const, text: 'MongoDB is not available. Changes were not saved.' }
  }
  if (query.saved === 'created') {
    return { role: 'status' as const, text: 'RMA created.' }
  }
  if (query.saved === 'status' && query.restock === '1') {
    return { role: 'status' as const, text: 'Status saved. Inventory restocked.' }
  }
  if (query.saved === 'status' && query.restock === 'already') {
    return { role: 'status' as const, text: 'Status saved. Inventory was already restocked for this RMA.' }
  }
  if (query.saved === 'status') {
    return { role: 'status' as const, text: 'Status saved.' }
  }
  if (query.saved === '1' && query.restock === 'already') {
    return { role: 'status' as const, text: 'Saved. Inventory was already restocked for this RMA.' }
  }
  if (query.saved === '1') {
    return { role: 'status' as const, text: 'Saved.' }
  }
  return null
}

export default async function AdminReturnDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; saved?: string; restock?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { id } = await params
  const query = await searchParams
  const rma = await getAdminRma(decodeURIComponent(id))
  if (!rma) notFound()

  const transitions = allowedRmaStatusTransitions(rma.status)
  const flash = flashMessage(query)
  const terminal = rma.status === 'closed' || rma.status === 'rejected'

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/returns" className="hover:text-zinc-300">
          Returns
        </Link>
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl tracking-tight text-zinc-100">{rma.id}</h1>
        <span className={rmaStatusBadgeClass(rma.status)}>{rmaStatusLabel(rma.status)}</span>
      </div>

      {flash ? (
        <p className="mt-6 text-sm text-zinc-400" role={flash.role}>
          {flash.text}
        </p>
      ) : null}

      <dl className="mt-10 grid grid-cols-1 gap-6 border border-zinc-800 bg-zinc-900 px-6 py-8 text-sm sm:grid-cols-2">
        <div>
          <dt className={labelClass}>Order</dt>
          <dd className="text-zinc-100">
            <Link href={`/admin/orders/${encodeURIComponent(rma.orderId)}`} className="hover:text-zinc-300">
              {rma.orderId}
            </Link>
          </dd>
        </div>
        <div>
          <dt className={labelClass}>Customer email</dt>
          <dd className="text-zinc-300">{rma.email || '—'}</dd>
        </div>
        <div>
          <dt className={labelClass}>Created</dt>
          <dd className="text-zinc-300">{formatRmaDate(rma.createdAt)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Updated</dt>
          <dd className="text-zinc-300">{formatRmaDate(rma.updatedAt)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Resolution</dt>
          <dd className="text-zinc-300">{rmaResolutionLabel(rma.resolution)}</dd>
        </div>
        <div>
          <dt className={labelClass}>Restock applied</dt>
          <dd className="text-zinc-300">{rma.restockApplied ? 'Yes' : 'No'}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={labelClass}>Reason</dt>
          <dd className="text-zinc-300">{rma.reason || '—'}</dd>
        </div>
      </dl>

      <div className="mt-8 overflow-x-auto border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {rma.items.map((item) => (
              <tr key={item.productId} className="border-b border-zinc-800 last:border-b-0">
                <td className="px-4 py-4 text-zinc-100">{item.name}</td>
                <td className="px-4 py-4 text-zinc-400">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={updateRma} className="mt-12 max-w-xl space-y-6">
        <input type="hidden" name="id" value={rma.id} />

        <label className="block">
          <span className={labelClass}>Resolution</span>
          <select
            className={fieldClass}
            name="resolution"
            defaultValue={rma.resolution || 'refund_pending'}
            disabled={terminal}
          >
            {RMA_RESOLUTIONS.map((resolution) => (
              <option key={resolution} value={resolution}>
                {rmaResolutionLabel(resolution)}
              </option>
            ))}
          </select>
        </label>

        {transitions.length > 0 ? (
          <label className="block">
            <span className={labelClass}>Advance status</span>
            <select className={fieldClass} name="status" defaultValue="">
              <option value="">Keep {rmaStatusLabel(rma.status)}</option>
              {transitions.map((status) => (
                <option key={status} value={status}>
                  {rmaStatusLabel(status)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-xs text-zinc-500">No further status transitions available.</p>
        )}

        <label className="block">
          <span className={labelClass}>Internal notes</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            name="notes"
            defaultValue={rma.notes || ''}
            rows={5}
            maxLength={2000}
          />
        </label>

        <p className="text-xs text-zinc-500">
          CCBill card refunds are issued from the merchant dashboard only. Use resolution fields to track manual
          refund intent. Restock runs once when status becomes Restocked with resolution Restock inventory.
        </p>

        {rma.restockApplied ? (
          <p className="text-xs text-zinc-500">Inventory already restocked for this RMA.</p>
        ) : null}

        <button type="submit" className={primaryButtonClass}>
          Save changes
        </button>
      </form>
    </section>
  )
}
