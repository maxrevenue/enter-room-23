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
    cart, cartOpen, setCartOpen, setCheckoutOpen,
    updateQty, removeItem, subtotal, ageVerified,
  } = useCart()

  const startCheckout = () => { setCartOpen(false); setCheckoutOpen(true) }

  return (
    <Sheet open={cartOpen && ageVerified} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="bg-background border-l border-border text-foreground w-full sm:max-w-md flex flex-col p-6"
      >
        <SheetHeader className="space-y-1">
          <div className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">The Bag</div>
          <SheetTitle className="text-foreground text-2xl font-light tracking-tight">
            Your Selection
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-8 space-y-6">
          {cart.length === 0 && (
            <div className="text-foreground/50 text-sm text-center py-16 leading-loose">
              Your bag is empty.
            </div>
          )}
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 pb-6 border-b border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-24 object-cover bg-muted"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  <div className="text-xs text-foreground/50 mt-1 tabular-nums">${item.price}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 border border-border">
                    <button
                      className="w-7 h-7 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center tabular-nums">{item.qty}</span>
                    <button
                      className="w-7 h-7 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-foreground/40 hover:text-foreground transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter className="border-t border-border pt-5 flex-col gap-4 sm:flex-col">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground/60">Subtotal</span>
            <span className="tabular-nums text-lg font-light">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/40">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <Button
            disabled={cart.length === 0}
            onClick={startCheckout}
            className="w-full rounded-none bg-foreground text-background hover:bg-foreground/90 h-12 font-medium tracking-[0.2em] uppercase text-xs disabled:opacity-30"
          >
            Proceed to Checkout
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.25em] text-foreground/40 uppercase">
            <Lock className="w-3 h-3" /> Discreet Shipping &amp; Billing
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
