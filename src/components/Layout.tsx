import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith('/admin');

	return (
		<div className="flex min-h-[100svh] flex-col">
			<Header />

			<main className="app-container flex-1 py-6">
				{isAdmin ? (
					<Outlet />
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={pathname}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
						>
							<Outlet />
						</motion.div>
					</AnimatePresence>
				)}
			</main>

			<Footer />
		</div>
	);
}
