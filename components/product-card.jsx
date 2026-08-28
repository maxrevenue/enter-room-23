import Link from 'next/link'
import Image from 'next/image'
import { INVENTORY_STATUS } from '@/lib/inventory'
import ProductCardActions from '@/components/product-card-actions'
import { formatPrice } from '@/lib/format-price'
import { badgeClassName, resolveDisplayBadge } from '@/lib/product-badge'
import { productHref } from '@/lib/products'

export default function ProductCard({ product, newBadgeAllowlist = new Set() }) {
  const soldOut =
    product.inventoryStatus === INVENTORY_STATUS.OUT_OF_STOCK ||
    product.badge === 'SOLD OUT'
  const href = productHref(product)
  const price =
    typeof product.price === 'number' ? formatPrice(product.price) : product.price
  const displayBadge = resolveDisplayBadge(product, newBadgeAllowlist)
  const descriptor = product.tagline || product.shortEditorial || null
  const imageSrc =
    product.image || product.images?.[0]?.url || product.gallery?.[0]?.url || null
  const imageAlt =
    product.images?.[0]?.alt || product.gallery?.[0]?.alt || product.name

  return (
    <article className="group flex h-full flex-col overflow-visible">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-theme-surface">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={1000}
              unoptimized
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-95"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-theme-bg">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted/70 sm:tracking-[0.28em]">
                Room 23
              </span>
            </div>
          )}

          {displayBadge && !soldOut ? (
            <span className={badgeClassName(displayBadge)}>{displayBadge}</span>
          ) : null}

          {soldOut ? (
            <span className="absolute inset-0 flex items-center justify-center bg-theme-bg/60 text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.22em]">
              Sold out
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex min-h-[4.5rem] flex-1 flex-col px-0.5 pt-3 sm:min-h-[5rem] sm:pt-5">
        <Link
          href={href}
          className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-border"
        >
          <h3 className="line-clamp-2 font-serif text-sm font-normal leading-snug tracking-wide text-theme-text transition-colors duration-300 group-hover:text-theme-text/90 sm:text-base">
            {product.name}
          </h3>
        </Link>

        {descriptor ? (
          <p className="mt-2 line-clamp-1 text-xs leading-relaxed text-theme-muted sm:mt-2.5">
            {descriptor}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4">
          <p className="text-sm tabular-nums text-theme-muted">{price}</p>
          <ProductCardActions product={product} />
        </div>
      </div>
    </article>
  )
}
