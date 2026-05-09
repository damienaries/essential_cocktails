import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
	return (
		<div className="flex min-h-[100svh] flex-col">
			<Header />

			<main className="flex-1 px-5 py-6">
				<Outlet />
			</main>
		</div>
	);
}
