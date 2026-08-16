import { FULFILLMENT_TYPES, VENDOR_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { SITE_CONFIG } from '@/config/site'

const DISCRETION =
  `Orders leave in plain, unmarked packaging with no outer branding. The packing slip does not print explicit SKU names. The billing descriptor appears as ${SITE_CONFIG.billingDescriptor}. The return address carries no indication of contents.`

const RETURNS_SNIPPET =
  'Unopened items may be returned within 14 days of delivery. Opened intimate goods and liquids are final sale. You pay return shipping unless we shipped the wrong or damaged item. Request an RMA at support@room23.net. Report defects within 48 hours of delivery.'

const AGE_NOTE = 'For adults 18+ only. By adding this item to your cart you confirm you are of legal age.'

const SHIPPING_SNIPPET =
  'Processed in 1–2 business days and shipped with tracking. US only. Free standard shipping on orders $99+.'

function gallery(paths, alts) {
  return paths.map((url, i) => ({ url, alt: alts[i] || alts[0] }))
}

export const PRODUCTS = [
  {
    id: 'lube-silicone-2oz',
    slug: 'platinum-silicone-lubricant-2oz',
    aliases: ['lube-silicone-2oz'],
    name: 'Platinum Silicone Lubricant — 2oz',
    price: 18,
    tagline: 'Ultra-concentrated · waterproof · travel-size',
    description:
      'Medical-grade platinum-cure silicone formula in a 2 oz travel pump. A thin film lasts. Waterproof, condom-safe, and fragrance-free. House formulation for shower use and travel.',
    shortEditorial:
      'A concentrated house formula for water, heat, and unhurried time. One pass is enough. Nothing to scent the air.',
    image: '/images/products/platinum-silicone-lubricant-2oz.jpg',
    gallery: gallery(
      [
        '/images/products/platinum-silicone-lubricant-2oz.jpg',
        '/images/products/platinum-silicone-lubricant-01.jpg',
        '/images/products/platinum-silicone-lubricant-02.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
      ],
      [
        'Platinum Silicone Lubricant 2 oz travel pump on dark stone',
        'Platinum Silicone Lubricant bottle on honed stone',
        'Pump detail of Platinum Silicone Lubricant',
        'Plain unmarked carton used for Room 23 shipments',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'TRAVEL',
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
      { icon: 'ShieldCheck', label: 'Platinum-Cure Silicone' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Platinum-cure dimethicone (medical-grade). Phthalate-free. Fragrance-free. Paraben-free. Glycerin-free. Made in the USA with globally sourced ingredients.',
    specifications: '2 oz (59 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    composition: 'Platinum-cure dimethicone (medical-grade silicone).',
    freeFrom: ['Phthalates', 'Parabens', 'Glycerin', 'Fragrance', 'Glycols used as humectants'],
    care: 'Recap the pump between uses. Store at room temperature, away from direct sun. Clean the pump face with mild soap and water.',
    warning:
      'Latex- and polyisoprene-condom compatible. Compatible with glass, stainless steel, and ABS. Do not use with silicone toys — silicone on silicone will degrade the surface.',
    ingredients:
      'Platinum-cure dimethicone. Clear, odorless, and free of fragrance, parabens, glycerin, and phthalates.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['Platinum-cure silicone', 'Travel 2 oz', 'Waterproof', 'Phthalate-free'],
  },
  {
    id: 'lube-silicone-4oz',
    slug: 'platinum-silicone-lubricant',
    aliases: ['lube-silicone-4oz', 'platinum-silicone-lubricant-4oz'],
    name: 'Platinum Silicone Lubricant — 4oz',
    price: 28,
    tagline: 'Ultra-concentrated · waterproof · standard-size',
    description:
      'Medical-grade platinum-cure silicone formula in a 4 oz precision pump. A single application lasts. Waterproof, condom-safe, and fragrance-free. House formulation for shower intimacy.',
    shortEditorial:
      'The house size. Concentrated enough that one pass is enough. Nothing ornamental on the nightstand.',
    image: '/images/products/platinum-silicone-lubricant-01.jpg',
    gallery: gallery(
      [
        '/images/products/platinum-silicone-lubricant-01.jpg',
        '/images/products/platinum-silicone-lubricant-02.jpg',
        '/images/products/platinum-silicone-lubricant-03.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
      ],
      [
        'Platinum Silicone Lubricant 4 oz pump on dark stone',
        'Pump detail of Platinum Silicone Lubricant',
        'Platinum Silicone Lubricant bottles in the house edit',
        'Plain unmarked carton used for Room 23 shipments',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'BEST SELLER',
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
      { icon: 'ShieldCheck', label: 'Platinum-Cure Silicone' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Platinum-cure dimethicone (medical-grade). Phthalate-free. Fragrance-free. Paraben-free. Glycerin-free. Made in the USA with globally sourced ingredients.',
    specifications: '4 oz (118 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    composition: 'Platinum-cure dimethicone (medical-grade silicone).',
    freeFrom: ['Phthalates', 'Parabens', 'Glycerin', 'Fragrance'],
    care: 'Recap the pump between uses. Store at room temperature, away from direct sun.',
    warning:
      'Latex- and polyisoprene-condom compatible. Compatible with glass, stainless steel, and ABS. Do not use with silicone toys.',
    ingredients:
      'Platinum-cure dimethicone. Clear, odorless, and free of fragrance, parabens, glycerin, and phthalates.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['Platinum-cure silicone', '4 oz pump', 'Waterproof', 'Phthalate-free'],
  },
  {
    id: 'lube-silicone-8oz',
    slug: 'platinum-silicone-lubricant-8oz',
    aliases: ['lube-silicone-8oz'],
    name: 'Platinum Silicone Lubricant — 8oz',
    price: 45,
    tagline: 'Ultra-concentrated · waterproof · value-size',
    description:
      'Medical-grade platinum-cure silicone formula in an 8 oz value pump. The same house formulation as the 2 oz and 4 oz, in the size meant to stay at home.',
    shortEditorial:
      'The house formula, unhurried. Same platinum-cure dimethicone. A larger pump for the cabinet, not the weekender.',
    image: '/images/products/platinum-silicone-lubricant-03.jpg',
    gallery: gallery(
      [
        '/images/products/platinum-silicone-lubricant-03.jpg',
        '/images/products/platinum-silicone-lubricant-01.jpg',
        '/images/products/platinum-silicone-lubricant-02.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
      ],
      [
        'Platinum Silicone Lubricant value size with the house edit',
        'Platinum Silicone Lubricant bottle on honed stone',
        'Pump detail of Platinum Silicone Lubricant',
        'Plain unmarked carton used for Room 23 shipments',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'VALUE',
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
      { icon: 'ShieldCheck', label: 'Platinum-Cure Silicone' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials:
      'Platinum-cure dimethicone (medical-grade). Phthalate-free. Fragrance-free. Paraben-free. Glycerin-free. Made in the USA with globally sourced ingredients.',
    specifications: '8 oz (236 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    composition: 'Platinum-cure dimethicone (medical-grade silicone).',
    freeFrom: ['Phthalates', 'Parabens', 'Glycerin', 'Fragrance'],
    care: 'Recap the pump between uses. Store at room temperature, away from direct sun.',
    warning:
      'Latex- and polyisoprene-condom compatible. Compatible with glass, stainless steel, and ABS. Do not use with silicone toys.',
    ingredients:
      'Platinum-cure dimethicone. Clear, odorless, and free of fragrance, parabens, glycerin, and phthalates.',
    directions:
      'Dispense a small amount onto clean skin and spread in a thin film. Reapply only as needed. Rinse with mild soap and water after use.',
    compatibility:
      'Safe with latex and polyisoprene condoms. Compatible with glass, stainless steel, and ABS plastic. Do not use with silicone toys.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['Platinum-cure silicone', '8 oz value', 'Waterproof', 'Phthalate-free'],
  },
  {
    id: 'ds-glass-wand',
    slug: 'obsidian-glass-massage-wand',
    aliases: ['ds-glass-wand'],
    name: 'Obsidian Glass Massage Wand',
    price: 65,
    tagline: 'Temperature-responsive · hand-crafted · seamless',
    description:
      'Hand-blown borosilicate glass wand designed for temperature play. Warm in water or chill before use. Seamless, non-porous construction. Compatible with all lubricant types, including silicone.',
    shortEditorial:
      'Glass that holds a temperature. Seamless, so care is simple. A single object, not a novelty.',
    image: '/images/products/obsidian-glass-wand-01.jpg',
    gallery: gallery(
      [
        '/images/products/obsidian-glass-wand-01.jpg',
        '/images/products/obsidian-glass-wand-02.jpg',
        '/images/products/obsidian-glass-wand-03.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
      ],
      [
        'Obsidian Glass Massage Wand on dark linen',
        'Borosilicate glass wand still life',
        'Glass surface and rounded end detail',
        'Plain unmarked carton used for Room 23 shipments',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'toys',
    collection: 'essentials',
    badge: null,
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
      { icon: 'Sparkles', label: 'Borosilicate Glass' },
      { icon: 'ShieldCheck', label: 'Non-Porous' },
    ],
    materials:
      '100% borosilicate glass. Non-porous, hypoallergenic, and phthalate-free. No coatings. No battery. Compatible with water-based, hybrid, and silicone lubricants.',
    specifications: 'Length: 7.5 inches. Circumference: 4.5 inches. Weight: 0.8 lbs. Seamless construction.',
    composition: 'Borosilicate glass, annealed. No metal core, no silicone sleeve.',
    freeFrom: ['Phthalates', 'Porous coatings', 'Batteries'],
    care: 'Wash with warm water and mild unscented soap, or boil briefly. Dry fully before storage. Do not thermal-shock from freezer to boiling water.',
    warning:
      'Compatible with all lubricant types, including silicone. Glass is body-safe when intact — inspect before each use and discontinue if chipped.',
    ingredients: 'Borosilicate glass only.',
    directions:
      'Wash before first use. Warm in a bowl of warm water or chill in the refrigerator (never the freezer) for temperature play. Use with lubricant. Inspect for chips before each use.',
    compatibility:
      'Compatible with water-based, hybrid, and silicone lubricants. Not a vibrating device. No charging.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['Borosilicate glass', 'Temperature play', 'Phthalate-free', 'No electronics'],
  },
  {
    id: 'ds-massage-oil',
    slug: 'midnight-bloom-massage-oil',
    aliases: ['ds-massage-oil'],
    name: 'Midnight Bloom Massage Oil',
    price: 42,
    tagline: 'Sensorial · nourishing · botanical',
    description:
      'A nourishing blend of sweet almond, jojoba, and evening primrose oils with sandalwood and dark vanilla. Made for skin — not a dietary supplement, not a treatment claim. 3.4 oz glass dropper.',
    shortEditorial:
      'Botanical oil for unhurried massage. Skin-first ingredients. No miracle claims. A bottle that belongs on a dresser.',
    image: '/images/products/midnight-bloom-oil-01.jpg',
    gallery: gallery(
      [
        '/images/products/midnight-bloom-oil-01.jpg',
        '/images/products/midnight-bloom-oil-02.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
        '/images/shipping/discreet-mailer-02.jpg',
      ],
      [
        'Midnight Bloom Massage Oil amber dropper bottle',
        'Botanical oil drop on dark stone',
        'Plain unmarked carton used for Room 23 shipments',
        'Unmarked mailer used for discreet delivery',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.ELDORADO_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    badge: null,
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
      { icon: 'Droplets', label: 'Skin Massage' },
      { icon: 'Wind', label: 'Sandalwood & Vanilla' },
    ],
    materials:
      'Sweet almond oil, jojoba seed oil, evening primrose oil, tocopherol (vitamin E), natural fragrance blend (sandalwood, vanilla). Vegan. Cruelty-free. Phthalate-free. Not for ingestion.',
    specifications: '3.4 oz (100 mL) glass bottle with dropper. Store in a cool, dark place.',
    composition:
      'Prunus amygdalus dulcis (sweet almond) oil, Simmondsia chinensis (jojoba) seed oil, Oenothera biennis (evening primrose) oil, tocopherol, natural fragrance.',
    freeFrom: ['Phthalates', 'Parabens', 'Mineral oil', 'Synthetic dyes'],
    care: 'Store capped, away from heat and sunlight. Wipe the dropper after use. External use only.',
    warning:
      'For external massage of intact skin only. Not a lubricant for use with latex condoms (oils degrade latex). Not for ingestion. Discontinue if irritation occurs. Contains tree-nut oil (almond).',
    ingredients:
      'Sweet almond oil, jojoba seed oil, evening primrose oil, vitamin E, natural fragrance blend. Not intended to diagnose, treat, or cure any condition.',
    directions:
      'Warm a few drops between the palms and massage into skin. External use only. Not a dietary oil.',
    compatibility:
      'For skin massage. Oil-based — do not use with latex condoms. Avoid silicone toys if you want a residue-free surface; wash glass with soap after oil.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['Botanical oils', '3.4 oz glass', 'External use only', 'Phthalate-free'],
  },
  {
    id: 'ds-silk-blindfold',
    slug: 'noir-silk-blindfold',
    aliases: ['ds-silk-blindfold'],
    name: 'Noir Silk Blindfold',
    price: 35,
    tagline: 'Light-blocking · 22-momme mulberry silk',
    description:
      'A 22-momme mulberry silk blindfold with an adjustable strap designed not to pull hair. Light-blocking for sensory rest. Fiber, care, and fit — not costume.',
    shortEditorial:
      'Mulberry silk against the skin. An adjustable strap. Made to dim the room, not announce itself.',
    image: '/images/products/noir-silk-blindfold-01.jpg',
    gallery: gallery(
      [
        '/images/products/noir-silk-blindfold-01.jpg',
        '/images/products/noir-silk-blindfold-02.jpg',
        '/images/products/noir-silk-blindfold-03.jpg',
        '/images/shipping/discreet-mailer-01.jpg',
      ],
      [
        'Noir Silk Blindfold folded on dark wood',
        'Black silk sleep mask with strap',
        'Mulberry silk weave detail',
        'Plain unmarked carton used for Room 23 shipments',
      ],
    ),
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'accessories',
    collection: 'essentials',
    badge: null,
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
      { icon: 'EyeOff', label: 'Light-Blocking' },
      { icon: 'Feather', label: '22-Momme Silk' },
      { icon: 'Scissors', label: 'Adjustable Fit' },
    ],
    materials:
      '100% 22-momme mulberry silk face with an adjustable elastic strap. Phthalate-free hardware. No metallic coatings on the silk.',
    specifications: 'One size. Fully adjustable strap. Soft-lined interior.',
    composition: '22-momme mulberry silk (Bombyx mori); elastic strap; metal-free adjuster.',
    freeFrom: ['Phthalates', 'Synthetic satin face', 'Plastic sequins'],
    care: 'Hand wash cold with a silk or delicate detergent. Do not wring. Lay flat to dry. Do not machine dry or iron on high heat.',
    warning:
      'Not a medical sleep device. Keep away from open flame. Compatible with water-based or silicone lubricant on skin — keep oil and lubricant off the silk face when possible; spot-clean promptly.',
    ingredients: 'Mulberry silk fiber. No finishers intended for ingestion or therapeutic claims.',
    directions:
      'Adjust the strap so the mask sits flush without pressure at the temples. Store flat or loosely rolled in a drawer, away from direct sun.',
    compatibility:
      'Textile accessory. Compatible with all Room 23 formulas on skin; silk itself prefers to stay dry. Not waterproof.',
    discretionNotes: DISCRETION,
    returnsSnippet: RETURNS_SNIPPET,
    shippingSnippet: SHIPPING_SNIPPET,
    ageNote: AGE_NOTE,
    attributes: ['22-momme mulberry silk', 'Adjustable strap', 'Light-blocking', 'Hand wash'],
  },
]

export const COLLECTIONS = {
  essentials: {
    title: 'Room 23 Essentials',
    subtitle:
      'Lubricant, glass, botanical oil, and silk — a closed edit of shipped goods.',
    description:
      'The core line. Every item is sold as a physical product with a materials spec, a price, and a photo.',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The current house edit. Nothing seasonal for its own sake.',
    description: 'The same six SKUs, shown as the current drop.',
  },
}

export function productPath(product) {
  return `/products/${product.slug}`
}

export function matchesProductSlug(product, slug) {
  if (!slug) return false
  return product.slug === slug || product.id === slug || (product.aliases || []).includes(slug)
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
  return PRODUCTS.find((p) => matchesProductSlug(p, slug))
}

export function getRelatedProducts(product, limit = 3) {
  return PRODUCTS.filter((p) => p.id !== product.id).slice(0, limit)
}
