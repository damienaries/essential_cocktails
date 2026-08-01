import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSavedDrinkIds, useToggleSaved } from '../hooks/useSavedDrinks';
import { SvgIcon } from './atoms/SvgIcon';

type Props = {
	drinkId: string;
	drinkName: string;
	size?: 'sm' | 'md';
	tooltipSide?: 'top' | 'bottom';
	className?: string;
};

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
		// `className` positions this wrapper (it's the tooltip's containing block), so
		// it must carry `absolute` — adding `relative` here would fight it.
		<span className={['group/save', className].join(' ')}>
			<button
				type="button"
				onClick={handleClick}
				aria-pressed={saved}
				aria-label={
					saved ? `Remove ${drinkName} from saved` : `Save ${drinkName}`
				}
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
					'pointer-events-none absolute right-0 z-20 whitespace-nowrap rounded',
					// Same scrim as the button so the pair reads as one control.
					'bg-black/40 backdrop-blur-sm px-2 py-1 text-xs text-white opacity-0 transition-opacity',
					'group-hover/save:opacity-100 group-focus-within/save:opacity-100',

					tooltipSide === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
				].join(' ')}>
				{label}
			</span>
		</span>
	);
}
