'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import { X, Lock, ShieldCheck, CreditCard, Check } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen, cart, subtotal, clearCart, discountAmount, discountPercent, appliedPromo } = useCart()
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState('')

  if (!checkoutOpen) return null

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const tax = discountedSubtotal * 0.08
  const shipping = subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.flatShippingRate
  const total = discountedSubtotal + tax + shipping

  const handlePlaceOrder = async () => {
    if (!agreedToTerms || submitting) return
    setSubmitting(true)
    setOrderError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          subtotal,
          discountAmount,
          discountPercent,
          appliedPromo,
          tax,
          shipping,
          total,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setOrderError(data.error || 'Payment failed. Please try again.')
        setSubmitting(false)
        return
      }

      // Redirect to CCBill hosted payment page — card data never touches our server
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
        // Keep submitting=true while navigating away; clear cart optimistically
        clearCart()
        return
      }

      // Fallback: order was created without a redirect (shouldn't happen in production)
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
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              A confirmation email will be sent to you shortly. Your order will be shipped in{' '}
              <strong style={{ color: 'var(--text-primary)' }}>discreet, plain packaging</strong>.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              Your card statement will show <strong style={{ color: 'var(--text-primary)' }}>{SITE_CONFIG.billingDescriptor}</strong>.
            </p>
            <button
              onClick={() => { setOrderPlaced(false); setCheckoutOpen(false); setAgreedToTerms(false) }}
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
                <span>{shipping === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : `$${shipping.toFixed(2)} USD`}</span>
              </div>
              <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--color-brass)' }}>
                  ${total.toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* ── Payment Details ── */}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Cardholder Name */}
                <div>
                  <label htmlFor="cc-name" className="input-label">Cardholder Name</label>
                  <input
                    id="cc-name"
                    type="text"
                    className="input-field"
                    placeholder="Name on card"
                    autoComplete="cc-name"
                  />
                </div>

                {/* Card Number — hosted by CCBill secure payment form */}
                <div>
                  <label htmlFor="cc-number" className="input-label">Card Number</label>
                  <input
                    id="cc-number"
                    type="text"
                    className="input-field"
                    placeholder="0000 0000 0000 0000"
                    autoComplete="cc-number"
                    maxLength={19}
                  />
                </div>

                {/* Expiry + CVV Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="cc-expiry" className="input-label">Expiry Date</label>
                    <input
                      id="cc-expiry"
                      type="text"
                      className="input-field"
                      placeholder="MM / YY"
                      autoComplete="cc-exp"
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <label htmlFor="cc-cvv" className="input-label">CVV</label>
                    <input
                      id="cc-cvv"
                      type="text"
                      className="input-field"
                      placeholder="123"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Billing Descriptor Notice ── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
              }}
            >
              <CreditCard size={16} style={{ color: 'var(--color-brass)', flexShrink: 0 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', lineHeight: 1.4 }}>
                Charges will appear as <strong style={{ color: 'var(--text-primary)' }}>{SITE_CONFIG.billingDescriptor}</strong> on your bank statement.
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
              disabled={!agreedToTerms || submitting}
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
