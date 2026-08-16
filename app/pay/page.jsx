import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'

export const metadata = {
  title: 'Secure payment',
  description: 'Hosted payment for Room 23 physical goods.',
  robots: { index: false, follow: false },
}

export default async function PayPage({ searchParams }) {
  const params = await searchParams
  const orderId = typeof params?.order === 'string' ? params.order : ''

  return (
    <main className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <p className="last-updated">Hosted payment · CCBill</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '1rem' }}>
        Secure payment
      </h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
        This is a one-time charge for shipped wellness goods. Card details are entered on CCBill&apos;s
        payment page. Room 23 never stores full card numbers. The payment screen is non-sexual and
        shows the descriptor <strong>{SITE_CONFIG.billingDescriptor}</strong>.
      </p>
      {orderId && (
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Order reference {orderId}
        </p>
      )}
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        If you were not redirected automatically, the processor session could not be started from this
        environment. Email <a href={`mailto:${SITE_CONFIG.supportEmail}`}>{SITE_CONFIG.supportEmail}</a> with
        your order reference and we will complete the charge with you.
      </p>
      <div className="flex gap-3 flex-wrap">
        <Link href="/checkout" className="btn-primary">Return to checkout</Link>
        <Link href="/contact" className="btn-secondary">Contact support</Link>
      </div>
    </main>
  )
}
