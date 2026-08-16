'use client'

import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import CartSheet from '@/components/cart-sheet'
import CheckoutDialog from '@/components/checkout-dialog'

export default function SiteShell({ children }) {
  return (
    <div className="relative flex flex-col min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </div>

      <CartSheet />
      <CheckoutDialog />
    </div>
  )
}
