import { useState } from 'react';
import { Button } from './atoms/Button';
import { Modal } from './atoms/Modal';
import type { Drink } from '../types/drink';
import { formatGarnish, formatMethod } from '../lib/drinkDisplay';

type Props = {
	drink: Drink;
	onClose: () => void;
};

export function DrinkDetailModal({ drink, onClose }: Props) {
	const [metric, setMetric] = useState(false);

	const unit = metric ? 'cl' : 'oz';
	const ingredients = drink.ingredients ?? [];

	return (
		<Modal onClose={onClose} ariaLabelledBy="drink-detail-title">
			<div
				style={{
					flex: '1 1 280px',
					minHeight: 280,
					background: drink.imageUrl
						? `url(${drink.imageUrl}) center/cover no-repeat`
						: 'linear-gradient(145deg, #2a2438, #1a1720)',
				}}
			/>
			<div
				style={{
					flex: '1 1 320px',
					padding: '20px 24px',
					borderLeft: '1px solid var(--border)',
				}}
			>
				<h2
					id="drink-detail-title"
					style={{ marginTop: 0, textTransform: 'uppercase' }}
				>
					{drink.name}
				</h2>
				<p style={{ textTransform: 'capitalize', margin: '8px 0' }}>
					{formatMethod(drink)}
				</p>
				<p style={{ textTransform: 'capitalize', margin: '8px 0' }}>
					{formatGarnish(drink)}
				</p>

				<div style={{ position: 'relative', marginTop: 24 }}>
					<Button variant="modal-unit" onClick={() => setMetric((v) => !v)}>
						{metric ? 'cl' : 'oz'}
					</Button>
					<ul style={{ listStyle: 'none', padding: 0, margin: '40px 0 0' }}>
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
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										gap: 12,
										padding: '6px 0',
										borderBottom: '1px solid var(--border)',
									}}
								>
									<span>{ing.name ?? '—'}</span>
									<span style={{ whiteSpace: 'nowrap' }}>{amountLabel}</span>
								</li>
							);
						})}
					</ul>
				</div>

				{drink.description ? (
					<small style={{ display: 'block', marginTop: 16, lineHeight: 1.5 }}>
						{drink.description}
					</small>
				) : null}

				<Button variant="modal-close" onClick={onClose}>
					Close
				</Button>
			</div>
		</Modal>
	);
}
