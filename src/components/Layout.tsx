import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
	return (
		<div className="flex min-h-[100svh] flex-col">
			<Header />

			<main className="app-container flex-1 py-6">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
}
