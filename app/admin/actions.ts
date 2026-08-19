'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminAuthenticated,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import {
  findAdminProductBySlug,
  fulfillmentTypeOptions,
  GALLERY_SLOT_COUNT,
  getAdminProduct,
  inventoryStatusFromQuantity,
  isArchived,
  makeProductSlug,
  normalizeAttributes,
  normalizeImages,
  productCategories,
  quantityOf,
  vendorTypeOptions,
} from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import {
  isCouponType,
  normalizeCouponCode,
  type CouponType,
} from '@/lib/admin-coupons'
import { normalizeShippingZones, SHIPPING_ZONE_SLOTS, STORE_SETTINGS_ID } from '@/lib/admin-settings'
import {
  buildOrderStatusUpdate,
  coerceOrderStatus,
  getAdminOrder,
  isOpenOrder,
  isOrderFulfilled,
  isOrderStatus,
  isRefundedOrCancelled,
  nextQuantityAfterDecrement,
  orderStatusLabel,
  shouldDecrementInventory,
  type AdminOrder,
} from '@/lib/admin-orders'
import { safeInsertOrderEvent } from '@/lib/admin-order-events'
import { writeAdminAudit } from '@/lib/admin-audit'
import { sendOrderConfirmation } from '@/lib/email/order-confirmation'
import { handleStockAlertAfterQuantityChange, type StockAlertLevel } from '@/lib/admin-stock-alerts'
import { searchAdminEntities, type AdminSearchResult } from '@/lib/admin-search'
import {
  allowedRmaStatusTransitions,
  applyRmaRestock,
  generateRmaId,
  getAdminRma,
  isRmaResolution,
  isRmaStatus,
  parseCreateRmaItems,
  rmaStatusLabel,
  type RmaResolution,
  type RmaStatus,
} from '@/lib/admin-returns'
import { OPS_HANDOFF_ID } from '@/lib/admin-handoff'

async function requireAdmin() {
  const ok = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!ok) redirect('/admin/login')
}

function revalidateAdmin() {
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/returns')
  revalidatePath('/admin/suppliers')
  revalidatePath('/admin/customers')
  revalidatePath('/admin/coupons')
  revalidatePath('/admin/analytics')
  revalidatePath('/admin/audit')
  revalidatePath('/admin/settings')
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/cart')
  revalidatePath('/checkout')
  revalidatePath('/products', 'layout')
  revalidatePath('/collections', 'layout')
}

const CATEGORY_VALUES = new Set(productCategories())
const FULFILLMENT_VALUES = new Set(fulfillmentTypeOptions())
const VENDOR_VALUES = new Set(vendorTypeOptions())
const RESERVED_SLUGS = new Set(['new', 'admin', 'shop', 'api', 'products', 'collections'])
const BULK_ACTION_LIMIT = 50

function parseBulkIds(raw: unknown): { ids: string[]; exceeded: boolean } {
  let parsed: unknown[] = []
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const data = JSON.parse(raw)
      if (Array.isArray(data)) parsed = data
    } catch {
      parsed = []
    }
  }
  const unique = [...new Set(parsed.map((id) => String(id || '').trim()).filter(Boolean))]
  return {
    ids: unique.slice(0, BULK_ACTION_LIMIT),
    exceeded: unique.length > BULK_ACTION_LIMIT,
  }
}

function bulkProductsRedirect(formData: FormData, params: Record<string, string>): never {
  const search = new URLSearchParams(params)
  const view = String(formData.get('view') || '').trim()
  if (view && view !== 'all') search.set('view', view)
  redirect(`/admin/products?${search.toString()}`)
}

function bulkOrdersRedirect(formData: FormData, params: Record<string, string>): never {
  const search = new URLSearchParams(params)
  const view = String(formData.get('view') || '').trim()
  const q = String(formData.get('q') || '').trim()
  if (view && view !== 'all') search.set('view', view)
  if (q) search.set('q', q)
  redirect(`/admin/orders?${search.toString()}`)
}

function canBulkFulfillOrder(order: AdminOrder) {
  if (isRefundedOrCancelled(order)) return false
  if (isOrderFulfilled(order)) return false
  if (!isOpenOrder(order)) return false
  return coerceOrderStatus(order.status) === 'paid'
}

function fromList(formData: FormData) {
  return String(formData.get('from') || '') === 'list'
}

function redirectProduct(formData: FormData, id: string, query = 'saved=1') {
  if (fromList(formData)) redirect(`/admin/products?${query}`)
  redirect(`/admin/products/${encodeURIComponent(id)}?${query}`)
}

function parsePrice(formData: FormData) {
  const price = Number(formData.get('price'))
  if (!Number.isFinite(price) || price < 0) return null
  return price
}

function parseCogs(formData: FormData): number | null | undefined {
  const raw = String(formData.get('cogs') ?? '').trim()
  if (raw === '') return null
  const cogs = Number(raw)
  if (!Number.isFinite(cogs) || cogs < 0) return undefined
  return cogs
}

function parseQuantity(formData: FormData, required: boolean) {
  const raw = String(formData.get('quantity') ?? '').trim()
  if (raw === '') return required ? null : undefined
  const quantity = Math.floor(Number(raw))
  if (!Number.isFinite(quantity) || quantity < 0) return null
  return quantity
}

function parseHidden(formData: FormData) {
  const hiddenField = String(formData.get('hidden') || '')
  const activeField = String(formData.get('active') || '')
  if (hiddenField === 'on') return true
  if (activeField === 'on') return false
  if (activeField === '0' || activeField === 'false') return true
  return hiddenField === 'on'
}

function visibilityFields(hidden: boolean) {
  return {
    hidden,
    active: !hidden,
    archived: hidden,
  }
}

