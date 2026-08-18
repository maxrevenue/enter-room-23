import type { Metadata } from 'next'
import ProductCard from '@/components/product-card'
import ShopCategoryBar from '@/components/ShopCategoryBar'
import { listStorefrontProducts } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop Adult Wellness - Body-Safe Essentials',
  description:
    'Browse Room 23 adult wellness essentials: platinum silicone lubricants, delay spray, botanical mists, oils, and body-safe toys. 18+ only.',
  alternates: { canonical: '/shop' },
}

function formatCount(count: number) {
  const padded = String(count).padStart(2, '0')
  return `${padded} ${count === 1 ? 'piece' : 'pieces'}`
}

export default async function ShopPage() {
  const products = await listStorefrontProducts()
  const countLabel = formatCount(products.length)

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <header className="mb-10 sm:mb-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-theme-muted">
                The collection
              </p>
              <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
                Shop
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
                A tightly held edit of body-safe essentials — refined formulas, quiet packaging,
                nothing ornamental.
              </p>
            </div>
            <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted">
              {countLabel}
            </p>
          </div>
        </header>

        <ShopCategoryBar active="all" />

        {products.length === 0 ? (
          <p className="mt-16 text-center text-sm leading-relaxed text-theme-muted">
            The current edit is being revised. Please check back shortly.
          </p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
