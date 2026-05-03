import { useEffect, type ReactNode } from 'react';

type Props = {
	onClose: () => void;
	children: ReactNode;
	ariaLabelledBy?: string;
};

export function Modal({ onClose, children, ariaLabelledBy }: Props) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	return (
		<div
			role="presentation"
			style={{
				position: 'fixed',
				inset: 0,
				background: 'rgba(0,0,0,0.45)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 16,
				zIndex: 50,
			}}
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
				style={{
					background: 'var(--bg)',
					color: 'var(--text)',
					maxWidth: 900,
					width: '100%',
					maxHeight: '90svh',
					overflow: 'auto',
					borderRadius: 8,
					boxShadow: 'var(--shadow)',
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 0,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
