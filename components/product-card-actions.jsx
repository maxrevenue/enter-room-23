'use client'

import { useCart } from '@/lib/cart-context'
import { INVENTORY_STATUS } from '@/lib/inventory'

export default function ProductCardActions({ product }) {
  const { addToCart } = useCart()
  const soldOut =
    product.inventoryStatus === INVENTORY_STATUS.OUT_OF_STOCK ||
    product.badge === 'SOLD OUT'

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      qty: 1,
    })
  }

  return (
    <button
      type="button"
      onClick={handleQuickAdd}
      disabled={soldOut}
      className="min-h-11 min-w-[4.75rem] px-1 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted transition-colors duration-300 hover:text-theme-text disabled:cursor-not-allowed disabled:text-theme-muted/70 disabled:hover:text-theme-muted/70"
    >
      {soldOut ? 'Unavailable' : 'Add'}
    </button>
  )
}
