/**
 * Privacy helpers — never persist raw PII in logs.
 * Emails are SHA-256 hashed; IPv4 is truncated to /16; IPv6 to /48.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashEmail(email) {
  if (typeof email !== 'string' || !email.trim()) return null
  const normalized = email.trim().toLowerCase()
  const data = new TextEncoder().encode(normalized)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return toHex(digest)
}

export function truncateIp(ip) {
  if (typeof ip !== 'string' || !ip.trim()) return null
  const value = ip.trim().split('%')[0]

  if (value.includes('.')) {
    const parts = value.split('.')
    if (parts.length !== 4) return '0.0.0.0'
    return `${parts[0]}.${parts[1]}.0.0`
  }

  if (value.includes(':')) {
    const groups = value.split(':').filter(Boolean)
    const kept = groups.slice(0, 3)
    return `${kept.join(':')}::`
  }

  return null
}

export function isEmail(value) {
  return typeof value === 'string' && EMAIL_RE.test(value.trim())
}

const PII_KEYS = new Set([
  'email',
  'name',
  'firstName',
  'lastName',
  'phone',
  'address',
  'line1',
  'line2',
  'street',
  'card',
  'cardNumber',
  'cvv',
  'cvc',
  'ccv',
  'pan',
  'ip',
  'ipAddress',
  'authorization',
  'apiKey',
  'token',
])

const ALLOWED_LOG_KEYS = new Set([
  'emailHash',
  'orderId',
  'vendor',
  'itemCount',
  'status',
  'errorCode',
  'httpStatus',
  'unknownCount',
  'unknownIds',
  'providerId',
  'scope',
  'level',
  'message',
])

export function sanitizeLogValue(key, value) {
  if (ALLOWED_LOG_KEYS.has(key)) return value
  const lower = String(key || '').toLowerCase()
  if (PII_KEYS.has(key) || /email|card|cvv|cvc|ip|key|secret|token|auth|address|phone|name/.test(lower)) {
    return '[redacted]'
  }
  if (typeof value === 'string' && EMAIL_RE.test(value)) return '[redacted]'
  return value
}

export function sanitizeLog(meta = {}) {
  const out = {}
  for (const [key, value] of Object.entries(meta)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = sanitizeLog(value)
    } else {
      out[key] = sanitizeLogValue(key, value)
    }
  }
  return out
}
