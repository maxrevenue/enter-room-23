'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Lock, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export default function CartSheet() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    setCheckoutOpen,
    updateQty,
    removeItem,
    subtotal,
    ageVerified,
  } = useCart()

  const startCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <Sheet open={cartOpen && ageVerified} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="bg-black border-l border-white/10 text-white w-full sm:max-w-md flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-xl font-light tracking-tight">
            Your Bag
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {cart.length === 0 && (
            <div className="text-white/50 text-sm text-center py-16">Your bag is empty.</div>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-24 object-cover bg-neutral-900"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-white/50 mt-1">${item.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 border border-white/15">
                    <button
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/5"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center tabular-nums">{item.qty}</span>
                    <button
                      className="w-7 h-7 flex items-center justify-center hover:bg-white/5"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/40 hover:text-white"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter className="border-t border-white/10 pt-4 flex-col gap-3 sm:flex-col">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <Button
            disabled={cart.length === 0}
            onClick={startCheckout}
            className="w-full rounded-none bg-white text-black hover:bg-white/90 h-11 font-medium tracking-wide disabled:opacity-30"
          >
            Proceed to Checkout
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-white/40 uppercase">
            <Lock className="w-3 h-3" /> Discreet Shipping & Billing
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
