import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CocktailCard } from '../components/CocktailCard';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import { filterDrinks } from '../lib/filterDrinks';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import type { Drink } from '../types/drink';

export function HomePage() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Drink | null>(null);
	const { data, isPending, isError, error } = useDrinksQuery();

	const visible = useMemo(() => {
		const filtered = filterDrinks(data ?? [], search);
		return [...filtered].sort((a, b) =>
			(a.name ?? '').localeCompare(b.name ?? '', undefined, {
				sensitivity: 'base',
			}),
		);
	}, [data, search]);

	return (
		<div className="mx-auto max-w-[1120px]">
			<div className="mb-6 text-left">
				<h1 className="mt-0">Swizzle</h1>
				<p className="mb-4 text-[var(--text)]">
					A curated compendium of classic drinks for bartenders, managers, and
					cocktail enthusiasts.{' '}
					<Link to="/families" className="text-[var(--accent)]">
						Browse by family
					</Link>
					.
				</p>
				<label
					htmlFor="drink-search"
					className="mb-1.5 block text-sm"
				>
					Search by name, family, or ingredient
				</label>
				<input
					id="drink-search"
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					autoComplete="off"
					placeholder="e.g. martini, lime, rye…"
					className="w-full max-w-[400px] rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-base text-[var(--text-h)]"
				/>
				{!isPending && !isError ? (
					<p className="mt-2 text-sm text-[var(--text)]">
						Showing {visible.length} of {(data ?? []).length}
					</p>
				) : null}
			</div>

			{isPending ? (
				<p className="text-center">Loading drinks…</p>
			) : isError ? (
				<div>
					<p role="alert">
						Could not load drinks:{' '}
						{error instanceof Error ? error.message : 'Unknown error'}
					</p>
					<p className="text-[var(--text)]">
						If you just cloned the repo, add Firebase config in{' '}
						<code>.env.local</code> (see <code>.env.example</code>).
					</p>
				</div>
			) : (
				<section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
					{visible.map((drink) => (
						<CocktailCard key={drink.id} drink={drink} onSelect={setSelected} />
					))}
				</section>
			)}

			{selected ? (
				<DrinkDetailModal drink={selected} onClose={() => setSelected(null)} />
			) : null}
		</div>
	);
}
