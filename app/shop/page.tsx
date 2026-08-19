import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product-card'
import ShopCategoryBar from '@/components/ShopCategoryBar'
import { groupProductsByCategory, STORE_CATEGORIES } from '@/lib/categories'
import { listStorefrontProducts } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Shop Adult Wellness - Body-Safe Essentials',
  description:
    'Browse Room 23 by category: house lubes, strokers, toys, and body-safe intimate pieces. 18+ only.',
  alternates: { canonical: '/shop' },
}

function formatCount(count: number) {
  const padded = String(count).padStart(2, '0')
  return `${padded} ${count === 1 ? 'piece' : 'pieces'}`
}

export default async function ShopPage() {
  const products = await listStorefrontProducts()
  const grouped = groupProductsByCategory(products)
  const sections = STORE_CATEGORIES.filter((category) => (grouped.get(category.id)?.length ?? 0) > 0)
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
                Browse by category — house lubes first, then toys, strokers, and the rest of
                the edit.
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
          <div className="mt-12 space-y-20 sm:mt-16 sm:space-y-24">
            {sections.map((category) => {
              const items = grouped.get(category.id) || []
              return (
                <section key={category.id} aria-labelledby={`shop-${category.id}-heading`}>
                  <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2
                        id={`shop-${category.id}-heading`}
                        className="font-serif text-2xl tracking-tight text-theme-text sm:text-3xl"
                      >
                        {category.label}
                      </h2>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-theme-muted">
                        {category.subtitle}
                      </p>
                    </div>
                    <Link
                      href={`/collections/${category.id}`}
                      className="inline-flex min-h-10 shrink-0 items-center text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted transition-colors duration-300 hover:text-theme-text"
                    >
                      View {category.label.toLowerCase()}
                    </Link>
                  </header>
                  <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
                    {items.map((product) => (
                      <li key={product.id}>
                        <ProductCard product={product} />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
