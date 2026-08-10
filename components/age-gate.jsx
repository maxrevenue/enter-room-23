'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { Lock, ShieldCheck } from 'lucide-react'

export default function AgeGate() {
  const { mounted, ageVerified, confirmAge, declineAge } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!mounted || ageVerified) return
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [mounted, ageVerified])

  if (!mounted || ageVerified) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      {/* Layered ambient glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.05) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.3), transparent)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,26,26,0.15), transparent)',
          }}
        />
      </div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md mx-auto transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'}`}
      >
        <div
          className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 0 0 1px rgba(212,168,83,0.08), 0 0 80px rgba(212,168,83,0.06), 0 32px 64px rgba(0,0,0,0.7)',
          }}
        >
          {/* Top brass line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--color-brass), transparent)',
            }}
          />
          {/* Bottom accent line */}
          <div
            className="absolute bottom-0 left-8 right-8 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,26,26,0.3), transparent)',
            }}
          />

          {/* ── Official Brand Emblem ── */}
          <div className="mb-6 flex flex-col items-center">
            <img
              src="/new door.png"
              alt="Room 23 Door & Keyhole Logo"
              className="h-28 w-auto object-contain mb-3 animate-float drop-shadow-[0_8px_20px_rgba(0,134,107,0.15)]"
            />
            <div
              className="w-16 h-px mx-auto mt-1"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-emerald), transparent)',
              }}
            />
          </div>


            <div
              className="w-16 h-px mx-auto"
              style={{
                background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
              }}
            />
          </div>

          {/* ── Age Notice ── */}
          <div className="mb-7 space-y-3">
            <h3
              className="text-base sm:text-lg tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.06em',
              }}
            >
              AGE VERIFICATION REQUIRED
            </h3>

            <p
              className="text-sm leading-relaxed max-w-sm mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              This website contains adult-oriented products and content.
              You must be at least{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>18 years of age</strong>{' '}
              (or the legal age of majority in your jurisdiction) to enter.
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
            <button
              onClick={confirmAge}
              className="btn-primary w-full sm:w-auto min-w-[200px] py-3 text-sm relative overflow-hidden group"
              type="button"
            >
              <span className="relative z-10">I AM 18 OR OLDER — ENTER</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,26,26,0.35), rgba(212,168,83,0.2))',
                }}
              />
            </button>
            <button
              onClick={declineAge}
              className="btn-secondary w-full sm:w-auto min-w-[160px] py-3 text-sm"
              type="button"
            >
              I AM UNDER 18 — EXIT
            </button>
          </div>

          {/* ── Privacy Reassurance ── */}
          <div
            className="flex items-center justify-center gap-2 mb-5 px-4 py-2.5 rounded-md"
            style={{
              backgroundColor: 'rgba(212,168,83,0.06)',
              border: '1px solid rgba(212,168,83,0.1)',
            }}
          >
            <ShieldCheck size={13} style={{ color: 'var(--color-brass)', flexShrink: 0 }} />
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}
            >
              Your visit is private — no tracking, no judgment
            </span>
          </div>

          {/* ── Legal Disclaimer ── */}
          <div
            className="text-xs space-y-1 max-w-sm mx-auto"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p>
              Room 23 is a{' '}
              <strong style={{ color: 'var(--color-text-secondary)' }}>restricted-access</strong>{' '}
              website intended for consenting adults only.
            </p>
            <p>
              By proceeding, you agree to our{' '}
              <a href="/terms" className="link-brass">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="link-brass">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Bottom fine print */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-text-muted)', opacity: 0.45 }}
        >
          &copy; {new Date().getFullYear()} Room 23. All rights reserved.
        </p>
      </div>
    </div>
  )
}
