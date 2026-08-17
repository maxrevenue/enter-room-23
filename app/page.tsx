import type { Metadata } from 'next'
import Link from 'next/link'
import CategoryNav from '@/components/CategoryNav'
import HomeJournal from '@/components/HomeJournal'
import ProductOfTheMonth from '@/components/ProductOfTheMonth'
import ProductCard from '@/components/product-card'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Room 23 — Premium Adult Wellness',
  description:
    'Considered pleasure. Body-safe adult wellness essentials with refined formulations and secure checkout. 18+ only.',
}

const PRODUCT_OF_MONTH_ID = 'lube-silicone-4oz'

const FEATURED_IDS = [
  'skins-delay',
  'cake-stroker',
  'heli-lavender-mist',
  'lube-silicone-2oz',
] as const

export default function HomePage() {
  const featuredTiles = FEATURED_IDS.map((id) => PRODUCTS.find((product) => product.id === id)).filter(
    Boolean,
  )
  const editTiles =
    featuredTiles.length > 0
      ? featuredTiles
      : PRODUCTS.filter((product) => product.id !== PRODUCT_OF_MONTH_ID).slice(0, 4)

  return (
    <div className="bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-5 py-28 text-center sm:min-h-[88vh] sm:px-8 sm:py-36"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(82,82,91,0.28)_0%,transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          <h1
            id="hero-title"
            className="font-serif text-[2.85rem] leading-none tracking-[0.32em] text-zinc-50 sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          >
            ROOM 23
          </h1>
          <div
            aria-hidden="true"
            className="mt-8 h-px w-12 bg-zinc-700 sm:mt-10 sm:w-16"
          />
          <p className="mt-7 max-w-sm text-sm font-light leading-relaxed tracking-wide text-zinc-400 sm:mt-8 sm:text-base">
            Considered pleasure.
          </p>
          <Link
            href="/shop"
            className="mt-12 inline-flex min-h-12 items-center justify-center bg-zinc-50 px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-950 transition-colors duration-300 hover:bg-zinc-200 sm:mt-14"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      <ProductOfTheMonth />

      <CategoryNav />

      {/* The Edit */}
      <section
        aria-labelledby="featured-heading"
        className="border-t border-zinc-800 px-5 py-24 sm:px-8 sm:py-32 md:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-16 sm:mb-20 md:mb-24">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              <div className="max-w-xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
                  The collection
                </p>
                <h2
                  id="featured-heading"
                  className="mt-5 font-serif text-3xl tracking-tight text-zinc-50 sm:text-4xl md:text-[2.75rem]"
                >
                  The Edit
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-500 sm:text-[0.9375rem]">
                  A tightly held selection of body-safe essentials — refined formulas, quiet
                  packaging, nothing ornamental.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex min-h-12 shrink-0 items-center text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors duration-300 hover:text-zinc-50"
              >
                View all products
              </Link>
            </div>
            <div
              aria-hidden="true"
              className="mt-12 h-px w-full bg-zinc-800 sm:mt-14"
            />
          </header>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-y-20 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-16">
            {editTiles.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeJournal />

      {/* Closing invitation */}
      <section
        aria-labelledby="close-heading"
        className="border-t border-zinc-800 px-5 py-24 text-center sm:px-8 sm:py-32 md:py-36"
      >
        <div className="mx-auto max-w-lg">
          <h2
            id="close-heading"
            className="font-serif text-2xl tracking-tight text-zinc-50 sm:text-3xl"
          >
            Begin with the essentials.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
            Body-safe formulations, considered packaging, and a collection held to a quiet
            standard.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex min-h-12 items-center justify-center border border-zinc-700 px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-50 transition-colors duration-300 hover:border-zinc-500 hover:bg-zinc-900"
          >
            Explore the shop
          </Link>
        </div>
      </section>
    </div>
  )
}
