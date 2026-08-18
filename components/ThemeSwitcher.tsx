'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_PALETTE,
  isPaletteId,
  PALETTE_MAP,
  THEME_PALETTES,
  THEME_STORAGE_KEY,
  type PaletteId,
} from '@/lib/theme-palettes'

function applyPalette(id: PaletteId) {
  document.documentElement.setAttribute('data-palette', id)
}

function readStoredPalette(): PaletteId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isPaletteId(stored) ? stored : DEFAULT_PALETTE
  } catch {
    return DEFAULT_PALETTE
  }
}

function writeStoredPalette(id: PaletteId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    /* ignore quota / privacy mode */
  }
}

export default function ThemeSwitcher() {
  const pathname = usePathname()
  const [palette, setPalette] = useState<PaletteId>(DEFAULT_PALETTE)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const initial = readStoredPalette()
    applyPalette(initial)
    setPalette(initial)
  }, [])

  function selectPalette(id: PaletteId) {
    applyPalette(id)
    setPalette(id)
    writeStoredPalette(id)
    setOpen(false)
  }

  if (pathname?.startsWith('/admin')) return null

  return (
    <div
      className="pointer-events-auto fixed bottom-4 left-4 z-[10001] flex flex-col items-start gap-2"
      data-palette-switcher
    >
      {open ? (
        <div
          role="listbox"
          aria-label="Theme palette options"
          className="w-44 overflow-hidden rounded-md"
          style={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
          }}
        >
          <p
            className="px-3 py-2 text-[9px] font-medium uppercase tracking-[0.2em]"
            style={{
              color: 'hsl(var(--muted-foreground))',
              borderBottom: '1px solid hsl(var(--border))',
            }}
          >
            Palette
          </p>
          {THEME_PALETTES.map((item) => {
            const selected = palette === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => selectPalette(item.id)}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs"
                style={{
                  color: selected
                    ? 'hsl(var(--foreground))'
                    : 'hsl(var(--muted-foreground))',
                }}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.swatch,
                    border: '1px solid hsl(var(--border))',
                  }}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{
          backgroundColor: 'hsl(var(--card) / 0.95)',
          border: '1px dashed hsl(var(--border))',
          color: 'hsl(var(--muted-foreground))',
        }}
        title="Development palette switcher"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: PALETTE_MAP[palette].swatch,
            border: '1px solid hsl(var(--border))',
          }}
          aria-hidden="true"
        />
        Theme
      </button>
    </div>
  )
}
