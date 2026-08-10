'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Menu, X, ShoppingBag } from 'lucide-react'

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/search', label: 'SEARCH' },
  { href: '/journal', label: 'THE COLUMN' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'CONTACT' },
]

export default function SiteHeader() {
  const { cart, cartOpen, setCartOpen } = useCart()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeMobile = () => setMobileOpen(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* ── Announcement Banner ── */}
      {bannerVisible && (
        <div
          className="w-full flex items-center justify-center gap-3 py-2 relative"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white">
            FREE DISCREET SHIPPING ON ORDERS OVER $75 · USE CODE{' '}
            <span
              className="px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', fontFamily: 'monospace' }}
            >
              SOFTLAUNCH10
            </span>{' '}
            FOR 10% OFF
          </span>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Main Nav Bar ── */}
      <div
        className="w-full border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? 'rgba(5,5,5,0.97)'
            : 'rgba(10,10,10,0.98)',
          borderColor: scrolled ? 'var(--border)' : 'var(--border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="font-syne font-bold tracking-[0.15em] uppercase select-none transition-all duration-300 hover:opacity-80 flex items-center gap-2"
            style={{ color: 'var(--color-accent)', fontSize: '1.125rem' }}
          >
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(255,26,26,0.12)',
                border: '1px solid rgba(255,26,26,0.2)',
                color: 'var(--color-accent)',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
              }}
            >
              R23
            </span>
            ROOM 23
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-all duration-200 rounded-sm"
                  style={{
                    color: isActive ? 'var(--color-brass)' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                  {/* Underline indicator */}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full transition-all duration-200"
                    style={{
                      width: isActive ? '60%' : '0%',
                      backgroundColor: 'var(--color-brass)',
                    }}
                  />
                  {/* Hover underline via CSS */}
                  <style>{`
                    .nav-link-${link.href.replace('/', '')}:hover .nav-underline {
                      width: 60%;
                    }
                  `}</style>
                </Link>
              )
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2.5 rounded-full transition-all duration-200 hover:bg-white/5"
              aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
              style={{ color: 'var(--text-secondary)' }}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] font-bold animate-scale-in"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-full transition-all duration-200 hover:bg-white/5"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              style={{ color: 'var(--text-secondary)' }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <nav
            className="md:hidden border-t animate-slide-down"
            style={{
              backgroundColor: 'rgba(5,5,5,0.98)',
              borderColor: 'var(--border)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col px-4 py-4 gap-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className="px-3 py-3 text-sm font-semibold tracking-[0.1em] uppercase rounded-md transition-all duration-200"
                    style={{
                      color: isActive ? 'var(--color-brass)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--color-brass-glow)' : 'transparent',
                    }}
                  >
                    {isActive && <span className="mr-2 text-xs">▸</span>}
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
