'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Shield, Droplets } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import ProductArtwork from '@/components/product-artwork'

// Wire to the Premium Silicone Wand — our best featured product
const FEATURED = PRODUCTS.find((p) => p.id === 'lube-silicone-4oz') || PRODUCTS[0]

const FEATURE_ICONS = { Waves: Zap, Droplets, ShieldCheck: Shield, Shield }

export default function EditorChoice() {
  return (
    <section
      className="relative px-4 py-14 sm:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      aria-labelledby="editor-choice-heading"
    >
      {/* Background depth */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[50%] h-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse at 100% 50%, #d4a853 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-12 animate-fade-in-up">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
            style={{ color: 'var(--color-brass)' }}
            aria-hidden="true"
          >
            Featured This Month
          </p>
          <h2
            id="editor-choice-heading"
            className="font-syne text-2xl sm:text-3xl font-bold tracking-[0.06em] uppercase"
            style={{ color: 'var(--text-primary)' }}
          >
            Editor&rsquo;s Choice
          </h2>
          <div
            className="mx-auto mt-4 h-[1px] w-16"
            style={{ backgroundColor: 'var(--color-brass)', opacity: 0.5 }}
          />
        </div>

        {/* ── Featured Product Card ── */}
        <article
          className="relative overflow-hidden group animate-fade-in-up"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}
          aria-label={`Featured: ${FEATURED.name}`}
        >
          {/* Brass top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-brass), transparent)',
              opacity: 0.7,
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* ── Image Area ── */}
            <div
              className="md:col-span-2 relative aspect-square md:aspect-auto min-h-[260px] overflow-hidden"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <div className="absolute inset-0">
                <ProductArtwork productId={FEATURED.id} category={FEATURED.category} />
              </div>

              {/* Badge */}
              <span
                className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full"
                style={{
                  backgroundColor: 'var(--color-brass)',
                  color: '#14100d',
                }}
                role="status"
              >
                Editor&rsquo;s Choice
              </span>

              {FEATURED.badge && (
                <span
                  className="absolute top-3 right-3 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] uppercase rounded-sm"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#fff',
                  }}
                >
                  {FEATURED.badge}
                </span>
              )}
            </div>

            {/* ── Content ── */}
            <div className="md:col-span-3 p-7 sm:p-10 flex flex-col justify-center">
              <p
                className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                {FEATURED.category}
              </p>

              <h3
                className="font-syne text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight uppercase mb-3"
                style={{ color: 'var(--text-primary)', lineHeight: 1.1 }}
              >
                {FEATURED.name}
              </h3>

              <p
                className="text-xs font-semibold tracking-[0.08em] uppercase mb-4"
                style={{ color: 'var(--color-brass)' }}
              >
                {FEATURED.tagline}
              </p>

              <p
                className="text-sm leading-relaxed mb-6 max-w-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                {FEATURED.description}
              </p>

              {/* Feature pills */}
              {FEATURED.features && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {FEATURED.features.map((feat) => (
                    <span
                      key={feat.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: 'var(--color-brass-glow)',
                        color: 'var(--color-brass)',
                        border: '1px solid var(--color-border-brass)',
                      }}
                    >
                      {feat.label}
                    </span>
                  ))}
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span
                    className="font-syne text-2xl sm:text-3xl font-bold"
                    style={{ color: 'var(--color-brass)' }}
                  >
                    ${FEATURED.price.toFixed(2)}
                  </span>
                  <span
                    className="ml-1"
                    style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
                  >
                    USD
                  </span>
                </div>

                <Link
                  href={`/products/${FEATURED.id}`}
                  className="btn-brass inline-flex items-center gap-2 group/cta"
                  style={{ padding: '0.75rem 1.75rem', fontSize: 'var(--text-sm)' }}
                  aria-label={`View details for ${FEATURED.name}`}
                >
                  View Details{' '}
                  <ArrowRight
                    className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform duration-200"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
