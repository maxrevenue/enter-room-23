'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Menu, X, ShoppingBag } from 'lucide-react'
import BrandLogo from '@/components/brand-logo'

const CATEGORY_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections/essentials', label: 'Essentials' },
  { href: '/collections/new-arrivals', label: 'New Arrivals' },
  { href: '/collections/wellness', label: 'Wellness' },
  { href: '/collections/body', label: 'Body' },
  { href: '/collections/toys', label: 'Toys' },
]

const HOUSE_LINKS = [
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const DESKTOP_UTILITY_LINKS = [
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
]

function linkClass(active, compact = false) {
  const size = compact
    ? 'text-[10px] tracking-[0.2em]'
    : 'text-[11px] tracking-[0.18em]'
  return `font-medium uppercase transition-colors duration-300 ${size} ${
    active ? 'text-theme-accent' : 'text-theme-muted hover:text-theme-text'
  }`
}

export default function SiteHeader() {
  const { cart, cartOpen, setCartOpen } = useCart()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeDrawer = () => {
    setDrawerOpen(false)
    menuButtonRef.current?.focus()
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`)

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div
          className={`w-full border-b bg-theme-bg/95 backdrop-blur-xl transition-colors duration-300 ${
            scrolled ? 'border-theme-border' : 'border-transparent md:border-theme-border'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
            <div className="flex min-w-[2.75rem] flex-1 items-center">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 min-w-11 items-center justify-center text-theme-text/90 transition-colors hover:text-theme-text"
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="site-menu"
              >
                <Menu className="h-5 w-5 stroke-[1.5] md:hidden" />
                <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] md:inline">
                  Menu
                </span>
              </button>
            </div>

            <BrandLogo size="md" />

            <div className="flex min-w-[2.75rem] flex-1 items-center justify-end gap-6 lg:gap-8">
              <nav className="hidden items-center gap-7 md:flex" aria-label="Utility">
                {DESKTOP_UTILITY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={linkClass(isActive(link.href))}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button
                type="button"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative inline-flex h-11 w-11 items-center justify-center text-theme-text/90 transition-colors hover:text-theme-text"
                aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-theme-accent px-1 text-[9px] font-semibold text-theme-bg">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <nav
          className="hidden border-b border-theme-border bg-theme-bg/95 backdrop-blur-xl md:block"
          aria-label="Collections"
        >
          <ul className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-4 overflow-x-auto px-6">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  className={linkClass(isActive(link.href), true)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="fixed inset-0 bg-black/70"
            onClick={closeDrawer}
            aria-label="Close menu"
          />
          <nav
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="relative flex h-full w-full max-w-xs flex-col border-r border-theme-border bg-theme-bg sm:max-w-sm md:max-w-md"
          >
            <div className="flex items-center justify-between border-b border-theme-border px-5 py-4 md:px-8">
              <span onClick={closeDrawer}>
                <BrandLogo size="sm" />
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="inline-flex h-11 min-w-11 items-center justify-center text-theme-muted transition-colors hover:text-theme-text"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 stroke-[1.5] md:hidden" />
                <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] md:inline">
                  Close
                </span>
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8 md:px-8 md:py-10">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                Collections
              </p>
              <ul className="flex flex-col">
                {CATEGORY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeDrawer}
                      className={`block py-2.5 font-serif text-[1.65rem] leading-none tracking-tight transition-colors md:py-3 md:text-[1.85rem] ${
                        isActive(link.href)
                          ? 'text-theme-accent'
                          : 'text-theme-text hover:text-theme-accent'
                      }`}
                      aria-current={isActive(link.href) ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/collections"
                    onClick={closeDrawer}
                    className={`mt-2 block py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      pathname === '/collections'
                        ? 'text-theme-accent'
                        : 'text-theme-muted hover:text-theme-text'
                    }`}
                    aria-current={pathname === '/collections' ? 'page' : undefined}
                  >
                    All collections
                  </Link>
                </li>
              </ul>

              <div className="mt-10 border-t border-theme-border pt-8 md:mt-12">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                  The house
                </p>
                <ul className="flex flex-col">
                  {HOUSE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeDrawer}
                        className={`block border-b border-theme-border py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                          isActive(link.href)
                            ? 'text-theme-accent'
                            : 'text-theme-text/80 hover:text-theme-text'
                        }`}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-theme-border px-5 py-8 md:px-8">
              <p className="mb-6 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-theme-muted">
                Considered pleasure.
                <br />
                For adults 18+ only.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  onClick={closeDrawer}
                  className="text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme-text/80"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  onClick={closeDrawer}
                  className="text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme-text/80"
                >
                  Terms
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
