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
    subtitle: 'House platinum silicone — 2oz, 4oz, and 8oz.',
    description:
      'Medical-grade platinum-cure silicone lubricant in three sizes. That is the entire lube edit.',
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
    subtitle: 'Topicals, mists, washes, and supporting formulas.',
    description:
      'Delay spray, warming serum, body oil, fragrance mist, shower gel, and other supporting pieces — not personal lubricants.',
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

/** Old slugs that once dumped into Lubes now resolve to Essentials. */
const LEGACY_COLLECTION_MAP: Record<string, string> = {
  wellness: 'essentials',
  body: 'essentials',
}

const LEGACY_CATEGORY_MAP: Record<string, string> = {
  wellness: 'essentials',
  body: 'essentials',
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

export type StoreNavItem = {
  href: string
  label: string
  slug: string
}

export type StoreNavGroup = {
  id: string
  label: string
  href?: string
  slug?: string
  children?: StoreNavItem[]
}

/** Top-level storefront nav — mains with optional subcategories. */
export const STORE_NAV_GROUPS: StoreNavGroup[] = [
  {
    id: 'lubes',
    label: 'Lubes',
    href: '/collections/lubes',
    slug: 'lubes',
    children: [{ href: '/collections/lubes', label: 'House silicone', slug: 'lubes' }],
  },
  {
    id: 'toys',
    label: 'Toys',
    slug: 'toys',
    children: [
      { href: '/collections/strokers', label: 'Strokers', slug: 'strokers' },
      { href: '/collections/vibrators', label: 'Vibrators', slug: 'vibrators' },
      { href: '/collections/dildos', label: 'Dildos', slug: 'dildos' },
      { href: '/collections/toys', label: 'All toys', slug: 'toys' },
    ],
  },
  {
    id: 'essentials',
    label: 'Essentials',
    href: '/collections/essentials',
    slug: 'essentials',
  },
  {
    id: 'shop',
    label: 'Shop all',
    href: '/shop',
    slug: 'all',
  },
]

/** Static fallback for nav IA when live product counts are unavailable. */
export const STOREFRONT_ACTIVE_CATEGORY_SLUGS = ['lubes', 'strokers', 'essentials'] as const

export function resolveStoreNavGroups(
  activeSlugs: readonly string[] = STOREFRONT_ACTIVE_CATEGORY_SLUGS,
): StoreNavGroup[] {
  const active = new Set(activeSlugs)

  return STORE_NAV_GROUPS.flatMap((group) => {
    if (group.href && !group.children?.length) {
      return [group]
    }

    const children = (group.children || []).filter((child) => active.has(child.slug))
    if (children.length === 0) return []

    if (group.id === 'toys' || children.length > 1) {
      return [{ ...group, children }]
    }

    const only = children[0]
    return [{ ...group, href: only.href, slug: only.slug, children: undefined }]
  })
}

export function flattenStoreNavGroups(groups: StoreNavGroup[]): StoreNavItem[] {
  return groups.map((group) => ({
    href: group.href || group.children?.[0]?.href || '/shop',
    label: group.label,
    slug: group.slug || group.id,
  }))
}

export const STORE_NAV_LINKS = flattenStoreNavGroups(resolveStoreNavGroups())

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
