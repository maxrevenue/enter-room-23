export type PaletteId = 'charcoal' | 'blush' | 'olive' | 'bone'

export const THEME_STORAGE_KEY = 'room23-palette'
export const DEFAULT_PALETTE: PaletteId = 'charcoal'

export const PALETTE_IDS: PaletteId[] = ['charcoal', 'blush', 'olive', 'bone']

export type ThemePalette = {
  id: PaletteId
  label: string
  swatch: string
}

export const THEME_PALETTES: ThemePalette[] = [
  { id: 'charcoal', label: 'Charcoal', swatch: 'hsl(30 32% 55%)' },
  { id: 'blush', label: 'Blush', swatch: 'hsl(6 25% 72%)' },
  { id: 'olive', label: 'Olive', swatch: 'hsl(92 14% 55%)' },
  { id: 'bone', label: 'Bone', swatch: 'hsl(38 38% 61%)' },
]

export const PALETTE_MAP = Object.fromEntries(
  THEME_PALETTES.map((palette) => [palette.id, palette]),
) as Record<PaletteId, ThemePalette>

export function isPaletteId(value: string | null | undefined): value is PaletteId {
  return value != null && value in PALETTE_MAP
}

export const THEME_INIT_SCRIPT = `(function(){var k='${THEME_STORAGE_KEY}',v=['charcoal','blush','olive','bone'];try{var p=localStorage.getItem(k);document.documentElement.setAttribute('data-palette',v.indexOf(p)!==-1?p:'charcoal');}catch(e){document.documentElement.setAttribute('data-palette','charcoal');}})();`
