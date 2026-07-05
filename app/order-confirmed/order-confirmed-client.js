'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2, Lock, Mail, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const genOrderId = () => 'AW-' + Math.floor(1000 + Math.random() * 9000)

export default function OrderConfirmedClient() {
  const searchParams = useSearchParams()
  const { clearCart, mounted, itemCount } = useCart()
  const [orderId, setOrderId] = useState(() => searchParams.get('order') || null)

  useEffect(() => {
    if (mounted && itemCount > 0) clearCart()
  }, [mounted, itemCount, clearCart])

  useEffect(() => {
    if (!orderId) setOrderId(genOrderId())
  }, [orderId])

  return (
    <section className="container flex-1 flex items-center justify-center py-24 sm:py-32">
      <div className="w-full max-w-xl mx-auto text-center space-y-10">
        <div className="w-20 h-20 mx-auto rounded-full border border-foreground/30 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-foreground" />
        </div>

        <div className="space-y-5">
          <div className="text-[10px] tracking-[0.4em] text-foreground/50 uppercase">
            Transaction Successful
          </div>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight">
            <span className="font-serif italic">Thank you</span> for your purchase.
          </h1>
          <p className="text-foreground/60 text-sm sm:text-base leading-loose max-w-md mx-auto">
            Your order has been placed and will ship in unmarked, opaque packaging within one
            business day.
          </p>
        </div>

        <div className="border-y border-border divide-y divide-border">
          <div className="py-5 flex items-center justify-between gap-4">
            <div className="text-[10px] tracking-[0.3em] text-foreground/50 uppercase">
              Order Number
            </div>
            <div
              data-testid="order-number"
              className="font-mono text-lg sm:text-xl tracking-wide text-foreground"
            >
              #{orderId || '—'}
            </div>
          </div>
          <div className="py-5 flex items-start gap-3 text-left">
            <Package className="w-4 h-4 mt-0.5 shrink-0 text-foreground/60" />
            <div className="text-xs sm:text-sm text-foreground/70 leading-loose">
              Ships in a plain, unbranded outer box. No product name or logo on the exterior.
            </div>
          </div>
          <div className="py-5 flex items-start gap-3 text-left">
            <Lock className="w-4 h-4 mt-0.5 shrink-0 text-foreground/60" />
            <div className="text-xs sm:text-sm text-foreground/70 leading-loose">
              Your credit card statement will discreetly read as{' '}
              <span className="text-foreground font-medium">AW Holdings LLC</span>.
            </div>
          </div>
          <div className="py-5 flex items-start gap-3 text-left">
            <Mail className="w-4 h-4 mt-0.5 shrink-0 text-foreground/60" />
            <div className="text-xs sm:text-sm text-foreground/70 leading-loose">
              A confirmation email with tracking information will follow shortly.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="group/btn relative inline-flex items-center justify-center h-12 px-10 border border-foreground text-[11px] tracking-[0.3em] uppercase text-foreground overflow-hidden transition-colors duration-300 hover:text-background"
          >
            <span className="absolute inset-0 bg-foreground translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative">Continue Shopping</span>
          </Link>
          <Link
            href="/refund-policy"
            className="inline-flex items-center justify-center h-12 px-10 border border-border text-[11px] tracking-[0.3em] uppercase text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-colors"
          >
            Refund Policy
          </Link>
        </div>

        <p className="text-[10px] text-foreground/40 tracking-[0.3em] uppercase pt-2">
          Order Confirmation · AW Holdings LLC
        </p>
      </div>
    </section>
  )
}
