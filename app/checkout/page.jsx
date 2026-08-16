import CheckoutForm from '@/components/checkout-form'

export const metadata = {
  title: 'Checkout',
  description: 'Secure one-time checkout for Room 23 physical goods. Card data never touches our servers.',
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
        US shipping only. Payment is completed on CCBill&apos;s hosted page.
      </p>
      <CheckoutForm />
    </main>
  )
}
