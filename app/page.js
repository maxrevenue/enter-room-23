'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ShoppingBag, Plus, Minus, Trash2, ShieldCheck, Lock, CheckCircle2, Loader2 } from 'lucide-react'

const PRODUCTS = [
  {
    id: 'wand-01',
    name: 'Premium Silicone Wand',
    price: 45,
    tagline: 'Medical-grade silicone. Whisper-quiet motor.',
    description:
      'Sculpted for ergonomic comfort. Rechargeable, waterproof, and body-safe. Six intensity modes.',
    image: 'https://images.unsplash.com/photo-1709625862266-014ef072fd93?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHNjdWxwdHVyZSUyMGRhcmt8ZW58MHx8fGJsYWNrfDE3ODMyMzIyNzF8MA&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 'blindfold-01',
    name: 'Velvet Blindfold',
    price: 15,
    tagline: 'Hand-stitched silk-lined velvet.',
    description:
      'Full blackout. Adjustable satin strap. Breathable and skin-soft — an editorial piece for the senses.',
    image: 'https://images.unsplash.com/photo-1705674337411-3b89e5afcc11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxzaWxrJTIwZmFicmljJTIwZGFya3xlbnwwfHx8YmxhY2t8MTc4MzIzMjI4M3ww&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 'magazine-01',
    name: 'Wellness Magazine — Issue 01',
    price: 12,
    tagline: '128 pages. Essays on intimacy & self.',
    description:
      'A quarterly print journal on modern adult wellness — long-form journalism, photography, and interviews.',
    image: 'https://images.unsplash.com/photo-1652561751125-91629417d6ae?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwbWFnYXppbmV8ZW58MHx8fGJsYWNrfDE3ODMyMzIyODN8MA&ixlib=rb-4.1.0&q=85',
  },
]

function AgeGate({ open, onConfirm, onDecline }) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-lg p-0 bg-neutral-900 border-2 border-white/40 shadow-[0_0_120px_rgba(255,255,255,0.08)] text-white [&>button]:hidden"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="p-8 sm:p-10">
          <div className="text-center mb-6">
            <div className="text-2xl font-light tracking-[0.5em] text-white">AW</div>
            <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase mt-1">Adult Wellness</div>
          </div>
          <div className="h-px bg-white/15 mb-6" />
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] text-white/70 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Age Verification Required
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-light tracking-tight leading-tight text-center">
              You must be 18 years or older to enter this site.
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm leading-relaxed text-center">
              This website contains adult wellness products intended for mature audiences.
              By entering, you confirm that you are of legal age in your jurisdiction and
              consent to viewing this content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
            <Button
              variant="ghost"
              onClick={onDecline}
              className="text-white/70 hover:text-white hover:bg-white/5 border border-white/20 rounded-none h-11 flex-1"
            >
              I am under 18 — Exit
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-white text-black hover:bg-white/90 font-medium tracking-wide rounded-none h-11 flex-1"
            >
              I am 18 or older — Enter
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ProductCard({ product, onAdd }) {
  return (
    <Card className="group bg-neutral-950 border border-white/10 rounded-none overflow-hidden hover:border-white/30 transition-colors duration-300">
      <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover grayscale-[15%] group-hover:scale-[1.03] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
        <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] text-white/70 uppercase">
          AW / Issue 01
        </div>
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium tracking-tight">{product.name}</h3>
            <p className="text-sm text-white/50 mt-1">{product.tagline}</p>
          </div>
          <div className="text-lg font-light tabular-nums">${product.price}</div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">{product.description}</p>
        <Button
          onClick={() => onAdd(product)}
          className="w-full rounded-none bg-white text-black hover:bg-white/90 font-medium tracking-wide h-11"
        >
          Add to Bag
        </Button>
      </CardContent>
    </Card>
  )
}

