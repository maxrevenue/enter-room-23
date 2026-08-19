import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  archiveProduct,
  clearProductOfTheMonth,
  setProductOfTheMonth,
  unarchiveProduct,
  updateQuantity,
} from '@/app/admin/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  isArchived,
  isHiddenByZeroStock,
  isLowStock,
  listAdminProducts,
  LOW_STOCK_THRESHOLD,
  productImageUrl,
  quantityOf,
} from '@/lib/admin-catalog'
import { formatMarginPct, productMarginPct } from '@/lib/admin-margin'

export const dynamic = 'force-dynamic'

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)}`
}

const actionClass =
  'text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-100'
const qtyInputClass =
  'w-16 border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500'

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
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Catalog</p>
          <h1 className="mt-3 font-serif text-3xl tracking-tight text-zinc-100">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex bg-zinc-100 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 hover:bg-zinc-200"
        >
          New product
        </Link>
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
      {params.error === 'invalid' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          Check the fields and try again.
        </p>
      ) : null}
      {params.error === 'duplicate' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          That slug is already in use.
        </p>
      ) : null}
      {params.error === 'archived' ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          Restore the product before setting it as Product of the Month.
        </p>
      ) : null}
      {params.saved === '1' ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Saved.
        </p>
      ) : null}

      <div className="overflow-x-auto border border-zinc-800">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Margin</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">POTM</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const archived = isArchived(product)
              const hiddenByZero = isHiddenByZeroStock(product)
              const quantity = quantityOf(product)
              const featured = Boolean(product.isProductOfTheMonth || product.isFeatured)
              const low = isLowStock(product)
              const out = quantity === 0
              const imageUrl = productImageUrl(product)
              const marginPct = productMarginPct(product)

              return (
                <tr key={product.id} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-10 w-10 object-cover border border-zinc-800 bg-zinc-900"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-900 text-[8px] uppercase tracking-[0.12em] text-zinc-600">
                        None
                      </div>
                    )}
                  </td>
                  <td className={`px-4 py-4 ${archived || hiddenByZero ? 'text-zinc-500' : 'text-zinc-100'}`}>
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{formatMoney(product.price)}</td>
                  <td className="px-4 py-4 text-zinc-400">{formatMarginPct(marginPct)}</td>
                  <td className="px-4 py-4">
                    <form action={updateQuantity} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="from" value="list" />
                      <input
                        className={qtyInputClass}
                        name="quantity"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={quantity ?? ''}
                        aria-label={`Quantity for ${product.name}`}
                      />
                      <button type="submit" className={actionClass}>
                        Save
                      </button>
                    </form>
                    {out ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Out of stock</p>
                    ) : low ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        Low · {LOW_STOCK_THRESHOLD} or fewer
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{product.category}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {archived ? 'Archived' : hiddenByZero ? 'Hidden (zero stock)' : 'Active'}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link href={`/admin/products/${encodeURIComponent(product.id)}`} className={actionClass}>
                        Edit
                      </Link>
                      {featured ? (
                        <form action={clearProductOfTheMonth}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Clear month
                          </button>
                        </form>
                      ) : archived ? null : (
                        <form action={setProductOfTheMonth}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Set month
                          </button>
                        </form>
                      )}
                      {archived ? (
                        <form action={unarchiveProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Restore
                          </button>
                        </form>
                      ) : (
                        <form action={archiveProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Archive
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
