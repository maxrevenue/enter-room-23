import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  countLowStockProducts,
  getResolvedProductOfTheMonth,
  isArchived,
  isLowStock,
  listAdminProducts,
  quantityOf,
  type CatalogProduct,
} from '@/lib/admin-catalog'
import {
  countOpenOrders,
  formatOrderDate,
  formatOrderMoney,
  listRecentOpenOrders,
  orderItemCount,
  orderStatusBadgeClass,
  orderStatusLabel,
} from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

function lowStockPreview(products: CatalogProduct[], limit = 5) {
  return products
    .filter((product) => !isArchived(product) && (isLowStock(product) || quantityOf(product) === 0))
    .sort((a, b) => {
      const qtyDelta = (quantityOf(a) ?? 0) - (quantityOf(b) ?? 0)
      if (qtyDelta !== 0) return qtyDelta
      return String(a.name).localeCompare(String(b.name))
    })
    .slice(0, limit)
}

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const [products, productOfTheMonth, openOrders, lowStock, recentOpenOrders] = await Promise.all([
    listAdminProducts(),
    getResolvedProductOfTheMonth(),
    countOpenOrders(),
    countLowStockProducts(),
    listRecentOpenOrders(5),
  ])

  const activeCount = products.filter((product) => !isArchived(product)).length
  const lowStockProducts = lowStockPreview(products)

  const stats = [
    {
      label: 'Products',
      value: String(activeCount),
    },
    {
      label: 'Low stock',
      value: String(lowStock),
    },
    {
      label: 'Open orders',
      value: String(openOrders),
    },
    {
      label: 'Product of the Month',
      value: productOfTheMonth?.name || 'Not set',
    },
  ]

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Overview</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Dashboard</h1>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <li key={stat.label} className="border border-zinc-800 bg-zinc-900 px-6 py-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-4 font-serif text-2xl tracking-tight text-zinc-100">{stat.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="border border-zinc-800 bg-zinc-900">
          <header className="flex items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Queue</p>
              <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">Recent open orders</h2>
            </div>
            <Link
              href="/admin/orders?filter=open"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-100"
            >
              View all
            </Link>
          </header>
          {recentOpenOrders.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-500">No open orders.</p>
          ) : (
            <ul>
              {recentOpenOrders.map((order) => (
                <li key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                    className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-zinc-950"
                  >
                    <div>
                      <p className="text-sm text-zinc-100">{order.orderId}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {order.email || '—'} · {orderItemCount(order)} items · {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-300">{formatOrderMoney(order.totals?.total)}</p>
                      <p className="mt-2">
                        <span className={orderStatusBadgeClass(order.status)}>
                          {orderStatusLabel(order.status)}
                        </span>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-zinc-800 bg-zinc-900">
          <header className="flex items-end justify-between gap-4 border-b border-zinc-800 px-6 py-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">Inventory</p>
              <h2 className="mt-2 font-serif text-xl tracking-tight text-zinc-100">Low stock products</h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-100"
            >
              View all
            </Link>
          </header>
          {lowStockProducts.length === 0 ? (
            <p className="px-6 py-8 text-sm text-zinc-500">No low-stock products.</p>
          ) : (
            <ul>
              {lowStockProducts.map((product) => {
                const quantity = quantityOf(product)
                return (
                  <li key={product.id} className="border-b border-zinc-800 last:border-b-0">
                    <Link
                      href={`/admin/products/${encodeURIComponent(product.id)}`}
                      className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-zinc-950"
                    >
                      <div>
                        <p className="text-sm text-zinc-100">{product.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">{product.category}</p>
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                        {quantity === 0 ? 'Out of stock' : `${quantity} left`}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </section>
  )
}
