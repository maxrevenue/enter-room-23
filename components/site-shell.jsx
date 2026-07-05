'use client'

import { CartProvider, useCart } from '@/lib/cart-context'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import AgeGate from '@/components/age-gate'
import CartSheet from '@/components/cart-sheet'
import CheckoutDialog from '@/components/checkout-dialog'

function ShellInner({ children }) {
  const { mounted, ageVerified } = useCart()
  // Before hydration OR when gate is open, blur the entire page chrome.
  const gated = !mounted || !ageVerified

  return (
    <>
      <div
        aria-hidden={gated}
        className={`flex flex-col min-h-screen transition-[filter] duration-200 ${
          gated ? 'blur-md pointer-events-none select-none' : ''
        }`}
      >
        <SiteHeader />
        <main className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </div>

      {/* Overlays live outside the blurred container */}
      <AgeGate />
      <CartSheet />
      <CheckoutDialog />
    </>
  )
}

export default function SiteShell({ children }) {
  return (
    <CartProvider>
      <ShellInner>{children}</ShellInner>
    </CartProvider>
  )
}
