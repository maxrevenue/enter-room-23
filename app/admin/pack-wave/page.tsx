import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import { resolveAdminPassword } from '@/lib/admin-password.server'
import { formatOrderDate } from '@/lib/admin-orders'
import {
  aggregatePickList,
  buildWaveOrderSummaries,
  getAdminOrdersByIds,
  PACK_WAVE_LIMIT,
  parsePackWaveIds,
} from '@/lib/admin-pack-wave'
import { PackWavePrintButton } from './print-button'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pack wave',
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

export default async function AdminPackWavePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  if (!(await isAdminAuthenticated(await cookies(), await resolveAdminPassword()))) {
    redirect('/admin/login')
  }

  const params = await searchParams
  const requestedIds = parsePackWaveIds(params.ids)
  const orders = await getAdminOrdersByIds(requestedIds)
  const pickList = aggregatePickList(orders)
  const waveOrders = buildWaveOrderSummaries(orders)
  const generatedAt = new Date()
  const missingCount = requestedIds.length - orders.length

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pack-wave,
          #pack-wave * {
            visibility: visible;
          }
          #pack-wave {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin/orders?view=open"
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 hover:text-zinc-200"
        >
          ← Back to open orders
        </Link>
        <PackWavePrintButton />
      </div>

      {requestedIds.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400 print:hidden">
          Select up to {PACK_WAVE_LIMIT} open orders on the orders list and choose Pack wave.
        </p>
      ) : null}

      {requestedIds.length > 0 && orders.length === 0 ? (
        <p className="border border-zinc-800 bg-zinc-900 px-6 py-10 text-sm text-zinc-400 print:hidden">
          No matching orders were found for this pack wave.
        </p>
      ) : null}

      {orders.length > 0 ? (
        <article
          id="pack-wave"
          className="border border-zinc-800 bg-zinc-950 px-8 py-10 text-zinc-100 print:border-0 print:bg-white print:px-0 print:py-0 print:text-black"
        >
          <header className="border-b border-zinc-800 pb-6 print:border-black">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="font-serif text-2xl tracking-[0.28em] text-zinc-100 print:text-black">ROOM 23</p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500 print:text-black">
                  Pack wave pick list
                </p>
              </div>
              <dl className="text-right text-sm">
                <div>
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 print:text-black">
                    Orders
                  </dt>
                  <dd className="mt-1 font-medium text-zinc-100 print:text-black">{orders.length}</dd>
                </div>
                <div className="mt-3">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 print:text-black">
                    Generated
                  </dt>
                  <dd className="mt-1 text-zinc-300 print:text-black">{formatOrderDate(generatedAt)}</dd>
                </div>
                {missingCount > 0 ? (
                  <div className="mt-3 print:hidden">
                    <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      Missing
                    </dt>
                    <dd className="mt-1 text-zinc-400">{missingCount}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </header>

          <section className="mt-10">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 print:text-black">
              Combined pick list
            </h2>
            <table className="mt-4 w-full border-collapse text-left text-sm print:text-black">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.16em] text-zinc-500 print:border-black print:text-black">
                  <th className="py-2 pr-4 font-medium">Qty</th>
                  <th className="py-2 pr-4 font-medium">Item</th>
                  <th className="py-2 pr-4 font-medium">SKU / ID</th>
                  <th className="py-2 font-medium">Orders</th>
                </tr>
              </thead>
              <tbody>
                {pickList.length === 0 ? (
                  <tr>
                    <td className="py-4 text-zinc-500 print:text-black" colSpan={4}>
                      No line items across selected orders.
                    </td>
                  </tr>
                ) : (
                  pickList.map((line) => (
                    <tr
                      key={line.key}
                      className="border-b border-zinc-800 last:border-b-0 print:border-black"
                    >
                      <td className="py-3 pr-4 align-top text-lg font-medium text-zinc-100 print:text-black">
                        {line.totalQty}
                      </td>
                      <td className="py-3 pr-4 align-top text-zinc-100 print:text-black">{line.name}</td>
                      <td className="py-3 pr-4 align-top font-mono text-xs text-zinc-400 print:text-black">
                        {line.productId}
                      </td>
                      <td className="py-3 align-top text-zinc-300 print:text-black">{line.orderCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section className="mt-12">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500 print:text-black">
              Wave orders
            </h2>
            <table className="mt-4 w-full border-collapse text-left text-sm print:text-black">
              <thead>
                <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-[0.16em] text-zinc-500 print:border-black print:text-black">
                  <th className="py-2 pr-4 font-medium">Order</th>
                  <th className="py-2 pr-4 font-medium">Ship to</th>
                  <th className="py-2 pr-4 font-medium">Items</th>
                  <th className="py-2 font-medium print:hidden">Packing slip</th>
                </tr>
              </thead>
              <tbody>
                {waveOrders.map((entry) => (
                  <tr
                    key={entry.orderId}
                    className="border-b border-zinc-800 last:border-b-0 print:border-black"
                  >
                    <td className="py-3 pr-4 align-top font-medium text-zinc-100 print:text-black">
                      {entry.orderId}
                    </td>
                    <td className="py-3 pr-4 align-top text-zinc-200 print:text-black">{entry.shipToName}</td>
                    <td className="py-3 pr-4 align-top text-zinc-300 print:text-black">{entry.itemCount}</td>
                    <td className="py-3 align-top print:hidden">
                      <Link
                        href={entry.packingSlipHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
                      >
                        Packing slip
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <footer className="mt-12 border-t border-zinc-800 pt-6 text-[10px] uppercase tracking-[0.18em] text-zinc-600 print:border-black print:text-black">
            <p>Room 23 — internal pack wave</p>
          </footer>
        </article>
      ) : null}
    </>
  )
}
