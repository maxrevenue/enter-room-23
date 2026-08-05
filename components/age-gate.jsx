'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

export default function AgeGate() {
  const { confirmAge } = useCart()
  const [exiting, setExiting] = useState(false)

  const handleEnter = () => {
    setExiting(true)
    setTimeout(() => confirmAge(), 900)
  }

  if (exiting) {
    return (
      <div
        className="fixed inset-0 z-50 animate-door-enter pointer-events-none"
        style={{ backgroundColor: '#050308' }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden group/door"
      style={{ backgroundColor: '#050308' }}
    >
      {/* ── Deep ambient background gradient ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(20,8,12,0.9) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(180,130,50,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at center, #0A050A 0%, #030102 100%)
          `,
        }}
      />

      {/* ── Vignette overlay ── */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,1,2,0.7) 85%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* ── Ambient under-glow light source ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0
                      transition-all duration-[1200ms] ease-out
                      group-hover/door:opacity-100 group-hover/door:scale-x-110"
        style={{
          width: 'min(70vw, 500px)',
          height: '30vh',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(200,155,60,0.18) 0%, rgba(180,130,40,0.08) 30%, transparent 70%)',
          opacity: 0.75,
        }}
      />

      {/* ── Floor light reflection ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-0
                      transition-all duration-[1200ms] ease-out
                      group-hover/door:opacity-100 group-hover/door:scale-x-120"
        style={{
          width: 'min(90vw, 700px)',
          height: '6vh',
          background: 'linear-gradient(to top, rgba(200,155,60,0.12) 0%, transparent 100%)',
          opacity: 0.6,
          filter: 'blur(4px)',
        }}
      />

      {/* ── Dust motes in the light beam ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: '38%', bottom: '8%', delay: '0s', size: '1.5px' },
          { left: '55%', bottom: '12%', delay: '1.5s', size: '1px' },
          { left: '48%', bottom: '5%', delay: '3s', size: '1.2px' },
          { left: '62%', bottom: '16%', delay: '4.5s', size: '1px' },
          { left: '35%', bottom: '10%', delay: '2s', size: '1.3px' },
          { left: '52%', bottom: '20%', delay: '5.5s', size: '0.8px' },
          { left: '44%', bottom: '14%', delay: '6.5s', size: '1px' },
        ].map((dot, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-dust-rise"
            style={{
              left: dot.left,
              bottom: dot.bottom,
              width: dot.size,
              height: dot.size,
              animationDelay: dot.delay,
              background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(200,155,60,0.2) 50%, transparent 100%)',
            }}
          />
        ))}
      </div>

      {/* ── "DISCREET. CURATED. EXCLUSIVE." — top header ── */}
      <p
        className="relative z-10 mb-[3vh] text-center px-6 animate-fade-in-up
                   font-[var(--font-syne)] tracking-[0.32em] uppercase"
        style={{
          fontSize: 'clamp(0.65rem, 1.4vw, 0.85rem)',
          color: 'rgba(200,180,150,0.7)',
          fontWeight: 400,
          letterSpacing: '0.35em',
        }}
      >
        DISCREET. CURATED. EXCLUSIVE.
      </p>

      {/* ── Door container ── */}
      <div
        className="relative z-10 animate-fade-in-up delay-100
                   transition-all duration-[1200ms] ease-out
                   group-hover/door:scale-[1.015]"
        style={{
          width: 'min(85vw, 380px)',
          maxHeight: '62vh',
          aspectRatio: '2/3',
        }}
      >
        {/* Halo behind door — amber glow ring */}
        <div
          className="absolute -inset-4 rounded-sm pointer-events-none
                      transition-opacity duration-[1200ms] ease-out
                      opacity-40 group-hover/door:opacity-70"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(180,130,40,0.08) 0%, rgba(180,130,40,0.03) 50%, transparent 80%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Door button — the entire door is interactive */}
        <button
          onClick={handleEnter}
          className="relative w-full h-full bg-transparent border-0 outline-none cursor-pointer group/btn p-0"
          aria-label="Enter Room 23"
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: `
              0 0 80px rgba(0,0,0,0.6),
              0 0 120px rgba(0,0,0,0.4)
            `,
          }}
        >
          {/* ── The door image ── */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new door.png"
            alt="Enter Room 23"
            width={600}
            height={900}
            className="relative w-full h-full object-contain block
                       transition-all duration-[1200ms] ease-out
                       group-hover/btn:brightness-[1.06]"
            style={{ filter: 'contrast(1.02) saturate(0.95)' }}
          />

          {/* ── Keyhole glow spot (centered ~43% from top) ── */}
          <div
            className="absolute pointer-events-none
                        transition-all duration-[1000ms] ease-out
                        opacity-0 group-hover/btn:opacity-100"
            style={{
              left: '50%',
              top: '41%',
              transform: 'translate(-50%, -50%)',
              width: '18%',
              height: '14%',
              background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.25) 0%, rgba(180,140,40,0.12) 40%, transparent 70%)',
              filter: 'blur(6px)',
              borderRadius: '50%',
            }}
          />

          {/* ── Under-glow enhancement on hover ── */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none
                        transition-all duration-[1200ms] ease-out
                        opacity-0 group-hover/btn:opacity-100
                        group-hover/btn:h-[22%]"
            style={{
              height: '15%',
              background: 'linear-gradient(to top, rgba(200,155,50,0.30) 0%, rgba(180,130,40,0.10) 40%, transparent 100%)',
            }}
          />

          {/* ── Subtle top spotlight ── */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none
                        transition-opacity duration-[1000ms] ease-out
                        opacity-0 group-hover/btn:opacity-60"
            style={{
              height: '20%',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 100%)',
            }}
          />
        </button>
      </div>

      {/* ── Tagline — below the door ── */}
      <p
        className="relative z-10 mt-[3vh] mb-[4vh] text-center px-6 animate-fade-in-up delay-200
                   font-[var(--font-syne)]"
        style={{
          fontSize: 'clamp(0.7rem, 1.3vw, 0.82rem)',
          color: 'rgba(180,160,130,0.55)',
          fontWeight: 400,
          letterSpacing: '0.18em',
          maxWidth: 'min(70vw, 500px)',
        }}
      >
        An exclusive sanctuary for sensual well&shy;being
      </p>
    </div>
  )
}
