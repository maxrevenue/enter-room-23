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
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'platinum-silicone-lubricant-8oz', 'cake-stroker'],
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
    relatedSlugs: ['platinum-silicone-lubricant-2oz', 'platinum-silicone-lubricant-8oz', 'cake-stroker'],
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
    relatedSlugs: ['platinum-silicone-lubricant-2oz', 'platinum-silicone-lubricant-4oz', 'cake-stroker'],
  },
  {
    id: 'cake-stroker',
    slug: 'cake-stroker',
    aliases: ['hello-cake-dual-texture-stroker'],
    name: 'Hello Cake Dual-Texture Stroker',
    price: 28,
    tagline: 'Open-ended · dual texture · handheld',
    description:
      'A compact, open-ended sleeve with two interiors: ribbed on one side, beaded on the other. Soft TPR that warms in the hand. No motor, no charge, rinse and put away.',
    shortEditorial:
      'Two interiors. One sleeve. Ribbed or beaded, held in the hand. Rinse and put away.',
    image: '/images/products/cake-stroker/02-product-only.jpg',
    images: [
      { url: '/images/products/cake-stroker/02-product-only.jpg', alt: 'Hello Cake Dual-Texture Stroker, isolated on white' },
      { url: '/images/products/cake-stroker/01-hero.jpg', alt: 'Hello Cake Dual-Texture Stroker with orange box' },
      { url: '/images/products/cake-stroker/04-grip-squeeze.jpg', alt: 'Beaded interior visible through a squeezed sleeve' },
      { url: '/images/products/cake-stroker/05-lifestyle.jpg', alt: 'Stroker on a nightstand with So-Low Lotion' },
      { url: '/images/products/cake-stroker/08-dimensions.jpg', alt: 'Official Hello Cake size graphic, approximately 5 by 2.75 inches' },
      { url: '/images/products/cake-stroker/07-cutaway.jpg', alt: 'Cutaway diagram of beaded and ribbed interiors' },
      { url: '/images/products/cake-stroker/09-box-front.jpg', alt: 'Hello Cake Stroker box front' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'toys',
    collection: 'essentials',
    badge: 'NEW',
    attributes: ['Open-ended', 'Dual texture', 'Body-safe TPR', 'No motor'],
    ingredients:
      'Skin-safe TPR/TPE. Latex-free and phthalate-free. Water-based lubricant only.',
    directions:
      'Use with water-based lubricant only. Insert through either open end to choose ribbed or beaded texture. Adjust grip for pressure. Rinse after use and air-dry fully before storing.',
    compatibility:
      'Water-based lubricant only. Do not use with Room 23 Platinum Silicone Lubricant or any silicone formula — it will degrade the sleeve.',
    care:
      'Rinse with mild soap or toy cleaner; air-dry fully. Not for prolonged bath or shower use. Heat will distort the shape. Store cool and dry, away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Material', value: 'Skin-safe TPR/TPE' },
      { label: 'Free from', value: 'Latex, phthalates' },
      { label: 'Lubricants', value: 'Water-based only — no silicone' },
      { label: 'Power', value: 'None' },
      { label: 'Size', value: 'Approx. 5 in × 2.75 in, dual open-ended' },
    ],
    filters: {
      type: 'toy',
      material: 'tpr',
      waterproof: true,
      forCouples: true,
      forSolo: true,
      powerSource: 'none',
    },
    variants: [],
    features: [
      { icon: 'Waves', label: 'Ribbed + Beaded' },
      { icon: 'Feather', label: 'Palm Control' },
      { icon: 'ShieldCheck', label: 'Body-Safe TPR' },
    ],
    materials:
      'Skin-safe TPR/TPE. Latex-free and phthalate-free. Water-based lubricant only. Do not use with Room 23 Platinum Silicone Lubricant or any silicone formula — it will degrade the sleeve.',
    specifications:
      'Approx. 5 in × 2.75 in. Dual open-ended. Rinse with mild soap or toy cleaner; air-dry fully. Not for prolonged bath or shower use. Heat will distort the shape.',
    gallery: [
      { url: '/images/products/cake-stroker/01-hero.jpg', alt: 'Hello Cake Dual-Texture Stroker with orange box' },
      { url: '/images/products/cake-stroker/04-grip-squeeze.jpg', alt: 'Beaded interior visible through a squeezed sleeve' },
      { url: '/images/products/cake-stroker/05-lifestyle.jpg', alt: 'Stroker on a nightstand with So-Low Lotion' },
      { url: '/images/products/cake-stroker/08-dimensions.jpg', alt: 'Official Hello Cake size graphic, approximately 5 by 2.75 inches' },
      { url: '/images/products/cake-stroker/07-cutaway.jpg', alt: 'Cutaway diagram of beaded and ribbed interiors' },
      { url: '/images/products/cake-stroker/09-box-front.jpg', alt: 'Hello Cake Stroker box front' },
    ],
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'platinum-silicone-lubricant-2oz'],
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
