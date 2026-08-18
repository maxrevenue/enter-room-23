'use client'

import { useState } from 'react'
import { Mail, ArrowRight, Check } from 'lucide-react'
import { track } from '@/lib/analytics-client'

export default function JournalSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      track('newsletter_signup', { email: email.trim() })
      setSubmitted(true)
      setLoading(false)
    }, 600)
  }

  return (
    <section
      id="journal-notes"
      className="relative overflow-hidden px-4 py-16 sm:py-24"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      aria-labelledby="notes-heading"
    >
      <div className="relative z-10 mx-auto max-w-lg text-center">
        <h2
          id="notes-heading"
          className="mb-4 font-syne text-2xl font-bold uppercase tracking-tight sm:text-3xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Notes from Room 23
        </h2>

        <p
          className="mb-8 text-sm leading-relaxed sm:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          New pieces and journal essays, when we have something worth sending.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            aria-label="Email signup"
          >
            <label htmlFor="notes-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
                aria-hidden="true"
              />
              <input
                id="notes-email"
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
              className="inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap bg-primary px-6 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90"
              style={{ opacity: loading ? 0.7 : 1 }}
              aria-label="Subscribe to notes from Room 23"
            >
              {loading ? 'Sending...' : (
                <>
                  Subscribe <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div
            className="rounded-xl px-6 py-5 text-sm"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
            }}
            role="status"
            aria-live="polite"
          >
            <div
              className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <Check size={18} style={{ color: 'var(--text-primary)' }} />
            </div>
            <p className="mb-1 font-syne font-semibold" style={{ color: 'var(--text-primary)' }}>
              You&rsquo;re on the list.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              We&rsquo;ll write when there is something worth sending.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
