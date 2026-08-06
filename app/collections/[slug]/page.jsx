'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS, COLLECTIONS, getProductsByCollection, searchProducts } from '@/lib/products'
import ProductCard from '@/components/product-card'

const CATEGORY_FILTERS = [
  { label: 'ALL ITEMS', value: 'all' },
  { label: 'ACCESSORIES', value: 'accessories' },
  { label: 'WELLNESS', value: 'wellness' },
  { label: 'VINTAGE', value: 'vintage' },
  { label: 'MAGAZINES', value: 'magazines' },
  { label: 'COLLECTIBLES', value: 'collectibles' },
]

// Static params for all known collection slugs
export const dynamicParams = true

export default function CollectionPage({ params }) {
  const { slug } = params
  const [activeCategory, setActiveCategory] = useState('all')

  // Resolve collection metadata
  const collectionMeta = COLLECTIONS[slug]

  // Get products for this collection
  const collectionProducts = useMemo(() => {
    if (slug === 'vault' || slug === 'new-arrivals') {
      // These collections may be empty — show fallback
      const direct = getProductsByCollection(slug)
      return direct.length > 0 ? direct : []
    }
    return getProductsByCollection(slug)
  }, [slug])

  // Apply category filter on top
  const filtered = useMemo(() => {
    if (activeCategory === 'all') return collectionProducts
    return collectionProducts.filter((p) => p.category === activeCategory)
  }, [collectionProducts, activeCategory])

  // Fallback: show store-wide products for empty collections
  const showFallback = collectionProducts.length === 0
  const fallbackProducts = useMemo(() => {
    if (!showFallback) return []
    // Show 6 random or first products from the full catalog
    return PRODUCTS.slice(0, 6)
  }, [showFallback])

  return (
    <main style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <section
        className="relative py-16 sm:py-20 px-4 sm:px-6 text-center overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute top-0 left-1/4 w-[60%] h-full opacity-[0.04]"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, var(--accent) 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <h1
            className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.05em] mb-4"
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
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            }}
          />
        </div>
      </section>

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
                backgroundColor:
                  activeCategory === f.value ? 'rgba(255,26,26,0.1)' : 'transparent',
                borderColor:
                  activeCategory === f.value ? '#FF1A1A' : 'var(--border)',
                color:
                  activeCategory === f.value ? '#FF1A1A' : 'var(--text-secondary)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Products / Fallback ── */}
      <section className="px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">
          {showFallback ? (
            <>
              <div className="text-center mb-10 p-10 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              >
                <h2
                  className="font-syne text-xl font-bold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Coming Soon
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                  {slug === 'vault'
                    ? 'The Vault is our members-only release program. Check back for exclusive drops.'
                    : slug === 'new-arrivals'
                      ? 'New products are added weekly. Stay tuned for fresh arrivals.'
                      : `No products available in this collection yet.`}
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-200"
                  style={{
                    backgroundColor: '#FF1A1A',
                    color: '#FFFFFF',
                  }}
                >
                  Browse All Products
                </Link>
              </div>

              {/* Show fallback products */}
              <p
                className="text-xs mb-5 text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                While you wait, explore our full catalog:
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
                className="text-xs mb-6"
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
