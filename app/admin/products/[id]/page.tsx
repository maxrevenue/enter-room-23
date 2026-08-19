import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import {
  archiveProduct,
  clearProductOfTheMonth,
  setProductOfTheMonth,
  unarchiveProduct,
  updateProduct,
} from '@/app/admin/actions'
import { ProductEditorFields } from '@/app/admin/products/product-fields'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  fulfillmentTypeOptions,
  getAdminProduct,
  isArchived,
  isHiddenByZeroStock,
  isLowStock,
  LOW_STOCK_THRESHOLD,
  productCategories,
  productImageUrl,
  quantityOf,
  vendorTypeOptions,
} from '@/lib/admin-catalog'
import { formatStockAlertSentAt } from '@/lib/admin-stock-alerts'

export const dynamic = 'force-dynamic'

const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'
const ghostButtonClass =
  'border border-zinc-700 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-200 hover:border-zinc-500'

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

  const archived = isArchived(product)
  const hiddenByZero = isHiddenByZeroStock(product)
  const isPotm = Boolean(product.isProductOfTheMonth || product.isFeatured)
  const quantity = quantityOf(product)
  const low = isLowStock(product)
  const out = quantity === 0
  const imageUrl = productImageUrl(product)
  const alertSentAt = formatStockAlertSentAt(product.lowStockAlertSentAt)

  return (
    <section>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
        <Link href="/admin/products" className="hover:text-zinc-300">
          Products
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">{product.name}</h1>
      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {archived ? 'Archived' : hiddenByZero ? 'Hidden (zero stock)' : 'Active'}
        {isPotm ? ' · Product of the Month' : ''}
      </p>

      <div className="mt-6 flex items-center gap-4">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} className="h-16 w-16 object-cover border border-zinc-800 bg-zinc-900" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center border border-zinc-800 bg-zinc-900 text-[9px] uppercase tracking-[0.16em] text-zinc-600">
            No image
          </div>
        )}
        {out ? (
          <p className="text-xs text-zinc-500">Quantity is 0{product.hideWhenZero ? ' · hide-when-zero is on' : ''}.</p>
        ) : low ? (
          <p className="text-xs text-zinc-500">Low stock — {LOW_STOCK_THRESHOLD} or fewer remaining.</p>
        ) : null}
        {alertSentAt ? (
          <p className="text-xs text-zinc-500">
            Alert sent {alertSentAt}
            {product.lowStockAlertLevel ? ` · ${product.lowStockAlertLevel}` : ''}
          </p>
        ) : null}
      </div>

      {query.error === 'invalid' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Check the fields and try again.
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
      {query.error === 'archived' ? (
        <p className="mt-6 text-sm text-zinc-400" role="alert">
          Restore the product before setting it as Product of the Month.
        </p>
      ) : null}
      {query.saved === '1' ? (
        <p className="mt-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <form action={updateProduct} className="mt-10 max-w-3xl space-y-10">
        <input type="hidden" name="id" value={product.id} />
        <ProductEditorFields
          product={product}
          categories={productCategories()}
          fulfillmentTypes={fulfillmentTypeOptions()}
          vendorTypes={vendorTypeOptions()}
        />
        <button
          type="submit"
          className="bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          Save product
        </button>
      </form>

      <div className="mt-14 border-t border-zinc-800 pt-10">
        <p className={labelClass}>Archive</p>
        <p className="mt-2 text-sm text-zinc-400">
          {archived
            ? 'This product is hidden from the storefront.'
            : 'Archive to hide this product from the storefront without deleting it.'}
        </p>
        <div className="mt-6">
          {archived ? (
            <form action={unarchiveProduct}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" className={ghostButtonClass}>
                Restore product
              </button>
            </form>
          ) : (
            <form action={archiveProduct}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" className={ghostButtonClass}>
                Archive product
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-14 border-t border-zinc-800 pt-10">
        <p className={labelClass}>Product of the Month</p>
        <p className="mt-2 text-sm text-zinc-400">
          {isPotm ? 'This is the current Product of the Month.' : 'Not featured.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {archived ? (
            <p className="text-sm text-zinc-500">Restore this product before featuring it.</p>
          ) : (
            <form action={setProductOfTheMonth}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" className={ghostButtonClass}>
                Set as Product of the Month
              </button>
            </form>
          )}
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
