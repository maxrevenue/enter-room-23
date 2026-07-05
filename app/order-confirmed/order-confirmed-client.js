'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock, Mail, Package } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

const genOrderId = () => 'AW-' + Math.floor(1000 + Math.random() * 9000)

export default function OrderConfirmedClient() {
  const searchParams = useSearchParams()
  const { clearCart, mounted, itemCount } = useCart()
  // If a user lands on this page directly, still show a plausible mock order id.
  const [orderId, setOrderId] = useState(() => searchParams.get('order') || null)

  useEffect(() => {
    // Defensive cart reset in case a user reaches this page without going through checkout.
    if (mounted && itemCount > 0) clearCart()
  }, [mounted, itemCount, clearCart])

  useEffect(() => {
    if (!orderId) setOrderId(genOrderId())
  }, [orderId])

  return (
    <section className="container flex-1 flex items-center justify-center py-16 sm:py-24">
      <div className="w-full max-w-xl mx-auto text-center space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full border border-white/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-3">
          <div className="text-[10px] tracking-[0.4em] text-white/50 uppercase">
            Transaction Successful
          </div>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight">
            Thank you for your purchase.
          </h1>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Your order has been placed and will ship in unmarked, opaque packaging within one
            business day.
          </p>
        </div>

        <div className="border border-white/15 bg-neutral-950 divide-y divide-white/10">
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="text-[10px] tracking-[0.3em] text-white/50 uppercase">
              Order Number
            </div>
            <div
              data-testid="order-number"
              className="font-mono text-lg sm:text-xl tracking-wide text-white"
            >
              #{orderId || '—'}
            </div>
          </div>
          <div className="p-5 flex items-start gap-3 text-left">
            <Package className="w-4 h-4 mt-0.5 shrink-0 text-white/70" />
            <div className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Ships in a plain, unbranded outer box. No product name or logo on the exterior.
            </div>
          </div>
          <div className="p-5 flex items-start gap-3 text-left">
            <Lock className="w-4 h-4 mt-0.5 shrink-0 text-white/70" />
            <div className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Your credit card statement will discreetly read as{' '}
              <span className="text-white font-medium">AW Holdings LLC</span>.
            </div>
          </div>
          <div className="p-5 flex items-start gap-3 text-left">
            <Mail className="w-4 h-4 mt-0.5 shrink-0 text-white/70" />
            <div className="text-xs sm:text-sm text-white/70 leading-relaxed">
              A confirmation email with tracking information will follow shortly.
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto rounded-none bg-white text-black hover:bg-white/90 h-12 px-8 tracking-wide">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/refund-policy" className="flex-1 sm:flex-none">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-none border-white/20 bg-transparent text-white hover:bg-white/5 h-12 px-8 tracking-wide"
            >
              Refund Policy
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase pt-4">
          Order confirmation · AW Holdings LLC
        </p>
      </div>
    </section>
  )
}
