'use client'

import { X, Minus, Plus, ShoppingBag, Truck, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { useState } from 'react'
import ProductArtwork from '@/components/product-artwork'

// ── Instant Cross-sell Addons ──
const CROSS_SELLS = [
  {
    id: 'addon-cleaner-01',
    name: 'Antibacterial Cleansing Spray',
    price: 14.0,
    desc: 'pH-balanced toy & surface cleaner. 4 oz.',
  },
  {
    id: 'addon-pouch-01',
    name: 'Satin Storage Pouch',
    price: 12.0,
    desc: 'Anti-static, drawstring closure. Fits all Room 23 items.',
  },
]

export default function CartSheet() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    updateQty,
    removeItem,
    subtotal,
    addToCart,
    setCheckoutOpen,
  } = useCart()

  const [addedAddons, setAddedAddons] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')

  if (!cartOpen) return null

  // ── Promo Code Logic ──
  const handleApplyPromo = () => {
    setPromoError('')
    const code = promoCode.trim().toUpperCase()
    if (!code) return
    if (code === 'SOFTLAUNCH10' || code === 'ROOM23' || code === 'WELCOME10') {
      setAppliedPromo(code)
      setDiscountPercent(10)
      setPromoError('')
    } else {
      setPromoError('Invalid code. Try "SOFTLAUNCH10"')
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo('')
    setDiscountPercent(0)
    setPromoCode('')
    setPromoError('')
  }

  const discountAmount = (subtotal * discountPercent) / 100
  const finalTotal = Math.max(0, subtotal - discountAmount)

  // ── Free Shipping Progress ──
  const THRESHOLD = SITE_CONFIG.freeShippingThreshold
  const remaining = Math.max(0, THRESHOLD - subtotal)
  const pct = Math.min(100, (subtotal / THRESHOLD) * 100)
  const freeUnlocked = remaining === 0

  const handleAddAddon = (addon) => {
    addToCart(addon)
    setAddedAddons((prev) => [...prev, addon.id])
    setTimeout(() => setAddedAddons((prev) => prev.filter((id) => id !== addon.id)), 1500)
  }

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
            <ShoppingBag className="w-5 h-5 text-[#eb6824]" />
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
            <p className="text-[#5C786E] text-center py-12">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border" style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-light)' }}>
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border" style={{ backgroundColor: 'var(--color-bg-primary)', borderColor: 'var(--color-border-light)' }}>
                  <ProductArtwork productId={item.id} category={item.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.name}</h4>
                  <p className="text-[#eb6824] text-sm mt-0.5">${item.price}</p>
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
                    <strong>FREE Discreet Shipping</strong>
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

            {/* ── One-Click Cross-Sells ── */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#eb6824]" />
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5C786E]">
                  Complete Your Order
                </span>
              </div>
              <div className="space-y-2">
                {CROSS_SELLS.map((addon) => {
                  const justAdded = addedAddons.includes(addon.id)
                  const alreadyInCart = cart.some((i) => i.id === addon.id)

                  if (alreadyInCart) return null

                  return (
                    <div
                      key={addon.id}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                      style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border-light)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{addon.name}</h4>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{addon.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#eb6824] mb-1">
                          ${addon.price.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleAddAddon(addon)}
                          disabled={justAdded}
                          className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-all duration-200 border"
                          style={{
                            borderColor: justAdded ? '#eb6824' : 'rgba(235,104,36,0.4)',
                            color: justAdded ? '#eb6824' : '#eb6824',
                            backgroundColor: justAdded ? 'rgba(235,104,36,0.1)' : 'transparent',
                          }}
                        >
                          {justAdded ? 'Added!' : 'Add'}
                        </button>
                      </div>
                    </div>
                  )
                })}
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
                  placeholder="Promo Code (e.g. SOFTLAUNCH10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs border rounded focus:outline-none focus:border-[#eb6824]"
                  style={{ backgroundColor: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                />
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#eb6824] rounded hover:bg-[#d95816] transition-colors"
                  style={{ color: '#FFFFFF' }}
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-[#eb6824]">{promoError}</p>
              )}
              {discountPercent > 0 && (
                <div className="flex items-center justify-between text-xs text-[#eb6824]">
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
              <div className="flex justify-between text-xs text-[#eb6824]">
                <span>Discount ({discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-base pt-1 border-t" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' }}>
              <span>Estimated Total</span>
              <span className="text-[#eb6824]">${finalTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}
              className="w-full btn-primary py-3"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
