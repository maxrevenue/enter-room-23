import { MongoClient, type Db } from 'mongodb'

export const ORDER_EVENTS_COLLECTION = 'order_events'

export type OrderEventActor = 'admin' | 'system'

export type OrderEventDoc = {
  orderId: string
  at: Date
  type: string
  message: string
  meta?: Record<string, unknown>
  actor?: OrderEventActor
}

export function orderEventsCollection(db: Db) {
  return db.collection<OrderEventDoc>(ORDER_EVENTS_COLLECTION)
}

export async function getRoom23Db() {
  const uri = process.env.MONGODB_URI
  if (!uri) return null

  try {
    const { connectToDatabase } = await import('@/lib/mongodb')
    const client = (await connectToDatabase()) as MongoClient
    return client.db('room23')
  } catch {
    return null
  }
}

export const PRODUCT_OVERLAY_FIELDS = [
  'name',
  'slug',
  'price',
  'cogs',
  'quantity',
  'inventoryStatus',
  'category',
  'collection',
  'badge',
  'hidden',
  'active',
  'archived',
  'tagline',
  'shortEditorial',
  'description',
  'ingredients',
  'directions',
  'compatibility',
  'care',
  'discretionNotes',
  'attributes',
  'fulfillmentType',
  'vendorType',
  'image',
  'images',
  'gallery',
  'hideWhenZero',
  'isProductOfTheMonth',
  'isFeatured',
  'source',
  'lowStockAlertSentAt',
  'lowStockAlertLevel',
] as const

export type ProductImage = {
  url: string
  alt: string
}

export type ProductDoc = {
  id: string
  slug?: string
  name?: string
  price?: number
  cogs?: number
  quantity?: number
  inventoryStatus?: string
  category?: string
  collection?: string
  badge?: string
  shortEditorial?: string
  description?: string
  tagline?: string
  ingredients?: string
  directions?: string
  compatibility?: string
  care?: string
  discretionNotes?: string
  attributes?: string[]
  fulfillmentType?: string
  vendorType?: string
  hidden?: boolean
  active?: boolean
  archived?: boolean
  hideWhenZero?: boolean
  isProductOfTheMonth?: boolean
  isFeatured?: boolean
  source?: string
  image?: string
  images?: ProductImage[]
  gallery?: ProductImage[]
  lowStockAlertSentAt?: Date
  lowStockAlertLevel?: 'low' | 'out'
  createdAt?: Date
  updatedAt?: Date
}
