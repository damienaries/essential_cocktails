import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import {
	MENU_SHEET_CAPACITY,
	MenuSheet,
} from '../components/menus/MenuSheet';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useMenu, useUpdateMenu } from '../hooks/useMenus';
import type { Drink } from '../types/drink';

export function AccountMenuDetailPage() {
	const { menuId } = useParams<{ menuId: string }>();
	const { data: menu, isPending: menuPending, isError } = useMenu(menuId);
	const { data: drinks, isPending: drinksPending } = useDrinksQuery();
	const updateMenu = useUpdateMenu();

	// `drinkIds` is the ordered source of truth; drinks deleted from the library
	// since they were added simply fall out of the join.
	const menuDrinks = useMemo(() => {
		if (!menu || !drinks) return [];
		const byId = new Map(drinks.map((d) => [d.id, d]));
		return menu.drinkIds
			.map((id) => byId.get(id))
			.filter((d): d is Drink => d !== undefined);
	}, [menu, drinks]);

	if (menuPending || drinksPending) {
		return <p className="text-sm text-smoke dark:text-sand">Loading…</p>;
	}

	if (isError || !menu) {
		return (
			<div>
				<p role="alert">That menu could not be found.</p>
				<Link to="/account/menus" className="link">
					Back to menus
				</Link>
			</div>
		);
	}

	const removeDrink = (drinkId: string) => {
		updateMenu.mutate({
			menuId: menu.id,
			patch: { drinkIds: menu.drinkIds.filter((id) => id !== drinkId) },
		});
	};

	const moveDrink = (index: number, delta: number) => {
		const next = [...menu.drinkIds];
		const target = index + delta;
		if (target < 0 || target >= next.length) return;
		[next[index], next[target]] = [next[target], next[index]];
		updateMenu.mutate({ menuId: menu.id, patch: { drinkIds: next } });
	};

	const overCapacity = menuDrinks.length > MENU_SHEET_CAPACITY;

	return (
		<div>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<Link to="/account/menus" className="link text-sm">
						← All menus
					</Link>
					<h2 className="mt-2 mb-0 text-ink dark:text-cream">{menu.name}</h2>
				</div>
				<Button onClick={() => window.print()}>Print menu</Button>
			</div>

			{overCapacity ? (
				<p className="mb-4 text-sm text-smoke dark:text-sand">
					{menuDrinks.length} drinks — a folded sheet reads best at{' '}
					{MENU_SHEET_CAPACITY} or fewer, so this one will run tight.
				</p>
			) : null}

			<MenuSheet name={menu.name} drinks={menuDrinks} />

			<section className="mt-8">
				<h3 className="mb-3 text-ink dark:text-cream">Drinks on this menu</h3>
				{!menuDrinks.length ? (
					<p className="text-sm text-smoke dark:text-sand">
						Nothing here yet — open any drink and use “Add to menu”.
					</p>
				) : (
					<ul className="m-0 flex list-none flex-col gap-2 p-0">
						{menuDrinks.map((drink, index) => (
							<li
								key={drink.id}
								className="flex items-center justify-between gap-3 rounded-md border border-chalk px-3 py-2 dark:border-charcoal">
								<span className="min-w-0 truncate text-sm text-ink dark:text-cream">
									{index + 1}. {drink.name}
								</span>
								<span className="flex shrink-0 items-center gap-1">
									<Button
										size="sm"
										color="secondary"
										onClick={() => moveDrink(index, -1)}
										disabled={index === 0}
										aria-label={`Move ${drink.name} up`}>
										↑
									</Button>
									<Button
										size="sm"
										color="secondary"
										onClick={() => moveDrink(index, 1)}
										disabled={index === menuDrinks.length - 1}
										aria-label={`Move ${drink.name} down`}>
										↓
									</Button>
									<Button
										size="sm"
										color="danger"
										onClick={() => removeDrink(drink.id)}
										aria-label={`Remove ${drink.name} from this menu`}>
										Remove
									</Button>
								</span>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
