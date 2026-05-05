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
