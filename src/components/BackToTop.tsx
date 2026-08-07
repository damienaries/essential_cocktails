import { useEffect, useState } from 'react';
import { SvgIcon } from './atoms/SvgIcon';

/** Roughly a screen of scrolling before the button is worth offering. */
const SHOW_AFTER_PX = 600;

/**
 * Desktop-only jump back to the top of a long list. Mobile gets the sticky header
 * instead — a floating button there would sit on top of the drink cards.
 */
export function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	if (!visible) return null;

	return (
		// Named group so the tooltip only answers to this button.
		<span className="group/top fixed right-6 bottom-30 lg:bottom-18 z-30">
			<button
				type="button"
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				aria-label="Back to top"
				className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-palm text-cream shadow-md transition-colors hover:bg-palm/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60 dark:bg-brass dark:text-ink dark:hover:bg-brass/90">
				<SvgIcon icon="arrow-up" size={22} />
			</button>
			<span
				role="tooltip"
				aria-hidden
				className="pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded bg-ink/90 px-2 py-1 text-xs text-cream opacity-0 transition-opacity group-hover/top:opacity-100 group-focus-within/top:opacity-100 dark:bg-cream/90 dark:text-ink">
				Back to top
			</span>
		</span>
	);
}
