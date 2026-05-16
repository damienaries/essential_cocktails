import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { CocktailCard } from '../components/CocktailCard';
import { DrinkDetailModal } from '../components/DrinkDetailModal';
import {
	COCKTAIL_FAMILIES,
	isFamilySlug,
	normalizeFamilyName,
	slugToFamilyFilter,
} from '../constants/families';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import type { Drink } from '../types/drink';

export function FamilyDrinksPage() {
	const { slug } = useParams<{ slug: string }>();
	const [selected, setSelected] = useState<Drink | null>(null);
	const { data, isPending, isError, error } = useDrinksQuery();

	const label = useMemo(() => {
		if (!slug || !isFamilySlug(slug)) return null;
		return COCKTAIL_FAMILIES.find((f) => f.slug === slug)?.label ?? slug;
	}, [slug]);

	const filtered = useMemo(() => {
		if (!slug || !isFamilySlug(slug) || !data) return [];
		const key = slugToFamilyFilter(slug);
		return data.filter((d) => normalizeFamilyName(d.family) === key);
	}, [data, slug]);

	if (!slug || !isFamilySlug(slug)) {
		return (
			<div className="max-w-[720px]">
				<p>Unknown family.</p>
				<Link to="/families" className="link">
					Back to families
				</Link>
			</div>
		);
	}

	if (isPending) {
		return <p className="text-center">Loading drinks…</p>;
	}

	if (isError) {
		return (
			<div className="max-w-[720px]">
				<p role="alert">
					Could not load drinks:{' '}
					{error instanceof Error ? error.message : 'Unknown error'}
				</p>
				<Link to="/families" className="link">
					Back to families
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="mb-5">
				<Link to="/families" className="link mb-6">
					← All families
				</Link>
				<h1 className="mb-6">{label}</h1>
			</div>

			<section className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
				{filtered.map((drink) => (
					<CocktailCard key={drink.id} drink={drink} onSelect={setSelected} />
				))}
			</section>

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
