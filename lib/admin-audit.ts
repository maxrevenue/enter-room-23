import { getRoom23Db } from '@/lib/admin-db'

export const AUDIT_COLLECTION = 'audit_logs'
export const AUDIT_ACTOR = 'admin'
export const AUDIT_LIST_LIMIT = 100

export const AUDIT_ENTITY_TYPES = ['product', 'order', 'coupon', 'settings', 'content', 'rma'] as const
export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number]

export type AuditLog = {
  id: string
  at: Date
  action: string
  entityType: AuditEntityType
  entityId: string
  message: string
  actor: typeof AUDIT_ACTOR
  meta?: Record<string, unknown>
}

export type WriteAuditInput = {
  action: string
  entityType: AuditEntityType
  entityId: string
  message: string
  meta?: Record<string, unknown>
}

export function isAuditEntityType(value: string): value is AuditEntityType {
  return (AUDIT_ENTITY_TYPES as readonly string[]).includes(value)
}

export function newAuditId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function buildAuditLog(input: WriteAuditInput, at = new Date()): AuditLog {
  const entry: AuditLog = {
    id: newAuditId(),
    at,
    action: String(input.action || '').trim() || 'unknown',
    entityType: isAuditEntityType(input.entityType) ? input.entityType : 'content',
    entityId: String(input.entityId || '').trim() || 'unknown',
    message: String(input.message || '').trim().slice(0, 500),
    actor: AUDIT_ACTOR,
  }
  if (input.meta && typeof input.meta === 'object' && Object.keys(input.meta).length > 0) {
    entry.meta = input.meta
  }
  return entry
}

export function formatAuditDate(value?: Date | string | null) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/**
 * Best-effort audit insert. Never throws; never fails the calling action.
 */
export async function writeAdminAudit(input: WriteAuditInput): Promise<void> {
  try {
    const db = await getRoom23Db()
    if (!db) return
    const entry = buildAuditLog(input)
    await db.collection<AuditLog>(AUDIT_COLLECTION).insertOne(entry)
  } catch {
    /* swallow — operational log must not block commerce mutations */
  }
}

export async function listAdminAuditLogs(limit = AUDIT_LIST_LIMIT): Promise<AuditLog[]> {
  const db = await getRoom23Db()
  if (!db) return []
  const cap = Math.min(Math.max(1, Math.floor(limit) || AUDIT_LIST_LIMIT), AUDIT_LIST_LIMIT)
  return db
    .collection<AuditLog>(AUDIT_COLLECTION)
    .find({})
    .sort({ at: -1 })
    .limit(cap)
    .toArray()
}
