import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from 'react';

type BannerKind = 'success' | 'error';
type BannerEntry = { id: number; kind: BannerKind; message: string };

type AdminBannerContextValue = {
	showBanner: (kind: BannerKind, message: string) => void;
};

const AdminBannerContext = createContext<AdminBannerContextValue | null>(null);

export function useAdminBanner(): AdminBannerContextValue {
	const ctx = useContext(AdminBannerContext);
	if (!ctx) {
		throw new Error('useAdminBanner must be used inside AdminBannerProvider');
	}
	return ctx;
}

const VISIBLE_MS = 2000;
const FADE_MS = 200;

export function AdminBannerProvider({ children }: { children: ReactNode }) {
	const [entry, setEntry] = useState<BannerEntry | null>(null);
	const [visible, setVisible] = useState(false);
	const hideTimerRef = useRef<number | null>(null);
	const removeTimerRef = useRef<number | null>(null);

	const showBanner = useCallback((kind: BannerKind, message: string) => {
		if (hideTimerRef.current != null) {
			window.clearTimeout(hideTimerRef.current);
		}
		if (removeTimerRef.current != null) {
			window.clearTimeout(removeTimerRef.current);
		}
		setEntry({ id: Date.now(), kind, message });
		setVisible(true);
		hideTimerRef.current = window.setTimeout(() => {
			setVisible(false);
			removeTimerRef.current = window.setTimeout(() => setEntry(null), FADE_MS);
		}, VISIBLE_MS);
	}, []);

	useEffect(
		() => () => {
			if (hideTimerRef.current != null)
				window.clearTimeout(hideTimerRef.current);
			if (removeTimerRef.current != null)
				window.clearTimeout(removeTimerRef.current);
		},
		[],
	);

	return (
		<AdminBannerContext.Provider value={{ showBanner }}>
			{entry ? (
				<div className="fixed top-3 left-0 right-0 z-60 flex justify-center px-4 pointer-events-none">
					<div
						role="status"
						aria-live="polite"
						className={[
							'pointer-events-auto rounded-md border px-4 py-2 text-sm shadow-md',
							'transition-opacity duration-200',
							visible ? 'opacity-100' : 'opacity-0',
							entry.kind === 'success'
								? 'border-brass/40 bg-brass/10 text-ink dark:text-cream'
								: 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300',
						].join(' ')}>
						{entry.message}
					</div>
				</div>
			) : null}
			{children}
		</AdminBannerContext.Provider>
	);
}
