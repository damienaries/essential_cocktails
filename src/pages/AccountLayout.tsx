import { NavLink, Outlet } from 'react-router-dom';

// Mirrors AdminLayout's tab styling for visual consistency across the app.
function navClass(isActive: boolean): string {
	return [
		'text-sm px-3 py-1.5 rounded-md border transition-colors',
		isActive
			? 'border-brass/40 bg-brass/10 text-ink dark:text-cream'
			: 'border-transparent text-smoke hover:bg-chalk dark:text-sand dark:hover:bg-carbon',
	].join(' ');
}

export function AccountLayout() {
	return (
		<section className="w-full max-w-6xl mx-auto pb-16 px-4 text-left box-border">
			<h1 className="text-ink dark:text-cream text-3xl mb-2">Account</h1>

			<nav
				className="flex flex-wrap gap-2 mb-8 border-b border-chalk dark:border-charcoal pb-3"
				aria-label="Account sections">
				<NavLink
					to="/account/profile"
					className={({ isActive }) => navClass(isActive)}>
					Profile
				</NavLink>
				<NavLink
					to="/account/saved"
					className={({ isActive }) => navClass(isActive)}>
					Saved
				</NavLink>
				<NavLink
					to="/account/menus"
					className={({ isActive }) => navClass(isActive)}>
					Menus
				</NavLink>
			</nav>

			<Outlet />
		</section>
	);
}