function parseFlag(formData: FormData, name: string) {
  const raw = String(formData.get(name) || '').trim().toLowerCase()
  return raw === 'on' || raw === '1' || raw === 'true'
}

function parseText(formData: FormData, name: string) {
  return String(formData.get(name) || '').trim()
}

function parseGallery(formData: FormData) {
  const slots = []
  for (let index = 0; index < GALLERY_SLOT_COUNT; index += 1) {
    slots.push({
      url: parseText(formData, `imageUrl${index}`),
      alt: parseText(formData, `imageAlt${index}`),
    })
  }
  return normalizeImages(slots)
}

function parseProductFields(formData: FormData, requiredQuantity: boolean) {
  const name = parseText(formData, 'name')
  const slugInput = parseText(formData, 'slug')
  const slug = makeProductSlug(name, slugInput)
  const price = parsePrice(formData)
  const cogs = parseCogs(formData)
  const quantity = parseQuantity(formData, requiredQuantity)
  const category = parseText(formData, 'category')
  const collection = parseText(formData, 'collection') || category
  const badge = parseText(formData, 'badge')
  const tagline = parseText(formData, 'tagline')
  const shortEditorial = parseText(formData, 'shortEditorial')
  const description = parseText(formData, 'description')
  const ingredients = parseText(formData, 'ingredients')
  const directions = parseText(formData, 'directions')
  const compatibility = parseText(formData, 'compatibility')
  const care = parseText(formData, 'care')
  const discretionNotes = parseText(formData, 'discretionNotes')
  const attributes = normalizeAttributes(parseText(formData, 'attributes'))
  const fulfillmentType = parseText(formData, 'fulfillmentType')
  const vendorType = parseText(formData, 'vendorType')
  const image = parseText(formData, 'image')
  const images = parseGallery(formData)
  const hidden = parseHidden(formData)
  const hideWhenZero = parseFlag(formData, 'hideWhenZero')
  const isFeatured = parseFlag(formData, 'isFeatured')
  const isProductOfTheMonth = parseFlag(formData, 'isProductOfTheMonth')

  return {
    name,
    slug,
    price,
    cogs,
    quantity,
    category,
    collection,
    badge,
    tagline,
    shortEditorial,
    description,
    ingredients,
    directions,
    compatibility,
    care,
    discretionNotes,
    attributes,
    fulfillmentType,
    vendorType,
    image: image || images[0]?.url || '',
    images,
    hidden,
    hideWhenZero,
    isFeatured,
    isProductOfTheMonth,
  }
}

function editorialFields(fields: ReturnType<typeof parseProductFields>) {
  return {
    collection: fields.collection,
    badge: fields.badge,
    tagline: fields.tagline,
    shortEditorial: fields.shortEditorial,
    description: fields.description,
    ingredients: fields.ingredients,
    directions: fields.directions,
    compatibility: fields.compatibility,
    care: fields.care,
    discretionNotes: fields.discretionNotes,
    attributes: fields.attributes,
    fulfillmentType: fields.fulfillmentType,
    vendorType: fields.vendorType,
    image: fields.image,
    images: fields.images,
    gallery: fields.images,
    hideWhenZero: fields.hideWhenZero,
    isFeatured: fields.isProductOfTheMonth ? true : fields.isFeatured,
  }
}

function fieldsAreValid(fields: ReturnType<typeof parseProductFields>, requireQuantity: boolean) {
  if (!fields.name || !fields.slug || RESERVED_SLUGS.has(fields.slug) || fields.price == null) return false
  if (fields.cogs === undefined) return false
  if (requireQuantity && fields.quantity == null) return false
  if (fields.quantity === null) return false
  if (!CATEGORY_VALUES.has(fields.category)) return false
  if (!FULFILLMENT_VALUES.has(fields.fulfillmentType)) return false
  if (!VENDOR_VALUES.has(fields.vendorType)) return false
  return true
}

async function applyExclusiveProductOfTheMonth(id: string) {
  const db = await getRoom23Db()
  if (!db) return
  await db.collection('products').updateMany({}, { $set: { isProductOfTheMonth: false, isFeatured: false } })
  await db.collection('products').updateOne({ id }, { $set: { isProductOfTheMonth: true, isFeatured: true } })
}

async function syncStockAlert(
  product: {
    id: string
    name: string
    quantity?: number | null
    lowStockAlertSentAt?: unknown
    lowStockAlertLevel?: StockAlertLevel | null
  },
  nextQuantity: number | null,
) {
  await handleStockAlertAfterQuantityChange({
    productId: product.id,
    productName: product.name,
    previousQuantity: quantityOf(product),
    nextQuantity,
    lowStockAlertSentAt: product.lowStockAlertSentAt,
    lowStockAlertLevel: product.lowStockAlertLevel ?? null,
  })
}

async function decrementInventoryForOrder(order: { orderId: string; items?: Array<{ id?: string; qty?: number }> }) {
  const db = await getRoom23Db()
  if (!db) return

  const items = Array.isArray(order.items) ? order.items : []
  for (const item of items) {
    const id = String(item?.id || '').trim()
    if (!id) continue
    const product = await getAdminProduct(id)
    if (!product) continue
    const nextQuantity = nextQuantityAfterDecrement(quantityOf(product), Number(item.qty) || 1)
    if (nextQuantity == null) continue

    await db.collection('products').updateOne(
      { id },
      {
        $set: {
          id,
          quantity: nextQuantity,
          inventoryStatus: inventoryStatusFromQuantity(nextQuantity, product.inventoryStatus),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          name: product.name,
          slug: product.slug || id,
          price: product.price,
          category: product.category,
          ...visibilityFields(isArchived(product)),
          isProductOfTheMonth: Boolean(product.isProductOfTheMonth),
          isFeatured: Boolean(product.isFeatured),
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )
    await syncStockAlert(product, nextQuantity)
    revalidatePath(`/admin/products/${id}`)
  }
}

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get('password') || '')
  const expected = await resolveAdminPassword()
  const valid = await verifyAdminPassword(password, expected)

  if (!valid) {
    redirect('/admin/login?error=1')
  }

  const token = await createAdminSessionToken(expected)
  if (!token) {
    redirect('/admin/login?error=1')
  }

  const jar = await cookies()
  jar.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions())
  redirect('/admin')
}

