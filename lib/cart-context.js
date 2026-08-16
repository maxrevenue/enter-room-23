'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { track } from '@/lib/analytics-client'

const SiteContext = createContext(null)

const STORAGE_CART = 'aw_cart_v1'
const AGE_COOKIE = 'age_verified'

const VALID_PROMO_CODES = {
  ROOM23: 10,
  WELCOME10: 10,
}

export function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  // Hydrate from localStorage & age cookies on mount.
  useEffect(() => {
    try {
      // ── Dev debug: ?reset_age=true clears age verification ──
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('reset_age') === 'true') {
          document.cookie = `${AGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`
          document.cookie = `room23_age_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`
          try { window.localStorage.removeItem(AGE_COOKIE) } catch {}
          const clean = window.location.pathname + window.location.hash
          window.history.replaceState(null, '', clean)
        }
      }

      const hasCookie = typeof document !== 'undefined' &&
        document.cookie.split(';').some((c) => {
          const t = c.trim()
          return t.startsWith(`${AGE_COOKIE}=`) || t.startsWith('room23_age_verified=')
        })
      if (hasCookie) setAgeVerified(true)

      const storedCart = window.localStorage.getItem(STORAGE_CART)
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) setCart(parsed)
      }
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      window.localStorage.setItem(STORAGE_CART, JSON.stringify(cart))
    } catch {}
  }, [cart, mounted])

  const confirmAge = () => {
    setAgeVerified(true)
    if (typeof window !== 'undefined') {
      try {
        const maxAge = 30 * 24 * 60 * 60
        document.cookie = `${AGE_COOKIE}=true; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
        document.cookie = `room23_age_verified=true; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
      } catch {}
    }
  }
  const declineAge = () => {
    if (typeof window !== 'undefined') window.location.href = 'https://www.google.com'
  }

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
    // Fire-and-forget analytics — non-blocking
    track('add_to_cart', { productId: product.id })
  }
  const updateQty = (id, qty) => {
    if (qty <= 0) { setCart((prev) => prev.filter((i) => i.id !== id)); return }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id))
  const clearCart = () => setCart([])

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart])
  const itemCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const discountAmount = useMemo(() => (subtotal * discountPercent) / 100, [subtotal, discountPercent])

  const applyPromo = (code) => {
    const normalized = code.trim().toUpperCase()
    const pct = VALID_PROMO_CODES[normalized]
    if (pct !== undefined) {
      setAppliedPromo(normalized)
      setDiscountPercent(pct)
      return { success: true, discountPercent: pct }
    }
    return { success: false }
  }

  const removePromo = () => {
    setAppliedPromo('')
    setDiscountPercent(0)
  }

  const value = {
    mounted,
    ageVerified, confirmAge, declineAge,
    cart, addToCart, updateQty, removeItem, clearCart, subtotal, itemCount,
    cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen,
    appliedPromo, discountPercent, discountAmount, applyPromo, removePromo,
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
