import { normalizeFamilyName } from '../constants/families'
import type { Drink } from '../types/drink'

export function filterDrinks(drinks: Drink[], term: string): Drink[] {
  const q = term.trim().toLowerCase()
  if (!q) return drinks

  return drinks.filter((d) => {
    if (d.name?.toLowerCase().includes(q)) return true
    if (normalizeFamilyName(d.family).includes(q)) return true
    for (const ing of d.ingredients ?? []) {
      if (ing.name?.toLowerCase().includes(q)) return true
    }
    return false
  })
}
