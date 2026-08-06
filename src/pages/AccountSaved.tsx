import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CocktailCard } from '../components/CocktailCard';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useOpenDrink } from '../hooks/useDrinkRoute';
import { useSavedDrinks } from '../hooks/useSavedDrinks';
import type { Drink } from '../types/drink';

export function AccountSavedPage() {
	const openDrink = useOpenDrink();
	const { data: saved = [], isLoading: savedLoading } = useSavedDrinks();
	const { data: drinks, isPending: drinksPending } = useDrinksQuery();

	// Saved docs only store the drink id, so join against the cached drinks list and
	// keep the saved-at order. Ids with no matching drink (deleted since saving) drop out.
	const savedDrinks = useMemo(() => {
		if (!drinks) return [];
		const byId = new Map(drinks.map((d) => [d.id, d]));
		return saved
			.map((row) => byId.get(row.drinkId))
			.filter((d): d is Drink => d !== undefined);
	}, [drinks, saved]);

	if (savedLoading || drinksPending) {
		return <p className="text-sm text-smoke dark:text-sand">Loading…</p>;
	}

	if (!savedDrinks.length) {
		return (
			<p className="text-sm text-smoke dark:text-sand">
				No saved drinks yet — tap the heart on a drink to save it.{' '}
				<Link to="/" className="link">
					Browse drinks
				</Link>
			</p>
		);
	}

	return (
		<>
			<p className="mb-6 text-sm text-smoke dark:text-sand">
				{savedDrinks.length} saved drink{savedDrinks.length === 1 ? '' : 's'}.
			</p>

			<section className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
				{savedDrinks.map((drink) => (
					<CocktailCard
						key={drink.id}
						drink={drink}
						onSelect={(d) => openDrink(d, savedDrinks)}
					/>
				))}
			</section>

		</>
	);
}
