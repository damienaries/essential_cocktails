import { LETTERS } from '../hooks/useLetterFilter';

type Props = {
	lettersPresent: Set<string>;
	letterFilter: string | null;
	onChange: (next: string | null) => void;
	className?: string;
};

export function LetterFilterToolbar({
	lettersPresent,
	letterFilter,
	onChange,
	className,
}: Props) {
	const wrapperClass = [
		'flex flex-wrap justify-center gap-0.5 mb-4 sm:gap-1',
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div
			className={wrapperClass}
			role="toolbar"
			aria-label="Filter drinks by first letter"
		>
			{LETTERS.map((letter) => {
				const hasAny = lettersPresent.has(letter);
				const isSelected = letterFilter === letter;
				return (
					<button
						key={letter}
						type="button"
						disabled={!hasAny}
						aria-pressed={isSelected}
						title={
							hasAny
								? isSelected
									? `Filter ${letter} (active) — click to show all`
									: `Show names starting with ${letter}`
								: `No drinks starting with ${letter}`
						}
						onClick={() => {
							if (!hasAny) return;
							onChange(letterFilter === letter ? null : letter);
						}}
						className={[
							'min-w-[1.4rem] px-1 py-0.5 text-[11px] rounded border font-medium transition-colors sm:min-w-[1.65rem] sm:px-1.5 sm:py-1 sm:text-xs',
							!hasAny
								? 'opacity-35 cursor-not-allowed border-chalk text-smoke bg-transparent dark:border-charcoal dark:text-sand'
								: isSelected
									? 'border-brass bg-gold-tint text-gold-deep dark:border-brass dark:bg-brass/20 dark:text-brass cursor-pointer'
									: 'border-chalk bg-paper text-ink hover:border-palm/40 hover:bg-palm/15 dark:border-charcoal dark:bg-coal dark:text-cream dark:hover:border-brass/40 dark:hover:bg-brass/10 cursor-pointer',
						].join(' ')}
					>
						{letter}
					</button>
				);
			})}
		</div>
	);
}
