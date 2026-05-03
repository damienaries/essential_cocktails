import { useEffect, type ReactNode } from 'react';

type Props = {
	onClose: () => void;
	children: ReactNode;
	ariaLabelledBy?: string;
	closeOnBackdrop?: boolean;
};

export function Modal({
	onClose,
	children,
	ariaLabelledBy,
	closeOnBackdrop = true,
}: Props) {
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
			className="modal-backdrop"
			onClick={closeOnBackdrop ? onClose : undefined}
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
