import { useAuthUser } from '../hooks/useAuthUser';
import { useLogout } from '../hooks/useLogout';
import { Avatar } from '../components/atoms/Avatar';
import { Button } from '../components/atoms/Button';

export function AccountPage() {
	const { user, isAdmin } = useAuthUser();
	const logout = useLogout();

	// Route is wrapped in RequireAuth, so `user` is present here.
	if (!user) return null;

	const displayName = user.displayName?.trim();

	return (
		<div className="mx-auto max-w-100 pb-15">
			<h1 className="mt-0 mb-6 text-2xl md:text-3xl">Account</h1>

			<div className="mb-8 flex items-center gap-4">
				<Avatar
					name={user.displayName}
					email={user.email}
					photoURL={user.photoURL}
					size={56}
				/>
				<div className="min-w-0">
					<p className="m-0 truncate text-ink dark:text-cream">
						{displayName || user.email}
					</p>
					{isAdmin ? (
						<span className="mt-1 inline-block rounded-full border border-brass/40 bg-brass/15 px-2 py-0.5 text-xs text-ink dark:text-cream">
							Admin
						</span>
					) : null}
				</div>
			</div>

			<Button type="button" color="danger" onClick={() => void logout()}>
				Logout
			</Button>
		</div>
	);
}
