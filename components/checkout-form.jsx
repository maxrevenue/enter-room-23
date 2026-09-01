'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { PAYMENT_UI, STATEMENT_CHECKOUT } from '@/lib/customer-copy'
import CheckoutDisclaimer from '@/components/CheckoutDisclaimer'
import { SHIPPING_METHODS, DEFAULT_SHIPPING_METHOD, getShippingRate } from '@/lib/shipping'
import { Lock, Check, ChevronDown } from 'lucide-react'

const EMPTY_SHIPPING = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
}

const INPUT_CLASS =
  'checkout-input w-full min-h-11 px-3.5 py-2.5 text-sm text-theme-text placeholder:text-theme-muted'

function OrderSummaryContent({ cart, subtotal, discountAmount, appliedPromo, tax, shippingCost, total }) {
  return (
    <>
      <div className="space-y-2.5 text-sm text-theme-muted">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between gap-3">
            <span className="min-w-0 truncate text-theme-text/90">
              {item.name}
              {item.qty > 1 ? ` ×${item.qty}` : ''}
            </span>
            <span className="shrink-0 tabular-nums">${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <hr className="my-4 border-theme-border" />

      <div className="space-y-2 text-sm text-theme-muted">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-theme-accent">
            <span>Discount ({appliedPromo})</span>
            <span className="tabular-nums">−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax (est. 8%)</span>
          <span className="tabular-nums">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="tabular-nums">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-theme-border pt-4">
        <span className="text-sm font-medium text-theme-text">Total</span>
        <span className="font-syne text-xl font-bold tabular-nums text-theme-text">
          ${total.toFixed(2)} USD
        </span>
      </div>
    </>
  )
}

function MobileOrderSummary({ cart, subtotal, discountAmount, appliedPromo, tax, shippingCost, total }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="checkout-summary-mobile lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full min-h-11 items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm text-theme-text">
          Order summary <span className="text-theme-muted">·</span>{' '}
          <span className="font-semibold tabular-nums">${total.toFixed(2)}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-theme-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="border-t border-theme-border px-4 py-4">
          <OrderSummaryContent
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            appliedPromo={appliedPromo}
            tax={tax}
            shippingCost={shippingCost}
            total={total}
          />
        </div>
      )}
    </div>
  )
}

export default function CheckoutForm() {
  const { cart, subtotal, clearCart, discountAmount, appliedPromo } = useCart()
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
        const apiError = typeof data.error === 'string' ? data.error : ''
        if (apiError === 'Internal server error.') {
          setOrderError(PAYMENT_UI.processorDown)
        } else {
          setOrderError(apiError || PAYMENT_UI.soft)
        }
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
      setOrderError(PAYMENT_UI.processorDown)
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="py-16 text-center">
        <p className="mb-6 text-theme-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Shop the edit</Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-theme-accent/10">
          <Check size={32} className="text-theme-accent" />
        </div>
        <h2 className="font-syne text-2xl text-theme-text">Thank you for your order</h2>
        {placedOrder?.orderId && (
          <p className="text-theme-muted">
            Order <strong className="text-theme-text">#{placedOrder.orderId}</strong>
          </p>
        )}
        <p className="text-sm text-theme-muted">
          {placedOrder?.emailSent ? 'A confirmation email is on its way.' : 'A confirmation email will follow.'}
        </p>
        <p className="text-xs text-theme-muted">
          {STATEMENT_CHECKOUT}
        </p>
        <button type="button" onClick={() => router.push('/shop')} className="btn-primary">
          Continue shopping
        </button>
      </div>
    )
  }

  const summaryProps = {
    cart,
    subtotal,
    discountAmount,
    appliedPromo,
    tax,
    shippingCost,
    total,
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
      <div className="space-y-8">
        <MobileOrderSummary {...summaryProps} />

        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading" className="checkout-section-label">
            Delivery
          </h2>
          <div className="mt-4 space-y-3">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="Email for order confirmation"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              required
              autoComplete="name"
              placeholder="Full name"
              value={shipping.name}
              onChange={(e) => setShipping((p) => ({ ...p, name: e.target.value }))}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              required
              autoComplete="address-line1"
              placeholder="Address"
              value={shipping.line1}
              onChange={(e) => setShipping((p) => ({ ...p, line1: e.target.value }))}
              className={INPUT_CLASS}
            />
            <input
              type="text"
              autoComplete="address-line2"
              placeholder="Apartment, suite (optional)"
              value={shipping.line2}
              onChange={(e) => setShipping((p) => ({ ...p, line2: e.target.value }))}
              className={INPUT_CLASS}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_5.5rem_7rem]">
              <input
                type="text"
                required
                autoComplete="address-level2"
                placeholder="City"
                value={shipping.city}
                onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}
                className={INPUT_CLASS}
              />
              <input
                type="text"
                required
                autoComplete="address-level1"
                placeholder="State"
                value={shipping.state}
                onChange={(e) => setShipping((p) => ({ ...p, state: e.target.value }))}
                className={INPUT_CLASS}
              />
              <input
                type="text"
                required
                autoComplete="postal-code"
                placeholder="ZIP"
                value={shipping.postalCode}
                onChange={(e) => setShipping((p) => ({ ...p, postalCode: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>
            <p className="text-xs text-theme-muted">United States only.</p>
          </div>
        </section>

        <section aria-labelledby="shipping-heading">
          <h2 id="shipping-heading" className="checkout-section-label">
            Shipping method
          </h2>
          <div className="mt-4 space-y-2.5">
            {SHIPPING_METHODS.map((method) => {
              const rate = getShippingRate(subtotal, method.id)
              const selected = shippingMethodId === method.id
              return (
                <label
                  key={method.id}
                  className={`checkout-shipping-card ${selected ? 'checkout-shipping-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    className="sr-only"
                    checked={selected}
                    onChange={() => setShippingMethodId(method.id)}
                  />
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-theme-border">
                    {selected && <span className="h-2 w-2 rounded-full bg-theme-accent" />}
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <strong className="block font-medium text-theme-text">{method.name}</strong>
                    <span className="text-theme-muted">
                      {method.delivery} · {rate === 0 ? 'Free' : `$${rate.toFixed(2)}`}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="payment-heading" className="space-y-4">
          <h2 id="payment-heading" className="checkout-section-label">
            Payment
          </h2>
          <CheckoutDisclaimer
            agreedToTerms={agreedToTerms}
            onAgreedChange={setAgreedToTerms}
            showCheckbox
          />

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={!canSubmit || submitting}
            className="checkout-cta"
          >
            {submitting ? (
              'Processing…'
            ) : (
              <>
                <Lock size={16} aria-hidden="true" />
                Continue to secure payment — ${total.toFixed(2)} USD
              </>
            )}
          </button>

          {orderError && (
            <p className="text-center text-xs text-theme-accent">{orderError}</p>
          )}
        </section>
      </div>

      <aside className="hidden lg:block lg:sticky lg:top-24">
        <div className="checkout-summary-desktop">
          <h2 className="checkout-section-label mb-4">Order summary</h2>
          <OrderSummaryContent {...summaryProps} />
        </div>
      </aside>
    </div>
  )
}
