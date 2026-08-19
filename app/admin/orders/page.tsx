import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { OrdersBulkTable } from '@/components/admin/orders-bulk-table'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { listAdminProducts } from '@/lib/admin-catalog'
import {
  adminOrdersHref,
  formatOrderDate,
  formatOrderMoney,
  isOrderFulfilled,
  listAdminOrders,
  orderItemCount,
  orderStatusBadgeClass,
  orderStatusLabel,
  parseOrderFilter,
  parseOrderSearch,
  type OrderFilter,
} from '@/lib/admin-orders'
import {
  buildProductsByIdMap,
  collectOrderProductIds,
  getOrderRiskFlags,
  riskFlagChipClass,
} from '@/lib/admin-risk'

export const dynamic = 'force-dynamic'

const FILTER_TABS: { id: OrderFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'fulfilled', label: 'Fulfilled' },
  { id: 'closed', label: 'Refunded/Cancelled' },
]

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
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
  const filter = parseOrderFilter(params.filter)
  const q = parseOrderSearch(params.q)
  const [orders, products] = await Promise.all([listAdminOrders(filter, 100, q), listAdminProducts()])
  const productsById = buildProductsByIdMap(products, collectOrderProductIds(orders))
  const now = new Date()

  const bulkCount = Number(params.count)
  const bulkCountLabel = Number.isFinite(bulkCount) && bulkCount >= 0 ? bulkCount : null
  const skippedCount = Number(params.skippedCount)
  const skippedCountLabel = Number.isFinite(skippedCount) && skippedCount > 0 ? skippedCount : null

  const rows = orders.map((order) => {
    const flags = getOrderRiskFlags(order, productsById, now)
    return {
      orderId: order.orderId,
      email: String(order.email || ''),
      dateLabel: formatOrderDate(order.createdAt),
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

      <form action="/admin/orders" method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        {filter !== 'all' ? <input type="hidden" name="filter" value={filter} /> : null}
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
            href={adminOrdersHref(filter)}
            className="inline-flex items-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-100"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <nav aria-label="Filter orders" className="mb-8 flex flex-wrap gap-x-8 gap-y-3 border-b border-zinc-800 pb-4">
        {FILTER_TABS.map((tab) => {
          const active = tab.id === filter
          return (
            <Link
              key={tab.id}
              href={adminOrdersHref(tab.id, q)}
              className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                active ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          {q
            ? 'No orders match this search.'
            : filter === 'all'
              ? 'No orders yet. Paid checkouts are stored in MongoDB for review here.'
              : 'No orders match this filter.'}
        </p>
      ) : (
        <OrdersBulkTable orders={rows} filter={filter} q={q} />
      )}
    </section>
  )
}
