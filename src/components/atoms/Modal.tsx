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
			transition={{ duration: 0.15, ease: 'easeOut' }}
		>
			<motion.div
				role="dialog"
				aria-modal="true"
				aria-labelledby={ariaLabelledBy}
				className="flex w-full max-w-[900px] max-h-[90svh] flex-row flex-wrap overflow-auto rounded-lg bg-paper text-smoke shadow-md dark:bg-coal dark:text-sand"
				onClick={(e) => e.stopPropagation()}
				initial={{ opacity: 0, scale: 0.96, y: 8 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 8 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}
