import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith('/admin');

	return (
		<div className="flex min-h-svh flex-col">
			<Header />

			<main className="app-container flex-1 pt-6 pb-12">
				{isAdmin ? (
					<Outlet />
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={pathname}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}>
							<Outlet />
						</motion.div>
					</AnimatePresence>
				)}
			</main>

			<Footer />
		</div>
	);
}
