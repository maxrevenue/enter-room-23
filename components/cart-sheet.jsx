'use client'

import { X, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { useState } from 'react'
import ProductArtwork from '@/components/product-artwork'
import Link from 'next/link'

export default function CartSheet() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeItem,
    subtotal,
    setCheckoutOpen,
    appliedPromo,
    discountPercent,
    discountAmount,
    applyPromo,
    removePromo,
  } = useCart()

  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')

  if (!cartOpen) return null

  // ── Promo Code Logic ──
  const handleApplyPromo = () => {
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    const result = applyPromo(code)
    if (!result.success) {
      setPromoError('Invalid promo code.')
    }
  }

  const handleRemovePromo = () => {
    removePromo()
    setPromoCode('')
    setPromoError('')
  }

  const shippingCost =
    subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingCost

  // ── Free Shipping Progress ──
  const THRESHOLD = SITE_CONFIG.freeShippingThreshold
  const remaining = Math.max(0, THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / THRESHOLD) * 100)
  const freeUnlocked = remaining === 0

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Sheet */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" style={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: '#C8102E' }} />
            <h2 className="text-lg font-semibold font-[var(--font-syne)]" style={{ color: 'var(--color-text-primary)' }}>Your Cart</h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-light)' }}>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-light)' }}>
                  <ProductArtwork productId={item.id} category={item.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                  <p className="text-sm mt-0.5" style={{ color: '#C8102E' }}>${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                      style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center" style={{ color: 'var(--color-text-primary)' }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full border flex items-center justify-center transition-colors"
                      style={{ color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--color-emerald)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="transition-colors self-start mt-1"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseOver={e => e.currentTarget.style.color = 'var(--color-accent)'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Cart Upgrades ── */}
        {cart.length > 0 && (
          <div className="px-6 space-y-4 border-t pt-4" style={{ borderColor: 'var(--color-border)' }}>
            {/* ── Free Shipping Progress Bar ── */}
            <div
              className="rounded-xl p-3.5 border"
              style={{ backgroundColor: freeUnlocked ? 'rgba(235,104,36,0.1)' : 'transparent', borderColor: 'var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Truck
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: freeUnlocked ? '#eb6824' : 'var(--color-text-muted)' }}
                />
                {freeUnlocked ? (
                  <span className="text-sm font-semibold text-[#eb6824]">
                    Free Shipping Unlocked!
                  </span>
                ) : (
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Add <strong className="text-[#eb6824]">${remaining.toFixed(2)}</strong> more for{' '}
                    <strong>FREE Shipping</strong>
                  </span>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: freeUnlocked ? '#eb6824' : '#eb6824',
                    opacity: freeUnlocked ? 1 : 0.7,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t space-y-3" style={{ borderColor: 'var(--color-border)' }}>
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs border rounded focus:outline-none"
                  style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                  style={{ color: '#FFFFFF', backgroundColor: '#C8102E' }}
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px]" style={{ color: '#C8102E' }}>{promoError}</p>
              )}
              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-xs" style={{ color: '#C8102E' }}>
                  <span>Promo ({appliedPromo} — {discountPercent}% OFF)</span>
                  <button onClick={handleRemovePromo} className="ml-2 transition-colors" style={{ color: 'var(--color-text-muted)' }} onMouseOver={e => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}>×</button>
                </div>
              )}
            </div>

            <div className="flex justify-between text-sm" style={{ color: 'var(--color-text-primary)' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-xs" style={{ color: '#C8102E' }}>
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-base pt-1 border-t" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}>
              <span>Estimated Total</span>
              <span style={{ color: '#C8102E' }}>${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}
              className="w-full btn-primary py-3"
            >
              Proceed to Checkout
            </button>
            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="block text-center text-[10px] uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
