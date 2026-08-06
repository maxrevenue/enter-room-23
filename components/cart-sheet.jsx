'use client'

import { X, Minus, Plus, ShoppingBag, Truck, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { useState } from 'react'

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

  if (!cartOpen) return null

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setCartOpen(false)}
      />

      {/* Sheet */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-black border-l border-[#800020]/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#800020]/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A060]" />
            <h2 className="text-lg font-semibold text-white font-[var(--font-syne)]">Your Cart</h2>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-white/40 text-center py-12">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                <div className="w-16 h-16 rounded bg-[#800020]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#C9A060] text-xs font-mono">{item.id.slice(-4)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                  <p className="text-[#C9A060] text-sm mt-0.5">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-sm w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-white/20 hover:text-red-400 transition-colors self-start mt-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Cart Upgrades ── */}
        {cart.length > 0 && (
          <div className="px-6 space-y-4 border-t border-[#800020]/20 pt-4">
            {/* ── Free Shipping Progress Bar ── */}
            <div
              className="rounded-xl p-3.5 border border-white/10"
              style={{ backgroundColor: freeUnlocked ? 'rgba(201,160,96,0.1)' : 'rgba(255,255,255,0.02)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Truck
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: freeUnlocked ? '#C9A060' : 'rgba(255,255,255,0.4)' }}
                />
                {freeUnlocked ? (
                  <span className="text-sm font-semibold text-[#C9A060]">
                    Free Shipping Unlocked!
                  </span>
                ) : (
                  <span className="text-sm text-white/70">
                    Add <strong className="text-[#C9A060]">${remaining.toFixed(2)}</strong> more for{' '}
                    <strong>FREE Discreet Shipping</strong>
                  </span>
                )}
              </div>
              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: freeUnlocked ? '#C9A060' : '#C9A060',
                    opacity: freeUnlocked ? 1 : 0.7,
                  }}
                />
              </div>
            </div>

            {/* ── One-Click Cross-Sells ── */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A060]" />
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/50">
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
                      className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02]"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{addon.name}</h4>
                        <p className="text-xs text-white/30 mt-0.5">{addon.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#C9A060] mb-1">
                          ${addon.price.toFixed(2)}
                        </p>
                        <button
                          onClick={() => handleAddAddon(addon)}
                          disabled={justAdded}
                          className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full transition-all duration-200 border"
                          style={{
                            borderColor: justAdded ? '#C9A060' : 'rgba(201,160,96,0.4)',
                            color: justAdded ? '#C9A060' : '#C9A060',
                            backgroundColor: justAdded ? 'rgba(201,160,96,0.1)' : 'transparent',
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
          <div className="px-6 py-4 border-t border-[#800020]/20 space-y-3">
            <div className="flex justify-between text-white">
              <span className="text-white/60">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { setCartOpen(false); setCheckoutOpen(true) }}
              className="w-full py-3 bg-[#C9A060] text-black font-semibold rounded-lg hover:bg-[#D4B070] transition-colors text-sm tracking-wide"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
