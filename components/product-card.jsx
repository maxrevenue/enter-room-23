'use client'

import Link from 'next/link'
import { Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import ProductArtwork from '@/components/product-artwork'
import { productPath } from '@/lib/products'

const BADGE_STYLES = {
  'BEST SELLER': { bg: '#C8102E', text: '#FFFFFF' },
  'TRAVEL':      { bg: '#1c1c1f', text: '#C8102E', border: '1px solid rgba(200,16,46,0.4)' },
  'VALUE':       { bg: '#1c1c1f', text: '#D1D1D6', border: '1px solid rgba(209,209,214,0.3)' },
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const badgeStyle = product.badge ? BADGE_STYLES[product.badge] : null
  const href = productPath(product)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
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

      <div
        className="relative aspect-square overflow-hidden"
        style={{ backgroundColor: '#0B0B0C' }}
      >
        <ProductArtwork product={product} productId={product.id} category={product.category} />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ backgroundColor: '#C8102E', color: '#FFFFFF' }}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-1.5">
        {product.category && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: '#C8102E' }}>
            {product.category}
          </span>
        )}
        <h3 className="text-sm font-syne font-semibold leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>
        {product.tagline && (
          <p className="text-[11px] leading-relaxed line-clamp-1" style={{ color: 'var(--text-muted)' }}>
            {product.tagline}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-base font-syne font-bold" style={{ color: '#F4F4F6' }}>
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)' }}>
            <ShoppingBag className="w-3 h-3" />
            Add
          </div>
        </div>
      </div>
    </Link>
  )
}
