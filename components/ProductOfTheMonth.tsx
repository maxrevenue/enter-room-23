import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { getProductById, productHref } from '@/lib/products'

export type MonthOffer = {
  label: string
  compareAtPrice?: number
}

type ProductOfTheMonthProps = {
  productId: string
  offer?: MonthOffer | null
}

function formatCategory(category?: string) {
  if (!category) return 'The collection'
  return String(category).replace(/-/g, ' ')
}

export default function ProductOfTheMonth({ productId, offer = null }: ProductOfTheMonthProps) {
  const product = getProductById(productId)

  if (!product) return null

  const href = productHref(product)
  const compareAt =
    offer?.compareAtPrice != null ? `$${offer.compareAtPrice.toFixed(2)}` : null
  const editorial = product.shortEditorial || product.description

  return (
    <section
      aria-labelledby="product-of-month-heading"
      className="border-t border-theme-border px-5 py-24 sm:px-8 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Link href={href} className="group block">
            <div className="overflow-hidden border border-theme-border bg-theme-surface">
              <AspectRatio ratio={4 / 5}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-6 transition-opacity duration-300 group-hover:opacity-90"
                />
              </AspectRatio>
            </div>
          </Link>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-theme-muted">
                This month&apos;s focus
              </p>
              {offer ? (
                <>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-theme-muted/60">·</span>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-theme-muted">
                    {offer.label}
                  </p>
                </>
              ) : null}
            </div>

            <h2
              id="product-of-month-heading"
              className="mt-6 font-serif text-2xl tracking-tight text-theme-text sm:text-3xl md:text-4xl"
            >
              Product of the Month
            </h2>

            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-theme-muted">
              {formatCategory(product.category)}
            </p>

            <Link href={href} className="group mt-4 block">
              <h3 className="font-serif text-xl tracking-wide text-theme-text transition-colors duration-300 group-hover:text-theme-text sm:text-2xl">
                {product.name}
              </h3>
            </Link>

            {product.tagline ? (
              <p className="mt-4 text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
                {product.tagline}
              </p>
            ) : null}

            <p className="mt-5 text-sm leading-relaxed text-theme-muted sm:text-[0.9375rem]">
              {editorial}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {compareAt ? (
                <p className="text-sm tracking-wide text-theme-muted line-through">{compareAt}</p>
              ) : null}
              <p className="text-sm tracking-wide text-theme-text/80">${product.price.toFixed(2)}</p>
              {product.badge ? (
                <p className="border border-theme-border px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-theme-muted">
                  {product.badge}
                </p>
              ) : null}
            </div>

            <Link
              href={href}
              className="mt-10 inline-flex min-h-12 w-fit items-center justify-center border border-theme-border px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-theme-text transition-colors duration-300 hover:border-theme-muted hover:bg-theme-surface"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
