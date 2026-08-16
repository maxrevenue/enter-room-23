'use client'

import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { SITE_CONFIG } from '@/config/site'

const PRIMARY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/shipping', label: 'Shipping & Returns' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <div className="mb-8">
          <BrandLogo size="lg" />
        </div>

        <p className="mb-8 text-xs uppercase tracking-[0.2em] text-zinc-500">
          Considered pleasure. Private delivery.
        </p>

        <p className="mb-10 max-w-sm text-[11px] leading-relaxed text-zinc-500">
          {SITE_CONFIG.legalName}
          <br />
          {SITE_CONFIG.bizAddressFull}
          <br />
          {SITE_CONFIG.supportPhone} · {SITE_CONFIG.supportEmail}
          <br />
          {SITE_CONFIG.hours}
        </p>

        <nav
          aria-label="Footer"
          className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {PRIMARY_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. Adults 18+ only. Charges appear as{' '}
          {SITE_CONFIG.billingDescriptor}.
        </p>
      </div>
    </footer>
  )
}
