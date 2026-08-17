import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryNav from '@/components/CategoryNav'
import HomeJournal from '@/components/HomeJournal'
import ProductCard from '@/components/ProductCard'
import ProductOfTheMonth from '@/components/ProductOfTheMonth'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Room 23 — Premium Adult Wellness',
  description:
    'Considered pleasure. Curated essentials. Body-safe adult wellness products with private delivery. 18+ only.',
}

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => p.slug !== 'platinum-silicone-lubricant-4oz').slice(0, 4)

  return (
    <div className="bg-zinc-950 text-white">
      <section
        aria-labelledby="hero-title"
        className="flex min-h-[85vh] flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-500">
          Curated essentials
        </p>
        <h1
          id="hero-title"
          className="font-serif text-4xl tracking-[0.3em] text-white md:text-5xl"
        >
          ROOM 23
        </h1>
        <p className="mt-8 max-w-sm text-sm font-light tracking-wide text-zinc-400 md:max-w-md">
          Considered pleasure. Private delivery.
        </p>
        <Link
          href="/shop"
          className="mt-12 inline-flex items-center justify-center bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-black hover:bg-zinc-200"
        >
          Explore the Collection
        </Link>
      </section>

      <ProductOfTheMonth />

      <CategoryNav />

      <section aria-labelledby="the-edit-heading" className="border-t border-zinc-800 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center md:mb-16">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">Curated</p>
            <h2
              id="the-edit-heading"
              className="mt-4 font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              The Edit
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light tracking-wide text-zinc-500">
              A tightly held selection. Nothing ornamental.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-zinc-800 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-300"
            >
              Shop All
            </Link>
          </div>
        </div>
      </section>

      <HomeJournal />
    </div>
  )
}
