'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
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

  const collectionProducts = useMemo(() => {
    return getProductsByCollection(slug)
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

  if (!collectionMeta || slug === 'vintage') notFound()

  return (
    <main style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <section
        className="relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="relative mx-auto max-w-3xl">
          <h1
            className="mb-4 font-syne text-3xl font-bold tracking-[0.04em] sm:text-4xl md:text-5xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {collectionMeta?.title || `Collection: ${slug}`}
          </h1>
          <p
            className="mx-auto max-w-xl text-sm leading-relaxed sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            {collectionMeta?.subtitle || 'Explore our curated selection.'}
          </p>
        </div>
      </section>

      <section className="border-b px-4 py-6 sm:px-6" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
          <span
            className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: 'var(--text-muted)' }}
          >
            Filter:
          </span>
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveCategory(f.value)}
              className="rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200"
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

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {showFallback ? (
            <>
              <div className="mb-12 p-12 text-center" style={{ border: '1px solid var(--border)' }}>
                <h2
                  className="mb-4 font-syne text-2xl font-bold sm:text-3xl"
                  style={{ color: '#F4F4F6' }}
                >
                  This edit is still taking shape
                </h2>
                <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Browse the shop while we finish this grouping.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-zinc-100 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-black hover:bg-white"
                >
                  Browse the Shop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <p
                className="mb-6 text-center text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                From the main collection
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {fallbackProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <>
              <p
                className="mb-6 text-xs uppercase tracking-widest"
                style={{ color: 'var(--text-muted)' }}
              >
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
