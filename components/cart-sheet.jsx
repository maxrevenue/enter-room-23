'use client'

import { X, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeCart} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l pt-[env(safe-area-inset-top)] shadow-2xl"
        style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{ color: 'var(--accent)' }} />
            <h2 className="font-[var(--font-syne)] text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Your Cart
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <p className="py-12 text-center" style={{ color: 'var(--color-text-muted)' }}>
              Your cart is empty.{' '}
              <Link href="/shop" onClick={closeCart} className="underline">
                Shop the edit
              </Link>
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border p-3"
                style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-light)' }}
              >
                <div
                  className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border"
                  style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-light)' }}
                >
                  <ProductArtwork product={item} productId={item.id} category={item.category} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {item.name}
                  </h4>
                  <p className="mt-0.5 text-sm" style={{ color: 'var(--accent)' }}>
                    ${Number(item.price).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center self-start"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="space-y-4 border-t px-6 pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="rounded-xl border p-3.5" style={{ borderColor: 'var(--color-border)' }}>
              <div className="mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4 flex-shrink-0" />
                {freeUnlocked ? (
                  <span className="text-sm font-semibold">Free standard shipping unlocked</span>
                ) : (
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Add <strong>${remaining.toFixed(2)}</strong> more for free standard shipping
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div
            className="space-y-3 border-t px-6 py-4"
            style={{
              borderColor: 'var(--color-border)',
              paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="min-h-11 flex-1 rounded border px-3 py-1.5 text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="min-h-11 rounded px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--bg)', backgroundColor: 'var(--accent)' }}
              >
                Apply
              </button>
            </div>
            {promoError && (
              <p className="text-[11px]" style={{ color: 'var(--accent)' }}>
                {promoError}
              </p>
            )}
            {appliedPromo && discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--accent)' }}>
                <span>
                  Promo ({appliedPromo}
                  {discountPercent > 0 ? ` — ${discountPercent}% OFF` : ''})
                </span>
                <button type="button" onClick={handleRemovePromo} className="inline-flex h-11 min-w-11 items-center justify-center">
                  ×
                </button>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs" style={{ color: 'var(--accent)' }}>
                <span>
                  Discount
                  {discountPercent > 0 ? ` (${discountPercent}%)` : appliedPromo ? ` (${appliedPromo})` : ''}
                </span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              Standard shipping ${SITE_CONFIG.flatShippingRate.toFixed(2)} · free at $
              {SITE_CONFIG.freeShippingThreshold}+
            </p>
            <div className="flex justify-between border-t pt-1 text-base font-semibold" style={{ borderColor: 'var(--color-border)' }}>
              <span>Estimated merchandise</span>
              <span style={{ color: 'var(--accent)' }}>${finalTotal.toFixed(2)}</span>
            </div>

            <button type="button" onClick={goCheckout} className="btn-primary w-full py-3">
              Proceed to Checkout
            </button>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block min-h-11 text-center text-xs uppercase tracking-widest"
              style={{ color: 'var(--color-text-muted)' }}
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
