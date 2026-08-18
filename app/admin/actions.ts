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
import { getAdminProduct } from '@/lib/admin-catalog'
import { getRoom23Db } from '@/lib/admin-db'
import { getAdminOrder, isOrderStatus } from '@/lib/admin-orders'
import { INVENTORY_STATUS } from '@/lib/inventory'
import { getAllCategories } from '@/lib/products'

async function requireAdmin() {
  const ok = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!ok) redirect('/admin/login')
}

function revalidateAdmin() {
  revalidatePath('/admin')
  revalidatePath('/admin/products')
  revalidatePath('/admin/orders')
  revalidatePath('/')
}

const INVENTORY_VALUES = new Set(Object.values(INVENTORY_STATUS))
const CATEGORY_VALUES = new Set(getAllCategories().filter((category) => category !== 'all'))

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

export async function updateProduct(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const name = String(formData.get('name') || '').trim()
  const price = Number(formData.get('price'))
  const inventoryStatus = String(formData.get('inventoryStatus') || '').trim()
  const category = String(formData.get('category') || '').trim()
  const hidden = String(formData.get('hidden') || '') === 'on'
  const shortEditorial = String(formData.get('shortEditorial') || '').trim()

  if (!name || !Number.isFinite(price) || price < 0) {
    redirect(`/admin/products/${encodeURIComponent(id)}?error=invalid`)
  }
  if (!INVENTORY_VALUES.has(inventoryStatus) || !CATEGORY_VALUES.has(category)) {
    redirect(`/admin/products/${encodeURIComponent(id)}?error=invalid`)
  }

  const db = await getRoom23Db()
  if (!db) redirect(`/admin/products/${encodeURIComponent(id)}?error=db`)

  await db.collection('products').updateOne(
    { id },
    {
      $set: {
        id,
        name,
        price,
        inventoryStatus,
        category,
        hidden,
        shortEditorial,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        isProductOfTheMonth: false,
        isFeatured: false,
      },
    },
    { upsert: true },
  )

  revalidateAdmin()
  revalidatePath(`/admin/products/${id}`)
  redirect(`/admin/products/${encodeURIComponent(id)}?saved=1`)
}

export async function setProductOfTheMonth(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') || '').trim()
  const product = await getAdminProduct(id)
  if (!product) redirect('/admin/products?error=missing')

  const db = await getRoom23Db()
  if (!db) redirect(`/admin/products/${encodeURIComponent(id)}?error=db`)

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
  redirect(`/admin/products/${encodeURIComponent(id)}?saved=1`)
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
  if (id) {
    revalidatePath(`/admin/products/${id}`)
    redirect(`/admin/products/${encodeURIComponent(id)}?saved=1`)
  }
  redirect('/admin/products?saved=1')
}

export async function updateOrder(formData: FormData) {
  await requireAdmin()

  const orderId = String(formData.get('orderId') || '').trim()
  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=missing')

  const status = String(formData.get('status') || '').trim()
  const notes = String(formData.get('notes') || '').trim().slice(0, 2000)

  if (!isOrderStatus(status)) {
    redirect(`/admin/orders/${encodeURIComponent(orderId)}?error=invalid`)
  }

  const db = await getRoom23Db()
  if (!db) redirect(`/admin/orders/${encodeURIComponent(orderId)}?error=db`)

  await db.collection('orders').updateOne(
    { orderId },
    {
      $set: {
        status,
        notes,
        fulfilled: status === 'fulfilled',
        updatedAt: new Date(),
      },
    },
  )

  revalidateAdmin()
  revalidatePath(`/admin/orders/${orderId}`)
  redirect(`/admin/orders/${encodeURIComponent(orderId)}?saved=1`)
}
