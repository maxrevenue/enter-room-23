'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Menu, X, ShoppingBag } from 'lucide-react'
import BrandLogo from '@/components/brand-logo'

const TOP_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const MENU_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/shipping', label: 'Shipping' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const { cart, cartOpen, setCartOpen } = useCart()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeDrawer = () => setDrawerOpen(false)

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
          className={`w-full border-b bg-zinc-950/95 backdrop-blur-xl transition-colors duration-300 ${
            scrolled ? 'border-zinc-800' : 'border-transparent'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:px-6">
            <div className="flex min-w-[2.75rem] flex-1 items-center">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center text-zinc-200 transition-colors hover:text-white md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 stroke-[1.5]" />
              </button>
              <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
                {TOP_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                      isActive(link.href) ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <BrandLogo size="md" />

            <div className="flex min-w-[2.75rem] flex-1 items-center justify-end">
              <button
                type="button"
                onClick={() => setCartOpen(!cartOpen)}
                className="relative inline-flex h-11 w-11 items-center justify-center text-zinc-200 transition-colors hover:text-white"
                aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
              >
                <ShoppingBag className="h-5 w-5 stroke-[1.5]" />
                {itemCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-100 px-1 text-[9px] font-semibold text-zinc-950">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <nav
            className="relative flex h-full w-full max-w-xs flex-col border-r border-zinc-800 bg-zinc-950"
            aria-label="Mobile"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <span onClick={closeDrawer}>
                <BrandLogo size="sm" />
              </span>
              <button
                type="button"
                onClick={closeDrawer}
                className="inline-flex h-11 w-11 items-center justify-center text-zinc-400 transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex flex-col px-5 py-6">
              {MENU_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeDrawer}
                  className={`border-b border-zinc-900 py-3.5 text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                    isActive(link.href) ? 'text-white' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-zinc-800 px-5 py-8">
              <p className="mb-6 text-[10px] uppercase leading-relaxed tracking-[0.2em] text-zinc-500">
                Considered pleasure.
                <br />
                For adults 18+ only.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/privacy"
                  onClick={closeDrawer}
                  className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  onClick={closeDrawer}
                  className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-zinc-300"
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
