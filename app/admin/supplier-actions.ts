'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { getRoom23Db } from '@/lib/admin-db'
import { getAdminOrder } from '@/lib/admin-orders'
import { safeInsertOrderEvent } from '@/lib/admin-order-events'
import { writeAdminAudit } from '@/lib/admin-audit'
import { getAdminProduct } from '@/lib/admin-catalog'
import {
  assertCanSubmitSupplierOrder,
  checkSupplierInventory,
  fetchSupplierTracking,
  formatSupplierInventorySummary,
  getSupplierSubmissions,
  isDropshipProduct,
  orderDropshipGroups,
  submitSupplierOrderForVendor,
  supplierErrorMessage,
  supplierVendorLabel,
  type SupplierSubmission,
} from '@/lib/admin-suppliers'

async function requireAdmin() {
  const ok = await isAdminAuthenticated(await cookies(), await resolveAdminPassword())
  if (!ok) redirect('/admin/login')
}

function revalidateSupplierPaths(orderId?: string) {
  revalidatePath('/admin/suppliers')
  revalidatePath('/admin/orders')
  if (orderId) {
    revalidatePath(`/admin/orders/${encodeURIComponent(orderId)}`)
  }
}

function orderRedirect(orderId: string, query: Record<string, string>) {
  const params = new URLSearchParams(query)
  redirect(`/admin/orders/${encodeURIComponent(orderId)}?${params.toString()}`)
}

function productRedirect(productId: string, query: Record<string, string>) {
  const params = new URLSearchParams(query)
  redirect(`/admin/products/${encodeURIComponent(productId)}?${params.toString()}`)
}

function parseOrderId(formData: FormData) {
  return String(formData.get('orderId') || '').trim()
}

function parseProductId(formData: FormData) {
  return String(formData.get('productId') || '').trim()
}

export async function checkSupplierStock(formData: FormData) {
  await requireAdmin()

  const productId = parseProductId(formData)
  if (!productId) redirect('/admin/products?error=invalid')

  const product = await getAdminProduct(productId)
  if (!product) redirect('/admin/products?error=invalid')

  if (!isDropshipProduct(product)) {
    productRedirect(productId, { supplier: 'error', supplierMsg: 'Product is not configured for dropship.' })
  }

  const vendor = String(product.vendorType || '').trim()
  const sku = String(product.supplierSku || product.id || '').trim()
  if (!vendor || !sku) {
    productRedirect(productId, { supplier: 'error', supplierMsg: 'Missing vendor or supplier SKU.' })
  }

  try {
    const { rows, mock } = await checkSupplierInventory(vendor, [sku])
    const summary = formatSupplierInventorySummary(rows)
    await writeAdminAudit({
      action: 'supplier_inventory_checked',
      entityType: 'product',
      entityId: productId,
      message: `${supplierVendorLabel(vendor)} · ${summary}${mock ? ' · mock' : ''}`,
    })
    productRedirect(productId, {
      supplier: 'stock',
      supplierMsg: `${mock ? 'Mock supplier · ' : ''}${summary}`,
    })
  } catch (error) {
    productRedirect(productId, {
      supplier: 'error',
      supplierMsg: supplierErrorMessage(error),
    })
  }
}

