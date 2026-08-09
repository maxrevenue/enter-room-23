'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

import ProductArtwork from '@/components/product-artwork'

const BADGE_VARIANTS = {
  'BEST SELLER': {
    bg: '#FF1A1A',
    text: '#FFFFFF',
  },
  'RARE INVENTORY': {
    bg: '#FF1A1A',
    text: '#FFFFFF',
  },
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const badgeStyle = product.badge ? BADGE_VARIANTS[product.badge] : null

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, qty: 1 })
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}
    >
      {/* ── Badge Overlay (top-left) ── */}
      {product.badge && badgeStyle && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] rounded-sm"
            style={{
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
            }}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* ── Image ── */}
      <div
        className="relative aspect-square overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProductArtwork productId={product.id} category={product.category} />
        )}

        {/* Quick-add button (appears on hover) */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
          style={{
            backgroundColor: '#FF1A1A',
            color: '#FFFFFF',
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ── Info ── */}
      <div className="p-3.5 flex flex-col gap-1">
        {/* Category */}
        {product.category && (
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.category}
          </span>
        )}

        {/* Name */}
        <h3
          className="text-sm font-syne font-semibold leading-snug line-clamp-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </h3>

        {/* Price */}
        <p
          className="text-sm font-bold mt-0.5"
          style={{ color: 'var(--accent)' }}
        >
          ${product.price.toFixed(2)} USD
        </p>
      </div>
    </Link>
  )
}
