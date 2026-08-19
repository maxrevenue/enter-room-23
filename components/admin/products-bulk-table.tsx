'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  archiveProduct,
  bulkUpdateProducts,
  clearProductOfTheMonth,
  setProductOfTheMonth,
  unarchiveProduct,
  updateQuantity,
} from '@/app/admin/actions'

const BULK_LIMIT = 50

const actionClass =
  'text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 hover:text-zinc-100'
const qtyInputClass =
  'w-16 border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100 outline-none focus:border-zinc-500'
const bulkBtnClass =
  'border border-zinc-700 bg-zinc-950 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600'
const selectClass =
  'border border-zinc-700 bg-zinc-950 px-2 py-2 text-[10px] uppercase tracking-[0.14em] text-zinc-300 outline-none focus:border-zinc-500'

export type ProductBulkRow = {
  id: string
  name: string
  priceLabel: string
  marginLabel: string
  quantity: number | null
  category: string
  statusLabel: string
  featured: boolean
  archived: boolean
  hiddenByZero: boolean
  low: boolean
  out: boolean
  lowStockNote: string
  imageUrl: string | null
}

type ProductsBulkTableProps = {
  products: ProductBulkRow[]
  categories: string[]
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

export function ProductsBulkTable({ products, categories }: ProductsBulkTableProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [capWarning, setCapWarning] = useState(false)
  const [category, setCategory] = useState(categories[0] || '')

  const selectedIds = useMemo(() => [...selected], [selected])
  const allPageIds = useMemo(() => products.map((product) => product.id), [products])
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

  function confirmArchive(event: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Archive selected products?')) event.preventDefault()
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

          <form action={bulkUpdateProducts} onSubmit={confirmArchive} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <input type="hidden" name="action" value="archive" />
            <BulkSubmitButton label="Archive" />
          </form>

          <form action={bulkUpdateProducts} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <input type="hidden" name="action" value="restore" />
            <BulkSubmitButton label="Restore" />
          </form>

          <form action={bulkUpdateProducts} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <input type="hidden" name="action" value="hideWhenZeroOn" />
            <BulkSubmitButton label="Hide when zero · on" />
          </form>

          <form action={bulkUpdateProducts} className="inline">
            <BulkIdsInput ids={selectedIds} />
            <input type="hidden" name="action" value="hideWhenZeroOff" />
            <BulkSubmitButton label="Hide when zero · off" />
          </form>

          <form action={bulkUpdateProducts} className="inline-flex items-center gap-2">
            <BulkIdsInput ids={selectedIds} />
            <input type="hidden" name="action" value="setCategory" />
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={selectClass}
              aria-label="Bulk category"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <BulkSubmitButton label="Set category" />
          </form>

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
        <table className="w-full min-w-[1020px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allCappedSelected}
                    disabled={products.length === 0}
                    onChange={(event) => toggleSelectAll(event.target.checked)}
                    aria-label="Select all products on this page"
                    className="h-3.5 w-3.5 accent-zinc-100"
                  />
                  <span className="sr-only">Select all</span>
                </label>
              </th>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Margin</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">POTM</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const checked = selected.has(product.id)
              const disabled = !checked && atCap

              return (
                <tr key={product.id} className="border-b border-zinc-800 last:border-b-0">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={(event) => toggleRow(product.id, event.target.checked)}
                      aria-label={`Select ${product.name}`}
                      className="h-3.5 w-3.5 accent-zinc-100 disabled:opacity-40"
                    />
                  </td>
                  <td className="px-4 py-4">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="h-10 w-10 border border-zinc-800 bg-zinc-900 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center border border-zinc-800 bg-zinc-900 text-[8px] uppercase tracking-[0.12em] text-zinc-600">
                        None
                      </div>
                    )}
                  </td>
                  <td
                    className={`px-4 py-4 ${product.archived || product.hiddenByZero ? 'text-zinc-500' : 'text-zinc-100'}`}
                  >
                    {product.name}
                  </td>
                  <td className="px-4 py-4 text-zinc-300">{product.priceLabel}</td>
                  <td className="px-4 py-4 text-zinc-400">{product.marginLabel}</td>
                  <td className="px-4 py-4">
                    <form action={updateQuantity} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="from" value="list" />
                      <input
                        className={qtyInputClass}
                        name="quantity"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={product.quantity ?? ''}
                        aria-label={`Quantity for ${product.name}`}
                      />
                      <button type="submit" className={actionClass}>
                        Save
                      </button>
                    </form>
                    {product.out ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">Out of stock</p>
                    ) : product.low ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                        {product.lowStockNote}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 text-zinc-400">{product.category}</td>
                  <td className="px-4 py-4 text-zinc-400">{product.statusLabel}</td>
                  <td className="px-4 py-4 text-zinc-400">{product.featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link href={`/admin/products/${encodeURIComponent(product.id)}`} className={actionClass}>
                        Edit
                      </Link>
                      {product.featured ? (
                        <form action={clearProductOfTheMonth}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Clear month
                          </button>
                        </form>
                      ) : product.archived ? null : (
                        <form action={setProductOfTheMonth}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Set month
                          </button>
                        </form>
                      )}
                      {product.archived ? (
                        <form action={unarchiveProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Restore
                          </button>
                        </form>
                      ) : (
                        <form action={archiveProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <input type="hidden" name="from" value="list" />
                          <button type="submit" className={actionClass}>
                            Archive
                          </button>
                        </form>
                      )}
                    </div>
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
