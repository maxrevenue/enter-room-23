'use client'

import { useEffect, useState } from 'react'
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

export default function ThemeSwitcher() {
  const [palette, setPalette] = useState<PaletteId>(DEFAULT_PALETTE)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      const initial = isPaletteId(stored) ? stored : DEFAULT_PALETTE
      applyPalette(initial)
      setPalette(initial)
    } catch {
      applyPalette(DEFAULT_PALETTE)
    }
  }, [])

  function selectPalette(id: PaletteId) {
    applyPalette(id)
    setPalette(id)
    setOpen(false)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="pointer-events-auto fixed bottom-4 left-4 z-[10001] flex flex-col items-start gap-2"
      data-theme-switcher
    >
      {open ? (
        <div
          role="listbox"
          aria-label="Theme palette options"
          className="w-44 overflow-hidden rounded border border-theme-border bg-theme-surface shadow-lg"
        >
          <p className="border-b border-theme-border px-3 py-2 text-[9px] font-medium uppercase tracking-[0.2em] text-theme-muted">
            Palette test
          </p>
          {THEME_PALETTES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-selected={palette === item.id}
              onClick={() => selectPalette(item.id)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-theme-bg ${
                palette === item.id ? 'text-theme-text' : 'text-theme-muted'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-theme-border"
                style={{ backgroundColor: item.swatch }}
                aria-hidden="true"
              />
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded border border-dashed border-theme-border bg-theme-surface/95 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-theme-muted backdrop-blur-sm transition-colors hover:border-theme-accent hover:text-theme-text"
        title="Temporary theme palette switcher"
      >
        <span
          className="h-2.5 w-2.5 rounded-full border border-theme-border"
          style={{ backgroundColor: PALETTE_MAP[palette].swatch }}
          aria-hidden="true"
        />
        Theme
      </button>
    </div>
  )
}
