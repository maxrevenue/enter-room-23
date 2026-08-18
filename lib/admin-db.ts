import { MongoClient } from 'mongodb'

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
  createdAt?: Date
  updatedAt?: Date
}
