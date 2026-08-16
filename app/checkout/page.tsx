import type { Metadata } from 'next'
import CheckoutPageClient from './checkout-client'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Secure checkout for Room 23. Card data never touches our servers.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <CheckoutPageClient />
    </main>
  )
}
