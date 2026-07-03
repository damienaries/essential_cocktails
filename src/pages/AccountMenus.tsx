import { useMenus } from '../hooks/useMenus';

// Placeholder: reads the real menus query. Create/rename/delete + detail view
// land in the menus step.
export function AccountMenusPage() {
	const { data: menus = [], isLoading } = useMenus();

	if (isLoading) {
		return <p className="text-sm text-smoke dark:text-sand">Loading…</p>;
	}
	if (!menus.length) {
		return (
			<p className="text-sm text-smoke dark:text-sand">
				No menus yet — you'll be able to build custom menus from existing drinks
				here.
			</p>
		);
	}
	return (
		<p className="text-sm text-smoke dark:text-sand">
			{menus.length} menu{menus.length === 1 ? '' : 's'}.
		</p>
	);
}
