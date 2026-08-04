'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'

export default function AgeGate() {
  const { confirmAge } = useCart()
  const [exiting, setExiting] = useState(false)

  const handleEnter = () => {
    setExiting(true)
    setTimeout(() => confirmAge(), 600)
  }

  if (exiting) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 opacity-0 pointer-events-none"
        style={{ backgroundColor: 'var(--bg-base)' }}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center select-none overflow-hidden animate-fade-in group/door"
      style={{ background: 'var(--bg-gradient-page)' }}
    >
      {/* ── Ambient light leaks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-left wine haze — subtle in light mode */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] opacity-[0.05]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(90, 14, 24, 0.7) 0%, transparent 70%)',
          }}
        />
        {/* Bottom-right warm amber light leak */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[55%] h-[55%] opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(197, 160, 89, 0.5) 0%, transparent 70%)',
          }}
        />
        {/* Center-bottom accent wash */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] opacity-[0.04]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(90, 14, 24, 0.4) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* ── Background watermark "23" ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        style={{
          fontSize: 'min(50vw, 420px)',
          fontFamily: 'var(--font-syne), serif',
          fontWeight: 900,
          color: 'var(--accent)',
          opacity: 0.03,
          lineHeight: 1,
        }}
      >
        23
      </div>

      {/* ── Floating ambient dust motes ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: '12%', top: '22%', delay: '0s', size: 'w-1.5 h-1.5' },
          { left: '78%', top: '35%', delay: '1.2s', size: 'w-1 h-1' },
          { left: '25%', top: '65%', delay: '2.4s', size: 'w-1 h-1' },
          { left: '68%', top: '72%', delay: '3.6s', size: 'w-1.5 h-1.5' },
          { left: '40%', top: '15%', delay: '4.8s', size: 'w-1 h-1' },
          { left: '85%', top: '55%', delay: '6s', size: 'w-1 h-1' },
          { left: '15%', top: '48%', delay: '2s', size: 'w-1.5 h-1.5' },
          { left: '55%', top: '82%', delay: '5s', size: 'w-1 h-1' },
        ].map((dot, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-dust-float ${dot.size}`}
            style={{
              left: dot.left,
              top: dot.top,
              animationDelay: dot.delay,
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(255, 0, 51, 0.15) 50%, transparent 100%)',
              boxShadow: '0 0 6px rgba(212, 175, 55, 0.2), 0 0 12px rgba(128, 0, 32, 0.1)',
            }}
          />
        ))}
      </div>

      {/* ── Corner frame accents ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Top-left corner */}
        <div className="absolute top-6 left-6 w-12 h-12" style={{ borderTop: '1px solid var(--border-accent)', borderLeft: '1px solid var(--border-accent)' }} />
        {/* Top-right corner */}
        <div className="absolute top-6 right-6 w-12 h-12" style={{ borderTop: '1px solid var(--border-accent)', borderRight: '1px solid var(--border-accent)' }} />
        {/* Bottom-left corner */}
        <div className="absolute bottom-6 left-6 w-12 h-12" style={{ borderBottom: '1px solid var(--border-accent)', borderLeft: '1px solid var(--border-accent)' }} />
        {/* Bottom-right corner */}
        <div className="absolute bottom-6 right-6 w-12 h-12" style={{ borderBottom: '1px solid var(--border-accent)', borderRight: '1px solid var(--border-accent)' }} />
      </div>

      {/* ── Keyhole icon ── */}
      <div className="mt-[4vh] sm:mt-[3vh] relative animate-fade-in-up z-10">
        <svg
          width="48" height="48"
          viewBox="0 0 48 48" fill="none"
          className="w-10 h-10 sm:w-12 sm:h-12"
        >
          {/* Outer ring */}
          <circle
            cx="24" cy="24" r="20"
            fill="none" strokeWidth="1"
            style={{ stroke: 'var(--accent)', opacity: 0.4 }}
          />
          {/* Inner ring */}
          <circle
            cx="24" cy="24" r="16"
            fill="none" strokeWidth="0.8"
            style={{ stroke: 'var(--accent)', opacity: 0.25 }}
          />
          {/* Keyhole: circle + stem */}
          <circle
            cx="24" cy="19" r="5"
            fill="none" strokeWidth="1.2"
            style={{ stroke: 'var(--accent)', opacity: 0.7 }}
          />
          <path
            d="M21.5 23L22.5 33H25.5L26.5 23"
            strokeWidth="1.2" strokeLinecap="round"
            style={{ stroke: 'var(--accent)', opacity: 0.7 }}
          />
          {/* 23 */}
          <text x="24" y="36" textAnchor="middle"
            className="text-[9px] font-bold font-syne"
            style={{ fill: 'var(--accent)', opacity: 0.6 }}
          >
            23
          </text>
        </svg>
      </div>

      {/* ── Subtitle — top header since door image has its own "ROOM 23" title ── */}
      <p
        className="mt-[1.5vh] sm:mt-[1.5vh] text-clamp-subtitle font-syne tracking-[0.28em] uppercase text-center px-6 max-w-[90vw] sm:max-w-[70vw] animate-fade-in-up delay-100"
        style={{
          color: 'var(--text-secondary)',
          letterSpacing: '0.3em',
        }}
      >
        DISCREET. CURATED. EXCLUSIVE.
      </p>

      {/* ── Door — sleek rectangular frame, tall proportions ── */}
      <div
        className="relative z-10 mt-[2vh] sm:mt-[2vh] mb-8 animate-fade-in-up delay-200
                   w-[280px] sm:w-[320px] mx-auto
                   h-[480px] sm:h-[520px]
                   rounded-sm
                   border border-[#800020]/20
                   overflow-hidden
                   bg-[#070305]
                   transition-all duration-[1000ms] ease-out
                   group-hover/door:shadow-[0_0_60px_rgba(128,0,32,0.6)]
                   group-hover/door:-translate-y-2"
        style={{
          boxShadow: 'var(--door-shadow-base)',
        }}
      >
        <button
          onClick={handleEnter}
          className="relative bg-transparent border-0 outline-none cursor-pointer group flex w-full h-full"
          aria-label="Enter Room 23"
          style={{ background: 'none', border: 'none', outline: 'none' }}
        >
          {/* Hover glow overlay */}
          <div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 44%, transparent 30%, rgba(90,14,24,0.05) 55%, transparent 75%)',
              filter: 'blur(8px)',
            }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/door.png"
            alt="Enter Room 23"
            width={600}
            height={900}
            className="relative z-0 w-full h-full object-cover object-bottom scale-125 block
                       transition-all duration-[1500ms] ease-out
                       group-hover/door:scale-[1.28] group-hover/door:brightness-110"
          />
        </button>
      </div>

      {/* ── Tagline ── */}
      <p
        className="mt-[1.5vh] sm:mt-[2vh] text-[2.5vw] sm:text-[1.3vw] md:text-[1vw] lg:text-[0.85vw] tracking-[0.2em] uppercase text-center px-6 max-w-[90vw] sm:max-w-[65vw] animate-fade-in-up delay-300"
        style={{
          fontFamily: 'var(--font-syne), serif',
          color: 'var(--text-secondary)',
          letterSpacing: '0.22em',
        }}
      >
        An exclusive sanctuary for sensual well&shy;being
      </p>

      {/* ── CTA Button ── */}
      <button
        onClick={handleEnter}
        className="mt-[2vh] sm:mt-[2.5vh] mb-[4vh] sm:mb-[3vh] px-10 sm:px-16 py-3 sm:py-4 rounded-full border cursor-pointer transition-all duration-500 ease-out hover:-translate-y-0.5 active:scale-[0.97] group/cta animate-fade-in-up delay-400 relative overflow-hidden"
        style={{
          borderColor: 'var(--button-border)',
          backgroundColor: 'var(--button-bg)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Hover glow background */}
        <div className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: 'var(--button-hover-bg)' }}
        />
        {/* Animated laser sweep */}
        <div className="absolute inset-0 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[200%] h-[1px] animate-laser-sweep"
            style={{ background: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)' }}
          />
        </div>

        <span
          className="relative z-10 text-[3vw] sm:text-[1.2vw] md:text-[0.9vw] lg:text-[0.8vw] font-syne font-bold tracking-[0.18em] uppercase whitespace-nowrap"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="relative inline-block">
            ENTER ROOM 23
            {/* Button text glow */}
            <span
              className="absolute inset-0 blur-sm pointer-events-none opacity-60 group-hover/cta:opacity-90 transition-opacity duration-500"
              aria-hidden="true"
              style={{
                color: 'transparent',
                textShadow: '0 0 8px var(--accent), 0 0 20px var(--accent)',
              }}
            >
              ENTER ROOM 23
            </span>
          </span>
        </span>
      </button>
    </div>
  )
}