export async function logoutAdmin() {
  const jar = await cookies()
  jar.set(ADMIN_COOKIE_NAME, '', { ...getAdminCookieOptions(), maxAge: 0 })
  jar.delete({ name: ADMIN_COOKIE_NAME, path: '/' })
  redirect('/admin/login')
}

export type AdminSearchResponse = {
  ok: boolean
  results: AdminSearchResult[]
}

export async function searchAdmin(q: string): Promise<AdminSearchResponse> {
  const ok = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!ok) return { ok: false, results: [] }
  const results = await searchAdminEntities(q)
  return { ok: true, results }
}

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const fields = parseProductFields(formData, true)
  if (!fieldsAreValid(fields, true)) {
    redirect('/admin/products/new?error=invalid')
  }
  if (fields.hidden && fields.isProductOfTheMonth) {
    redirect('/admin/products/new?error=archived')
  }

  const existing = await findAdminProductBySlug(fields.slug)
  if (existing || (await getAdminProduct(fields.slug))) {
    redirect('/admin/products/new?error=duplicate')
  }

  const db = await getRoom23Db()
  if (!db) redirect('/admin/products/new?error=db')

  const now = new Date()
  const doc: Record<string, unknown> = {
    id: fields.slug,
    slug: fields.slug,
    name: fields.name,
    price: fields.price,
    quantity: fields.quantity,
    category: fields.category,
    inventoryStatus: inventoryStatusFromQuantity(fields.quantity),
    ...visibilityFields(fields.hidden),
    ...editorialFields(fields),
    isProductOfTheMonth: false,
    source: 'custom',
    createdAt: now,
    updatedAt: now,
  }
  if (fields.cogs != null) doc.cogs = fields.cogs

  await db.collection('products').insertOne(doc)

  if (fields.isProductOfTheMonth) {
    await applyExclusiveProductOfTheMonth(fields.slug)
  }

  await syncStockAlert(
    {
      id: fields.slug,
      name: fields.name,
      quantity: null,
      lowStockAlertSentAt: null,
      lowStockAlertLevel: null,
    },
    fields.quantity,
  )

  revalidateAdmin()
  revalidatePath(`/admin/products/${fields.slug}`)
  redirect(`/admin/products/${encodeURIComponent(fields.slug)}?saved=1`)
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const fields = parseProductFields(formData, true)
  if (!fieldsAreValid(fields, true)) {
    redirectProduct(formData, id, 'error=invalid')
  }
  if (fields.hidden && fields.isProductOfTheMonth) {
    redirectProduct(formData, id, 'error=archived')
  }

  const slugOwner = await findAdminProductBySlug(fields.slug)
  if (slugOwner && slugOwner.id !== id) {
    redirectProduct(formData, id, 'error=duplicate')
  }

  const nextQuantity = fields.quantity
  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  const update: Record<string, unknown> = {
    id,
    slug: fields.slug || product.slug || id,
    name: fields.name,
    price: fields.price,
    quantity: nextQuantity,
    inventoryStatus: inventoryStatusFromQuantity(nextQuantity, product.inventoryStatus),
    category: fields.category,
    source: product.source || undefined,
    ...visibilityFields(fields.hidden),
    ...editorialFields(fields),
    isProductOfTheMonth: fields.isProductOfTheMonth,
    updatedAt: new Date(),
  }

  const updateOps: Record<string, unknown> = {
    $set: update,
    $setOnInsert: {
      createdAt: new Date(),
    },
  }

  if (fields.cogs != null) {
    update.cogs = fields.cogs
  } else {
    updateOps.$unset = { cogs: '' }
  }

  await db.collection('products').updateOne({ id }, updateOps, { upsert: true })

  if (fields.isProductOfTheMonth) {
    await applyExclusiveProductOfTheMonth(id)
  }

  const priceChanged = Number(product.price) !== Number(fields.price)
  const wasHidden = isArchived(product)
  if (priceChanged) {
    await writeAdminAudit({
      action: 'product.price',
      entityType: 'product',
      entityId: id,
      message: `Price for ${fields.name} changed from ${Number(product.price).toFixed(2)} to ${Number(fields.price).toFixed(2)}`,
      meta: { from: product.price, to: fields.price, name: fields.name },
    })
  }
  if (wasHidden !== fields.hidden) {
    await writeAdminAudit({
      action: fields.hidden ? 'product.hide' : 'product.show',
      entityType: 'product',
      entityId: id,
      message: fields.hidden ? `Hid ${fields.name}` : `Restored ${fields.name}`,
      meta: { hidden: fields.hidden, name: fields.name },
    })
  }

  await syncStockAlert(product, nextQuantity ?? null)

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirectProduct(formData, id)
}

export async function updateQuantity(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const quantity = parseQuantity(formData, true)
  if (quantity == null) redirectProduct(formData, id, 'error=invalid')

  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        quantity,
        inventoryStatus: inventoryStatusFromQuantity(quantity, product.inventoryStatus),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: product.name,
        slug: product.slug || id,
        price: product.price,
        category: product.category,
        ...visibilityFields(isArchived(product)),
        isProductOfTheMonth: Boolean(product.isProductOfTheMonth),
        isFeatured: Boolean(product.isFeatured),
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  await syncStockAlert(product, quantity ?? null)

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirectProduct(formData, id)
}

