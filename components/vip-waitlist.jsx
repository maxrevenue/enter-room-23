'use client'

import { useState } from 'react'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { track } from '@/lib/analytics-client'

export default function VipWaitlist() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    track('vip_signup', { email: email.trim() })
    setSubmitted(true)
  }

  return (
    <section
      className="relative px-4 py-14 sm:py-20 overflow-hidden"
      style={{ backgroundColor: 'var(--bne-espresso-surface, var(--bg-surface))' }}
      aria-labelledby="vip-heading"
    >
      {/* Subtle brass glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute bottom-0 left-1/2 w-[70%] h-[40%] -translate-x-1/2 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, var(--bne-brass, #c8a34e) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-lg text-center relative z-10">
        {/* Lock icon */}
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-6 border"
          style={{
            borderColor: 'var(--bne-brass, var(--accent))',
            backgroundColor: 'var(--bg-elevated, var(--bg-base))',
          }}
          aria-hidden="true"
        >
          <Lock
            className="w-6 h-6"
            style={{ color: 'var(--bne-brass, var(--accent))' }}
          />
        </div>

        <h2
          id="vip-heading"
          className="font-syne text-2xl sm:text-3xl font-bold tracking-[0.08em] uppercase mb-4"
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
                  padding: '0.75rem 1rem',
                  fontSize: 'var(--text-sm)',
                }}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold tracking-[0.08em] uppercase transition-all duration-300 hover:gap-3 whitespace-nowrap"
              style={{
                backgroundColor: 'var(--bne-brass, var(--accent))',
                color: 'var(--bne-espresso, #14100d)',
              }}
              aria-label="Submit email to join VIP waitlist"
            >
              Subscribe <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          <div
            className="px-6 py-4 rounded-md text-sm animate-fade-in-up"
            style={{
              backgroundColor: 'var(--bne-brass-glow, rgba(200,163,78,0.1))',
              border: '1px solid var(--bne-brass, var(--accent))',
              color: 'var(--bne-brass, var(--accent))',
            }}
            role="status"
            aria-live="polite"
          >
            You&rsquo;re on the list. We&rsquo;ll be in touch.
          </div>
        )}
      </div>
    </section>
  )
}
