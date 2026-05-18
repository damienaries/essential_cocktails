import type { DrinkIngredient } from '../types/drink'

/**
 * True when the cell is only a volume amount (stored as number for oz/cl).
 * Allows integers, `1.5`, `.5`, `.75`, and `1.` while the user is typing.
 */
export function isPlainNumericQuantityString(raw: string): boolean {
  const t = raw.trim()
  return (
    t !== '' &&
    /^(?:\d+\.\d*|\.\d+|\d+)$/.test(t)
  )
}

/**
 * Values like `1.5` → number for conversion; `1 dash`, `top` → string as-is.
 */
export function parseQuantityForStorage(trimmed: string): number | string {
  const t = trimmed.trim()
  if (isPlainNumericQuantityString(t)) return Number.parseFloat(t)
  return t
}

export function ingredientQuantityToFormString(
  q: DrinkIngredient['quantity'],
): string {
  if (q == null) return ''
  return typeof q === 'number' ? String(q) : q
}

/** Admin table / lists (no metric toggle). */
export function formatIngredientQuantityCell(ing: DrinkIngredient): string {
  const q = ing.quantity
  if (q == null) return '—'
  if (typeof q === 'string') return q.trim() || '—'
  if (typeof q === 'number' && Number.isFinite(q)) return `${q} ${ing.unit ?? 'oz'}`
  return '—'
}

/**
 * oz → cl using European bar conventions, not strict math. Drinks are smaller
 * in France / UK than in the US, so this isn't a literal 1 oz = 3 cl rule —
 * a "single" reads as ~2.5 cl (UK 25 ml zone) and a "double" as 5 cl. The
 * table is calibrated so 1.5 / 0.75 / 0.75 oz Negroni-shape recipes land on
 * the canonical 4 / 2 / 2 cl pour, and 2 / 0.75 / 0.75 oz sours on 5 / 2 / 2.
 * Off-table values fall back to nearest 0.5 cl (5 ml grid).
 */
const OZ_TO_CL_LOOKUP: Readonly<Record<string, number>> = {
  '0.25': 0.5,
  '0.5': 1.5,
  '0.75': 2,
  '1': 2.5,
  '1.25': 3,
  '1.5': 4,
  '1.75': 4.5,
  '2': 5,
  '2.5': 6,
  '3': 7.5,
  '4': 10,
}

export function ozToCl(oz: number): number {
  const key = String(oz)
  if (key in OZ_TO_CL_LOOKUP) return OZ_TO_CL_LOOKUP[key]
  return Math.round(oz * 3 * 2) / 2
}

export function formatCl(cl: number): string {
  if (Number.isInteger(cl)) return String(cl)
  return cl.toFixed(1).replace(/\.0$/, '')
}

const OZ_FRACTIONS: ReadonlyArray<readonly [number, string]> = [
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [1 / 2, '1/2'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
]
const OZ_FRACTION_TOLERANCE = 0.02

export function formatOz(n: number): string {
  if (!Number.isFinite(n)) return String(n)
  if (n < 0) return `-${formatOz(-n)}`
  const whole = Math.floor(n)
  const frac = n - whole
  if (frac < OZ_FRACTION_TOLERANCE) return String(whole)
  const match = OZ_FRACTIONS.find(
    ([v]) => Math.abs(frac - v) < OZ_FRACTION_TOLERANCE,
  )
  if (match) return whole === 0 ? match[1] : `${whole} ${match[1]}`
  return String(n)
}