export async function archiveProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  const wasFeatured = Boolean(product.isProductOfTheMonth || product.isFeatured)
  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        ...visibilityFields(true),
        ...(wasFeatured ? { isProductOfTheMonth: false, isFeatured: false } : {}),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: product.name,
        slug: product.slug || id,
        price: product.price,
        category: product.category,
        quantity: product.quantity ?? null,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  await writeAdminAudit({
    action: 'product.hide',
    entityType: 'product',
    entityId: id,
    message: `Archived ${product.name}`,
    meta: { name: product.name },
  })

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirectProduct(formData, id)
}

export async function unarchiveProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        ...visibilityFields(false),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        name: product.name,
        slug: product.slug || id,
        price: product.price,
        category: product.category,
        quantity: product.quantity ?? null,
        isProductOfTheMonth: false,
        isFeatured: false,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  await writeAdminAudit({
    action: 'product.show',
    entityType: 'product',
    entityId: id,
    message: `Restored ${product.name}`,
    meta: { name: product.name },
  })

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirectProduct(formData, id)
}

export async function setProductOfTheMonth(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')
  if (isArchived(product)) redirectProduct(formData, id, 'error=archived')

  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  await db.collection('products').updateMany({}, { $set: { isProductOfTheMonth: false, isFeatured: false } })
  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        isProductOfTheMonth: true,
        isFeatured: true,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  )

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirectProduct(formData, id)
}

export async function clearProductOfTheMonth(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const db = await getRoom23Db()
  if (!db) redirect(id ? `/admin/products/${encodeURIComponent(id)}?error=db` : '/admin/products?error=db')

  await db.collection('products').updateMany(
    {},
    { $set: { isProductOfTheMonth: false, isFeatured: false, updatedAt: new Date() } },
  )

  revalidateAdmin()
  if (fromList(formData) || !id) redirect('/admin/products?saved=1')
  revalidatePath(`/admin/products/${id}`)
  redirect(`/admin/products/${encodeURIComponent(id)}?saved=1`)
}

function redirectOrder(orderId: string, query: string): never {
  redirect(`/admin/orders/${encodeURIComponent(orderId)}?${query}`)
}

async function requireAdminOrder(formData: FormData) {
  await requireAdmin()
  const orderId = String(formData.get('orderId') || '').trim()
  if (!orderId) redirect('/admin/orders?error=missing')
  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=missing')
  return order
}

function revalidateOrder(orderId: string, email?: string) {
  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  const customerEmail = String(email || '').trim().toLowerCase()
  if (customerEmail) revalidatePath(`/admin/customers/${encodeURIComponent(customerEmail)}`)
}

export async function updateOrderStatus(formData: FormData) {
  const order = await requireAdminOrder(formData)
  const status = String(formData.get('status') || '').trim()

  if (!isOrderStatus(status)) {
    redirectOrder(order.orderId, 'error=invalid')
  }

  const db = await getRoom23Db()
  if (!db) redirectOrder(order.orderId, 'error=db')

  const decrement = shouldDecrementInventory(order, status)
  if (decrement) {
    await decrementInventoryForOrder(order)
  }

  await db.collection('orders').updateOne(
    { orderId: order.orderId },
    {
      $set: {
        ...buildOrderStatusUpdate(status),
        ...(decrement ? { inventoryDecremented: true } : {}),
      },
    },
  )

  await writeAdminAudit({
    action: 'order.status',
    entityType: 'order',
    entityId: order.orderId,
    message: `Order ${order.orderId} status changed from ${order.status || 'paid'} to ${status}`,
    meta: { from: order.status || 'paid', to: status },
  })

  const fromStatus = orderStatusLabel(order.status)
  const toStatus = orderStatusLabel(status)
  await safeInsertOrderEvent({
    orderId: order.orderId,
    type: 'status_changed',
    message: `Status changed from ${fromStatus} to ${toStatus}`,
    meta: { from: order.status || 'paid', to: status },
    actor: 'admin',
  })
  if (decrement) {
    await safeInsertOrderEvent({
      orderId: order.orderId,
      type: 'inventory_decremented',
      message: 'Inventory decremented on fulfill',
      actor: 'admin',
    })
  }

  revalidateOrder(order.orderId, order.email)
  redirectOrder(order.orderId, decrement ? 'saved=status&inventory=1' : 'saved=status')
}

export async function updateOrderNotes(formData: FormData) {
  const order = await requireAdminOrder(formData)
  const notes = String(formData.get('notes') || '').trim().slice(0, 2000)

  const db = await getRoom23Db()
  if (!db) redirectOrder(order.orderId, 'error=db')

  await db.collection('orders').updateOne(
    { orderId: order.orderId },
    {
      $set: {
        notes,
        updatedAt: new Date(),
      },
    },
  )

  await safeInsertOrderEvent({
    orderId: order.orderId,
    type: 'note_updated',
    message: notes ? 'Internal notes updated' : 'Internal notes cleared',
    meta: { length: notes.length },
    actor: 'admin',
  })

  revalidateOrder(order.orderId, order.email)
  redirectOrder(order.orderId, 'saved=notes')
}

export async function markOrderReviewed(formData: FormData) {
  const order = await requireAdminOrder(formData)
  const raw = String(formData.get('adminReview') || '').trim().toLowerCase()
  const adminReview = raw === '1' || raw === 'true' || raw === 'on'

  const db = await getRoom23Db()
  if (!db) redirectOrder(order.orderId, 'error=db')

  await db.collection('orders').updateOne(
    { orderId: order.orderId },
    {
      $set: {
        adminReview,
        updatedAt: new Date(),
      },
    },
  )

  await safeInsertOrderEvent({
    orderId: order.orderId,
    type: 'reviewed',
    message: adminReview ? 'Flagged for admin review' : 'Marked as reviewed',
    meta: { adminReview },
    actor: 'admin',
  })

  revalidateOrder(order.orderId, order.email)
  redirectOrder(order.orderId, 'saved=reviewed')
}

