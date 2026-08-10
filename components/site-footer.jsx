'use client'

import Link from 'next/link'
import { Instagram, Twitter, Facebook } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer
      className="border-t py-16 sm:py-24 px-4 sm:px-6"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="mx-auto max-w-4xl flex flex-col items-center justify-center">
        
        {/* ── Minimalist Social Icons ── */}
        <div className="flex items-center gap-6 mb-12">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            aria-label="X / Twitter"
          >
            <Twitter className="w-5 h-5 stroke-[1.5]" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 stroke-[1.5]" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 stroke-[1.5]" />
          </a>
        </div>

        {/* ── Uppercase Links ── */}
        <div className="flex items-center gap-8 md:gap-12 mb-16">
          <Link 
            href="/shop"
            className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            SHOP
          </Link>
          <Link 
            href="/faq"
            className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            FAQ
          </Link>
          <Link 
            href="/contact"
            className="text-xs tracking-[0.2em] uppercase font-semibold transition-colors duration-200"
            style={{ color: 'var(--color-text-secondary)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            CONTACT
          </Link>
        </div>

        {/* ── Sub-Footer / Legal ── */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center text-[10px] tracking-widest uppercase">
          <span style={{ color: 'var(--color-text-muted)' }}>&copy; {new Date().getFullYear()} ROOM 23</span>
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy" 
              className="transition-colors duration-200" 
              style={{ color: 'var(--color-text-muted)' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              PRIVACY
            </Link>
            <Link 
              href="/terms" 
              className="transition-colors duration-200" 
              style={{ color: 'var(--color-text-muted)' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              TERMS
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
