'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { INVENTORY_STATUS } from '@/lib/inventory'
import ProductArtwork from '@/components/product-artwork'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const soldOut =
    product.inventoryStatus === INVENTORY_STATUS.OUT_OF_STOCK ||
    product.badge === 'SOLD OUT'
  const href = `/products/${product.slug || product.id}`
  const price =
    typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
      qty: 1,
    })
  }

  return (
    <article className="group flex flex-col">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden border border-zinc-800 bg-zinc-950">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <ProductArtwork productId={product.id} category={product.category} />
          )}
          {product.badge && !soldOut && (
            <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              {product.badge}
            </span>
          )}
          {soldOut && (
            <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/55 text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-300">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col px-0.5 pt-4 sm:pt-5">
        {product.category ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            {String(product.category).replace(/-/g, ' ')}
          </p>
        ) : null}

        <Link href={href}>
          <h3 className="mt-1.5 font-serif text-[15px] leading-snug tracking-wide text-white sm:text-base">
            {product.name}
          </h3>
        </Link>

        {product.tagline ? (
          <p className="mt-1.5 line-clamp-1 text-xs leading-relaxed text-zinc-500">
            {product.tagline}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm tracking-wide text-zinc-300">{price}</p>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={soldOut}
            className="min-h-11 min-w-[4.5rem] text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:text-zinc-600"
          >
            {soldOut ? 'Unavailable' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
