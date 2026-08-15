import OrderConfirmedClient from './order-confirmed-client'

export const metadata = {
  title: 'Order Confirmation',
  robots: { index: false, follow: false },
}

export default function OrderConfirmedPage() {
  return <OrderConfirmedClient />
}
