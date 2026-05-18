import { useMemo } from 'react';
import { useDrinksQuery } from './useDrinksQuery';
import {
	categorizeIngredient,
	GLOSSARY_CATEGORIES,
	type IngredientCategory,
} from '../lib/ingredientCategory';
import type { Drink } from '../types/drink';

export type GlossaryEntry = {
	name: string;
	category: IngredientCategory;
	drinkCount: number;
	drinks: Drink[];
};

function normalizeKey(name: string): string {
	return name
		.trim()
		.toLocaleLowerCase('en-US')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/\s+/g, ' ');
}

function displayName(name: string): string {
	return name.trim().replace(/\s+/g, ' ');
}

export function useGlossaryQuery() {
	const { data, isPending, isError, error } = useDrinksQuery();

	const entries = useMemo<GlossaryEntry[]>(() => {
		if (!data) return [];

		const allowed = new Set<IngredientCategory>(GLOSSARY_CATEGORIES);
		const byKey = new Map<string, GlossaryEntry>();

		for (const drink of data) {
			for (const ing of drink.ingredients ?? []) {
				const name = ing.name?.trim();
				if (!name) continue;
				const cat = categorizeIngredient(name);
				if (!allowed.has(cat)) continue;
				const key = normalizeKey(name);
				let entry = byKey.get(key);
				if (!entry) {
					entry = {
						name: displayName(name),
						category: cat,
						drinkCount: 0,
						drinks: [],
					};
					byKey.set(key, entry);
				}
				entry.drinkCount += 1;
				entry.drinks.push(drink);
			}
		}

		return Array.from(byKey.values()).sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
		);
	}, [data]);

	return { entries, isPending, isError, error };
}
