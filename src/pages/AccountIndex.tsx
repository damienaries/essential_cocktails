import { Navigate } from 'react-router-dom';
import { useMenus } from '../hooks/useMenus';
import { useSavedDrinks } from '../hooks/useSavedDrinks';

/**
 * Landing tab for `/account`. Profile is mostly settings, so send returning users
 * straight to the content they actually have — saved drinks first, then menus —
 * and only fall back to profile when both are empty.
 */
export function AccountIndexPage() {
	const { data: saved, isLoading: savedLoading } = useSavedDrinks();
	const { data: menus, isLoading: menusLoading } = useMenus();

	// Both counts have to be known first; deciding early would flash the wrong tab.
	if (savedLoading || menusLoading) {
		return <p className="text-sm text-smoke dark:text-sand">Loading…</p>;
	}

	if (saved?.length) return <Navigate to="/account/saved" replace />;
	if (menus?.length) return <Navigate to="/account/menus" replace />;
	return <Navigate to="/account/profile" replace />;
}
