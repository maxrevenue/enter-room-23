'use client'

import Link from 'next/link'
import BrandLogo from '@/components/brand-logo'
import { SITE_CONFIG } from '@/config/site'

const NAV = [
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Shop' },
  { href: '/shipping', label: 'Shipping & Returns' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteFooter() {
  return (
    <footer
      className="border-t py-16 sm:py-24 px-4 sm:px-6"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'rgba(200,16,46,0.15)',
      }}
    >
      <div className="mx-auto max-w-4xl flex flex-col items-center justify-center">
        <div className="mb-8">
          <BrandLogo size="lg" />
        </div>

        <p
          className="text-xs tracking-[0.2em] uppercase mb-8 text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Considered pleasure. Private delivery.
        </p>

        <div
          className="w-24 h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
        />

        <p
          className="text-[11px] tracking-[0.08em] uppercase mb-10 text-center max-w-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Questions? {SITE_CONFIG.supportEmail} · {SITE_CONFIG.supportPhone}
        </p>

        <div className="flex items-center flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] uppercase tracking-[0.15em] text-center mb-3" style={{ color: '#3A3A3C' }}>
          {SITE_CONFIG.legalName} · {SITE_CONFIG.bizAddressFull}
        </p>
        <p className="text-[10px] uppercase tracking-[0.15em] text-center" style={{ color: '#3A3A3C' }}>
          Statement descriptor {SITE_CONFIG.billingDescriptor} · © {new Date().getFullYear()} {SITE_CONFIG.legalName}
        </p>
      </div>
    </footer>
  )
}
