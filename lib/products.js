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
  {
    id: 'skins-delay',
    slug: 'skins-delay-spray',
    aliases: ['skins-natural-delay-spray', 'skins-delay'],
    name: 'SKINS Delay Spray',
    price: 22,
    tagline: 'PROBOOST · non-numbing · 30 ml',
    description:
      'A fragrance-free delay spray for men. PROBOOST formula in an airless pump. Apply 2–6 sprays, wait about ten minutes. Partner-friendly and oral-safe. External use only.',
    shortEditorial:
      'A quiet, non-numbing delay spray. Fragrance-free. Airless pump. Wait, then continue.',
    image: '/images/products/skins-delay/packshot.png',
    images: [
      { url: '/images/products/skins-delay/packshot.png', alt: 'SKINS Delay Spray 30 ml box and bottle' },
      { url: '/images/products/skins-delay/lifestyle.png', alt: 'SKINS Delay Spray lifestyle packshot' },
      { url: '/images/products/skins-delay/ingredients.png', alt: 'SKINS Delay Spray botanical formula notes' },
      { url: '/images/products/skins-delay/icons.png', alt: 'SKINS Delay Spray use notes' },
      { url: '/images/products/skins-delay/howtouse.png', alt: 'SKINS Delay Spray how to use' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Non-numbing', 'Fragrance-free', 'Partner-friendly', 'Made in USA'],
    ingredients:
      'Water-based, pH-balanced. L-Arginine, Panax Ginseng, Ginkgo Biloba, Maca, Saw Palmetto, Catuaba. Fragrance-free. External use only.',
    directions:
      'Shake well. Apply 2–6 sprays to the head and shaft. Wait about 10 minutes before intimacy. Reapply only as needed. Wash off with mild soap and water after use.',
    compatibility:
      'Partner-friendly and oral-safe when used as directed. External use only. Not a personal lubricant substitute. Patch-test if you have sensitive skin.',
    care: 'Keep the airless pump capped. Store at room temperature away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Formula', value: 'PROBOOST, water-based, pH-balanced' },
      { label: 'Free from', value: 'Fragrance; non-numbing' },
      { label: 'Size', value: '30 ml / 1 fl oz airless pump' },
      { label: 'Yield', value: '200+ pumps' },
      { label: 'Origin', value: 'Made in USA, FDA-regulated facility' },
    ],
    filters: {
      type: 'wellness',
      material: 'water-based',
      waterproof: false,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'ShieldCheck', label: 'Non-Numbing' },
      { icon: 'Droplets', label: 'Fragrance-Free' },
      { icon: 'Waves', label: 'Airless Pump' },
    ],
    materials:
      'Water-based, pH-balanced. L-Arginine, Panax Ginseng, Ginkgo Biloba, Maca, Saw Palmetto, Catuaba. External use only.',
    specifications: '30 ml / 1 fl oz. 200+ pumps. Made in the USA in an FDA-regulated facility.',
    gallery: [
      { url: '/images/products/skins-delay/lifestyle.png', alt: 'SKINS Delay Spray lifestyle packshot' },
      { url: '/images/products/skins-delay/ingredients.png', alt: 'SKINS Delay Spray botanical formula notes' },
      { url: '/images/products/skins-delay/icons.png', alt: 'SKINS Delay Spray use notes' },
      { url: '/images/products/skins-delay/howtouse.png', alt: 'SKINS Delay Spray how to use' },
    ],
    relatedSlugs: ['platinum-silicone-lubricant-4oz', 'cg-oh-my-warming-stimulant', 'arlo-atlas-body-oil'],
  },
  {
    id: 'cg-oh-my',
    slug: 'cg-oh-my-warming-stimulant',
    aliases: ['cg-oh-my', 'oh-my-warming'],
    name: 'CG Oh My Warming Stimulant',
    price: 22,
    tagline: 'Warming · fragrance-free · 1 oz',
    description:
      'A warming clitoral serum from Classic Erotica / CG. Fragrance-free, paraben-free, made in the USA. A small amount on the clitoris; reapply as needed.',
    shortEditorial:
      'A small amount. Warmth, then wait. Fragrance-free. Made in the USA.',
    image: '/images/products/cg-oh-my/packshot.webp',
    images: [
      { url: '/images/products/cg-oh-my/packshot.webp', alt: 'CG Oh My Warming Stimulant box and tube' },
      { url: '/images/products/cg-oh-my/tube.jpg', alt: 'CG Oh My Warming Stimulant tube' },
      { url: '/images/products/cg-oh-my/angle-1.jpg', alt: 'CG Oh My Warming Stimulant packshot, alternate angle' },
      { url: '/images/products/cg-oh-my/angle-2.jpg', alt: 'CG Oh My Warming Stimulant packshot, box detail' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Warming', 'Fragrance-free', 'Paraben-free', 'Made in USA'],
    ingredients:
      'Fragrance-free warming serum. Paraben-free, gluten-free, sugar-free, mineral-oil-free. Made in the USA. External use only.',
    directions:
      'Apply a small amount to the clitoris. Reapply as needed. Wash off with mild soap and water after use. Discontinue if irritation occurs.',
    compatibility:
      'External use only. Avoid the eye area. Compatible with toys when the formula is fully washed off afterward. Patch-test if you have sensitive skin.',
    care: 'Recap the tube. Store at room temperature away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Type', value: 'Warming clitoral serum' },
      { label: 'Free from', value: 'Fragrance, parabens, gluten, sugar, mineral oil' },
      { label: 'Size', value: '1 fl oz / 30 ml' },
      { label: 'Origin', value: 'Made in the USA' },
      { label: 'SKU', value: 'HCGC3001-01' },
      { label: 'UPC', value: '638258901376' },
    ],
    filters: {
      type: 'wellness',
      material: 'serum',
      waterproof: false,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Waves', label: 'Warming' },
      { icon: 'Droplets', label: 'Fragrance-Free' },
      { icon: 'ShieldCheck', label: 'Made in USA' },
    ],
    materials:
      'Fragrance-free warming serum. Paraben-free. Made in the USA. External use only.',
    specifications: '1 fl oz / 30 ml squeeze tube. SKU HCGC3001-01. UPC 638258901376.',
    gallery: [
      { url: '/images/products/cg-oh-my/tube.jpg', alt: 'CG Oh My Warming Stimulant tube' },
      { url: '/images/products/cg-oh-my/angle-1.jpg', alt: 'CG Oh My Warming Stimulant packshot, alternate angle' },
      { url: '/images/products/cg-oh-my/angle-2.jpg', alt: 'CG Oh My Warming Stimulant packshot, box detail' },
    ],
    relatedSlugs: ['skins-delay-spray', 'cg-pole-polish', 'platinum-silicone-lubricant-2oz'],
  },
  {
    id: 'heli-lavender-mist',
    slug: 'heli-lavender-chamomile-mist',
    aliases: ['heli-lavender-mist', 'heli-mist'],
    name: 'HéLi Lavender & Chamomile Mist',
    price: 24,
    tagline: 'Lavender · chamomile · 4 oz',
    description:
      'HéLi body mist. Lavender and chamomile with aloe and witch hazel. Light, not heavy. Spray over skin as needed.',
    shortEditorial:
      'Lavender and chamomile. Aloe. Witch hazel. A light mist, nothing heavy.',
    image: '/images/products/heli-lavender-mist/packshot.png',
    images: [
      { url: '/images/products/heli-lavender-mist/packshot.png', alt: 'HéLi Lavender & Chamomile Refreshing Fragrance Mist' },
      { url: '/images/products/heli-lavender-mist/bottle.jpg', alt: 'HéLi Lavender & Chamomile mist bottle' },
      { url: '/images/products/heli-lavender-mist/held.jpg', alt: 'HéLi Lavender & Chamomile mist, held' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Lavender', 'Chamomile', 'Aloe', 'Witch hazel'],
    ingredients:
      'Lavender and chamomile with aloe and witch hazel. Light body mist. External use only. Avoid the eye area.',
    directions:
      'Spray over clean skin as needed. Reapply through the day. Store at room temperature, or refrigerate for a cooler mist.',
    compatibility:
      'A body mist, not a personal lubricant. External use only. Discontinue if irritation occurs.',
    care: 'Keep the cap on the sprayer. Store upright, away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Scent', value: 'Lavender and chamomile' },
      { label: 'Notes', value: 'Aloe, witch hazel' },
      { label: 'Size', value: '4 fl oz / 120 ml' },
      { label: 'Use', value: 'External body mist' },
    ],
    filters: {
      type: 'wellness',
      material: 'mist',
      waterproof: false,
      forCouples: false,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Leaf', label: 'Lavender' },
      { icon: 'Wind', label: 'Light Mist' },
      { icon: 'Droplets', label: 'Aloe' },
    ],
    materials:
      'Lavender and chamomile with aloe and witch hazel. Light body mist. External use only.',
    specifications: '4 fl oz / 120 ml spray.',
    gallery: [
      { url: '/images/products/heli-lavender-mist/bottle.jpg', alt: 'HéLi Lavender & Chamomile mist bottle' },
      { url: '/images/products/heli-lavender-mist/held.jpg', alt: 'HéLi Lavender & Chamomile mist, held' },
    ],
    relatedSlugs: ['secret-garden-fragrance-mist', 'arlo-atlas-body-oil', 'dirty-french-shower-gel'],
  },
  {
    id: 'arlo-atlas-oil',
    slug: 'arlo-atlas-body-oil',
    aliases: ['arlo-atlas-oil', 'atlas-body-oil'],
    name: 'Arlo & Co. Atlas Body Oil',
    price: 28,
    tagline: 'Tobacco & citron · 7 oz',
    description:
      'Arlo & Co. hydrating body oil. Tobacco & Citron. Jojoba, coconut, argan, and avocado oils. Non-greasy. Spray after a shower and work in.',
    shortEditorial:
      'Tobacco and citron. A light oil that settles. Nothing greasy on the skin.',
    image: '/images/products/arlo-atlas-oil/packshot.png',
    images: [
      { url: '/images/products/arlo-atlas-oil/packshot.png', alt: 'Arlo & Co. Atlas Tobacco & Citron hydrating body oil' },
      { url: '/images/products/arlo-atlas-oil/feature-card.jpg', alt: 'Arlo & Co. Atlas hydrating body oil feature card' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Tobacco & citron', 'Non-greasy', 'Jojoba', 'Argan'],
    ingredients:
      'Jojoba, coconut, argan, and avocado oils in a hydrating spray oil. Tobacco & Citron. External use only. Oil can degrade latex.',
    directions:
      'Spray over clean, dry or slightly damp skin after a shower. Work in. Reapply as needed. External use only.',
    compatibility:
      'A body oil, not a personal lubricant. Oils can degrade latex condoms. Keep away from silicone toy surfaces you intend to keep unmarked.',
    care: 'Keep the sprayer capped. Store upright, away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Scent', value: 'Tobacco & Citron' },
      { label: 'Oils', value: 'Jojoba, coconut, argan, avocado' },
      { label: 'Finish', value: 'Non-greasy' },
      { label: 'Size', value: '7 fl oz / 210 ml' },
    ],
    filters: {
      type: 'wellness',
      material: 'oil',
      waterproof: false,
      forCouples: false,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Droplets', label: 'Non-Greasy' },
      { icon: 'Leaf', label: 'Plant Oils' },
      { icon: 'Wind', label: 'Tobacco & Citron' },
    ],
    materials:
      'Jojoba, coconut, argan, and avocado oils. Tobacco & Citron. External use only.',
    specifications: '7 fl oz / 210 ml spray. Non-greasy hydrating body oil.',
    gallery: [
      { url: '/images/products/arlo-atlas-oil/feature-card.jpg', alt: 'Arlo & Co. Atlas hydrating body oil feature card' },
    ],
    relatedSlugs: ['heli-lavender-chamomile-mist', 'dirty-french-shower-gel', 'midnight-bloom-massage-oil'],
  },
  {
    id: 'pr-secret-garden-mist',
    slug: 'secret-garden-fragrance-mist',
    aliases: ['pr-secret-garden-mist', 'secret-garden-mist'],
    name: 'Secret Garden Fragrance Mist',
    price: 24,
    tagline: 'Watercress & lily · 4 oz',
    description:
      'Secret Garden refreshing fragrance mist. Watercress & Lily. Aloe and chamomile. A light body spray — not a shower gel.',
    shortEditorial:
      'Watercress and lily. Aloe. Chamomile. A light spray, then done.',
    image: '/images/products/pr-secret-garden-mist/packshot.png',
    images: [
      { url: '/images/products/pr-secret-garden-mist/packshot.png', alt: 'Secret Garden Watercress & Lily fragrance mist' },
      { url: '/images/products/pr-secret-garden-mist/catalog.png', alt: 'Secret Garden Refreshing Fragrance Mist catalog packshot' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Watercress & lily', 'Aloe', 'Chamomile', 'Light mist'],
    ingredients:
      'Watercress & Lily fragrance mist with aloe and chamomile. External use only. Avoid the eye area.',
    directions:
      'Spray over clean skin as needed. Reapply through the day. Store at room temperature, or refrigerate for a cooler mist.',
    compatibility:
      'A body mist, not a personal lubricant and not a shower gel. External use only. Discontinue if irritation occurs.',
    care: 'Keep the cap on the sprayer. Store upright, away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Scent', value: 'Watercress & Lily' },
      { label: 'Notes', value: 'Aloe, chamomile' },
      { label: 'Size', value: '4 fl oz / 120 ml' },
      { label: 'Use', value: 'External body mist' },
    ],
    filters: {
      type: 'wellness',
      material: 'mist',
      waterproof: false,
      forCouples: false,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Wind', label: 'Light Mist' },
      { icon: 'Leaf', label: 'Watercress & Lily' },
      { icon: 'Droplets', label: 'Aloe' },
    ],
    materials:
      'Watercress & Lily mist with aloe and chamomile. External use only.',
    specifications: '4 fl oz / 120 ml spray.',
    gallery: [
      { url: '/images/products/pr-secret-garden-mist/catalog.png', alt: 'Secret Garden Refreshing Fragrance Mist catalog packshot' },
    ],
    relatedSlugs: ['heli-lavender-chamomile-mist', 'dirty-french-shower-gel', 'arlo-atlas-body-oil'],
  },
  {
    id: 'pr-dirty-french-gel',
    slug: 'dirty-french-shower-gel',
    aliases: ['pr-dirty-french-gel', 'dirty-french-gel'],
    name: 'Dirty French Shower Gel',
    price: 28,
    tagline: 'Shower gel · bubble bath · 8 oz',
    description:
      'Dirty French shower gel and bubble bath. Argan oil. pH-balanced. Use in the shower or as a small amount in the bath.',
    shortEditorial:
      'Shower gel that also holds as a bath. Argan oil. Nothing loud in the bottle.',
    image: '/images/products/pr-dirty-french-gel/packshot.png',
    images: [
      { url: '/images/products/pr-dirty-french-gel/packshot.png', alt: 'Dirty French Shower Gel & Bubble Bath bottle' },
      { url: '/images/products/pr-dirty-french-gel/lifestyle.png', alt: 'Dirty French shower gel in use' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Shower gel', 'Bubble bath', 'Argan oil', 'pH-balanced'],
    ingredients:
      'pH-balanced shower gel and bubble bath with argan oil. External use only. Avoid the eye area.',
    directions:
      'Work a small amount into wet skin in the shower, or add a little to a bath. Rinse. Discontinue if irritation occurs.',
    compatibility:
      'A wash, not a personal lubricant. External use only. Rinse thoroughly before any silicone or latex contact you care about.',
    care: 'Keep the cap closed. Store at room temperature away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Type', value: 'Shower gel and bubble bath' },
      { label: 'Notes', value: 'Argan oil, pH-balanced' },
      { label: 'Size', value: '8 fl oz / 240 ml' },
    ],
    filters: {
      type: 'wellness',
      material: 'wash',
      waterproof: true,
      forCouples: false,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Droplets', label: 'Shower + Bath' },
      { icon: 'Leaf', label: 'Argan Oil' },
      { icon: 'ShieldCheck', label: 'pH-Balanced' },
    ],
    materials:
      'pH-balanced shower gel and bubble bath with argan oil. External use only.',
    specifications: '8 fl oz / 240 ml.',
    gallery: [
      { url: '/images/products/pr-dirty-french-gel/lifestyle.png', alt: 'Dirty French shower gel in use' },
    ],
    relatedSlugs: ['arlo-atlas-body-oil', 'heli-lavender-chamomile-mist', 'secret-garden-fragrance-mist'],
  },
  {
    id: 'cg-pole-polish',
    slug: 'cg-pole-polish',
    aliases: ['pole-polish', 'cg-pole-polish-strawberry'],
    name: 'CG Pole Polish',
    price: 18,
    tagline: 'Kissable · Sin City Strawberry · 4 oz',
    description:
      'CG / Classic Erotica kissable massage cream, Sin City Strawberry. For hand play. Paraben-free, made in the USA.',
    shortEditorial:
      'A kissable cream for the hand. Strawberry. Rinse when you are finished.',
    image: '/images/products/cg-pole-polish/packshot.jpg',
    images: [
      { url: '/images/products/cg-pole-polish/packshot.jpg', alt: 'CG Pole Polish Sin City Strawberry kissable massage cream' },
    ],
    fulfillmentType: FULFILLMENT_TYPES.WHITE_LABEL,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: INVENTORY_STATUS.IN_STOCK,
    category: 'wellness',
    collection: 'essentials',
    newArrival: true,
    badge: 'NEW',
    attributes: ['Kissable', 'Sin City Strawberry', 'Paraben-free', 'Made in USA'],
    ingredients:
      'Kissable massage cream. Paraben-free, mineral-oil-free. Made in the USA. External use only. Barcode 638258901284.',
    directions:
      'Apply a generous amount by hand. Reapply as needed. Wash off with mild soap and water after use. Discontinue if irritation occurs.',
    compatibility:
      'For hand play. External use only. Avoid the eye area. Not a substitute for a dedicated personal lubricant with condoms.',
    care: 'Recap the tube. Store at room temperature away from direct sun.',
    discretionNotes:
      'Orders leave in plain, unmarked packaging with no outer branding. Packing slips omit explicit product names. The billing descriptor appears as ROOM23 WELLNESS.',
    materialsSpec: [
      { label: 'Type', value: 'Kissable massage cream' },
      { label: 'Scent', value: 'Sin City Strawberry' },
      { label: 'Free from', value: 'Parabens, mineral oil' },
      { label: 'Size', value: '4 fl oz / 120 ml' },
      { label: 'Origin', value: 'Made in the USA' },
      { label: 'SKU', value: 'ELCGC2102-04' },
      { label: 'Barcode', value: '638258901284' },
    ],
    filters: {
      type: 'wellness',
      material: 'cream',
      waterproof: false,
      forCouples: true,
      forSolo: true,
      powerSource: null,
    },
    variants: [],
    features: [
      { icon: 'Feather', label: 'Kissable' },
      { icon: 'Droplets', label: 'Hand Play' },
      { icon: 'ShieldCheck', label: 'Made in USA' },
    ],
    materials:
      'Kissable massage cream. Paraben-free. Made in the USA. External use only.',
    specifications: '4 fl oz / 120 ml. Sin City Strawberry. SKU ELCGC2102-04. Barcode 638258901284.',
    gallery: [],
    relatedSlugs: ['cg-oh-my-warming-stimulant', 'skins-delay-spray', 'platinum-silicone-lubricant-4oz'],
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

export function isNewArrival(product) {
  return Boolean(product?.newArrival || product?.badge === 'NEW')
}

export function getProductsByCollection(slug) {
  if (slug === 'new-arrivals') return PRODUCTS.filter(isNewArrival)
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

  if (collection === 'new-arrivals') {
    results = results.filter(isNewArrival)
  } else if (collection) {
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
