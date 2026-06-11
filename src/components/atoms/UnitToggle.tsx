import * as React from 'react';

type Props = {
	/** When true, the metric (cl) unit is active; otherwise oz is active. */
	metric: boolean;
	onChange: (metric: boolean) => void;
	className?: string;
};

/** Segmented pill toggle for switching between imperial (oz) and metric (cl) units. */
export function UnitToggle({ metric, onChange, className = '' }: Props) {
	const segment = (active: boolean) =>
		[
			'cursor-pointer rounded-full px-2.5 py-0.5 transition-colors duration-300',
			active ? 'bg-palm text-white' : 'text-smoke dark:text-sand',
		].join(' ');

	return (
		<div
			role="group"
			aria-label="Measurement units"
			className={[
				'flex items-center gap-0.5 rounded-full border border-chalk bg-chalk p-0.5 text-xs dark:border-charcoal dark:bg-carbon',
				className,
			].join(' ')}>
			<button
				type="button"
				aria-pressed={!metric}
				onClick={() => onChange(false)}
				className={segment(!metric)}>
				oz
			</button>
			<button
				type="button"
				aria-pressed={metric}
				onClick={() => onChange(true)}
				className={segment(metric)}>
				cl
			</button>
		</div>
	);
}
