'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

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

        {/* Logo */}
        <Link href="/" className="mb-8 focus:outline-none group" aria-label="Room 23 Home">
          <img
            src="/logo.jpg"
            alt="Room 23"
            className="h-20 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            style={{ filter: 'drop-shadow(0 4px 16px rgba(200,16,46,0.2))' }}
          />
        </Link>

        {/* Tagline */}
        <p
          className="text-xs tracking-[0.2em] uppercase mb-8 text-center"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Private. Curated. For discerning adults only.
        </p>

        {/* Crimson divider */}
        <div
          className="w-24 h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
        />

        {/* ── Social Icons ── */}
        <div className="flex items-center gap-6 mb-10">
          {[
            { href: 'https://twitter.com', Icon: Twitter, label: 'X / Twitter' },
            { href: 'https://facebook.com', Icon: Facebook, label: 'Facebook' },
            { href: 'https://instagram.com', Icon: Instagram, label: 'Instagram' },
          ].map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full transition-all duration-300"
              style={{ color: 'var(--color-text-muted)', border: '1px solid #26262A' }}
              onMouseOver={e => { e.currentTarget.style.color = '#C8102E'; e.currentTarget.style.borderColor = 'rgba(200,16,46,0.4)' }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = '#26262A' }}
              aria-label={label}
            >
              <Icon className="w-4 h-4 stroke-[1.5]" />
            </a>
          ))}
        </div>

        {/* ── Nav Links ── */}
        <div className="flex items-center flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {[
            { href: '/shop', label: 'SHOP' },
            { href: '/collections/vault', label: 'THE VAULT' },
            { href: '/journal', label: 'JOURNAL' },
            { href: '/faq', label: 'FAQ' },
            { href: '/contact', label: 'CONTACT' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
              style={{ color: 'var(--color-text-secondary)' }}
              onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── Legal strip ── */}
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 text-center">
          <span style={{ color: '#3A3A3C', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            &copy; {new Date().getFullYear()} Room 23. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {[
              { href: '/privacy', label: 'PRIVACY' },
              { href: '/terms', label: 'TERMS' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors duration-200"
                style={{ color: '#3A3A3C', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                onMouseOver={e => e.currentTarget.style.color = '#C8102E'}
                onMouseOut={e => e.currentTarget.style.color = '#3A3A3C'}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
