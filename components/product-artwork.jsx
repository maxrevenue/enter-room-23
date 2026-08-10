'use client'

export default function ProductArtwork({ productId, category, className = '' }) {
  if (productId?.includes('wand') || productId?.includes('couples') || category === 'accessories') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-[#F4EEE4] via-[#FAF7F2] to-[#EAE1D3] overflow-hidden ${className}`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00866b] via-transparent to-transparent" />
        <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 drop-shadow-[0_10px_20px_rgba(0,134,107,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wandBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E4A40" />
              <stop offset="50%" stopColor="#122720" />
              <stop offset="100%" stopColor="#091713" />
            </linearGradient>
            <linearGradient id="brassAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffaf1f" />
              <stop offset="50%" stopColor="#00866b" />
              <stop offset="100%" stopColor="#eb6824" />
            </linearGradient>
            <linearGradient id="tipGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eb6824" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffaf1f" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Wand silhouette */}
          <rect x="92" y="70" width="16" height="100" rx="8" fill="url(#wandBody)" stroke="#00866b" strokeWidth="1.5" />
          <circle cx="100" cy="52" r="24" fill="url(#wandBody)" stroke="url(#brassAccent)" strokeWidth="2" />
          <circle cx="100" cy="52" r="16" fill="url(#tipGlow)" />
          {/* Metallic brass accent ring */}
          <rect x="90" y="72" width="20" height="5" rx="2" fill="url(#brassAccent)" />
          <rect x="90" y="150" width="20" height="6" rx="3" fill="url(#brassAccent)" />
          {/* Subtle LED indicator */}
          <circle cx="100" cy="115" r="2.5" fill="#eb6824" />
        </svg>
        <span className="absolute bottom-3 text-[10px] font-mono tracking-[0.2em] text-[#00866b]/80 uppercase font-semibold">
          ROOM 23 ARCHIVE
        </span>
      </div>
    )
  }


  // Lubricant / Apothecary Bottles
  return (
    <div className={`relative w-full h-full flex items-center justify-center p-6 bg-gradient-to-b from-[#F4EEE4] via-[#FAF7F2] to-[#EAE1D3] overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00866b] via-transparent to-transparent" />
      <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 drop-shadow-[0_12px_24px_rgba(0,134,107,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E4A40" />
            <stop offset="40%" stopColor="#122720" />
            <stop offset="100%" stopColor="#091713" />
          </linearGradient>
          <linearGradient id="brassMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffaf1f" />
            <stop offset="50%" stopColor="#00866b" />
            <stop offset="100%" stopColor="#eb6824" />
          </linearGradient>
        </defs>
        {/* Pump cap */}
        <path d="M92 38 H108 V46 H92 Z" fill="url(#brassMetal)" />
        <path d="M85 30 H105 V38 H95 Z" fill="url(#brassMetal)" />
        <rect x="96" y="24" width="22" height="6" rx="2" fill="url(#brassMetal)" />
        <rect x="95" y="46" width="10" height="12" fill="#122720" />
        {/* Bottle Body */}
        <rect x="68" y="58" width="64" height="114" rx="12" fill="url(#bottleBody)" stroke="#00866b" strokeWidth="1.5" />
        {/* Label */}
        <rect x="74" y="80" width="52" height="74" rx="3" fill="#FAF7F2" stroke="url(#brassMetal)" strokeWidth="1" />
        <text x="100" y="102" textAnchor="middle" fill="#00866b" fontSize="8" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5">
          ROOM 23
        </text>
        <line x1="82" y1="108" x2="118" y2="108" stroke="#eb6824" strokeWidth="0.75" strokeOpacity="0.8" />
        <text x="100" y="122" textAnchor="middle" fill="#5C786E" fontSize="5.5" fontFamily="sans-serif" letterSpacing="0.8">
          FORMULA
        </text>
        <text x="100" y="138" textAnchor="middle" fill="#122720" fontSize="6.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="1">
          ESSENTIAL
        </text>
      </svg>
      <span className="absolute bottom-3 text-[10px] font-mono tracking-[0.2em] text-[#00866b]/80 uppercase font-semibold">
        APOTHECARY EDITION
      </span>
    </div>
  )
}

