'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { ShieldCheck } from 'lucide-react'

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
      style={{ backgroundColor: 'rgba(250,247,242,0.97)', backdropFilter: 'blur(16px)' }}
    >
      {/* Ambient glow backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,134,107,0.06) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,134,107,0.3), transparent)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(235,104,36,0.2), transparent)',
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
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5DDD0',
            boxShadow: '0 4px 40px rgba(18,39,32,0.10), 0 1px 3px rgba(18,39,32,0.06)',
          }}
        >
          {/* Top emerald accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
            style={{
              background: 'linear-gradient(90deg, #00866b, #ffaf1f, #eb6824)',
            }}
          />

          {/* Official Brand Emblem */}
          <div className="mb-6 flex flex-col items-center">
            <img
              src="/new door.png"
              alt="Room 23 — Private Wellness"
              className="h-28 w-auto object-contain mb-3 animate-float"
              style={{ filter: 'drop-shadow(0 6px 18px rgba(0,134,107,0.12))' }}
            />
            <div
              className="w-20 h-px mx-auto"
              style={{
                background: 'linear-gradient(90deg, transparent, #00866b, transparent)',
              }}
            />
          </div>

          {/* Age Notice */}
          <div className="mb-7 space-y-3">
            <h2
              className="text-base sm:text-lg tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: '#122720',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Age Verification Required
            </h2>

            <p
              className="text-sm leading-relaxed max-w-sm mx-auto"
              style={{ color: '#2E4A40' }}
            >
              This site contains adult wellness products and content. You must be at least{' '}
              <strong style={{ color: '#122720', fontWeight: 700 }}>18 years of age</strong>{' '}
              (or the legal age of majority in your jurisdiction) to enter.
            </p>

            <p
              className="text-xs max-w-sm mx-auto"
              style={{ color: '#5C786E' }}
            >
              By clicking &ldquo;ENTER&rdquo; below, you affirm that you meet the minimum age requirement.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={confirmAge}
              className="w-full sm:w-auto min-w-[200px] py-3 px-6 text-sm font-semibold tracking-widest uppercase rounded-lg transition-all duration-200"
              style={{
                backgroundColor: '#eb6824',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 2px 12px rgba(235,104,36,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d95816'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(235,104,36,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#eb6824'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(235,104,36,0.25)' }}
              type="button"
            >
              I Am 18+ — Enter
            </button>
            <button
              onClick={declineAge}
              className="w-full sm:w-auto min-w-[160px] py-3 px-6 text-sm font-semibold tracking-widest uppercase rounded-lg transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                color: '#5C786E',
                border: '1px solid #E5DDD0',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#5C786E'; e.currentTarget.style.color = '#122720' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5DDD0'; e.currentTarget.style.color = '#5C786E' }}
              type="button"
            >
              I Am Under 18 — Exit
            </button>
          </div>

          {/* Privacy Reassurance */}
          <div
            className="flex items-center justify-center gap-2 mb-5 px-4 py-2.5 rounded-lg"
            style={{
              backgroundColor: 'rgba(0,134,107,0.06)',
              border: '1px solid rgba(0,134,107,0.15)',
            }}
          >
            <ShieldCheck size={13} style={{ color: '#00866b', flexShrink: 0 }} />
            <span
              className="text-xs"
              style={{ color: '#2E4A40', letterSpacing: '0.02em' }}
            >
              Your visit is private — no tracking, no judgment
            </span>
          </div>

          {/* Legal Disclaimer */}
          <div
            className="text-xs space-y-1 max-w-sm mx-auto"
            style={{ color: '#5C786E' }}
          >
            <p>
              Room 23 is a{' '}
              <strong style={{ color: '#2E4A40' }}>restricted-access</strong>{' '}
              website intended for consenting adults only.
            </p>
            <p>
              By proceeding, you agree to our{' '}
              <a href="/terms" style={{ color: '#00866b', textDecoration: 'underline' }}>Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" style={{ color: '#00866b', textDecoration: 'underline' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Bottom fine print */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: '#5C786E', opacity: 0.7 }}
        >
          &copy; {new Date().getFullYear()} Room 23. All rights reserved.
        </p>
      </div>
    </div>
  )
}
