import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { getProductBySlug, productHref } from '@/lib/products'

const FEATURED_SLUG = 'platinum-silicone-lubricant-4oz'

const EDITORIAL = {
  kicker: 'This month\'s focus',
  note: 'Currently reviewing',
  copy: 'Our standard bottle — concentrated, long-wearing, and quiet on the nightstand. The house formula we return to most often.',
} as const

export default function ProductOfTheMonth() {
  const product = getProductBySlug(FEATURED_SLUG)

  if (!product) return null

  return (
    <section
      aria-labelledby="product-of-month-heading"
      className="border-t border-zinc-800 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Link href={productHref(product)} className="group block">
            <div className="overflow-hidden border border-zinc-800 bg-zinc-900">
              <AspectRatio ratio={4 / 5}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                />
              </AspectRatio>
            </div>
          </Link>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                {EDITORIAL.kicker}
              </p>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">·</span>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                {EDITORIAL.note}
              </p>
            </div>

            <h2
              id="product-of-month-heading"
              className="mt-6 font-serif text-2xl uppercase tracking-[0.22em] text-white md:text-3xl"
            >
              Product of the Month
            </h2>

            <Link href={productHref(product)} className="group mt-6 block">
              <h3 className="font-serif text-xl tracking-wide text-white group-hover:text-zinc-300 md:text-2xl">
                {product.name}
              </h3>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{EDITORIAL.copy}</p>

            {product.shortEditorial ? (
              <p className="mt-4 text-sm italic leading-relaxed text-zinc-500">{product.shortEditorial}</p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="text-sm tracking-wide text-zinc-300">${product.price.toFixed(2)}</p>
              {product.badge ? (
                <p className="border border-zinc-700 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  {product.badge}
                </p>
              ) : null}
            </div>

            <Link
              href={productHref(product)}
              className="mt-10 inline-flex w-fit items-center justify-center border border-zinc-700 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:border-zinc-500 hover:bg-zinc-900"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
