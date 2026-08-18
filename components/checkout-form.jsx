'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import CheckoutDisclaimer from '@/components/CheckoutDisclaimer'
import { SHIPPING_METHODS, DEFAULT_SHIPPING_METHOD, getShippingRate } from '@/lib/shipping'
import { Lock, ShieldCheck, Check } from 'lucide-react'

const EMPTY_SHIPPING = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
}

const fieldStyle = {
  width: '100%',
  padding: '0.7rem 0.8rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--text-primary)',
  fontSize: 'var(--text-sm)',
}

export default function CheckoutForm() {
  const { cart, subtotal, clearCart, discountAmount, discountPercent, appliedPromo } = useCart()
  const router = useRouter()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState(EMPTY_SHIPPING)
  const [shippingMethodId, setShippingMethodId] = useState(DEFAULT_SHIPPING_METHOD)
  const [placedOrder, setPlacedOrder] = useState(null)

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const tax = discountedSubtotal * 0.08
  const shippingCost = getShippingRate(subtotal, shippingMethodId)
  const total = discountedSubtotal + tax + shippingCost
  const canSubmit = Boolean(
    agreedToTerms &&
    email.includes('@') &&
    shipping.name.trim() &&
    shipping.line1.trim() &&
    shipping.city.trim() &&
    shipping.state.trim() &&
    shipping.postalCode.trim() &&
    cart.length > 0,
  )

  const handlePlaceOrder = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setOrderError('')

    try {
      const idempotencyKey = `r23-${crypto.randomUUID()}`
      const payload = {
        cart: cart.map((item) => ({ id: item.id, qty: item.qty })),
        subtotal,
        appliedPromo,
        shippingMethodId,
        email,
        shippingAddress: shipping,
        idempotencyKey,
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setOrderError(data.error || 'Payment could not be started. Please try again.')
        setSubmitting(false)
        return
      }

      if (data.paymentUrl) {
        sessionStorage.setItem('r23_pending_order', JSON.stringify({
          ...payload,
          orderId: data.orderId,
        }))
        window.location.href = data.paymentUrl
        return
      }

      setPlacedOrder(data)
      setSubmitting(false)
      setOrderPlaced(true)
      clearCart()
    } catch {
      setOrderError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Shop the edit</Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="p-6 text-center space-y-4">
        <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Check size={32} style={{ color: 'var(--color-success)' }} />
        </div>
        <h2 className="font-syne text-2xl">Thank you for your order</h2>
        {placedOrder?.orderId && (
          <p style={{ color: 'var(--text-secondary)' }}>Order <strong>#{placedOrder.orderId}</strong></p>
        )}
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {placedOrder?.emailSent ? 'A confirmation email is on its way.' : 'A confirmation email will follow.'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
          Your statement will show <strong>{SITE_CONFIG.billingDescriptor}</strong>.
        </p>
        <button onClick={() => router.push('/shop')} className="btn-primary">Continue shopping</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.06em] mb-3">Order summary</h2>
        <div className="space-y-2" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name}{item.qty > 1 ? ` ×${item.qty}` : ''}</span>
              <span>${(item.price * item.qty).toFixed(2)} USD</span>
            </div>
          ))}
        </div>
        <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
        <div className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {discountAmount > 0 && (
            <div className="flex justify-between" style={{ color: 'var(--color-success)' }}>
              <span>Discount ({appliedPromo})</span><span>−${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between"><span>Tax (est. 8%)</span><span>${tax.toFixed(2)}</span></div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <span className="font-semibold">Total</span>
          <span className="font-syne text-xl font-bold">${total.toFixed(2)} USD</span>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.06em] mb-3">Shipping method</h2>
        <div className="space-y-2">
          {SHIPPING_METHODS.map((method) => {
            const rate = getShippingRate(subtotal, method.id)
            return (
              <label key={method.id} className="flex items-start gap-3 p-3 border cursor-pointer" style={{ borderColor: shippingMethodId === method.id ? 'var(--color-border-light)' : 'var(--border)' }}>
                <input
                  type="radio"
                  name="shippingMethod"
                  checked={shippingMethodId === method.id}
                  onChange={() => setShippingMethodId(method.id)}
                />
                <span className="text-sm">
                  <strong className="block">{method.name}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{method.delivery} · {rate === 0 ? 'Free' : `$${rate.toFixed(2)}`}</span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.06em] mb-3">Delivery</h2>
        <div className="space-y-3">
          <input type="email" required autoComplete="email" placeholder="Email for order confirmation" value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
          <input type="text" required autoComplete="name" placeholder="Full name" value={shipping.name} onChange={(e) => setShipping((p) => ({ ...p, name: e.target.value }))} style={fieldStyle} />
          <input type="text" required autoComplete="address-line1" placeholder="Address" value={shipping.line1} onChange={(e) => setShipping((p) => ({ ...p, line1: e.target.value }))} style={fieldStyle} />
          <input type="text" autoComplete="address-line2" placeholder="Apartment, suite (optional)" value={shipping.line2} onChange={(e) => setShipping((p) => ({ ...p, line2: e.target.value }))} style={fieldStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px', gap: '0.5rem' }}>
            <input type="text" required autoComplete="address-level2" placeholder="City" value={shipping.city} onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))} style={fieldStyle} />
            <input type="text" required autoComplete="address-level1" placeholder="State" value={shipping.state} onChange={(e) => setShipping((p) => ({ ...p, state: e.target.value }))} style={fieldStyle} />
            <input type="text" required autoComplete="postal-code" placeholder="ZIP" value={shipping.postalCode} onChange={(e) => setShipping((p) => ({ ...p, postalCode: e.target.value }))} style={fieldStyle} />
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>United States only.</p>
        </div>
      </div>

      <CheckoutDisclaimer />

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.06em] mb-2">Payment</h2>
        <p className="text-xs leading-6" style={{ color: 'var(--text-muted)' }}>
          One-time charge for physical goods. {SITE_CONFIG.pciCheckoutWording} Card data is entered on{' '}
          {SITE_CONFIG.paymentProcessor}&apos;s hosted payment page — never on room23.net. Your statement shows{' '}
          {SITE_CONFIG.billingDescriptor}.
        </p>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><Lock size={12} /> 256-bit SSL</span>
        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><ShieldCheck size={12} /> {SITE_CONFIG.paymentProcessor}</span>
      </div>

      <label className="flex items-start gap-3 p-3 border cursor-pointer" style={{ borderColor: agreedToTerms ? 'var(--color-success)' : 'var(--border)' }}>
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          style={{ marginTop: 2 }}
        />
        <span className="text-xs leading-5" style={{ color: 'var(--text-secondary)' }}>
          I am <strong>18+ years old</strong> and agree to the{' '}
          <Link href="/terms" target="_blank" className="link-brass">Terms</Link> and{' '}
          <Link href="/privacy" target="_blank" className="link-brass">Privacy Policy</Link>.
        </span>
      </label>

      <button
        type="button"
        onClick={handlePlaceOrder}
        disabled={!canSubmit || submitting}
        className="btn-primary"
        style={{ width: '100%', padding: '0.875rem' }}
      >
        {submitting ? 'Processing…' : (
          <>
            <Lock size={14} /> Continue to secure payment — ${total.toFixed(2)} USD
          </>
        )}
      </button>

      {orderError && (
        <p className="text-center text-xs" style={{ color: 'var(--color-accent)' }}>{orderError}</p>
      )}
    </div>
  )
}
