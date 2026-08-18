import { FULFILLMENT_TYPES, VENDOR_TYPES } from '@/lib/fulfillment'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { PRODUCTS, PRODUCT_OF_THE_MONTH_ID, getAllCategories, isNewArrival, slugify } from '@/lib/products'
import { getRoom23Db, PRODUCT_OVERLAY_FIELDS, type ProductDoc } from '@/lib/admin-db'

export const LOW_STOCK_THRESHOLD = 5

export type CatalogProduct = (typeof PRODUCTS)[number] & {
  quantity?: number | null
  hidden?: boolean
  active?: boolean
  archived?: boolean
  isProductOfTheMonth?: boolean
  isFeatured?: boolean
  source?: string
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

function applyInventory(product: CatalogProduct): CatalogProduct {
  const quantity = quantityOf(product)
  const archived = isArchived(product)
  return {
    ...product,
    quantity,
    hidden: archived,
    active: !archived,
    archived,
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
  const slug = typeof doc.slug === 'string' && doc.slug ? doc.slug : makeProductSlug(name, id)

  return applyInventory({
    id,
    slug,
    name,
    price: Number.isFinite(price) ? price : 0,
    quantity,
    category,
    collection: doc.collection || category,
    shortEditorial,
    description: shortEditorial,
    tagline: shortEditorial,
    image: typeof doc.image === 'string' ? doc.image : '',
    images: [],
    gallery: [],
    variants: [],
    relatedSlugs: [],
    attributes: [],
    filters: {},
    fulfillmentType: FULFILLMENT_TYPES.ROOM23_STOCK,
    vendorType: VENDOR_TYPES.ROOM23_STOCK,
    inventoryStatus: inventoryStatusFromQuantity(quantity),
    hidden: Boolean(doc.hidden),
    active: doc.active !== false && !doc.hidden && !doc.archived,
    archived: Boolean(doc.archived || doc.hidden || doc.active === false),
    isProductOfTheMonth: Boolean(doc.isProductOfTheMonth),
    isFeatured: Boolean(doc.isFeatured),
    source: 'custom',
    badge: undefined,
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
  return products.filter((product) => !isArchived(product))
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
    (product) => !isArchived(product) && (product.isProductOfTheMonth || product.isFeatured),
  )
  if (flagged) return flagged

  const db = await getRoom23Db()
  if (db) {
    const overlayCount = await db.collection('products').countDocuments({
      $or: [{ isProductOfTheMonth: { $exists: true } }, { isFeatured: { $exists: true } }],
    })
    if (overlayCount > 0) return null
  }

  return products.find((product) => !isArchived(product) && product.id === PRODUCT_OF_THE_MONTH_ID) || null
}

export async function countLowStockProducts(): Promise<number> {
  const products = await listStorefrontProducts()
  return products.filter((product) => isLowStock(product) || quantityOf(product) === 0).length
}
