import { FULFILLMENT_TYPES, VENDOR_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const PRODUCTS = [
  {
    id: 'lube-silicone-2oz',
    slug: 'platinum-silicone-lubricant-2oz',
    name: 'Platinum Silicone Lubricant — 2oz',
    price: 18,
    tagline: 'Ultra-concentrated · waterproof · travel-size',
    description:
      'Medical-grade platinum-cure silicone formula. A single application lasts. Waterproof, latex condom-safe, and fragrance-free. House formulation for shower intimacy. 2 oz travel pump.',
    shortEditorial:
      'A concentrated house formula for water, heat, and unhurried time. One pass is enough.',
    image: '/images/products/platinum-silicone-lubricant-2oz.jpg',
    images: [
      { url: '/images/products/platinum-silicone-lubricant-2oz.jpg', alt: 'Platinum Silicone Lubricant 2oz pump bottle' },
      { url: '/images/products/platinum-silicone-2oz.svg', alt: 'Platinum Silicone Lubricant 2oz illustration' },
      { url: '/images/shipping/discreet-mailer-01.jpg', alt: 'Plain unmarked outer carton' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'TRAVEL',
    attributes: ['Medical-grade', 'Ultra-concentrated', 'Waterproof', 'Fragrance-free', 'Latex-compatible'],
    ingredients:
      'Medical-grade dimethicone (platinum-cure silicone). Made in the USA with globally sourced ingredients. Clear, odorless. Free of fragrance, parabens, and glycerin. Phthalate-free.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use. Store at room temperature away from direct sun.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys — silicone on silicone will degrade the surface.',
    care: 'Wipe exterior of bottle clean. Recap between uses. Do not dilute.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Base', value: 'Platinum-cure medical-grade dimethicone' },
      { label: 'Free from', value: 'Fragrance, parabens, glycerin, phthalates' },
      { label: 'Condoms', value: 'Latex & polyisoprene compatible' },
      { label: 'Toys', value: 'Not for silicone toys' },
      { label: 'Size', value: '2 oz (59 mL) precision pump' },
    ],
    filters: {
      type: 'lubricant',
      material: 'silicone-based',
      waterproof: true,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Waves', label: 'Ultra-Concentrated' },
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Medical-grade dimethicone. Made in the USA. Latex-compatible. DO NOT use with silicone toys. Phthalate-free.',
    specifications: '2 oz (59 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'midnight-bloom-massage-oil'],
  },
  {
    id: 'lube-silicone-4oz',
    slug: 'platinum-silicone-lubricant-4oz',
    aliases: ['platinum-silicone-lubricant'],
    name: 'Platinum Silicone Lubricant — 4oz',
    price: 28,
    tagline: 'Ultra-concentrated · waterproof · standard-size',
    description:
      'Medical-grade platinum-cure silicone formula. A single application lasts. Waterproof, latex condom-safe, and fragrance-free. House formulation for shower intimacy. 4 oz precision pump.',
    shortEditorial:
      'Our standard bottle. Concentrated, long-wearing, and quiet on the nightstand.',
    image: '/images/products/platinum-silicone-lubricant-01.jpg',
    images: [
      { url: '/images/products/platinum-silicone-lubricant-01.jpg', alt: 'Platinum Silicone Lubricant 4oz pump bottle' },
      { url: '/images/products/platinum-silicone-lubricant-02.jpg', alt: 'Silicone lubricant pump detail' },
      { url: '/images/products/platinum-silicone-4oz.svg', alt: 'Platinum Silicone Lubricant 4oz illustration' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'BEST SELLER',
    attributes: ['Medical-grade', 'Ultra-concentrated', 'Waterproof', 'Fragrance-free', 'Latex-compatible'],
    ingredients:
      'Medical-grade dimethicone (platinum-cure silicone). Made in the USA with globally sourced ingredients. Clear, odorless. Free of fragrance, parabens, and glycerin. Phthalate-free.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use. Store at room temperature away from direct sun.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys — silicone on silicone will degrade the surface.',
    care: 'Wipe exterior of bottle clean. Recap between uses. Do not dilute.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Base', value: 'Platinum-cure medical-grade dimethicone' },
      { label: 'Free from', value: 'Fragrance, parabens, glycerin, phthalates' },
      { label: 'Condoms', value: 'Latex & polyisoprene compatible' },
      { label: 'Toys', value: 'Not for silicone toys' },
      { label: 'Size', value: '4 oz (118 mL) precision pump' },
    ],
    filters: {
      type: 'lubricant',
      material: 'silicone-based',
      waterproof: true,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Waves', label: 'Ultra-Concentrated' },
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Medical-grade dimethicone. Made in the USA. Latex-compatible. DO NOT use with silicone toys. Phthalate-free.',
    specifications: '4 oz (118 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
    relatedSlugs: ['platinum-silicone-lubricant-2oz', 'platinum-silicone-lubricant-8oz', 'obsidian-glass-massage-wand'],
  },
  {
    id: 'lube-silicone-8oz',
    slug: 'platinum-silicone-lubricant-8oz',
    name: 'Platinum Silicone Lubricant — 8oz',
    price: 45,
    tagline: 'Ultra-concentrated · waterproof · value-size',
    description:
      'Medical-grade platinum-cure silicone formula. A single application lasts. Waterproof, latex condom-safe, and fragrance-free. House formulation for shower intimacy. 8 oz value pump.',
    shortEditorial:
      'The value bottle for a considered routine. Same house formula, larger reservoir.',
    image: '/images/products/platinum-silicone-lubricant-03.jpg',
    images: [
      { url: '/images/products/platinum-silicone-lubricant-03.jpg', alt: 'Platinum Silicone Lubricant 8oz pump bottle' },
      { url: '/images/products/platinum-silicone-8oz.svg', alt: 'Platinum Silicone Lubricant 8oz illustration' },
      { url: '/images/shipping/discreet-mailer-01.jpg', alt: 'Plain unmarked outer carton' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'VALUE',
    attributes: ['Medical-grade', 'Ultra-concentrated', 'Waterproof', 'Fragrance-free', 'Latex-compatible'],
    ingredients:
      'Medical-grade dimethicone (platinum-cure silicone). Made in the USA with globally sourced ingredients. Clear, odorless. Free of fragrance, parabens, and glycerin. Phthalate-free.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use. Store at room temperature away from direct sun.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys — silicone on silicone will degrade the surface.',
    care: 'Wipe exterior of bottle clean. Recap between uses. Do not dilute.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Base', value: 'Platinum-cure medical-grade dimethicone' },
      { label: 'Free from', value: 'Fragrance, parabens, glycerin, phthalates' },
      { label: 'Condoms', value: 'Latex & polyisoprene compatible' },
      { label: 'Toys', value: 'Not for silicone toys' },
      { label: 'Size', value: '8 oz (236 mL) precision pump' },
    ],
    filters: {
      type: 'lubricant',
      material: 'silicone-based',
      waterproof: true,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Waves', label: 'Ultra-Concentrated' },
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Medical-grade dimethicone. Made in the USA. Latex-compatible. DO NOT use with silicone toys. Phthalate-free.',
    specifications: '8 oz (236 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'obsidian-glass-massage-wand'],
  },
  {
    id: 'ds-glass-wand',
    slug: 'obsidian-glass-massage-wand',
    name: 'Obsidian Glass Massage Wand',
    price: 65,
    tagline: 'Temperature-responsive · hand-crafted · seamless',
    description:
      'Hand-blown borosilicate glass wand designed for temperature play. Warm in water or chill before use. Seamless, non-porous construction for straightforward hygiene.',
    shortEditorial:
      'Glass that holds heat or cold. Seamless. Easy to clean. Built for deliberate use.',
    image: '/images/products/obsidian-glass-wand-01.jpg',
    images: [
      { url: '/images/products/obsidian-glass-wand-01.jpg', alt: 'Obsidian Glass Massage Wand on dark ground' },
      { url: '/images/products/obsidian-glass-wand-03.jpg', alt: 'Borosilicate glass wand detail' },
      { url: '/images/products/obsidian-glass-wand.svg', alt: 'Obsidian Glass Massage Wand illustration' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'toys',
    collection: 'essentials',
    badge: null,
    attributes: ['Borosilicate glass', 'Temperature play', 'Non-porous', 'Phthalate-free'],
    ingredients: '100% medical-grade borosilicate glass. No coatings. No plasticizers.',
    directions:
      'Clean before and after use with warm water and mild soap or a toy cleaner compatible with glass. For temperature play, warm in a bowl of warm water or chill briefly in the refrigerator — never use boiling water or a freezer.',
    compatibility:
      'Compatible with all lubricant types, including silicone, water-based, and hybrid. Do not drop on hard surfaces.',
    care: 'Hand wash. Air dry fully before storage. Store in the included pouch or a soft cloth.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Material', value: 'Medical-grade borosilicate glass' },
      { label: 'Surface', value: 'Seamless, non-porous, hypoallergenic' },
      { label: 'Lubricants', value: 'All types (water, silicone, hybrid)' },
      { label: 'Phthalates', value: 'None' },
      { label: 'Dimensions', value: 'Approx. 7.5 in length' },
    ],
    filters: {
      type: 'toy',
      material: 'glass',
      waterproof: true,
      forCouples: true,
      forSolo: true,
      powerSource: 'none',
    },
    variants: [],
    features: [
      { icon: 'Thermometer', label: 'Temperature Responsive' },
      { icon: 'Sparkles', label: 'Hand-Blown Glass' },
      { icon: 'ShieldCheck', label: 'Hypoallergenic' },
    ],
    materials:
      '100% medical-grade borosilicate glass. Non-porous and hypoallergenic. Compatible with all lubricant types, including silicone. Phthalate-free.',
    specifications: 'Length: 7.5 inches. Seamless construction. Weight: approx. 0.8 lbs.',
    gallery: [],
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'noir-silk-blindfold'],
  },
  {
    id: 'ds-massage-oil',
    slug: 'midnight-bloom-massage-oil',
    name: 'Midnight Bloom Massage Oil',
    price: 42,
    tagline: 'Sensorial · nourishing · botanical',
    description:
      'A nourishing blend of sweet almond, jojoba, and evening primrose oils with subtle notes of sandalwood and dark vanilla. Formulated for full-body massage.',
    shortEditorial:
      'Botanical oils with a quiet finish. For skin, not for ingestion.',
    image: '/images/products/midnight-bloom-oil-01.jpg',
    images: [
      { url: '/images/products/midnight-bloom-oil-01.jpg', alt: 'Midnight Bloom Massage Oil glass bottle' },
      { url: '/images/products/midnight-bloom-oil-02.jpg', alt: 'Massage oil bottle and dropper detail' },
      { url: '/images/shipping/discreet-mailer-01.jpg', alt: 'Plain unmarked outer carton' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.ELDORADO_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    badge: null,
    attributes: ['Botanical', 'Vegan', 'Cruelty-free', 'Topical use only'],
    ingredients:
      'Sweet almond oil, jojoba seed oil, evening primrose oil, vitamin E, natural fragrance blend. Vegan and cruelty-free. Not for internal use. Not edible.',
    directions:
      'Warm a small amount between palms and massage into clean skin. External use only. Patch-test if you have nut allergies. Store in a cool, dark place.',
    compatibility:
      'Topical massage only. Not a personal lubricant for use with latex condoms (oils can degrade latex). Not for silicone toy cleanup substitution.',
    care: 'Keep capped. Avoid direct sunlight. Wipe bottle exterior as needed.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Base oils', value: 'Sweet almond, jojoba, evening primrose' },
      { label: 'Additives', value: 'Vitamin E, natural fragrance blend' },
      { label: 'Use', value: 'External massage only — not ingestible' },
      { label: 'Size', value: '3.4 oz (100 mL) glass bottle with dropper' },
    ],
    filters: {
      type: 'wellness',
      material: 'oil',
      waterproof: false,
      forCouples: true,
      forSolo: false,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Leaf', label: '100% Botanical' },
      { icon: 'Droplets', label: 'Deeply Nourishing' },
      { icon: 'Wind', label: 'Sensorial Aroma' },
    ],
    materials:
      'Sweet almond oil, jojoba seed oil, evening primrose oil, vitamin E, natural fragrance blend. Vegan and cruelty-free. Topical use only.',
    specifications: '3.4 oz (100 mL) glass bottle with dropper. Store in a cool, dark place.',
    gallery: [],
    relatedSlugs: ['noir-silk-blindfold', 'platinum-silicone-lubricant-4oz'],
  },
  {
    id: 'ds-silk-blindfold',
    slug: 'noir-silk-blindfold',
    name: 'Noir Silk Blindfold',
    price: 35,
    tagline: 'Sensory focus · pure mulberry silk',
    description:
      'Pure mulberry silk blindfold with an adjustable elastic strap designed not to pull or tangle hair. Soft against skin; blocks light for sensory focus.',
    shortEditorial:
      '22-momme mulberry silk. Adjustable. Quiet on the nightstand.',
    image: '/images/products/noir-silk-blindfold-01.jpg',
    images: [
      { url: '/images/products/noir-silk-blindfold-01.jpg', alt: 'Noir Silk Blindfold folded on dark ground' },
      { url: '/images/products/noir-silk-blindfold-03.jpg', alt: 'Mulberry silk blindfold texture detail' },
      { url: '/images/products/noir-silk-blindfold.svg', alt: 'Noir Silk Blindfold illustration' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'accessories',
    collection: 'essentials',
    badge: null,
    attributes: ['22-momme mulberry silk', 'Adjustable', 'Hand wash'],
    ingredients: '100% 22-momme mulberry silk face; soft elastic band.',
    directions:
      'Adjust the strap for a secure, comfortable fit before use. Do not use if the fabric is damaged.',
    compatibility: 'Textile accessory. Keep away from open flame and sharp edges.',
    care: 'Hand wash only in cold water with delicate detergent. Lay flat to dry. Do not machine dry.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Fabric', value: '100% 22-momme mulberry silk' },
      { label: 'Strap', value: 'Adjustable elastic' },
      { label: 'Care', value: 'Hand wash cold; lay flat to dry' },
      { label: 'Fit', value: 'One size fits most' },
    ],
    filters: {
      type: 'accessory',
      material: 'silk',
      waterproof: false,
      forCouples: true,
      forSolo: false,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'EyeOff', label: 'Light Blocking' },
      { icon: 'Feather', label: 'Pure Mulberry Silk' },
      { icon: 'Scissors', label: 'Adjustable Fit' },
    ],
    materials: '100% 22-momme mulberry silk. Hand wash only in cold water with delicate detergent. Lay flat to dry.',
    specifications: 'One size fits most. Fully adjustable elastic band.',
    gallery: [],
    relatedSlugs: ['midnight-bloom-massage-oil', 'obsidian-glass-massage-wand'],
  },
]

export const COLLECTIONS = {
  essentials: {
    title: 'Room 23 Essentials',
    subtitle:
      'Thoughtfully formulated lubricants, intimate wellness products, and everyday staples — curated for quality behind closed doors.',
    description:
      'Our core line of premium intimate wellness products. Every item is vetted for ingredient integrity, body safety, and performance.',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The latest additions to Room 23. Fresh formulations and recently restocked favorites.',
    description: 'Updated as new pieces enter the edit.',
  },
}

export function getProductsByCollection(slug) {
  if (slug === 'new-arrivals') return PRODUCTS.slice(0, 3)
  return PRODUCTS.filter((p) => p.collection === slug)
}

export function getAllCategories() {
  const cats = new Set(PRODUCTS.map((p) => p.category))
  return ['all', ...cats]
}

export function searchProducts(query = '', { collection, category, minPrice, maxPrice } = {}) {
  let results = [...PRODUCTS]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  if (collection) {
    results = results.filter((p) => p.collection === collection)
  }

  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category)
  }

  if (typeof minPrice === 'number') {
    results = results.filter((p) => p.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    results = results.filter((p) => p.price <= maxPrice)
  }

  return results
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductBySlug(slug) {
  if (!slug) return undefined
  return PRODUCTS.find(
    (p) =>
      p.slug === slug ||
      p.id === slug ||
      slugify(p.name) === slug ||
      (Array.isArray(p.aliases) && p.aliases.includes(slug)),
  )
}

export function productHref(product) {
  return `/products/${product.slug || product.id}`
}

export const productPath = productHref

export function matchesProductSlug(product, slug) {
  if (!slug || !product) return false
  return (
    product.slug === slug ||
    product.id === slug ||
    slugify(product.name) === slug ||
    (Array.isArray(product.aliases) && product.aliases.includes(slug))
  )
}

export function getRelatedProducts(product, limit = 3) {
  if (!product) return []
  const related = (product.relatedSlugs || [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean)
  if (related.length >= limit) return related.slice(0, limit)
  const extra = PRODUCTS.filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id))
  return [...related, ...extra].slice(0, limit)
}

export { slugify }
