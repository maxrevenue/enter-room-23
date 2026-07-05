'use client'

import Link from 'next/link'
import { Moon, ShoppingBag, Sun } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function SiteHeader() {
  const { itemCount, setCartOpen, mounted, theme, toggleTheme } = useCart()

  return (
    <header className="border-b border-border sticky top-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-light tracking-[0.4em] text-foreground"
          aria-label="AW home"
        >
          AW
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] uppercase text-foreground/60">
          <Link href="/#shop" className="hover:text-foreground transition-colors">Shop</Link>
          <Link href="/#story" className="hover:text-foreground transition-colors">Story</Link>
          <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/refund-policy" className="hover:text-foreground transition-colors">Refunds</Link>
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy</Link>
        </nav>

        <div className="flex items-center gap-5 sm:gap-6">
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              data-testid="theme-toggle"
              className="text-foreground/60 hover:text-foreground transition-colors p-1 -m-1"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            aria-label="Open bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {mounted && itemCount > 0 && (
              <span
                data-testid="cart-badge"
                className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] bg-foreground text-background rounded-full tabular-nums font-medium"
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
