import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { siteConfig } from '@/lib/config'
import {
  formatOrderDate,
  formatOrderMoney,
  getAdminOrder,
  orderStatusLabel,
} from '@/lib/admin-orders'
import { PackingSlipPrintButton } from './print-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Packing slip',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default async function AdminOrderPackingSlipPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const { id } = await params
  const order = await getAdminOrder(decodeURIComponent(id))
  if (!order) notFound()

  const address = order.shippingAddress
  const items = Array.isArray(order.items) ? order.items : []
  const cityLine = [address?.city, address?.state, address?.postalCode].filter(Boolean).join(', ')
  const billingDescriptor = siteConfig.billingDescriptor || 'ROOM23 WELLNESS'

  return (
    <>
      {/*
        Print isolation: admin layout chrome remains in the DOM. For clean slips, add
        print:hidden to nav/header in app/admin/layout.tsx, or keep the scoped print
        rules below so only #packing-slip renders on paper.
      */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #packing-slip,
          #packing-slip * {
            visibility: visible;
          }
          #packing-slip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-200"
        >
          ← Back to order
        </Link>
        <PackingSlipPrintButton />
      </div>

      <article
        id="packing-slip"
        className="border border-zinc-800 bg-zinc-950 px-8 py-10 text-zinc-100 print:border-0 print:bg-white print:px-0 print:py-0 print:text-black"
      >
        <header className="border-b border-zinc-800 pb-6 print:border-black">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="font-serif text-2xl tracking-[0.28em] text-zinc-100 print:text-black">ROOM 23</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500 print:text-black">
                Internal packing slip
              </p>
            </div>
            <dl className="text-right text-sm">
              <div>
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 print:text-black">
                  Order
                </dt>
                <dd className="mt-1 font-medium text-zinc-100 print:text-black">{order.orderId}</dd>
              </div>
              <div className="mt-3">
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 print:text-black">
                  Date
                </dt>
                <dd className="mt-1 text-zinc-300 print:text-black">{formatOrderDate(order.createdAt)}</dd>
              </div>
              <div className="mt-3">
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 print:text-black">
                  Status
                </dt>
                <dd className="mt-1 text-zinc-300 print:text-black">{orderStatusLabel(order.status)}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 print:text-black">
              Ship to
            </h2>
            <address className="mt-3 not-italic text-sm leading-relaxed text-zinc-200 print:text-black">
              {address?.name || '—'}
              {address?.line1 ? (
                <>
                  <br />
                  {address.line1}
                </>
              ) : null}
              {address?.line2 ? (
                <>
                  <br />
                  {address.line2}
                </>
              ) : null}
              {cityLine ? (
                <>
                  <br />
                  {cityLine}
                </>
              ) : null}
              {address?.country ? (
                <>
                  <br />
                  {address.country}
                </>
              ) : null}
              {address?.phone ? (
                <>
                  <br />
                  {address.phone}
                </>
              ) : null}
            </address>
          </div>
          {order.email ? (
            <div>
              <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 print:text-black">
                Email
              </h2>
              <p className="mt-3 text-xs text-zinc-400 print:text-black">{order.email}</p>
            </div>
          ) : null}
        </section>

        <section className="mt-10">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 print:text-black">
            Pick list
          </h2>
          <table className="mt-4 w-full border-collapse text-left text-sm print:text-black">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.16em] text-zinc-500 print:border-black print:text-black">
                <th className="py-2 pr-4 font-medium">Qty</th>
                <th className="py-2 pr-4 font-medium">Item</th>
                <th className="py-2 font-medium">SKU / ID</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="py-4 text-zinc-500 print:text-black" colSpan={3}>
                    No line items.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const qty = Math.max(1, Math.floor(Number(item.qty) || 1))
                  const name = String(item.name || item.id || 'Item').trim() || 'Item'
                  const sku = String(item.id || '').trim() || '—'
                  return (
                    <tr
                      key={`${sku}:${index}`}
                      className="border-b border-zinc-800 last:border-b-0 print:border-black"
                    >
                      <td className="py-3 pr-4 align-top text-lg font-medium text-zinc-100 print:text-black">
                        {qty}
                      </td>
                      <td className="py-3 pr-4 align-top text-zinc-100 print:text-black">{name}</td>
                      <td className="py-3 align-top font-mono text-xs text-zinc-400 print:text-black">{sku}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </section>

        <section className="mt-10 max-w-sm border-t border-zinc-800 pt-6 print:border-black">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 print:text-black">Subtotal</dt>
              <dd className="text-zinc-200 print:text-black">{formatOrderMoney(order.totals?.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-500 print:text-black">Shipping</dt>
              <dd className="text-zinc-200 print:text-black">{formatOrderMoney(order.totals?.shipping)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-zinc-800 pt-2 print:border-black">
              <dt className="font-medium text-zinc-300 print:text-black">Total</dt>
              <dd className="font-medium text-zinc-100 print:text-black">{formatOrderMoney(order.totals?.total)}</dd>
            </div>
          </dl>
        </section>

        <footer className="mt-12 border-t border-zinc-800 pt-6 text-[10px] uppercase tracking-[0.18em] text-zinc-600 print:border-black print:text-black">
          <p>Room 23 — internal packing slip</p>
          <p className="mt-2 normal-case tracking-normal text-zinc-500 print:text-black">
            Card descriptor: {billingDescriptor}
          </p>
        </footer>
      </article>
    </>
  )
}
