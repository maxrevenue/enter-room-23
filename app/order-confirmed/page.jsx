import OrderConfirmedClient from './order-confirmed-client'

export const metadata = {
  title: 'Order Confirmed - Thank You',
  description: 'Your Room 23 order was received. A confirmation is sent for physical adult wellness goods.',
  robots: { index: false, follow: false },
}

export default function OrderConfirmedPage() {
  return <OrderConfirmedClient />
}
