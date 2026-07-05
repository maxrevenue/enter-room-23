'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function SiteHeader() {
  const { itemCount, setCartOpen, mounted } = useCart()

  return (
    <header className="border-b border-white/10 sticky top-0 z-30 bg-black/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-[0.4em]">AW</Link>
        <nav className="hidden sm:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-white/70">
          <Link href="/#shop" className="hover:text-white">Shop</Link>
          <Link href="/#journal" className="hover:text-white">Journal</Link>
          <Link href="/terms-of-service" className="hover:text-white">Terms</Link>
          <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
        </nav>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:text-white"
          aria-label="Open bag"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Bag</span>
          {mounted && itemCount > 0 && (
            <span
              data-testid="cart-badge"
              className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] bg-white text-black rounded-full tabular-nums font-medium"
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
