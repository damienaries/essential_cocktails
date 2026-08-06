import type { Drink } from '../types/drink';

/**
 * Name → URL segment. Shared by drink and menu URLs so the two can't drift into
 * different slugging rules.
 */
export function slugify(value: string): string {
	const slug = value
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	// Names made entirely of symbols would slug to nothing, which would collide with
	// the parent route; the encoded fallback keeps them addressable.
	return slug || encodeURIComponent(value.trim().toLowerCase());
}

export function drinkSlug(drink: Drink): string {
	return slugify(drink.name ?? '');
}

/** Resolves a URL segment back to a drink. Undefined for unknown or missing slugs. */
export function findDrinkBySlug(
	drinks: Drink[],
	slug: string | undefined,
): Drink | undefined {
	if (!slug) return undefined;
	const target = decodeURIComponent(slug).toLowerCase();
	return drinks.find((drink) => drinkSlug(drink) === target);
}
