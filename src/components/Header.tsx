import { NavLink } from 'react-router-dom';

export function Header() {
	return (
		<header
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'baseline',
				padding: '16px 20px',
				borderBottom: '1px solid var(--border)',
			}}
		>
			<NavLink
				to="/"
				end
				style={{ fontWeight: 600, color: 'var(--text-h)', textDecoration: 'none' }}
			>
				Swizzle
			</NavLink>
			<nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
				<NavLink to="/families">Families</NavLink>
				<NavLink to="/admin">Admin</NavLink>
			</nav>
		</header>
	);
}
