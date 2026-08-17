import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product-card'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Room 23 — Premium Adult Wellness',
  description:
    'Considered pleasure. Curated adult wellness essentials with body-safe materials and secure checkout. 18+ only.',
}

const FEATURED_IDS = ['skins-delay', 'heli-lavender-mist', 'arlo-atlas-oil', 'pr-secret-garden-mist']

const JOURNAL_NOTES = [
  {
    href: '/journal/wellness-maintenance',
    tag: 'Wellness',
    title: 'The Art of Intimate Wellness Maintenance',
    excerpt:
      'pH-conscious care, barrier-friendly routines, and why the most sensitive skin deserves formulations as considered as the rest of your regimen.',
  },
  {
    href: '/journal/lubricant-formulations',
    tag: 'Materials',
    title: 'Understanding Lubricant Formulations',
    excerpt:
      'Water, silicone, hybrid — a clear reading of ingredient decks and material compatibility, so you choose with confidence.',
  },
  {
    href: '/journal/discreet-luxury',
    tag: 'Lifestyle',
    title: 'Why Discretion Is the Ultimate Luxury',
    excerpt:
      'Unbranded cartons, quiet packing slips, and the composure of keeping a private life private.',
  },
] as const

export default function HomePage() {
  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((product) => product.id === id)).filter(
    Boolean,
  )
  const featuredTiles = featured.length ? featured : PRODUCTS.slice(0, 4)

  return (
    <div className="bg-zinc-950 text-white">
      <section
        aria-labelledby="hero-title"
        className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[75vh] sm:px-6 sm:py-28"
      >
        <h1
          id="hero-title"
          className="font-serif text-5xl tracking-[0.28em] text-white sm:text-6xl md:text-7xl"
        >
          ROOM 23
        </h1>
        <p className="mt-6 max-w-md text-sm font-light tracking-wide text-zinc-400 sm:mt-8 sm:text-base">
          Considered pleasure.
        </p>
        <Link
          href="/shop"
          className="mt-10 inline-flex min-h-11 items-center justify-center bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-950 transition-colors hover:bg-zinc-200 sm:mt-12"
        >
          Shop the collection
        </Link>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="border-t border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <h2
                id="featured-heading"
                className="font-serif text-2xl tracking-tight text-white sm:text-3xl"
              >
                The Edit
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
                A tightly held collection. Nothing ornamental.
              </p>
            </div>
            <Link
              href="/shop"
              className="min-h-11 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
              View all
            </Link>
          </header>

          <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {featuredTiles.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="journal-heading"
        className="border-t border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-10 flex flex-col items-start justify-between gap-4 sm:mb-14 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Editorial
              </p>
              <h2
                id="journal-heading"
                className="mt-3 font-serif text-2xl tracking-tight text-white sm:text-3xl"
              >
                From the Journal
              </h2>
            </div>
            <Link
              href="/journal"
              className="min-h-11 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white"
            >
              Read the Journal
            </Link>
          </header>

          <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {JOURNAL_NOTES.map((note) => (
              <li key={note.href} className="border-t border-zinc-800 pt-6">
                <Link href={note.href} className="group block">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {note.tag}
                  </p>
                  <h3 className="mt-4 font-serif text-xl leading-snug tracking-wide text-white">
                    {note.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {note.excerpt}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-zinc-300">
                    Continue reading
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
