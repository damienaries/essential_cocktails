import type { DrinkWritePayload } from '../api/drinks';
import { canonicalFamilyLabelsForForm } from '../constants/families';
import type { Drink, DrinkIngredient } from '../types/drink';
import {
	ingredientQuantityToFormString,
	parseQuantityForStorage,
} from './ingredientQuantity';

export const METHOD_OPTIONS = [
	'Shake',
	'Stir',
	'Build',
	'Dry Shake',
	'Muddle',
	'Swizzle',
] as const;
export const ICE_OPTIONS = ['cube', 'crushed', 'up'] as const;

export const DEFAULT_INGREDIENT_ROWS = 5;
export const MIN_INGREDIENT_ROWS = 3;
export const MAX_INGREDIENT_ROWS = 10;

export type IngredientFieldRow = {
	name: string;
	quantity: string;
	unit: string;
};

export type DrinkFormFields = {
	name: string;
	glass: string;
	method: string;
	ice: string;
	garnish: string;
	imageUrl: string;
	/** Family labels, primary first. */
	families: string[];
	ingredients: IngredientFieldRow[];
	description: string;
};

export function emptyIngredientRow(): IngredientFieldRow {
	return { name: '', quantity: '', unit: 'oz' };
}

export function emptyDrinkForm(): DrinkFormFields {
	return {
		name: '',
		glass: '',
		method: METHOD_OPTIONS[0],
		ice: ICE_OPTIONS[0],
		garnish: '',
		imageUrl: '',
		families: [],
		ingredients: Array.from(
			{ length: DEFAULT_INGREDIENT_ROWS },
			emptyIngredientRow,
		),
		description: '',
	};
}

export function drinkToFormFields(drink: Drink): DrinkFormFields {
	const ing: IngredientFieldRow[] = (drink.ingredients ?? []).map((i) => ({
		name: i.name ?? '',
		quantity: ingredientQuantityToFormString(i.quantity),
		unit: i.unit ?? 'oz',
	}));
	while (ing.length < DEFAULT_INGREDIENT_ROWS) ing.push(emptyIngredientRow());

	const methodRaw = drink.method;
	const method = Array.isArray(methodRaw)
		? methodRaw.filter(Boolean).join(', ')
		: (methodRaw ?? '');
	const garnishRaw = drink.garnish;
	const garnish = Array.isArray(garnishRaw)
		? garnishRaw.filter(Boolean).join(', ')
		: (garnishRaw ?? '');

	const iceVal = drink.ice ?? '';
	const iceNorm = ICE_OPTIONS.includes(iceVal as (typeof ICE_OPTIONS)[number])
		? iceVal
		: ICE_OPTIONS[0];

	return {
		name: drink.name ?? '',
		glass: drink.glass ?? '',
		method: method || METHOD_OPTIONS[0],
		ice: iceNorm,
		garnish,
		imageUrl: drink.imageUrl ?? '',
		families: canonicalFamilyLabelsForForm(drink),
		ingredients: ing,
		description: drink.description ?? '',
	};
}

export function formFieldsToWritePayload(
	fields: DrinkFormFields,
): DrinkWritePayload {
	const ingredients: DrinkIngredient[] = [];
	for (const row of fields.ingredients) {
		const name = row.name.trim();
		const q = row.quantity.trim();
		if (!name || q === '') continue;
		const quantity = parseQuantityForStorage(q);
		ingredients.push({ name, quantity, unit: row.unit || 'oz' });
	}

	const families = [
		...new Set(fields.families.map((f) => f.trim()).filter(Boolean)),
	];

	return {
		name: fields.name.trim(),
		glass: fields.glass.trim() || null,
		method: fields.method.trim() || null,
		ice: fields.ice.trim() || null,
		garnish: fields.garnish.trim() || null,
		imageUrl: fields.imageUrl.trim() || null,
		family: families[0] ?? null,
		families: families.length ? families : null,
		ingredients: ingredients.length ? ingredients : null,
		description: fields.description.trim() || null,
	};
}

export function formFieldsToDrink(fields: DrinkFormFields, id: string): Drink {
	return { id, ...formFieldsToWritePayload(fields) };
}
