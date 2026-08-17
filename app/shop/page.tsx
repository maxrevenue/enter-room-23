import type { Metadata } from 'next'
import ProductCard from '@/components/product-card'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Curated adult wellness essentials from Room 23 — body-safe lubricants, delay spray, mists, oils, and in-stock house pieces. 18+ only.',
}

export default function ShopPage() {
  return (
    <div className="bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-24">
        <header className="mb-12 max-w-xl sm:mb-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
            The collection
          </p>
          <h1 className="mt-4 font-serif text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Shop
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
            A tightly held edit of body-safe essentials. Nothing ornamental.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {PRODUCTS.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
