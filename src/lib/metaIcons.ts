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
  if (v.startsWith('build')) return 'method-build'
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

const GLASS_PATTERNS: ReadonlyArray<readonly [RegExp, string]> = [
  [/coupe|martini|nick.?and.?nora|cocktail/i, 'glass-coupe'],
  [/highball|collins|tall/i, 'glass-highball'],
  [/rocks|old.?fashioned|tumbler|lowball|double rocks/i, 'glass-rocks'],
  [/flute|champagne|tulip|sparkling/i, 'glass-champagne'],
]

export function glassIconName(glass: Drink['glass']): string | null {
  const v = glass?.toString().trim()
  if (!v) return null
  for (const [re, name] of GLASS_PATTERNS) {
    if (re.test(v)) return name
  }
  return null
}
