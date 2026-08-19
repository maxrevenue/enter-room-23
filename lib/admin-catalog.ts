import { FULFILLMENT_TYPES, VENDOR_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { PRODUCTS, PRODUCT_OF_THE_MONTH_ID, getAllCategories, isNewArrival, slugify } from '@/lib/products'
import { getRoom23Db, PRODUCT_OVERLAY_FIELDS, type ProductDoc, type ProductImage } from '@/lib/admin-db'

export const LOW_STOCK_THRESHOLD = 5
export const GALLERY_SLOT_COUNT = 4

export type CatalogProduct = (typeof PRODUCTS)[number] & {
  quantity?: number | null
  hidden?: boolean
  active?: boolean
  archived?: boolean
  hideWhenZero?: boolean
  isProductOfTheMonth?: boolean
  isFeatured?: boolean
  source?: string
  lowStockAlertSentAt?: Date | string | null
  lowStockAlertLevel?: 'low' | 'out' | null
}

function pickOverlay(doc: Record<string, unknown> | null | undefined) {
  if (!doc) return {}
  const overlay: Record<string, unknown> = {}
  for (const field of PRODUCT_OVERLAY_FIELDS) {
    if (doc[field] !== undefined) overlay[field] = doc[field]
  }
  return overlay
}

export function productCategories() {
  return getAllCategories().filter((category) => category !== 'all')
}

export function fulfillmentTypeOptions() {
  return Object.values(FULFILLMENT_TYPES) as string[]
}

export function vendorTypeOptions() {
  return Object.values(VENDOR_TYPES) as string[]
}

export function quantityOf(product: { quantity?: number | null }): number | null {
  if (typeof product.quantity !== 'number' || !Number.isFinite(product.quantity)) return null
  return Math.max(0, Math.floor(product.quantity))
}

export function isArchived(product: CatalogProduct) {
  return Boolean(product.hidden || product.archived || product.active === false)
}

export function isLowStock(product: CatalogProduct) {
  const quantity = quantityOf(product)
  return quantity != null && quantity > 0 && quantity <= LOW_STOCK_THRESHOLD
}

export function isHiddenByZeroStock(product: CatalogProduct) {
  return Boolean(product.hideWhenZero) && quantityOf(product) === 0
}

export function isStorefrontVisible(product: CatalogProduct) {
  return !isArchived(product) && !isHiddenByZeroStock(product)
}

export function inventoryStatusFromQuantity(
  quantity: number | null | undefined,
  fallback = INVENTORY_STATUS.IN_STOCK,
) {
  if (quantity === 0) return INVENTORY_STATUS.OUT_OF_STOCK
  if (quantity != null && quantity > 0) return INVENTORY_STATUS.IN_STOCK
  return fallback
}

export function makeProductSlug(name: string, slug?: string) {
  return slugify(String(slug || name || '').trim())
}

export function normalizeAttributes(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean)
  }
  return String(value || '')
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function normalizeImages(value: unknown): ProductImage[] {
  if (!Array.isArray(value)) return []
  const images: ProductImage[] = []
  for (const entry of value) {
    if (typeof entry === 'string') {
      const url = entry.trim()
      if (url) images.push({ url, alt: '' })
      continue
    }
    if (!entry || typeof entry !== 'object') continue
    const record = entry as { url?: unknown; alt?: unknown }
    const url = String(record.url || '').trim()
    if (!url) continue
    images.push({ url, alt: String(record.alt || '').trim() })
  }
  return images
}

export function productImageUrl(product: CatalogProduct) {
  const primary = typeof product.image === 'string' ? product.image.trim() : ''
  if (primary) return primary
  const fromImages = normalizeImages(product.images)
  if (fromImages[0]?.url) return fromImages[0].url
  const fromGallery = normalizeImages(product.gallery)
  return fromGallery[0]?.url || ''
}

export function gallerySlots(product?: CatalogProduct | null): ProductImage[] {
  const images = normalizeImages(product?.images?.length ? product.images : product?.gallery)
  return Array.from({ length: GALLERY_SLOT_COUNT }, (_, index) => images[index] || { url: '', alt: '' })
}

function applyInventory(product: CatalogProduct): CatalogProduct {
  const quantity = quantityOf(product)
  const archived = isArchived(product)
  const images = normalizeImages(product.images?.length ? product.images : product.gallery)
  const image = productImageUrl({ ...product, images })
  return {
    ...product,
    quantity,
    hidden: archived,
    active: !archived,
    archived,
    hideWhenZero: Boolean(product.hideWhenZero),
    attributes: normalizeAttributes(product.attributes),
    images,
    gallery: images,
    image,
    inventoryStatus: inventoryStatusFromQuantity(quantity, product.inventoryStatus),
  }
}

