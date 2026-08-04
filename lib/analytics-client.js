/**
 * Analytics client — lightweight fire-and-forget event tracking.
 * Replace the stub with your actual analytics provider (GA4, PostHog, etc.)
 */

export function track(eventName, payload = {}) {
  if (typeof window === 'undefined') return

  try {
    // Stub: log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[analytics] ${eventName}`, payload)
    }

    // TODO: Replace with actual analytics endpoint
    // e.g., fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event: eventName, ...payload }) })
  } catch {
    // Silently fail — analytics must never block UX
  }
}
