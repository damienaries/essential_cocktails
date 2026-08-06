import { useCallback } from 'react';
import {
	matchPath,
	useLocation,
	useNavigate,
	type Location,
} from 'react-router-dom';
import { drinkSlug } from '../lib/slug';
import type { Drink } from '../types/drink';

export const DRINK_ROUTE_PATTERN = '/drinks/:slug';

/**
 * The drink modal lives at its own URL so it can be shared and so the back button
 * closes it. `background` is the page that was showing when it opened, which keeps
 * that page rendered underneath instead of swapping it out. `siblingIds` carries the
 * list the drink was picked from, so prev/next still walks the family or search
 * results rather than the whole library.
 */
export type DrinkRouteState = {
	background?: Location;
	siblingIds?: string[];
};

export type DrinkRouteMatch = {
	slug: string | undefined;
	/** Set when the current URL is a drink URL. */
	isOpen: boolean;
	background: Location | undefined;
	siblingIds: string[] | undefined;
};

export function useDrinkRoute(): DrinkRouteMatch {
	const location = useLocation();
	const state = (location.state ?? null) as DrinkRouteState | null;
	const match = matchPath(DRINK_ROUTE_PATTERN, location.pathname);

	return {
		slug: match?.params.slug,
		isOpen: match !== null,
		background: state?.background,
		siblingIds: state?.siblingIds,
	};
}

/**
 * The location `<Routes>` should render. A drink URL is an overlay, not a page, so it
 * resolves to the page the modal was opened from — or the home grid when someone
 * arrives on a drink link cold and there's nothing underneath yet.
 */
export function useRoutedLocation(): Location {
	const location = useLocation();
	const { isOpen, background } = useDrinkRoute();

	if (!isOpen) return location;
	return background ?? { ...location, pathname: '/', search: '' };
}

/**
 * Opens a drink by navigating rather than by local state, so the URL is shareable.
 * `siblings` is the list being browsed; pass it to keep prev/next scoped to it.
 */
export function useOpenDrink() {
	const navigate = useNavigate();
	const location = useLocation();

	return useCallback(
		(drink: Drink, siblings?: Drink[]) => {
			const state: DrinkRouteState = {
				background: location,
				siblingIds: siblings?.map((d) => d.id),
			};
			navigate(`/drinks/${drinkSlug(drink)}`, { state });
		},
		[navigate, location],
	);
}
