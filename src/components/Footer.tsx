import { Link, useLocation } from 'react-router-dom';
import { DaIceGlyph } from './DaIceGlyph';

export function Footer() {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith('/admin');
	// Redundant on the page it points at, and out of place in the admin tools.
	const showFeedback = !isAdmin && pathname !== '/about';

	return (
		<footer className="bg-palm text-cream">
			<div className="app-container flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
				<span>™ Swizzle 2026</span>
				{showFeedback ? (
					<Link
						to="/about#contact"
						className="text-white hover:underline text-xs">
						Got a drink to suggest or feedback to share? Get in touch
					</Link>
				) : null}
				<a
					href="https://www.damienaries.com"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center text-cream transition-opacity hover:opacity-80"
					aria-label="Made by DA — visit damienaries.com"
					title="Visit damienaries.com">
					<DaIceGlyph />
				</a>
			</div>
		</footer>
	);
}
