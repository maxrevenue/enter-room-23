'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { PRODUCTS } from '@/lib/products'
import { SITE_CONFIG } from '@/config/site'
import { Minus, Plus, ShoppingBag, ShieldCheck, Truck, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

// ── Helpers ──
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function findProduct(slug) {
  return (
    PRODUCTS.find((p) => slugify(p.name) === slug || p.id === slug) || null
  )
}

// ── Cross-sell groups ──
const RELATED_MAP = {
  'lube-water-01': ['lube-silicone-01', 'lube-hybrid-01', 'lube-aloe-01'],
  'lube-silicone-01': ['lube-hybrid-01', 'lube-water-01', 'toy-wand-01'],
  'lube-hybrid-01': ['lube-water-01', 'lube-silicone-01', 'toy-couples-01'],
  'lube-aloe-01': ['lube-water-01', 'lube-hybrid-01', 'toy-wand-01'],
  'toy-wand-01': ['toy-couples-01', 'lube-silicone-01', 'lube-aloe-01'],
  'toy-couples-01': ['toy-wand-01', 'lube-hybrid-01', 'lube-silicone-01'],
}

function getRelated(currentId) {
  const ids = RELATED_MAP[currentId] || PRODUCTS.filter((p) => p.id !== currentId).slice(0, 3).map((p) => p.id)
  return ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)
}

export default function ProductDetailPage({ params }) {
  const resolved = use(params)
  const router = useRouter()
  const { addToCart } = useCart()

  const product = findProduct(resolved.slug)

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne)' }}
        >
          Product Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          We could not find the item you&rsquo;re looking for.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#fff',
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>
    )
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const related = getRelated(product.id)

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.tagline,
    offers: {
      '@type': 'Offer',
      price: product.price.toFixed(2),
      priceCurrency: 'USD',
      availability: product.inventoryStatus === 'IN_STOCK'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `https://${SITE_CONFIG.domain}/shop/${resolved.slug}`,
    },
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200 hover:text-[var(--accent)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* ── 2-Column PDP ── */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div
              className="aspect-square rounded-2xl flex items-center justify-center overflow-hidden border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border)',
              }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center px-6">
                  <ShoppingBag
                    className="w-16 h-16 mx-auto mb-4 opacity-30"
                    style={{ color: 'var(--accent)' }}
                  />
                  <p className="text-sm uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
                    Image Coming Soon
                  </p>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#fff',
                }}
              >
                {product.inventoryStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                18+
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide border"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                Discreet Shipping
              </span>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--accent)' }}>
                {product.id}
              </p>
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-syne)',
                }}
              >
                {product.name}
              </h1>
              <p className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>
                {product.tagline}
              </p>
            </div>

            {/* Price */}
            <div>
              <span
                className="text-3xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                ${product.price.toFixed(2)}
              </span>
              <span className="ml-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                USD
              </span>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: 'var(--text-primary)' }}>
                About This Product
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>
                {product.description}
              </p>
            </div>

            {/* Quantity Selector + Add to Cart */}
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2.5 transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className="w-10 text-center font-semibold select-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(99, qty + 1))}
                  className="p-2.5 transition-colors duration-200 hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-[0.1em] transition-all duration-200 hover:brightness-110 disabled:opacity-60"
                style={{
                  backgroundColor: added ? 'var(--bg-elevated)' : 'var(--accent)',
                  color: added ? 'var(--accent)' : '#fff',
                  border: added ? '1px solid var(--accent)' : 'none',
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            {/* Trust Reassurance */}
            <div
              className="rounded-xl p-4 space-y-2 border"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Discreet Packaging Guarantee
                  </h4>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Every order ships in a plain, unbranded box with no external logos or product indications.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Charges Appear as {SITE_CONFIG.billingDescriptor}
                  </h4>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    Your billing statement will show a discreet descriptor — no product names or categories appear.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-16 sm:mt-20">
            <h2
              className="text-lg sm:text-xl font-bold text-center mb-8 tracking-[0.1em] uppercase"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-syne)' }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/shop/${slugify(rp.name)}`}
                  className="group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div
                    className="aspect-square rounded-xl mb-4 flex items-center justify-center border"
                    style={{
                      backgroundColor: 'var(--bg-base)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    <ShoppingBag className="w-10 h-10 opacity-20" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3
                    className="font-semibold text-sm group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {rp.name}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {rp.tagline}
                  </p>
                  <p className="mt-2 text-sm font-bold" style={{ color: 'var(--accent)' }}>
                    ${rp.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
