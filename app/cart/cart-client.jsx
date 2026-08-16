'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPageClient() {
  const {
    cart,
    updateQty,
    removeItem,
    subtotal,
    setCheckoutOpen,
    discountAmount,
    appliedPromo,
  } = useCart()

  const shipping =
    subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const total = Math.max(0, subtotal - discountAmount) + shipping

  useEffect(() => {
    // Prefer full-page cart over overlay when visiting /cart
  }, [])

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-white">Your cart</h1>
        <p className="mt-4 text-sm text-zinc-400">Your cart is empty.</p>
        <Link
          href="/shop"
          className="mt-10 inline-flex bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:bg-zinc-200"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="font-serif text-3xl text-white">Your cart</h1>
        <ul className="mt-10 space-y-6">
          {cart.map((item) => (
            <li key={item.id} className="flex gap-4 border-b border-zinc-800 pb-6">
              <div className="h-24 w-20 shrink-0 overflow-hidden border border-zinc-800 bg-zinc-900">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.id)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="border border-zinc-800 p-1.5 text-zinc-400 hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm text-zinc-300">{item.qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="border border-zinc-800 p-1.5 text-zinc-400 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">Summary</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-zinc-400">
            <dt>Subtotal</dt>
            <dd>${subtotal.toFixed(2)}</dd>
          </div>
          {appliedPromo ? (
            <div className="flex justify-between text-zinc-400">
              <dt>Discount ({appliedPromo})</dt>
              <dd>−${discountAmount.toFixed(2)}</dd>
            </div>
          ) : null}
          <div className="flex justify-between text-zinc-400">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-800 pt-3 text-white">
            <dt>Total</dt>
            <dd>${total.toFixed(2)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
          Free standard shipping over ${SITE_CONFIG.freeShippingThreshold.toFixed(0)}. Charges appear as{' '}
          {SITE_CONFIG.billingDescriptor}.
        </p>
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="mt-6 w-full bg-white py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:bg-zinc-200"
        >
          Checkout
        </button>
        <Link
          href="/shop"
          className="mt-4 block text-center text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  )
}