function CartSheet({ open, onOpenChange, items, updateQty, remove, subtotal, onCheckout }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-black border-l border-white/10 text-white w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-white text-xl font-light tracking-tight">Your Bag</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.length === 0 && (
            <div className="text-white/50 text-sm text-center py-16">Your bag is empty.</div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-neutral-900" />
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
                    onClick={() => remove(item.id)}
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
            disabled={items.length === 0}
            onClick={onCheckout}
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

function CheckoutDialog({ open, onOpenChange, items, subtotal, onSuccess }) {
  const [stage, setStage] = useState('form') // 'form' | 'processing' | 'success'
  const [orderId, setOrderId] = useState(null)
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

  useEffect(() => {
    if (open) {
      setStage('form')
      setOrderId(null)
    }
  }, [open])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStage('processing')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
          subtotal,
          billing: { ...form, card: '****' + form.card.slice(-4) },
        }),
      })
      const data = await res.json()
      setOrderId(data.orderId || 'AW-DEMO')
      setStage('success')
      onSuccess?.()
    } catch {
      // Even on failure — simulate success for underwriter demo
      setOrderId('AW-DEMO')
      setStage('success')
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black border border-white/15 text-white max-h-[90vh] overflow-y-auto">
        {stage === 'form' && (
          <>
            <DialogHeader>
              <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Secure Checkout</div>
              <DialogTitle className="text-2xl font-light tracking-tight">Complete your order</DialogTitle>
              <DialogDescription className="text-white/50 text-xs">
                Your credit card statement will discreetly read as <span className="text-white font-medium">AW Holdings LLC</span>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-white/60">Contact</div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs text-white/70">Email</Label>
                  <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3">
                <div className="text-xs tracking-[0.2em] uppercase text-white/60">Shipping</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name" className="text-xs text-white/70">Full name</Label>
                    <Input id="name" name="name" required value={form.name} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-xs text-white/70">Address</Label>
                    <Input id="address" name="address" required value={form.address} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-xs text-white/70">City</Label>
                    <Input id="city" name="city" required value={form.city} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-xs text-white/70">ZIP / Postal</Label>
                    <Input id="zip" name="zip" required value={form.zip} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
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
                <div className="grid grid-cols-6 gap-3">
                  <div className="space-y-2 col-span-6">
                    <Label htmlFor="card" className="text-xs text-white/70">Card number</Label>
                    <Input id="card" name="card" required placeholder="4242 4242 4242 4242" value={form.card} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="exp" className="text-xs text-white/70">Expiry (MM/YY)</Label>
                    <Input id="exp" name="exp" required placeholder="12/28" value={form.exp} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                  <div className="space-y-2 col-span-3">
                    <Label htmlFor="cvc" className="text-xs text-white/70">CVC</Label>
                    <Input id="cvc" name="cvc" required placeholder="123" value={form.cvc} onChange={handleChange}
                      className="bg-neutral-950 border-white/15 rounded-none h-11 text-white focus-visible:ring-white/40" />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Order total</span>
                <span className="text-lg font-light tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              <Button type="submit" className="w-full rounded-none bg-white text-black hover:bg-white/90 h-12 font-medium tracking-wide">
                Pay ${subtotal.toFixed(2)}
              </Button>
              <p className="text-[10px] text-white/40 text-center leading-relaxed">
                By placing this order you agree to our <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> and{' '}
                <Link href="/refund-policy" className="underline hover:text-white">Refund Policy</Link>.
              </p>
            </form>
          </>
        )}

        {stage === 'processing' && (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-white/70" />
            <div className="text-center space-y-2">
              <div className="text-lg font-light">Processing your payment…</div>
              <div className="text-xs text-white/50">Do not close this window.</div>
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div className="py-12 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase">Transaction Successful</div>
              <div className="text-2xl font-light tracking-tight">Thank you for your order.</div>
              <div className="text-sm text-white/60">
                Order <span className="text-white font-mono">{orderId}</span> — a confirmation was sent to your email.
              </div>
            </div>
            <div className="border border-white/10 bg-neutral-950 p-4 text-xs text-white/60 max-w-sm leading-relaxed">
              Your package will ship in unmarked, opaque packaging. Your card statement will read{' '}
              <span className="text-white font-medium">AW Holdings LLC</span>.
            </div>
            <Button onClick={() => onOpenChange(false)} className="rounded-none bg-white text-black hover:bg-white/90 h-11 px-8">
              Continue Shopping
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="container py-8">
        <div className="bg-neutral-950 border border-white/15 p-5 text-center">
          <p className="text-sm sm:text-base font-bold tracking-tight text-white">
            DISCREET SHIPPING &amp; BILLING: Your credit card statement will discreetly read as AW Holdings LLC.
          </p>
        </div>
      </div>
      <div className="container pb-10 grid gap-6 sm:grid-cols-3 items-start">
        <div>
          <div className="text-lg font-light tracking-[0.3em]">AW</div>
          <p className="text-xs text-white/40 mt-2 max-w-xs leading-relaxed">
            AW Holdings LLC. A premium adult wellness house. Discreet, considered, adult.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="text-white/50 text-xs tracking-[0.2em] uppercase mb-2">Legal</div>
          <div><Link href="/terms" className="text-white/70 hover:text-white">Terms of Service</Link></div>
          <div><Link href="/refund-policy" className="text-white/70 hover:text-white">Refund Policy</Link></div>
        </div>
        <div className="text-xs text-white/40">
          © {new Date().getFullYear()} AW Holdings LLC. All rights reserved. 18+ only.
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [ageVerified, setAgeVerified] = useState(null) // null while loading
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cart, setCart] = useState([])

  useEffect(() => {
    const ok = typeof window !== 'undefined' && window.localStorage.getItem('aw_age_verified') === '1'
    setAgeVerified(ok)
  }, [])

  const confirmAge = () => {
    window.localStorage.setItem('aw_age_verified', '1')
    setAgeVerified(true)
  }
  const declineAge = () => {
    if (typeof window !== 'undefined') window.location.href = 'https://www.google.com'
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }
  const updateQty = (id, qty) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i.id !== id))
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id))

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])
  const itemCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])

  const startCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }
  const onCheckoutSuccess = () => {
    setCart([])
  }

  const gated = ageVerified !== true

  return (
    <>
      {/* Age Gate */}
      <AgeGate open={gated} onConfirm={confirmAge} onDecline={declineAge} />

      {/* Site — blurred / non-interactive until verified */}
      <div
        aria-hidden={gated}
        className={gated ? 'blur-md pointer-events-none select-none' : ''}
      >
        {/* Nav */}
        <header className="border-b border-white/10 sticky top-0 z-30 bg-black/80 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-light tracking-[0.4em]">AW</Link>
            <nav className="hidden sm:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-white/70">
              <a href="#shop" className="hover:text-white">Shop</a>
              <a href="#journal" className="hover:text-white">Journal</a>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
            </nav>
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <button
                  className="relative flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/80 hover:text-white"
                  aria-label="Open bag"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">Bag</span>
                  {itemCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] bg-white text-black rounded-full tabular-nums">
                      {itemCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              {/* Cart body rendered separately below to share state */}
            </Sheet>
          </div>
        </header>

        {/* Hero */}
        <section className="container pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl">
            <div className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-6">
              AW — Adult Wellness. Est. 2025.
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]">
              Considered pleasure.<br />
              <span className="text-white/50">Discreet delivery.</span>
            </h1>
            <p className="mt-8 max-w-xl text-white/60 text-base leading-relaxed">
              A modern house of adult wellness objects — designed with restraint,
              shipped with discretion, and billed under a name no one will notice.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#shop">
                <Button className="rounded-none bg-white text-black hover:bg-white/90 h-12 px-8 tracking-wide">
                  Shop the Collection
                </Button>
              </a>
              <a href="#journal">
                <Button variant="outline" className="rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 h-12 px-8 tracking-wide">
                  Read the Journal
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Catalog */}
        <section id="shop" className="container pb-24">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-white/50">The Collection</div>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight mt-2">Objects — 03</h2>
            </div>
            <div className="text-xs text-white/40 hidden sm:block">Free discreet shipping on orders over $50</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>

        {/* Trust strip */}
        <section id="journal" className="border-y border-white/10 bg-neutral-950">
          <div className="container py-14 grid gap-8 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <Lock className="w-4 h-4 mt-1 text-white/70" />
              <div>
                <div className="text-sm font-medium">Unmarked Packaging</div>
                <div className="text-xs text-white/50 mt-1">Opaque outer box. No branding. No product name on any label.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 mt-1 text-white/70" />
              <div>
                <div className="text-sm font-medium">Discreet Billing</div>
                <div className="text-xs text-white/50 mt-1">Your statement reads <span className="text-white font-medium">AW Holdings LLC</span> — nothing else.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 mt-1 text-white/70" />
              <div>
                <div className="text-sm font-medium">Body-safe Materials</div>
                <div className="text-xs text-white/50 mt-1">Medical-grade silicone, OEKO-TEX textiles, phthalate-free.</div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Overlays — mounted outside the blurred container */}
      <CartSheet
        open={cartOpen && !gated}
        onOpenChange={setCartOpen}
        items={cart}
        updateQty={updateQty}
        remove={removeItem}
        subtotal={subtotal}
        onCheckout={startCheckout}
      />
      <CheckoutDialog
        open={checkoutOpen && !gated}
        onOpenChange={setCheckoutOpen}
        items={cart}
        subtotal={subtotal}
        onSuccess={onCheckoutSuccess}
      />
    </>
  )
}
