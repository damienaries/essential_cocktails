import { NavLink } from 'react-router-dom';
import logoSvg from '../assets/icons/swizzle-logo.svg?raw';

export function Header() {
	return (
		<header className="flex items-center justify-between border-b border-chalk px-5 pt-4 dark:border-charcoal">
			<NavLink
				to="/"
				end
				aria-label="Swizzle home"
				className="brand-logo inline-flex h-[50px] items-center text-ink dark:text-cream"
				dangerouslySetInnerHTML={{ __html: logoSvg }}
			/>
			<nav className="flex flex-wrap gap-3">
				<NavLink to="/families">Families</NavLink>
				<NavLink to="/admin">Admin</NavLink>
			</nav>
		</header>
	);
}
