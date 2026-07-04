import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Button } from '../components/atoms/Button';
import { getFirebaseAuth } from '../lib/firebase';
import { friendlyAuthError } from '../lib/authErrors';
import { useAuthUser } from '../hooks/useAuthUser';

export function SignUpPage() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const { refreshUser } = useAuthUser();

	// New accounts are regular users, so default to /account. Honor an explicit ?next= redirect and carry it to the sign-in link.
	const rawNext = params.get('next');
	const next = rawNext || '/account';
	const signinHref = rawNext
		? `/signin?next=${encodeURIComponent(rawNext)}`
		: '/signin';

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			const cred = await createUserWithEmailAndPassword(
				getFirebaseAuth(),
				email,
				password,
			);
			const displayName = name.trim();
			if (displayName) {
				// updateProfile doesn't fire an auth event; refreshUser propagates the
				// name so the header shows it immediately after redirect.
				await updateProfile(cred.user, { displayName });
				await refreshUser();
			}
			navigate(next, { replace: true });
		} catch (err) {
			setError(friendlyAuthError(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-100 pb-15">
			<h1 className="mt-0 mb-6 text-2xl md:text-3xl">Create account</h1>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<label className="flex flex-col gap-1 text-sm">
					<span>Name</span>
					<input
						type="text"
						autoComplete="name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="text-input"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span>Email</span>
					<input
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="text-input"
					/>
				</label>
				<label className="flex flex-col gap-1 text-sm">
					<span>Password</span>
					<input
						type="password"
						autoComplete="new-password"
						required
						minLength={6}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="text-input"
					/>
				</label>
				{error ? (
					<p role="alert" className="text-sm text-red-600">
						{error}
					</p>
				) : null}
				<Button type="submit" color="primary" fill disabled={submitting}>
					{submitting ? 'Creating account…' : 'Create account'}
				</Button>
			</form>
			<p className="mt-4 text-sm text-smoke dark:text-sand">
				Already a regular?{' '}
				<Link to={signinHref} className="link">
					Sign in
				</Link>
			</p>
		</div>
	);
}
