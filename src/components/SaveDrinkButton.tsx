import type { MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { useSavedDrinkIds, useToggleSaved } from '../hooks/useSavedDrinks';
import { SvgIcon } from './atoms/SvgIcon';

type Props = {
	drinkId: string;
	drinkName: string;
	size?: 'sm' | 'md';
	className?: string;
};

export function SaveDrinkButton({
	drinkId,
	drinkName,
	size = 'sm',
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

	return (
		// No tooltip: a heart toggle explains itself. `aria-label` still names it for
		// screen readers, and `aria-pressed` carries the saved state.
		<button
			type="button"
			onClick={handleClick}
			aria-pressed={saved}
			aria-label={saved ? `Remove ${drinkName} from saved` : `Save ${drinkName}`}
			className={[
				size === 'md' ? 'h-8 w-8' : 'h-7 w-7',
				'flex cursor-pointer items-center justify-center rounded-full',
				'bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60',
				'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60',
				saved ? 'text-brass' : 'text-white',
				className,
			].join(' ')}>
			<SvgIcon
				icon={saved ? 'heart-filled' : 'heart'}
				size={size === 'md' ? 22 : 20}
			/>
		</button>
	);
}
