import { useMemo, useState } from 'react';
import type { Drink } from '../types/drink';

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as readonly string[];

/** A–Z if the drink name starts with that letter (Latin); otherwise null. */
export function drinkNameFirstLetter(
	name: string | null | undefined,
): string | null {
	const t = (name ?? '').trim();
	if (!t) return null;
	const ch = t[0].toLocaleUpperCase('en-US').normalize('NFD')[0];
	if (ch >= 'A' && ch <= 'Z') return ch;
	return null;
}

export type UseLetterFilterResult = {
	letterFilter: string | null;
	setLetterFilter: (next: string | null) => void;
	lettersPresent: Set<string>;
	filteredByLetter: Drink[];
};

/**
 * Filters a list of drinks by first letter of name. Caller is responsible for any
 * upstream filtering/sorting; pass the already-prepared list and consume `filteredByLetter`.
 */
export function useLetterFilter(drinks: Drink[]): UseLetterFilterResult {
	const [letterFilter, setLetterFilter] = useState<string | null>(null);

	const { lettersPresent, filteredByLetter } = useMemo(() => {
		const present = new Set<string>();
		for (const d of drinks) {
			const L = drinkNameFirstLetter(d.name);
			if (L) present.add(L);
		}
		const filtered =
			letterFilter == null
				? drinks
				: drinks.filter((d) => drinkNameFirstLetter(d.name) === letterFilter);
		return { lettersPresent: present, filteredByLetter: filtered };
	}, [drinks, letterFilter]);

	return { letterFilter, setLetterFilter, lettersPresent, filteredByLetter };
}
