'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import { siteConfig } from '@/lib/config'
import { useCart } from '@/lib/cart-context'
import { useDialogLock } from '@/lib/use-dialog-lock'
import { X } from 'lucide-react'

const SESSION_KEY = 'room23_newsletter_dismissed'
const COOKIE_SEEN = 'room23_newsletter_seen'
const COOKIE_SUBSCRIBED = 'room23_subscribed'
const DELAY_MS = 10000

function hasDismissed() {
  try {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      return true
    }
  } catch {
    /* ignore */
  }
  return Boolean(Cookies.get(COOKIE_SEEN) || Cookies.get(COOKIE_SUBSCRIBED))
}

function persistDismiss(days = 1) {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    /* ignore */
  }
  Cookies.set(COOKIE_SEEN, 'true', { expires: days, path: '/' })
}

function isAgeVerified() {
  return Boolean(Cookies.get('room23_age_verified') || Cookies.get('age_verified'))
}

export default function DiscreetNewsletter() {
  const pathname = usePathname()
  const { cartOpen, menuOpen } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [email, setEmail] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const isAdmin = Boolean(pathname?.startsWith('/admin'))
  const overlayOpen = cartOpen || menuOpen
  const sheetOpen = isVisible && !overlayOpen && !isAdmin

  const handleDismiss = useCallback(() => {
    persistDismiss(1)
    setIsVisible(false)
  }, [])

  useDialogLock({
    open: sheetOpen,
    onClose: handleDismiss,
    containerRef: dialogRef,
    initialFocusRef: closeRef,
  })

  useEffect(() => {
    if (isAdmin) return

    let timer: ReturnType<typeof setTimeout> | undefined

    const schedule = () => {
      if (hasDismissed() || !isAgeVerified()) return
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (hasDismissed() || !isAgeVerified()) return
        setIsVisible(true)
      }, DELAY_MS)
    }

    schedule()
    window.addEventListener('room23-age-verified', schedule)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('room23-age-verified', schedule)
    }
  }, [pathname, isAdmin])

  if (isAdmin || !sheetOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        throw new Error('Subscription failed')
      }

      persistDismiss(365)
      Cookies.set(COOKIE_SUBSCRIBED, 'true', { expires: 365, path: '/' })
      setStatus('success')
      setTimeout(() => setIsVisible(false), 4000)
    } catch (error) {
      console.error('Subscription failed', error)
      setStatus('idle')
    }
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-title"
      tabIndex={-1}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-theme-border bg-theme-surface p-6 pt-12 shadow-2xl md:inset-x-auto md:bottom-4 md:right-4 md:w-[380px] md:border md:pt-6"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={handleDismiss}
        aria-label="Close newsletter popup"
        className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center text-theme-muted hover:text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-muted"
      >
        <X className="h-4 w-4" />
      </button>

      {status === 'success' ? (
        <div className="py-4 text-center">
          <h3 id="newsletter-title" className="mb-2 font-serif text-lg text-theme-text">
            Check Your Inbox
          </h3>
          <p className="text-sm text-theme-muted">
            Your {siteConfig.discountPercentage}% off code is on the way. Welcome to Room 23.
          </p>
        </div>
      ) : (
        <>
          <h3 id="newsletter-title" className="mb-2 font-serif text-lg text-theme-text">
            Notes from Room 23
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-theme-muted">
            Join the list for {siteConfig.discountPercentage}% off your first order. Occasional notes. No
            noise.
          </p>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'submitting'}
              className="w-full border border-theme-border bg-theme-bg px-4 py-2.5 text-sm text-theme-text focus:border-theme-accent focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full bg-theme-accent py-2.5 text-sm font-medium tracking-wide text-theme-bg transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-theme-accent focus:ring-offset-2 focus:ring-offset-theme-surface disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending…' : 'Join the list'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
