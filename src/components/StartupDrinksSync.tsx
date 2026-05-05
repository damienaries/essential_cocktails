import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

/**
 * After persisted React Query state hydrates, sync drinks from Firestore once per page load.
 * Keeps staleTime: Infinity during the session (no refetch on every route), but picks up
 * catalog changes made elsewhere (production admin, another tab) on refresh.
 */
export function StartupDrinksSync() {
	const queryClient = useQueryClient()

	useEffect(() => {
		void queryClient.invalidateQueries({
			queryKey: ['drinks'],
			refetchType: 'all',
		})
	}, [queryClient])

	return null
}
