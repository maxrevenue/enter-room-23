import type { Metadata } from 'next'
import CartPageClient from './cart-client'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your Room 23 order before checkout.',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <CartPageClient />
    </main>
  )
}
