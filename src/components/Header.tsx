import { NavLink } from 'react-router-dom';
import logoSvg from '../assets/icons/swizzle-logo.svg?raw';

export function Header() {
	return (
		<header
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '16px 20px 0',
				borderBottom: '1px solid var(--border)',
			}}>
			<NavLink
				to="/"
				end
				aria-label="Swizzle home"
				className="brand-logo"
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					color: 'var(--logo-color)',
					height: 50,
				}}
				dangerouslySetInnerHTML={{ __html: logoSvg }}
			/>
			<nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
				<NavLink to="/families">Families</NavLink>
				<NavLink to="/admin">Admin</NavLink>
			</nav>
		</header>
	);
}
