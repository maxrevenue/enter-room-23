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
  'hidden',
  'active',
  'archived',
  'shortEditorial',
  'isProductOfTheMonth',
  'isFeatured',
  'source',
] as const

export type ProductDoc = {
  id: string
  slug?: string
  name?: string
  price?: number
  quantity?: number
  inventoryStatus?: string
  category?: string
  collection?: string
  shortEditorial?: string
  description?: string
  tagline?: string
  hidden?: boolean
  active?: boolean
  archived?: boolean
  isProductOfTheMonth?: boolean
  isFeatured?: boolean
  source?: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}
