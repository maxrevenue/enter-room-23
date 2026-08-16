import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'Materials & Standards',
  description:
    'Body-safe materials standards for Room 23 products — platinum-cure silicone, borosilicate glass, botanical oils, and mulberry silk.',
}

export default function StandardsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">Quality</p>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl">Materials &amp; Standards</h1>
        <p className="mt-6 text-sm leading-relaxed text-zinc-400">
          Every piece in the Room 23 edit is selected for body-safe materials, clear care guidance,
          and accurate compatibility notes. We do not sell ingestible wellness claims or
          subscription hardware.
        </p>

        <section className="mt-12 space-y-8 border-t border-zinc-800 pt-10">
          <div>
            <h2 className="font-serif text-xl text-white">Platinum-cure silicone lubricants</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Our house silicone formula uses medical-grade dimethicone. Fragrance-free, paraben-free,
              glycerin-free, and phthalate-free. Latex condom compatible. Not for use with silicone toys.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-white">Borosilicate glass</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Non-porous, seamless, and compatible with all lubricant types. Suitable for gentle
              temperature play with warm water or brief refrigeration — never boiling water or a freezer.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-white">Botanical massage oils</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Topical use only. Not ingestible. Oil-based products can degrade latex condoms — follow
              the compatibility notes on each product page.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-white">Mulberry silk</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              22-momme mulberry silk with adjustable fit. Hand wash cold; lay flat to dry.
            </p>
          </div>
        </section>

        <p className="mt-12 text-sm text-zinc-500">
          Questions about ingredients or care? Email{' '}
          <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-zinc-300 underline">
            {SITE_CONFIG.supportEmail}
          </a>{' '}
          or visit{' '}
          <Link href="/contact" className="text-zinc-300 underline">
            Contact
          </Link>
          .
        </p>
      </article>
    </main>
  )
}
