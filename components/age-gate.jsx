'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { ShieldCheck, Lock } from 'lucide-react'

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
      style={{ backgroundColor: 'rgba(11, 11, 12, 0.98)', backdropFilter: 'blur(20px)' }}
    >
      {/* Hero background image — subtle */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.08,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(200,16,46,0.05) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.5), transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(200,16,46,0.2), transparent)' }}
        />
      </div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-sm mx-auto transition-all duration-700 ease-out
          ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.97]'}`}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: '#161618',
            border: '1px solid rgba(200,16,46,0.2)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,16,46,0.05)',
          }}
        >
          {/* Top red accent line */}
          <div
            className="h-[3px] w-full"
            style={{ background: 'linear-gradient(90deg, #8B0000, #C8102E, #8B0000)' }}
          />

          {/* Image / Logo Section */}
          <div className="relative overflow-hidden">
            <div
              className="w-full h-48 flex items-center justify-center"
              style={{
                backgroundImage: 'url(/image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, rgba(22,22,24,0.1) 0%, rgba(22,22,24,0.8) 100%)' }}
              />
              {/* Logo on top of image */}
              <img
                src="/logo.jpg"
                alt="Room 23"
                className="relative z-10 h-20 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 4px 16px rgba(200,16,46,0.4))' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pt-7 pb-8 text-center">
            {/* Lock icon + heading */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Lock className="w-3.5 h-3.5" style={{ color: '#C8102E' }} />
              <h2
                className="text-sm tracking-[0.2em] uppercase font-bold"
                style={{ fontFamily: 'var(--font-display)', color: '#F4F4F6' }}
              >
                Age Verification Required
              </h2>
            </div>

            <div
              className="w-12 h-px mx-auto mb-5"
              style={{ background: 'linear-gradient(90deg, transparent, #C8102E, transparent)' }}
            />

            <p
              className="text-sm leading-relaxed mb-2"
              style={{ color: '#8E8E93' }}
            >
              This site contains adult wellness products and content for{' '}
              <strong style={{ color: '#F4F4F6' }}>adults 18+</strong>{' '}
              only.
            </p>
            <p
              className="text-xs mb-7"
              style={{ color: '#636366' }}
            >
              By entering, you affirm you meet the minimum age requirement in your jurisdiction.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mb-6">
              <button
                onClick={confirmAge}
                className="w-full py-3.5 px-6 text-sm font-bold tracking-widest uppercase rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: '#C8102E',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 16px rgba(200,16,46,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#E51436'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(200,16,46,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C8102E'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(200,16,46,0.3)' }}
                type="button"
              >
                I Am 18+ — Enter
              </button>
              <button
                onClick={declineAge}
                className="w-full py-3 px-6 text-xs font-semibold tracking-widest uppercase rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  color: '#636366',
                  border: '1px solid #26262A',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A3A3C'; e.currentTarget.style.color = '#8E8E93' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#26262A'; e.currentTarget.style.color = '#636366' }}
                type="button"
              >
                I Am Under 18 — Exit
              </button>
            </div>

            {/* Privacy Reassurance */}
            <div
              className="flex items-center justify-center gap-2 mb-5 px-4 py-2.5 rounded-lg"
              style={{ backgroundColor: 'rgba(200,16,46,0.05)', border: '1px solid rgba(200,16,46,0.1)' }}
            >
              <ShieldCheck size={12} style={{ color: '#C8102E', flexShrink: 0 }} />
              <span className="text-xs" style={{ color: '#8E8E93', letterSpacing: '0.02em' }}>
                Your visit is private — no tracking, no judgment
              </span>
            </div>

            {/* Legal */}
            <p className="text-[10px] leading-relaxed" style={{ color: '#3A3A3C' }}>
              By proceeding, you agree to our{' '}
              <a href="/terms" style={{ color: '#C8102E' }}>Terms</a>{' '}
              &amp;{' '}
              <a href="/privacy" style={{ color: '#C8102E' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Bottom fine print */}
        <p className="text-center text-[10px] mt-3" style={{ color: '#3A3A3C' }}>
          &copy; {new Date().getFullYear()} Room 23. All rights reserved.
        </p>
      </div>
    </div>
  )
}
