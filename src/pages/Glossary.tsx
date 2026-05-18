import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import { useGlossaryQuery } from '../hooks/useGlossaryQuery';
import {
	categoryLabel,
	glossarySlug,
} from '../lib/ingredientCategory';
import type { Drink } from '../types/drink';

export function GlossaryPage() {
	const { entries, isPending, isError, error } = useGlossaryQuery();
	const [selected, setSelected] = useState<Drink | null>(null);
	const [query, setQuery] = useState('');
	const { hash } = useLocation();

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
					Syrups and modifiers used across these recipes. Home-made versions
					coming soon.
				</p>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search glossary"
					aria-label="Search glossary entries"
					className="w-full max-w-[400px] rounded-md border border-chalk bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke focus:outline-2 focus:outline-offset-2 focus:outline-brass/50 dark:border-charcoal dark:bg-coal dark:text-cream dark:placeholder:text-sand"
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
