// Persistent, admin-only reminder of which environment the admin page is
// running against. Each environment gets its own solid accent fill so it's
// impossible to miss: palm (green) for local, brass (gold) for production.
// Rendered inside AdminLayout, which is already gated by RequireAdmin, so no
// extra auth check is needed here.
export function AdminEnvBanner() {
	const isLocal = import.meta.env.DEV;
	const environment = isLocal ? 'local' : 'production';

	return (
		<div
			role="status"
			aria-live="polite"
			className={[
				'fixed bottom-0 left-0 right-0 z-40 px-4 py-2 shadow-md',
				'text-center text-sm font-semibold tracking-wide',
				isLocal ? 'bg-palm text-cream' : 'bg-brass text-ink',
			].join(' ')}>
			You are on the {environment} admin page
		</div>
	);
}
