'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPageClient() {
  const router = useRouter()
  const {
    cart,
    updateQty,
    removeItem,
    subtotal,
    discountAmount,
    appliedPromo,
  } = useCart()

  const shipping =
    subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const total = Math.max(0, subtotal - discountAmount) + shipping

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-theme-text">Your cart</h1>
        <p className="mt-4 text-sm text-theme-muted">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-10 inline-flex bg-primary px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-serif text-3xl text-theme-text">Your cart</h1>
        <ul className="mt-10 space-y-6">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 border-b border-theme-border pb-6">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-theme-border bg-theme-surface">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    width={80}
                    height={96}
                    unoptimized
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-theme-text">{item.name}</p>
                    <p className="mt-1 text-xs text-theme-muted">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                    className="inline-flex h-11 w-11 items-center justify-center text-theme-muted hover:text-theme-text"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="inline-flex h-11 w-11 items-center justify-center border border-theme-border text-theme-muted hover:text-theme-text"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm text-theme-text/80">{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="inline-flex h-11 w-11 items-center justify-center border border-theme-border text-theme-muted hover:text-theme-text"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-theme-border bg-theme-surface p-6">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-theme-muted">Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-theme-muted">
            <dt>Subtotal</dt>
            <dd>${subtotal.toFixed(2)}</dd>
          </div>
          {appliedPromo ? (
            <div className="flex justify-between text-theme-muted">
              <dt>Discount ({appliedPromo})</dt>
              <dd>−${discountAmount.toFixed(2)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between text-theme-muted">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
          </div>
          <div className="flex justify-between border-t border-theme-border pt-3 text-theme-text">
            <dt>Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] leading-relaxed text-theme-muted">
          Free standard shipping over ${SITE_CONFIG.freeShippingThreshold.toFixed(0)}. Charges appear as{' '}
          {SITE_CONFIG.billingDescriptor}.
        </p>
        <button
          type="button"
          onClick={() => router.push('/checkout')}
          className="mt-6 w-full bg-primary py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90"
        >
          Checkout
        </button>
        <Link
          href="/shop"
          className="mt-4 block text-center text-[10px] uppercase tracking-[0.2em] text-theme-muted hover:text-theme-text/80"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  )
}
