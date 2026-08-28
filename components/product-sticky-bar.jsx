'use client'

import { useEffect, useState } from 'react'
import ProductAddToCart from '@/components/product-add-to-cart'
import { formatPrice } from '@/lib/format-price'

export default function ProductStickyBar({ product, soldOut = false }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (soldOut) return undefined

    const cta = document.getElementById('pdp-atc')
    const related = document.getElementById('pdp-related')
    if (!cta) return undefined

    let ctaInView = true
    let relatedInView = false

    const update = () => {
      setVisible(!ctaInView && !relatedInView)
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target.id === 'pdp-atc') ctaInView = entry.isIntersecting
        if (entry.target.id === 'pdp-related') relatedInView = entry.isIntersecting
      }
      update()
    }, { threshold: 0 })

    observer.observe(cta)
    if (related) observer.observe(related)

    return () => observer.disconnect()
  }, [soldOut])

  if (soldOut || !visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-theme-border bg-theme-bg/95 px-4 pt-3 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-sm text-theme-text">{product.name}</p>
          <p className="text-xs tabular-nums text-theme-muted">{formatPrice(product.price)}</p>
        </div>
        <div className="shrink-0">
          <ProductAddToCart product={product} compact />
        </div>
      </div>
    </div>
  )
}
