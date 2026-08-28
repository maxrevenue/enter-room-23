const PRESERVED_BADGES = new Set(['TRAVEL', 'BEST SELLER', 'VALUE', 'HOUSE'])

export const MAX_NEW_BADGES = 3

type BadgeProduct = {
  id: string
  badge?: string | null
  newArrival?: boolean
}

/** At most MAX_NEW badges sitewide — first eligible products in catalog order. */
export function buildNewBadgeAllowlist(
  products: BadgeProduct[],
  max = MAX_NEW_BADGES,
): Set<string> {
  const allowed = new Set<string>()
  for (const product of products) {
    if (allowed.size >= max) break
    if (product.badge === 'NEW' || product.newArrival) {
      allowed.add(product.id)
    }
  }
  return allowed
}

export function resolveDisplayBadge(
  product: BadgeProduct,
  newBadgeAllowlist: Set<string>,
): string | null {
  const badge = product.badge?.trim()
  if (!badge || badge === 'SOLD OUT') return null
  if (badge === 'NEW') {
    return newBadgeAllowlist.has(product.id) ? 'NEW' : null
  }
  if (PRESERVED_BADGES.has(badge)) return badge
  return null
}

export function badgeClassName(badge: string): string {
  const base =
    'absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.24em]'
  if (badge === 'NEW') {
    return `${base} text-primary/75`
  }
  return `${base} text-theme-muted`
}
