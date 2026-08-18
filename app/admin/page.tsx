import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  countLowStockProducts,
  getResolvedProductOfTheMonth,
  isArchived,
  listAdminProducts,
} from '@/lib/admin-catalog'
import { countOpenOrders } from '@/lib/admin-orders'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const [products, productOfTheMonth, openOrders, lowStock] = await Promise.all([
    listAdminProducts(),
    getResolvedProductOfTheMonth(),
    countOpenOrders(),
    countLowStockProducts(),
  ])

  const activeCount = products.filter((product) => !isArchived(product)).length

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
    </section>
  )
}
