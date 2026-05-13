import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CocktailCard } from '../components/CocktailCard';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import { COCKTAIL_FAMILIES, normalizeFamilyName } from '../constants/families';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import type { Drink } from '../types/drink';

export function FamiliesIndexPage() {
	const [selected, setSelected] = useState<Drink | null>(null);
	const { data, isPending, isError, error } = useDrinksQuery();

	const families = useMemo(() => {
		const drinks = data ?? [];
		return COCKTAIL_FAMILIES.map((fam) => {
			const familyKey = normalizeFamilyName(fam.label);
			const inFamily = drinks
				.filter((d) => normalizeFamilyName(d.family) === familyKey)
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

	if (isPending) {
		return <p className="text-center">Loading drinks…</p>;
	}

	if (isError) {
		return (
			<p role="alert" className="text-center">
				Could not load drinks:{' '}
				{error instanceof Error ? error.message : 'Unknown error'}
			</p>
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
								className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3"
								role="list"
								aria-label={`${label} family drinks`}>
								{namesake ? (
									<div
										role="listitem"
										className="w-[78%] max-w-[460px] flex-none snap-start md:w-[420px]">
										<CocktailCard drink={namesake} onSelect={setSelected} />
									</div>
								) : null}
								{variations.map((d) => (
									<div
										key={d.id}
										role="listitem"
										className="w-[55%] max-w-[260px] flex-none snap-start md:w-[240px]">
										<CocktailCard drink={d} onSelect={setSelected} />
									</div>
								))}
							</div>
						</section>
					);
				})}
			</div>

			<AnimatePresence>
				{selected ? (
					<DrinkDetailModal
						drink={selected}
						onClose={() => setSelected(null)}
					/>
				) : null}
			</AnimatePresence>
		</>
	);
}
