import { useEffect, useState, type MouseEvent } from 'react';
import { drinkSlug } from '../lib/slug';
import type { Drink } from '../types/drink';
import { SvgIcon } from './atoms/SvgIcon';

type Props = {
	drink: Drink;
	className?: string;
};

/** How long the "Link copied" confirmation stays up. */
const CONFIRMATION_MS = 2000;

/**
 * Copies the drink's shareable URL. Built from the drink rather than read off
 * `window.location`, so it's the canonical link even if the modal was opened over
 * another page and the address bar carries extra state.
 */
export function ShareDrinkButton({ drink, className = '' }: Props) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), CONFIRMATION_MS);
		return () => clearTimeout(timer);
	}, [copied]);

	const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const url = `${window.location.origin}/drinks/${drinkSlug(drink)}`;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
		} catch (err) {
			// Denied permission, or an insecure context (plain http). Nothing useful
			// to show the user, so leave the button unchanged rather than lie.
			console.warn('Could not copy the share link.', err);
		}
	};

	return (
		<span className={['relative', className].join(' ')}>
			<button
				type="button"
				onClick={handleClick}
				aria-label={`Copy link to ${drink.name}`}
				className={[
					'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
					'bg-black/40 text-cream/75 backdrop-blur-sm transition-colors hover:bg-black/60',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60',
				].join(' ')}>
				<SvgIcon icon="share" size={22} />
			</button>

			{/* Announced politely so the confirmation reaches screen readers too. */}
			<span
				role="status"
				aria-live="polite"
				className={[
					'pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded',
					'bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm transition-opacity',
					copied ? 'opacity-100' : 'opacity-0',
				].join(' ')}>
				{copied ? 'Link copied' : ''}
			</span>
		</span>
	);
}
