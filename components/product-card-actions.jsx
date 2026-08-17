'use client'

import { useCart } from '@/lib/cart-context'

export default function ProductCardActions({ product }) {
  const { addToCart } = useCart()

  return (
    <button
      type="button"
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        })
      }
      className="text-[10px] font-medium uppercase tracking-[0.18em] text-theme-muted hover:text-theme-text"
    >
      Add
    </button>
  )
}
