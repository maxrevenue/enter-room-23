'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/config/site'
import { PACKAGING, STATEMENT_CHECKOUT } from '@/lib/customer-copy'

const PENDING_KEY = 'r23_pending_order'

export default function OrderConfirmedClient() {
  const [status, setStatus] = useState('loading')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function complete() {
      try {
        const raw = sessionStorage.getItem(PENDING_KEY)
        if (!raw) {
          if (!cancelled) setStatus('missing')
          return
        }

        const pending = JSON.parse(raw)
        const res = await fetch('/api/checkout/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pending),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Unable to finish this order.')
        }

        sessionStorage.removeItem(PENDING_KEY)
        if (!cancelled) {
          setResult(data)
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) {
          setError('We received your payment. If you do not see a confirmation email, write to support@room23.net.')
          setStatus('error')
        }
      }
    }

    complete()
    return () => { cancelled = true }
  }, [])

  const fulfillment = result?.fulfillment

  return (
    <main id="main-content" className="container-narrow" style={{ padding: '4rem 1.25rem' }}>
      <p className="last-updated">Order confirmation</p>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
        {status === 'error' ? 'We are reviewing your order' : 'Thank you'}
      </h1>

      {status === 'loading' && (
        <p style={{ color: 'var(--text-secondary)' }}>Finishing your order…</p>
      )}

      {status === 'missing' && (
        <p style={{ color: 'var(--text-secondary)' }}>
          If you just completed payment, a confirmation email is on the way. Questions:{' '}
          <a href={`mailto:${SITE_CONFIG.supportEmail}`}>{SITE_CONFIG.supportEmail}</a>.
        </p>
      )}

      {status === 'error' && (
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
      )}

      {status === 'ready' && (
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
          <p>
            Order <strong style={{ color: 'var(--text-primary)' }}>#{result.orderId}</strong>
          </p>
          <p>
            {result.emailSent
              ? 'A confirmation email is on its way.'
              : 'If a confirmation email does not arrive shortly, contact support and we will resend it.'}
          </p>
          <p>
            {fulfillment?.customerNotice || PACKAGING.notice}
          </p>
          {fulfillment?.splitFulfillment && (
            <p>
              Items in this order ship in more than one unlabeled package.
            </p>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            {STATEMENT_CHECKOUT}
          </p>
        </div>
      )}

      <p style={{ marginTop: '2rem' }}>
        <Link href="/shop" className="link-brass">Continue shopping</Link>
      </p>
    </main>
  )
}
