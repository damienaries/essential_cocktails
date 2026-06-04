import { useEffect, useState, type FormEvent } from 'react';
import { Button } from './atoms/Button';
import { submitContactForm } from '../lib/contactFormSubmit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** How long to disable the form after a successful submission. */
const COOLDOWN_MS = 5 * 60 * 1000;
/** localStorage key holding the millisecond timestamp of the last successful send. */
const LAST_SENT_KEY = 'swizzle:contact:last-sent';

function readLastSent(): number | null {
	try {
		const raw = window.localStorage.getItem(LAST_SENT_KEY);
		const n = raw ? Number.parseInt(raw, 10) : NaN;
		return Number.isFinite(n) ? n : null;
	} catch {
		return null;
	}
}

function writeLastSent(ts: number): void {
	try {
		window.localStorage.setItem(LAST_SENT_KEY, String(ts));
	} catch {
		/* ignore */
	}
}

function formatRemaining(ms: number): string {
	const totalSeconds = Math.ceil(ms / 1000);
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${m}:${String(s).padStart(2, '0')}`;
}

type Status = 'idle' | 'submitting' | { error: string };

export function ContactForm() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [website, setWebsite] = useState('');
	const [status, setStatus] = useState<Status>('idle');
	const [lastSent, setLastSent] = useState<number | null>(() => readLastSent());
	// `now` is bumped on a tick so the cooldown view's countdown re-renders.
	// Only runs while in cooldown — see the effect below.
	const [now, setNow] = useState(() => Date.now());

	const remainingMs =
		lastSent != null ? Math.max(0, COOLDOWN_MS - (now - lastSent)) : 0;
	const inCooldown = remainingMs > 0;

	useEffect(() => {
		if (!inCooldown) return;
		const id = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(id);
	}, [inCooldown]);

	const startCooldown = () => {
		const ts = Date.now();
		writeLastSent(ts);
		setLastSent(ts);
		setNow(ts);
		setName('');
		setEmail('');
		setSubject('');
		setMessage('');
		setStatus('idle');
	};

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (inCooldown) return;
		// Honeypot: silently pretend success so bots don't retry. We still kick
		// off the cooldown so a bot hitting the form repeatedly gets throttled.
		if (website.trim() !== '') {
			startCooldown();
			return;
		}
		// Basic validation. The `required` attrs and `type="email"` catch most of
		// it; this is the safety net so we never POST garbage.
		if (
			!name.trim() ||
			!subject.trim() ||
			message.trim().length < 5 ||
			!EMAIL_RE.test(email.trim())
		) {
			setStatus({ error: 'Please fill in all fields with a valid email.' });
			return;
		}

		setStatus('submitting');
		const result = await submitContactForm({
			name: name.trim(),
			email: email.trim(),
			subject: subject.trim(),
			message: message.trim(),
			website,
		});
		if (result.ok) {
			startCooldown();
		} else {
			setStatus({ error: result.error });
		}
	};

	if (inCooldown) {
		return (
			<div className="rounded-md border border-palm/30 bg-palm/10 p-4 text-sm">
				<p className="m-0 font-medium">Thanks, your message was sent.</p>
				<p className="m-0 mt-1 text-smoke dark:text-sand">
					You can send another in{' '}
					<span className="tabular-nums">{formatRemaining(remainingMs)}</span>.
				</p>
			</div>
		);
	}

	const submitting = status === 'submitting';
	const errorMessage = typeof status === 'object' ? status.error : null;

	return (
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
				<span>Subject</span>
				<input
					type="text"
					required
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					className="text-input"
				/>
			</label>

			<label className="flex flex-col gap-1 text-sm">
				<span>Message</span>
				<textarea
					required
					rows={6}
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className="text-input"
				/>
			</label>

			{/* Honeypot. Real users can't see or tab to this. Bots fill every input. */}
			<div
				className="absolute -left-[9999px] h-px w-px overflow-hidden"
				aria-hidden="true">
				<label>
					Website
					<input
						type="text"
						name="website"
						tabIndex={-1}
						autoComplete="off"
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
					/>
				</label>
			</div>

			{errorMessage ? (
				<p role="alert" className="text-sm text-red-600 dark:text-red-400">
					{errorMessage}
				</p>
			) : null}

			<Button type="submit" color="primary" fill disabled={submitting}>
				{submitting ? 'Sending…' : 'Send message'}
			</Button>

			<p className="text-xs text-smoke dark:text-sand">
				Your email is only used to reply. Nothing is stored or shared.
			</p>
		</form>
	);
}
