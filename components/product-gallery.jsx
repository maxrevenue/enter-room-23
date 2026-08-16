'use client'

import { useState } from 'react'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function ProductGallery({ product }) {
  const images = product.gallery?.length ? product.gallery : [{ url: product.image, alt: product.name }]
  const [active, setActive] = useState(0)
  const hero = images[Math.min(active, images.length - 1)]

  return (
    <div>
      <AspectRatio ratio={4 / 5} className="overflow-hidden border border-zinc-800 bg-zinc-900">
        <img src={hero.url} alt={hero.alt || product.name} className="h-full w-full object-cover" />
      </AspectRatio>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((thumb, index) => (
            <button
              key={`${thumb.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
              className={`block overflow-hidden border bg-zinc-900 ${index === active ? 'border-zinc-400' : 'border-zinc-800'}`}
            >
              <AspectRatio ratio={4 / 5}>
                <img src={thumb.url} alt={thumb.alt || ''} className="h-full w-full object-cover" />
              </AspectRatio>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
