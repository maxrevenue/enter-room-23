import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createProduct } from '@/app/admin/actions'
import { ProductEditorFields } from '@/app/admin/products/product-fields'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { fulfillmentTypeOptions, productCategories, vendorTypeOptions } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

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
          Name, price, and quantity are required. Check slug, category, and ops fields.
        </p>
      ) : null}
      {query.error === 'duplicate' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          That slug is already in use.
        </p>
      ) : null}
      {query.error === 'archived' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Restore the product before setting it as Product of the Month.
        </p>
      ) : null}
      {query.error === 'db' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          MongoDB is not available. Changes were not saved.
        </p>
      ) : null}

      <form action={createProduct} className="mt-10 max-w-3xl space-y-10">
        <ProductEditorFields
          categories={productCategories()}
          fulfillmentTypes={fulfillmentTypeOptions()}
          vendorTypes={vendorTypeOptions()}
        />
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
