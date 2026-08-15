'use client'

import Link from 'next/link'

const SIZE_STYLES = {
  sm: { fontSize: '0.85rem', letterSpacing: '0.28em' },
  md: { fontSize: '1.1rem', letterSpacing: '0.3em' },
  lg: { fontSize: '1.6rem', letterSpacing: '0.32em' },
  xl: { fontSize: '2.4rem', letterSpacing: '0.38em' },
}

export default function BrandLogo({
  size = 'md',
  href = '/',
  className = '',
}) {
  const type = SIZE_STYLES[size] || SIZE_STYLES.md

  const mark = (
    <span
      className={`font-syne font-bold tracking-widest uppercase transition-opacity duration-300 group-hover:opacity-80 ${className}`}
      style={{
        fontSize: type.fontSize,
        letterSpacing: type.letterSpacing,
        color: '#C8102E',
        textShadow: '0 2px 12px rgba(200,16,46,0.28)',
      }}
    >
      ROOM 23
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block group focus:outline-none" aria-label="Room 23 Home">
        {mark}
      </Link>
    )
  }

  return mark
}