export async function resendOrderEmail(formData: FormData) {
  const order = await requireAdminOrder(formData)
  const email = String(order.email || '').trim()
  const items = (Array.isArray(order.items) ? order.items : [])
    .map((item) => ({
      name: String(item?.name || item?.id || 'Item').trim() || 'Item',
      qty: Math.max(1, Math.floor(Number(item?.qty) || 1)),
      price: Number(item?.price),
    }))
    .filter((item) => Number.isFinite(item.price) && item.price >= 0)

  if (!email || items.length === 0 || !process.env.RESEND_API_KEY) {
    redirectOrder(order.orderId, 'error=email')
  }

  const totals = order.totals || {}
  const subtotal = Number(totals.subtotal)
  const shipping = Number(totals.shipping)
  const tax = Number(totals.tax)
  const total = Number(totals.total)
  const fallbackSubtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  try {
    await sendOrderConfirmation({
      orderId: order.orderId,
      email,
      items,
      totals: {
        subtotal: Number.isFinite(subtotal) ? subtotal : fallbackSubtotal,
        shipping: Number.isFinite(shipping) ? shipping : 0,
        tax: Number.isFinite(tax) ? tax : 0,
        total: Number.isFinite(total)
          ? total
          : fallbackSubtotal + (Number.isFinite(shipping) ? shipping : 0),
      },
      splitFulfillment: Boolean(order.fulfillment?.splitFulfillment),
    })
  } catch {
    redirectOrder(order.orderId, 'error=email')
  }

  const db = await getRoom23Db()
  if (db) {
    await db.collection('orders').updateOne(
      { orderId: order.orderId },
      {
        $set: {
          emailSent: true,
          updatedAt: new Date(),
        },
      },
    )
  }

  await safeInsertOrderEvent({
    orderId: order.orderId,
    type: 'email_sent',
    message: `Confirmation email sent to ${email}`,
    meta: { email },
    actor: 'admin',
  })

  revalidateOrder(order.orderId, order.email)
  redirectOrder(order.orderId, 'saved=email')
}

function redirectCoupon(code: string, query = 'saved=1'): never {
  redirect(`/admin/coupons/${encodeURIComponent(code)}?${query}`)
}

function parseOptionalNumber(formData: FormData, name: string, integer = false) {
  const raw = String(formData.get(name) ?? '').trim()
  if (raw === '') return null
  const value = integer ? Math.floor(Number(raw)) : Number(raw)
  if (!Number.isFinite(value) || value < 0) return undefined
  return value
}

function parseCouponFields(formData: FormData) {
  const code = normalizeCouponCode(String(formData.get('code') || ''))
  const type = String(formData.get('type') || '').trim()
  const value = Number(formData.get('value'))
  const minOrder = parseOptionalNumber(formData, 'minOrder')
  const usageLimit = parseOptionalNumber(formData, 'usageLimit', true)
  const expiresRaw = String(formData.get('expiresAt') || '').trim()
  const note = String(formData.get('note') || '').trim().slice(0, 500)
  const expiresAt = expiresRaw ? new Date(expiresRaw) : null

  return {
    code,
    type,
    value,
    minOrder,
    usageLimit,
    expiresAt: expiresAt && !Number.isNaN(expiresAt.getTime()) ? expiresAt : null,
    note,
    active: String(formData.get('active') || '').toLowerCase() === 'on',
  }
}

function couponFieldsAreValid(fields: ReturnType<typeof parseCouponFields>) {
  if (!fields.code || fields.code.length < 3) return false
  if (!isCouponType(fields.type)) return false
  if (!Number.isFinite(fields.value) || fields.value <= 0) return false
  if (fields.type === 'percent' && (fields.value < 1 || fields.value > 100)) return false
  if (fields.minOrder === undefined || fields.usageLimit === undefined) return false
  return true
}

export async function createCoupon(formData: FormData) {
  await requireAdmin()
  const fields = parseCouponFields(formData)
  if (!couponFieldsAreValid(fields)) redirect('/admin/coupons/new?error=invalid')

  const db = await getRoom23Db()
  if (!db) redirect('/admin/coupons/new?error=db')

  const existing = await db.collection('coupons').findOne({ code: fields.code })
  if (existing) redirect('/admin/coupons/new?error=duplicate')

  const type: CouponType = fields.type === 'fixed' ? 'fixed' : 'percent'
  const now = new Date()
  await db.collection('coupons').insertOne({
    code: fields.code,
    type,
    value: fields.value,
    minOrder: fields.minOrder,
    usageLimit: fields.usageLimit,
    usedCount: 0,
    expiresAt: fields.expiresAt,
    active: fields.active,
    note: fields.note,
    createdAt: now,
    updatedAt: now,
  })

  await writeAdminAudit({
    action: 'coupon.create',
    entityType: 'coupon',
    entityId: fields.code,
    message: `Created coupon ${fields.code}`,
    meta: { type, value: fields.value, active: fields.active },
  })

  revalidateAdmin()
  revalidatePath(`/admin/coupons/${fields.code}`)
  redirect(`/admin/coupons/${encodeURIComponent(fields.code)}?saved=1`)
}

