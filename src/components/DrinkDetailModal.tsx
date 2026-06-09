import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './atoms/Button';
import { Modal } from './atoms/Modal';
import type { Drink } from '../types/drink';
import { drinkPhotoImgProps } from '../lib/drinkImageAttrs';
import { SvgIcon } from './atoms/SvgIcon';
import { formatGarnish, formatIce, formatMethod } from '../lib/drinkDisplay';
import { formatCl, formatOz, ozToCl } from '../lib/ingredientQuantity';
import { glossarySlug, isGlossaryIngredient } from '../lib/ingredientCategory';
import { glassIconName, iceIconName, methodIconName } from '../lib/metaIcons';
import { useSwipe } from '../hooks/useSwipe';

type Props = {
	drink: Drink;
	onClose: () => void;
	drinks?: Drink[]; // Ordered list the drink belongs to, enabling prev/next navigation.
	onNavigate?: (drink: Drink) => void; // Called with the neighbouring drink when navigating.
};

function MetaCell({
	label,
	textValue,
	iconName,
}: {
	label: string;
	textValue: string;
	iconName?: string | null;
}) {
	const display = textValue.trim() === '' ? '—' : textValue;
	return (
		<div
			className="flex flex-col items-center gap-1 text-center text-smoke dark:text-sand"
			title={display}>
			<span className="sr-only">
				{label}: {display}
			</span>
			{iconName ? (
				<SvgIcon icon={iconName} size={40} />
			) : (
				<span className="capitalize">{display}</span>
			)}
		</div>
	);
}

export function DrinkDetailModal({
	drink,
	onClose,
	drinks,
	onNavigate,
}: Props) {
	const [metric, setMetric] = useState(false);

	const list = useMemo(() => drinks ?? [], [drinks]);
	const index = list.findIndex((d) => d.id === drink.id);
	const canNavigate = !!onNavigate && index >= 0 && list.length > 1;

	const navigate = useCallback(
		(direction: 1 | -1) => {
			if (!canNavigate) return;
			const next = list[(index + direction + list.length) % list.length];
			if (next) onNavigate?.(next);
		},
		[canNavigate, index, list, onNavigate],
	);

	const swipeHandlers = useSwipe(
		() => navigate(1),
		() => navigate(-1),
	);

	useEffect(() => {
		if (!canNavigate) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') navigate(1);
			else if (e.key === 'ArrowLeft') navigate(-1);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [canNavigate, navigate]);

	const unit = metric ? 'cl' : 'oz';
	const ingredients = drink.ingredients ?? [];
	const imageUrl = drink.imageUrl?.trim();
	const methodStr = formatMethod(drink);
	const garnishStr = formatGarnish(drink);
	const iceStr = formatIce(drink);

	return (
		<Modal onClose={onClose} ariaLabelledBy="drink-detail-title">
			<div
				{...swipeHandlers}
				className={[
					'relative min-w-0 overflow-hidden bg-[linear-gradient(145deg,#2a2438,#1a1720)]',
					'w-full flex-[1_1_100%]',
					'min-h-30 max-h-[min(48svh,380px)]',
					'sm:min-h-35 sm:max-h-[min(52svh,440px)]',
					'md:flex-[1_1_300px] md:max-h-none md:min-h-70',
					'lg:min-h-[min(52vh,420px)] lg:flex-[1_1_340px]',
				].join(' ')}>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={`Photo of ${drink.name}`}
						className="block h-full max-h-[inherit] min-h-0 w-full object-cover object-center"
						width={560}
						height={560}
						{...drinkPhotoImgProps}
						fetchPriority="high"
					/>
				) : null}
				{/* todo set fallback drink image here instead of null */}
			</div>
			<div
				{...swipeHandlers}
				className={[
					'relative box-border flex-[1_1_300px] text-smoke dark:text-sand',
					'border-t border-chalk dark:border-charcoal px-4 py-3',
					'text-sm leading-snug',
					'md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[15px] md:leading-normal',
					'lg:px-6 lg:py-5 lg:text-base',
				].join(' ')}>
				<button
					type="button"
					onClick={onClose}
					className={[
						'absolute right-2 top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center',
						'rounded-md border border-transparent bg-transparent leading-none text-ink dark:text-cream',
						'transition-colors hover:bg-chalk dark:hover:bg-carbon focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/50',
					].join(' ')}
					aria-label="Close dialog">
					<SvgIcon icon="close" size={20} />
				</button>

				<header className="text-center">
					<h2
						id="drink-detail-title"
						className="mb-6 px-11 text-lg font-medium uppercase tracking-wide text-ink dark:text-cream sm:text-xl md:text-2xl">
						{drink.name}
					</h2>
					<div
						className="mt-2 grid grid-cols-4 items-start gap-2 text-xs"
						role="group"
						aria-label="Preparation">
						<MetaCell
							label="Method"
							textValue={methodStr}
							iconName={methodIconName(drink.method)}
						/>
						<MetaCell
							label="Glass"
							textValue={drink.glass ?? ''}
							iconName={glassIconName(drink.glass)}
						/>
						<MetaCell
							label="Ice"
							textValue={iceStr}
							iconName={iceIconName(drink.ice)}
						/>
						<MetaCell label="Garnish" textValue={garnishStr} />
					</div>
				</header>

				<div className="relative mt-4">
					<Button variant="modal-unit" onClick={() => setMetric((v) => !v)}>
						{metric ? 'cl' : 'oz'}
					</Button>
					<ul className="m-0 mt-16 list-none p-0">
						{ingredients.map((ing, idx) => {
							const q = ing.quantity;
							let amountLabel: string;
							if (q == null) {
								amountLabel = '—';
							} else if (typeof q === 'string') {
								amountLabel = q.trim() || '—';
							} else if (typeof q === 'number' && Number.isFinite(q)) {
								const displayQty = metric ? formatCl(ozToCl(q)) : formatOz(q);
								amountLabel = `${displayQty} ${unit}`;
							} else {
								amountLabel = '—';
							}
							return (
								<li
									key={`${ing.name ?? 'ing'}-${idx}`}
									className="flex justify-between gap-2 border-b border-chalk dark:border-charcoal py-1.5 text-smoke dark:text-sand last:border-b-0 md:gap-3 md:py-2">
									<span className="text-left min-w-0 flex-1">
										{ing.name && isGlossaryIngredient(ing.name) ? (
											<Link
												to={`/glossary#${glossarySlug(ing.name)}`}
												onClick={onClose}
												className="underline decoration-dotted decoration-smoke/50 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass dark:decoration-sand/50">
												{ing.name}
											</Link>
										) : (
											(ing.name ?? '—')
										)}
									</span>
									<span className="shrink-0 whitespace-nowrap text-right tabular-nums">
										{amountLabel}
									</span>
								</li>
							);
						})}
					</ul>
				</div>

				{drink.description ? (
					<small className="mt-3 block text-xs leading-relaxed text-smoke dark:text-sand opacity-95 md:mt-4 md:text-sm">
						{drink.description}
					</small>
				) : null}
			</div>
		</Modal>
	);
}
