import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSavedDrinkIds, useToggleSaved } from '../hooks/useSavedDrinks';
import { SvgIcon } from './atoms/SvgIcon';

type Props = {
	drinkId: string;
	drinkName: string;
	/** `sm` for the card corner, `md` to match the modal's close button. */
	size?: 'sm' | 'md';
	/**
	 * Which way the tooltip opens. Default `top` suits the card corner; the modal
	 * passes `bottom` because its photo container clips anything above the button.
	 */
	tooltipSide?: 'top' | 'bottom';
	className?: string;
};

/**
 * Heart toggle for saving a drink. It sits over the drink photo on both the card and
 * the detail modal, so it carries the same dark scrim as the modal close button.
 * Signed-out users go to sign-in and come back to the page they left.
 */
export function SaveDrinkButton({
	drinkId,
	drinkName,
	size = 'sm',
	tooltipSide = 'top',
	className = '',
}: Props) {
	const { user } = useAuthUser();
	const navigate = useNavigate();
	const { pathname, search } = useLocation();
	const savedIds = useSavedDrinkIds();
	const toggleSaved = useToggleSaved();

	const saved = savedIds.has(drinkId);

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		// On a card the heart overlaps a clickable card; don't also open the modal.
		e.stopPropagation();
		if (!user) {
			navigate(`/signin?next=${encodeURIComponent(`${pathname}${search}`)}`);
			return;
		}
		toggleSaved.mutate({ drinkId, save: !saved });
	};

	const label = saved ? 'Remove from saved' : 'Save drink';

	return (
		// Named group so the tooltip reacts to this button alone, not the card's `group`.
		<span className={['group/save relative', className].join(' ')}>
			<button
				type="button"
				onClick={handleClick}
				aria-pressed={saved}
				aria-label={saved ? `Remove ${drinkName} from saved` : `Save ${drinkName}`}
				className={[
					size === 'md' ? 'h-11 w-11' : 'h-7 w-7',
					'flex cursor-pointer items-center justify-center rounded-full',
					'bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60',
					saved ? 'text-brass' : 'text-white',
				].join(' ')}>
				<SvgIcon
					icon={saved ? 'heart-filled' : 'heart'}
					size={size === 'md' ? 24 : 20}
				/>
			</button>
			<span
				role="tooltip"
				aria-hidden
				className={[
					'pointer-events-none absolute z-20 whitespace-nowrap rounded',
					'bg-ink/90 px-2 py-1 text-xs text-cream opacity-0 transition-opacity',
					'group-hover/save:opacity-100 group-focus-within/save:opacity-100',
					// Each side also picks the edge that keeps the tooltip inside the
					// photo: below-left under the modal's top-left heart, above-right
					// over the card's bottom-right one.
					tooltipSide === 'bottom' ? 'top-full left-0 mt-1' : 'bottom-full right-0 mb-1',
				].join(' ')}>
				{label}
			</span>
		</span>
	);
}
