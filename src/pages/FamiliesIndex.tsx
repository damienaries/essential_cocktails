import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CocktailCard } from '../components/CocktailCard';
import { DataLoadError } from '../components/DataLoadError';
import {
	COCKTAIL_FAMILIES,
	drinkInFamily,
	normalizeFamilyName,
} from '../constants/families';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useOpenDrink } from '../hooks/useDrinkRoute';

export function FamiliesIndexPage() {
	const openDrink = useOpenDrink();
	const { data, isPending, isError, error, refetch } = useDrinksQuery();

	const families = useMemo(() => {
		const drinks = data ?? [];
		return COCKTAIL_FAMILIES.map((fam) => {
			const familyKey = normalizeFamilyName(fam.label);
			const inFamily = drinks
				.filter((d) => drinkInFamily(d, familyKey))
				.sort((a, b) =>
					(a.name ?? '').localeCompare(b.name ?? '', undefined, {
						sensitivity: 'base',
					}),
				);
			const namesake = inFamily.find(
				(d) => normalizeFamilyName(d.name) === familyKey,
			);
			const variations = namesake
				? inFamily.filter((d) => d.id !== namesake.id)
				: inFamily;
			return { ...fam, namesake, variations, total: inFamily.length };
		});
	}, [data]);

	const flatDrinks = useMemo(() => {
		const seen = new Set<string>();
		return families
			.flatMap(({ namesake, variations, total }) =>
				total === 0 ? [] : [...(namesake ? [namesake] : []), ...variations],
			)
			.filter((d) => {
				if (seen.has(d.id)) return false;
				seen.add(d.id);
				return true;
			});
	}, [families]);

	if (isPending) {
		return <p className="text-center">Loading drinks…</p>;
	}

	if (isError) {
		return (
			<DataLoadError
				subject="the drinks"
				error={error}
				onRetry={() => void refetch()}
			/>
		);
	}

	return (
		<>
			<h1 className="mt-0 mb-8">Cocktail families</h1>
			<p className="mb-8 text-smoke dark:text-sand">
				Each family is built around a namesake recipe, with variations that
				twist the spec.
			</p>

			<div className="flex flex-col gap-10">
				{families.map(({ slug, label, namesake, variations, total }) => {
					if (total === 0) return null;
					return (
						<section key={slug}>
							<header className="mb-3 flex items-baseline justify-between gap-3">
								<Link
									to={`/families/${slug}`}
									className="text-ink no-underline hover:underline dark:text-cream">
									<h2 className="m-0">{label}</h2>
								</Link>
								<span className="text-sm text-smoke dark:text-sand">
									{total} drink{total === 1 ? '' : 's'}
								</span>
							</header>
							<div
								className="flex snap-x snap-mandatory gap-4 overflow-x-auto pl-8 pr-5 pb-3"
								role="list"
								aria-label={`${label} family drinks`}>
								{namesake ? (
									<div
										role="listitem"
										className="w-[78%] max-w-[460px] flex-none snap-start md:w-[420px]">
										<CocktailCard
										drink={namesake}
										onSelect={(d) => openDrink(d, flatDrinks)}
									/>
									</div>
								) : null}
								{variations.map((d) => (
									<div
										key={d.id}
										role="listitem"
										className="w-[55%] max-w-[260px] flex-none snap-start md:w-[240px]">
										<CocktailCard
										drink={d}
										onSelect={(picked) => openDrink(picked, flatDrinks)}
									/>
									</div>
								))}
							</div>
						</section>
					);
				})}
			</div>

		</>
	);
}
