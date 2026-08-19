import { getRoom23Db } from '@/lib/admin-db'
import { type AdminOrder } from '@/lib/admin-orders'
import { PACK_WAVE_LIMIT, type PackWaveOrder } from '@/lib/admin-pack-wave'

export async function getAdminOrdersByIds(orderIds: string[]): Promise<PackWaveOrder[]> {
  const ids = [...new Set(orderIds.map((id) => String(id || '').trim()).filter(Boolean))].slice(
    0,
    PACK_WAVE_LIMIT,
  )
  if (!ids.length) return []

  const db = await getRoom23Db()
  if (!db) return []

  const found = await db
    .collection<AdminOrder>('orders')
    .find({ orderId: { $in: ids } })
    .toArray()

  const byId = new Map(found.map((order) => [order.orderId, order]))
  return ids.flatMap((id) => {
    const order = byId.get(id)
    return order ? [order] : []
  })
}
