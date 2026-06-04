import { DaIceGlyph } from './DaIceGlyph';

export function Footer() {
	return (
		<footer className="bg-palm text-cream">
			<div className="app-container flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
				<span>™ Swizzle 2026</span>
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
