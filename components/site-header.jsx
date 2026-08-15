'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Menu, X, ShoppingBag, Lock } from 'lucide-react'
import BrandLogo from '@/components/brand-logo'
import { SITE_CONFIG } from '@/config/site'

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/collections/essentials', label: 'ESSENTIALS' },
  { href: '/collections/vault', label: 'THE VAULT', icon: Lock },
  { href: '/collections/new-arrivals', label: 'NEW ARRIVALS' },
  { href: '/journal', label: 'THE ARCHIVE' },
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

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* ── Main Nav Bar ── */}
        <div
          className="w-full transition-all duration-300 border-b"
          style={{
            backgroundColor: scrolled ? 'rgba(11, 11, 12, 0.97)' : '#0B0B0C',
            borderColor: scrolled ? 'rgba(200,16,46,0.2)' : 'transparent',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.6)' : 'none',
          }}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 gap-4">

            {/* ── Left: Hamburger (mobile) + desktop links ── */}
            <div className="flex items-center gap-1 min-w-[2.5rem] lg:min-w-0 lg:flex-1">
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 -ml-2 rounded-full transition-all duration-200 focus:outline-none lg:hidden"
                style={{ color: 'var(--color-text-primary)' }}
                onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 stroke-[1.5]" />
              </button>
              <nav className="hidden lg:flex items-center gap-5" aria-label="Primary">
                {NAV_LINKS.slice(0, 5).map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[11px] tracking-[0.16em] uppercase font-semibold transition-colors"
                      style={{ color: isActive ? '#C8102E' : 'var(--color-text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* ── Center: Wordmark ── */}
            <BrandLogo size="md" />

            {/* ── Right: Cart ── */}
            <div className="flex items-center justify-end min-w-[2.5rem] lg:flex-1">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 -mr-2 rounded-full transition-all duration-200 focus:outline-none"
              style={{ color: 'var(--color-text-primary)' }}
              onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
              {itemCount > 0 && (
                <span
                  className="absolute top-0 right-0 flex h-[16px] w-[16px] items-center justify-center rounded-full text-[9px] font-bold animate-in zoom-in duration-200"
                  style={{ backgroundColor: '#C8102E', color: '#F4F4F6' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
            </div>
          </div>
        </div>
        {SITE_CONFIG.softLaunch && (
          <div
            className="w-full text-center py-1.5 px-4 text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{
              backgroundColor: 'rgba(200,16,46,0.12)',
              color: '#F4F4F6',
              borderBottom: '1px solid rgba(200,16,46,0.2)',
            }}
          >
            Soft launch — browse the collection. Secure checkout opens once CCBill is live.
          </div>
        )}
      </header>

      {/* ── Left Slide-Out Drawer Navigation ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <nav
            className="relative flex w-full max-w-xs flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300"
            style={{ backgroundColor: '#0B0B0C', borderRight: '1px solid rgba(200,16,46,0.2)' }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'rgba(200,16,46,0.15)' }}>
              <span onClick={closeDrawer}>
                <BrandLogo size="sm" />
              </span>
              <button
                onClick={closeDrawer}
                className="p-2 -mr-2 transition-colors focus:outline-none"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseOver={e => e.currentTarget.style.color = '#F4F4F6'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col px-6 py-8 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={closeDrawer}
                    className="flex items-center gap-2 py-3 text-sm tracking-[0.2em] uppercase font-semibold transition-all duration-200 border-b"
                    style={{
                      color: isActive ? '#C8102E' : 'var(--color-text-primary)',
                      borderColor: 'rgba(255,255,255,0.04)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onMouseOver={e => { e.currentTarget.style.color = '#C8102E'; e.currentTarget.style.paddingLeft = '8px' }}
                    onMouseOut={e => { e.currentTarget.style.color = isActive ? '#C8102E' : 'var(--color-text-primary)'; e.currentTarget.style.paddingLeft = '0px' }}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 opacity-60" />}
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Bottom section */}
            <div className="mt-auto px-6 py-8 border-t" style={{ borderColor: 'rgba(200,16,46,0.1)' }}>
              {/* Tagline */}
              <p className="text-[10px] tracking-widest uppercase mb-6 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Private. Curated.<br />For discerning adults only.
              </p>
              <div className="flex gap-6">
                <Link href="/privacy" className="text-[10px] tracking-widest uppercase transition-colors" style={{ color: 'var(--color-text-muted)' }} onClick={closeDrawer}
                  onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >Privacy</Link>
                <Link href="/terms" className="text-[10px] tracking-widest uppercase transition-colors" style={{ color: 'var(--color-text-muted)' }} onClick={closeDrawer}
                  onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >Terms</Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
