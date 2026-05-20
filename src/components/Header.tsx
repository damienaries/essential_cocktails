import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import logoSvg from '../assets/icons/swizzle-logo.svg?raw';
import { SvgIcon } from './atoms/SvgIcon';

function navLinkClass({ isActive }: { isActive: boolean }) {
	return isActive ? 'link current active' : 'link';
}

export function Header() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { pathname } = useLocation();

	useEffect(() => {
		setDrawerOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!drawerOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setDrawerOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [drawerOpen]);

	return (
		<header className="app-container flex items-center justify-between pt-4">
			<NavLink
				to="/"
				end
				aria-label="Swizzle home"
				className="brand-logo inline-flex h-12.5 items-center text-ink dark:text-cream"
				dangerouslySetInnerHTML={{ __html: logoSvg }}
			/>

			<nav className="hidden flex-wrap gap-3 md:flex">
				<NavLink to="/families" className={navLinkClass}>
					Families
				</NavLink>
				<NavLink to="/admin" className={navLinkClass}>
					Admin
				</NavLink>
			</nav>

			<button
				type="button"
				className="link inline-flex cursor-pointer items-center md:hidden"
				aria-label="Open navigation menu"
				aria-expanded={drawerOpen}
				aria-controls="mobile-nav-drawer"
				onClick={() => setDrawerOpen(true)}>
				<SvgIcon icon="menu" size={24} />
			</button>

			<AnimatePresence>
				{drawerOpen ? (
					<>
						<motion.div
							className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18 }}
							onClick={() => setDrawerOpen(false)}
							aria-hidden
						/>
						<motion.aside
							id="mobile-nav-drawer"
							className="fixed inset-y-0 right-0 z-50 flex h-svh w-72 max-w-[85vw] flex-col bg-paper px-5 py-4 shadow-2xl dark:bg-coal md:hidden"
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '100%' }}
							transition={{ duration: 0.22, ease: 'easeOut' }}
							role="dialog"
							aria-modal="true"
							aria-label="Site navigation">
							<div className="mb-6 flex items-center justify-between">
								<span className="text-xs uppercase tracking-wide text-smoke dark:text-sand">
									Menu
								</span>
								<button
									type="button"
									className="link inline-flex h-9 w-9 cursor-pointer items-center justify-center"
									aria-label="Close menu"
									onClick={() => setDrawerOpen(false)}>
									<span aria-hidden className="text-2xl leading-none">
										×
									</span>
								</button>
							</div>
							<nav className="flex flex-col gap-5 text-lg">
								<NavLink to="/" end className={navLinkClass}>
									Home
								</NavLink>
								<NavLink to="/families" className={navLinkClass}>
									Families
								</NavLink>
								<NavLink to="/admin" className={navLinkClass}>
									Admin
								</NavLink>
							</nav>
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>
		</header>
	);
}
