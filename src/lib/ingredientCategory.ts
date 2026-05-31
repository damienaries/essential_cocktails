export type IngredientCategory =
	| 'syrup'
	| 'modifier'
	| 'bitters'
	| 'tincture'
	| 'spirit'
	| 'juice'
	| 'fruit'
	| 'other';

const TINCTURE_WORDS = /\b(tincture|saline)\b/i;
const BITTERS_WORDS = /\bbitters?\b/i;
const SPIRIT_WORDS =
	/\b(vodka|gin|rum|tequila|mezcal|whiskey|whisky|bourbon|rye|scotch|cognac|brandy|pisco|cacha[cç]a|aquavit|grappa|calvados|armagnac|absinthe)\b/i;
const MODIFIER_WORDS =
	/\b(vermouth|amaro|amari|aperol|campari|chartreuse|maraschino|cura[cç]ao|sherry|port|cocchi|punt e mes|byrrh|lillet|fernet|liqueur|cr[èe]me|creme|sloe|b[ée]n[ée]dictine|drambuie|galliano|chambord|cointreau|triple sec|grand marnier|st[\s-]?germain|elderflower|k[üu]mmel|allspice dram|pimm)\b/i;
const SYRUP_WORDS =
	/\b(syrup|cordial|orgeat|grenadine|honey|agave|gomme|demerara|falernum)\b/i;
const FRUIT_WORDS =
	/\b(cherry|cherries|berry|berries|strawberry|raspberry|blueberry|blackberry|peach|apricot|fig|apple|pear|plum|grape|mango|banana)\b/i;
const JUICE_WORDS =
	/\b(juice|sour mix|lime|lemon|orange|grapefruit|cranberry|tomato|pineapple)\b/i;

export function categorizeIngredient(
	rawName: string | null | undefined,
): IngredientCategory {
	const name = (rawName ?? '').trim();
	if (!name) return 'other';

	// Tincture before bitters so "ginger tincture" doesn't fall through; the two
	// vocabularies don't overlap but ordering future-proofs against names like
	// "tincture bitters" used by some producers.
	if (TINCTURE_WORDS.test(name)) return 'tincture';
	if (BITTERS_WORDS.test(name)) return 'bitters';
	if (FRUIT_WORDS.test(name) && !/juice/i.test(name)) return 'fruit';
	if (SPIRIT_WORDS.test(name)) return 'spirit';
	if (MODIFIER_WORDS.test(name)) return 'modifier';
	if (SYRUP_WORDS.test(name)) return 'syrup';
	if (JUICE_WORDS.test(name)) return 'juice';
	return 'other';
}

export const GLOSSARY_CATEGORIES: readonly IngredientCategory[] = [
	'syrup',
	'modifier',
	'tincture',
] as const;

const GLOSSARY_CATEGORY_SET = new Set<IngredientCategory>(GLOSSARY_CATEGORIES);

export function isGlossaryIngredient(
	name: string | null | undefined,
): boolean {
	return GLOSSARY_CATEGORY_SET.has(categorizeIngredient(name));
}

export function glossarySlug(name: string): string {
	return name
		.trim()
		.toLocaleLowerCase('en-US')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function categoryLabel(cat: IngredientCategory): string {
	switch (cat) {
		case 'syrup':
			return 'Syrup';
		case 'modifier':
			return 'Modifier';
		case 'bitters':
			return 'Bitters';
		case 'tincture':
			return 'Tincture';
		case 'spirit':
			return 'Spirit';
		case 'juice':
			return 'Juice';
		case 'fruit':
			return 'Fruit';
		case 'other':
			return 'Other';
	}
}
