'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { PRODUCTS, searchProducts } from '@/lib/products'
import ProductCard from '@/components/product-card'

const COLLECTION_FILTERS = [
  { label: 'ALL', value: '' },
  { label: 'ROOM 23 ESSENTIALS', value: 'essentials' },
  { label: 'VINTAGE COLLECTION', value: 'vintage' },
]

const PRICE_FILTERS = [
  { label: 'ALL PRICES', min: null, max: null },
  { label: 'UNDER $50', min: 0, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: 'OVER $200', min: 200, max: null },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [collection, setCollection] = useState('')
  const [priceIdx, setPriceIdx] = useState(0)

  const priceFilter = PRICE_FILTERS[priceIdx]

  const results = useMemo(
    () =>
      searchProducts(query, {
        collection: collection || undefined,
        minPrice: priceFilter.min ?? undefined,
        maxPrice: priceFilter.max ?? undefined,
      }),
    [query, collection, priceFilter.min, priceFilter.max]
  )

  return (
    <main
      className="min-h-screen py-12 px-4 sm:px-6"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Title ── */}
        <h1
          className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Search Room 23
        </h1>

        {/* ── Search Bar ── */}
        <div className="max-w-xl mx-auto mb-10 relative">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for essentials, vintage, accessories..."
              className="w-full pl-12 pr-4 py-3.5 text-sm rounded-lg border outline-none transition-all duration-200 focus:shadow-[0_0_0_3px_rgba(255,26,26,0.15)]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                borderColor: query ? '#FF1A1A' : 'var(--border)',
              }}
            />
          </div>
        </div>

        {/* ── Filter Pills ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Collection filters (left) */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em] mr-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Collection:
            </span>
            {COLLECTION_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCollection(f.value)}
                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full border transition-all duration-200"
                style={{
                  backgroundColor:
                    collection === f.value ? 'rgba(255,26,26,0.1)' : 'transparent',
                  borderColor:
                    collection === f.value ? '#FF1A1A' : 'var(--border)',
                  color:
                    collection === f.value ? '#FF1A1A' : 'var(--text-secondary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Price filters (right) */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em] mr-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Price:
            </span>
            {PRICE_FILTERS.map((f, i) => (
              <button
                key={f.label}
                onClick={() => setPriceIdx(i)}
                className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] rounded-full border transition-all duration-200"
                style={{
                  backgroundColor:
                    priceIdx === i ? 'rgba(255,26,26,0.1)' : 'transparent',
                  borderColor:
                    priceIdx === i ? '#FF1A1A' : 'var(--border)',
                  color:
                    priceIdx === i ? '#FF1A1A' : 'var(--text-secondary)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results Count ── */}
        <p
          className="text-xs mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          {results.length} {results.length === 1 ? 'product' : 'products'} found
        </p>

        {/* ── Product Grid ── */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p
              className="text-lg font-syne font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              No products found
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
