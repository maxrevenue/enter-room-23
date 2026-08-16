'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { SITE_CONFIG } from '@/config/site'
import ProductArtwork from '@/components/product-artwork'
import { getShippingRate } from '@/lib/shipping'

export default function CartPageClient() {
  const { cart, updateQty, removeItem, subtotal, discountAmount } = useCart()
  const shippingPreview = getShippingRate(subtotal, 'standard')
  const merchandise = Math.max(0, subtotal - discountAmount)

  return (
    <main className="container-narrow" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: '1.5rem' }}>
        Cart
      </h1>

      {cart.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          Your cart is empty. <Link href="/shop" className="link-brass">Shop the edit</Link>
        </p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <div className="w-24 h-24 overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                <ProductArtwork product={item} productId={item.id} category={item.category} />
              </div>
              <div className="flex-1">
                <h2 className="font-syne">{item.name}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>${Number(item.price).toFixed(2)} USD</p>
                <div className="mt-2 flex items-center gap-3 text-sm">
                  <button type="button" onClick={() => updateQty(item.id, item.qty - 1)}>—</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  <button type="button" onClick={() => removeItem(item.id)} className="underline" style={{ color: 'var(--text-muted)' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Standard shipping</span>
              <span>{shippingPreview === 0 ? 'Free' : `$${shippingPreview.toFixed(2)}`}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Free standard shipping on orders ${SITE_CONFIG.freeShippingThreshold}+. Tax calculated at checkout.
            </p>
            <div className="flex justify-between font-semibold pt-2">
              <span>Merchandise</span><span>${merchandise.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout" className="btn-primary inline-flex">Checkout</Link>
        </div>
      )}
    </main>
  )
}
