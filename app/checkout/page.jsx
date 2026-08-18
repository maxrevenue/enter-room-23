import CheckoutForm from '@/components/checkout-form'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Secure Checkout - Physical Goods',
  description:
    'Complete a one-time checkout for Room 23 physical goods. Card data is entered on the hosted payment page, never on our servers.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <main className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <p className="last-updated">One-time payment · physical goods</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Checkout
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        US shipping only. Payment is completed on {SITE_CONFIG.paymentProcessor}&apos;s hosted page.
      </p>
      <CheckoutForm />
    </main>
  )
}
