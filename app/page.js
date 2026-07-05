'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/lib/cart-context'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <Card className="group bg-neutral-950 border border-white/10 rounded-none overflow-hidden hover:border-white/30 transition-colors duration-300">
      <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%] group-hover:scale-[1.03] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] text-white/70 uppercase">
          AW / Issue 01
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium tracking-tight">{product.name}</h3>
            <p className="text-sm text-white/50 mt-1">{product.tagline}</p>
          </div>
          <div className="text-lg font-light tabular-nums">${product.price}</div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>
        <Button
          onClick={() => addToCart(product)}
          className="w-full rounded-none bg-white text-black hover:bg-white/90 font-medium tracking-wide h-11"
        >
          Add to Bag
        </Button>
      </CardContent>
    </Card>
  )
}

export default function App() {
  return (
    <>
      {/* Hero */}
      <section className="container pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="max-w-3xl">
          <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-6">
            AW — Adult Wellness. Est. 2025.
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]">
            Considered pleasure.<br />
            <span className="text-white/50">Discreet delivery.</span>
          </h1>
          <p className="mt-8 max-w-xl text-white/60 text-base leading-relaxed">
            A modern house of adult wellness objects — designed with restraint,
            shipped with discretion, and billed under a name no one will notice.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#shop">
              <Button className="rounded-none bg-white text-black hover:bg-white/90 h-12 px-8 tracking-wide">
                Shop the Collection
              </Button>
            </a>
            <a href="#journal">
              <Button
                variant="outline"
                className="rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 h-12 px-8 tracking-wide"
              >
                Read the Journal
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="shop" className="container pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">The Collection</div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-2">Objects — 03</h2>
          </div>
          <div className="text-xs text-white/40 hidden sm:block">
            Free discreet shipping on orders over $50
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section id="journal" className="border-y border-white/10 bg-neutral-950">
        <div className="container py-14 grid gap-8 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 mt-1 text-white/70" />
            <div>
              <div className="text-sm font-medium">Unmarked Packaging</div>
              <div className="text-xs text-white/50 mt-1">
                Opaque outer box. No branding. No product name on any label.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 mt-1 text-white/70" />
            <div>
              <div className="text-sm font-medium">Discreet Billing</div>
              <div className="text-xs text-white/50 mt-1">
                Your statement reads <span className="text-white font-medium">AW Holdings LLC</span> — nothing else.
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 mt-1 text-white/70" />
            <div>
              <div className="text-sm font-medium">Body-safe Materials</div>
              <div className="text-xs text-white/50 mt-1">
                Medical-grade silicone, OEKO-TEX textiles, phthalate-free.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
