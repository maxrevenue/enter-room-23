import CheckoutForm from '@/components/checkout-form'

export const metadata = {
  title: 'Secure Checkout - Physical Goods',
  description:
    'Complete a one-time checkout for Room 23 physical goods. Card data is entered on the hosted payment page, never on our servers.',
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <main className="container-narrow bg-theme-bg pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 md:pt-8">
      <CheckoutForm />
    </main>
  )
}
