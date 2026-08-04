'use client'

import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartSheet() {
  const { cartOpen, setCartOpen, cart, updateQty, removeItem, subtotal, setCheckoutOpen } = useCart()

  if (!cartOpen) return null

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

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-[#800020]/20 space-y-3">
            <div className="flex justify-between text-white">
              <span className="text-white/60">Subtotal</span>
              <span className="font-semibold">${subtotal}</span>
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
