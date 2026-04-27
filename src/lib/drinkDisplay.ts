import type { Drink } from '../types/drink'

export function formatMethod(drink: Drink): string {
  const m = drink.method
  if (m == null) return ''
  return Array.isArray(m) ? m.join(', ') : m
}

export function formatGarnish(drink: Drink): string {
  const g = drink.garnish
  if (g == null || (typeof g === 'string' && g.trim() === '')) return 'No garnish'
  return Array.isArray(g) ? g.join(', ') : g
}
