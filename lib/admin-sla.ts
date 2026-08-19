import { orderTimestamp } from '@/lib/admin-customers'
import { isOpenOrder, type AdminOrder } from '@/lib/admin-orders'

export const WARN_HOURS = 24
export const CRITICAL_HOURS = 48

export type SlaLevel = 'ok' | 'warn' | 'critical'

export function orderAgeHours(createdAt?: Date | string | null, now = new Date()): number | null {
  const ts = orderTimestamp(createdAt)
  if (ts <= 0) return null
  const ms = now.getTime() - ts
  if (ms < 0) return 0
  return ms / (60 * 60 * 1000)
}

export function slaLevel(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'createdAt'>,
  now = new Date(),
): SlaLevel | null {
  if (!isOpenOrder(order)) return null
  const hours = orderAgeHours(order.createdAt, now)
  if (hours == null) return 'ok'
  if (hours >= CRITICAL_HOURS) return 'critical'
  if (hours >= WARN_HOURS) return 'warn'
  return 'ok'
}

export function staleOpenCutoff(now = new Date()) {
  return new Date(now.getTime() - CRITICAL_HOURS * 60 * 60 * 1000)
}

export function isStaleOpenOrder(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'createdAt'>,
  now = new Date(),
) {
  return slaLevel(order, now) === 'critical'
}

export function formatOrderAgeShort(createdAt?: Date | string | null, now = new Date()) {
  const hours = orderAgeHours(createdAt, now)
  if (hours == null) return '—'
  if (hours < 1) return '<1h'
  if (hours < 24) return `${Math.floor(hours)}h`
  const days = Math.floor(hours / 24)
  const remainder = Math.floor(hours % 24)
  if (remainder === 0) return `${days}d`
  return `${days}d ${remainder}h`
}

export function formatOpenForLabel(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'createdAt'>,
  now = new Date(),
) {
  if (!isOpenOrder(order)) return null
  const age = formatOrderAgeShort(order.createdAt, now)
  if (age === '—') return 'Open'
  return `Open for ${age}`
}

export function slaTextClass(level: SlaLevel | null) {
  if (level === 'critical') return 'text-zinc-100'
  if (level === 'warn') return 'text-zinc-300'
  if (level === 'ok') return 'text-zinc-500'
  return 'text-zinc-600'
}

export function orderAgeDisplay(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'createdAt'>,
  now = new Date(),
) {
  return {
    label: formatOrderAgeShort(order.createdAt, now),
    className: slaTextClass(slaLevel(order, now)),
  }
}

export function slaSortWeight(
  order: Pick<AdminOrder, 'status' | 'fulfilled' | 'fulfillment' | 'createdAt'>,
  now = new Date(),
) {
  const level = slaLevel(order, now)
  if (level === 'critical') return 3
  if (level === 'warn') return 2
  return 0
}
