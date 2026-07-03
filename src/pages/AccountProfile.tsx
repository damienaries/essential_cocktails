import { useState, type FormEvent } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuthUser } from '../hooks/useAuthUser';
import { useLogout } from '../hooks/useLogout';
import { useTheme } from '../hooks/useTheme';
import { Avatar } from '../components/atoms/Avatar';
import { Button } from '../components/atoms/Button';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function AccountProfilePage() {
	const { user, isAdmin, refreshUser } = useAuthUser();
	const logout = useLogout();
	const { theme, setTheme } = useTheme();

	const [name, setName] = useState(user?.displayName ?? '');
	const [status, setStatus] = useState<SaveStatus>('idle');
	const [error, setError] = useState<string | null>(null);

	// Route is wrapped in RequireAuth, so `user` is present here.
	if (!user) return null;

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus('saving');
		setError(null);
		try {
			await updateProfile(user, { displayName: name.trim() });
			// updateProfile mutates the user in place without firing an auth event;
			// refreshUser propagates the new name to the header, avatar, etc.
			await refreshUser();
			setStatus('saved');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Could not save');
			setStatus('error');
		}
	};

	return (
		<div className="max-w-lg space-y-10">
			{/* Identity */}
			<div className="flex items-center gap-4">
				<Avatar
					name={user.displayName}
					email={user.email}
					photoURL={user.photoURL}
					size={56}
				/>
				<div className="min-w-0">
					<p className="m-0 truncate text-ink dark:text-cream">
						{user.displayName?.trim() || user.email}
					</p>
					{isAdmin ? (
						<span className="mt-1 inline-block rounded-full border border-brass/40 bg-brass/15 px-2 py-0.5 text-xs text-ink dark:text-cream">
							Admin
						</span>
					) : null}
				</div>
			</div>

			{/* Display name */}
			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<label className="flex flex-col gap-1 text-sm">
					<span className="text-smoke dark:text-sand">Display name</span>
					<input
						type="text"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setStatus('idle');
						}}
						className="text-input"
						placeholder="Your name"
						autoComplete="name"
					/>
				</label>
				<div className="flex items-center gap-3">
					<Button
						type="submit"
						color="primary"
						size="sm"
						disabled={status === 'saving'}>
						{status === 'saving' ? 'Saving…' : 'Save'}
					</Button>
					{status === 'saved' ? (
						<span className="text-sm text-smoke dark:text-sand">Saved</span>
					) : null}
					{error ? (
						<span role="alert" className="text-sm text-red-600">
							{error}
						</span>
					) : null}
				</div>
			</form>

			{/* Theme */}
			<div className="flex flex-col gap-2">
				<span className="text-sm text-smoke dark:text-sand">Theme</span>
				<div className="inline-flex w-fit overflow-hidden rounded-md border border-chalk dark:border-charcoal">
					{(['light', 'dark'] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTheme(t)}
							aria-pressed={theme === t}
							className={[
								'px-4 py-1.5 text-sm capitalize cursor-pointer transition-colors',
								theme === t
									? 'bg-brass text-ink'
									: 'bg-transparent text-smoke hover:bg-chalk dark:text-sand dark:hover:bg-carbon',
							].join(' ')}>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Session */}
			<div className="border-t border-chalk dark:border-charcoal pt-4">
				<Button
					type="button"
					color="danger"
					size="sm"
					onClick={() => void logout()}>
					Logout
				</Button>
			</div>
		</div>
	);
}
