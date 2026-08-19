'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { bulkUpdateOrders } from '@/app/admin/actions'
import { adminCustomerHref } from '@/lib/admin-customers'
import { buildPackWaveHref } from '@/lib/admin-pack-wave'
import type { OrderViewId } from '@/lib/admin-views'

const BULK_LIMIT = 50

const bulkBtnClass =
  'border border-zinc-700 bg-zinc-950 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600'

export type OrderBulkRow = {
  orderId: string
  email: string
  dateLabel: string
  ageLabel: string
  ageClass: string
  itemCount: number
  totalLabel: string
  statusLabel: string
  statusBadgeClass: string
  fulfilledLabel: string
  flags: Array<{ id: string; label: string; chipClass: string }>
}

type OrdersBulkTableProps = {
  orders: OrderBulkRow[]
  view: OrderViewId
  q: string
  showPackWave?: boolean
}

function BulkSubmitButton({
  label,
  pendingLabel = 'Working…',
  className = bulkBtnClass,
  disabled = false,
}: {
  label: string
  pendingLabel?: string
  className?: string
  disabled?: boolean
}) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={disabled || pending} aria-busy={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  )
}

function BulkIdsInput({ ids }: { ids: string[] }) {
  return <input type="hidden" name="ids" value={JSON.stringify(ids)} readOnly />
}

function ListContextInputs({ view, q }: { view: OrderViewId; q: string }) {
  return (
    <>
      {view !== 'all' ? <input type="hidden" name="view" value={view} /> : null}
      {q ? <input type="hidden" name="q" value={q} /> : null}
    </>
  )
}

export function OrdersBulkTable({ orders, view, q, showPackWave = false }: OrdersBulkTableProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [capWarning, setCapWarning] = useState(false)

  const selectedIds = useMemo(() => [...selected], [selected])
  const allPageIds = useMemo(() => orders.map((order) => order.orderId), [orders])
  const cappedPageIds = useMemo(() => allPageIds.slice(0, BULK_LIMIT), [allPageIds])
  const allCappedSelected =
    cappedPageIds.length > 0 && cappedPageIds.every((id) => selected.has(id))
  const atCap = selected.size >= BULK_LIMIT

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) {
        if (next.size >= BULK_LIMIT) {
          setCapWarning(true)
          return prev
        }
        next.add(id)
      } else {
        next.delete(id)
      }
      if (next.size < BULK_LIMIT) setCapWarning(false)
      return next
    })
  }

  function toggleSelectAll(checked: boolean) {
    if (checked) {
      setSelected(new Set(cappedPageIds))
      setCapWarning(allPageIds.length > BULK_LIMIT)
      return
    }
    setSelected(new Set())
    setCapWarning(false)
  }

  function confirmFulfill(event: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Mark selected orders as fulfilled? Inventory will decrement where applicable.')) {
      event.preventDefault()
    }
  }

  return (
    <>
      {selected.size > 0 ? (
        <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 border border-zinc-700 bg-zinc-900 px-4 py-3">
          <span className="text-sm text-zinc-300">
            {selected.size} selected{atCap ? ` · max ${BULK_LIMIT}` : ''}
          </span>
          {capWarning ? (
            <span className="text-xs text-zinc-500">Bulk actions are limited to {BULK_LIMIT} items.</span>
          ) : null}

          <form action={bulkUpdateOrders} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <ListContextInputs view={view} q={q} />
            <input type="hidden" name="action" value="reviewed" />
            <BulkSubmitButton label="Mark reviewed" />
          </form>

          <form action={bulkUpdateOrders} onSubmit={confirmFulfill} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <ListContextInputs view={view} q={q} />
            <input type="hidden" name="action" value="fulfilled" />
            <BulkSubmitButton label="Set fulfilled" />
          </form>

          {showPackWave ? (
            <Link href={buildPackWaveHref(selectedIds)} className={bulkBtnClass}>
              Pack wave
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setSelected(new Set())
              setCapWarning(false)
            }}
            className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-100"
          >
            Clear
          </button>
        </div>
      ) : null}

      <div className="overflow-x-auto border border-zinc-800">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allCappedSelected}
                    disabled={orders.length === 0}
                    onChange={(event) => toggleSelectAll(event.target.checked)}
                    aria-label="Select all orders on this page"
                    className="h-3.5 w-3.5 accent-zinc-100"
                  />
                  <span className="sr-only">Select all</span>
                </label>
              </th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Age</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium">Fulfilled</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const checked = selected.has(order.orderId)
              const disabled = !checked && atCap

              return (
                <tr key={order.orderId} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(event) => toggleRow(order.orderId, event.target.checked)}
                      aria-label={`Select order ${order.orderId}`}
                      className="h-3.5 w-3.5 accent-zinc-100 disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-zinc-100">{order.orderId}</td>
                  <td className="px-4 py-4 text-zinc-400">
                    {order.email ? (
                      <Link href={adminCustomerHref(order.email)} className="hover:text-zinc-100">
                        {order.email}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-500">{order.dateLabel}</td>
                  <td className={`px-4 py-4 tabular-nums ${order.ageClass}`}>{order.ageLabel}</td>
                  <td className="px-4 py-4 text-zinc-300">{order.itemCount}</td>
                  <td className="px-4 py-4 text-zinc-300">{order.totalLabel}</td>
                  <td className="px-4 py-4">
                    <span className={order.statusBadgeClass}>{order.statusLabel}</span>
                  </td>
                  <td className="px-4 py-4">
                    {order.flags.length ? (
                      <div className="flex max-w-[220px] flex-wrap gap-1.5">
                        {order.flags.map((flag) => (
                          <span key={flag.id} className={flag.chipClass}>
                            {flag.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{order.fulfilledLabel}</td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/orders/${encodeURIComponent(order.orderId)}`}
                      className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 hover:text-zinc-100"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