export async function submitOrderToSupplier(formData: FormData) {
  await requireAdmin()

  const orderId = parseOrderId(formData)
  if (!orderId) redirect('/admin/orders?error=invalid')

  const db = await getRoom23Db()
  if (!db) orderRedirect(orderId, { supplier: 'error', supplierMsg: 'MongoDB is not available.' })

  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=invalid')

  try {
    assertCanSubmitSupplierOrder(order)
  } catch (error) {
    orderRedirect(orderId, { supplier: 'error', supplierMsg: supplierErrorMessage(error) })
  }

  const existing = getSupplierSubmissions(order)
  const groups = orderDropshipGroups(order)

  if (!groups.length) {
    orderRedirect(orderId, {
      supplier: 'error',
      supplierMsg: 'This order has no dropship line items.',
    })
  }

  const now = new Date()
  const nextSubmissions: SupplierSubmission[] = [...existing]

  try {
    for (const group of groups) {
      const result = await submitSupplierOrderForVendor(order, group.vendor, group.items)
      nextSubmissions.push({
        vendor: result.vendor,
        supplierOrderId: result.supplierOrderId,
        supplierStatus: result.status,
        submittedAt: now.toISOString(),
        mock: result.mock,
      })
    }

    const primary = nextSubmissions[0]
    const $set: Record<string, unknown> = {
      updatedAt: now,
      'fulfillment.supplierSubmissions': nextSubmissions,
      'fulfillment.supplierError': '',
    }

    if (primary) {
      $set['fulfillment.supplierOrderId'] = primary.supplierOrderId
      $set['fulfillment.supplierStatus'] = primary.supplierStatus
      $set['fulfillment.submittedAt'] = now
      $set['fulfillment.vendor'] = primary.vendor
    }

    await db.collection('orders').updateOne({ orderId }, { $set, $unset: { 'fulfillment.supplierErrorAt': '' } })

    await safeInsertOrderEvent({
      orderId,
      type: 'supplier_submitted',
      message: `Submitted ${groups.length} dropship group(s) to supplier`,
      actor: 'admin',
      meta: {
        vendors: nextSubmissions.map((row) => row.vendor),
        supplierOrderIds: nextSubmissions.map((row) => row.supplierOrderId),
      },
    })

    await writeAdminAudit({
      action: 'supplier_submitted',
      entityType: 'order',
      entityId: orderId,
      message: nextSubmissions.map((row) => `${row.vendor}:${row.supplierOrderId}`).join(', '),
    })

    revalidateSupplierPaths(orderId)
    orderRedirect(orderId, { supplier: 'submitted', supplierMsg: 'Supplier order submitted.' })
  } catch (error) {
    const message = supplierErrorMessage(error)
    await db.collection('orders').updateOne(
      { orderId },
      {
        $set: {
          updatedAt: now,
          'fulfillment.supplierError': message,
          'fulfillment.supplierErrorAt': now,
        },
      },
    )

    await safeInsertOrderEvent({
      orderId,
      type: 'supplier_failed',
      message,
      actor: 'admin',
    })

    revalidateSupplierPaths(orderId)
    orderRedirect(orderId, { supplier: 'error', supplierMsg: message })
  }
}

export async function refreshSupplierTracking(formData: FormData) {
  await requireAdmin()

  const orderId = parseOrderId(formData)
  if (!orderId) redirect('/admin/orders?error=invalid')

  const db = await getRoom23Db()
  if (!db) orderRedirect(orderId, { supplier: 'error', supplierMsg: 'MongoDB is not available.' })

  const order = await getAdminOrder(orderId)
  if (!order) redirect('/admin/orders?error=invalid')

  const submissions = getSupplierSubmissions(order)
  if (!submissions.length) {
    orderRedirect(orderId, {
      supplier: 'error',
      supplierMsg: 'No supplier submission exists for this order yet.',
    })
  }

  const now = new Date()

  try {
    const updatedSubmissions: SupplierSubmission[] = []

    for (const submission of submissions) {
      const tracking = await fetchSupplierTracking(submission.vendor, submission.supplierOrderId)
      updatedSubmissions.push({
        ...submission,
        carrier: tracking.carrier,
        trackingNumber: tracking.trackingNumber,
        trackingStatus: tracking.status,
        trackingUpdatedAt: now.toISOString(),
      })
    }

    const primary = updatedSubmissions[0]
    const $set: Record<string, unknown> = {
      updatedAt: now,
      'fulfillment.supplierSubmissions': updatedSubmissions,
      'fulfillment.supplierError': '',
    }

    if (primary) {
      $set['fulfillment.carrier'] = primary.carrier
      $set['fulfillment.trackingNumber'] = primary.trackingNumber
      $set['fulfillment.trackingStatus'] = primary.trackingStatus
      $set['fulfillment.trackingUpdatedAt'] = now
    }

    await db.collection('orders').updateOne({ orderId }, { $set, $unset: { 'fulfillment.supplierErrorAt': '' } })

    await safeInsertOrderEvent({
      orderId,
      type: 'supplier_tracking',
      message: `Tracking refreshed · ${primary?.carrier || 'Carrier'} ${primary?.trackingNumber || ''}`.trim(),
      actor: 'admin',
      meta: {
        trackingNumber: primary?.trackingNumber,
        trackingStatus: primary?.trackingStatus,
      },
    })

    await writeAdminAudit({
      action: 'supplier_tracking',
      entityType: 'order',
      entityId: orderId,
      message: `${primary?.carrier || 'Carrier'} ${primary?.trackingNumber || ''}`.trim(),
    })

    revalidateSupplierPaths(orderId)
    orderRedirect(orderId, { supplier: 'tracking', supplierMsg: 'Tracking refreshed.' })
  } catch (error) {
    const message = supplierErrorMessage(error)
    await db.collection('orders').updateOne(
      { orderId },
      {
        $set: {
          updatedAt: now,
          'fulfillment.supplierError': message,
          'fulfillment.supplierErrorAt': now,
        },
      },
    )

    await safeInsertOrderEvent({
      orderId,
      type: 'supplier_failed',
      message,
      actor: 'admin',
    })

    revalidateSupplierPaths(orderId)
    orderRedirect(orderId, { supplier: 'error', supplierMsg: message })
  }
}
