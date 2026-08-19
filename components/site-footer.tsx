import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { STORE_CATEGORIES } from '@/lib/categories'
import { SITE_CONFIG } from '@/lib/constants'

const FOOTER_NAV = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections/lubes', label: 'Lubes' },
  { href: '/collections/strokers', label: 'Strokers' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/shipping', label: 'Shipping & Returns' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-theme-border bg-theme-bg text-theme-text">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <BrandLogo size="md" />
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-theme-muted">
              Considered pleasure and body-safe wellness. Formulated with precision, 
              packaged with restraint, and delivered in plain, unbranded packaging.
            </p>
            <div className="mt-8 space-y-1.5 text-xs text-theme-muted">
              <p className="font-medium text-theme-text">{SITE_CONFIG.legalEntity}</p>
              <p>{SITE_CONFIG.address.full}</p>
              <p>{SITE_CONFIG.phone}</p>
              <p>{SITE_CONFIG.email}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                  Navigation
                </p>
                <ul className="mt-4 space-y-2.5">
                  {FOOTER_NAV.slice(0, 4).map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xs text-theme-muted transition-colors hover:text-theme-text"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                  Categories
                </p>
                <ul className="mt-4 space-y-2.5">
                  {STORE_CATEGORIES.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/collections/${item.id}`}
                        className="text-xs text-theme-muted transition-colors hover:text-theme-text"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                  Information
                </p>
                <ul className="mt-4 space-y-2.5">
                  {FOOTER_NAV.slice(4).map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-xs text-theme-muted transition-colors hover:text-theme-text"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-theme-border pt-8 text-xs text-theme-muted">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {SITE_CONFIG.legalEntity}. All rights reserved. 18+ only.
            </p>
            <p className="text-[11px]">
              Charges will appear on your card statement as:{' '}
              <span className="font-semibold text-theme-text">{SITE_CONFIG.billingDescriptor}</span>
            </p>
          </div>
          <p className="mt-4 text-[10px] leading-relaxed text-theme-muted/80">
            Secure checkout processed by CCBill. Payment details are handled by our PCI-compliant payment processor.
          </p>
        </div>
      </div>
    </footer>
  )
}
