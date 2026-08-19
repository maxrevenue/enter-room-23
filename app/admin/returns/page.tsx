import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  adminReturnsHref,
  formatRmaDate,
  listAdminRmas,
  parseRmaListFilter,
  RMA_LIST_FILTERS,
  rmaListEmptyMessage,
  rmaStatusBadgeClass,
  rmaStatusLabel,
  type RmaStatus,
} from '@/lib/admin-returns'

export const dynamic = 'force-dynamic'

const viewPillActive =
  'inline-flex border border-zinc-100 bg-zinc-100 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-950'
const viewPillIdle =
  'inline-flex border border-zinc-700 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'

export default async function AdminReturnsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const filter = parseRmaListFilter(params.status)
  const rmas = await listAdminRmas(filter, 100)

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Post-sale</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Returns</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-500">
          RMA workflow tracks return intent only. Card refunds are processed manually in the CCBill merchant
          dashboard — not from this panel.
        </p>
      </header>

      {params.error === 'missing' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That return could not be found.
        </p>
      ) : null}
      {params.saved === '1' ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <nav aria-label="Return filters" className="mb-8 flex flex-wrap gap-2">
        {RMA_LIST_FILTERS.map((tab) => {
          const active = tab.id === filter
          return (
            <Link
              key={tab.id}
              href={adminReturnsHref(tab.id as RmaStatus | 'all' | 'open')}
              className={active ? viewPillActive : viewPillIdle}
              aria-current={active ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {rmas.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          {rmaListEmptyMessage(filter)}
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">RMA</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rmas.map((rma) => (
                <tr key={rma.id} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{rma.id}</td>
                  <td className="px-4 py-4 text-zinc-300">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(rma.orderId)}`}
                      className="hover:text-zinc-100"
                    >
                      {rma.orderId}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{rma.email || '—'}</td>
                  <td className="px-4 py-4 text-zinc-400">{rma.items.length}</td>
                  <td className="px-4 py-4">
                    <span className={rmaStatusBadgeClass(rma.status)}>{rmaStatusLabel(rma.status)}</span>
                  </td>
                  <td className="px-4 py-4 text-zinc-500">{formatRmaDate(rma.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/returns/${encodeURIComponent(rma.id)}`}
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
