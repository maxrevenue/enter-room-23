'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { siteConfig } from '@/lib/config'

export default function AgeGate() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  const isBot =
    typeof navigator !== 'undefined' &&
    /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i.test(
      navigator.userAgent,
    )

  if (isBot) return null

  return <AgeGateHuman />
}

function AgeGateHuman() {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const verified = Cookies.get('room23_age_verified') || Cookies.get('age_verified')
    setStatus(verified ? 'verified' : 'unverified')
  }, [])

  const handleVerify = () => {
    const cookieOpts = {
      expires: siteConfig.ageCookieDurationDays,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
    Cookies.set('room23_age_verified', 'true', cookieOpts)
    Cookies.set('age_verified', 'true', cookieOpts)
    setStatus('verified')
    try {
      window.dispatchEvent(new Event('room23-age-verified'))
    } catch {
      /* ignore */
    }
  }

  if (status === 'loading') {
    return <div className="fixed inset-0 z-[9999] bg-theme-bg" />
  }

  if (status === 'verified') return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-theme-bg">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-body"
        className="mx-4 w-full max-w-md border border-theme-border bg-theme-surface p-8 text-center shadow-2xl"
      >
        <p
          id="age-gate-title"
          className="mb-2 font-serif text-2xl tracking-[0.12em] text-theme-text sm:tracking-[0.2em]"
        >
          ROOM 23
        </p>
        <h2 className="mb-5 text-xs font-semibold tracking-[0.16em] text-theme-accent sm:tracking-[0.2em]">
          AGE VERIFICATION REQUIRED
        </h2>
        <p
          id="age-gate-body"
          className="mb-8 text-sm leading-relaxed text-theme-text/80"
        >
          This site contains adult wellness products and content for{' '}
          <strong className="font-medium text-theme-text">adults 18+</strong> only.
          By entering, you affirm you meet the minimum age requirement in your jurisdiction.
        </p>

        <div className="mb-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleVerify}
            aria-label="Confirm I am 18 or older and enter the site"
            className="w-full bg-theme-accent py-3.5 text-sm font-medium uppercase tracking-widest text-theme-bg transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-surface"
          >
            I AM 18+ — ENTER
          </button>
          <a
            href="https://www.google.com"
            aria-label="Exit the site if under 18"
            className="w-full border border-theme-border py-3 text-xs font-semibold uppercase tracking-widest text-theme-muted transition-colors hover:border-theme-muted hover:text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-muted focus:ring-offset-2 focus:ring-offset-theme-surface"
          >
            I AM UNDER 18 — EXIT
          </a>
        </div>

        <p className="text-xs text-theme-muted">
          Your visit stays confidential — no tracking, no judgment.
        </p>
      </div>
    </div>
  )
}
