'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export default function ProductGallery({ product }) {
  const images = product.gallery?.length ? product.gallery : [{ url: product.image, alt: product.name }]
  const [active, setActive] = useState(0)
  const hero = images[Math.min(active, images.length - 1)]

  return (
    <div>
      <AspectRatio ratio={4 / 5} className="relative overflow-hidden border border-theme-border bg-theme-surface">
        <Image
          src={hero.url}
          alt={hero.alt || product.name}
          width={800}
          height={1000}
          unoptimized
          className="absolute inset-0 h-full w-full object-cover"
        />
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
              className={`relative block overflow-hidden border bg-theme-surface ${index === active ? 'border-theme-text/50' : 'border-theme-border'}`}
            >
              <AspectRatio ratio={4 / 5}>
                <Image
                  src={thumb.url}
                  alt={thumb.alt || ''}
                  width={400}
                  height={500}
                  unoptimized
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AspectRatio>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
