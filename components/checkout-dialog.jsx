'use client'

import CheckoutForm from '@/components/checkout-form'
import { useCart } from '@/lib/cart-context'
import { X } from 'lucide-react'

/** Optional overlay. The chargeable path is /checkout. */
export default function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen } = useCart()
  if (!checkoutOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
        onClick={() => setCheckoutOpen(false)}
      />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne text-xl">Secure Checkout</h2>
          <button type="button" onClick={() => setCheckoutOpen(false)} aria-label="Close checkout">
            <X size={20} />
          </button>
        </div>
        <CheckoutForm />
      </div>
    </div>
  )
}
