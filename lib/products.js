import { FULFILLMENT_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'

export const PRODUCTS = [
  {
    id: 'lube-water-01',
    name: 'Signature Water-Based Lubricant',
    price: 22,
    tagline: 'Clinically-clean · pH-balanced · paraben-free',
    description:
      'High-performance water-based formula engineered with FDA-clear ingredients. Silky, long-lasting glide without residue. Compatible with all materials. 8 oz pump bottle.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'BEST SELLER',
    variants: [
      { label: '8 oz Pump', price: 22 },
      { label: '4 oz Travel', price: 14 },
    ],
    features: [
      { icon: 'Droplets', label: 'Water-Based Formula' },
      { icon: 'Shield', label: 'pH-Balanced' },
      { icon: 'Leaf', label: 'Paraben-Free' },
    ],
    materials: 'Purified water, propanediol, hydroxyethylcellulose, potassium sorbate, citric acid. Made in the USA with globally sourced FDA-cleared ingredients. Latex-compatible. Suitable for all toy materials including silicone, glass, and ABS plastic.',
    specifications: '8 oz (236 mL) pump bottle. pH 4.0-4.5. Clear, odorless formula. Dermatologically tested. Shelf life: 24 months unopened, 12 months after opening.',
    gallery: [],
  },
  {
    id: 'lube-silicone-01',
    name: 'Platinum Silicone Lubricant',
    price: 28,
    tagline: 'Ultra-concentrated · waterproof · single-drop formula',
    description:
      'Medical-grade silicone formula. A single application lasts. Waterproof, condom-safe, and fragrance-free. The Pjur-grade alternative, in our own house formulation. 4 oz precision pump.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: null,
    variants: [
      { label: '4 oz Pump', price: 28 },
      { label: '2 oz Travel', price: 18 },
    ],
    features: [
      { icon: 'Waves', label: 'Ultra-Concentrated' },
      { icon: 'ShieldCheck', label: 'Medical-Grade' },
      { icon: 'Droplets', label: 'Waterproof' },
    ],
    materials: 'Dimethicone, dimethiconol, cyclomethicone, tocopheryl acetate (Vitamin E). 100% silicone-based — no water, no preservatives. Fragrance-free. Compatible with latex and polyurethane condoms. Not recommended for silicone toys.',
    specifications: '4 oz (118 mL) precision pump bottle. Single-drop application technology. Waterproof and shower-safe. No parabens, no glycerin. Shelf life: 36 months.',
    gallery: [],
  },
  {
    id: 'lube-hybrid-01',
    name: 'Premium Hybrid Silk Lubricant',
    price: 26,
    tagline: 'Water-silicone blend · long-lasting · silky finish',
    description:
      'A luxurious hybrid formula combining the easy cleanup of water-based lubricant with the endurance of silicone. pH-balanced, fragrance-free, and compatible with all materials. 6 oz pump.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: 'BEST SELLER',
    variants: [
      { label: '6 oz Pump', price: 26 },
      { label: '3 oz Travel', price: 16 },
    ],
    features: [
      { icon: 'Blend', label: 'Hybrid Formula' },
      { icon: 'Sparkles', label: 'Silky Finish' },
      { icon: 'Heart', label: 'Body-Safe' },
    ],
    materials: 'Purified water, dimethicone, propanediol, hydroxyethylcellulose, tocopheryl acetate (Vitamin E), aloe barbadensis leaf extract. Hybrid water-silicone blend. pH-balanced. Compatible with all toy materials and condoms.',
    specifications: '6 oz (177 mL) pump bottle. pH 4.2-4.6. Translucent white, silky texture. Washes off easily with water. Shelf life: 24 months.',
    gallery: [],
  },
  {
    id: 'lube-aloe-01',
    name: 'Natural Aloe Personal Lubricant',
    price: 24,
    tagline: 'Organic aloe vera · vitamin E · glycerin-free',
    description:
      'Hypoallergenic, plant-based formula with organic aloe vera as the first ingredient. Infused with vitamin E for skin comfort. Gentle enough for daily use. 6 oz tube.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'essentials',
    collection: 'essentials',
    badge: null,
    variants: [
      { label: '6 oz Tube', price: 24 },
      { label: '3 oz Tube', price: 15 },
    ],
    features: [
      { icon: 'Leaf', label: 'Organic Aloe Vera' },
      { icon: 'Heart', label: 'Hypoallergenic' },
      { icon: 'Shield', label: 'Glycerin-Free' },
    ],
    materials: 'Organic aloe barbadensis leaf juice, propanediol, hydroxyethylcellulose, tocopheryl acetate (Vitamin E), chamomilla recutita flower extract, potassium sorbate. Plant-based. Gluten-free, nut-free. Compatible with all toy materials.',
    specifications: '6 oz (177 mL) flip-top tube. pH 4.0-4.5. Light, refreshing scent from natural botanicals. No artificial fragrances. Shelf life: 18 months.',
    gallery: [],
  },
  {
    id: 'toy-wand-01',
    name: 'Premium Silicone Wand',
    price: 79,
    tagline: 'Medical-grade silicone · whisper-quiet motor',
    description:
      'Precision-engineered from hypoallergenic silicone with a fluid ergonomic form. Ten calibrated intensity modes and USB-C fast charging. Fully waterproof (IPX7). Two-year warranty.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'accessories',
    collection: 'vintage',
    badge: 'BEST SELLER',
    variants: [
      { label: 'Midnight Black', price: 79 },
      { label: 'Crimson Red', price: 85 },
    ],
    features: [
      { icon: 'Waves', label: '10 Intensity Modes' },
      { icon: 'Droplets', label: 'Waterproof IPX7' },
      { icon: 'Shield', label: 'Body-Safe Silicone' },
    ],
    materials: 'Body-safe platinum-cure silicone, ABS plastic core. Phthalate-free, BPA-free, latex-free. Soft-touch matte finish. Whisper-quiet motor rated below 45 dB.',
    specifications: 'Length: 8.7 in (22 cm). Weight: 0.65 lbs (295 g). Battery: 2200 mAh Li-ion. Charging: USB-C, 2.5 hr full charge. Runtime: 3 hrs continuous. IPX7 waterproof. 2-year limited warranty.',
    gallery: [],
  },
  {
    id: 'toy-couples-01',
    name: 'Couples Vibrator',
    price: 149,
    tagline: 'App-controlled · 10 modes · C-shape design',
    description:
      'App-controlled wearable couples toy. 10 vibration modes with a squeeze remote. Body-safe silicone, USB rechargeable, whisper-quiet. Designed to stay in place during intimacy.',
    image: null,
    fulfillmentType: FULFILLMENT_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'accessories',
    collection: 'vintage',
    badge: 'RARE INVENTORY',
    variants: [
      { label: 'Midnight Black', price: 149 },
      { label: 'Rose Gold', price: 159 },
    ],
    features: [
      { icon: 'Smartphone', label: 'App-Controlled' },
      { icon: 'Waves', label: '10 Vibration Modes' },
      { icon: 'ShieldCheck', label: 'Body-Safe Silicone' },
    ],
    materials: 'Body-safe platinum-cure silicone exterior, medical-grade ABS core. Phthalate-free, BPA-free. Dual-density construction — firm core with soft exterior layer. Splashproof (IPX5).',
    specifications: 'C-shape ergonomic design. Length: 5.2 in (13.2 cm) internal arm, 3.4 in (8.6 cm) external arm. Battery: 1100 mAh Li-ion. Charging: USB-C, 1.5 hr charge. Runtime: 2.5 hrs. Bluetooth 5.0 app connectivity. Includes squeeze remote + travel case.',
    gallery: [],
  },
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
