'use client'

import Link from 'next/link'
import { Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import ProductArtwork from '@/components/product-artwork'

const BADGE_STYLES = {
  'BEST SELLER': { bg: '#C8102E', text: '#FFFFFF' },
  'TRAVEL':      { bg: '#1c1c1f', text: '#C8102E', border: '1px solid rgba(200,16,46,0.4)' },
  'VALUE':       { bg: '#1c1c1f', text: '#D1D1D6', border: '1px solid rgba(209,209,214,0.3)' },
  'RARE INVENTORY': { bg: '#C8102E', text: '#FFFFFF' },
  'ALMOST GONE': { bg: '#7D0A1C', text: '#FFFFFF' },
  'SOLD OUT':    { bg: '#26262A', text: '#8E8E93' },
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const badgeStyle = product.badge ? BADGE_STYLES[product.badge] : null

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, qty: 1 })
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(200,16,46,0.25)'}
      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* ── Badge ── */}
      {product.badge && badgeStyle && (
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] rounded-sm"
            style={{
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.text,
              border: badgeStyle.border || 'none',
            }}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* ── Image ── */}
      <div
        className="relative aspect-square overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#0B0B0C' }}
      >
        {/* Obsidian placeholder — no product images */}
        <ProductArtwork productId={product.id} category={product.category} />

        {/* Quick-add button */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0"
          style={{
            backgroundColor: '#C8102E',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(200,16,46,0.4)',
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(200,16,46,0.06) 0%, transparent 50%)' }}
        />
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-1.5">
        {product.category && (
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: '#C8102E' }}
          >
            {product.category}
          </span>
        )}

        <h3
          className="text-sm font-syne font-semibold leading-snug line-clamp-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </h3>

        {product.tagline && (
          <p
            className="text-[11px] leading-relaxed line-clamp-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.tagline}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span
            className="text-base font-syne font-bold"
            style={{ color: '#F4F4F6' }}
          >
            ${product.price}
          </span>
          <div
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            <ShoppingBag className="w-3 h-3" />
            Add
          </div>
        </div>
      </div>
    </Link>
  )
}
