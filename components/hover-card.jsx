'use client'

export default function HoverCard({ className, style, children }) {
  return (
    <div
      className={className}
      style={style}
      onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(200,16,46,0.3)'}
      onMouseOut={e => e.currentTarget.style.borderColor = ''}
    >
      {children}
    </div>
  )
}
