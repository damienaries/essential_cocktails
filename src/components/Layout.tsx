import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
	return (
		<div
			style={{ display: 'flex', flexDirection: 'column', minHeight: '100svh' }}
		>
			<Header />

			<main style={{ flex: 1, padding: '24px 20px' }}>
				<Outlet />
			</main>
		</div>
	);
}
