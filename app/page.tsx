import type { Metadata } from 'next'
import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { PRODUCTS, productHref } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Room 23 — Premium Adult Wellness',
  description:
    'Considered pleasure. Curated essentials. Body-safe adult wellness products with private delivery. 18+ only.',
}

const JOURNAL_NOTES = [
  {
    href: '/journal/wellness-maintenance',
    tag: 'Wellness',
    title: 'Building a Considered Collection',
    excerpt: 'Where to begin — and why fewer, better pieces make a more meaningful private ritual.',
  },
  {
    href: '/journal/lubricant-formulations',
    tag: 'Education',
    title: 'Understanding Lubricant Formulations',
    excerpt: 'Water, silicone, hybrid — choose with clear material compatibility.',
  },
  {
    href: '/journal/discreet-luxury',
    tag: 'Lifestyle',
    title: 'Why Privacy Matters',
    excerpt: 'Unbranded cartons, quiet billing, and packing slips that stay unremarkable.',
  },
] as const

const FEATURED_IDS = ['skins-delay', 'heli-lavender-mist', 'arlo-atlas-oil', 'pr-secret-garden-mist']

export default function HomePage() {
  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
  const featuredTiles = featured.length ? featured : PRODUCTS.slice(0, 4)

  return (
    <main className="bg-zinc-950 text-white">
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
        <p className="mt-8 text-sm font-light tracking-wide text-zinc-400">
          Considered pleasure. Private delivery.
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <li>Private delivery</li>
          <li>Body-safe materials</li>
          <li>Secure checkout</li>
        </ul>
        <Link
          href="/shop"
          className="mt-12 inline-flex items-center justify-center bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-black hover:bg-zinc-200"
        >
          Explore the Collection
        </Link>
      </section>

      <section
        aria-labelledby="featured-rituals-heading"
        className="border-t border-zinc-800 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center md:mb-16">
            <h2
              id="featured-rituals-heading"
              className="font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              Featured Rituals
            </h2>
            <p className="mt-4 text-sm font-light tracking-wide text-zinc-500">
              A tightly held edit. Nothing ornamental.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTiles.map((product) => (
              <li key={product.id}>
                <Link href={productHref(product)} className="group block">
                  <div className="overflow-hidden border border-zinc-800 bg-zinc-900">
                    <AspectRatio ratio={4 / 5}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <h3 className="mt-4 font-serif text-sm tracking-[0.08em] text-white">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="journal-heading"
        className="border-t border-zinc-800 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <header className="mb-12 text-center md:mb-16">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Editorial
            </p>
            <h2
              id="journal-heading"
              className="mt-4 font-serif text-xl uppercase tracking-[0.28em] text-white md:text-2xl"
            >
              From the Journal
            </h2>
          </header>

          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {JOURNAL_NOTES.map((note) => (
              <li key={note.href}>
                <Link
                  href={note.href}
                  className="group block border border-zinc-800 bg-zinc-900 p-6"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">{note.tag}</p>
                  <h3 className="mt-4 font-serif text-lg tracking-wide text-white">{note.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{note.excerpt}</p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-400">
                    Read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
