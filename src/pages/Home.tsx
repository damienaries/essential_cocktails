import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CocktailCard } from '../components/CocktailCard';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import { LetterFilterToolbar } from '../components/LetterFilterToolbar';
import { filterDrinks } from '../lib/filterDrinks';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useLetterFilter } from '../hooks/useLetterFilter';
import type { Drink } from '../types/drink';

export function HomePage() {
	const [search, setSearch] = useState('');
	const [selected, setSelected] = useState<Drink | null>(null);
	const { data, isPending, isError, error } = useDrinksQuery();

	const sortedAfterSearch = useMemo(() => {
		const filtered = filterDrinks(data ?? [], search);
		return [...filtered].sort((a, b) =>
			(a.name ?? '').localeCompare(b.name ?? '', undefined, {
				sensitivity: 'base',
			}),
		);
	}, [data, search]);

	const { letterFilter, setLetterFilter, lettersPresent, filteredByLetter } =
		useLetterFilter(sortedAfterSearch);

	return (
		<div className="mx-auto max-w-[1120px]">
			<div className="mb-6 text-center">
				<h1 className="mt-0">Swizzle</h1>
				<p className="mb-4 text-[var(--text)]">
					Upgrade your classic cocktails, reviewed and used by bar
					professionals.
				</p>
				<input
					id="drink-search"
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					autoComplete="off"
					aria-label="Search drinks"
					placeholder="Search by name, family, or ingredient"
					className="mx-auto block w-1/2 max-w-[600px] rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-base text-[var(--text-h)]"
				/>
				<div className="flex items-center justify-between w-1/2 max-w-[600px] mx-auto">
					<p className="mt-2 text-sm">
						<Link to="/families" className="text-[var(--accent)]">
							Browse by family
						</Link>
					</p>
					{!isPending && !isError ? (
						<p className="mt-1 text-sm text-[var(--text)]">
							Showing {filteredByLetter.length} of {(data ?? []).length}
						</p>
					) : null}
				</div>
			</div>

			{!isPending && !isError ? (
				<LetterFilterToolbar
					lettersPresent={lettersPresent}
					letterFilter={letterFilter}
					onChange={setLetterFilter}
				/>
			) : null}

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
			) : filteredByLetter.length === 0 ? (
				<p className="text-center text-sm text-[var(--text)]">
					No drinks match this filter.
				</p>
			) : (
				<section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
					{filteredByLetter.map((drink) => (
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
