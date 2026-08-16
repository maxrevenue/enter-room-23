'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import CheckoutDisclaimer from '@/components/CheckoutDisclaimer'
import { X, Lock, ShieldCheck, Check } from 'lucide-react'
import Link from 'next/link'

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

export default function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen, cart, subtotal, clearCart, discountAmount, discountPercent, appliedPromo } = useCart()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState('')
  const [email, setEmail] = useState('')
  const [shipping, setShipping] = useState(EMPTY_SHIPPING)
  const [placedOrder, setPlacedOrder] = useState(null)

  if (!checkoutOpen) return null

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const tax = discountedSubtotal * 0.08
  const shippingCost = subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const total = discountedSubtotal + tax + shippingCost
  const canSubmit = Boolean(
    agreedToTerms &&
    email.includes('@') &&
    shipping.name.trim() &&
    shipping.line1.trim() &&
    shipping.city.trim() &&
    shipping.state.trim() &&
    shipping.postalCode.trim(),
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
        setOrderError(data.error || 'Payment failed. Please try again.')
        setSubmitting(false)
        return
      }

      if (data.paymentUrl) {
        sessionStorage.setItem('r23_pending_order', JSON.stringify({
          ...payload,
          orderId: data.orderId,
        }))
        window.location.href = data.paymentUrl
        clearCart()
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={() => { if (!submitting) setCheckoutOpen(false) }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-scale-in"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            {orderPlaced ? 'Order Confirmed' : 'Secure Checkout'}
          </h2>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="btn-ghost"
            style={{ padding: '0.375rem' }}
            disabled={submitting}
          >
            <X size={20} />
          </button>
        </div>

        {orderPlaced ? (
          /* ── Order Confirmation ── */
          <div className="p-6 text-center space-y-4">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <Check size={32} style={{ color: 'var(--color-success)' }} />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Thank You for Your Order
            </h3>
            {placedOrder?.orderId && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                Order <strong style={{ color: 'var(--text-primary)' }}>#{placedOrder.orderId}</strong>
              </p>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              {placedOrder?.emailSent
                ? 'A confirmation email is on its way.'
                : 'A confirmation email will be sent shortly.'}{' '}
              Your order is on its way.
            </p>
            {placedOrder?.fulfillment?.splitFulfillment && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                {placedOrder.fulfillment.customerNotice}
              </p>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              Your card statement will show <strong style={{ color: 'var(--text-primary)' }}>{SITE_CONFIG.billingDescriptor}</strong>.
            </p>
            <button
              onClick={() => {
                setOrderPlaced(false)
                setPlacedOrder(null)
                setCheckoutOpen(false)
                setAgreedToTerms(false)
                setEmail('')
                setShipping(EMPTY_SHIPPING)
              }}
              className="btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ── Checkout Form ── */
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                }}
              >
                Order Summary
              </h3>
              <div
                className="space-y-2"
                style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}
              >
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      {item.name}
                      {item.qty > 1 && (
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                          {' '}×{item.qty}
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)' }}>
                      ${(item.price * item.qty).toFixed(2)} USD
                    </span>
                  </div>
                ))}
              </div>
              <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)} USD</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-success)' }}>
                  <span>Discount ({appliedPromo} — {discountPercent}% off)</span>
                  <span>−${discountAmount.toFixed(2)} USD</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                <span>Tax (est. 8%)</span>
                <span>${tax.toFixed(2)} USD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{shippingCost === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : `$${shippingCost.toFixed(2)} USD`}</span>
              </div>
              <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-brass)' }}>
                  ${total.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                }}
              >
                Delivery
              </h3>
              <div className="space-y-3">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email for order confirmation"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  style={fieldStyle}
                />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Full name"
                  value={shipping.name}
                  onChange={(e) => setShipping((prev) => ({ ...prev, name: e.target.value }))}
                  style={fieldStyle}
                />
                <input
                  type="text"
                  required
                  autoComplete="address-line1"
                  placeholder="Address"
                  value={shipping.line1}
                  onChange={(e) => setShipping((prev) => ({ ...prev, line1: e.target.value }))}
                  style={fieldStyle}
                />
                <input
                  type="text"
                  autoComplete="address-line2"
                  placeholder="Apartment, suite (optional)"
                  value={shipping.line2}
                  onChange={(e) => setShipping((prev) => ({ ...prev, line2: e.target.value }))}
                  style={fieldStyle}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 110px', gap: '0.5rem' }}>
                  <input
                    type="text"
                    required
                    autoComplete="address-level2"
                    placeholder="City"
                    value={shipping.city}
                    onChange={(e) => setShipping((prev) => ({ ...prev, city: e.target.value }))}
                    style={fieldStyle}
                  />
                  <input
                    type="text"
                    required
                    autoComplete="address-level1"
                    placeholder="State"
                    value={shipping.state}
                    onChange={(e) => setShipping((prev) => ({ ...prev, state: e.target.value }))}
                    style={fieldStyle}
                  />
                  <input
                    type="text"
                    required
                    autoComplete="postal-code"
                    placeholder="ZIP"
                    value={shipping.postalCode}
                    onChange={(e) => setShipping((prev) => ({ ...prev, postalCode: e.target.value }))}
                    style={fieldStyle}
                  />
                </div>
              </div>
            </div>

            <CheckoutDisclaimer />

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.75rem',
                }}
              >
                Payment Details
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
                You will complete payment on our secure hosted payment page. Card data never touches Room 23 servers.
                Charges appear as {SITE_CONFIG.billingDescriptor}.
              </p>
            </div>

            {/* ── Security Indicators ── */}
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Lock size={12} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>256-bit SSL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <ShieldCheck size={12} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>PCI-DSS Compliant</span>
              </div>
            </div>

            {/* ── Terms Agreement Checkbox ── */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: agreedToTerms ? 'var(--color-success-bg)' : 'transparent',
                  border: `1px solid ${agreedToTerms ? 'var(--color-success)' : 'var(--border)'}`,
                  transition: 'all var(--transition-fast)',
                }}
              >
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={{
                    marginTop: '2px',
                    accentColor: 'var(--color-success)',
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  I am <strong style={{ color: 'var(--text-primary)' }}>18+ years old</strong> and agree to the{' '}
                  <Link href="/terms" target="_blank" className="link-brass">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank" className="link-brass">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            {/* ── Place Order Button ── */}
            <button
              onClick={handlePlaceOrder}
              disabled={!canSubmit || submitting}
              className="btn-primary"
              style={{ width: '100%', padding: '0.875rem' }}
            >
              {submitting ? (
                <>
                  <span className="skeleton" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Place Order — ${total.toFixed(2)} USD
                </>
              )}
            </button>

            {orderError && (
              <p style={{ color: 'var(--color-accent)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
                {orderError}
              </p>
            )}

            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>
              Your payment is processed securely. We never store full card details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
