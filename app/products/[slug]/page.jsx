'use client'

import { use, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { Minus, Plus, Truck, Heart, ChevronDown, ChevronUp, Waves, Droplets, Shield, ShieldCheck, Leaf, Heart as HeartSolid, Smartphone, Sparkles, Blend } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/lib/cart-context'

import ProductArtwork from '@/components/product-artwork'

// Map icon names from product features to actual Lucide components
const ICON_MAP = {
  Waves, Droplets, Shield, ShieldCheck, Leaf, Heart, Smartphone, Sparkles, Blend,
}

// Static params for all product slugs (used by Next.js for route enumeration)
export const dynamicParams = true

export default function ProductDetailPage({ params }) {
  const resolvedParams = typeof params?.then === 'function' ? use(params) : params
  const slug = resolvedParams?.slug || params?.slug
  const { addToCart } = useCart()
  const router = useRouter()

  const product = PRODUCTS.find((p) => p.id === slug)
  if (!product) notFound()

  // ── State ──
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.length > 0 ? 0 : null
  )
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Accordion state
  const [materialsOpen, setMaterialsOpen] = useState(false)
  const [specsOpen, setSpecsOpen] = useState(false)

  // Current variant price
  const currentPrice =
    selectedVariant !== null && product.variants?.[selectedVariant]
      ? product.variants[selectedVariant].price
      : product.price

  // Handle add to cart
  const handleAddToCart = () => {
    const variantLabel =
      selectedVariant !== null && product.variants?.[selectedVariant]
        ? product.variants[selectedVariant].label
        : null

    addToCart({
      id: product.id,
      name: variantLabel ? `${product.name} — ${variantLabel}` : product.name,
      price: currentPrice,
      image: product.image,
      qty: qty,
      ...(variantLabel && { variant: variantLabel }),
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWishlist = () => {
    setWishlisted(!wishlisted)
  }

  return (
    <main style={{ backgroundColor: 'var(--bg-base)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* ── Breadcrumb ── */}
        <nav className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-xs uppercase tracking-[0.1em] font-semibold hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back
          </button>
        </nav>

        {/* ── Main Product Section: Gallery + Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* ===== Gallery (Left) ===== */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square rounded-xl overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            >
              <ProductArtwork productId={product.id} category={product.category} className="w-full h-full" />
            </div>
          </div>

          {/* ===== Product Info (Right) ===== */}
          <div className="flex flex-col gap-5">
            {/* Category Tag */}
            {product.category && (
              <span
                className="inline-block self-start px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full border"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1
              className="font-syne text-2xl sm:text-3xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <p
              className="text-2xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              ${currentPrice.toFixed(2)} USD
            </p>

            {/* Description */}
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {product.description}
            </p>

            <hr style={{ borderColor: 'var(--border)' }} />

            {/* Variant / Option Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label
                  className="block text-[10px] font-semibold uppercase tracking-[0.15em] mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  SELECT OPTION
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, i) => (
                    <button
                      key={variant.label}
                      onClick={() => setSelectedVariant(i)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200"
                      style={{
                        backgroundColor:
                          selectedVariant === i ? 'rgba(200,16,46,0.1)' : 'var(--bg-elevated)',
                        borderColor:
                          selectedVariant === i ? '#C8102E' : 'var(--border)',
                        color:
                          selectedVariant === i ? '#C8102E' : 'var(--text-secondary)',
                      }}
                    >
                      {variant.label}
                      {variant.price !== product.price && (
                        <span className="ml-1 opacity-60">
                          — ${variant.price}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Counter */}
            <div>
              <label
                className="block text-[10px] font-semibold uppercase tracking-[0.15em] mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                QUANTITY
              </label>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="w-10 h-10 flex items-center justify-center border rounded-l-lg transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-elevated)',
                    color: qty <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div
                  className="w-14 h-10 flex items-center justify-center text-sm font-semibold border-y"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {qty}
                </div>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center border rounded-r-lg transition-colors"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-1">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-3.5 text-sm font-syne font-bold uppercase tracking-[0.12em] rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: added ? '#2d8a4e' : '#C8102E',
                  color: '#FFFFFF',
                }}
              >
                {added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
              </button>

              <button
                onClick={handleWishlist}
                className="w-full py-3.5 text-sm font-syne font-semibold uppercase tracking-[0.12em] rounded-lg border transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: wishlisted ? 'rgba(200,16,46,0.05)' : 'transparent',
                  borderColor: wishlisted ? '#C8102E' : 'var(--border)',
                  color: wishlisted ? '#C8102E' : 'var(--text-secondary)',
                }}
              >
                {wishlisted ? (
                  <HeartSolid className="w-4 h-4" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
                {wishlisted ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Feature Badges (3-Column Grid) ── */}
        {product.features && product.features.length > 0 && (
          <section className="mb-12">
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 sm:p-8 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            >
              {product.features.map((feature) => {
                const Icon = ICON_MAP[feature.icon] || Shield
                return (
                  <div key={feature.label} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(200,16,46,0.08)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: '#C8102E' }} />
                    </div>
                    <span
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {feature.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Discreet Shipping Callout ── */}
        <section className="mb-12">
          <div
            className="p-5 sm:p-6 rounded-xl border flex items-start gap-4"
            style={{ backgroundColor: '#0D0D0D', borderColor: 'var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: 'rgba(200,16,46,0.1)' }}
            >
              <Truck className="w-5 h-5" style={{ color: '#C8102E' }} />
            </div>
            <div>
              <h3
                className="font-syne text-sm font-bold uppercase tracking-[0.1em] mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                DISCREET SHIPPING
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Always private. Always secure. Your order ships in plain, unmarked packaging with
                no external branding. The only name on the label is our return address — nothing
                indicates the contents inside.
              </p>
            </div>
          </div>
        </section>

        {/* ── Collapsible Accordions ── */}
        <section className="space-y-3">
          {/* Materials & Care */}
          {product.materials && (
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
            >
              <button
                onClick={() => setMaterialsOpen(!materialsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{
                  backgroundColor: materialsOpen ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <span
                  className="font-syne text-sm font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  MATERIALS & CARE
                </span>
                {materialsOpen ? (
                  <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              {materialsOpen && (
                <div className="px-5 pb-5">
                  <hr className="mb-4" style={{ borderColor: 'var(--border)' }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {product.materials}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
            >
              <button
                onClick={() => setSpecsOpen(!specsOpen)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                style={{
                  backgroundColor: specsOpen ? 'var(--bg-elevated)' : 'transparent',
                }}
              >
                <span
                  className="font-syne text-sm font-bold uppercase tracking-[0.1em]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  SPECIFICATIONS
                </span>
                {specsOpen ? (
                  <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                )}
              </button>
              {specsOpen && (
                <div className="px-5 pb-5">
                  <hr className="mb-4" style={{ borderColor: 'var(--border)' }} />
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {product.specifications}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
