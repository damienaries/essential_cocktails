import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { useLogout } from '../hooks/useLogout';
import { Avatar } from './atoms/Avatar';

// Desktop account control: a "Login" link when signed out, or an avatar that
// opens a dropdown with Account/Logout when signed in. The mobile equivalent
// lives inline at the bottom of the nav drawer in Header.
export function UserMenu() {
	const { user, isPending } = useAuthUser();
	const logout = useLogout();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};
		document.addEventListener('mousedown', onDocClick);
		window.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('mousedown', onDocClick);
			window.removeEventListener('keydown', onKey);
		};
	}, [open]);

	if (isPending) return null;

	if (!user) {
		return (
			<NavLink to="/signin" className="link">
				Login
			</NavLink>
		);
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				type="button"
				className="inline-flex cursor-pointer items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60"
				aria-haspopup="menu"
				aria-expanded={open}
				aria-label="Account menu"
				onClick={() => setOpen((v) => !v)}>
				<Avatar
					name={user.displayName}
					email={user.email}
					photoURL={user.photoURL}
					size={32}
				/>
			</button>

			{open ? (
				<div
					role="menu"
					className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-chalk bg-paper py-1 shadow-md dark:border-charcoal dark:bg-coal">
					<NavLink
						to="/account"
						role="menuitem"
						className="block px-4 py-2 text-sm text-ink hover:bg-chalk dark:text-cream dark:hover:bg-carbon"
						onClick={() => setOpen(false)}>
						Account
					</NavLink>
					<button
						type="button"
						role="menuitem"
						className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-ink hover:bg-chalk dark:text-cream dark:hover:bg-carbon"
						onClick={() => {
							setOpen(false);
							void logout();
						}}>
						Logout
					</button>
				</div>
			) : null}
		</div>
	);
}
