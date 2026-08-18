'use client'

import Image from 'next/image'

export default function ProductArtwork({
  product = undefined,
  productId = undefined,
  category = undefined,
  image = undefined,
  className = '',
  style = undefined,
  alt = undefined,
}) {
  const src = image || product?.image || product?.images?.[0]?.url || product?.gallery?.[0]?.url
  const label = product?.name || (category || 'collection').replace(/-/g, ' ')

  if (src) {
    return (
      <div className={`relative h-full w-full ${className}`} style={style}>
        <Image
          src={src}
          alt={alt || product?.gallery?.[0]?.alt || label}
          fill
          sizes="(min-width: 640px) 20rem, 100vw"
          unoptimized
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: '#0B0B0C',
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(200,16,46,0.12) 0%, transparent 62%)',
        ...style,
      }}
    >
      <span
        className="font-syne font-bold tracking-[0.35em] uppercase"
        style={{ color: '#C8102E', fontSize: '0.7rem', opacity: 0.9 }}
      >
        R23
      </span>
      <span
        className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: '#8E8E93' }}
      >
        {label}
      </span>
      {productId ? (
        <span
          className="mt-2 text-[9px] uppercase tracking-[0.16em] max-w-[80%] text-center truncate"
          style={{ color: '#3A3A3C' }}
        >
          {productId.replace(/-/g, ' ')}
        </span>
      ) : null}
    </div>
  )
}
