import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import logoSvg from '../assets/icons/swizzle-logo.svg?raw';
import { SvgIcon } from './atoms/SvgIcon';
import { Avatar } from './atoms/Avatar';
import { UserMenu } from './UserMenu';
import { useAuthUser } from '../hooks/useAuthUser';
import { useLogout } from '../hooks/useLogout';

function navLinkClass({ isActive }: { isActive: boolean }) {
	return isActive ? 'link current active' : 'link';
}

/** Section heading inside the mobile drawer. */
const drawerSectionClass =
	'mb-4 text-xs font-normal uppercase tracking-wide text-smoke dark:text-sand';

export function Header() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { pathname } = useLocation();
	const { user, isPending, isAdmin } = useAuthUser();
	const logout = useLogout();

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
		// Sticky on mobile only, where the drink list runs long. `sticky` reserves its
		// own space, so nothing hides underneath it. The background matches the page
		// so it stays invisible on desktop, where it reverts to static.
		<header className="app-container sticky top-0 z-30 flex items-center justify-between bg-paper pt-4 pb-3 md:static md:pb-0 dark:bg-coal">
			<NavLink
				to="/"
				end
				aria-label="Swizzle home"
				className="brand-logo inline-flex h-14 items-center text-ink dark:text-cream"
				dangerouslySetInnerHTML={{ __html: logoSvg }}
			/>

			<nav className="hidden flex-wrap items-center gap-3 md:flex">
				<NavLink to="/families" className={navLinkClass}>
					Families
				</NavLink>
				<NavLink to="/about" className={navLinkClass}>
					About
				</NavLink>
				{isAdmin ? (
					<NavLink to="/admin" className={navLinkClass}>
						Admin
					</NavLink>
				) : null}
				<UserMenu />
			</nav>

			<button
				type="button"
				className="link inline-flex cursor-pointer items-center md:hidden"
				aria-label="Open navigation menu"
				aria-expanded={drawerOpen}
				aria-controls="mobile-nav-drawer"
				onClick={() => setDrawerOpen(true)}>
				<SvgIcon icon="menu" size={32} />
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
							<div className="mb-6 flex items-center justify-end">
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

							<nav className="flex flex-col gap-8" aria-label="Site sections">
								<section>
									<h2 className={drawerSectionClass}>Pages</h2>
									<div className="flex flex-col gap-5 text-lg">
										<NavLink to="/" end className={navLinkClass}>
											Home
										</NavLink>
										<NavLink to="/families" className={navLinkClass}>
											Families
										</NavLink>
										<NavLink to="/about" className={navLinkClass}>
											About
										</NavLink>
									</div>
								</section>

								{/* The account tabs are surfaced directly — reaching a menu shouldn't
								    cost two taps. Hidden when signed out, since each one gates. */}
								{user ? (
									<section>
										<h2 className={drawerSectionClass}>My Swizzle</h2>
										<div className="flex flex-col gap-5 text-lg">
											<NavLink to="/account/menus" className={navLinkClass}>
												Menus
											</NavLink>
											<NavLink to="/account/saved" className={navLinkClass}>
												Saved
											</NavLink>
											<NavLink to="/account/profile" className={navLinkClass}>
												Profile
											</NavLink>
										</div>
									</section>
								) : null}
							</nav>

							<div className="mt-auto border-t border-chalk pt-5 text-lg dark:border-charcoal">
								{isPending ? null : user ? (
									<div className="flex flex-col gap-4">
										<div className="flex items-center gap-3">
											<Avatar
												name={user.displayName}
												email={user.email}
												photoURL={user.photoURL}
												size={36}
											/>
											<span className="min-w-0 truncate text-sm text-smoke dark:text-sand">
												{user.displayName?.trim() || user.email}
											</span>
										</div>
										{isAdmin ? (
											<NavLink to="/admin" className={navLinkClass}>
												Admin
											</NavLink>
										) : null}
										<button
											type="button"
											className="link cursor-pointer text-left"
											onClick={() => void logout()}>
											Logout
										</button>
									</div>
								) : (
									<NavLink to="/signin" className={navLinkClass}>
										Login
									</NavLink>
								)}
							</div>
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>
		</header>
	);
}
