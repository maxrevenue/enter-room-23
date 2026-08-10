'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight, Check, Sparkles } from 'lucide-react'
import { track } from '@/lib/analytics-client'

const SPOTS_REMAINING = 47

export default function VipWaitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    // Simulate slight delay for feel
    setTimeout(() => {
      track('vip_signup', { email: email.trim() })
      setSubmitted(true)
      setLoading(false)
    }, 600)
  }

  return (
    <section
      className="relative px-4 py-16 sm:py-24 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      aria-labelledby="vip-heading"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 left-1/2 w-[80%] h-[60%] -translate-x-1/2"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(212,168,83,0.05) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)',
          }}
        />
      </div>

      <div className="mx-auto max-w-lg text-center relative z-10">
        {/* Lock icon with glow */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-6 border animate-brass-ring"
          style={{
            borderColor: 'rgba(212,168,83,0.3)',
            backgroundColor: 'var(--bg-elevated)',
          }}
          aria-hidden="true"
        >
          <Lock
            className="w-6 h-6"
            style={{ color: 'var(--color-brass)' }}
          />
        </div>

        {/* Urgency pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5"
          style={{
            backgroundColor: 'rgba(212,168,83,0.08)',
            border: '1px solid rgba(212,168,83,0.15)',
          }}
        >
          <Sparkles size={10} style={{ color: 'var(--color-brass)' }} />
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-brass)',
            }}
          >
            {SPOTS_REMAINING} spots remaining
          </span>
        </div>

        <h2
          id="vip-heading"
          className="font-syne text-2xl sm:text-3xl font-bold tracking-tight uppercase mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          Join the Inner Circle
        </h2>

        <p
          className="text-sm sm:text-base leading-relaxed mb-8"
          style={{ color: 'var(--text-secondary)' }}
        >
          Priority access to new collections, private releases, and members-only
          pricing — before anyone else sees the door open.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            aria-label="VIP waitlist signup"
          >
            <label htmlFor="vip-email" className="sr-only">
              Email address for VIP waitlist
            </label>
            <div className="flex-1 relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
                aria-hidden="true"
              />
              <input
                id="vip-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="input-field w-full pl-10"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  fontSize: 'var(--text-sm)',
                }}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-brass inline-flex items-center justify-center gap-2 whitespace-nowrap"
              style={{ padding: '0.75rem 1.5rem', fontSize: 'var(--text-sm)', opacity: loading ? 0.7 : 1 }}
              aria-label="Submit email to join VIP waitlist"
            >
              {loading ? (
                <>
                  <span
                    className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin"
                    style={{ display: 'inline-block' }}
                  />
                  Joining...
                </>
              ) : (
                <>
                  Subscribe <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div
            className="px-6 py-5 rounded-xl text-sm animate-fade-in-up"
            style={{
              backgroundColor: 'rgba(212,168,83,0.08)',
              border: '1px solid rgba(212,168,83,0.25)',
            }}
            role="status"
            aria-live="polite"
          >
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-3"
              style={{ backgroundColor: 'rgba(212,168,83,0.15)' }}
            >
              <Check size={18} style={{ color: 'var(--color-brass)' }} />
            </div>
            <p
              className="font-syne font-semibold mb-1"
              style={{ color: 'var(--color-brass)' }}
            >
              You&rsquo;re on the list.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              We&rsquo;ll reach out when a spot opens up. Keep it private.
            </p>
          </div>
        )}

        {/* Privacy note */}
        <p
          className="mt-4 text-xs"
          style={{ color: 'var(--text-muted)', opacity: 0.7 }}
        >
          No spam. Unsubscribe any time. 18+ adults only.
        </p>
      </div>
    </section>
  )
}
