import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ProductsBulkTable } from '@/components/admin/products-bulk-table'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  isArchived,
  isHiddenByZeroStock,
  isLowStock,
  listAdminProducts,
  LOW_STOCK_THRESHOLD,
  productCategories,
  productImageUrl,
  quantityOf,
} from '@/lib/admin-catalog'
import { formatMarginPct, productMarginPct } from '@/lib/admin-margin'

export const dynamic = 'force-dynamic'

function formatMoney(value: number) {
  return `$${Number(value || 0).toFixed(2)}`
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    saved?: string
    bulk?: string
    count?: string
    msg?: string
  }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const products = await listAdminProducts()
  const categories = productCategories()
  const bulkCount = Number(params.count)
  const bulkCountLabel = Number.isFinite(bulkCount) && bulkCount >= 0 ? bulkCount : null

  const rows = products.map((product) => {
    const archived = isArchived(product)
    const hiddenByZero = isHiddenByZeroStock(product)
    const quantity = quantityOf(product)
    const featured = Boolean(product.isProductOfTheMonth || product.isFeatured)
    const low = isLowStock(product)
    const out = quantity === 0

    return {
      id: product.id,
      name: product.name,
      priceLabel: formatMoney(product.price),
      marginLabel: formatMarginPct(productMarginPct(product)),
      quantity,
      category: product.category,
      statusLabel: archived ? 'Archived' : hiddenByZero ? 'Hidden (zero stock)' : 'Active',
      featured,
      archived,
      hiddenByZero,
      low,
      out,
      lowStockNote: `Low · ${LOW_STOCK_THRESHOLD} or fewer`,
      imageUrl: productImageUrl(product),
    }
  })

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

      {params.bulk === 'ok' && bulkCountLabel != null ? (
        <p className="mb-6 text-sm text-zinc-400" role="status">
          Bulk update applied to {bulkCountLabel} product{bulkCountLabel === 1 ? '' : 's'}.
        </p>
      ) : null}
      {params.bulk === 'error' && params.msg ? (
        <p className="mb-6 text-sm text-zinc-400" role="alert">
          {params.msg}
        </p>
      ) : null}
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

      <ProductsBulkTable products={rows} categories={categories} />
    </section>
  )
}
