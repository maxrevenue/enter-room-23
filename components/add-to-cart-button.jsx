'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { ShoppingBag, Minus, Plus } from 'lucide-react'

export function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, cartOpen, setCartOpen } = useCart()
  const router = useRouter()

  if (!product) return null

  const id = `${product.name}-${product.size || 'default'}`

  const handleAddToCart = () => {
    addToCart({
      id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setCartOpen(true), 300)
    setTimeout(() => setAdded(false), 2000)
  }

  const qtyControls = (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs uppercase tracking-widest text-neutral-500">Qty</span>
      <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <button
          aria-label="Decrease quantity"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="px-4 text-sm font-medium tabular-nums">{quantity}</span>
        <button
          aria-label="Increase quantity"
          onClick={() => setQuantity(quantity + 1)}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      {qtyControls}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg font-medium text-sm uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200'
        }`}
      >
        <ShoppingBag size={16} />
        {added ? 'Added to Cart' : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
      </button>
    </>
  )
}

export function RelatedProductButton({ product }) {
  const { addToCart, cartOpen, setCartOpen } = useCart()

  const handleAdd = () => {
    addToCart({
      id: `${product.name}-${product.size || 'default'}`,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    setTimeout(() => setCartOpen(true), 300)
  }

  return (
    <button
      onClick={handleAdd}
      className="text-xs underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors"
    >
      Quick Add
    </button>
  )
}
