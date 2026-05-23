import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { COCKTAIL_FAMILIES } from '../../constants/families';
import {
	addDrinkToFirestore,
	drinkNameExists,
	updateDrinkInFirestore,
} from '../../api/drinks';
import { useDrinksQuery } from '../../hooks/useDrinksQuery';
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
import type { Drink } from '../../types/drink';
import { Button } from '../atoms/Button';
import { useAdminBanner } from './AdminBanner';
import { DrinkImagePromptAndUpload } from './DrinkImagePromptAndUpload';
import { IngredientRowInput } from './IngredientRowInput';

type Props =
	| { mode: 'add' }
	| { mode: 'edit'; drink: Drink; onDone: () => void };

function normalizeDrinkName(name: string): string {
	return name
		.trim()
		.toLocaleLowerCase('en-US')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '');
}

export function DrinkForm(props: Props) {
	const queryClient = useQueryClient();
	const { showBanner } = useAdminBanner();
	const { data: allDrinks } = useDrinksQuery();
	const [fields, setFields] = useState<DrinkFormFields>(() =>
		props.mode === 'edit' ? drinkToFormFields(props.drink) : emptyDrinkForm(),
	);
	const [showDescription, setShowDescription] = useState(
		() => props.mode === 'edit' && Boolean(props.drink.description?.trim()),
	);
	const [imageToolsKey, setImageToolsKey] = useState(0);
	const [imageUploading, setImageUploading] = useState(false);

	const saveMutation = useMutation({
		mutationFn: async () => {
			const name = fields.name.trim();
			if (!name) throw new Error('Name is required.');

			if (props.mode === 'add') {
				if (await drinkNameExists(name)) {
					throw new Error(`A drink named "${name}" already exists.`);
				}
				const payload = formFieldsToWritePayload(fields);
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
			showBanner(
				'success',
				props.mode === 'add' ? 'Drink added' : 'Drink updated',
			);
			if (props.mode === 'add') {
				setFields(emptyDrinkForm());
				setShowDescription(false);
				setImageToolsKey((k) => k + 1);
			} else {
				props.onDone();
			}
		},
		onError: (err: unknown) => {
			const message =
				err instanceof Error ? err.message : 'Something went wrong.';
			showBanner('error', message);
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

	const requiredFieldsFilled =
		fields.name.trim() !== '' && fields.glass.trim() !== '';

	const duplicateDrink = useMemo(() => {
		if (props.mode !== 'add') return null;
		const trimmed = fields.name.trim();
		if (!trimmed || !allDrinks) return null;
		const normalized = normalizeDrinkName(trimmed);
		return (
			allDrinks.find((d) => normalizeDrinkName(d.name) === normalized) ?? null
		);
	}, [allDrinks, fields.name, props.mode]);

	const canSubmit =
		!saveMutation.isPending &&
		!imageUploading &&
		requiredFieldsFilled &&
		!duplicateDrink;
	const submitButtonLabel = saveMutation.isPending
		? 'Saving…'
		: imageUploading
			? 'Uploading image…'
			: submitLabel;

	return (
		<form
			className="p-4 mx-auto rounded-lg bg-chalk dark:bg-carbon border border-chalk dark:border-charcoal text-left max-w-3xl shadow-md"
			onSubmit={(e) => {
				e.preventDefault();
				if (!canSubmit) return;
				saveMutation.mutate();
			}}
			aria-busy={saveMutation.isPending}
		>
			<h4 className="text-lg text-ink dark:text-cream mt-0 mb-4">{title}</h4>

			<div className="admin-form-row">
				<label htmlFor="admin-drink-name">Name</label>
				<input
					id="admin-drink-name"
					type="text"
					required
					aria-invalid={duplicateDrink != null}
					aria-describedby={duplicateDrink ? 'admin-drink-name-error' : undefined}
					value={fields.name}
					onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
				/>
			</div>
			{duplicateDrink ? (
				<div className="admin-form-row -mt-3 mb-3 pt-0">
					<span aria-hidden></span>
					<p
						id="admin-drink-name-error"
						role="alert"
						className="m-0 max-w-[80%] flex-1 text-sm text-red-600 dark:text-red-400">
						A drink named &quot;{duplicateDrink.name}&quot; already exists.{' '}
						<Link
							to={`/admin/list?edit=${duplicateDrink.id}`}
							className="underline hover:text-brass">
							Edit existing instead →
						</Link>
					</p>
				</div>
			) : null}
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
				<label htmlFor="admin-drink-family">Family</label>
				<select
					id="admin-drink-family"
					value={fields.family}
					onChange={(e) => setFields((f) => ({ ...f, family: e.target.value }))}
				>
					<option value="">Select a family</option>
					{COCKTAIL_FAMILIES.map((fam) => (
						<option key={fam.slug} value={fam.label}>
							{fam.label}
						</option>
					))}
				</select>
			</div>

			<div className="flex flex-col gap-2 relative mb-10">
				<span className="w-full lg:w-1/5 text-ink dark:text-cream text-sm font-medium lg:pt-2">
					Ingredients
				</span>
				<div className="w-full border border-chalk dark:border-charcoal rounded overflow-hidden">
					<div className="flex bg-brass/10 border-b border-chalk dark:border-charcoal text-left text-sm">
						<div className="w-1/2 py-2 px-4">Name</div>
						<div className="w-1/3 py-2 px-4 border-x border-chalk dark:border-charcoal">
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
					<Button
						type="button"
						color="secondary"
						size="sm"
						onClick={removeIngredientRow}
					>
						−
					</Button>
					<Button
						type="button"
						color="secondary"
						size="sm"
						onClick={addIngredientRow}
					>
						+
					</Button>
				</div>
			</div>

			<DrinkImagePromptAndUpload
				key={imageToolsKey}
				fields={fields}
				drinkId={props.mode === 'edit' ? props.drink.id : undefined}
				onImageUrl={(url) => setFields((f) => ({ ...f, imageUrl: url }))}
				onUploadingChange={setImageUploading}
			/>

			<div className="admin-form-row items-start">
				<span className="pt-2">Description</span>
				<div className="w-full md:w-4/5">
					{!showDescription ? (
						<button
							type="button"
							className="text-sm text-brass underline bg-transparent border-0 cursor-pointer p-0 font-[inherit]"
							onClick={() => setShowDescription(true)}
						>
							Add description
						</button>
					) : (
						<textarea
							id="admin-drink-description"
							className="w-full min-h-[120px] rounded-lg px-3 py-2 bg-paper dark:bg-coal text-smoke dark:text-sand border border-chalk dark:border-charcoal focus:outline focus:outline-1 focus:outline-brass/50"
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
				color="primary"
				size="sm"
				disabled={!canSubmit}
			>
				{submitButtonLabel}
			</Button>
		</form>
	);
}
