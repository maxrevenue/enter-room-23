'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { track } from '@/lib/analytics-client'

const SiteContext = createContext(null)

const STORAGE_CART = 'aw_cart_v1'
const STORAGE_AGE = 'room23_age_verified'

export function CartProvider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      // Age check from localStorage (NMI underwriting requirement)
      const storedAge = window.localStorage.getItem(STORAGE_AGE)
      if (storedAge === 'true') setAgeVerified(true)

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
    // Persist age verification (localStorage + 24h cookie) for NMI underwriting compliance
    setAgeVerified(true)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_AGE, 'true')
        const expiry = new Date()
        expiry.setHours(expiry.getHours() + 24)
        document.cookie = `age_verified=true; expires=${expiry.toUTCString()}; path=/; SameSite=Lax; Secure`
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

  const value = {
    mounted,
    ageVerified, confirmAge, declineAge,
    cart, addToCart, updateQty, removeItem, clearCart, subtotal, itemCount,
    cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen,
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
