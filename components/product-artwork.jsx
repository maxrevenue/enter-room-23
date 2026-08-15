'use client'

export default function ProductArtwork({ productId, category, className = '', style }) {
  const label = (category || 'collection').replace(/-/g, ' ')

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: '#0B0B0C',
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, rgba(200,16,46,0.12) 0%, transparent 62%)',
        ...style,
      }}
      aria-hidden="true"
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