function buildCustomProduct(doc: ProductDoc): CatalogProduct | null {
  const id = typeof doc.id === 'string' ? doc.id.trim() : ''
  const name = typeof doc.name === 'string' ? doc.name.trim() : ''
  if (!id || !name) return null

  const price = Number(doc.price)
  const quantity = quantityOf({ quantity: typeof doc.quantity === 'number' ? doc.quantity : null })
  const category = typeof doc.category === 'string' && doc.category ? doc.category : 'essentials'
  const shortEditorial = typeof doc.shortEditorial === 'string' ? doc.shortEditorial : ''
  const tagline = typeof doc.tagline === 'string' ? doc.tagline : shortEditorial
  const description = typeof doc.description === 'string' ? doc.description : shortEditorial
  const slug = typeof doc.slug === 'string' && doc.slug ? doc.slug : makeProductSlug(name, id)
  const images = normalizeImages(doc.images?.length ? doc.images : doc.gallery)
  const fulfillmentType = fulfillmentTypeOptions().includes(String(doc.fulfillmentType))
    ? String(doc.fulfillmentType)
    : FULFILLMENT_TYPES.ROOM23_STOCK
  const vendorType = vendorTypeOptions().includes(String(doc.vendorType))
    ? String(doc.vendorType)
    : VENDOR_TYPES.ROOM23_STOCK

  return applyInventory({
    id,
    slug,
    name,
    price: Number.isFinite(price) ? price : 0,
    quantity,
    category,
    collection: doc.collection || category,
    badge: typeof doc.badge === 'string' ? doc.badge : undefined,
    shortEditorial,
    description,
    tagline,
    ingredients: typeof doc.ingredients === 'string' ? doc.ingredients : '',
    directions: typeof doc.directions === 'string' ? doc.directions : '',
    compatibility: typeof doc.compatibility === 'string' ? doc.compatibility : '',
    care: typeof doc.care === 'string' ? doc.care : '',
    discretionNotes: typeof doc.discretionNotes === 'string' ? doc.discretionNotes : '',
    attributes: normalizeAttributes(doc.attributes),
    image: typeof doc.image === 'string' ? doc.image : images[0]?.url || '',
    images,
    gallery: images,
    variants: [],
    relatedSlugs: [],
    filters: {},
    fulfillmentType,
    vendorType,
    inventoryStatus: inventoryStatusFromQuantity(quantity),
    hidden: Boolean(doc.hidden),
    active: doc.active !== false && !doc.hidden && !doc.archived,
    archived: Boolean(doc.archived || doc.hidden || doc.active === false),
    hideWhenZero: Boolean(doc.hideWhenZero),
    isProductOfTheMonth: Boolean(doc.isProductOfTheMonth),
    isFeatured: Boolean(doc.isFeatured),
    source: 'custom',
    lowStockAlertSentAt: doc.lowStockAlertSentAt,
    lowStockAlertLevel: doc.lowStockAlertLevel,
  } as CatalogProduct)
}

export async function listAdminProducts(): Promise<CatalogProduct[]> {
  const overlays = new Map<string, Record<string, unknown>>()
  const custom: CatalogProduct[] = []
  const seedIds = new Set(PRODUCTS.map((product) => product.id))
  const db = await getRoom23Db()

  if (db) {
    const docs = await db.collection<ProductDoc>('products').find({}).toArray()
    for (const doc of docs) {
      const id = typeof doc.id === 'string' ? doc.id : ''
      if (!id) continue
      if (seedIds.has(id)) overlays.set(id, doc as Record<string, unknown>)
      else {
        const created = buildCustomProduct(doc)
        if (created) custom.push(created)
      }
    }
  }

  const merged = PRODUCTS.map((product) =>
    applyInventory({
      ...product,
      hidden: false,
      active: true,
      archived: false,
      hideWhenZero: false,
      isProductOfTheMonth: false,
      isFeatured: false,
      quantity: null,
      ...pickOverlay(overlays.get(product.id)),
    } as CatalogProduct),
  )

  return [...merged, ...custom].sort((a, b) => {
    const archivedDelta = Number(isArchived(a)) - Number(isArchived(b))
    if (archivedDelta !== 0) return archivedDelta
    return String(a.name).localeCompare(String(b.name))
  })
}

export async function getAdminProduct(id: string): Promise<CatalogProduct | null> {
  if (!id) return null
  const products = await listAdminProducts()
  return products.find((product) => product.id === id) || null
}

export async function findAdminProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (!slug) return null
  const products = await listAdminProducts()
  return (
    products.find(
      (product) =>
        product.slug === slug ||
        product.id === slug ||
        (Array.isArray(product.aliases) && product.aliases.includes(slug)),
    ) || null
  )
}

export async function listStorefrontProducts(): Promise<CatalogProduct[]> {
  const products = await listAdminProducts()
  return products.filter(isStorefrontVisible)
}

export async function getStorefrontProductById(id: string): Promise<CatalogProduct | null> {
  if (!id) return null
  const products = await listStorefrontProducts()
  return products.find((product) => product.id === id) || null
}

export async function getStorefrontProductBySlug(slug: string): Promise<CatalogProduct | null> {
  if (!slug) return null
  const products = await listStorefrontProducts()
  return (
    products.find(
      (product) =>
        product.slug === slug ||
        product.id === slug ||
        (Array.isArray(product.aliases) && product.aliases.includes(slug)),
    ) || null
  )
}

export async function listStorefrontProductsByCollection(slug: string): Promise<CatalogProduct[]> {
  const products = await listStorefrontProducts()
  if (slug === 'new-arrivals') return products.filter(isNewArrival)
  if (slug === 'essentials') {
    return products.filter((product) => product.category === 'essentials' || product.collection === 'essentials')
  }
  const byCategory = products.filter((product) => product.category === slug)
  if (byCategory.length) return byCategory
  return products.filter((product) => product.collection === slug)
}

export async function getResolvedProductOfTheMonth(): Promise<CatalogProduct | null> {
  const products = await listAdminProducts()
  const flagged = products.find(
    (product) => isStorefrontVisible(product) && (product.isProductOfTheMonth || product.isFeatured),
  )
  if (flagged) return flagged

  const db = await getRoom23Db()
  if (db) {
    const overlayCount = await db.collection('products').countDocuments({
      $or: [{ isProductOfTheMonth: { $exists: true } }, { isFeatured: { $exists: true } }],
    })
    if (overlayCount > 0) return null
  }

  return products.find((product) => isStorefrontVisible(product) && product.id === PRODUCT_OF_THE_MONTH_ID) || null
}

export async function countLowStockProducts(): Promise<number> {
  const products = await listStorefrontProducts()
  return products.filter((product) => isLowStock(product) || quantityOf(product) === 0).length
}
