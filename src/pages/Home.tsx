import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/images/hero-bg.webp';
import { CocktailCard } from '../components/CocktailCard';
import { DataLoadError } from '../components/DataLoadError';
import { LetterFilterToolbar } from '../components/LetterFilterToolbar';
import { filterDrinks } from '../lib/filterDrinks';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useLetterFilter } from '../hooks/useLetterFilter';
import { useOpenDrink } from '../hooks/useDrinkRoute';

export function HomePage() {
	const [search, setSearch] = useState('');
	const openDrink = useOpenDrink();
	const { data, isPending, isError, error, refetch } = useDrinksQuery();

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
		<>
			<div className="relative mb-6 overflow-hidden rounded-lg">
				<img
					src={heroBg}
					alt="a low lit back bar background image"
					aria-hidden
					width={1672}
					height={941}
					className="absolute inset-0 h-full w-full object-cover"
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/75"
				/>
				<div className="relative px-4 py-12 text-center text-white sm:py-16">
					<h1 className="mt-0 text-white">Swizzle</h1>
					<p className="mb-6 text-white/85">
						Upgrade your classic cocktails, reviewed and used by the best bar
						professionals.
					</p>

					<div className="mx-auto w-full text-left max-w-[600px]">
						<input
							id="drink-search"
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							autoComplete="off"
							aria-label="Search drinks"
							placeholder="Search by name, family, or ingredient"
							className="w-full rounded-md mb-2 border border-white/25 bg-white/10 px-3 py-2.5 text-base text-white backdrop-blur placeholder:text-white/65 focus:outline-2 focus:outline-offset-2 focus:outline-brass/70"
						/>
						<Link
							to="/families"
							className="link text-white/90">
							Browse by family
						</Link>
					</div>
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
				<DataLoadError
					subject="the drinks"
					error={error}
					onRetry={() => void refetch()}
				/>
			) : filteredByLetter.length === 0 ? (
				<p className="text-center text-sm text-smoke dark:text-sand">
					No drinks match this filter.
				</p>
			) : (
				<section className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
					{filteredByLetter.map((drink) => (
						<CocktailCard
							key={drink.id}
							drink={drink}
							onSelect={(d) => openDrink(d, filteredByLetter)}
						/>
					))}
				</section>
			)}

		</>
	);
}
