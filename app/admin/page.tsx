import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { PRODUCTS, getProductOfTheMonth } from '@/lib/products'

export const dynamic = 'force-dynamic'

const CLOSED_ORDER_STATUSES = [
  'fulfilled',
  'shipped',
  'delivered',
  'cancelled',
  'complete',
  'completed',
]

async function countOpenOrders(): Promise<number> {
  if (!process.env.MONGODB_URI) return 0

  try {
    const { connectToDatabase } = await import('@/lib/mongodb')
    const client = await connectToDatabase()
    const db = client.db('room23')
    return db.collection('orders').countDocuments({
      $nor: [{ status: { $in: CLOSED_ORDER_STATUSES } }, { fulfilled: true }],
    })
  } catch {
    return 0
  }
}

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated(await cookies()))) {
    redirect('/admin/login')
  }

  const productOfTheMonth = getProductOfTheMonth()
  const openOrders = await countOpenOrders()

  const stats = [
    {
      label: 'Products',
      value: String(PRODUCTS.length),
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

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
