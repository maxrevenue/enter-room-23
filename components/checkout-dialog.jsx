'use client'

import { X, Check } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen, cart, subtotal, clearCart } = useCart()

  if (!checkoutOpen) return null

  const handleCheckout = () => {
    // TODO: Integrate payment processor (NMI)
    clearCart()
    setCheckoutOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setCheckoutOpen(false)}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#800020]/30 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setCheckoutOpen(false)}
          className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#C9A060]/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-[#C9A060]" />
          </div>
          <h2 className="text-xl font-semibold text-white font-[var(--font-syne)]">Checkout</h2>
          <p className="text-white/40 text-sm mt-1">Complete your order securely</p>
        </div>

        {/* Order Summary */}
        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-white/60 truncate flex-1 mr-4">{item.name} × {item.qty}</span>
              <span className="text-white">${item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-4 mb-6">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-white/60">Total</span>
            <span className="text-[#C9A060]">${subtotal}</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-[#C9A060] text-black font-bold rounded-xl hover:bg-[#D4B070] transition-colors text-sm tracking-widest uppercase"
        >
          Place Order — ${subtotal}
        </button>

        <p className="text-white/20 text-xs text-center mt-4">
          Secure payment processing · Discreet billing
        </p>
      </div>
    </div>
  )
}
