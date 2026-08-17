import type { Metadata } from 'next'
import Link from 'next/link'
import ProductCard from '@/components/product-card'
import { PRODUCTS } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Room 23 — Premium Adult Wellness',
  description:
    'Considered pleasure. Body-safe adult wellness essentials with refined formulations and secure checkout. 18+ only.',
}

const FEATURED_IDS = [
  'cake-stroker',
  'skins-delay',
  'lube-silicone-4oz',
  'heli-lavender-mist',
] as const

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
    <div className="bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center sm:min-h-[82vh] sm:px-8 sm:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(63,63,70,0.35)_0%,transparent_58%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent"
        />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center">
          <h1
            id="hero-title"
            className="font-serif text-[2.75rem] leading-none tracking-[0.3em] text-zinc-50 sm:text-6xl md:text-7xl"
          >
            ROOM 23
          </h1>
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

      {/* Featured products */}
      <section
        aria-labelledby="featured-heading"
        className="border-t border-zinc-800 px-5 py-20 sm:px-8 sm:py-28 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-14 max-w-xl sm:mb-16 md:mb-20">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Featured
            </p>
            <h2
              id="featured-heading"
              className="mt-4 font-serif text-3xl tracking-tight text-zinc-50 sm:text-4xl"
            >
              The Edit
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
              A tightly held selection of body-safe essentials — refined formulas, quiet packaging,
              nothing ornamental.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex min-h-11 items-center text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors duration-300 hover:text-zinc-50"
            >
              View all products
            </Link>
          </header>

          <ul className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-16">
            {featuredTiles.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journal / Editorial */}
      <section
        aria-labelledby="journal-heading"
        className="border-t border-zinc-800 px-5 py-20 sm:px-8 sm:py-28 md:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-14 flex flex-col gap-6 sm:mb-16 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Editorial
              </p>
              <h2
                id="journal-heading"
                className="mt-4 font-serif text-3xl tracking-tight text-zinc-50 sm:text-4xl"
              >
                From the Journal
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-500">
                Notes on materials, maintenance, and the quieter side of adult wellness.
              </p>
            </div>
            <Link
              href="/journal"
              className="inline-flex min-h-11 items-center text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors duration-300 hover:text-zinc-50"
            >
              Read the Journal
            </Link>
          </header>

          <ul className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10 lg:gap-14">
            {JOURNAL_NOTES.map((note) => (
              <li key={note.href} className="border-t border-zinc-800 pt-8">
                <Link href={note.href} className="group block">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    {note.tag}
                  </p>
                  <h3 className="mt-5 font-serif text-xl leading-snug tracking-wide text-zinc-50 transition-colors duration-300 group-hover:text-white sm:text-[1.35rem]">
                    {note.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">{note.excerpt}</p>
                  <p className="mt-8 inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-300">
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
