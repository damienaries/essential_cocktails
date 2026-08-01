import { Link, useLocation } from 'react-router-dom';
import { DaIceGlyph } from './DaIceGlyph';

export function Footer() {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith('/admin');
	// Redundant on the page it points at, and out of place in the admin tools.
	const showFeedback = !isAdmin && pathname !== '/about';

	return (
		<footer className="bg-palm text-cream">
			<div className="app-container flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
				{showFeedback ? (
					<Link
						to="/about#contact"
						className="text-center text-xs text-white hover:underline sm:order-2 sm:text-left">
						Got a drink to suggest or feedback to share? Get in touch
					</Link>
				) : null}
				<div className="flex items-center justify-between gap-3 sm:contents">
					<span className="sm:order-1">™ Swizzle 2026</span>
					<a
						href="https://www.damienaries.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center text-cream transition-opacity hover:opacity-80 sm:order-3"
						aria-label="Made by DA — visit damienaries.com"
						title="Visit damienaries.com">
						<DaIceGlyph />
					</a>
				</div>
			</div>
		</footer>
	);
}
