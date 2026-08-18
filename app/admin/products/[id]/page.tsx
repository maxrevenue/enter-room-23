import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import {
  clearProductOfTheMonth,
  setProductOfTheMonth,
  updateProduct,
} from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getAdminProduct, productCategories } from '@/lib/admin-catalog'
import { INVENTORY_STATUS } from '@/lib/inventory'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

export default async function AdminProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { id } = await params
  const query = await searchParams
  const product = await getAdminProduct(decodeURIComponent(id))
  if (!product) notFound()

  const isPotm = Boolean(product.isProductOfTheMonth || product.isFeatured)

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-300">
          Products
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">{product.name}</h1>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Check the fields and try again.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}
      {query.saved === '1' ? (
        <p className="mt-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <form action={updateProduct} className="mt-10 max-w-xl space-y-6">
        <input type="hidden" name="id" value={product.id} />

        <label className="block">
          <span className={labelClass}>Name</span>
          <input className={fieldClass} name="name" defaultValue={product.name} required />
        </label>

        <label className="block">
          <span className={labelClass}>Price</span>
          <input
            className={fieldClass}
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
          />
        </label>

        <label className="block">
          <span className={labelClass}>Stock</span>
          <select className={fieldClass} name="inventoryStatus" defaultValue={product.inventoryStatus}>
            {Object.values(INVENTORY_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Category</span>
          <select className={fieldClass} name="category" defaultValue={product.category}>
            {productCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="hidden"
            defaultChecked={Boolean(product.hidden)}
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
          />
          Hidden from storefront
        </label>

        <label className="block">
          <span className={labelClass}>Short description</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            name="shortEditorial"
            defaultValue={product.shortEditorial || ''}
            rows={4}
          />
        </label>

        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Save product
        </button>
      </form>

      <div className="mt-14 border-t border-zinc-800 pt-10">
        <p className={labelClass}>Product of the Month</p>
        <p className="mt-2 text-sm text-zinc-400">
          {isPotm ? 'This is the current Product of the Month.' : 'Not featured.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <form action={setProductOfTheMonth}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500"
            >
              Set as Product of the Month
            </button>
          </form>
          {isPotm ? (
            <form action={clearProductOfTheMonth}>
              <input type="hidden" name="id" value={product.id} />
              <button
                type="submit"
                className="border border-zinc-800 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-200"
              >
                Clear
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </section>
  )
}
