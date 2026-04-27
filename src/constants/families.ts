/** URL slug + display label. Matches the family groupings used in the legacy Vue app. */
export const COCKTAIL_FAMILIES = [
  { slug: 'sour', label: 'Sour' },
  { slug: 'collins', label: 'Collins' },
  { slug: 'gimlet', label: 'Gimlet' },
  { slug: 'rickey', label: 'Rickey' },
  { slug: 'daiquiri', label: 'Daiquiri' },
  { slug: 'sidecar', label: 'Sidecar' },
  { slug: 'caipirinha', label: 'Caipirinha' },
  { slug: 'smash', label: 'Smash' },
  { slug: 'martini', label: 'Martini' },
  { slug: 'manhattan', label: 'Manhattan' },
  { slug: 'old-fashioned', label: 'Old Fashioned' },
] as const

export type FamilySlug = (typeof COCKTAIL_FAMILIES)[number]['slug']

export function isFamilySlug(value: string): value is FamilySlug {
  return COCKTAIL_FAMILIES.some((f) => f.slug === value)
}

export function slugToFamilyFilter(slug: string): string {
  return decodeURIComponent(slug).replaceAll('-', ' ').trim().toLowerCase()
}

export function normalizeFamilyName(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase()
}
