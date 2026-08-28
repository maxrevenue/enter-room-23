'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useDialogLock } from '@/lib/use-dialog-lock'
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react'
import BrandLogo from '@/components/brand-logo'
import { resolveStoreNavGroups } from '@/lib/categories'

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

const NAV_GROUPS = resolveStoreNavGroups()

function linkClass(active) {
  return `font-medium uppercase transition-colors duration-300 text-[11px] tracking-[0.16em] sm:tracking-[0.18em] ${
    active ? 'text-theme-accent' : 'text-theme-muted hover:text-theme-text'
  }`
}

function stripLinkClass(active) {
  return `inline-flex min-h-11 items-center whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-200 sm:tracking-[0.18em] ${
    active ? 'text-theme-accent' : 'text-theme-muted hover:text-theme-text'
  }`
}

function groupIsActive(group, isActive) {
  if (group.href && isActive(group.href)) return true
  return group.children?.some((child) => isActive(child.href)) ?? false
}

export default function SiteHeader() {
  const { cart, cartOpen, setCartOpen, setMenuOpen } = useCart()
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState(null)
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const drawerRef = useRef(null)
  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setExpandedGroup(null)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setExpandedGroup(null)
  }, [pathname])

  useEffect(() => {
    setMenuOpen(drawerOpen)
    return () => setMenuOpen(false)
  }, [drawerOpen, setMenuOpen])

  useDialogLock({
    open: drawerOpen,
    onClose: closeDrawer,
    containerRef: drawerRef,
    initialFocusRef: closeButtonRef,
  })

  const isActive = (href) => pathname === href || pathname?.startsWith(`${href}/`)

  const toggleGroup = (groupId) => {
    setExpandedGroup((current) => (current === groupId ? null : groupId))
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full pt-[env(safe-area-inset-top)]">
        <div
          className={`w-full bg-theme-bg/95 backdrop-blur-xl transition-colors duration-300 ${
            scrolled ? 'border-b border-theme-border' : 'border-b border-transparent md:border-theme-border'
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

          <nav
            aria-label="Collections"
            className="border-t border-theme-border/60"
          >
            <div className="mx-auto max-w-7xl overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-6 [&::-webkit-scrollbar]:hidden">
              <ul className="flex w-max min-w-full items-center gap-5 py-2.5 sm:gap-7 sm:py-3">
                {NAV_GROUPS.map((group) => {
                  const active = groupIsActive(group, isActive)

                  if (!group.children?.length) {
                    return (
                      <li key={group.id} className="shrink-0">
                        <Link
                          href={group.href}
                          className={stripLinkClass(active)}
                          aria-current={active ? 'page' : undefined}
                        >
                          {group.label}
                        </Link>
                      </li>
                    )
                  }

                  return (
                    <li key={group.id} className="group relative shrink-0">
                      <button
                        type="button"
                        className={`${stripLinkClass(active)} gap-1`}
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        {group.label}
                        <ChevronDown className="h-3 w-3 stroke-[1.75] transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                      </button>
                      <ul
                        className="invisible absolute left-0 top-full z-50 min-w-[11rem] border border-theme-border bg-theme-bg py-2 opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                        role="menu"
                      >
                        {group.children.map((child) => (
                          <li key={child.href} role="none">
                            <Link
                              href={child.href}
                              role="menuitem"
                              className={`block px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 hover:bg-theme-surface hover:text-theme-text sm:tracking-[0.16em] ${
                                isActive(child.href) ? 'text-theme-accent' : 'text-theme-muted'
                              }`}
                              aria-current={isActive(child.href) ? 'page' : undefined}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>
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
            ref={drawerRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            className="relative flex h-full w-full max-w-xs flex-col border-r border-theme-border bg-theme-bg pt-[env(safe-area-inset-top)] sm:max-w-sm md:max-w-md"
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
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
                Collections
              </p>
              <ul className="flex flex-col">
                {NAV_GROUPS.map((group) => {
                  const active = groupIsActive(group, isActive)
                  const open = expandedGroup === group.id

                  if (!group.children?.length) {
                    return (
                      <li key={group.id}>
                        <Link
                          href={group.href}
                          onClick={closeDrawer}
                          className={`block py-2.5 font-serif text-[1.65rem] leading-none tracking-tight transition-colors md:py-3 md:text-[1.85rem] ${
                            active ? 'text-theme-accent' : 'text-theme-text hover:text-theme-accent'
                          }`}
                          aria-current={active ? 'page' : undefined}
                        >
                          {group.label}
                        </Link>
                      </li>
                    )
                  }

                  return (
                    <li key={group.id} className="border-b border-theme-border/60 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className={`flex w-full items-center justify-between py-2.5 text-left font-serif text-[1.65rem] leading-none tracking-tight transition-colors md:py-3 md:text-[1.85rem] ${
                          active ? 'text-theme-accent' : 'text-theme-text hover:text-theme-accent'
                        }`}
                        aria-expanded={open}
                      >
                        {group.label}
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 stroke-[1.75] transition-transform duration-200 ${
                            open ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {open ? (
                        <ul className="mb-3 ml-1 flex flex-col gap-1 border-l border-theme-border pl-4">
                          {group.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={closeDrawer}
                                className={`block py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors ${
                                  isActive(child.href)
                                    ? 'text-theme-accent'
                                    : 'text-theme-muted hover:text-theme-text'
                                }`}
                                aria-current={isActive(child.href) ? 'page' : undefined}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  )
                })}
              </ul>

              <div className="mt-10 border-t border-theme-border pt-8 md:mt-12">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
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

            <div className="border-t border-theme-border px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8">
              <p className="text-[10px] uppercase leading-relaxed tracking-[0.16em] text-theme-muted sm:tracking-[0.2em]">
                Considered pleasure.
                <br />
                For adults 18+ only.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                <Link
                  href="/privacy"
                  onClick={closeDrawer}
                  className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme-text/80"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  onClick={closeDrawer}
                  className="inline-flex min-h-11 items-center text-[10px] uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme-text/80"
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
