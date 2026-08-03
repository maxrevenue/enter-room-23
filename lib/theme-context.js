'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'r23_theme'

export function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      setTheme(stored === 'dark' ? 'dark' : 'light')
    } catch {}
    setMounted(true)
  }, [])

  // Apply .dark class to <html> and persist
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try { window.localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme, mounted])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}