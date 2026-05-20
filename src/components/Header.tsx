import { NavLink } from 'react-router-dom';
import logoSvg from '../assets/icons/swizzle-logo.svg?raw';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
	return (
		<header className="app-container flex items-center justify-between pt-4">
			<NavLink
				to="/"
				end
				aria-label="Swizzle home"
				className="brand-logo inline-flex h-12.5 items-center text-ink dark:text-cream"
				dangerouslySetInnerHTML={{ __html: logoSvg }}
			/>
			<nav className="flex flex-wrap gap-3">
				<NavLink
					to="/families"
					className={({ isActive }) =>
						isActive ? 'link current active' : 'link'
					}>
					Families
				</NavLink>
				<NavLink
					to="/admin"
					className={({ isActive }) =>
						isActive ? 'link current active' : 'link'
					}>
					Admin
				</NavLink>
				<ThemeToggle />
			</nav>
		</header>
	);
}
