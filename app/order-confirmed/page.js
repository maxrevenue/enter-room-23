import { Suspense } from 'react'
import OrderConfirmedClient from './order-confirmed-client'

export const metadata = { title: 'Order Confirmed — AW Holdings LLC' }

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-white/50">Loading…</div>}>
      <OrderConfirmedClient />
    </Suspense>
  )
}
