import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createProduct } from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { productCategories } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

export default async function AdminNewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const query = await searchParams

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-300">
          Products
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">New product</h1>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Name, slug, price, quantity, and category are required.
        </p>
      ) : null}
      {query.error === 'duplicate' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          That slug is already in use.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}

      <form action={createProduct} className="mt-10 max-w-xl space-y-6">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input className={fieldClass} name="name" required />
        </label>

        <label className="block">
          <span className={labelClass}>Slug</span>
          <input className={fieldClass} name="slug" placeholder="auto-from-name" />
          <span className="mt-2 block text-xs text-zinc-500">Leave blank to generate from the name.</span>
        </label>

        <label className="block">
          <span className={labelClass}>Price</span>
          <input className={fieldClass} name="price" type="number" min="0" step="0.01" required />
        </label>

        <label className="block">
          <span className={labelClass}>Quantity</span>
          <input className={fieldClass} name="quantity" type="number" min="0" step="1" required />
        </label>

        <label className="block">
          <span className={labelClass}>Category</span>
          <select className={fieldClass} name="category" defaultValue={productCategories()[0] || 'essentials'} required>
            {productCategories().map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input type="checkbox" name="hidden" className="h-4 w-4 border-zinc-700 bg-zinc-950" />
          Hidden from storefront
        </label>

        <label className="block">
          <span className={labelClass}>Short description</span>
          <textarea className={`${fieldClass} min-h-28`} name="shortEditorial" rows={4} />
        </label>

        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Create product
        </button>
      </form>
    </section>
  )
}
