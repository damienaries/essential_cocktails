import { useEffect, useState, type MouseEvent } from 'react';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSavedDrinkIds, useToggleSaved } from '../hooks/useSavedDrinks';
import { SvgIcon } from './atoms/SvgIcon';

type Props = {
	drinkId: string;
	drinkName: string;
	size?: 'sm' | 'md';
	className?: string;
};

/** How long the signed-out hint stays up after a tap. */
const HINT_MS = 1500;

export function SaveDrinkButton({
	drinkId,
	drinkName,
	size = 'sm',
	className = '',
}: Props) {
	const { user } = useAuthUser();
	const savedIds = useSavedDrinkIds();
	const toggleSaved = useToggleSaved();
	const [hintShown, setHintShown] = useState(false);

	const saved = savedIds.has(drinkId);
	const signedOut = !user;

	useEffect(() => {
		if (!hintShown) return;
		const timer = setTimeout(() => setHintShown(false), HINT_MS);
		return () => clearTimeout(timer);
	}, [hintShown]);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		// On a card the heart overlaps a clickable card; don't also open the modal.
		e.stopPropagation();
		if (signedOut) {
			setHintShown(true);
			return;
		}
		toggleSaved.mutate({ drinkId, save: !saved });
	};

	return (
		// Named group so the hint reacts to this button alone, not the card's `group`.
		<span className={['group/save relative inline-flex', className].join(' ')}>
			<button
				type="button"
				onClick={handleClick}
				aria-pressed={signedOut ? undefined : saved}
				aria-disabled={signedOut || undefined}
				aria-label={
					signedOut
						? `Log in to save ${drinkName}`
						: saved
							? `Remove ${drinkName} from saved`
							: `Save ${drinkName}`
				}
				className={[
					size === 'md' ? 'h-8 w-8' : 'h-7 w-7',
					'flex cursor-pointer items-center justify-center rounded-full',
					'bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60',
					saved ? 'text-brass' : 'text-white',
					signedOut ? 'opacity-60' : '',
				].join(' ')}>
				<SvgIcon
					icon={saved ? 'heart-filled' : 'heart'}
					size={size === 'md' ? 22 : 20}
				/>
			</button>

			{signedOut ? (
				<span
					role="tooltip"
					className={[
						'pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded',
						'bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm transition-opacity',
						'group-hover/save:opacity-100 group-focus-within/save:opacity-100',
						hintShown ? 'opacity-100' : 'opacity-0',
					].join(' ')}>
					Log in to save drinks
				</span>
			) : null}
		</span>
	);
}
