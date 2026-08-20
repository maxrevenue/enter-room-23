'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { ShoppingBag } from 'lucide-react'

export default function ProductAddToCart({ product, compact = false }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return null

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const label = compact
    ? added
      ? 'Added'
      : 'Add'
    : added
      ? 'Added to cart'
      : `Add to cart — $${product.price.toFixed(2)}`

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-2 rounded-none bg-primary px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border sm:tracking-[0.2em] ${
        compact ? 'min-h-11 min-w-[5.5rem] px-4' : 'w-full'
      }`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  )
}
