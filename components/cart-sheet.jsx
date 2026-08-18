'use client'

import { X, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { useState } from 'react'
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

  if (!cartOpen) return null

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

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l shadow-2xl flex flex-col" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-semibold font-[var(--font-syne)]" style={{ color: 'var(--color-text-primary)' }}>Your Cart</h2>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2" style={{ color: 'var(--color-text-muted)' }} aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
              Your cart is empty.{' '}
              <Link href="/shop" onClick={() => setCartOpen(false)} className="underline">Shop the edit</Link>
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-light)' }}>
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-light)' }}>
                  <ProductArtwork product={item} productId={item.id} category={item.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--accent)' }}>${Number(item.price).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" aria-label="Decrease">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" aria-label="Increase">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="self-start mt-1" aria-label="Remove">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 space-y-4 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="rounded-xl p-3.5 border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 flex-shrink-0" />
                {freeUnlocked ? (
                  <span className="text-sm font-semibold">Free standard shipping unlocked</span>
                ) : (
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Add <strong>${remaining.toFixed(2)}</strong> more for free standard shipping
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        )}

        {cart.length > 0 && (
          <div className="px-6 py-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-1.5 text-xs border rounded focus:outline-none"
                style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
              />
              <button onClick={handleApplyPromo} className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded" style={{ color: 'var(--bg)', backgroundColor: 'var(--accent)' }}>
                Apply
              </button>
            </div>
            {promoError && <p className="text-[11px]" style={{ color: 'var(--accent)' }}>{promoError}</p>}
            {appliedPromo && discountAmount > 0 && (
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--accent)' }}>
                <span>
                  Promo ({appliedPromo}
                  {discountPercent > 0 ? ` — ${discountPercent}% OFF` : ''})
                </span>
                <button onClick={handleRemovePromo}>×</button>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs" style={{ color: 'var(--accent)' }}>
                <span>Discount{discountPercent > 0 ? ` (${discountPercent}%)` : appliedPromo ? ` (${appliedPromo})` : ''}</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              Standard shipping ${SITE_CONFIG.flatShippingRate.toFixed(2)} · free at ${SITE_CONFIG.freeShippingThreshold}+
            </p>
            <div className="flex justify-between font-semibold text-base pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <span>Estimated merchandise</span>
              <span style={{ color: 'var(--accent)' }}>${finalTotal.toFixed(2)}</span>
            </div>

            <button onClick={goCheckout} className="w-full btn-primary py-3">
              Proceed to Checkout
            </button>
            <Link href="/cart" onClick={() => setCartOpen(false)} className="block text-center text-xs uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
