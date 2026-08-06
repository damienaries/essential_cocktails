import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrinkRoute } from '../hooks/useDrinkRoute';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { drinkSlug, findDrinkBySlug } from '../lib/slug';
import type { Drink } from '../types/drink';
import { DrinkDetailModal } from './DrinkDetailModal';

/**
 * Renders the drink modal from the URL. Mounted above the routed page so the page
 * behind it stays put, and so a pasted `/drinks/:slug` link opens straight into it.
 */
export function DrinkRouteModal() {
	const navigate = useNavigate();
	const { slug, background, siblingIds } = useDrinkRoute();
	const { data: drinks } = useDrinksQuery();

	const drink = useMemo(
		() => findDrinkBySlug(drinks ?? [], slug),
		[drinks, slug],
	);

	// Prev/next walks the list the drink was opened from. A pasted link has no such
	// list, so it falls back to the whole library.
	const siblings = useMemo(() => {
		if (!drinks) return [];
		if (!siblingIds) return drinks;
		const byId = new Map(drinks.map((d) => [d.id, d]));
		return siblingIds
			.map((id) => byId.get(id))
			.filter((d): d is Drink => d !== undefined);
	}, [drinks, siblingIds]);

	// Nothing to show until the library lands; a bad slug just drops to the grid.
	if (!drinks) return null;
	if (!drink) {
		return null;
	}

	const close = () => {
		// Going back keeps history clean when the modal was opened in-app. A pasted
		// link has nothing to go back to, so it lands on the grid instead.
		if (background) navigate(-1);
		else navigate('/', { replace: true });
	};

	const goToDrink = (next: Drink) => {
		// `replace` so walking through ten drinks doesn't bury the page behind ten
		// history entries the back button has to chew through.
		navigate(`/drinks/${drinkSlug(next)}`, {
			replace: true,
			state: { background, siblingIds },
		});
	};

	return (
		<DrinkDetailModal
			drink={drink}
			drinks={siblings}
			onNavigate={goToDrink}
			onClose={close}
		/>
	);
}
