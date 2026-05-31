import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import { useGlossaryQuery } from '../hooks/useGlossaryQuery';
import {
	categoryLabel,
	glossarySlug,
} from '../lib/ingredientCategory';
import { lookupGlossaryDefinition } from '../lib/glossaryDefinitions';
import type { Drink } from '../types/drink';

export function GlossaryPage() {
	const { entries, isPending, isError, error } = useGlossaryQuery();
	const [selected, setSelected] = useState<Drink | null>(null);
	const [query, setQuery] = useState('');
	const [openRecipes, setOpenRecipes] = useState<Set<string>>(new Set());
	const { hash } = useLocation();

	const toggleRecipe = (slug: string) => {
		setOpenRecipes((prev) => {
			const next = new Set(prev);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			return next;
		});
	};

	const filtered = useMemo(() => {
		const q = query.trim().toLocaleLowerCase('en-US');
		if (!q) return entries;
		return entries.filter((e) =>
			e.name.toLocaleLowerCase('en-US').includes(q),
		);
	}, [entries, query]);

	useEffect(() => {
		if (!hash || isPending) return;
		const id = hash.slice(1);
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [hash, isPending, entries.length]);

	if (isPending) return <p className="text-center">Loading glossary…</p>;
	if (isError) {
		return (
			<p role="alert" className="text-center">
				Could not load glossary:{' '}
				{error instanceof Error ? error.message : 'Unknown error'}
			</p>
		);
	}

	return (
		<div className="pb-[60px]">
			<div className="sticky top-0 z-10 -mx-5 mb-4 border-b border-chalk bg-paper/95 px-5 pt-4 pb-3 backdrop-blur dark:border-charcoal dark:bg-coal/95">
				<h1 className="mt-0 mb-2 text-2xl md:text-3xl">Glossary</h1>
				<p className="mb-3 text-sm text-smoke dark:text-sand">
					Syrups, modifiers, and tinctures used across these recipes — with
					home-made recipes where they apply.
				</p>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search glossary"
					aria-label="Search glossary entries"
					className="text-input max-w-[400px]"
				/>
			</div>

			{filtered.length === 0 ? (
				<p className="text-center text-sm text-smoke dark:text-sand">
					{query ? 'No matching entries.' : 'No glossary entries yet.'}
				</p>
			) : (
				<ul className="m-0 list-none divide-y divide-chalk p-0 dark:divide-charcoal">
					{filtered.map((e) => {
						const slug = glossarySlug(e.name);
						const meta = lookupGlossaryDefinition(slug);
						const recipeOpen = openRecipes.has(slug);
						return (
							<li
								key={slug}
								id={slug}
								className="scroll-mt-36 py-4 target:bg-gold-tint/40 dark:target:bg-brass/10">
								<div className="flex items-baseline justify-between gap-3">
									<span className="font-medium capitalize text-ink dark:text-cream">
										{e.name}
									</span>
									<span className="rounded-full border border-chalk px-2 py-0.5 text-xs text-smoke dark:border-charcoal dark:text-sand">
										{categoryLabel(e.category)}
									</span>
								</div>
								{meta?.definition ? (
									<p className="mt-1 text-sm text-smoke dark:text-sand">
										{meta.definition}
									</p>
								) : null}
								<ul className="mt-2 flex flex-wrap gap-1.5 list-none p-0">
									{e.drinks.map((d) => (
										<li key={d.id}>
											<button
												type="button"
												onClick={() => setSelected(d)}
												className="rounded-full border border-chalk bg-paper px-2.5 py-0.5 text-xs capitalize text-ink hover:border-brass/40 hover:bg-palm/10 dark:border-charcoal dark:bg-coal dark:text-cream dark:hover:border-brass/40 dark:hover:bg-brass/10">
												{d.name}
											</button>
										</li>
									))}
								</ul>
								{meta?.recipe ? (
									<div className="mt-2">
										<button
											type="button"
											onClick={() => toggleRecipe(slug)}
											aria-expanded={recipeOpen}
											aria-controls={`${slug}-recipe`}
											className="link text-xs underline decoration-dotted underline-offset-2">
											{recipeOpen ? 'Hide recipe' : 'Show recipe'}
										</button>
										{recipeOpen ? (
											<div
												id={`${slug}-recipe`}
												className="mt-2 rounded-md border border-chalk bg-paper/60 p-3 text-sm text-smoke dark:border-charcoal dark:bg-coal/40 dark:text-sand">
												{meta.recipe.yield ? (
													<p className="m-0 text-xs italic opacity-80">
														{meta.recipe.yield}
													</p>
												) : null}
												<p className="mt-2 mb-1 text-xs font-medium uppercase tracking-wide">
													Ingredients
												</p>
												<ul className="m-0 list-disc pl-5">
													{meta.recipe.ingredients.map((ing, i) => (
														<li key={i}>{ing}</li>
													))}
												</ul>
												<p className="mt-3 mb-1 text-xs font-medium uppercase tracking-wide">
													Method
												</p>
												<ol className="m-0 list-decimal pl-5">
													{meta.recipe.steps.map((s, i) => (
														<li key={i}>{s}</li>
													))}
												</ol>
												{meta.recipe.notes ? (
													<p className="mt-3 mb-0 text-xs italic opacity-85">
														{meta.recipe.notes}
													</p>
												) : null}
											</div>
										) : null}
									</div>
								) : null}
							</li>
						);
					})}
				</ul>
			)}

			<AnimatePresence>
				{selected ? (
					<DrinkDetailModal
						drink={selected}
						onClose={() => setSelected(null)}
					/>
				) : null}
			</AnimatePresence>
		</div>
	);
}
