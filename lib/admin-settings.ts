import { SITE_CONFIG } from '@/lib/constants'
import { FLAT_SHIPPING_RATE, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'
import { getRoom23Db } from '@/lib/admin-db'

export const STORE_SETTINGS_ID = 'store'
export const SHIPPING_ZONE_SLOTS = 3

export type ShippingZone = {
  name: string
  countries: string[]
  rate: number
}

export type StoreSettings = {
  id: string
  storeOpen: boolean
  supportEmail: string
  supportPhone: string
  shippingFlatRate: number
  freeShippingThreshold: number | null
  shippingZones: ShippingZone[]
  updatedAt?: Date | string
}

export function defaultStoreSettings(): StoreSettings {
  return {
    id: STORE_SETTINGS_ID,
    storeOpen: true,
    supportEmail: SITE_CONFIG.email,
    supportPhone: SITE_CONFIG.phone,
    shippingFlatRate: FLAT_SHIPPING_RATE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    shippingZones: [],
  }
}

export function normalizeShippingZones(value: unknown): ShippingZone[] {
  if (!Array.isArray(value)) return []
  const zones: ShippingZone[] = []
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const record = entry as { name?: unknown; countries?: unknown; regions?: unknown; rate?: unknown }
    const name = String(record.name || '').trim()
    const countriesSource = Array.isArray(record.countries)
      ? record.countries
      : Array.isArray(record.regions)
        ? record.regions
        : String(record.countries || record.regions || '')
            .split(/[\n,]+/)
    const countries = countriesSource.map((country) => String(country || '').trim().toUpperCase()).filter(Boolean)
    const rate = Number(record.rate)
    if (!name || !Number.isFinite(rate) || rate < 0) continue
    zones.push({ name, countries, rate })
  }
  return zones
}

export function normalizeStoreSettings(doc?: Partial<StoreSettings> | null): StoreSettings {
  const defaults = defaultStoreSettings()
  const shippingFlatRate = Number(doc?.shippingFlatRate)
  const threshold = doc?.freeShippingThreshold
  const parsedThreshold = threshold === null || threshold === undefined || threshold === ('' as never)
    ? null
    : Number(threshold)

  return {
    id: STORE_SETTINGS_ID,
    storeOpen: doc?.storeOpen !== false,
    supportEmail: String(doc?.supportEmail || defaults.supportEmail).trim() || defaults.supportEmail,
    supportPhone: String(doc?.supportPhone || defaults.supportPhone).trim() || defaults.supportPhone,
    shippingFlatRate: Number.isFinite(shippingFlatRate) && shippingFlatRate >= 0 ? shippingFlatRate : defaults.shippingFlatRate,
    freeShippingThreshold:
      parsedThreshold == null || !Number.isFinite(parsedThreshold) || parsedThreshold < 0
        ? defaults.freeShippingThreshold
        : parsedThreshold,
    shippingZones: normalizeShippingZones(doc?.shippingZones),
    updatedAt: doc?.updatedAt,
  }
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const db = await getRoom23Db()
  if (!db) return defaultStoreSettings()
  const doc = await db.collection<StoreSettings>('settings').findOne({ id: STORE_SETTINGS_ID })
  return normalizeStoreSettings(doc)
}
