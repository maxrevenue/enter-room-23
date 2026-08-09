'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function EditorChoice() {
  return (
    <section
      className="relative px-4 py-12 sm:py-16"
      style={{ backgroundColor: 'var(--bne-espresso-surface, var(--bg-surface))' }}
      aria-labelledby="editor-choice-heading"
    >
      <div className="mx-auto max-w-4xl">
        {/* ── Section Header ── */}
        <div className="text-center mb-8 sm:mb-10">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--bne-brass, var(--accent))' }}
            aria-hidden="true"
          >
            Featured
          </p>
          <h2
            id="editor-choice-heading"
            className="font-syne text-2xl sm:text-3xl font-bold tracking-[0.08em] uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            Editor&rsquo;s Choice
          </h2>
          <div
            className="mx-auto mt-4 h-[1px] w-16"
            style={{ backgroundColor: 'var(--bne-brass, var(--accent))', opacity: 0.5 }}
          />
        </div>

        {/* ── Featured Product Card ── */}
        <article
          className="relative overflow-hidden group"
          style={{
            backgroundColor: 'var(--bg-elevated, var(--bg-surface))',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}
          aria-label="Product of the Month"
        >
          {/* Brass top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ backgroundColor: 'var(--bne-brass, var(--accent))', opacity: 0.6 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* ── Image Area ── */}
            <div
              className="md:col-span-2 relative aspect-square md:aspect-auto min-h-[240px]"
              style={{ backgroundColor: 'var(--bne-espresso, var(--bg-base))' }}
            >
              {/* Placeholder visual */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                aria-hidden="true"
              >
                <Star
                  className="w-10 h-10 mb-2 opacity-20"
                  style={{ color: 'var(--bne-brass, var(--accent))' }}
                />
                <span
                  className="text-xs tracking-[0.15em] uppercase opacity-30"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Product Image
                </span>
              </div>

              {/* Badge */}
              <span
                className="absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full"
                style={{
                  backgroundColor: 'var(--bne-brass, var(--accent))',
                  color: 'var(--bne-espresso, #14100d)',
                }}
                role="status"
              >
                Product of the Month
              </span>
            </div>

            {/* ── Content ── */}
            <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
              <p
                className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
                style={{ color: 'var(--bne-brass-dim, var(--text-muted))' }}
              >
                Curated Wellness
              </p>

              <h3
                className="font-syne text-xl sm:text-2xl font-bold tracking-[0.06em] uppercase mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                The Signature Collection
              </h3>

              <p
                className="text-sm leading-relaxed mb-5 max-w-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                Hand-selected each month by our curators. A revolving spotlight on
                exceptional craftsmanship, intimate design, and the finest materials.
              </p>

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <span
                  className="font-syne text-2xl font-bold tracking-[0.04em]"
                  style={{ color: 'var(--bne-brass, var(--accent))' }}
                >
                  $89.00<span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}> USD</span>
                </span>

                <Link
                  href="/shop"
                  className="btn-brass inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-300 hover:gap-3"
                  style={{
                    backgroundColor: 'var(--bne-brass, var(--accent))',
                    color: 'var(--bne-espresso, #14100d)',
                  }}
                  aria-label="View Product of the Month details in Shop"
                >
                  View Details <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
