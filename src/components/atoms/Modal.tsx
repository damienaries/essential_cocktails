import { useEffect, type ReactNode } from 'react';
import { motion } from 'motion/react';

type Props = {
	onClose: () => void;
	children: ReactNode;
	ariaLabelledBy?: string;
	closeOnBackdrop?: boolean;
	closeOnEscape?: boolean;
};

export function Modal({
	onClose,
	children,
	ariaLabelledBy,
	closeOnBackdrop = true,
	closeOnEscape = true,
}: Props) {
	// Lock the page behind the modal.
	useEffect(() => {
		const { body } = document;
		const previousOverflow = body.style.overflow;
		const previousPaddingRight = body.style.paddingRight;
		// Replacing the scrollbar with padding keeps the layout from jumping sideways.
		const scrollbarWidth =
			window.innerWidth - document.documentElement.clientWidth;

		body.style.overflow = 'hidden';
		if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

		return () => {
			body.style.overflow = previousOverflow;
			body.style.paddingRight = previousPaddingRight;
		};
	}, []);

	useEffect(() => {
		if (!closeOnEscape) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose, closeOnEscape]);

	return (
		<motion.div
			role="presentation"
			className="modal-backdrop"
			onClick={closeOnBackdrop ? onClose : undefined}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15, ease: 'easeOut' }}>
			<motion.div
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
				className="flex w-full max-w-225 max-h-[90svh] flex-row flex-wrap overflow-auto rounded-lg border border-chalk bg-paper text-smoke shadow-lg dark:border-cream/40 dark:bg-coal dark:text-sand"
				onClick={(e) => e.stopPropagation()}
				initial={{ opacity: 0, scale: 0.96, y: 8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 8 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}>
				{children}
			</motion.div>
		</motion.div>
	);
}
