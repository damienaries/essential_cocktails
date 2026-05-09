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
		'flex flex-wrap justify-center gap-1 mb-4',
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
							'min-w-[1.65rem] px-1.5 py-1 text-xs rounded border font-medium transition-colors',
							!hasAny
								? 'opacity-35 cursor-not-allowed border-chalk text-smoke bg-transparent dark:border-charcoal dark:text-sand'
								: isSelected
									? 'border-brass/40 bg-brass/10 text-ink dark:text-cream cursor-pointer'
									: 'border-chalk bg-paper text-ink hover:bg-chalk dark:border-charcoal dark:bg-coal dark:text-cream dark:hover:bg-carbon cursor-pointer',
						].join(' ')}
					>
						{letter}
					</button>
				);
			})}
		</div>
	);
}
