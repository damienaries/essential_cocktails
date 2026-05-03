import * as React from 'react';

type ButtonColor = 'primary' | 'secondary' | 'danger';

/** `default` uses `color` + `fill`. Modal variants are self-contained (temporary until redesign). */
type ButtonVariant = 'default' | 'modal-unit' | 'modal-close';

type ButtonSize = 'default' | 'sm';

type Props = {
	href?: string | null;
	variant?: ButtonVariant;
	color?: ButtonColor;
	/** Tighter padding and text for dense forms (e.g. admin). */
	size?: ButtonSize;
	fill?: boolean;
	children: React.ReactNode;
	onClick?: (
		e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
	) => void;
} & Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	'color' | 'onClick' | 'children' | 'href' | 'className'
> &
	Omit<
		React.AnchorHTMLAttributes<HTMLAnchorElement>,
		'color' | 'onClick' | 'children' | 'href' | 'className'
	>;

function buildClassName(
	variant: ButtonVariant,
	color: ButtonColor,
	fill: boolean,
	size: ButtonSize,
): string {
	if (variant === 'modal-unit') {
		return [
			'absolute top-0 right-0 max-h-none min-h-0',
			'px-2.5 py-1 text-xs rounded-full w-fit',
			'border border-[var(--border)] bg-[var(--code-bg)] text-[var(--text-h)]',
			'hover:bg-[var(--code-bg)] transition-all duration-300',
		].join(' ');
	}

	if (variant === 'modal-close') {
		return [
			'mt-6 px-6 py-1 rounded text-center w-fit cursor-pointer',
			'bg-transparent hover:bg-transparent',
			'border border-[var(--border)] text-[var(--text)]',
			'transition-all duration-300',
		].join(' ');
	}

	let classes =
		size === 'sm'
			? 'px-3 py-1 text-sm rounded text-center hover:shadow transition-all duration-300 min-h-7 max-h-7 leading-tight'
			: 'px-6 py-1 rounded text-center hover:shadow transition-all duration-300 max-h-8';

	if (color === 'primary') {
		classes += ' text-black bg-blue-100 hover:bg-blue-200';
	}
	if (color === 'secondary') {
		classes += ' text-white bg-blue-500 hover:bg-blue-600';
	}
	if (color === 'danger') {
		classes += ' text-white bg-red-300 hover:bg-red-400';
	}

	classes += fill ? ' w-full' : ' w-fit';
	return classes;
}

export function Button({
	href = null,
	variant = 'default',
	color = 'primary',
	size = 'default',
	fill = false,
	children,
	onClick,
	...rest
}: Props) {
	const classes = buildClassName(variant, color, fill, size);

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
	) => {
		if (!href) onClick?.(e);
	};

	if (href) {
		const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
		return (
			<a
				href={href ?? undefined}
				className={classes}
				onClick={handleClick}
				{...anchorProps}
			>
				{children}
			</a>
		);
	}

	const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
	return (
		<button
			type="button"
			className={classes}
			onClick={handleClick}
			{...buttonProps}
		>
			{children}
		</button>
	);
}
