export const PRODUCT_CANONICAL_KEYS = [
  { id: 'lube-silicone-2oz', slug: 'platinum-silicone-lubricant-2oz', aliases: [] },
  { id: 'lube-silicone-4oz', slug: 'platinum-silicone-lubricant-4oz', aliases: ['platinum-silicone-lubricant'] },
  { id: 'lube-silicone-8oz', slug: 'platinum-silicone-lubricant-8oz', aliases: [] },
  { id: 'skins-delay', slug: 'skins-delay-spray', aliases: ['skins-natural-delay-spray', 'skins-delay'] },
  { id: 'cg-oh-my', slug: 'cg-oh-my-warming-stimulant', aliases: ['cg-oh-my', 'oh-my-warming'] },
  { id: 'heli-lavender-mist', slug: 'heli-lavender-chamomile-mist', aliases: ['heli-lavender-mist', 'heli-mist'] },
  { id: 'arlo-atlas-oil', slug: 'arlo-atlas-body-oil', aliases: ['arlo-atlas-oil', 'atlas-body-oil'] },
  { id: 'pr-secret-garden-mist', slug: 'secret-garden-fragrance-mist', aliases: ['pr-secret-garden-mist', 'secret-garden-mist'] },
  { id: 'pr-dirty-french-gel', slug: 'dirty-french-shower-gel', aliases: ['pr-dirty-french-gel', 'dirty-french-gel'] },
  { id: 'cg-pole-polish', slug: 'cg-pole-polish', aliases: ['pole-polish', 'cg-pole-polish-strawberry'] },
  { id: 'cake-stroker', slug: 'cake-stroker', aliases: ['hello-cake-dual-texture-stroker', 'hello-cake-stroker'] },
]

export function buildProductCanonicalRedirects(products = PRODUCT_CANONICAL_KEYS) {
  const rules = []
  const seen = new Set()

  const add = (source, destination) => {
    if (!source || !destination || source === destination || seen.has(source)) return
    seen.add(source)
    rules.push({ source, destination })
  }

  for (const product of products) {
    if (!product?.slug) continue
    const dest = `/products/${product.slug}`
    if (product.id && product.id !== product.slug) {
      add(`/products/${product.id}`, dest)
      add(`/shop/${product.id}`, dest)
    }
    for (const alias of product.aliases || []) {
      if (alias && alias !== product.slug) {
        add(`/products/${alias}`, dest)
        add(`/shop/${alias}`, dest)
      }
    }
    add(`/shop/${product.slug}`, dest)
  }

  return rules
}
