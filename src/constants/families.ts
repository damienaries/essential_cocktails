export const COCKTAIL_FAMILIES = [
	{ slug: 'caipirinha', label: 'Caipirinha' },
	{ slug: 'collins', label: 'Collins' },
	{ slug: 'daiquiri', label: 'Daiquiri' },
	{ slug: 'gimlet', label: 'Gimlet' },
	{ slug: 'manhattan', label: 'Manhattan' },
	{ slug: 'martini', label: 'Martini' },
	{ slug: 'old-fashioned', label: 'Old Fashioned' },
	{ slug: 'rickey', label: 'Rickey' },
	{ slug: 'sidecar', label: 'Sidecar' },
	{ slug: 'smash', label: 'Smash' },
	{ slug: 'sour', label: 'Sour' },
	{ slug: 'tiki', label: 'Tiki' },
] as const;

export type FamilySlug = (typeof COCKTAIL_FAMILIES)[number]['slug'];

export function isFamilySlug(value: string): value is FamilySlug {
	return COCKTAIL_FAMILIES.some((f) => f.slug === value);
}

export function slugToFamilyFilter(slug: string): string {
	return decodeURIComponent(slug).replaceAll('-', ' ').trim().toLowerCase();
}

export function normalizeFamilyName(value: string | null | undefined): string {
	return (value ?? '').trim().toLowerCase();
}

/** Anything family membership can be read from — `Drink`, a write payload, a form draft. */
export type FamilyMember = {
	family?: string | null;
	families?: string[] | null;
};

/**
 * Normalized family keys for a drink. A drink can sit in several families (a Daiquiri
 * is both a Daiquiri and a Tiki drink); `family` is the primary one and stays populated
 * for search and for docs written before `families` existed.
 */
export function drinkFamilyKeys(member: FamilyMember): string[] {
	const raw = member.families?.length ? member.families : [member.family];
	const keys = raw.map(normalizeFamilyName).filter(Boolean);
	return [...new Set(keys)];
}

export function drinkInFamily(
	member: FamilyMember,
	familyKey: string,
): boolean {
	return drinkFamilyKeys(member).includes(familyKey);
}

/**
 * Values stored as slug, odd casing, or label must match a <select> option (`fam.label`).
 * Unknown values become '' so the empty option works and saves can clear bad data.
 */
export function canonicalFamilyLabelForForm(
	stored: string | null | undefined,
): string {
	const raw = (stored ?? '').trim();
	if (!raw) return '';
	const n = normalizeFamilyName(raw);
	const byLabel = COCKTAIL_FAMILIES.find(
		(f) => normalizeFamilyName(f.label) === n,
	);
	if (byLabel) return byLabel.label;
	const asSlug = raw.toLowerCase().replaceAll(' ', '-');
	const bySlug = COCKTAIL_FAMILIES.find((f) => f.slug === asSlug);
	if (bySlug) return bySlug.label;
	return '';
}

/** Form draft values: every family the drink belongs to, as labels, primary first. */
export function canonicalFamilyLabelsForForm(member: FamilyMember): string[] {
	const stored = member.families?.length ? member.families : [member.family];
	const labels = stored.map(canonicalFamilyLabelForForm).filter(Boolean);
	return [...new Set(labels)];
}
