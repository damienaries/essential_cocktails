import { QueryClient, type Query } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

/** Bump when a cached shape changes, so old entries are discarded rather than read. */
const CACHE_BUSTER = 'v1';

/** The version stamp makes revalidation cheap, so the cache can be kept for a 30days. */
export const CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export function createAppQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});
}

/**
 * Query-key roots holding data that belongs to one signed-in user. Cleared on logout
 * so an account's saves and menus don't sit in memory for whoever signs in next.
 */
export const USER_SCOPED_ROOT_KEYS = ['saved', 'menus'];

/**
 * Only the public drinks library is persisted. Per-user data (saved drinks, menus)
 * stays in memory: writing it to localStorage would leave one account's contents on
 * a shared device after logout, and it's cheap to refetch anyway.
 */
const PERSISTED_ROOT_KEYS = ['drinks', 'drinksLibraryVersion'];

function shouldDehydrateQuery(query: Query): boolean {
	const root = query.queryKey[0];
	return (
		query.state.status === 'success' &&
		typeof root === 'string' &&
		PERSISTED_ROOT_KEYS.includes(root)
	);
}

export function createAppPersistOptions() {
	return {
		persister: createSyncStoragePersister({
			storage: window.localStorage,
			key: 'swizzle:query-cache',
		}),
		maxAge: CACHE_MAX_AGE,
		buster: CACHE_BUSTER,
		dehydrateOptions: { shouldDehydrateQuery },
	};
}
