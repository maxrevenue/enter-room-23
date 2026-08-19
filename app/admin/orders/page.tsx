import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OrdersBulkTable } from '@/components/admin/orders-bulk-table'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { listAdminProducts } from '@/lib/admin-catalog'
import {
  formatOrderDate,
  formatOrderMoney,
  isOrderFulfilled,
  orderItemCount,
  orderStatusBadgeClass,
  orderStatusLabel,
  parseOrderSearch,
} from '@/lib/admin-orders'
import {
  buildProductsByIdMap,
  collectOrderProductIds,
  getOrderRiskFlags,
  riskFlagChipClass,
} from '@/lib/admin-risk'
import { orderAgeDisplay } from '@/lib/admin-sla'
import {
  adminOrdersViewHref,
  listAdminOrdersForView,
  ORDER_VIEWS,
  orderViewEmptyMessage,
  parseOrderView,
  type OrderViewId,
} from '@/lib/admin-views'

export const dynamic = 'force-dynamic'

const viewPillActive =
  'inline-flex border border-zinc-100 bg-zinc-100 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-950'
const viewPillIdle =
  'inline-flex border border-zinc-700 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    view?: string
    filter?: string
    q?: string
    bulk?: string
    count?: string
    skippedCount?: string
    msg?: string
  }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const view = parseOrderView(params)
  const q = parseOrderSearch(params.q)
  const now = new Date()
  const [orders, products] = await Promise.all([
    listAdminOrdersForView(view, 100, q, now),
    listAdminProducts(),
  ])
  const productsById = buildProductsByIdMap(products, collectOrderProductIds(orders))

  const bulkCount = Number(params.count)
  const bulkCountLabel = Number.isFinite(bulkCount) && bulkCount >= 0 ? bulkCount : null
  const skippedCount = Number(params.skippedCount)
  const skippedCountLabel = Number.isFinite(skippedCount) && skippedCount > 0 ? skippedCount : null

  const rows = orders.map((order) => {
    const flags = getOrderRiskFlags(order, productsById, now)
    const age = orderAgeDisplay(order, now)
    return {
      orderId: order.orderId,
      email: String(order.email || ''),
      dateLabel: formatOrderDate(order.createdAt),
      ageLabel: age.label,
      ageClass: age.className,
      itemCount: orderItemCount(order),
      totalLabel: formatOrderMoney(order.totals?.total),
      statusLabel: orderStatusLabel(order.status),
      statusBadgeClass: orderStatusBadgeClass(order.status),
      fulfilledLabel: isOrderFulfilled(order) ? 'Yes' : '—',
      flags: flags.map((flag) => ({
        id: flag.id,
        label: flag.label,
        chipClass: riskFlagChipClass(flag.severity),
      })),
    }
  })

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Fulfillment</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Orders</h1>
      </header>

      {params.bulk === 'ok' && bulkCountLabel != null ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Bulk update applied to {bulkCountLabel} order{bulkCountLabel === 1 ? '' : 's'}
          {skippedCountLabel != null
            ? ` · ${skippedCountLabel} skipped (not eligible or missing)`
            : ''}
          .
        </p>
      ) : null}
      {params.bulk === 'error' && params.msg ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          {params.msg}
        </p>
      ) : null}
      {params.error === 'missing' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That order could not be found.
        </p>
      ) : null}

      <nav aria-label="Order views" className="mb-6 flex flex-wrap gap-2">
        {ORDER_VIEWS.map((preset) => {
          const active = preset.id === view
          return (
            <Link
              key={preset.id}
              href={adminOrdersViewHref(preset.id as OrderViewId, q)}
              className={active ? viewPillActive : viewPillIdle}
              aria-current={active ? 'page' : undefined}
            >
              {preset.label}
            </Link>
          )
        })}
      </nav>

      <form action="/admin/orders" method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        {view !== 'all' ? <input type="hidden" name="view" value={view} /> : null}
        <label className="block flex-1">
          <span className="sr-only">Search orders</span>
          <input
            className={fieldClass}
            name="q"
            defaultValue={q}
            placeholder="Search order ID, email, or name"
          />
        </label>
        <button
          type="submit"
          className="bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Search
        </button>
        {q ? (
          <Link
            href={adminOrdersViewHref(view)}
            className="inline-flex items-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-100"
          >
            Clear
          </Link>
        ) : null}
      </form>

      {orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          {orderViewEmptyMessage(view, q)}
        </p>
      ) : (
        <OrdersBulkTable orders={rows} view={view} q={q} showPackWave={view === 'open'} />
      )}
    </section>
  )
}
