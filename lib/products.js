import { FULFILLMENT_TYPES, VENDOR_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'

export const PRODUCTS = [
  {
    id: 'lube-silicone-2oz',
    name: 'Platinum Silicone Lubricant - 2oz',
    price: 18,
    tagline: 'Ultra-concentrated · waterproof · travel-size',
    description:
      'Medical-grade silicone formula. A single application lasts. Waterproof, condom-safe, and fragrance-free. The definitive choice for shower intimacy, in our own house formulation. 2 oz travel pump.',
    image: null,
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
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials: 'Medical-grade dimethicone. Made in the USA with globally sourced FDA-cleared ingredients. Latex-compatible. DO NOT use with silicone toys.',
    specifications: '2 oz (59 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
  },
  {
    id: 'lube-silicone-4oz',
    name: 'Platinum Silicone Lubricant - 4oz',
    price: 28,
    tagline: 'Ultra-concentrated · waterproof · standard-size',
    description:
      'Medical-grade silicone formula. A single application lasts. Waterproof, condom-safe, and fragrance-free. The definitive choice for shower intimacy, in our own house formulation. 4 oz precision pump.',
    image: null,
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
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials: 'Medical-grade dimethicone. Made in the USA with globally sourced FDA-cleared ingredients. Latex-compatible. DO NOT use with silicone toys.',
    specifications: '4 oz (118 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
  },
  {
    id: 'lube-silicone-8oz',
    name: 'Platinum Silicone Lubricant - 8oz',
    price: 45,
    tagline: 'Ultra-concentrated · waterproof · value-size',
    description:
      'Medical-grade silicone formula. A single application lasts. Waterproof, condom-safe, and fragrance-free. The definitive choice for shower intimacy, in our own house formulation. 8 oz value pump.',
    image: null,
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
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials: 'Medical-grade dimethicone. Made in the USA with globally sourced FDA-cleared ingredients. Latex-compatible. DO NOT use with silicone toys.',
    specifications: '8 oz (236 mL) precision pump bottle. Clear, odorless formula. Dermatologically tested.',
    gallery: [],
  },
  {
    id: 'ds-glass-wand',
    name: 'Obsidian Glass Massage Wand',
    price: 65,
    tagline: 'Temperature-responsive · hand-crafted · seamless',
    description:
      'Hand-blown borosilicate glass wand designed for temperature play. Can be warmed in water or chilled in the fridge before use. Seamless construction ensures ultimate hygiene.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'toys',
    collection: 'vault',
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
      { icon: 'Sparkles', label: 'Hand-Blown Glass' },
      { icon: 'ShieldCheck', label: 'Hypoallergenic' },
    ],
    materials: '100% Medical-grade borosilicate glass. Non-porous and hypoallergenic. Compatible with all lubricant types, including silicone.',
    specifications: 'Length: 7.5 inches. Girth: 4.5 inches. Weight: 0.8 lbs.',
    gallery: [],
  },
  {
    id: 'ds-massage-oil',
    name: 'Midnight Bloom Massage Oil',
    price: 42,
    tagline: 'Sensorial · nourishing · botanical',
    description:
      'A deeply nourishing blend of sweet almond, jojoba, and evening primrose oils. Infused with subtle notes of sandalwood and dark vanilla. Perfect for full-body relaxation.',
    image: null,
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
      { icon: 'Droplets', label: 'Deeply Nourishing' },
      { icon: 'Wind', label: 'Sensorial Aroma' },
    ],
    materials: 'Sweet almond oil, jojoba seed oil, evening primrose oil, vitamin E, natural fragrance blend. Vegan and cruelty-free.',
    specifications: '3.4 oz (100 mL) glass bottle with dropper. Store in a cool, dark place.',
    gallery: [],
  },
  {
    id: 'ds-silk-blindfold',
    name: 'Noir Silk Blindfold',
    price: 35,
    tagline: 'Sensory deprivation · pure mulberry silk',
    description:
      'Heighten anticipation and restrict the senses with this pure mulberry silk blindfold. Features an elastic, adjustable strap designed not to pull or tangle hair.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.DROPSHIP,
    vendorType: VENDOR_TYPES.WILLIAMS_DROPSHIP,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'accessories',
    collection: 'vault',
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
      { icon: 'EyeOff', label: 'Sensory Deprivation' },
      { icon: 'Feather', label: 'Pure Mulberry Silk' },
      { icon: 'Scissors', label: 'Adjustable Fit' },
    ],
    materials: '100% 22-momme Mulberry silk. Hand wash only in cold water with delicate detergent. Lay flat to dry.',
    specifications: 'One size fits most. Fully adjustable elastic band.',
    gallery: [],
  }
]

// ── Collection Metadata ──
export const COLLECTIONS = {
  essentials: {
    title: 'Room 23 Essentials',
    subtitle: 'Thoughtfully formulated lubricants, intimate wellness products, and everyday staples — curated for those who demand quality behind closed doors.',
    description: 'Our core line of premium intimate wellness products. Every item in the Essentials collection is vetted for ingredient integrity, body safety, and performance.',
  },
  vintage: {
    title: 'Vintage Collection',
    subtitle: 'Curated pre-owned and rare vintage intimate collectibles, magazines, and hard-to-find accessories. Each piece tells a story.',
    description: 'A rotating archive of iconic design, rare finds, and collectible artifacts. The Vintage Collection celebrates the history of intimate wellness — from mid-century to the present.',
  },
  vault: {
    title: 'The Vault',
    subtitle: 'Members-only curated drops. Limited quantities, exclusive access.',
    description: 'The Vault is Room 23\'s private release program. High-demand, limited-edition products and collaborations available in small batches.',
  },
  'new-arrivals': {
    title: 'New Arrivals',
    subtitle: 'The latest additions to Room 23. Fresh product drops, new formulations, and recently restocked favorites.',
    description: 'Be the first to discover what\'s new at Room 23. Our New Arrivals are updated weekly.',
  },
}

// ── Helper: Get products by collection slug ──
export function getProductsByCollection(slug) {
  if (slug === 'new-arrivals') return PRODUCTS.slice(0, 3)
  return PRODUCTS.filter((p) => p.collection === slug)
}

// ── Helper: Get all unique categories ──
export function getAllCategories() {
  const cats = new Set(PRODUCTS.map((p) => p.category))
  return ['all', ...cats]
}

// ── Helper: Search + filter products ──
export function searchProducts(query = '', { collection, category, minPrice, maxPrice } = {}) {
  let results = [...PRODUCTS]

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
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

// ── Helper: Get single product by ID ──
export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id)
}

