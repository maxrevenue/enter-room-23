'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { track } from '@/lib/analytics-client'
import { VALID_PROMO_CODES } from '@/lib/promos'
import { siteConfig } from '@/lib/config'

const SiteContext = createContext(null)

const STORAGE_CART = 'aw_cart_v1'
const AGE_COOKIE = 'age_verified'

function legacyPromoResult(code, subtotal) {
  const percent = VALID_PROMO_CODES[code]
  if (typeof percent !== 'number' || !Number.isFinite(percent) || percent <= 0) {
    return { success: false }
  }
  const total = Number(subtotal)
  const discountAmount = Number.isFinite(total) && total > 0 ? (total * percent) / 100 : 0
  return { success: true, discountPercent: percent, discountAmount, couponType: 'percent' }
}

async function requestCouponValidation(code, subtotal) {
  const res = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal }),
  })
  const data = await res.json().catch(() => ({}))
  if (data?.ok && data.coupon?.code) {
    return {
      success: true,
      discountPercent: data.coupon.type === 'percent' ? Number(data.coupon.value) || 0 : 0,
      discountAmount: Number(data.discountAmount) || 0,
      couponType: data.coupon.type,
      code: data.coupon.code,
    }
  }
  if (res.status >= 500) {
    const fallback = legacyPromoResult(code, subtotal)
    return fallback.success ? fallback : { success: false, unavailable: true, error: 'Unable to validate coupon.' }
  }
  return { success: false, error: data?.error || 'Invalid promo code.' }
}

export function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [appliedPromo, setAppliedPromo] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0)

  // Hydrate from localStorage & session cookie on mount.
  useEffect(() => {
    try {
      // ── Dev debug: ?reset_age=true clears age verification ──
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('reset_age') === 'true') {
          document.cookie = `${AGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`
          try { window.localStorage.removeItem(AGE_COOKIE) } catch {}
          // Clean URL — remove the query param without a reload
          const clean = window.location.pathname + window.location.hash
          window.history.replaceState(null, '', clean)
        }
      }

      // Age check from 30-day cookies
      const hasCookie = typeof document !== 'undefined' &&
        document.cookie.split(';').some((c) => c.trim().startsWith(`${AGE_COOKIE}=`))
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
        const days = siteConfig.ageCookieDurationDays || 30
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `${AGE_COOKIE}=true; expires=${expires}; path=/; SameSite=Lax; Secure`
        document.cookie = `room23_age_verified=true; expires=${expires}; path=/; SameSite=Lax; Secure`
      } catch {}
    }
  }
  const declineAge = () => {
    if (typeof window !== 'undefined') window.location.href = 'https://www.google.com'
  }

  const addToCart = (product, qty = 1) => {
    const addQty = Math.max(1, Number(product.qty || qty) || 1)
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + addQty } : i))
      return [...prev, { ...product, qty: addQty }]
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
  const discountAmount = couponDiscountAmount > 0
    ? couponDiscountAmount
    : (subtotal * discountPercent) / 100
  const subtotalRef = useRef(subtotal)
  subtotalRef.current = subtotal

  const applyPromoResult = useCallback((result, fallbackCode) => {
    if (!result?.success) {
      setAppliedPromo('')
      setDiscountPercent(0)
      setCouponDiscountAmount(0)
      return result || { success: false }
    }
    setAppliedPromo(result.code || fallbackCode)
    setDiscountPercent(result.discountPercent || 0)
    setCouponDiscountAmount(result.discountAmount || 0)
    return result
  }, [])

  const applyPromo = useCallback(async (code) => {
    const normalized = String(code || '').trim().toUpperCase()
    if (!normalized) return { success: false, error: 'Enter a valid coupon code.' }
    try {
      const result = await requestCouponValidation(normalized, subtotalRef.current)
      if (result.success) return applyPromoResult(result, normalized)
      return result
    } catch {
      return applyPromoResult(legacyPromoResult(normalized, subtotalRef.current), normalized)
    }
  }, [applyPromoResult])

  const removePromo = useCallback(() => {
    setAppliedPromo('')
    setDiscountPercent(0)
    setCouponDiscountAmount(0)
  }, [])

  useEffect(() => {
    if (!mounted || !appliedPromo) return
    let cancelled = false
    requestCouponValidation(appliedPromo, subtotal)
      .then((result) => {
        if (cancelled) return
        if (result.success) {
          setDiscountPercent(result.discountPercent || 0)
          setCouponDiscountAmount(result.discountAmount || 0)
          return
        }
        if (result.unavailable) return
        setAppliedPromo('')
        setDiscountPercent(0)
        setCouponDiscountAmount(0)
      })
      .catch(() => {
        if (cancelled) return
        const fallback = legacyPromoResult(appliedPromo, subtotal)
        if (fallback.success) {
          setDiscountPercent(fallback.discountPercent)
          setCouponDiscountAmount(fallback.discountAmount)
        }
      })
    return () => {
      cancelled = true
    }
  }, [appliedPromo, mounted, subtotal])

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
