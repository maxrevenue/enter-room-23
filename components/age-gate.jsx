'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'

export default function AgeGate() {
  const { confirmAge, declineAge } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Subtle ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,83,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Modal Card */}
      <div
        className={`
          relative w-full max-w-lg mx-auto
          transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'}
        `}
      >
        {/* Card Body */}
        <div
          className="rounded-2xl p-8 sm:p-10 text-center"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 0 60px rgba(200,16,46,0.06), 0 0 120px rgba(212,168,83,0.04)',
          }}
        >
          {/* ── Brand Mark ── */}
          <div className="mb-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
              style={{
                backgroundColor: 'rgba(200,16,46,0.08)',
                border: '1px solid var(--color-border-accent)',
              }}
            >
              <span
                className="text-3xl tracking-widest select-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: 'var(--color-brass)',
                }}
              >
                R23
              </span>
            </div>

            <h2
              className="text-2xl sm:text-3xl mb-2 tracking-widest select-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.15em',
              }}
            >
              ROOM 23
            </h2>

            <div
              className="w-16 h-px mx-auto"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
            />
          </div>

          {/* ── Age Notice ── */}
          <div className="mb-8 space-y-3">
            <h3
              className="text-lg sm:text-xl tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              AGE VERIFICATION REQUIRED
            </h3>

            <p
              className="text-sm leading-relaxed max-w-sm mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              This website contains adult-oriented products and content.
              You must be at least <strong style={{ color: 'var(--color-text-primary)' }}>18 years of age</strong> (or
              the legal age of majority in your jurisdiction) to enter.
            </p>

            <p
              className="text-xs max-w-sm mx-auto"
              style={{ color: 'var(--color-text-muted)' }}
            >
              By clicking &ldquo;ENTER&rdquo; below, you affirm under penalty of
              law that you meet the minimum age requirement.
            </p>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {/* ENTER — Primary CTA */}
            <button
              onClick={confirmAge}
              className="btn-primary w-full sm:w-auto min-w-[200px] py-3 text-sm relative overflow-hidden group"
              type="button"
            >
              <span className="relative z-10">I AM 18 OR OLDER — ENTER</span>
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,16,46,0.4), rgba(212,168,83,0.2))',
                }}
              />
            </button>

            {/* EXIT — Secondary */}
            <button
              onClick={declineAge}
              className="btn-secondary w-full sm:w-auto min-w-[180px] py-3 text-sm"
              type="button"
            >
              I AM UNDER 18 — EXIT
            </button>
          </div>

          {/* ── Legal Disclaimer ── */}
          <div
            className="text-xs space-y-1 max-w-sm mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p>
              Room 23 is a <strong style={{ color: 'var(--color-text-secondary)' }}>restricted-access</strong> website
              intended for consenting adults only.
            </p>
            <p>
              We use <strong style={{ color: 'var(--color-text-secondary)' }}>age verification</strong> and do not
              knowingly collect information from individuals under the age of 18.
            </p>
            <p>
              By proceeding, you agree to our{' '}
              <a href="/terms" className="link-brass">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="link-brass">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* ── Bottom Fine Print ── */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
        >
          &copy; {new Date().getFullYear()} Room 23. All rights reserved.
        </p>
      </div>
    </div>
  )
}
