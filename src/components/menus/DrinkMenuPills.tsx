import { useMenus, useUpdateMenu } from '../../hooks/useMenus';

type Props = {
	drinkId: string;
};

/**
 * The menus this drink is already on, each removable. Lives in the details panel
 * rather than over the photo — the add button belongs with the other actions, but a
 * growing row of names doesn't.
 */
export function DrinkMenuPills({ drinkId }: Props) {
	const { data: menus = [] } = useMenus();
	const updateMenu = useUpdateMenu();

	const onMenus = menus.filter((m) => m.drinkIds.includes(drinkId));
	if (!onMenus.length) return null;

	const remove = (menuId: string, drinkIds: string[]) => {
		updateMenu.mutate({
			menuId,
			patch: { drinkIds: drinkIds.filter((id) => id !== drinkId) },
		});
	};

	return (
		<ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
			{onMenus.map((menu) => (
				<li key={menu.id}>
					<button
						type="button"
						onClick={() => remove(menu.id, menu.drinkIds)}
						aria-label={`Remove from ${menu.name}`}
						className="flex cursor-pointer items-center gap-1 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-xs text-ink transition-colors hover:border-brass dark:text-cream">
						<span className="max-w-40 truncate">{menu.name}</span>
						<span aria-hidden className="text-smoke dark:text-sand">
							×
						</span>
					</button>
				</li>
			))}
		</ul>
	);
}
