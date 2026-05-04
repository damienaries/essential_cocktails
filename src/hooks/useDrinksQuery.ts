import { useQuery } from '@tanstack/react-query'
import { fetchAllDrinks } from '../api/drinks'
import { DRINKS_STALE_TIME_MS, QUERY_GC_TIME_MS } from '../lib/queryClient'

export function useDrinksQuery() {
  return useQuery({
    queryKey: ['drinks'],
    queryFn: fetchAllDrinks,
    staleTime: DRINKS_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
  })
}
