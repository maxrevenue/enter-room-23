import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { listAdminProducts } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const products = await listAdminProducts()

  return (
    <section>
      <header className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Catalog</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Products</h1>
      </header>

      {params.error === 'db' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Product changes were not saved.
        </p>
      ) : null}
      {params.error === 'missing' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That product could not be found.
        </p>
      ) : null}
      {params.saved === '1' ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <div className="overflow-x-auto border border-zinc-800">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-zinc-800 last:border-b-0">
                <td className="px-4 py-4 text-zinc-100">
                  {product.name}
                  {product.isProductOfTheMonth || product.isFeatured ? (
                    <span className="ml-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Month
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-zinc-300">{formatMoney(product.price)}</td>
                <td className="px-4 py-4 text-zinc-400">{product.inventoryStatus}</td>
                <td className="px-4 py-4 text-zinc-400">{product.category}</td>
                <td className="px-4 py-4 text-zinc-400">{product.hidden ? 'Hidden' : 'Active'}</td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.id)}`}
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
