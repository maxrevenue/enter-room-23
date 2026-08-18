import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  adminCustomerHref,
  adminCustomersHref,
  formatCustomerDate,
  formatCustomerSpend,
  listAdminCustomers,
  parseCustomerSearch,
} from '@/lib/admin-customers'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const q = parseCustomerSearch(params.q)
  const customers = await listAdminCustomers(q)

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Support</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Customers</h1>
      </header>

      <form action="/admin/customers" method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        <label className="block flex-1">
          <span className="sr-only">Search customers</span>
          <input
            className={fieldClass}
            name="q"
            defaultValue={q}
            placeholder="Search email or name"
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
            href={adminCustomersHref()}
            className="inline-flex items-center px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-100"
          >
            Clear
          </Link>
        ) : null}
      </form>

      {customers.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400">
          {q
            ? 'No customers match this search.'
            : 'No customers yet. Paid checkouts are grouped here by email.'}
        </p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Total spent</th>
                <th className="px-4 py-3 font-medium">Last order</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4 font-medium text-zinc-100">{customer.email}</td>
                  <td className="px-4 py-4 text-zinc-400">{customer.name || '—'}</td>
                  <td className="px-4 py-4 text-zinc-300">{customer.orderCount}</td>
                  <td className="px-4 py-4 text-zinc-300">{formatCustomerSpend(customer.totalSpent)}</td>
                  <td className="px-4 py-4 text-zinc-500">{formatCustomerDate(customer.lastOrderAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={adminCustomerHref(customer.email)}
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
