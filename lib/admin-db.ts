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
  'price',
  'inventoryStatus',
  'category',
  'hidden',
  'shortEditorial',
  'isProductOfTheMonth',
  'isFeatured',
] as const
