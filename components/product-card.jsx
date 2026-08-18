import Link from 'next/link'
import Image from 'next/image'
import { INVENTORY_STATUS } from '@/lib/inventory'
import ProductCardActions from '@/components/product-card-actions'

export default function ProductCard({ product }) {
  const soldOut =
    product.inventoryStatus === INVENTORY_STATUS.OUT_OF_STOCK ||
    product.badge === 'SOLD OUT'
  const href = `/products/${product.slug || product.id}`
  const price =
    typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price
  const descriptor = product.tagline || product.shortEditorial || null
  const imageSrc =
    product.image || product.images?.[0]?.url || product.gallery?.[0]?.url || null
  const imageAlt =
    product.images?.[0]?.alt || product.gallery?.[0]?.alt || product.name

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-muted"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-theme-surface">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={800}
              height={1000}
              unoptimized
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-theme-bg">
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-theme-muted/70">
                Room 23
              </span>
            </div>
          )}

          {product.badge && !soldOut ? (
            <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] text-theme-text/80">
              {product.badge}
            </span>
          ) : null}

          {soldOut ? (
            <span className="absolute inset-0 flex items-center justify-center bg-theme-bg/60 text-[10px] font-medium uppercase tracking-[0.22em] text-theme-text/80">
              Sold out
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-0.5 pt-5 sm:pt-6">
        <Link
          href={href}
          className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-theme-muted"
        >
          <h3 className="font-serif text-[15px] leading-snug tracking-wide text-theme-text transition-colors duration-300 group-hover:text-theme-text sm:text-base">
            {product.name}
          </h3>
        </Link>

        {descriptor ? (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-theme-muted sm:mt-2.5">
            {descriptor}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-4 pt-5 sm:pt-6">
          <p className="text-sm tracking-wide text-theme-text/80">{price}</p>
          <ProductCardActions product={product} />
        </div>
      </div>
    </article>
  )
}
