import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { BackToTop } from './BackToTop';
import { Footer } from './Footer';
import { Header } from './Header';

export function Layout() {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith('/admin');
	// Only the long drink grids scroll far enough to need it.
	const showBackToTop = pathname === '/' || pathname.startsWith('/families');

	return (
		<div className="flex min-h-svh flex-col">
			<Header />

			{/* Mobile trims its top padding: the sticky header already carries a gap
			    below the logo, so keeping pt-6 there would double the space. */}
			<main className="app-container flex-1 pt-3 pb-12 md:pt-6">
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
			{showBackToTop ? <BackToTop /> : null}
		</div>
	);
}
