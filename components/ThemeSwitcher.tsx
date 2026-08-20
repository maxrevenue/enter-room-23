'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  DEFAULT_PALETTE,
  isPaletteId,
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
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-theme-muted sm:tracking-[0.28em]">
        Palette
      </p>
      <div role="listbox" aria-label="Theme palette options" className="flex items-center gap-1.5">
        {THEME_PALETTES.map((item) => {
          const selected = palette === item.id
          return (
            <button
              key={item.id}
              type="button"
              role="option"
              aria-label={item.label}
              aria-selected={selected}
              onClick={() => selectPalette(item.id)}
              className="inline-flex h-11 w-11 items-center justify-center"
              title={item.label}
            >
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{
                  backgroundColor: item.swatch,
                  outline: selected
                    ? '1px solid hsl(var(--foreground))'
                    : '1px solid hsl(var(--border))',
                  outlineOffset: selected ? '2px' : '0px',
                }}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemePalettePicker
