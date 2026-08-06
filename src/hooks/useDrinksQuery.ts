import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllDrinks, fetchLibraryVersion } from '../api/drinks'
import { CACHE_MAX_AGE } from '../lib/queryClient'
import type { Drink } from '../types/drink'

export const DRINKS_QUERY_KEY = ['drinks'] as const
/** Deliberately not a child of DRINKS_QUERY_KEY — prefix invalidation would clear it. */
export const LIBRARY_VERSION_KEY = ['drinksLibraryVersion'] as const

/**
 * The public library, cached across sessions.
 *
 * Fetching all drinks costs one Firestore read per drink, so doing it on every page
 * load is the app's dominant read cost. Instead each fetch reads the one-document
 * version stamp (1 read) and reuses the persisted copy when it hasn't moved — a
 * returning visitor costs 1 read instead of ~150.
 */
export function useDrinksQuery() {
	const queryClient = useQueryClient()

	return useQuery({
		queryKey: DRINKS_QUERY_KEY,
		queryFn: async () => {
			// The stamp is an optimization, never a dependency: whatever goes wrong
			// with it, fall through to fetching the library rather than failing.
			const version = await fetchLibraryVersion().catch(() => 0)
			const cachedVersion = queryClient.getQueryData<number>(
				LIBRARY_VERSION_KEY,
			)
			const cachedDrinks =
				queryClient.getQueryData<Drink[]>(DRINKS_QUERY_KEY)

			// Both halves have to be present: a persisted version with no persisted
			// drinks (evicted, cleared, quota) must fall through to a full fetch.
			if (version !== 0 && version === cachedVersion && cachedDrinks?.length) {
				return cachedDrinks
			}

			const drinks = await fetchAllDrinks()
			queryClient.setQueryData(LIBRARY_VERSION_KEY, version)
			return drinks
		},
		// A revalidation is now one cheap read, so the cache no longer has to be
		// frozen with `staleTime: Infinity` to keep costs down.
		staleTime: 5 * 60 * 1000,
		// Only this query needs to outlive collection: it's the one restored from
		// localStorage, and a shorter gcTime would drop it before it can be reused.
		gcTime: CACHE_MAX_AGE,
	})
}
