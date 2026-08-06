'use client'

import AgeGate from '@/components/age-gate'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import CartSheet from '@/components/cart-sheet'
import CheckoutDialog from '@/components/checkout-dialog'
import { useCart } from '@/lib/cart-context'

export default function SiteShell({ children }) {
  const { ageVerified } = useCart()

  return (
    <div className="relative flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* ── Age Gate Overlay ── */}
      {!ageVerified && <AgeGate />}

      {/* ── Main content (blurred while age gate is showing) ── */}
      <div
        className={`flex flex-col min-h-screen transition-[filter] duration-500 ${!ageVerified ? 'blur-sm pointer-events-none select-none' : ''}`}
      >
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </div>

      {/* ── Cart & Checkout Overlays ── */}
      <CartSheet />
      <CheckoutDialog />
    </div>
  )
}
