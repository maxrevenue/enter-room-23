'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Menu, X, ShoppingBag } from 'lucide-react'

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/journal', label: 'THE ARCHIVE' },
  { href: '#', label: 'THE VAULT' },
  { href: '#', label: 'ESSENTIALS' },
  { href: '#', label: 'NEW ARRIVALS' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'CONTACT' },
]

export default function SiteHeader() {
  const { cart, cartOpen, setCartOpen } = useCart()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeDrawer = () => setDrawerOpen(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* ── Main Nav Bar ── */}
        <div
          className="w-full transition-all duration-300 border-b"
          style={{
            backgroundColor: scrolled ? 'rgba(11, 11, 12, 0.95)' : '#0B0B0C',
            borderColor: scrolled ? 'var(--color-border)' : 'transparent',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
          }}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            
            {/* ── Left: Hamburger Menu ── */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 rounded-full transition-colors focus:outline-none"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6 stroke-[1.5]" />
            </button>

            {/* ── Center: Bold Text Logo ── */}
            <Link href="/" className="flex items-center group focus:outline-none" aria-label="Room 23 Home">
              <span 
                className="font-bold text-2xl tracking-widest uppercase transition-transform duration-300 group-hover:scale-105"
                style={{ 
                  color: 'var(--color-emerald)', // Crimson Red
                  fontFamily: 'var(--font-display)',
                }}
              >
                ROOM 23
              </span>
            </Link>

            {/* ── Right: Cart ── */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 -mr-2 rounded-full transition-colors focus:outline-none"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {itemCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex h-[16px] w-[16px] items-center justify-center rounded-full text-[9px] font-bold"
                  style={{ backgroundColor: 'var(--color-emerald)', color: '#F4F4F6' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Left Slide-Out Drawer Navigation ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          
          {/* Drawer Panel */}
          <nav
            className="relative flex w-full max-w-xs flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300"
            style={{ backgroundColor: 'var(--color-bg-primary)', borderRight: '1px solid var(--color-border)' }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <Link href="/" onClick={closeDrawer} className="focus:outline-none">
                <span 
                  className="font-bold text-xl tracking-widest uppercase"
                  style={{ 
                    color: 'var(--color-emerald)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  ROOM 23
                </span>
              </Link>
              <button
                onClick={closeDrawer}
                className="p-2 -mr-2 transition-colors focus:outline-none"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col px-6 py-8 space-y-6">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeDrawer}
                    className="text-sm tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
                    style={{
                      color: isActive ? 'var(--color-emerald)' : 'var(--color-text-primary)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
                    onMouseOut={e => e.currentTarget.style.color = isActive ? 'var(--color-emerald)' : 'var(--color-text-primary)'}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
            
            {/* Optional lower links / legal */}
            <div className="mt-auto px-6 py-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex gap-4">
                <Link href="/privacy" className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }} onClick={closeDrawer}>Privacy</Link>
                <Link href="/terms" className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }} onClick={closeDrawer}>Terms</Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
