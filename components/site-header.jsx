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
  return `font-medium uppercase transition-colors duration-200 text-[11px] tracking-[0.16em] sm:tracking-[0.18em] ${
    active ? 'text-theme-accent' : 'text-theme-muted hover:text-theme-text'
  }`
}

function stripLinkClass(active) {
  return `inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap border-b-2 px-0.5 pb-2 text-[9px] font-medium uppercase tracking-[0.12em] transition-[color,border-color] duration-150 active:text-theme-text sm:text-[10px] sm:tracking-[0.14em] md:w-auto md:justify-start md:px-0 md:pb-2.5 md:tracking-[0.18em] ${
    active
      ? 'border-theme-accent text-theme-accent'
      : 'border-transparent text-theme-muted hover:border-theme-border/50 hover:text-theme-text'
  }`
}

function drawerMainClass(active) {
  return `flex w-full items-center justify-between py-2.5 text-left text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 active:opacity-80 ${
    active ? 'text-theme-accent' : 'text-theme-text/90 hover:text-theme-text'
  }`
}

function drawerSubClass(active) {
  return `block border-l py-2 pl-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 ${
    active
      ? 'border-theme-accent text-theme-accent'
      : 'border-theme-border text-theme-muted hover:border-theme-muted hover:text-theme-text'
  }`
}

function drawerHouseClass(active) {
  return `block border-b border-theme-border py-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 ${
    active ? 'text-theme-accent' : 'text-theme-text/75 hover:text-theme-text'
  }`
}

function groupIsActive(group, isActive) {
  if (group.href && isActive(group.href)) return true
  return group.children?.some((child) => isActive(child.href)) ?? false
}

function primaryChildHref(group) {
  return group.children?.[0]?.href || '/shop'
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
                className="inline-flex h-11 min-w-11 items-center justify-center text-theme-text/90 transition-colors hover:text-theme-text active:opacity-80"
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
                className="relative inline-flex h-11 w-11 items-center justify-center text-theme-text/90 transition-colors hover:text-theme-text active:opacity-80"
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

          <nav aria-label="Collections" className="border-t border-theme-border/60">
            <div className="mx-auto max-w-7xl px-3 sm:px-6">
              <ul className="grid grid-cols-4 items-end md:flex md:items-center md:gap-7 md:py-3">
                {NAV_GROUPS.map((group) => {
                  const active = groupIsActive(group, isActive)

                  if (!group.children?.length) {
                    return (
                      <li key={group.id} className="min-w-0">
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
                    <li key={group.id} className="min-w-0 md:relative md:shrink-0 md:group">
                      <Link
                        href={primaryChildHref(group)}
                        className={`${stripLinkClass(active)} md:hidden`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {group.label}
                      </Link>

                      <div className="relative hidden md:block">
                        <button
                          type="button"
                          className={`${stripLinkClass(active)} gap-1 pr-0`}
                          aria-expanded="false"
                          aria-haspopup="true"
                        >
                          <span>{group.label}</span>
                          <ChevronDown className="h-3 w-3 shrink-0 stroke-[1.75] opacity-70 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                        </button>
                        <ul
                          className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-[11rem] border border-theme-border bg-theme-bg py-2 opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
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
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 overscroll-none">
          <button
            type="button"
            className="absolute inset-0 bg-black/75"
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
            className="relative flex h-[100dvh] max-h-[100dvh] w-[min(100%,18.75rem)] flex-col border-r border-theme-border bg-theme-bg shadow-2xl sm:w-80"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-theme-border px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <span onClick={closeDrawer} className="min-w-0">
                <BrandLogo size="sm" />
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDrawer}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-theme-muted transition-colors hover:text-theme-text active:opacity-80"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-5">
              <section aria-label="Collections">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted">
                  Collections
                </p>
                <ul className="flex flex-col">
                  {NAV_GROUPS.map((group) => {
                    const active = groupIsActive(group, isActive)
                    const open = expandedGroup === group.id

                    if (!group.children?.length) {
                      return (
                        <li key={group.id} className="border-b border-theme-border/70 last:border-b-0">
                          <Link
                            href={group.href}
                            onClick={closeDrawer}
                            className={drawerMainClass(active)}
                            aria-current={active ? 'page' : undefined}
                          >
                            {group.label}
                          </Link>
                        </li>
                      )
                    }

                    return (
                      <li key={group.id} className="border-b border-theme-border/70 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.id)}
                          className={drawerMainClass(active)}
                          aria-expanded={open}
                        >
                          <span>{group.label}</span>
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 stroke-[1.75] text-theme-muted transition-transform duration-200 ${
                              open ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <ul className="mb-2 ml-0.5 space-y-0.5 border-t border-theme-border/60 pt-2">
                              {group.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={closeDrawer}
                                    className={drawerSubClass(isActive(child.href))}
                                    aria-current={isActive(child.href) ? 'page' : undefined}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section aria-label="The house" className="mt-6 border-t border-theme-border pt-5">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted">
                  The house
                </p>
                <ul>
                  {HOUSE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeDrawer}
                        className={drawerHouseClass(isActive(link.href))}
                        aria-current={isActive(link.href) ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              <footer className="mt-auto border-t border-theme-border pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <p className="text-[10px] uppercase leading-relaxed tracking-[0.14em] text-theme-muted">
                  Considered pleasure.
                  <br />
                  For adults 18+ only.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  <Link
                    href="/privacy"
                    onClick={closeDrawer}
                    className="inline-flex min-h-10 items-center text-[10px] uppercase tracking-[0.14em] text-theme-muted transition-colors hover:text-theme-text active:text-theme-text"
                  >
                    Privacy
                  </Link>
                  <Link
                    href="/terms"
                    onClick={closeDrawer}
                    className="inline-flex min-h-10 items-center text-[10px] uppercase tracking-[0.14em] text-theme-muted transition-colors hover:text-theme-text active:text-theme-text"
                  >
                    Terms
                  </Link>
                </div>
              </footer>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
