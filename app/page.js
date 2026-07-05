'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { useCart } from '@/lib/cart-context'

function ProductTile({ product }) {
  const { addToCart } = useCart()
  return (
    <div className="group flex flex-col">
      {/* Full-bleed image, no card container, no border, no shadow */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Editorial info block */}
      <div className="pt-6 sm:pt-8 space-y-5">
        <div className="flex items-baseline justify-between gap-6">
          <h3 className="text-lg sm:text-xl font-light tracking-tight text-foreground">
            {product.name}
          </h3>
          <div className="text-lg font-light tabular-nums text-foreground/80">
            ${product.price}
          </div>
        </div>
        <p className="text-[10px] tracking-[0.25em] uppercase text-foreground/50">
          {product.tagline}
        </p>
        <p className="text-sm text-foreground/70 leading-loose max-w-md">
          {product.description}
        </p>

        {/* Refined thin outline CTA */}
        <button
          onClick={() => addToCart(product)}
          className="group/btn relative inline-flex items-center justify-center h-11 px-8 border border-foreground/50 text-[11px] tracking-[0.3em] uppercase text-foreground overflow-hidden transition-colors duration-300 hover:text-background"
        >
          <span className="absolute inset-0 bg-foreground translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" aria-hidden="true" />
          <span className="relative">Add to Bag</span>
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      {/* HERO */}
      <section className="container pt-24 pb-24 sm:pt-36 sm:pb-36">
        <div className="max-w-4xl">
          <div className="text-[10px] tracking-[0.45em] uppercase text-foreground/50 mb-10">
            AW — Adult Wellness · Est. 2025
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-light tracking-[-0.02em] leading-[1.02]">
            <span className="font-serif italic">Considered</span> pleasure.
            <br />
            <span className="text-foreground/50">Discreet delivery.</span>
          </h1>
          <p className="mt-12 max-w-xl text-foreground/60 text-base sm:text-lg leading-loose">
            A modern house of adult wellness objects — designed with restraint,
            shipped with discretion, and billed under a name no one will notice.
          </p>
          <div className="mt-14 flex flex-wrap gap-6 items-center">
            <a
              href="#shop"
              className="group/btn relative inline-flex items-center justify-center h-12 px-10 border border-foreground text-[11px] tracking-[0.3em] uppercase text-foreground overflow-hidden transition-colors duration-300 hover:text-background"
            >
              <span className="absolute inset-0 bg-foreground translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative">Shop the Collection</span>
            </a>
            <a
              href="#story"
              className="text-[11px] tracking-[0.3em] uppercase text-foreground/70 hover:text-foreground transition-colors underline underline-offset-[6px] decoration-foreground/20 hover:decoration-foreground"
            >
              Read our Story
            </a>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="story" className="border-y border-border">
        <div className="container py-24 sm:py-32">
          <div className="max-w-2xl mx-auto text-center space-y-10">
            <div className="text-[10px] tracking-[0.4em] uppercase text-foreground/50">
              Our Philosophy
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight leading-[1.35] text-foreground">
              We believe wellness is not a whisper.
              It is a <span className="font-serif italic">deliberate act</span> — an
              invitation to slow down, to consider the objects we bring into our most intimate
              moments, and to expect from them the same craft we demand from a good chair or a fine
              coffee.
            </p>
            <div className="h-px w-16 bg-foreground/30 mx-auto" />
            <p className="text-sm sm:text-base text-foreground/60 leading-loose max-w-lg mx-auto">
              Every object we ship is chosen for its materials, its restraint, and its silence.
              Nothing here is impulse. Everything is considered.
            </p>
            <div className="pt-4 text-[11px] tracking-[0.35em] uppercase text-foreground/50">
              — The AW Editors
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="shop" className="container py-24 sm:py-32">
        <div className="flex items-end justify-between mb-16 sm:mb-20">
          <div className="space-y-3">
            <div className="text-[10px] tracking-[0.35em] uppercase text-foreground/50">
              The Collection
            </div>
            <h2 className="text-4xl sm:text-5xl font-light tracking-[-0.01em]">
              Objects — <span className="font-serif italic">Three</span>
            </h2>
          </div>
          <div className="text-xs text-foreground/40 hidden sm:block max-w-[20ch] text-right leading-relaxed">
            Free discreet shipping on orders over $50
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 sm:gap-y-24">
          {PRODUCTS.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-border bg-card">
        <div className="container py-20 grid gap-12 sm:grid-cols-3">
          <div className="space-y-3">
            <Lock className="w-4 h-4 text-foreground/60" />
            <div className="text-sm font-medium tracking-tight text-foreground">Unmarked Packaging</div>
            <div className="text-xs text-foreground/55 leading-loose">
              Opaque outer box. No branding. No product name on any label.
            </div>
          </div>
          <div className="space-y-3">
            <ShieldCheck className="w-4 h-4 text-foreground/60" />
            <div className="text-sm font-medium tracking-tight text-foreground">Discreet Billing</div>
            <div className="text-xs text-foreground/55 leading-loose">
              Your statement reads{' '}
              <span className="text-foreground font-medium">AW Holdings LLC</span>{' '}
              — nothing else.
            </div>
          </div>
          <div className="space-y-3">
            <CheckCircle2 className="w-4 h-4 text-foreground/60" />
            <div className="text-sm font-medium tracking-tight text-foreground">Body-safe Materials</div>
            <div className="text-xs text-foreground/55 leading-loose">
              Medical-grade silicone, OEKO-TEX textiles, phthalate-free.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
