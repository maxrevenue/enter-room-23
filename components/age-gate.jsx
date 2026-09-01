'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { siteConfig } from '@/lib/config'

const BOT_RE =
  /bot|crawler|spider|crawling|googlebot|bingbot|slurp|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i

export default function AgeGate({ initiallyVerified = false }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  const isBot =
    typeof navigator !== 'undefined' && BOT_RE.test(navigator.userAgent)

  if (isBot) return null

  return <AgeGateHuman initiallyVerified={initiallyVerified} />
}

function AgeGateHuman({ initiallyVerified }) {
  const [verified, setVerified] = useState(initiallyVerified)
  const titleId = useId()
  const bodyId = useId()
  const primaryRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    if (verified) return
    const cookieVerified =
      Cookies.get('room23_age_verified') || Cookies.get('age_verified')
    if (cookieVerified) setVerified(true)
  }, [verified])

  useEffect(() => {
    if (verified) return
    primaryRef.current?.focus()
  }, [verified])

  useEffect(() => {
    if (verified) return
    const root = rootRef.current
    if (!root) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = root.querySelectorAll('button:not([disabled]), a[href]')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [verified])

  const handleVerify = () => {
    const cookieOpts = {
      expires: siteConfig.ageCookieDurationDays,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
    Cookies.set('room23_age_verified', 'true', cookieOpts)
    Cookies.set('age_verified', 'true', cookieOpts)
    setVerified(true)
    try {
      window.dispatchEvent(new Event('room23-age-verified'))
    } catch {
      /* ignore */
    }
  }

  if (verified) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
    >
      <div className="w-full max-w-md border border-theme-border bg-theme-surface p-8 text-left shadow-2xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted">
          For adults
        </p>
        <h2
          id={titleId}
          className="mt-4 font-serif text-[1.75rem] font-light leading-snug tracking-tight text-theme-text"
        >
          This collection is for people 18 and over.
        </h2>
        <p id={bodyId} className="mt-4 text-sm leading-relaxed text-theme-muted">
          Entering confirms you meet the age requirement where you live. Nothing
          is collected here. A cookie remembers for 30 days.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            ref={primaryRef}
            type="button"
            onClick={handleVerify}
            aria-label="Enter the site if you are 18 or older"
            className="inline-flex min-h-12 w-full items-center justify-center bg-[#b91c1c] px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-100 transition-colors hover:bg-[#b91c1c]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
          >
            Enter
          </button>
          <a
            href="https://www.google.com"
            aria-label="Leave the site if you are under 18"
            className="inline-flex min-h-12 w-full items-center justify-center border border-theme-border px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-theme-muted transition-colors hover:text-theme-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
          >
            I’m under 18
          </a>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-theme-muted">
          Your visit stays confidential. No tracking.
        </p>
      </div>
    </div>
  )
}
