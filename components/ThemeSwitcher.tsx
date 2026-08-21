'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_PALETTE,
  resolvePaletteId,
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
    return resolvePaletteId(stored)
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

type ThemePalettePickerProps = {
  className?: string
}

export function ThemePalettePicker({ className = '' }: ThemePalettePickerProps) {
  const pathname = usePathname()
  const [palette, setPalette] = useState<PaletteId>(DEFAULT_PALETTE)

  function selectPalette(id: PaletteId) {
    applyPalette(id)
    setPalette(id)
    writeStoredPalette(id)
    try {
      window.dispatchEvent(new Event('room23-palette'))
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const initial = readStoredPalette()
    applyPalette(initial)
    setPalette(initial)

    const sync = () => setPalette(readStoredPalette())
    window.addEventListener('room23-palette', sync)
    return () => window.removeEventListener('room23-palette', sync)
  }, [])

  if (pathname?.startsWith('/admin')) return null

  return (
    <div className={`max-w-full ${className}`.trim()}>
      <p className="mb-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:mb-3 sm:tracking-[0.28em]">
        Palette
      </p>
      <div
        role="listbox"
        aria-label="Theme palette options"
        className="flex max-w-full flex-wrap items-center gap-y-1"
      >
        {THEME_PALETTES.map((item, index) => {
          const selected = palette === item.id
          return (
            <span key={item.id} className="inline-flex items-center">
              {index > 0 ? (
                <span
                  className="mx-1.5 select-none text-theme-muted/35 sm:mx-2"
                  aria-hidden="true"
                >
                  ·
                </span>
              ) : null}
              <button
                type="button"
                role="option"
                aria-label={item.label}
                aria-selected={selected}
                onClick={() => selectPalette(item.id)}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-none px-0.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 sm:tracking-[0.14em] ${
                  selected
                    ? 'text-theme-text'
                    : 'text-theme-muted hover:text-theme-text/80'
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.swatch,
                    outline: selected
                      ? '1px solid hsl(var(--foreground))'
                      : '1px solid hsl(var(--border))',
                    outlineOffset: selected ? '1px' : '0px',
                  }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default ThemePalettePicker
