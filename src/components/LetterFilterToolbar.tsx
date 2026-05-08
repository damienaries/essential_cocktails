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
								? 'opacity-35 cursor-not-allowed border-[var(--border)] text-[var(--text)] bg-transparent'
								: isSelected
									? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--text-h)] cursor-pointer'
									: 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] hover:bg-[var(--code-bg)] cursor-pointer',
						].join(' ')}
					>
						{letter}
					</button>
				);
			})}
		</div>
	);
}
