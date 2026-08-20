import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About Room 23 - Considered Intimacy',
  description: 'Room 23 formulates body-safe wellness and intimate care pieces held to a quiet standard.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-20 md:py-24">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
          The House
        </p>
        <h1 className="mt-5 font-serif text-3xl tracking-tight text-theme-text sm:text-4xl md:text-[2.75rem]">
          About Room 23
        </h1>

        <div className="mt-12 space-y-8 border-t border-theme-border pt-12 text-sm leading-relaxed text-theme-muted sm:text-base">
          <p>
            Room 23 was founded on a simple principle: intimate wellness essentials should be formulated with uncompromising quality, presented with quiet restraint, and held to the highest body-safe standards.
          </p>
          <p>
            We eliminate loud marketing noise, artificial dyes, and unnecessary additives in favor of clean botanical extracts, medical-grade platinum silicone, and concentrated formulas designed for elevated daily rituals.
          </p>
          <p>
            Every order is dispatched in unbranded packaging, ensuring absolute discretion from our door to yours. Credit card statements discreetly list charges under <span className="font-semibold text-theme-text">{SITE_CONFIG.billingDescriptor}</span>.
          </p>
        </div>

        <div className="mt-16 border-t border-theme-border pt-12">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-theme-muted">
            Corporate & Client Enquiries
          </h2>
          <div className="mt-4 text-xs text-theme-muted space-y-1">
            <p className="font-semibold text-theme-text">{SITE_CONFIG.legalEntity}</p>
            <p>{SITE_CONFIG.address.full}</p>
            <p>Phone: {SITE_CONFIG.phone}</p>
            <p>Support Email: {SITE_CONFIG.email}</p>
          </div>

          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center border border-theme-border px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface"
            >
              Explore The Collection
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
