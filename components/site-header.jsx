'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { Sun, Moon, Menu, X, ShoppingBag } from 'lucide-react'

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/journal', label: 'THE COLUMN' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'CONTACT' },
]

export default function SiteHeader() {
  const { theme, toggleTheme, cart, cartOpen, setCartOpen } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className="sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--border-soft)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ── Left: Logo ── */}
        <Link
          href="/"
          className="font-syne text-lg font-bold tracking-[0.15em] uppercase select-none transition-all duration-300 hover:opacity-80"
          style={{ color: 'var(--accent)' }}
        >
          ROOM 23
        </Link>

        {/* ── Center: Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-3 py-1.5 text-xs font-medium tracking-[0.12em] uppercase transition-all duration-300 rounded-sm
                         hover:text-[var(--accent)] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
                         before:h-[1px] before:w-0 before:transition-all before:duration-300
                         before:bg-[var(--accent)] hover:before:w-[60%]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right: Cart + Theme Toggle + Mobile Menu ── */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            className="relative p-2 rounded-full transition-all duration-300 hover:bg-[var(--button-bg)]"
            aria-label="Open cart"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full transition-all duration-300 hover:bg-[var(--button-bg)] hover:shadow-[var(--neon-glow-sm)]"
            aria-label="Toggle theme"
            style={{ color: 'var(--text-secondary)' }}
          >
            {/* Sun icon — visible in light mode (click to switch to dark) */}
            <Sun
              className="h-5 w-5 transition-all duration-500 dark:hidden"
              style={{ color: 'var(--accent-amber)' }}
            />
            {/* Moon icon — visible in dark mode (click to switch to light) */}
            <Moon
              className="hidden h-5 w-5 transition-all duration-500 dark:block"
              style={{ color: 'var(--accent)' }}
            />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full transition-all duration-300 hover:bg-[var(--button-bg)]"
            aria-label="Toggle menu"
            style={{ color: 'var(--text-secondary)' }}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t backdrop-blur-xl animate-fade-in"
          style={{
            backgroundColor: 'var(--header-bg)',
            borderColor: 'var(--border-soft)',
          }}
        >
          <div className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                className="px-3 py-2.5 text-sm font-medium tracking-[0.12em] uppercase rounded-sm transition-all duration-200 hover:bg-[var(--button-bg)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* ── Neon Divider ── */}
      <hr className="neon-divider" />
    </header>
  )
}