export async function updateCoupon(formData: FormData) {
  await requireAdmin()
  const originalCode = normalizeCouponCode(String(formData.get('originalCode') || formData.get('code') || ''))
  const fields = parseCouponFields(formData)
  if (!originalCode) redirect('/admin/coupons?error=missing')
  if (!couponFieldsAreValid(fields)) redirectCoupon(originalCode, 'error=invalid')

  const db = await getRoom23Db()
  if (!db) redirectCoupon(originalCode, 'error=db')

  const current = await db.collection('coupons').findOne({ code: originalCode })
  if (!current) redirect('/admin/coupons?error=missing')

  const type: CouponType = fields.type === 'fixed' ? 'fixed' : 'percent'
  await db.collection('coupons').updateOne(
    { code: originalCode },
    {
      $set: {
        type,
        value: fields.value,
        minOrder: fields.minOrder,
        usageLimit: fields.usageLimit,
        expiresAt: fields.expiresAt,
        active: fields.active,
        note: fields.note,
        updatedAt: new Date(),
      },
    },
  )

  await writeAdminAudit({
    action: 'coupon.update',
    entityType: 'coupon',
    entityId: originalCode,
    message: `Updated coupon ${originalCode}`,
    meta: { type, value: fields.value, active: fields.active },
  })

  revalidateAdmin()
  revalidatePath(`/admin/coupons/${originalCode}`)
  redirectCoupon(originalCode)
}

