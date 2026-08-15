'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { PRODUCTS, COLLECTIONS, getProductsByCollection } from '@/lib/products'
import ProductCard from '@/components/product-card'

const CATEGORY_FILTERS = [
  { label: 'ALL ITEMS', value: 'all' },
  { label: 'LUBRICANTS', value: 'essentials' },
  { label: 'TOYS', value: 'toys' },
  { label: 'WELLNESS', value: 'wellness' },
  { label: 'ACCESSORIES', value: 'accessories' },
]

export const dynamicParams = true

export default function CollectionPage({ params }) {
  const resolved = typeof params?.then === 'function' ? use(params) : params
  const slug = resolved?.slug
  const [activeCategory, setActiveCategory] = useState('all')

  const collectionMeta = COLLECTIONS[slug]
  const isVault = slug === 'vault'

  const collectionProducts = useMemo(() => {
    const direct = getProductsByCollection(slug)
    return direct
  }, [slug])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return collectionProducts
    return collectionProducts.filter((p) => p.category === activeCategory)
  }, [collectionProducts, activeCategory])

  const showFallback = collectionProducts.length === 0
  const fallbackProducts = useMemo(() => {
    if (!showFallback) return []
    return PRODUCTS.slice(0, 6)
  }, [showFallback])

  if (!collectionMeta) notFound()

  return (
    <main style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section
        className="relative py-20 sm:py-28 px-4 sm:px-6 text-center overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[60%] h-full"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.3), transparent)' }} />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {isVault && (
            <div className="flex justify-center mb-6">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-[0.2em] uppercase font-semibold"
                style={{
                  backgroundColor: 'rgba(200,16,46,0.1)',
                  border: '1px solid rgba(200,16,46,0.3)',
                  color: '#C8102E',
                }}
              >
                <Lock className="w-3 h-3" />
                Members Only
              </div>
            </div>
          )}

          <h1
            className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.04em] mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {collectionMeta?.title || `Collection: ${slug}`}
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {collectionMeta?.subtitle || 'Explore our curated selection.'}
          </p>

          <div
            className="mx-auto mt-8 h-[1px] max-w-xs"
            style={{
              background: 'linear-gradient(90deg, transparent, #C8102E, transparent)',
            }}
          />
        </div>
      </section>

      {/* ── Vault-Specific "What is the Vault?" callout ── */}
      {isVault && (
        <section className="px-4 sm:px-6 py-10 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: Lock, title: 'Exclusive Access', body: 'Vault products are never listed on the main shop. Members-only releases with limited quantities.' },
                { icon: Star, title: 'Curated Drops', body: 'Hand-picked items that represent the pinnacle of intimate design. Released in small batches.' },
                { icon: Zap, title: 'Early Access', body: 'Join our VIP list to be notified of Vault drops before they sell out.' },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-xl"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(200,16,46,0.1)' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: '#C8102E' }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-syne text-sm font-bold mb-1" style={{ color: '#F4F4F6' }}>{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Category Pills ── */}
      <section className="px-4 sm:px-6 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mr-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Filter:
          </span>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveCategory(f.value)}
              className="px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full border transition-all duration-200"
              style={{
                backgroundColor: activeCategory === f.value ? 'rgba(200,16,46,0.1)' : 'transparent',
                borderColor: activeCategory === f.value ? '#C8102E' : 'var(--border)',
                color: activeCategory === f.value ? '#C8102E' : 'var(--text-secondary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Products / Vault Fallback ── */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {showFallback ? (
            <>
              {/* Vault "coming soon" with image background */}
              <div
                className="relative text-center mb-12 p-12 rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(200,16,46,0.2)' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'linear-gradient(to bottom, rgba(11,11,12,0.6), rgba(11,11,12,0.95))' }}
                />
                <div className="relative z-10">
                  <Lock className="w-12 h-12 mx-auto mb-6" style={{ color: '#C8102E', opacity: 0.7 }} />
                  <h2
                    className="font-syne text-2xl sm:text-3xl font-bold mb-4"
                    style={{ color: '#F4F4F6' }}
                  >
                    {slug === 'vault'
                      ? 'The Vault Is Being Stocked'
                      : slug === 'new-arrivals'
                        ? 'New Arrivals Coming Soon'
                        : 'Collection Coming Soon'}
                  </h2>
                  <p className="text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {slug === 'vault'
                      ? 'Our members-only release program is being curated. The most exclusive pieces in intimate wellness — available in small batches, to the discerning few.'
                      : slug === 'new-arrivals'
                        ? 'We add new products weekly. Join our VIP list to be the first to know when new items drop.'
                        : 'This collection is being curated. Check back soon.'}
                  </p>

                  {/* VIP Signup CTA */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      href="/shop"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200"
                      style={{ backgroundColor: '#C8102E', color: '#FFFFFF' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#A30D25'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#C8102E'}
                    >
                      Browse Main Shop <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/#vip"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#F4F4F6',
                        border: '1px solid rgba(244,244,246,0.2)',
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = '#C8102E'}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(244,244,246,0.2)'}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Join VIP List
                    </Link>
                  </div>
                </div>
              </div>

              {/* Fallback products */}
              <p
                className="text-xs mb-6 tracking-widest uppercase text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                While you wait — from the main collection:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {fallbackProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p
                className="text-xs mb-6 tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
