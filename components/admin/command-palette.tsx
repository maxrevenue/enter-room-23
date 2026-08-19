'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { searchAdmin } from '@/app/admin/actions'
import type { AdminSearchResult, AdminSearchResultType } from '@/lib/admin-search'

const DEBOUNCE_MS = 300

const GROUP_LABELS: Record<AdminSearchResultType, string> = {
  order: 'Orders',
  product: 'Products',
  customer: 'Customers',
  coupon: 'Coupons',
}

const GROUP_ORDER: AdminSearchResultType[] = ['order', 'product', 'customer', 'coupon']

function groupResults(results: AdminSearchResult[]) {
  const grouped = new Map<AdminSearchResultType, AdminSearchResult[]>()
  for (const type of GROUP_ORDER) grouped.set(type, [])
  for (const result of results) {
    grouped.get(result.type)?.push(result)
  }
  return GROUP_ORDER.map((type) => ({
    type,
    label: GROUP_LABELS[type],
    items: grouped.get(type) || [],
  })).filter((group) => group.items.length > 0)
}

type AdminCommandPaletteProps = {
  showTrigger?: boolean
}

export function AdminCommandPalette({ showTrigger = true }: AdminCommandPaletteProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AdminSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const requestIdRef = useRef(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetPalette = useCallback(() => {
    setQuery('')
    setResults([])
    setLoading(false)
    setSearched(false)
    requestIdRef.current += 1
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
  }, [])

  const closePalette = useCallback(() => {
    setOpen(false)
    resetPalette()
  }, [resetPalette])

  const runSearch = useCallback(async (value: string) => {
    const needle = value.trim()
    if (needle.length < 2) {
      setResults([])
      setLoading(false)
      setSearched(false)
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setLoading(true)
    setSearched(true)

    try {
      const response = await searchAdmin(needle)
      if (requestIdRef.current !== requestId) return
      setResults(response.ok ? response.results : [])
    } catch {
      if (requestIdRef.current !== requestId) return
      setResults([])
    } finally {
      if (requestIdRef.current === requestId) setLoading(false)
    }
  }, [])

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)

      const needle = value.trim()
      if (needle.length < 2) {
        setResults([])
        setLoading(false)
        setSearched(false)
        return
      }

      setLoading(true)
      debounceRef.current = setTimeout(() => {
        void runSearch(value)
      }, DEBOUNCE_MS)
    },
    [runSearch],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const groups = useMemo(() => groupResults(results), [results])
  const trimmedQuery = query.trim()
  const showEmptyHint = trimmedQuery.length > 0 && trimmedQuery.length < 2
  const showNoResults = searched && !loading && trimmedQuery.length >= 2 && results.length === 0

  function handleSelect(href: string) {
    closePalette()
    router.push(href)
  }

  return (
    <>
      {showTrigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-zinc-800 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-100"
        >
          Search
          <span className="ml-2 hidden text-zinc-600 sm:inline">⌘K</span>
        </button>
      ) : null}

      <Dialog.Root
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setOpen(true)
            return
          }
          closePalette()
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-[1px]" />
          <Dialog.Content
            className="fixed left-1/2 top-[12vh] z-[301] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl outline-none"
            onEscapeKeyDown={() => closePalette()}
          >
            <Dialog.Title className="sr-only">Admin search</Dialog.Title>
            <Command
              shouldFilter={false}
              loop
              className="flex max-h-[min(70vh,560px)] flex-col"
            >
              <div className="border-b border-zinc-800 px-4 py-3">
                <Command.Input
                  value={query}
                  onValueChange={handleQueryChange}
                  placeholder="Search orders, products, customers, coupons…"
                  autoFocus
                  className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                />
              </div>

              <Command.List className="max-h-[min(58vh,480px)] overflow-y-auto px-2 py-3">
                {loading ? (
                  <div className="px-3 py-8 text-center text-sm text-zinc-500">Searching…</div>
                ) : null}

                {!loading && !trimmedQuery ? (
                  <div className="px-3 py-8 text-center text-sm text-zinc-500">
                    Type at least 2 characters to search.
                  </div>
                ) : null}

                {showEmptyHint ? (
                  <div className="px-3 py-8 text-center text-sm text-zinc-500">
                    Keep typing — minimum 2 characters.
                  </div>
                ) : null}

                {showNoResults ? (
                  <Command.Empty className="px-3 py-8 text-center text-sm text-zinc-500">
                    No results for &ldquo;{trimmedQuery}&rdquo;.
                  </Command.Empty>
                ) : null}

                {!loading
                  ? groups.map((group) => (
                      <Command.Group
                        key={group.type}
                        heading={group.label}
                        className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-zinc-500"
                      >
                        {group.items.map((item) => (
                          <Command.Item
                            key={`${item.type}:${item.id}`}
                            value={`${item.type}:${item.id}:${item.title}:${item.subtitle}`}
                            onSelect={() => handleSelect(item.href)}
                            className="cursor-pointer rounded-none px-3 py-3 text-left outline-none aria-selected:bg-zinc-900"
                          >
                            <p className="text-sm text-zinc-100">{item.title}</p>
                            {item.subtitle ? (
                              <p className="mt-1 text-xs text-zinc-500">{item.subtitle}</p>
                            ) : null}
                          </Command.Item>
                        ))}
                      </Command.Group>
                    ))
                  : null}
              </Command.List>

              <div className="border-t border-zinc-800 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                <span>Navigate</span>
                <span className="mx-2">·</span>
                <span>Esc to close</span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
