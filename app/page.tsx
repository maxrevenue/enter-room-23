import type { Metadata } from 'next'
import Link from 'next/link'
import JournalSection from '@/components/JournalSection'
import ProductOfTheMonth from '@/components/ProductOfTheMonth'
import ProductCard from '@/components/product-card'
import { sortCuratedStorefrontProducts } from '@/lib/categories'
import { buildNewBadgeAllowlist } from '@/lib/product-badge'
import { getResolvedProductOfTheMonth, listStorefrontProducts } from '@/lib/admin-catalog'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Premium Adult Wellness - Body-Safe Essentials',
  description:
    'Shop body-safe adult wellness essentials from Room 23: refined lubricants, intimate care, and discreet checkout. Considered pleasure. 18+ only.',
  alternates: { canonical: '/' },
}

const storefrontCtaPrimary =
  'inline-flex min-h-12 w-full items-center justify-center rounded-none bg-primary px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border sm:w-auto sm:tracking-[0.24em]'

const storefrontCtaSecondary =
  'inline-flex min-h-12 w-full items-center justify-center rounded-none border border-theme-border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border sm:w-auto sm:tracking-[0.24em]'

export default async function HomePage() {
  const [productOfTheMonth, storefrontProducts] = await Promise.all([
    getResolvedProductOfTheMonth(),
    listStorefrontProducts(),
  ])
  const productOfTheMonthId = productOfTheMonth?.id
  const editTiles = sortCuratedStorefrontProducts(
    storefrontProducts,
    productOfTheMonthId ? [productOfTheMonthId] : [],
  ).slice(0, 4)
  const newBadgeAllowlist = buildNewBadgeAllowlist(storefrontProducts)

  return (
    <div className="bg-theme-bg text-theme-text">
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[58svh] flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:min-h-[75vh] sm:px-8 md:min-h-[85vh] md:py-28 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,hsl(var(--muted-foreground)/0.18)_0%,transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-theme-border/60 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-theme-bg via-theme-bg/80 to-transparent"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          <h1
            id="hero-title"
            className="font-serif text-[2.35rem] font-light leading-none tracking-[0.12em] text-theme-text sm:text-6xl sm:tracking-[0.24em] md:text-7xl md:tracking-[0.32em] lg:text-[5.25rem]"
          >
            ROOM 23
          </h1>
          <div
            aria-hidden="true"
            className="mt-8 h-px w-12 bg-theme-border sm:mt-10 sm:w-16"
          />
          <p className="mt-7 max-w-sm text-sm font-light leading-relaxed tracking-wide text-theme-muted sm:mt-8 sm:text-base">
            Considered pleasure.
          </p>
          <Link href="/shop" className={`mt-12 sm:mt-14 ${storefrontCtaPrimary}`}>
            Shop the collection
          </Link>
        </div>
      </section>

      {productOfTheMonth ? <ProductOfTheMonth product={productOfTheMonth} /> : null}

      <section
        aria-labelledby="featured-heading"
        className="border-t border-theme-border px-4 py-20 sm:px-8 md:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 sm:mb-16 md:mb-20">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
              <div className="max-w-xl">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
                  The collection
                </p>
                <h2
                  id="featured-heading"
                  className="mt-5 font-serif text-3xl font-light tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]"
                >
                  The Edit
                </h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
                  A curated scroll by category — house lubes, strokers, and body-safe
                  pieces held to a quiet standard.
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex min-h-12 shrink-0 items-center rounded-none text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted transition-colors duration-300 hover:text-theme-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
              >
                View all products
              </Link>
            </div>
            <div
              aria-hidden="true"
              className="mt-10 h-px w-full bg-theme-border sm:mt-12"
            />
          </header>

          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {editTiles.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} newBadgeAllowlist={newBadgeAllowlist} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JournalSection />

      <section
        aria-labelledby="close-heading"
        className="border-t border-theme-border px-4 py-20 text-center sm:px-8 md:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-lg">
          <h2
            id="close-heading"
            className="font-serif text-2xl font-light tracking-tight text-theme-text sm:text-3xl"
          >
            Shop the collection.
          </h2>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-theme-muted">
            Body-safe formulations, considered packaging, and categories held to a quiet
            standard.
          </p>
          <Link href="/shop" className={`mt-10 ${storefrontCtaSecondary}`}>
            Shop the collection
          </Link>
        </div>
      </section>
    </div>
  )
}
