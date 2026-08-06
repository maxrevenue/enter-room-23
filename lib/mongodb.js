import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''

if (!uri) {
  throw new Error('Please add your Mongo URI to environment variables (MONGODB_URI)')
}

const options = {
  maxPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
}

let client
let clientPromise

if (process.env.NODE_ENV === 'development') {
  // Hot-reload guard: cache the connected client on globalThis
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalThis._mongoClientPromise = client.connect()
  }
  clientPromise = globalThis._mongoClientPromise
} else {
  // Production (Cloudflare Workers): module-level singleton —
  // the Workers isolate reuses this across invocations
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Returns a connected MongoDB client.
 * Use:  const client = await connectToDatabase()
 *       const db = client.db('room23')
 */
export async function connectToDatabase() {
  const connected = await clientPromise
  return connected
}

export default clientPromise
