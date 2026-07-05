'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, Lock } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const genOrderId = () => 'AW-' + Math.floor(1000 + Math.random() * 9000)

export default function CheckoutDialog() {
  const router = useRouter()
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    subtotal,
    clearCart,
    ageVerified,
  } = useCart()

  const [processing, setProcessing] = useState(false)
  const [form, setForm] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
    card: '',
    exp: '',
    cvc: '',
  })

  // Reset processing flag when dialog re-opens.
  useEffect(() => {
    if (checkoutOpen) setProcessing(false)
  }, [checkoutOpen])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (processing) return
    setProcessing(true)

    const orderId = genOrderId()

    // Fire-and-forget the mock backend call in parallel.
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
        subtotal,
        billing: { ...form, card: '****' + form.card.slice(-4) },
        orderId,
      }),
    }).catch(() => {})

    // Exactly 2 seconds of "Processing Payment..." then redirect.
    setTimeout(() => {
      clearCart()
      setCheckoutOpen(false)
      router.push(`/order-confirmed?order=${orderId}`)
    }, 2000)
  }

  return (
    <Dialog
      open={checkoutOpen && ageVerified}
      onOpenChange={(o) => {
        if (processing) return // block close while processing
        setCheckoutOpen(o)
      }}
    >
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-2xl bg-black border border-white/15 text-white max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-6">
        {!processing && (
          <>
            <DialogHeader>
              <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase">
                Secure Checkout
              </div>
              <DialogTitle className="text-2xl font-light tracking-tight">
                Complete your order
              </DialogTitle>
              <DialogDescription className="text-white/50 text-xs">
                Your credit card statement will discreetly read as{' '}
                <span className="text-white font-medium">AW Holdings LLC</span>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-white/60">Contact</div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-white/70">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40"
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-white/60">Shipping</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name" className="text-xs text-white/70">Full name</Label>
                    <Input id="name" name="name" required autoComplete="name" value={form.name} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-xs text-white/70">Address</Label>
                    <Input id="address" name="address" required autoComplete="street-address" value={form.address} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs text-white/70">City</Label>
                    <Input id="city" name="city" required autoComplete="address-level2" value={form.city} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-xs text-white/70">ZIP / Postal</Label>
                    <Input id="zip" name="zip" required inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs tracking-[0.2em] uppercase text-white/60">Payment</div>
                  <div className="flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-widest">
                    <Lock className="w-3 h-3" /> Encrypted
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  <div className="space-y-2 col-span-2 sm:col-span-6">
                    <Label htmlFor="card" className="text-xs text-white/70">Card number</Label>
                    <Input id="card" name="card" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={form.card} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 col-span-1 sm:col-span-3">
                    <Label htmlFor="exp" className="text-xs text-white/70">Expiry (MM/YY)</Label>
                    <Input id="exp" name="exp" required inputMode="numeric" autoComplete="cc-exp" placeholder="12/28" value={form.exp} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 col-span-1 sm:col-span-3">
                    <Label htmlFor="cvc" className="text-xs text-white/70">CVC</Label>
                    <Input id="cvc" name="cvc" required inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={form.cvc} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-12 text-base sm:text-sm text-white focus-visible:ring-white/40" />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Order total</span>
                <span className="text-lg font-light tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                className="w-full rounded-none bg-white text-black hover:bg-white/90 h-12 font-medium tracking-wide"
              >
                Place Order · ${subtotal.toFixed(2)}
              </Button>
              <p className="text-[10px] text-white/40 text-center leading-relaxed">
                By placing this order you agree to our{' '}
                <Link href="/terms-of-service" className="underline hover:text-white">Terms of Service</Link>,{' '}
                <Link href="/refund-policy" className="underline hover:text-white">Refund Policy</Link>, and{' '}
                <Link href="/privacy-policy" className="underline hover:text-white">Privacy Policy</Link>.
              </p>
            </form>
          </>
        )}

        {processing && (
          <div
            role="status"
            aria-live="polite"
            className="py-20 flex flex-col items-center justify-center gap-6"
          >
            <Loader2 className="w-10 h-10 animate-spin text-white/70" />
            <div className="text-center space-y-2">
              <div className="text-lg font-light">Processing Payment…</div>
              <div className="text-xs text-white/50">Do not close this window.</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
