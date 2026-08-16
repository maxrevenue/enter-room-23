import CartPageClient from './cart-client'

export const metadata = {
  title: 'Cart',
  description: 'Your Room 23 cart.',
  robots: { index: false, follow: false },
}

export default function CartPage() {
  return <CartPageClient />
}
