import { NavLink, Outlet } from 'react-router-dom';
import { AdminBannerProvider } from '../components/admin/AdminBanner';

function navClass(isActive: boolean): string {
	return [
		'text-sm px-3 py-1.5 rounded-md border transition-colors',
		isActive
			? 'border-brass/40 bg-brass/10 text-ink dark:text-cream'
			: 'border-transparent text-smoke hover:bg-chalk dark:text-sand dark:hover:bg-carbon',
	].join(' ');
}

export function AdminLayout() {
	return (
		<section className="w-full max-w-6xl mx-auto pb-16 px-4 text-left box-border">
			<h1 className="text-ink dark:text-cream text-3xl mb-2">Admin</h1>

			<nav
				className="flex flex-wrap gap-2 mb-8 border-b border-chalk dark:border-charcoal pb-3"
				aria-label="Admin sections">
				<NavLink
					to="/admin/add"
					className={({ isActive }) => navClass(isActive)}>
					Add drink
				</NavLink>
				<NavLink
					to="/admin/list"
					className={({ isActive }) => navClass(isActive)}>
					All drinks
				</NavLink>
			</nav>

			<AdminBannerProvider>
				<Outlet />
			</AdminBannerProvider>
		</section>
	);
}
