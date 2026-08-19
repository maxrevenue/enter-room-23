export const HOUSE_LUBE_IDS = [
  'lube-silicone-2oz',
  'lube-silicone-4oz',
  'lube-silicone-8oz',
] as const

export type HouseLubeId = (typeof HOUSE_LUBE_IDS)[number]

/** Default homepage feature when POTM is unset or points at a non-house-lube SKU. */
export const DEFAULT_HOUSE_LUBE_ID: HouseLubeId = 'lube-silicone-4oz'

export const DEFAULT_CATEGORY_ID = 'lubes'

export type StoreCategory = {
  id: string
  label: string
  subtitle: string
  description: string
  sort: number
}

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    id: 'lubes',
    label: 'Lubes',
    subtitle: 'House silicone lubricants and considered topical formulas.',
    description:
      'Medical-grade platinum silicone lubricants and body-safe topical essentials from the Room 23 edit.',
    sort: 0,
  },
  {
    id: 'toys',
    label: 'Toys',
    subtitle: 'Body-safe pieces for solo and shared play.',
    description: 'Handheld, body-safe designs — no ornament, nothing louder than the material.',
    sort: 10,
  },
  {
    id: 'strokers',
    label: 'Strokers',
    subtitle: 'Sleeves and handheld stimulators held to a quiet standard.',
    description: 'Body-safe strokers and sleeves — considered materials, restrained presentation.',
    sort: 20,
  },
  {
    id: 'vibrators',
    label: 'Vibrators',
    subtitle: 'Motorized pieces when the edit expands.',
    description: 'Vibrators from the Room 23 collection as they arrive.',
    sort: 30,
  },
  {
    id: 'dildos',
    label: 'Dildos',
    subtitle: 'Insertables held to the same body-safe standard.',
    description: 'Dildos and insertables from the Room 23 edit.',
    sort: 40,
  },
  {
    id: 'butt-plugs',
    label: 'Butt plugs',
    subtitle: 'Anal play pieces, body-safe and considered.',
    description: 'Butt plugs from the Room 23 collection.',
    sort: 50,
  },
  {
    id: 'anal-accessories',
    label: 'Anal accessories',
    subtitle: 'Supporting pieces for anal play and care.',
    description: 'Anal accessories and adjunct formulas from the Room 23 edit.',
    sort: 60,
  },
  {
    id: 'essentials',
    label: 'Essentials',
    subtitle: 'Everyday staples that support the collection.',
    description: 'Supporting essentials that complement the Room 23 edit.',
    sort: 70,
  },
]

export const NEW_ARRIVALS_COLLECTION = {
  id: 'new-arrivals',
  label: 'New Arrivals',
  subtitle: 'The latest additions to the Room 23 edit.',
  description: 'Recently introduced pieces, held to the same standard as the rest of the collection.',
  sort: 5,
} as const

const LEGACY_COLLECTION_MAP: Record<string, string> = {
  essentials: 'lubes',
  wellness: 'lubes',
  body: 'lubes',
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  essentials: 'lubes',
  wellness: 'lubes',
  toys: 'toys',
}

const CATEGORY_BY_ID = new Map(STORE_CATEGORIES.map((entry) => [entry.id, entry]))

export function allCategoryIds() {
  return STORE_CATEGORIES.map((entry) => entry.id)
}

export function isHouseLubeProduct(id?: string | null) {
  return HOUSE_LUBE_IDS.includes(String(id || '') as HouseLubeId)
}

export function normalizeCategory(category?: string | null) {
  const raw = String(category || '').trim()
  if (!raw) return DEFAULT_CATEGORY_ID
  if (LEGACY_CATEGORY_MAP[raw]) return LEGACY_CATEGORY_MAP[raw]
  if (CATEGORY_BY_ID.has(raw)) return raw
  return DEFAULT_CATEGORY_ID
}

export function categoryLabel(category?: string | null) {
  const id = normalizeCategory(category)
  return CATEGORY_BY_ID.get(id)?.label || 'The collection'
}

export function categorySortKey(category?: string | null) {
  const id = normalizeCategory(category)
  return CATEGORY_BY_ID.get(id)?.sort ?? 999
}

export function getCollectionMeta(slug: string) {
  if (slug === NEW_ARRIVALS_COLLECTION.id) return NEW_ARRIVALS_COLLECTION
  return CATEGORY_BY_ID.get(slug) || null
}

export const COLLECTION_META: Record<
  string,
  { title: string; subtitle: string; description: string }
> = Object.fromEntries(
  STORE_CATEGORIES.map((entry) => [
    entry.id,
    { title: entry.label, subtitle: entry.subtitle, description: entry.description },
  ]),
)

COLLECTION_META[NEW_ARRIVALS_COLLECTION.id] = {
  title: NEW_ARRIVALS_COLLECTION.label,
  subtitle: NEW_ARRIVALS_COLLECTION.subtitle,
  description: NEW_ARRIVALS_COLLECTION.description,
}

export const STORE_NAV_LINKS = [
  { href: '/shop', label: 'Shop', slug: 'all' },
  ...STORE_CATEGORIES.map((entry) => ({
    href: `/collections/${entry.id}`,
    label: entry.label,
    slug: entry.id,
  })),
  {
    href: `/collections/${NEW_ARRIVALS_COLLECTION.id}`,
    label: NEW_ARRIVALS_COLLECTION.label,
    slug: NEW_ARRIVALS_COLLECTION.id,
  },
]

export const SHOP_CATEGORY_BAR_LINKS = STORE_NAV_LINKS

export function sortCuratedStorefrontProducts<T extends { id: string; category?: string; name?: string }>(
  products: T[],
  excludeIds: string[] = [],
) {
  const excluded = new Set(excludeIds)
  return [...products]
    .filter((product) => !excluded.has(product.id))
    .sort((a, b) => {
      const sortDelta = categorySortKey(a.category) - categorySortKey(b.category)
      if (sortDelta !== 0) return sortDelta
      return String(a.name || a.id).localeCompare(String(b.name || b.id))
    })
}

export function groupProductsByCategory<T extends { category?: string }>(products: T[]) {
  const grouped = new Map<string, T[]>()
  for (const entry of STORE_CATEGORIES) grouped.set(entry.id, [])
  for (const product of products) {
    const key = normalizeCategory(product.category)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(product)
  }
  for (const [key, list] of grouped) {
    grouped.set(
      key,
      [...list].sort((a, b) =>
        String((a as { name?: string }).name || '').localeCompare(
          String((b as { name?: string }).name || ''),
        ),
      ),
    )
  }
  return grouped
}

export function resolveCollectionSlug(slug?: string | null) {
  const raw = String(slug || '').trim()
  if (!raw) return ''
  return LEGACY_COLLECTION_MAP[raw] || raw
}

export function productMatchesCollection(
  product: { category?: string; collection?: string },
  slug: string,
) {
  const resolved = resolveCollectionSlug(slug)
  if (resolved === NEW_ARRIVALS_COLLECTION.id) return false
  const category = normalizeCategory(product.category)
  const collection = normalizeCategory(product.collection || product.category)
  return category === resolved || collection === resolved
}
