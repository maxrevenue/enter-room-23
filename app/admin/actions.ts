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
  getAdminProduct,
  inventoryStatusFromQuantity,
  isArchived,
  makeProductSlug,
  productCategories,
} from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import { getAdminOrder, isOrderStatus, orderStatusPatch } from '@/lib/admin-orders'

async function requireAdmin() {
  const ok = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!ok) redirect('/admin/login')
}

function revalidateAdmin() {
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/admin/orders')
  revalidatePath('/')
  revalidatePath('/shop')
  revalidatePath('/products', 'layout')
  revalidatePath('/collections', 'layout')
}

const CATEGORY_VALUES = new Set(productCategories())
const RESERVED_SLUGS = new Set(['new', 'admin', 'shop', 'api', 'products', 'collections'])

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

export async function createProduct(formData: FormData) {
  await requireAdmin()

  const name = String(formData.get('name') || '').trim()
  const slug = makeProductSlug(name, String(formData.get('slug') || ''))
  const price = parsePrice(formData)
  const quantity = parseQuantity(formData, true)
  const category = String(formData.get('category') || '').trim()
  const shortEditorial = String(formData.get('shortEditorial') || '').trim()
  const hidden = parseHidden(formData)

  if (!name || !slug || RESERVED_SLUGS.has(slug) || price == null || quantity == null || !CATEGORY_VALUES.has(category)) {
    redirect('/admin/products/new?error=invalid')
  }

  const existing = await findAdminProductBySlug(slug)
  if (existing || (await getAdminProduct(slug))) {
    redirect('/admin/products/new?error=duplicate')
  }

  const db = await getRoom23Db()
  if (!db) redirect('/admin/products/new?error=db')

  const now = new Date()
  await db.collection('products').insertOne({
    id: slug,
    slug,
    name,
    price,
    quantity,
    category,
    collection: category,
    shortEditorial,
    inventoryStatus: inventoryStatusFromQuantity(quantity),
    ...visibilityFields(hidden),
    isProductOfTheMonth: false,
    isFeatured: false,
    source: 'custom',
    createdAt: now,
    updatedAt: now,
  })

  revalidateAdmin()
  revalidatePath(`/admin/products/${slug}`)
  redirect(`/admin/products/${encodeURIComponent(slug)}?saved=1`)
}

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const name = String(formData.get('name') || '').trim()
  const price = parsePrice(formData)
  const quantity = parseQuantity(formData, false)
  const category = String(formData.get('category') || '').trim()
  const shortEditorial = String(formData.get('shortEditorial') || '').trim()

  if (!name || price == null || !CATEGORY_VALUES.has(category) || quantity === null) {
    redirectProduct(formData, id, 'error=invalid')
  }

  const nextQuantity = quantity === undefined ? product.quantity ?? null : quantity
  const db = await getRoom23Db()
  if (!db) redirectProduct(formData, id, 'error=db')

  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        slug: product.slug || id,
        name,
        price,
        quantity: nextQuantity,
        inventoryStatus: inventoryStatusFromQuantity(nextQuantity, product.inventoryStatus),
        category,
        shortEditorial,
        source: product.source || undefined,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        ...visibilityFields(Boolean(product.hidden)),
        isProductOfTheMonth: false,
        isFeatured: false,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  )

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

function redirectOrder(orderId: string, query = 'saved=1'): never {
  redirect(`/admin/orders/${encodeURIComponent(orderId)}?${query}`)
}

async function requireOrder(orderId: string) {
  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=missing')
  return order
}

export async function updateOrder(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  await requireOrder(orderId)

  const status = String(formData.get('status') || '').trim()
  const notes = String(formData.get('notes') || '').trim().slice(0, 2000)

  if (!isOrderStatus(status)) redirectOrder(orderId, 'error=invalid')

  const db = await getRoom23Db()
  if (!db) redirectOrder(orderId, 'error=db')

  await db.collection('orders').updateOne(
    { orderId },
    {
      $set: {
        notes,
        ...orderStatusPatch(status),
      },
    },
  )

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirectOrder(orderId)
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  await requireOrder(orderId)

  const status = String(formData.get('status') || '').trim()
  if (!isOrderStatus(status)) redirectOrder(orderId, 'error=invalid')

  const db = await getRoom23Db()
  if (!db) redirectOrder(orderId, 'error=db')

  await db.collection('orders').updateOne({ orderId }, { $set: orderStatusPatch(status) })

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirectOrder(orderId)
}

export async function updateOrderNotes(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  await requireOrder(orderId)

  const notes = String(formData.get('notes') || '').trim().slice(0, 2000)
  const db = await getRoom23Db()
  if (!db) redirectOrder(orderId, 'error=db')

  await db.collection('orders').updateOne(
    { orderId },
    { $set: { notes, updatedAt: new Date() } },
  )

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirectOrder(orderId)
}

export async function markOrderReviewed(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  await requireOrder(orderId)

  const adminReview = String(formData.get('adminReview') || '') === '1'
  const db = await getRoom23Db()
  if (!db) redirectOrder(orderId, 'error=db')

  await db.collection('orders').updateOne(
    { orderId },
    { $set: { adminReview, updatedAt: new Date() } },
  )

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirectOrder(orderId)
}

export async function resendOrderEmail(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  const order = await requireOrder(orderId)
  const email = String(order.email || '').trim()
  const items = (order.items || [])
    .map((item) => ({
      name: String(item.name || item.id || '').trim(),
      qty: Math.max(1, Math.floor(Number(item.qty) || 1)),
      price: Number(item.price),
    }))
    .filter((item) => item.name && Number.isFinite(item.price) && item.price >= 0)

  if (!email || items.length === 0 || !order.totals) {
    redirectOrder(orderId, 'error=email')
  }

  try {
    const { sendOrderConfirmation } = await import('@/lib/email/order-confirmation.mjs')
    await sendOrderConfirmation(
      {
        orderId: order.orderId,
        email,
        items,
        totals: {
          subtotal: Number(order.totals.subtotal) || 0,
          shipping: Number(order.totals.shipping) || 0,
          tax: order.totals.tax,
          total: Number(order.totals.total) || 0,
        },
        splitFulfillment: Boolean(order.fulfillment?.splitFulfillment),
      },
      { idempotencyKey: `order-email:${order.orderId}:admin:${Date.now()}` },
    )
  } catch {
    redirectOrder(orderId, 'error=email')
  }

  const db = await getRoom23Db()
  if (db) {
    await db.collection('orders').updateOne(
      { orderId },
      { $set: { emailSent: true, updatedAt: new Date() } },
    )
  }

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirectOrder(orderId, 'saved=email')
}
