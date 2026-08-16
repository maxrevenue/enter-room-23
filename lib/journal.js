export const JOURNAL_ARTICLES = [
  {
    id: 'wellness-maintenance',
    title: 'Building a Considered Collection',
    date: 'August 1, 2026',
    readTime: '6 min read',
    author: 'Room 23 Editorial',
    category: 'Wellness',
    excerpt:
      'Where to begin — and why fewer, better pieces make a more meaningful private ritual.',
    subtitle:
      'Beyond soap and water — a modern guide to pH-aware hygiene, barrier-friendly routines, and why intimate skin deserves considered formulations.',
    content: [
      'For decades, intimate care was treated as an afterthought in personal grooming. Standard body washes—often formulated with harsh surfactants like sodium lauryl sulfate and heavily alkaline pH levels—were routinely applied to delicate mucosal membranes. These are areas that actually require a tightly controlled, acidic microenvironment to thrive.',
      'Today, a modern understanding of barrier function and skin microbiome health has changed that conversation. Intimate skin naturally maintains a delicate pH range of 3.8 to 4.5. Exposing this area to conventional alkaline soaps, which often carry a pH of 9 to 10, strips away the natural acid mantle and can leave skin dry or irritated.',
      'A considered intimate wellness routine is built on three pillars: gentle pH alignment, moisture barrier support, and ingredient integrity. Look for formulations rich in organic aloe vera, plant-derived propanediol, and lactic acid. These elements respect the skin’s natural ecology while providing high-performance comfort.',
      'When selecting personal products, prioritize water-soluble or clearly labeled formulas that are free from parabens and synthetic fragrances, and demand ingredient transparency. Taking extra care behind closed doors is not a luxury — it is a fundamental act of self-regard.',
    ],
    recommendedProductIds: ['lube-silicone-4oz', 'ds-massage-oil'],
  },
  {
    id: 'lubricant-formulations',
    title: 'Understanding Personal Lubricant Formulations',
    date: 'July 22, 2026',
    readTime: '8 min read',
    author: 'Room 23 Editorial',
    category: 'Education',
    excerpt:
      'How intentional routines transform ordinary moments into acts of self-regard.',
    subtitle:
      'Water-based. Silicone. Hybrid. Aloe. Demystifying the chemistry, osmolality, and performance of personal lubricants.',
    content: [
      'Not all personal lubricants are created equal. While the market is saturated with options, very few shoppers understand the chemistry that distinguishes water-based, silicone, hybrid, and aloe-based formulations.',
      'Water-based formulas are the everyday standard for versatility and toy compatibility. Crafted from purified water and plant cellulose, high-grade water lubricants offer an effortless glide and rinse away with water. Osmolality — the concentration of dissolved particles — should stay calibrated near body fluids to avoid cellular dehydration.',
      'Silicone-based formulas, including platinum-cure dimethicone, provide an ultra-concentrated, waterproof glide. A small amount lasts. That makes silicone the practical choice for shower use and longer sessions. Because it neither evaporates nor absorbs into the skin, it needs a mild soap for cleanup. Silicone lubricants should never be paired with silicone wellness devices — they can degrade the surface.',
      'Hybrid and botanical formulas sit in between: a water base with a whisper of dimethicone, or a plant-oil massage blend meant for skin, not silicone toys. Read the compatibility note on every Room 23 product page before you pair a formula with a material.',
    ],
    recommendedProductIds: ['lube-silicone-2oz', 'lube-silicone-4oz', 'lube-silicone-8oz'],
  },
  {
    id: 'discreet-luxury',
    title: 'Why Discretion Is the Ultimate Luxury',
    date: 'July 10, 2026',
    readTime: '4 min read',
    author: 'Room 23 Editorial',
    category: 'Lifestyle',
    excerpt:
      'When objects are made with care, they invite a different kind of attention.',
    subtitle:
      'In an era of public unboxing, quiet privacy belongs behind closed doors.',
    content: [
      'In today’s digital landscape, true privacy has become rare. Between public unboxing videos, targeted advertising, and data harvesting, the most intimate corners of personal life are increasingly exposed.',
      'Room 23 was founded on a simple premise: you should never have to compromise privacy to buy well-made wellness goods. That is a customer-experience policy, not a marketing flourish.',
      'Orders leave in a plain, unbranded carton. The return address is generic. The packing slip does not print explicit SKU names. Your card statement shows ROOM23 WELLNESS. What arrives at the door should look like any other household parcel.',
    ],
    recommendedProductIds: ['ds-glass-wand', 'ds-silk-blindfold'],
  },
]

export function getJournalArticle(slug) {
  return JOURNAL_ARTICLES.find((article) => article.id === slug)
}
