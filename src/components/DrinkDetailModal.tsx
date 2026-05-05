import { useState } from 'react';
import { Button } from './atoms/Button';
import { Modal } from './atoms/Modal';
import type { Drink } from '../types/drink';
import { drinkPhotoImgProps } from '../lib/drinkImageAttrs';
import { formatGarnish, formatIce, formatMethod } from '../lib/drinkDisplay';

type Props = {
	drink: Drink;
	onClose: () => void;
};

function MetaLine({ label, value }: { label: string; value: string }) {
	const display = value.trim() === '' ? '—' : value;
	return (
		<p className="m-0 capitalize text-[var(--text)]">
			<span className="sr-only">{label}: </span>
			{display}
		</p>
	);
}

export function DrinkDetailModal({ drink, onClose }: Props) {
	const [metric, setMetric] = useState(false);

	const unit = metric ? 'cl' : 'oz';
	const ingredients = drink.ingredients ?? [];
	const imageUrl = drink.imageUrl?.trim();
	const methodStr = formatMethod(drink);
	const garnishStr = formatGarnish(drink);
	const iceStr = formatIce(drink);

	return (
		<Modal onClose={onClose} ariaLabelledBy="drink-detail-title">
			<div
				className={[
					'relative min-w-0 overflow-hidden bg-[linear-gradient(145deg,#2a2438,#1a1720)]',
					'w-full flex-[1_1_100%]',
					/* Mobile/tablet stack: large hero (~half viewport) but cap px so tall phones don’t push ingredients entirely below fold */
					'min-h-[120px] max-h-[min(48svh,380px)]',
					'sm:min-h-[140px] sm:max-h-[min(52svh,440px)]',
					/* Desktop row: wide column + stretch with sibling; no tiny md cap */
					'md:flex-[1_1_300px] md:max-h-none md:min-h-[280px]',
					'lg:min-h-[min(52vh,420px)] lg:flex-[1_1_340px]',
				].join(' ')}
			>
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
			</div>
			<div
				className={[
					'relative box-border flex-[1_1_300px] text-[var(--text)]',
					'border-t border-[var(--border)] px-4 py-3',
					'text-sm leading-snug',
					'md:border-l md:border-t-0 md:px-5 md:py-4 md:text-[15px] md:leading-normal',
					'lg:px-6 lg:py-5 lg:text-base',
				].join(' ')}
			>
				<button
					type="button"
					onClick={onClose}
					className={[
						'absolute right-2 top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center',
						'rounded-md border border-transparent bg-transparent text-xl leading-none text-[var(--text-h)]',
						'transition-colors hover:bg-[var(--code-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-border)]',
					].join(' ')}
					aria-label="Close dialog"
				>
					×
				</button>

				<header className="flex flex-col gap-3 pr-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:pr-11">
					<h2
						id="drink-detail-title"
						className="m-0 min-w-0 flex-1 text-lg font-medium uppercase tracking-wide text-[var(--text-h)] sm:text-xl md:text-2xl"
					>
						{drink.name}
					</h2>
					<div
						className="shrink-0 space-y-1 text-right text-xs leading-snug sm:max-w-[55%] sm:text-[13px] md:text-sm"
						role="group"
						aria-label="Preparation"
					>
						<MetaLine label="Method" value={methodStr} />
						<MetaLine label="Garnish" value={garnishStr} />
						<MetaLine label="Ice" value={iceStr} />
					</div>
				</header>

				<div className="relative mt-4 md:mt-5">
					<Button variant="modal-unit" onClick={() => setMetric((v) => !v)}>
						{metric ? 'cl' : 'oz'}
					</Button>
					<ul className="m-0 mt-6 list-none p-0 md:mt-8">
						{ingredients.map((ing, idx) => {
							const q = ing.quantity;
							let amountLabel: string;
							if (q == null) {
								amountLabel = '—';
							} else if (typeof q === 'string') {
								amountLabel = q.trim() || '—';
							} else if (typeof q === 'number' && Number.isFinite(q)) {
								const displayQty = metric ? String(q * 3) : String(q);
								amountLabel = `${displayQty} ${unit}`;
							} else {
								amountLabel = '—';
							}
							return (
								<li
									key={`${ing.name ?? 'ing'}-${idx}`}
									className="flex justify-between gap-2 border-b border-[var(--border)] py-1.5 text-[var(--text)] last:border-b-0 md:gap-3 md:py-2"
								>
									<span className="min-w-0 flex-1">{ing.name ?? '—'}</span>
									<span className="shrink-0 whitespace-nowrap text-right tabular-nums">
										{amountLabel}
									</span>
								</li>
							);
						})}
					</ul>
				</div>

				{drink.description ? (
					<small className="mt-3 block text-xs leading-relaxed text-[var(--text)] opacity-95 md:mt-4 md:text-sm">
						{drink.description}
					</small>
				) : null}
			</div>
		</Modal>
	);
}
