'use client'

import { X, Minus, Plus, ShoppingBag, Truck, Lock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useDialogLock } from '@/lib/use-dialog-lock'
import { SITE_CONFIG } from '@/config/site'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductArtwork from '@/components/product-artwork'

export default function CartSheet() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeItem,
    subtotal,
    appliedPromo,
    discountPercent,
    discountAmount,
    applyPromo,
    removePromo,
  } = useCart()

  const router = useRouter()
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  const closeCart = useCallback(() => setCartOpen(false), [setCartOpen])

  useDialogLock({
    open: cartOpen,
    onClose: closeCart,
    containerRef: panelRef,
    initialFocusRef: closeRef,
  })

  const handleApplyPromo = async () => {
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    const result = await applyPromo(code)
    if (!result.success) setPromoError(result.error || 'Invalid promo code.')
  }

  const handleRemovePromo = () => {
    removePromo()
    setPromoCode('')
    setPromoError('')
  }

  const finalTotal = Math.max(0, subtotal - discountAmount)
  const THRESHOLD = SITE_CONFIG.freeShippingThreshold
  const remaining = Math.max(0, THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / THRESHOLD) * 100)
  const freeUnlocked = remaining === 0

  const goCheckout = () => {
    setCartOpen(false)
    router.push('/checkout')
  }

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCart} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-theme-border bg-theme-bg pt-[env(safe-area-inset-top)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-theme-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-theme-accent" />
            <h2 className="font-syne text-lg font-semibold text-theme-text">Your cart</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center text-theme-muted transition-colors hover:text-theme-text"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <p className="py-12 text-center text-theme-muted">
              Your cart is empty.{' '}
              <Link href="/shop" onClick={closeCart} className="text-theme-accent underline underline-offset-2">
                Shop the edit
              </Link>
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-md border border-theme-border bg-theme-surface p-3"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-theme-border bg-theme-bg">
                  <ProductArtwork product={item} productId={item.id} category={item.category} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium text-theme-text">{item.name}</h4>
                  <p className="mt-0.5 text-sm tabular-nums text-theme-text/90">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-theme-border bg-theme-bg text-theme-text transition-colors hover:border-theme-accent/40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm tabular-nums text-theme-text">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-theme-border bg-theme-bg text-theme-text transition-colors hover:border-theme-accent/40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-start text-theme-muted transition-colors hover:text-theme-text"
                  aria-label="Remove item"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-4 border-t border-theme-border px-6 pt-4">
            <div className="rounded-md border border-theme-border bg-theme-surface p-3.5">
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-theme-muted" />
                {freeUnlocked ? (
                  <span className="text-sm font-medium text-theme-text">Free standard shipping unlocked</span>
                ) : (
                  <span className="text-sm text-theme-muted">
                    Add <strong className="text-theme-text">${remaining.toFixed(2)}</strong> more for free standard shipping
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-theme-bg">
                <div
                  className="h-full rounded-full bg-theme-accent transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div
            className="space-y-3 border-t border-theme-border px-6 py-4"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="checkout-input min-h-11 flex-1 px-3 py-1.5 text-xs"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="min-h-11 rounded-md bg-theme-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-theme-bg transition-opacity hover:opacity-90 active:translate-y-px"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-[11px] text-theme-accent">{promoError}</p>}
            {appliedPromo && discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs text-theme-accent">
                <span>
                  Promo ({appliedPromo}
                  {discountPercent > 0 ? ` — ${discountPercent}% off` : ''})
                </span>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="inline-flex h-11 min-w-11 items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-theme-muted">Subtotal</span>
              <span className="font-semibold tabular-nums text-theme-text">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-theme-accent">
                <span>
                  Discount
                  {discountPercent > 0 ? ` (${discountPercent}%)` : appliedPromo ? ` (${appliedPromo})` : ''}
                </span>
                <span className="tabular-nums">−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[11px] text-theme-muted">
              Standard shipping ${SITE_CONFIG.flatShippingRate.toFixed(2)} · free at $
              {SITE_CONFIG.freeShippingThreshold}+
            </p>
            <div className="flex justify-between border-t border-theme-border pt-2 text-base font-semibold">
              <span className="text-theme-text">Estimated merchandise</span>
              <span className="tabular-nums text-theme-text">${finalTotal.toFixed(2)}</span>
            </div>

            <button type="button" onClick={goCheckout} className="checkout-cta">
              <Lock size={14} aria-hidden="true" />
              Proceed to checkout
            </button>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block min-h-11 text-center text-xs uppercase tracking-widest text-theme-muted transition-colors hover:text-theme-text"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
