import { useQuery } from '@tanstack/react-query'
import { fetchAllDrinks } from '../api/drinks'

export function useDrinksQuery() {
  return useQuery({
    queryKey: ['drinks'],
    queryFn: fetchAllDrinks,
    staleTime: 60_000,
  })
}
