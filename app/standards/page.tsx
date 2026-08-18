import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: 'Materials & Standards - Body-Safe Formulas',
  description:
    'How Room 23 vets body-safe materials: platinum-cure silicone, botanical oils, and topical wellness formulas with clear compatibility notes. 18+.',
  alternates: { canonical: '/standards' },
}

export default function StandardsPage() {
  return (
    <main className="min-h-screen bg-theme-bg px-6 py-16 text-theme-text md:py-24">
      <article className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-theme-muted">Quality</p>
        <h1 className="mt-4 font-serif text-3xl md:text-4xl">Materials &amp; Standards</h1>
        <p className="mt-6 text-sm leading-relaxed text-theme-muted">
          Every piece in the Room 23 edit is selected for body-safe materials, clear care guidance,
          and accurate compatibility notes. We do not sell ingestible wellness claims or
          subscription hardware.
        </p>

        <section className="mt-12 space-y-8 border-t border-theme-border pt-10">
          <div>
            <h2 className="font-serif text-xl text-theme-text">Platinum-cure silicone lubricants</h2>
            <p className="mt-3 text-sm leading-relaxed text-theme-muted">
              Our house silicone formula uses medical-grade dimethicone. Fragrance-free, paraben-free,
              glycerin-free, and phthalate-free. Latex condom compatible. Not for use with silicone toys.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-theme-text">Botanical body oils</h2>
            <p className="mt-3 text-sm leading-relaxed text-theme-muted">
              Topical use only. Not ingestible. Oil-based products can degrade latex condoms — follow
              the compatibility notes on each product page.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-xl text-theme-text">Topical wellness formulas</h2>
            <p className="mt-3 text-sm leading-relaxed text-theme-muted">
              Delay sprays, warming serums, mists, and washes are for external use. Patch-test if you
              have sensitive skin. Avoid the eye area. These are not personal lubricants unless the
              product page says otherwise.
            </p>
          </div>
        </section>

        <p className="mt-12 text-sm text-theme-muted">
          Questions about ingredients or care? Email{' '}
          <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-theme-text/80 underline">
            {SITE_CONFIG.supportEmail}
          </a>{' '}
          or visit{' '}
          <Link href="/contact" className="text-theme-text/80 underline">
            Contact
          </Link>
          .
        </p>
      </article>
    </main>
  )
}
