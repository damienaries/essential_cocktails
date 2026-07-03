import { useSavedDrinks } from '../hooks/useSavedDrinks';

// Placeholder: reads the real saved-drinks query. The CocktailCard grid lands
// alongside the save toggle (next step).
export function AccountSavedPage() {
	const { data: saved = [], isLoading } = useSavedDrinks();

	if (isLoading) {
		return <p className="text-sm text-smoke dark:text-sand">Loading…</p>;
	}
	if (!saved.length) {
		return (
			<p className="text-sm text-smoke dark:text-sand">
				No saved drinks yet — tap the heart on a drink to save it.
			</p>
		);
	}
	return (
		<p className="text-sm text-smoke dark:text-sand">
			{saved.length} saved drink{saved.length === 1 ? '' : 's'}.
		</p>
	);
}
