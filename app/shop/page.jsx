'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { PRODUCTS as products } from '@/lib/products'
import { ShoppingBag, Filter, X } from 'lucide-react'

const CATEGORIES = ['All', 'Wellness', 'Accessories', 'Essentials']

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ShopPage() {
  const { addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')
  const [addedId, setAddedId] = useState(null)

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products
    return products.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())
  }, [activeCategory])

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="container-page" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      {/* ── Header ── */}
      <div className="mb-10 animate-fade-in-up">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-4xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          The Collection
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
          Curated premium wellness products. Discreetly shipped. Privately billed.
        </p>
      </div>

      {/* ── Category Filter Pills ── */}
      <div
        className="mb-10 animate-fade-in-up"
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          animationDelay: '100ms',
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-full)',
              border: cat === activeCategory
                ? '1px solid var(--color-brass)'
                : '1px solid var(--border)',
              backgroundColor: cat === activeCategory
                ? 'var(--color-brass-glow)'
                : 'transparent',
              color: cat === activeCategory
                ? 'var(--color-brass)'
                : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Product Grid ── */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-lg)' }}>
            No products found in this category.
          </p>
          <button
            onClick={() => setActiveCategory('All')}
            className="btn-secondary mt-4"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((product, idx) => (
            <div
              key={product.id}
              className="surface-card animate-fade-in-up group"
              style={{
                animationDelay: `${idx * 80}ms`,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Placeholder — clickable PDP link */}
              <Link
                href={`/shop/${slugify(product.name)}`}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <span
                    style={{
                      fontSize: 'var(--text-4xl)',
                      opacity: 0.15,
                      color: 'var(--color-brass)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                    }}
                  >
                    R23
                  </span>
                )}
              </Link>

              {/* Category Badge */}
              {product.category && (
                <span
                  className="badge badge-brass"
                  style={{ marginBottom: '0.5rem', alignSelf: 'flex-start' }}
                >
                  {product.category}
                </span>
              )}

              {/* Product Name — clickable PDP link */}
              <Link href={`/shop/${slugify(product.name)}`}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                  }}
                  className="hover:text-[var(--color-brass)] transition-colors"
                >
                  {product.name}
                </h3>
              </Link>

              {/* Description */}
              {product.description && (
                <p
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '0.75rem',
                    flex: 1,
                  }}
                  className="line-clamp-2"
                >
                  {product.description}
                </p>
              )}

              {/* Price */}
              <p
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: 'var(--color-brass)',
                  fontFamily: 'var(--font-display)',
                  marginBottom: '1rem',
                }}
              >
                ${product.price.toFixed(2)} <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--text-muted)' }}>USD</span>
              </p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    fontSize: 'var(--text-xs)',
                    padding: '0.625rem 1rem',
                    backgroundColor: addedId === product.id ? 'var(--color-success)' : undefined,
                  }}
                >
                  <ShoppingBag size={14} />
                  {addedId === product.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty State for no products ── */}
      {products.length === 0 && (
        <div
          className="surface-card text-center animate-fade-in-up"
          style={{ padding: '3rem' }}
        >
          <ShoppingBag size={48} style={{ color: 'var(--color-brass)', margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            Collection Coming Soon
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Our curated products are being prepared. Check back shortly.
          </p>
          <Link href="/" className="btn-secondary">Return Home</Link>
        </div>
      )}
    </div>
  )
}
