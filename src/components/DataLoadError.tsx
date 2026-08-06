import { Button } from './atoms/Button';

type Props = {
	/** What failed to load, in plain words: "the drinks", "the glossary". */
	subject: string;
	error: unknown;
	onRetry?: () => void;
};

/**
 * User-facing failure state. The underlying error text (Firebase codes, stack
 * messages) is developer diagnostics, not copy — it only appears in dev builds,
 * where the `.env.local` hint is also actually actionable.
 */
export function DataLoadError({ subject, error, onRetry }: Props) {
	const detail = error instanceof Error ? error.message : String(error ?? '');

	return (
		<div role="alert" className="mx-auto max-w-150 py-10 text-center">
			<p className="mb-2 text-ink dark:text-cream">
				We couldn’t load {subject} just now.
			</p>
			<p className="mb-6 text-sm text-smoke dark:text-sand">
				This is usually a connection hiccup — everything is still here. Try
				again in a moment.
			</p>

			{onRetry ? (
				<div className="flex justify-center">
					<Button onClick={onRetry}>Try again</Button>
				</div>
			) : null}

			{import.meta.env.DEV ? (
				<details className="mt-8 text-left text-xs text-smoke dark:text-sand">
					<summary className="cursor-pointer">Details (dev only)</summary>
					<p className="mt-2 font-mono">{detail || 'Unknown error'}</p>
					<p className="mt-2">
						If you just cloned the repo, add Firebase config in{' '}
						<code>.env.local</code> (see <code>.env.example</code>). If reads
						are denied, deploy the rules:{' '}
						<code>firebase deploy --only firestore:rules</code>.
					</p>
				</details>
			) : null}
		</div>
	);
}
