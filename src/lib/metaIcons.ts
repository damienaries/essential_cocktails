import type { Drink } from '../types/drink'

/**
 * Closed-enum mappings (method, ice) hit deterministically; glass is free text
 * so we pattern-match common shapes and fall back to text for anything else.
 */

export function methodIconName(method: Drink['method']): string | null {
  const raw = Array.isArray(method) ? method[0] : method
  const v = raw?.toString().toLowerCase().trim()
  if (!v) return null
  if (/dry\s*shake/.test(v)) return 'method-dry-shake'
  if (v.startsWith('shake')) return 'method-shake'
  if (v.startsWith('stir')) return 'method-stir'
  // No dedicated build glyph yet — swizzle conveys "stir in the glass" closely enough.
  if (v.startsWith('build') || v.startsWith('swizzle')) return 'method-swizzle'
  if (v.startsWith('muddle')) return 'method-muddle'
  return null
}

export function iceIconName(ice: Drink['ice']): string | null {
  const v = ice?.toString().toLowerCase().trim()
  if (!v) return null
  if (v === 'cube' || v === 'cubed') return 'ice-cube'
  if (v === 'crushed') return 'ice-crushed'
  if (v === 'up' || v === 'none' || v === 'no ice') return 'ice-up'
  return null
}

// Order matters — patterns are tested top→bottom, first match wins.
// "double old fashioned" / "DOF" must come before plain "old fashioned".
const GLASS_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/double\s*(old.?fashioned|rocks)|d\.?o\.?f\.?\b/i, 'glass-dof'],
  [/coupe|martini|nick.{0,3}nora|cocktail/i, 'glass-coupe'],
  [/tiki/i, 'glass-tiki'],
  [/vintage/i, 'glass-vintage'],
  [/flute|champagne|tulip|sparkling/i, 'glass-champagne'],
  [/highball|collins|tall/i, 'glass-highball'],
  [/rocks|old.?fashioned|tumbler|lowball/i, 'glass-rocks-sm'],
]

export function glassIconName(glass: Drink['glass']): string | null {
  const v = glass?.toString().trim()
  if (!v) return null
  for (const [re, name] of GLASS_PATTERNS) {
    if (re.test(v)) return name
  }
  return null
}
