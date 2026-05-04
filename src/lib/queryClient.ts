import { QueryClient } from '@tanstack/react-query';

/** How long inactive query data stays in memory before GC (also aligns with persist maxAge). */
export const QUERY_GC_TIME_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

/**
 * Drinks list: treat as fresh until a mutation calls `invalidateQueries({ queryKey: ['drinks'] })`.
 * Avoids refetching the full catalog on every navigation or tab focus.
 */
export const DRINKS_STALE_TIME_MS = Number.POSITIVE_INFINITY;

export function createAppQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: QUERY_GC_TIME_MS,
				// Sensible defaults; `useDrinksQuery` overrides staleTime.
				staleTime: 60_000,
				refetchOnWindowFocus: false,
			},
		},
	});
}
