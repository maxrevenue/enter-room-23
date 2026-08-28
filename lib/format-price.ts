/** Storefront USD display — no space after the currency symbol. */
export function formatPrice(price: number): string {
  if (typeof price !== 'number' || !Number.isFinite(price)) return ''
  return `$${price.toFixed(2)}`
}
