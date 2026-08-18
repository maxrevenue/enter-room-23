import type { Metadata } from 'next'
import CartPageClient from './cart-client'

export const metadata: Metadata = {
  title: 'Shopping Cart - Review Your Order',
  description:
    'Review items in your Room 23 cart before secure checkout. Physical adult wellness goods, US shipping only.',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-theme-bg text-theme-text">
      <CartPageClient />
    </main>
  )
}
