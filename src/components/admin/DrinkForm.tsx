import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { COCKTAIL_FAMILIES } from '../../constants/families';
import {
	addDrinkToFirestore,
	drinkNameExists,
	updateDrinkInFirestore,
} from '../../api/drinks';
import {
	drinkToFormFields,
	emptyDrinkForm,
	emptyIngredientRow,
	formFieldsToDrink,
	formFieldsToWritePayload,
	ICE_OPTIONS,
	MAX_INGREDIENT_ROWS,
	METHOD_OPTIONS,
	MIN_INGREDIENT_ROWS,
	type DrinkFormFields,
	type IngredientFieldRow,
} from '../../lib/drinkFormAdmin';
import {
	hasRenderableDrinkImageUrl,
	tryGenerateDrinkImage,
} from '../../lib/generateDrinkImage';
import type { Drink } from '../../types/drink';
import { Button } from '../atoms/Button';
import { IngredientRowInput } from './IngredientRowInput';

type Props =
	| { mode: 'add' }
	| { mode: 'edit'; drink: Drink; onDone: () => void };

export function DrinkForm(props: Props) {
	const queryClient = useQueryClient();
	const [fields, setFields] = useState<DrinkFormFields>(() =>
		props.mode === 'edit' ? drinkToFormFields(props.drink) : emptyDrinkForm(),
	);
	const [showDescription, setShowDescription] = useState(
		() => props.mode === 'edit' && Boolean(props.drink.description?.trim()),
	);
	const [formError, setFormError] = useState<string | null>(null);
	const [generateAiImage, setGenerateAiImage] = useState(false);

	const saveMutation = useMutation({
		mutationFn: async () => {
			setFormError(null);
			const name = fields.name.trim();
			if (!name) throw new Error('Name is required.');

			if (props.mode === 'add') {
				if (await drinkNameExists(name)) {
					throw new Error(`A drink named "${name}" already exists.`);
				}
				let payload = formFieldsToWritePayload(fields);
				if (generateAiImage && !hasRenderableDrinkImageUrl(payload.imageUrl)) {
					const imagePath = await tryGenerateDrinkImage(name);
					if (imagePath) payload = { ...payload, imageUrl: imagePath };
				}
				await addDrinkToFirestore(payload);
				return;
			}

			if (await drinkNameExists(name, props.drink.id)) {
				throw new Error(`Another drink is already named "${name}".`);
			}
			const drink = formFieldsToDrink(fields, props.drink.id);
			await updateDrinkInFirestore(drink);
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['drinks'] });
			if (props.mode === 'add') {
				setFields(emptyDrinkForm());
				setShowDescription(false);
				setGenerateAiImage(false);
			} else {
				props.onDone();
			}
		},
		onError: (err: unknown) => {
			const message =
				err instanceof Error ? err.message : 'Something went wrong.';
			setFormError(message);
		},
	});

	const addIngredientRow = () => {
		if (fields.ingredients.length >= MAX_INGREDIENT_ROWS) return;
		setFields((f) => ({
			...f,
			ingredients: [...f.ingredients, emptyIngredientRow()],
		}));
	};

	const removeIngredientRow = () => {
		if (fields.ingredients.length <= MIN_INGREDIENT_ROWS) return;
		setFields((f) => ({
			...f,
			ingredients: f.ingredients.slice(0, -1),
		}));
	};

	const patchIngredient = (index: number, row: IngredientFieldRow) => {
		setFields((f) => {
			const ingredients = [...f.ingredients];
			ingredients[index] = row;
			return { ...f, ingredients };
		});
	};

	const title = props.mode === 'add' ? 'Add cocktail' : 'Edit cocktail';
	const submitLabel = props.mode === 'add' ? 'Add drink' : 'Save changes';

	return (
		<form
			className="p-4 mx-auto rounded-lg bg-[var(--code-bg)] border border-[var(--border)] text-left max-w-3xl shadow-[var(--shadow)]"
			onSubmit={(e) => {
				e.preventDefault();
				saveMutation.mutate();
			}}
			aria-busy={saveMutation.isPending}
		>
			<h4 className="text-lg text-[var(--text-h)] mt-0 mb-4">{title}</h4>

			{formError ? (
				<p className="text-red-500 dark:text-red-400 text-sm mb-4" role="alert">
					{formError}
				</p>
			) : null}

			<div className="admin-form-row">
				<label htmlFor="admin-drink-name">Name</label>
				<input
					id="admin-drink-name"
					type="text"
					required
					value={fields.name}
					onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
				/>
			</div>
			<div className="admin-form-row">
				<label htmlFor="admin-drink-glass">Glass</label>
				<input
					id="admin-drink-glass"
					type="text"
					required
					value={fields.glass}
					onChange={(e) => setFields((f) => ({ ...f, glass: e.target.value }))}
				/>
			</div>
			<div className="admin-form-row">
				<label htmlFor="admin-drink-method">Method</label>
				<select
					id="admin-drink-method"
					required
					value={fields.method}
					onChange={(e) => setFields((f) => ({ ...f, method: e.target.value }))}
				>
					{METHOD_OPTIONS.map((m) => (
						<option key={m} value={m}>
							{m}
						</option>
					))}
				</select>
			</div>
			<div className="admin-form-row">
				<label htmlFor="admin-drink-ice">Ice</label>
				<select
					id="admin-drink-ice"
					required
					value={fields.ice}
					onChange={(e) => setFields((f) => ({ ...f, ice: e.target.value }))}
				>
					{ICE_OPTIONS.map((ice) => (
						<option key={ice} value={ice}>
							{ice}
						</option>
					))}
				</select>
			</div>
			<div className="admin-form-row">
				<label htmlFor="admin-drink-garnish">Garnish</label>
				<input
					id="admin-drink-garnish"
					type="text"
					value={fields.garnish}
					onChange={(e) =>
						setFields((f) => ({ ...f, garnish: e.target.value }))
					}
				/>
			</div>
			<div className="admin-form-row">
				<label htmlFor="admin-drink-image">Image URL</label>
				<input
					id="admin-drink-image"
					type="text"
					value={fields.imageUrl}
					onChange={(e) =>
						setFields((f) => ({ ...f, imageUrl: e.target.value }))
					}
					placeholder="Optional"
				/>
			</div>
			{props.mode === 'add' ? (
				<div className="admin-form-row items-start">
					<label htmlFor="admin-generate-ai-image">Generate AI image</label>
					<div className="w-full md:w-4/5">
						<div className="flex items-center gap-2 min-h-11">
							<input
								id="admin-generate-ai-image"
								type="checkbox"
								checked={generateAiImage}
								onChange={(e) => setGenerateAiImage(e.target.checked)}
								aria-describedby="admin-generate-ai-image-hint"
								className="accent-[var(--accent)] size-4 shrink-0 rounded border-[var(--border)]"
							/>
						</div>
					</div>
				</div>
			) : null}
			<div className="admin-form-row">
				<label htmlFor="admin-drink-family">Family</label>
				<select
					id="admin-drink-family"
					value={fields.family}
					onChange={(e) => setFields((f) => ({ ...f, family: e.target.value }))}
				>
					{COCKTAIL_FAMILIES.map((fam) => (
						<option key={fam.slug} value={fam.label}>
							{fam.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-2 relative mb-10">
				<span className="w-full lg:w-1/5 text-[var(--text-h)] text-sm font-medium lg:pt-2">
					Ingredients
				</span>
				<div className="w-full border border-[var(--border)] rounded overflow-hidden">
					<div className="flex bg-[var(--accent-bg)] border-b border-[var(--border)] text-left text-sm">
						<div className="w-1/2 py-2 px-4">Name</div>
						<div className="w-1/3 py-2 px-4 border-x border-[var(--border)]">
							Quantity
						</div>
						<div className="w-1/6 py-2 px-4">Unit</div>
					</div>
					{fields.ingredients.map((ing, idx) => (
						<IngredientRowInput
							key={`ing-${idx}`}
							ingredient={ing}
							onChange={(row) => patchIngredient(idx, row)}
						/>
					))}
				</div>
				<div className="flex gap-2 justify-end">
					<Button type="button" color="secondary" onClick={removeIngredientRow}>
						−
					</Button>
					<Button type="button" color="secondary" onClick={addIngredientRow}>
						+
					</Button>
				</div>
			</div>

			<div className="admin-form-row items-start">
				<span className="pt-2">Description</span>
				<div className="w-full md:w-4/5">
					{!showDescription ? (
						<button
							type="button"
							className="text-sm text-[var(--accent)] underline bg-transparent border-0 cursor-pointer p-0 font-[inherit]"
							onClick={() => setShowDescription(true)}
						>
							Add description
						</button>
					) : (
						<textarea
							id="admin-drink-description"
							className="w-full min-h-[120px] rounded-lg px-3 py-2 bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline focus:outline-1 focus:outline-[var(--accent-border)]"
							rows={5}
							value={fields.description}
							onChange={(e) =>
								setFields((f) => ({ ...f, description: e.target.value }))
							}
						/>
					)}
				</div>
			</div>

			<Button
				type="submit"
				fill
				color="secondary"
				disabled={saveMutation.isPending}
			>
				{saveMutation.isPending ? 'Saving…' : submitLabel}
			</Button>
		</form>
	);
}
