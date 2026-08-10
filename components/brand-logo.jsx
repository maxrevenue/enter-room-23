'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function BrandLogo({
  variant = 'full', // 'full' | 'mark-only' | 'text-only'
  size = 'md',     // 'sm' | 'md' | 'lg' | 'xl'
  href = '/',
  className = '',
}) {
  // Height/width mapping based on size
  const logoDimensions = {
    sm: { imgWidth: 120, imgHeight: 56, markSize: 28, textSize: 'text-sm' },
    md: { imgWidth: 160, imgHeight: 75, markSize: 36, textSize: 'text-base' },
    lg: { imgWidth: 220, imgHeight: 103, markSize: 48, textSize: 'text-xl' },
    xl: { imgWidth: 280, imgHeight: 130, markSize: 64, textSize: 'text-3xl' },
  }[size] || { imgWidth: 160, imgHeight: 75, markSize: 36, textSize: 'text-base' }

  const logoContent = (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      {/* Official Room 23 Door & Keyhole Logo Image */}
      {variant !== 'text-only' && (
        <div className="relative flex items-center justify-center">
          <Image
            src="/new logo 2.png"
            alt="Room 23 — Private Members Club"
            width={logoDimensions.imgWidth}
            height={logoDimensions.imgHeight}
            className="object-contain transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>
      )}

      {/* Optional fallback text if mark-only is not used */}
      {variant === 'text-only' && (
        <span
          className={`font-syne font-bold tracking-[0.2em] uppercase text-[#00866b] ${logoDimensions.textSize}`}
        >
          ROOM 23
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block group focus:outline-none" aria-label="Room 23 Home">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

// ── SVG Vector Emblem (Door + 23 + Keyhole) ──
export function BrandEmblemSvg({ size = 48, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldKeyhole" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffaf1f" />
          <stop offset="50%" stopColor="#eb6824" />
          <stop offset="100%" stopColor="#d95816" />
        </linearGradient>
        <linearGradient id="doorFrame" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00866b" />
          <stop offset="100%" stopColor="#122720" />
        </linearGradient>
      </defs>

      {/* Outer Perspective Door Frame */}
      <path
        d="M20 15 L100 15 L90 30 L90 90 L100 105 L20 105 L30 90 L30 30 Z"
        stroke="url(#doorFrame)"
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="26" y="24" width="68" height="72" rx="4" stroke="#00866b" strokeWidth="2.5" fill="none" />

      {/* '2' Number */}
      <path
        d="M38 48 C38 42, 48 40, 52 45 C55 49, 42 62, 38 68 L56 68"
        stroke="url(#goldKeyhole)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* '3' Number */}
      <path
        d="M66 45 C70 41, 80 43, 78 50 C77 54, 72 55, 68 55 M68 55 C74 55, 80 57, 78 64 C76 70, 66 71, 64 66"
        stroke="url(#goldKeyhole)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Keyhole icon center */}
      <circle cx="60" cy="54" r="5" fill="url(#goldKeyhole)" />
      <polygon points="57,56 63,56 65,68 55,68" fill="url(#goldKeyhole)" />
    </svg>
  )
}
