export function normalizeCustomerEmail(email?: string | null) {
  return String(email || '').trim().toLowerCase()
}

export function adminCustomersHref(q = '') {
  const needle = String(q || '').trim()
  return needle ? `/admin/customers?q=${encodeURIComponent(needle)}` : '/admin/customers'
}

export function adminCustomerHref(email: string) {
  return `/admin/customers/${encodeURIComponent(normalizeCustomerEmail(email))}`
}
