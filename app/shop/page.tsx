import type { Metadata } from 'next'
import ProductCard from '@/components/product-card'
import ShopCategoryBar from '@/components/ShopCategoryBar'
import { PRODUCTS } from '@/lib/products'

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

export default function ShopPage() {
  const products = PRODUCTS
  const countLabel = formatCount(products.length)

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 md:py-24">
        <header className="mb-8 sm:mb-10">
          <div className="flex flex-col gap-6 sm:gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="max-w-lg">
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-theme-muted">
                The collection
              </p>
              <h1 className="mt-4 font-serif text-[2rem] leading-[1.1] tracking-tight text-theme-text sm:mt-5 sm:text-4xl md:text-[2.75rem]">
                Shop
              </h1>
              <p className="mt-5 max-w-md text-sm leading-[1.7] text-theme-muted sm:mt-6 sm:text-[0.9375rem]">
                A tightly held edit of body-safe essentials — refined formulas, quiet
                packaging, nothing ornamental.
              </p>
            </div>
            <p
              className="shrink-0 text-[10px] font-medium uppercase tracking-[0.24em] text-theme-muted md:pb-1"
              aria-label={`${products.length} products`}
            >
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
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:mt-14 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-3">
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
