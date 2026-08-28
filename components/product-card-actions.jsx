'use client'

import { useCart } from '@/lib/cart-context'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { ShoppingBag } from 'lucide-react'

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
      aria-label={soldOut ? 'Unavailable' : 'Add to cart'}
      className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted transition-colors duration-150 hover:text-theme-text active:text-theme-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border disabled:cursor-not-allowed disabled:text-theme-muted/70 disabled:hover:text-theme-muted/70 min-[340px]:min-w-[4.75rem] min-[340px]:justify-end min-[340px]:text-left sm:tracking-[0.2em]"
    >
      <ShoppingBag className="h-4 w-4 min-[340px]:hidden" aria-hidden="true" />
      <span className="hidden min-[340px]:inline">{soldOut ? 'Unavailable' : 'Add'}</span>
    </button>
  )
}
