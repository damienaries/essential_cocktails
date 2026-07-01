import * as React from 'react';

type ButtonColor = 'primary' | 'secondary' | 'danger';

/** `default` uses `color` + `fill`. Modal variants are self-contained (temporary until redesign). */
type ButtonVariant = 'default' | 'modal-close';

type ButtonSize = 'default' | 'sm';

type Props = {
	href?: string | null;
	variant?: ButtonVariant;
	color?: ButtonColor;
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
	if (variant === 'modal-close') {
		return [
			'mt-6 px-6 py-1 rounded text-center w-fit cursor-pointer',
			'bg-transparent hover:bg-transparent',
			'border border-chalk text-smoke dark:border-charcoal dark:text-sand',
			'transition-all duration-300',
		].join(' ');
	}

	let classes =
		size === 'sm'
			? 'px-3 py-1 text-sm rounded inline-flex items-center justify-center border cursor-pointer transition-colors duration-200 min-h-7 max-h-7 leading-tight'
			: 'px-6 py-1.5 rounded text-center border cursor-pointer transition-colors duration-200';

	if (color === 'primary') {
		classes += ' bg-palm text-white border-transparent hover:bg-palm/90';
	}
	if (color === 'secondary') {
		classes +=
			' bg-paper text-palm border-palm hover:bg-palm/10 dark:bg-transparent dark:text-cream dark:hover:bg-palm/20';
	}
	if (color === 'danger') {
		classes += ' bg-red-600 text-white border-transparent hover:bg-red-700';
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
				{...anchorProps}>
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
			{...buttonProps}>
			{children}
		</button>
	);
}
