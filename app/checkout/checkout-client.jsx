'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

export default function CheckoutPageClient() {
  const { cart, setCheckoutOpen, setCartOpen } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!cart.length) {
      router.replace('/cart')
      return
    }
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [cart.length, router, setCartOpen, setCheckoutOpen])

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-white">Checkout</h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        Complete your order in the secure checkout panel. Card data is processed by our payment
        partner and never touches Room 23 servers.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={() => setCheckoutOpen(true)}
          className="bg-white px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black hover:bg-zinc-200"
        >
          Open checkout
        </button>
        <Link
          href="/cart"
          className="border border-zinc-800 px-8 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 hover:border-zinc-600"
        >
          Back to cart
        </Link>
      </div>
    </div>
  )
}
