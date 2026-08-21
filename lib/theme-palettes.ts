export type PaletteId = 'charcoal' | 'obsidian' | 'ivory-night' | 'slate' | 'noir-rose'

export const THEME_STORAGE_KEY = 'room23-palette'
export const DEFAULT_PALETTE: PaletteId = 'charcoal'

export const PALETTE_IDS: PaletteId[] = [
  'charcoal',
  'obsidian',
  'ivory-night',
  'slate',
  'noir-rose',
]

/** Retired palette IDs — mapped to charcoal on read. */
export const LEGACY_PALETTE_IDS = ['blush', 'olive', 'bone'] as const

export type ThemePalette = {
  id: PaletteId
  label: string
  swatch: string
}

export const THEME_PALETTES: ThemePalette[] = [
  { id: 'charcoal', label: 'Charcoal', swatch: 'hsl(30 32% 55%)' },
  { id: 'obsidian', label: 'Obsidian', swatch: 'hsl(215 8% 52%)' },
  { id: 'ivory-night', label: 'Ivory Night', swatch: 'hsl(38 25% 52%)' },
  { id: 'slate', label: 'Slate', swatch: 'hsl(210 12% 48%)' },
  { id: 'noir-rose', label: 'Noir Rose', swatch: 'hsl(12 22% 52%)' },
]

export const PALETTE_MAP = Object.fromEntries(
  THEME_PALETTES.map((palette) => [palette.id, palette]),
) as Record<PaletteId, ThemePalette>

export function isPaletteId(value: string | null | undefined): value is PaletteId {
  return value != null && value in PALETTE_MAP
}

export function resolvePaletteId(value: string | null | undefined): PaletteId {
  if (isPaletteId(value)) return value
  if (value != null && (LEGACY_PALETTE_IDS as readonly string[]).includes(value)) {
    return DEFAULT_PALETTE
  }
  return DEFAULT_PALETTE
}

export const THEME_INIT_SCRIPT = `(function(){var k='${THEME_STORAGE_KEY}',v=['charcoal','obsidian','ivory-night','slate','noir-rose'],legacy={'blush':1,'olive':1,'bone':1};try{var p=localStorage.getItem(k);if(p&&legacy[p])p='charcoal';document.documentElement.setAttribute('data-palette',v.indexOf(p)!==-1?p:'charcoal');}catch(e){document.documentElement.setAttribute('data-palette','charcoal');}})();`
