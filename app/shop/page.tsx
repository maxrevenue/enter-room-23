import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS, productHref } from '@/lib/products'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ProductCardActions from '@/components/product-card-actions'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Curated adult wellness essentials from Room 23 — platinum silicone lubricant and in-house stock.',
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <header className="mb-14 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
            The collection
          </p>
          <h1 className="mt-4 font-serif text-3xl tracking-tight md:text-4xl">Shop</h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Body-safe materials. Private delivery. Secure checkout. A tightly held edit — nothing ornamental.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            <li>Private delivery</li>
            <li>Body-safe materials</li>
            <li>Secure checkout</li>
          </ul>
        </header>

        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <li key={product.id} className="group flex flex-col border border-zinc-800 bg-zinc-900">
              <Link href={productHref(product)} className="block">
                <AspectRatio ratio={1} className="overflow-hidden bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                  />
                </AspectRatio>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                {product.badge ? (
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{product.badge}</p>
                ) : null}
                <Link href={productHref(product)}>
                  <h2 className="mt-2 font-serif text-lg text-white">{product.name}</h2>
                </Link>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">{product.tagline}</p>
                <div className="mt-auto flex items-center justify-between pt-5">
                  <p className="text-sm tracking-wide text-zinc-300">${product.price.toFixed(2)}</p>
                  <ProductCardActions product={product} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
