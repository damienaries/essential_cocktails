import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../components/atoms/Button';
import { getFirebaseAuth } from '../lib/firebase';

export function SignInPage() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const next = params.get('next') || '/admin';

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		setSubmitting(true);
		try {
			await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
			navigate(next, { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Sign in failed');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-100 pb-15">
			<h1 className="mt-0 mb-6 text-2xl md:text-3xl">Sign in</h1>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
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
						autoComplete="current-password"
						required
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
					{submitting ? 'Signing in…' : 'Sign in'}
				</Button>
			</form>
		</div>
	);
}
