'use client'

import { useEffect } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

let bodyLockCount = 0

function lockBody() {
  if (typeof document === 'undefined') return
  if (bodyLockCount === 0) {
    document.body.dataset.overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  bodyLockCount += 1
}

function unlockBody() {
  if (typeof document === 'undefined') return
  bodyLockCount = Math.max(0, bodyLockCount - 1)
  if (bodyLockCount === 0) {
    document.body.style.overflow = document.body.dataset.overflow || ''
    delete document.body.dataset.overflow
  }
}

export function useDialogLock({ open, onClose, containerRef, initialFocusRef }) {
  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement
    lockBody()

    const focusInitial = () => {
      const node = initialFocusRef?.current || containerRef?.current
      node?.focus?.()
    }
    const frame = window.requestAnimationFrame(focusInitial)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }
      if (event.key !== 'Tab') return
      const root = containerRef?.current
      if (!root) return
      const nodes = Array.from(root.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      )
      if (nodes.length === 0) {
        event.preventDefault()
        root.focus?.()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKeyDown)
      unlockBody()
      if (
        previousFocus &&
        typeof previousFocus.focus === 'function' &&
        document.contains(previousFocus)
      ) {
        previousFocus.focus()
      }
    }
  }, [open, onClose, containerRef, initialFocusRef])
}
