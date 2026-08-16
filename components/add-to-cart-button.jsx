'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { ShoppingBag, Minus, Plus } from 'lucide-react'

export function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, setCartOpen } = useCart()

  if (!product) return null

  const handleAddToCart = () => {
    addToCart(product, quantity)
    setAdded(true)
    setTimeout(() => setCartOpen(true), 300)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs uppercase tracking-widest text-zinc-500">Qty</span>
        <div className="flex items-center border border-zinc-800 rounded-lg">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-zinc-900 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 text-sm font-medium tabular-nums">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-zinc-900 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full btn-primary ${added ? 'bg-green-600' : ''}`}
      >
        <ShoppingBag size={16} />
        {added ? 'Added to Cart' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
      </button>
    </>
  )
}
