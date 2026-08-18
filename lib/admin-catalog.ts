import { PRODUCTS, PRODUCT_OF_THE_MONTH_ID, getAllCategories } from '@/lib/products'
import { getRoom23Db, PRODUCT_OVERLAY_FIELDS } from '@/lib/admin-db'

export type CatalogProduct = (typeof PRODUCTS)[number] & {
  hidden?: boolean
  isProductOfTheMonth?: boolean
  isFeatured?: boolean
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

export async function listAdminProducts(): Promise<CatalogProduct[]> {
  const overlays = new Map<string, Record<string, unknown>>()
  const db = await getRoom23Db()
  if (db) {
    const docs = await db.collection('products').find({}).toArray()
    for (const doc of docs) {
      const id = typeof doc.id === 'string' ? doc.id : ''
      if (id) overlays.set(id, doc as Record<string, unknown>)
    }
  }

  return PRODUCTS.map((product) => ({
    ...product,
    hidden: false,
    isProductOfTheMonth: false,
    isFeatured: false,
    ...pickOverlay(overlays.get(product.id)),
  })) as CatalogProduct[]
}

export async function getAdminProduct(id: string): Promise<CatalogProduct | null> {
  const products = await listAdminProducts()
  return products.find((product) => product.id === id) || null
}

export async function getResolvedProductOfTheMonth(): Promise<CatalogProduct | null> {
  const products = await listAdminProducts()
  const flagged = products.find((product) => product.isProductOfTheMonth || product.isFeatured)
  if (flagged) return flagged

  const db = await getRoom23Db()
  if (db) {
    const overlayCount = await db.collection('products').countDocuments({
      $or: [{ isProductOfTheMonth: { $exists: true } }, { isFeatured: { $exists: true } }],
    })
    if (overlayCount > 0) return null
  }

  return products.find((product) => product.id === PRODUCT_OF_THE_MONTH_ID) || null
}