export async function deactivateCoupon(formData: FormData) {
  await requireAdmin()
  const code = normalizeCouponCode(String(formData.get('code') || ''))
  if (!code) redirect('/admin/coupons?error=missing')

  const db = await getRoom23Db()
  if (!db) redirect(`/admin/coupons/${encodeURIComponent(code)}?error=db`)

  const current = await db.collection('coupons').findOne({ code })
  if (!current) redirect('/admin/coupons?error=missing')

  await db.collection('coupons').updateOne(
    { code },
    { $set: { active: false, updatedAt: new Date() } },
  )

  await writeAdminAudit({
    action: 'coupon.deactivate',
    entityType: 'coupon',
    entityId: code,
    message: `Deactivated coupon ${code}`,
  })

  revalidateAdmin()
  revalidatePath(`/admin/coupons/${code}`)
  if (fromList(formData)) redirect('/admin/coupons?saved=1')
  redirectCoupon(code)
}

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin()

  const shippingFlatRate = Number(formData.get('shippingFlatRate'))
  const thresholdRaw = String(formData.get('freeShippingThreshold') ?? '').trim()
  const freeShippingThreshold = thresholdRaw === '' ? null : Number(thresholdRaw)
  const supportEmail = String(formData.get('supportEmail') || '').trim()
  const supportPhone = String(formData.get('supportPhone') || '').trim()
  const storeOpen = String(formData.get('storeOpen') || '').toLowerCase() === 'on'

  if (!Number.isFinite(shippingFlatRate) || shippingFlatRate < 0) {
    redirect('/admin/settings?error=invalid')
  }
  if (freeShippingThreshold != null && (!Number.isFinite(freeShippingThreshold) || freeShippingThreshold < 0)) {
    redirect('/admin/settings?error=invalid')
  }
  if (!supportEmail || !supportEmail.includes('@')) {
    redirect('/admin/settings?error=invalid')
  }

  const zones = []
  for (let index = 0; index < SHIPPING_ZONE_SLOTS; index += 1) {
    zones.push({
      name: String(formData.get(`zoneName${index}`) || ''),
      countries: String(formData.get(`zoneCountries${index}`) || ''),
      rate: String(formData.get(`zoneRate${index}`) || ''),
    })
  }

  const db = await getRoom23Db()
  if (!db) redirect('/admin/settings?error=db')

  await db.collection('settings').updateOne(
    { id: STORE_SETTINGS_ID },
    {
      $set: {
        id: STORE_SETTINGS_ID,
        storeOpen,
        supportEmail,
        supportPhone,
        shippingFlatRate,
        freeShippingThreshold,
        shippingZones: normalizeShippingZones(zones),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

  await writeAdminAudit({
    action: 'settings.update',
    entityType: 'settings',
    entityId: STORE_SETTINGS_ID,
    message: 'Updated store settings',
    meta: { storeOpen, shippingFlatRate, freeShippingThreshold, supportEmail },
  })

  revalidateAdmin()
  redirect('/admin/settings?saved=1')
}

export async function bulkUpdateProducts(formData: FormData) {
  await requireAdmin()

  const { ids, exceeded } = parseBulkIds(formData.get('ids'))
  if (exceeded) {
    bulkProductsRedirect(formData, { bulk: 'error', msg: 'Select at most 50 products.' })
  }
  if (!ids.length) {
    bulkProductsRedirect(formData, { bulk: 'error', msg: 'No products selected.' })
  }

  const action = String(formData.get('action') || '').trim()
  const db = await getRoom23Db()
  if (!db) {
    bulkProductsRedirect(formData, { bulk: 'error', msg: 'Database unavailable.' })
  }

  let updated = 0

  for (const id of ids) {
    const product = await getAdminProduct(id)
    if (!product) continue

    const now = new Date()
    let $set: Record<string, unknown> = { id, updatedAt: now }
    let auditAction = 'product.update'
    let auditMessage = `Updated ${product.name} (bulk)`

    if (action === 'archive') {
      const wasFeatured = Boolean(product.isProductOfTheMonth || product.isFeatured)
      $set = {
        ...$set,
        ...visibilityFields(true),
        ...(wasFeatured ? { isProductOfTheMonth: false, isFeatured: false } : {}),
      }
      auditAction = 'product.hide'
      auditMessage = `Archived ${product.name} (bulk)`
    } else if (action === 'restore') {
      $set = { ...$set, ...visibilityFields(false) }
      auditAction = 'product.show'
      auditMessage = `Restored ${product.name} (bulk)`
    } else if (action === 'hideWhenZeroOn') {
      $set.hideWhenZero = true
      auditMessage = `Enabled hide-when-zero for ${product.name} (bulk)`
    } else if (action === 'hideWhenZeroOff') {
      $set.hideWhenZero = false
      auditMessage = `Disabled hide-when-zero for ${product.name} (bulk)`
    } else if (action === 'setCategory') {
      const category = String(formData.get('category') || '').trim()
      if (!CATEGORY_VALUES.has(category)) {
        bulkProductsRedirect(formData, { bulk: 'error', msg: 'Invalid category.' })
      }
      $set.category = category
      $set.collection = category
      auditMessage = `Set category to ${category} for ${product.name} (bulk)`
    } else {
      bulkProductsRedirect(formData, { bulk: 'error', msg: 'Unknown bulk action.' })
    }

    await db.collection('products').updateOne(
      { id },
      {
        $set,
        $setOnInsert: {
          name: product.name,
          slug: product.slug || id,
          price: product.price,
          category: product.category,
          quantity: product.quantity ?? null,
          isProductOfTheMonth: false,
          isFeatured: false,
          createdAt: now,
        },
      },
      { upsert: true },
    )

    await writeAdminAudit({
      action: auditAction,
      entityType: 'product',
      entityId: id,
      message: auditMessage,
      meta: { name: product.name, bulk: true, action },
    })

    revalidatePath(`/admin/products/${id}`)
    updated++
  }

  revalidateAdmin()
  bulkProductsRedirect(formData, { bulk: 'ok', count: String(updated) })
}

export async function bulkUpdateOrders(formData: FormData) {
  await requireAdmin()

  const { ids, exceeded } = parseBulkIds(formData.get('ids'))
  if (exceeded) {
    bulkOrdersRedirect(formData, { bulk: 'error', msg: 'Select at most 50 orders.' })
  }
  if (!ids.length) {
    bulkOrdersRedirect(formData, { bulk: 'error', msg: 'No orders selected.' })
  }

  const action = String(formData.get('action') || '').trim()
  const db = await getRoom23Db()
  if (!db) {
    bulkOrdersRedirect(formData, { bulk: 'error', msg: 'Database unavailable.' })
  }

  let updated = 0
  let skipped = 0

  for (const orderId of ids) {
    const order = await getAdminOrder(orderId)
    if (!order) {
      skipped++
      continue
    }

    if (action === 'reviewed') {
      await db.collection('orders').updateOne(
        { orderId },
        {
          $set: {
            adminReview: false,
            updatedAt: new Date(),
          },
        },
      )

      await safeInsertOrderEvent({
        orderId,
        type: 'reviewed',
        message: 'Marked as reviewed (bulk)',
        meta: { adminReview: false, bulk: true },
        actor: 'admin',
      })

      revalidateOrder(orderId, order.email)
      updated++
      continue
    }

    if (action === 'fulfilled') {
      if (!canBulkFulfillOrder(order)) {
        skipped++
        continue
      }

      const status = 'fulfilled'
      const decrement = shouldDecrementInventory(order, status)
      if (decrement) {
        await decrementInventoryForOrder(order)
      }

      await db.collection('orders').updateOne(
        { orderId },
        {
          $set: {
            ...buildOrderStatusUpdate(status),
            ...(decrement ? { inventoryDecremented: true } : {}),
          },
        },
      )

      await writeAdminAudit({
        action: 'order.status',
        entityType: 'order',
        entityId: orderId,
        message: `Order ${orderId} fulfilled (bulk)`,
        meta: { from: order.status || 'paid', to: status, bulk: true },
      })

      const fromStatus = orderStatusLabel(order.status)
      const toStatus = orderStatusLabel(status)
      await safeInsertOrderEvent({
        orderId,
        type: 'status_changed',
        message: `Status changed from ${fromStatus} to ${toStatus} (bulk)`,
        meta: { from: order.status || 'paid', to: status, bulk: true },
        actor: 'admin',
      })

      if (decrement) {
        await safeInsertOrderEvent({
          orderId,
          type: 'inventory_decremented',
          message: 'Inventory decremented on fulfill (bulk)',
          actor: 'admin',
        })
      }

      revalidateOrder(orderId, order.email)
      updated++
      continue
    }

    bulkOrdersRedirect(formData, { bulk: 'error', msg: 'Unknown bulk action.' })
  }

  revalidateAdmin()

  const query: Record<string, string> = { bulk: 'ok', count: String(updated) }
  if (skipped > 0) query.skippedCount = String(skipped)
  bulkOrdersRedirect(formData, query)
}

function revalidateRma(rmaId: string, orderId?: string, email?: string) {
  revalidateAdmin()
  revalidatePath('/admin/returns')
  revalidatePath(`/admin/returns/${encodeURIComponent(rmaId)}`)
  const oid = String(orderId || '').trim()
  if (oid) revalidatePath(`/admin/orders/${encodeURIComponent(oid)}`)
  const customerEmail = String(email || '').trim().toLowerCase()
  if (customerEmail) revalidatePath(`/admin/customers/${encodeURIComponent(customerEmail)}`)
}

function redirectRma(rmaId: string, query: string): never {
  redirect(`/admin/returns/${encodeURIComponent(rmaId)}?${query}`)
}

export async function createRma(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  if (!orderId) redirect('/admin/orders?error=missing')

  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=missing')

  const reason = String(formData.get('reason') || '').trim().slice(0, 1000)
  const items = parseCreateRmaItems(formData, order)
  if (!reason || items.length === 0) {
    redirect(`/admin/orders/${encodeURIComponent(orderId)}?error=rma_invalid`)
  }

  const db = await getRoom23Db()
  if (!db) redirect(`/admin/orders/${encodeURIComponent(orderId)}?error=db`)

  const now = new Date()
  const id = generateRmaId(orderId, now)
  const email = String(order.email || '').trim() || undefined

  await db.collection('rmas').insertOne({
    id,
    orderId,
    email,
    items,
    reason,
    status: 'requested',
    resolution: 'refund_pending',
    restockApplied: false,
    notes: '',
    createdAt: now,
    updatedAt: now,
  })

  await writeAdminAudit({
    action: 'rma.create',
    entityType: 'rma',
    entityId: id,
    message: `Opened RMA ${id} for order ${orderId}`,
    meta: { orderId, itemCount: items.length },
  })

  await safeInsertOrderEvent({
    orderId,
    type: 'rma_created',
    message: `RMA ${id} opened (${items.length} line${items.length === 1 ? '' : 's'})`,
    meta: { rmaId: id, itemCount: items.length },
    actor: 'admin',
  })

  revalidateRma(id, orderId, email)
  redirect(`/admin/returns/${encodeURIComponent(id)}?saved=created`)
}

export async function updateRma(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  if (!id) redirect('/admin/returns?error=missing')

  const rma = await getAdminRma(id)
  if (!rma) redirect('/admin/returns?error=missing')

  const db = await getRoom23Db()
  if (!db) redirectRma(id, 'error=db')

  const notes = String(formData.get('notes') ?? rma.notes ?? '')
    .trim()
    .slice(0, 2000)
  const resolutionRaw = String(formData.get('resolution') || rma.resolution || '').trim().toLowerCase()
  const resolution: RmaResolution | undefined = isRmaResolution(resolutionRaw) ? resolutionRaw : rma.resolution

  const statusRaw = String(formData.get('status') || '').trim().toLowerCase()
  let nextStatus: RmaStatus = rma.status
  let statusChanged = false

  if (statusRaw && isRmaStatus(statusRaw) && statusRaw !== rma.status) {
    const allowed = allowedRmaStatusTransitions(rma.status)
    if (!allowed.includes(statusRaw)) {
      redirectRma(id, 'error=invalid_transition')
    }
    nextStatus = statusRaw
    statusChanged = true
  }

  const now = new Date()
  await db.collection('rmas').updateOne(
    { id },
    {
      $set: {
        notes,
        ...(resolution ? { resolution } : {}),
        ...(statusChanged ? { status: nextStatus } : {}),
        updatedAt: now,
      },
    },
  )

  let restockResult: 'applied' | 'already' | 'missing' | 'skip' | undefined
  if (statusChanged && nextStatus === 'restocked' && resolution === 'restock') {
    restockResult = await applyRmaRestock(id)
  }

  if (statusChanged) {
    await writeAdminAudit({
      action: 'rma.status',
      entityType: 'rma',
      entityId: id,
      message: `RMA ${id} status ${rma.status} → ${nextStatus}`,
      meta: { from: rma.status, to: nextStatus, orderId: rma.orderId },
    })

    await safeInsertOrderEvent({
      orderId: rma.orderId,
      type: 'rma_status_changed',
      message: `RMA ${id} status changed to ${rmaStatusLabel(nextStatus)}`,
      meta: { rmaId: id, from: rma.status, to: nextStatus },
      actor: 'admin',
    })

    if (restockResult === 'applied') {
      await safeInsertOrderEvent({
        orderId: rma.orderId,
        type: 'rma_restocked',
        message: `RMA ${id} inventory restocked`,
        meta: { rmaId: id },
        actor: 'admin',
      })
    }
  } else if (notes !== (rma.notes || '') || resolution !== rma.resolution) {
    await writeAdminAudit({
      action: 'rma.update',
      entityType: 'rma',
      entityId: id,
      message: `Updated RMA ${id}`,
      meta: { orderId: rma.orderId },
    })
  }

  revalidateRma(id, rma.orderId, rma.email)

  if (restockResult === 'already') {
    redirectRma(id, 'saved=1&restock=already')
  }
  if (restockResult === 'applied') {
    redirectRma(id, 'saved=1&restock=1')
  }
  redirectRma(id, statusChanged ? 'saved=status' : 'saved=1')
}

export async function updateHandoffNote(formData: FormData) {
  await requireAdmin()

  const note = String(formData.get('note') || '').trim().slice(0, 2000)
  const db = await getRoom23Db()
  if (!db) redirect('/admin?handoff=error&msg=db')

  const now = new Date()
  await db.collection('settings').updateOne(
    { id: OPS_HANDOFF_ID },
    {
      $set: {
        id: OPS_HANDOFF_ID,
        note,
        updatedAt: now,
        updatedBy: 'admin',
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  )

  await writeAdminAudit({
    action: 'handoff.update',
    entityType: 'settings',
    entityId: OPS_HANDOFF_ID,
    message: note ? 'Updated shift handoff note' : 'Cleared shift handoff note',
    meta: { length: note.length },
  })

  revalidatePath('/admin')
  redirect(note ? '/admin?handoff=saved' : '/admin?handoff=cleared')
}

export async function clearHandoffNote() {
  await requireAdmin()

  const db = await getRoom23Db()
  if (!db) redirect('/admin?handoff=error&msg=db')

  const now = new Date()
  await db.collection('settings').updateOne(
    { id: OPS_HANDOFF_ID },
    {
      $set: {
        id: OPS_HANDOFF_ID,
        note: '',
        updatedAt: now,
        updatedBy: 'admin',
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  )

  await writeAdminAudit({
    action: 'handoff.clear',
    entityType: 'settings',
    entityId: OPS_HANDOFF_ID,
    message: 'Cleared shift handoff note',
  })

  revalidatePath('/admin')
  redirect('/admin?handoff=cleared')
}
