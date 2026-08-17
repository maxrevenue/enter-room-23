import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { getProductById, productHref } from '@/lib/products'

const PRODUCT_OF_MONTH_ID = 'lube-silicone-4oz'

const EDITORIAL = {
  kicker: "This month's focus",
  note: 'Currently reviewing',
  copy: 'Our standard bottle — concentrated, long-wearing, and quiet on the nightstand. The house formula we return to most often.',
} as const

export default function ProductOfTheMonth() {
  const product = getProductById(PRODUCT_OF_MONTH_ID)

  if (!product) return null

  return (
    <section
      aria-labelledby="product-of-month-heading"
      className="border-t border-zinc-800 px-5 py-24 sm:px-8 sm:py-32 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Link href={productHref(product)} className="group block">
            <div className="overflow-hidden border border-zinc-800 bg-zinc-900">
              <AspectRatio ratio={4 / 5}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
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
              className="mt-6 font-serif text-2xl tracking-tight text-zinc-50 sm:text-3xl md:text-4xl"
            >
              Product of the Month
            </h2>

            <Link href={productHref(product)} className="group mt-6 block">
              <h3 className="font-serif text-xl tracking-wide text-zinc-50 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                {product.name}
              </h3>
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-[0.9375rem]">
              {EDITORIAL.copy}
            </p>

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
              className="mt-10 inline-flex min-h-12 w-fit items-center justify-center border border-zinc-700 px-10 py-3.5 text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-50 transition-colors duration-300 hover:border-zinc-500 hover:bg-zinc-900"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
