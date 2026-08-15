'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { siteConfig } from '@/lib/config'

const SOLID_BLACK = '#09090b'

export default function AgeGate() {
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
    // Middleware reads age_verified; the overlay also keeps room23_age_verified.
    Cookies.set('room23_age_verified', 'true', cookieOpts)
    Cookies.set('age_verified', 'true', cookieOpts)
    setStatus('verified')
  }

  if (status === 'loading') {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-zinc-950"
        style={{ backgroundColor: SOLID_BLACK }}
      />
    )
  }

  if (status === 'verified') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950"
      style={{ backgroundColor: SOLID_BLACK }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-gate-title"
        aria-describedby="age-gate-body"
        className="w-full max-w-md mx-4 border border-zinc-800 bg-zinc-900 p-8 text-center shadow-2xl"
        style={{ backgroundColor: '#18181b' }}
      >
        <h1
          id="age-gate-title"
          className="text-2xl font-serif tracking-[0.25em] text-white mb-2"
        >
          ROOM 23
        </h1>
        <h2 className="text-xs font-semibold tracking-[0.2em] text-red-600 mb-5">
          AGE VERIFICATION REQUIRED
        </h2>
        <p
          id="age-gate-body"
          className="text-zinc-300 text-sm leading-relaxed mb-8"
        >
          This site contains adult wellness products and content for{' '}
          <strong className="text-white font-medium">adults 18+</strong> only.
          By entering, you affirm you meet the minimum age requirement in your jurisdiction.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={handleVerify}
            aria-label="Confirm I am 18 or older and enter the site"
            className="w-full py-3.5 bg-red-800 hover:bg-red-700 text-white text-sm font-medium tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            I AM 18+ — ENTER
          </button>
          <a
            href="https://www.google.com"
            aria-label="Exit the site if under 18"
            className="w-full py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            I AM UNDER 18 — EXIT
          </a>
        </div>

        <p className="text-xs text-zinc-500">
          Your visit is private — no tracking, no judgment.
        </p>
      </div>
    </div>
  )
}
