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
				className="flex w-full max-w-[900px] max-h-[90svh] flex-row flex-wrap overflow-auto rounded-lg bg-paper text-smoke shadow-md dark:bg-coal dark:text-sand"
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
}
