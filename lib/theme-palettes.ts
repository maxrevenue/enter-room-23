export type PaletteId = 'charcoal' | 'blush' | 'olive' | 'bone'

export const THEME_STORAGE_KEY = 'room23-theme-palette'
export const DEFAULT_PALETTE: PaletteId = 'charcoal'

export type ThemePalette = {
  id: PaletteId
  label: string
  swatch: string
  vars: {
    bg: string
    surface: string
    text: string
    muted: string
    accent: string
    border: string
  }
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'charcoal',
    label: 'Charcoal',
    swatch: '#B08D6A',
    vars: {
      bg: '#0C0C0C',
      surface: '#1A1A1A',
      text: '#F5F2EB',
      muted: '#A8A29E',
      accent: '#B08D6A',
      border: '#2A2A2A',
    },
  },
  {
    id: 'blush',
    label: 'Blush',
    swatch: '#C9A9A6',
    vars: {
      bg: '#0F0F12',
      surface: '#1C1A1D',
      text: '#F7F3F1',
      muted: '#B0A8A6',
      accent: '#C9A9A6',
      border: '#2C292B',
    },
  },
  {
    id: 'olive',
    label: 'Olive',
    swatch: '#8B9A7D',
    vars: {
      bg: '#121212',
      surface: '#1A1C19',
      text: '#F4F1EA',
      muted: '#A3A899',
      accent: '#8B9A7D',
      border: '#2A2C28',
    },
  },
  {
    id: 'bone',
    label: 'Bone',
    swatch: '#C4A574',
    vars: {
      bg: '#0A0A0A',
      surface: '#161616',
      text: '#F8F5F0',
      muted: '#A8A29E',
      accent: '#C4A574',
      border: '#2A2A2A',
    },
  },
]

export const PALETTE_MAP = Object.fromEntries(
  THEME_PALETTES.map((palette) => [palette.id, palette]),
) as Record<PaletteId, ThemePalette>

export function isPaletteId(value: string | null | undefined): value is PaletteId {
  return value != null && value in PALETTE_MAP
}
