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

/**
 * Values stored as slug, odd casing, or label must match a <select> option (`fam.label`).
 * Unknown values become '' so the empty option works and saves can clear bad data.
 */
export function canonicalFamilyLabelForForm(
  stored: string | null | undefined,
): string {
  const raw = (stored ?? '').trim()
  if (!raw) return ''
  const n = normalizeFamilyName(raw)
  const byLabel = COCKTAIL_FAMILIES.find(
    (f) => normalizeFamilyName(f.label) === n,
  )
  if (byLabel) return byLabel.label
  const asSlug = raw.toLowerCase().replaceAll(' ', '-')
  const bySlug = COCKTAIL_FAMILIES.find((f) => f.slug === asSlug)
  if (bySlug) return bySlug.label
  return ''
}
