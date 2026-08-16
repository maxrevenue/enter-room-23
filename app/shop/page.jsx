'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { PRODUCTS as products, productPath } from '@/lib/products'
import { ShoppingBag, Search, SlidersHorizontal, X, Star, ChevronDown, Flame, Sparkles } from 'lucide-react'
import ProductArtwork from '@/components/product-artwork'
import EditorChoice from '@/components/editor-choice'

const CATEGORIES = ['All', 'Essentials', 'Toys', 'Wellness', 'Accessories']

const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name',       label: 'Name: A → Z' },
]

export default function ShopPage() {
  const { addToCart } = useCart()
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('featured')
  const [search, setSearch] = useState('')
  const [addedId, setAddedId] = useState(null)
  const [sortOpen, setSortOpen] = useState(false)
  const searchRef = useRef(null)

  const currentSort = SORT_OPTIONS.find(o => o.value === sortOrder)

  const filteredProducts = useMemo(() => {
    let list = activeCategory === 'All'
      ? [...products]
      : products.filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q)
      )
    }

    if (sortOrder === 'price-low') {
      list.sort((a, b) => a.price - b.price)
    } else if (sortOrder === 'price-high') {
      list.sort((a, b) => b.price - a.price)
    } else if (sortOrder === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }
    return list
  }, [activeCategory, sortOrder, search])

  const handleAddToCart = (product) => {
    addToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const clearSearch = () => {
    setSearch('')
    searchRef.current?.focus()
  }

  const isFiltered = activeCategory !== 'All' || search.trim().length > 0

  return (
    <div style={{ paddingBottom: '5rem' }}>

      {/* ── Shop Hero ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '4rem 0 3rem',
          marginBottom: '0',
          background: 'linear-gradient(180deg, #0B0B0C 0%, #161618 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          right: '10%',
          width: '300px',
          height: '150px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container-page" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <div className="animate-fade-in-up">
            {/* Eyebrow */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border-brass)',
              backgroundColor: 'var(--color-brass-glow)',
              marginBottom: '1.25rem',
            }}>
              <Sparkles size={11} style={{ color: 'var(--color-brass)' }} />
              <span style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-brass)',
              }}>
                The Collection
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
              }}
            >
              Premium Wellness,<br />
              <span style={{ color: '#C8102E' }}>Curated for You</span>
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: 'var(--text-base)',
              maxWidth: '520px',
              lineHeight: 1.6,
            }}>
              Curated essentials. Every product is body-safe,
              clinically tested, and selected for quality above all else.
            </p>
          </div>

          {/* Trust strip */}
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              marginTop: '2rem',
            }}
          >
            {[
              { icon: '✓', text: 'Body-Safe Materials' },
              { icon: '⚡', text: 'Fast Shipping' },
              { icon: '🔒', text: 'Secure Checkout' },
              { icon: '18+', text: 'Adults Only' },
            ].map((item) => (
              <div key={item.text} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}>
                <span style={{ fontSize: '0.85rem' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditorChoice />

      {/* ── Sticky Filter / Sort Toolbar ── */}
      <div
        style={{
          position: 'sticky',
          top: '4rem',
          zIndex: 40,
          backgroundColor: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '0.875rem 0',
        }}
      >
        <div
          className="container-page"
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flex: 1 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.375rem 1rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  borderRadius: 'var(--radius-full)',
                  border: cat === activeCategory
                    ? '1px solid var(--color-brass)'
                    : '1px solid var(--color-border)',
                  backgroundColor: cat === activeCategory
                    ? 'var(--color-brass-glow)'
                    : 'transparent',
                  color: cat === activeCategory
                    ? 'var(--color-brass)'
                    : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search
                size={13}
                style={{
                  position: 'absolute',
                  left: '0.6rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.375rem 1.75rem 0.375rem 1.75rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  width: '160px',
                  transition: 'border-color var(--transition-fast), width var(--transition-fast)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-brass)'
                  e.target.style.width = '200px'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)'
                  if (!search) e.target.style.width = '160px'
                }}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.375rem 0.75rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'border-color var(--transition-fast)',
                }}
              >
                <SlidersHorizontal size={12} />
                {currentSort?.label}
                <ChevronDown size={12} style={{
                  transform: sortOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform var(--transition-fast)',
                }} />
              </button>
              {sortOpen && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 49,
                    }}
                    onClick={() => setSortOpen(false)}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 0.375rem)',
                      zIndex: 50,
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      minWidth: '180px',
                      boxShadow: 'var(--shadow-elevated)',
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortOrder(opt.value); setSortOpen(false) }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.6rem 1rem',
                          fontSize: 'var(--text-xs)',
                          fontWeight: sortOrder === opt.value ? 700 : 500,
                          color: sortOrder === opt.value ? 'var(--color-brass)' : 'var(--text-secondary)',
                          backgroundColor: sortOrder === opt.value ? 'var(--color-brass-glow)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'background-color var(--transition-fast)',
                          letterSpacing: '0.03em',
                        }}
                        onMouseEnter={(e) => {
                          if (sortOrder !== opt.value) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'
                        }}
                        onMouseLeave={(e) => {
                          if (sortOrder !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container-page" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>

        {/* Results count */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-muted)',
          }}>
            {isFiltered ? (
              <>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {filteredProducts.length}
                </span>{' '}
                result{filteredProducts.length !== 1 ? 's' : ''}
                {search && (
                  <> for <span style={{ color: 'var(--color-brass)', fontStyle: 'italic' }}>"{search}"</span></>
                )}
              </>
            ) : (
              <>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {filteredProducts.length}
                </span>{' '}
                products available
              </>
            )}
          </p>
          {isFiltered && (
            <button
              onClick={() => { setActiveCategory('All'); setSearch('') }}
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-brass)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>

        {/* ── Product Grid ── */}
        {filteredProducts.length === 0 ? (
          <div
            className="surface-card text-center animate-fade-in-up"
            style={{ padding: '4rem 2rem', marginTop: '1rem' }}
          >
            <Search size={40} style={{ color: 'var(--color-brass)', margin: '0 auto 1.25rem', opacity: 0.3 }} />
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
            }}>
              No products found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: 'var(--text-sm)' }}>
              Try adjusting your search or category filter.
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearch('') }}
              className="btn-secondary"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredProducts.map((product, idx) => (
              <ShopProductCard
                key={product.id}
                product={product}
                idx={idx}
                addedId={addedId}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

/* ── Product Card (internal) ── */
function ShopProductCard({ product, idx, addedId, onAddToCart }) {
  const [hovered, setHovered] = useState(false)
  const isAdded = addedId === product.id
  const isBestSeller = product.badge === 'BEST SELLER'
  const isRare = product.badge === 'RARE INVENTORY'

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${idx * 60}ms`,
        borderRadius: 'var(--radius-lg)',
        border: hovered
          ? '1px solid var(--color-border-light)'
          : '1px solid var(--border)',
        backgroundColor: 'var(--bg-surface)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base)',
        boxShadow: hovered ? 'var(--shadow-elevated)' : 'none',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link
        href={productPath(product)}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Badge overlay */}
        {product.badge && (
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            zIndex: 10,
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.2rem 0.6rem',
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '3px',
              backgroundColor: isBestSeller ? 'var(--color-accent)' : '#7C3AED',
              color: '#fff',
            }}>
              {isBestSeller && <Flame size={8} />}
              {isRare && <Star size={8} />}
              {product.badge}
            </span>
          </div>
        )}

        {/* Hover overlay with CTA */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 5,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '1rem',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity var(--transition-base)',
          pointerEvents: hovered ? 'auto' : 'none',
        }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.4)',
            paddingBottom: '1px',
          }}>
            View Details →
          </span>
        </div>

        <div className="absolute inset-0">
          <ProductArtwork
            product={product}
            productId={product.id}
            category={product.category}
            style={{
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 400ms ease',
            }}
          />
        </div>
      </Link>

      {/* Info */}
      <div style={{
        padding: '1rem 1.125rem 1.125rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        gap: '0.375rem',
      }}>
        {/* Category */}
        {product.category && (
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            {product.category}
          </span>
        )}

        {/* Name */}
        <Link href={productPath(product)}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              color: hovered ? 'var(--color-brass)' : 'var(--text-primary)',
              lineHeight: 1.3,
              transition: 'color var(--transition-fast)',
              margin: 0,
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Tagline */}
        {product.tagline && (
          <p style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            margin: 0,
          }}>
            {product.tagline}
          </p>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Price + Add to cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.75rem',
          gap: '0.5rem',
        }}>
          <div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-brass)',
            }}>
              ${product.price.toFixed(2)}
            </span>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginLeft: '0.25rem',
              fontWeight: 400,
            }}>
              USD
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              onAddToCart(product)
            }}
            className="btn-primary"
            style={{
              padding: '0.5rem 0.875rem',
              fontSize: '11px',
              gap: '0.35rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isAdded
                ? 'var(--color-success)'
                : undefined,
              transition: 'background-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast)',
              transform: isAdded ? 'scale(0.96)' : 'scale(1)',
            }}
          >
            <ShoppingBag size={12} />
            {isAdded ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
