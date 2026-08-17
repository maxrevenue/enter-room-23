import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { productHref } from '@/lib/products'

type ProductCardProduct = {
  id: string
  name: string
  slug?: string
  price: number
  image: string
  tagline?: string
  badge?: string | null
}

type ProductCardProps = {
  product: ProductCardProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col">
      <Link href={productHref(product)} className="block">
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

      <div className="mt-4 flex flex-1 flex-col">
        {product.badge ? (
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{product.badge}</p>
        ) : null}

        <Link href={productHref(product)}>
          <h3 className="mt-2 font-serif text-sm tracking-[0.08em] text-white group-hover:text-zinc-300 md:text-base">
            {product.name}
          </h3>
        </Link>

        {product.tagline ? (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-500">{product.tagline}</p>
        ) : null}

        <p className="mt-auto pt-4 text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  )
}
