import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { formatAuditDate, listAdminAuditLogs } from '@/lib/admin-audit'

export const dynamic = 'force-dynamic'

function entityHref(entityType: string, entityId: string) {
  const id = encodeURIComponent(entityId)
  if (entityType === 'product') return `/admin/products/${id}`
  if (entityType === 'order') return `/admin/orders/${id}`
  if (entityType === 'coupon') return `/admin/coupons/${id}`
  if (entityType === 'settings') return '/admin/settings'
  return ''
}

export default async function AdminAuditPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const entries = await listAdminAuditLogs()

  return (
    <section>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Operations</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Audit</h1>
        </div>
        <Link
          href="/admin/analytics"
          className="inline-flex border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500"
        >
          Analytics
        </Link>
      </header>

      {entries.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          No audit entries yet. Price, visibility, order status, coupon, and settings changes are recorded here.
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Actor</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const href = entityHref(entry.entityType, entry.entityId)
                return (
                  <tr key={entry.id} className="border-b border-zinc-800 last:border-b-0">
                    <td className="px-4 py-4 text-zinc-500">{formatAuditDate(entry.at)}</td>
                    <td className="px-4 py-4 text-zinc-300">{entry.action}</td>
                    <td className="px-4 py-4 text-zinc-400">
                      {href ? (
                        <Link href={href} className="hover:text-zinc-100">
                          {entry.entityType} · {entry.entityId}
                        </Link>
                      ) : (
                        <span>
                          {entry.entityType} · {entry.entityId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-zinc-200">{entry.message || '—'}</td>
                    <td className="px-4 py-4 text-zinc-500">{entry.actor || 'admin'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
